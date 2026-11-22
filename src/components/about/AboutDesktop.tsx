import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Maximize2, Minimize2, X } from 'lucide-react';
import type { AboutPracticeAction } from '../../content/aboutMandalaFacets';
import { asides } from '../../content/about';
import {
  INFLUENCES_FOLDER_ID,
  PROFILE_FOLDER_ID,
  folderFiles,
  folderTitle,
  parentFolderId,
  type AboutFolderFile,
} from './aboutFolders';
import AboutConstellationCanvas, {
  ABOUT_CORE_CANVAS_Z,
  ABOUT_CORE_CANVAS_Z_HELD,
  ABOUT_FOLDER_ACCENTS,
} from './AboutConstellationCanvas';
import Mandala, { type ConstellationAnchor, type MandalaFieldSnapshot } from '../Mandala';
import AboutSpriteDock from './AboutSpriteDock';
import { MANDALA_SPRITE_IDS, type MandalaSpriteId } from '../../lib/mandalaSprite';

type AboutDesktopProps = {
  /** Page wrapper the background field fills, so it runs on behind the footer. Defaults to the desktop itself. */
  fieldRef?: RefObject<HTMLElement | null>;
  onPracticeClick?: (action: AboutPracticeAction) => void;
};

type Point = { x: number; y: number };
type Corner = 'nw' | 'ne' | 'sw' | 'se';

const CORNERS: readonly Corner[] = ['nw', 'ne', 'sw', 'se'];
const WINDOW_MIN_W = 340;
const WINDOW_MIN_H = 240;

const DESKTOP_FOLDERS = [PROFILE_FOLDER_ID, INFLUENCES_FOLDER_ID, ...asides.map((aside) => aside.id)].map(
  (id) => ({ id, title: folderTitle(id) }),
);
const DESKTOP_FOLDER_IDS = DESKTOP_FOLDERS.map((folder) => folder.id);
const CORE_ANCHOR_ID = 'mandala-about-desktop-core';
/** Pinned skins size to Paloma's coin only when fieldScale < 1; at 1+ they scale up with the field. */
const CORE_FIELD_SCALE = 0.95;

/** Folder centers as fractions of the desktop, so the layout survives a resize. */
const DEFAULT_LAYOUT: Record<string, Point> = {
  daniel: { x: 0.12, y: 0.21 },
  explorer: { x: 0.46, y: 0.15 },
  strengths: { x: 0.79, y: 0.25 },
  influences: { x: 0.14, y: 0.54 },
  likes: { x: 0.66, y: 0.62 },
  principles: { x: 0.84, y: 0.52 },
};

const STORAGE_KEY = 'about-desktop-layout-v3';

function topFolderId(id: string): string {
  return parentFolderId(id) ?? id;
}
const FOLDER_W = 120;
const FOLDER_H = 112;
const DOCK_RESERVE = 72;
const DRAG_THRESHOLD = 4;
const NUDGE_PX = 16;
const ACCENT: readonly [number, number, number] = [61, 78, 216];

function readLayout(): Record<string, Point> {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? 'null') as Record<string, Point> | null;
    if (saved && typeof saved === 'object') return { ...DEFAULT_LAYOUT, ...saved };
  } catch {
    /* ignore a corrupted layout */
  }
  return DEFAULT_LAYOUT;
}

function FolderIcon({ folderId, size = 60 }: { folderId: string; size?: number }) {
  const rgb = ABOUT_FOLDER_ACCENTS[folderId] ?? ACCENT;
  const accent = (alpha: number) => `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
  return (
    <span className="about-desktop-folder__icon" style={{ width: size, height: size * 0.8 }} aria-hidden>
      <svg viewBox="0 0 72 58" width={size} height={size * 0.8}>
        <path
          d="M4 8a4 4 0 0 1 4-4h18l6 6h32a4 4 0 0 1 4 4v36a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"
          fill="rgba(214, 228, 248, 0.92)"
          stroke={accent(0.6)}
          strokeWidth="1"
        />
        <path
          d="M4 18a4 4 0 0 1 4-4h56a4 4 0 0 1 4 4v32a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"
          fill="#e9f1fc"
          stroke="rgba(12, 21, 40, 0.62)"
          strokeWidth="1.1"
        />
      </svg>
    </span>
  );
}

function FileIcon({ file }: { file: AboutFolderFile }) {
  if (file.kind === 'image' && file.src) {
    return (
      <span className="about-finder__thumb" aria-hidden>
        <img src={file.src} alt="" />
      </span>
    );
  }
  if (file.kind === 'alias' && file.aliasId) {
    return <FolderIcon folderId={file.aliasId} size={48} />;
  }
  return <span className={`about-finder__sheet about-finder__sheet--${file.kind}`} aria-hidden />;
}

export default function AboutDesktop({ fieldRef, onPracticeClick }: AboutDesktopProps) {
  const reduceMotion = useReducedMotion();
  const desktopRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const folderRefs = useRef(new Map<string, HTMLButtonElement>());
  const dragRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    moved: boolean;
  } | null>(null);
  const windowDragRef = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null);
  const suppressClickRef = useRef<string | null>(null);
  const hashHandledRef = useRef(false);
  const hoverIdRef = useRef<string | null>(null);
  const draggingIdRef = useRef<string | null>(null);
  const coreAnchorsRef = useRef<ConstellationAnchor[]>([]);
  const coreSnapshotRef = useRef<MandalaFieldSnapshot | null>(null);
  const [coreSprite, setCoreSprite] = useState<MandalaSpriteId>('euphoria');
  const [coreHeld, setCoreHeld] = useState(false);

  useEffect(() => {
    const body = document.body;
    const sync = () => setCoreHeld(body.dataset.mandalaGrabbed === 'true');
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(body, { attributes: true, attributeFilter: ['data-mandala-grabbed'] });
    return () => observer.disconnect();
  }, []);

  const cycleCoreSprite = useCallback(() => {
    setCoreSprite((id) => MANDALA_SPRITE_IDS[(MANDALA_SPRITE_IDS.indexOf(id) + 1) % MANDALA_SPRITE_IDS.length]!);
  }, []);

  const [size, setSize] = useState({ w: 0, h: 0 });
  const [wide, setWide] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches,
  );
  const [layout, setLayout] = useState<Record<string, Point>>(() =>
    typeof window === 'undefined' ? DEFAULT_LAYOUT : readLayout(),
  );
  const [stack, setStack] = useState<string[]>(() => DESKTOP_FOLDERS.map((folder) => folder.id));
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [openFolderId, setOpenFolderId] = useState<string | null>(null);
  const [openFileId, setOpenFileId] = useState<string | null>(null);
  const [windowPos, setWindowPos] = useState<Point>({ x: 0, y: 0 });
  const [windowDims, setWindowDims] = useState<{ w: number; h: number } | null>(null);
  const [maximized, setMaximized] = useState(false);
  const [manipulating, setManipulating] = useState(false);
  const resizeRef = useRef<{
    corner: Corner;
    startX: number;
    startY: number;
    rect: { x: number; y: number; w: number; h: number };
  } | null>(null);

  useLayoutEffect(() => {
    const el = desktopRef.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)');
    const onChange = () => setWide(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (draggingId) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
  }, [draggingId, layout]);

  const dockReserve = wide && !reduceMotion ? DOCK_RESERVE : 0;
  const windowSize = {
    w: Math.min(windowDims?.w ?? 600, Math.max(0, size.w - 16)),
    h: Math.min(windowDims?.h ?? 420, Math.max(0, size.h - 16 - dockReserve)),
  };

  const clampFolder = useCallback(
    (x: number, y: number): Point => {
      if (!size.w || !size.h) return { x: 0.5, y: 0.5 };
      const px = Math.min(Math.max(x, FOLDER_W / 2), size.w - FOLDER_W / 2);
      const floor = size.h - FOLDER_H / 2 - dockReserve;
      const py = Math.min(Math.max(y, FOLDER_H / 2), floor);
      return { x: px / size.w, y: py / size.h };
    },
    [dockReserve, size.h, size.w],
  );

  const clampWindow = useCallback(
    (x: number, y: number): Point => ({
      x: Math.min(Math.max(x, 8), Math.max(8, size.w - windowSize.w - 8)),
      y: Math.min(Math.max(y, 8), Math.max(8, size.h - windowSize.h - 8 - dockReserve)),
    }),
    [dockReserve, size.h, size.w, windowSize.h, windowSize.w],
  );

  const bringToFront = useCallback((id: string) => {
    setStack((prev) => (prev[prev.length - 1] === id ? prev : [...prev.filter((item) => item !== id), id]));
  }, []);

  const openFolder = useCallback(
    (id: string) => {
      const top = topFolderId(id);
      const pos = layout[top] ?? DEFAULT_LAYOUT[top] ?? { x: 0.5, y: 0.5 };
      const fx = pos.x * size.w;
      const fy = pos.y * size.h;
      if (!openFolderId) {
        const x = fx < size.w / 2 ? fx + FOLDER_W / 2 + 16 : fx - FOLDER_W / 2 - 16 - windowSize.w;
        setWindowPos(clampWindow(x, fy - windowSize.h / 2));
      }
      setOpenFolderId(id);
      setOpenFileId(null);
      bringToFront(top);
      window.history.replaceState(null, '', `#${id}`);
    },
    [bringToFront, clampWindow, layout, openFolderId, size.h, size.w, windowSize.h, windowSize.w],
  );

  const closeWindow = useCallback(() => {
    const returnTo = openFolderId ? folderRefs.current.get(topFolderId(openFolderId)) : null;
    setOpenFolderId(null);
    setOpenFileId(null);
    window.history.replaceState(null, '', '/about');
    returnTo?.focus();
  }, [openFolderId]);

  useEffect(() => {
    if (hashHandledRef.current || !size.w) return;
    hashHandledRef.current = true;
    const hash = window.location.hash.slice(1);
    if (hash && folderFiles(hash).length > 0) openFolder(hash);
  }, [openFolder, size.w]);

  useEffect(() => {
    if (!openFolderId) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (openFileId) {
        setOpenFileId(null);
        return;
      }
      const parent = parentFolderId(openFolderId);
      if (parent) {
        openFolder(parent);
        return;
      }
      closeWindow();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeWindow, openFileId, openFolder, openFolderId]);

  useEffect(() => {
    if (openFolderId) windowRef.current?.focus({ preventScroll: true });
  }, [openFolderId, openFileId]);

  const onFolderPointerDown = (id: string) => (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!wide || event.button !== 0) return;
    const pos = layout[id] ?? DEFAULT_LAYOUT[id];
    dragRef.current = {
      id,
      startX: event.clientX,
      startY: event.clientY,
      originX: pos.x * size.w,
      originY: pos.y * size.h,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onFolderPointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (!drag.moved) {
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      drag.moved = true;
      setDraggingId(drag.id);
      draggingIdRef.current = drag.id;
      bringToFront(drag.id);
    }
    setLayout((prev) => ({ ...prev, [drag.id]: clampFolder(drag.originX + dx, drag.originY + dy) }));
  };

  const onFolderPointerUp = () => {
    const drag = dragRef.current;
    dragRef.current = null;
    if (drag?.moved) suppressClickRef.current = drag.id;
    setDraggingId(null);
    draggingIdRef.current = null;
  };

  const onFolderClick = (id: string) => {
    if (suppressClickRef.current === id) {
      suppressClickRef.current = null;
      return;
    }
    if (openFolderId && topFolderId(openFolderId) === id) {
      closeWindow();
      return;
    }
    openFolder(id);
  };

  const onFolderKeyDown = (id: string) => (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (!wide) return;
    const delta: Record<string, Point> = {
      ArrowLeft: { x: -NUDGE_PX, y: 0 },
      ArrowRight: { x: NUDGE_PX, y: 0 },
      ArrowUp: { x: 0, y: -NUDGE_PX },
      ArrowDown: { x: 0, y: NUDGE_PX },
    };
    const step = delta[event.key];
    if (!step) return;
    event.preventDefault();
    const pos = layout[id] ?? DEFAULT_LAYOUT[id];
    setLayout((prev) => ({ ...prev, [id]: clampFolder(pos.x * size.w + step.x, pos.y * size.h + step.y) }));
    bringToFront(id);
  };

  const onWindowBarPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!wide || maximized || event.button !== 0) return;
    if ((event.target as HTMLElement).closest('button')) return;
    windowDragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: windowPos.x,
      originY: windowPos.y,
    };
    setManipulating(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onWindowBarPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = windowDragRef.current;
    if (!drag) return;
    setWindowPos(clampWindow(drag.originX + event.clientX - drag.startX, drag.originY + event.clientY - drag.startY));
  };

  const onWindowBarPointerUp = () => {
    windowDragRef.current = null;
    setManipulating(false);
  };

  const onResizePointerDown = (corner: Corner) => (event: ReactPointerEvent<HTMLSpanElement>) => {
    if (!wide || event.button !== 0) return;
    event.stopPropagation();
    resizeRef.current = {
      corner,
      startX: event.clientX,
      startY: event.clientY,
      rect: { x: windowPos.x, y: windowPos.y, w: windowSize.w, h: windowSize.h },
    };
    setManipulating(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onResizePointerMove = (event: ReactPointerEvent<HTMLSpanElement>) => {
    const resize = resizeRef.current;
    if (!resize) return;
    const { rect, corner } = resize;
    const dx = event.clientX - resize.startX;
    const dy = event.clientY - resize.startY;
    let { x, y, w, h } = rect;
    if (corner === 'ne' || corner === 'se') {
      w = Math.min(Math.max(rect.w + dx, WINDOW_MIN_W), size.w - 8 - rect.x);
    } else {
      const right = rect.x + rect.w;
      x = Math.min(Math.max(rect.x + dx, 8), right - WINDOW_MIN_W);
      w = right - x;
    }
    if (corner === 'sw' || corner === 'se') {
      h = Math.min(Math.max(rect.h + dy, WINDOW_MIN_H), size.h - 8 - dockReserve - rect.y);
    } else {
      const bottom = rect.y + rect.h;
      y = Math.min(Math.max(rect.y + dy, 8), bottom - WINDOW_MIN_H);
      h = bottom - y;
    }
    setWindowPos({ x, y });
    setWindowDims({ w, h });
  };

  const onResizePointerUp = () => {
    resizeRef.current = null;
    setManipulating(false);
  };

  const files = openFolderId ? folderFiles(openFolderId) : [];
  const openFile = files.find((file) => file.id === openFileId) ?? null;
  const ready = size.w > 0;
  const openTopId = openFolderId ? topFolderId(openFolderId) : null;
  const openParentId = openFolderId ? parentFolderId(openFolderId) : null;
  const windowOrigin = (() => {
    if (!openTopId) return '50% 50%';
    const pos = layout[openTopId] ?? DEFAULT_LAYOUT[openTopId];
    return `${Math.round(pos.x * size.w - windowPos.x)}px ${Math.round(pos.y * size.h - windowPos.y)}px`;
  })();

  const liveCore = wide && !reduceMotion;

  return (
    <section className="about-desktop" aria-label="About">
      <h1 className="sr-only">About</h1>
      <div ref={desktopRef} className={['about-desktop__surface', wide ? 'is-free' : 'is-grid'].join(' ')}>
        <AboutConstellationCanvas
          surfaceRef={desktopRef}
          extentRef={fieldRef}
          folderRefs={folderRefs}
          folderIds={DESKTOP_FOLDER_IDS}
          hoverIdRef={hoverIdRef}
          draggingIdRef={draggingIdRef}
          coreAnchorsRef={coreAnchorsRef}
          coreSnapshotRef={coreSnapshotRef}
          free={wide}
          reduceMotion={Boolean(reduceMotion)}
          liveCore={liveCore}
          layoutKey={`${size.w}x${size.h}:${JSON.stringify(layout)}`}
        />
        {liveCore ? (
          <>
            <div id={CORE_ANCHOR_ID} className="about-desktop__core" aria-hidden />
            <Mandala
              variant="heroIntegrated"
              anchorId={CORE_ANCHOR_ID}
              interactionProfile="euphoria"
              placementMode="default"
              rotationPace={0.25}
              fieldScale={CORE_FIELD_SCALE}
              spriteId={coreSprite}
              constellationAnchorsRef={coreAnchorsRef}
              fieldSnapshotRef={coreSnapshotRef}
              canvasLayerZIndex={coreHeld ? ABOUT_CORE_CANVAS_Z_HELD : ABOUT_CORE_CANVAS_Z}
              onMobileDoubleTap={cycleCoreSprite}
            />
          </>
        ) : null}
        <div className="about-desktop__title">
          <p className="adopt-meta-label about-desktop__eyebrow">(WIP)</p>
          <h2 className="about-desktop__heading">
            <span>I love art, design,</span>
            <span>&amp; technology</span>
          </h2>
        </div>
        {liveCore ? <AboutSpriteDock spriteId={coreSprite} onSelect={setCoreSprite} /> : null}
        {DESKTOP_FOLDERS.map((folder, index) => {
          const pos = layout[folder.id] ?? DEFAULT_LAYOUT[folder.id] ?? { x: 0.5, y: 0.5 };
          const isOpen = openTopId === folder.id;
          const style =
            wide && ready
              ? {
                  left: pos.x * size.w - FOLDER_W / 2,
                  top: pos.y * size.h - FOLDER_H / 2,
                  zIndex: ABOUT_CORE_CANVAS_Z + 1 + stack.indexOf(folder.id),
                }
              : undefined;
          return (
            <motion.button
              key={folder.id}
              ref={(el) => {
                if (el) folderRefs.current.set(folder.id, el);
                else folderRefs.current.delete(folder.id);
              }}
              type="button"
              className={[
                'about-desktop-folder',
                isOpen ? 'is-open' : '',
                draggingId === folder.id ? 'is-dragging' : '',
              ].join(' ')}
              style={style}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
              animate={ready || !wide ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.42, ease: [0.4, 0, 1, 1], delay: index * 0.03 }}
              aria-expanded={isOpen}
              aria-label={folder.title}
              onPointerDown={onFolderPointerDown(folder.id)}
              onPointerMove={onFolderPointerMove}
              onPointerUp={onFolderPointerUp}
              onPointerCancel={onFolderPointerUp}
              onClick={() => onFolderClick(folder.id)}
              onKeyDown={onFolderKeyDown(folder.id)}
              onPointerEnter={() => {
                hoverIdRef.current = folder.id;
              }}
              onPointerLeave={() => {
                if (hoverIdRef.current === folder.id) hoverIdRef.current = null;
              }}
              onFocus={() => {
                hoverIdRef.current = folder.id;
              }}
              onBlur={() => {
                if (hoverIdRef.current === folder.id) hoverIdRef.current = null;
              }}
            >
              <FolderIcon folderId={folder.id} />
              <span className="about-desktop-folder__label">{folder.title}</span>
            </motion.button>
          );
        })}

        <AnimatePresence>
          {openFolderId ? (
            <motion.div
              key="finder"
              ref={windowRef}
              tabIndex={-1}
              role="dialog"
              data-mandala-shield
              aria-label={folderTitle(openFolderId)}
              className={['about-finder', manipulating ? 'is-manipulating' : '', maximized ? 'is-maximized' : ''].join(' ')}
              style={
                wide
                  ? {
                      left: maximized ? 8 : windowPos.x,
                      top: maximized ? 8 : windowPos.y,
                      width: maximized ? size.w - 16 : windowSize.w,
                      height: maximized ? size.h - 16 - dockReserve : windowSize.h,
                      transformOrigin: windowOrigin,
                    }
                  : undefined
              }
              initial={reduceMotion ? false : { opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, scale: 0.6 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.42, ease: [0.4, 0, 1, 1] }}
            >
              <div
                className="about-finder__bar"
                onPointerDown={onWindowBarPointerDown}
                onPointerMove={onWindowBarPointerMove}
                onPointerUp={onWindowBarPointerUp}
                onPointerCancel={onWindowBarPointerUp}
                onDoubleClick={(event) => {
                  if (!wide || (event.target as HTMLElement).closest('button')) return;
                  setMaximized((value) => !value);
                }}
              >
                <div className="about-finder__lights">
                  <button
                    type="button"
                    className="about-finder__light about-finder__light--close"
                    aria-label="Close"
                    onClick={closeWindow}
                  >
                    <X aria-hidden strokeWidth={3} />
                  </button>
                  {wide ? (
                    <button
                      type="button"
                      className="about-finder__light about-finder__light--zoom"
                      aria-label={maximized ? 'Restore' : 'Maximize'}
                      aria-pressed={maximized}
                      onClick={() => setMaximized((value) => !value)}
                    >
                      {maximized ? <Minimize2 aria-hidden strokeWidth={3} /> : <Maximize2 aria-hidden strokeWidth={3} />}
                    </button>
                  ) : null}
                </div>
                {openFile || openParentId ? (
                  <button
                    type="button"
                    className="about-finder__back"
                    aria-label={openFile ? folderTitle(openFolderId) : folderTitle(openParentId!)}
                    onClick={() => (openFile ? setOpenFileId(null) : openFolder(openParentId!))}
                  >
                    ←
                  </button>
                ) : null}
                <p className="about-finder__title">{openFile ? openFile.label : folderTitle(openFolderId)}</p>
              </div>
              <div className="about-finder__body">
                <nav className="about-finder__sidebar" aria-label="Folders">
                  {DESKTOP_FOLDERS.map((folder) => (
                    <button
                      key={folder.id}
                      type="button"
                      className={folder.id === openTopId ? 'is-current' : undefined}
                      aria-current={folder.id === openTopId ? 'true' : undefined}
                      onClick={() => openFolder(folder.id)}
                    >
                      <FolderIcon folderId={folder.id} size={20} />
                      <span>{folder.title}</span>
                    </button>
                  ))}
                </nav>
                <div className="about-finder__main">
                  {openFile ? (
                    <article className="about-finder__reader">
                      {openFile.kind === 'image' && openFile.src ? (
                        <img src={openFile.src} alt={openFile.alt ?? ''} />
                      ) : null}
                      {openFile.lead ? <p className="about-finder__lead">{openFile.lead}</p> : null}
                      {openFile.body ? <p>{openFile.body}</p> : null}
                      {openFile.items ? (
                        <ul>
                          {openFile.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      ) : null}
                      {openFile.links ? (
                        <ul>
                          {openFile.links.map((link) => (
                            <li key={link.label}>
                              {link.action && onPracticeClick ? (
                                <button type="button" onClick={() => onPracticeClick(link.action!)}>
                                  {link.label}
                                </button>
                              ) : (
                                link.label
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </article>
                  ) : (
                    <div className="about-finder__files">
                      {files.map((file) => (
                        <button
                          key={file.id}
                          type="button"
                          className="about-finder__file"
                          onClick={() => {
                            if (file.kind === 'alias' && file.aliasId) {
                              openFolder(file.aliasId);
                              return;
                            }
                            setOpenFileId(file.id);
                          }}
                        >
                          <FileIcon file={file} />
                          <span>{file.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {wide && !maximized
                ? CORNERS.map((corner) => (
                    <span
                      key={corner}
                      className={`about-finder__resize about-finder__resize--${corner}`}
                      aria-hidden
                      onPointerDown={onResizePointerDown(corner)}
                      onPointerMove={onResizePointerMove}
                      onPointerUp={onResizePointerUp}
                      onPointerCancel={onResizePointerUp}
                    />
                  ))
                : null}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}
