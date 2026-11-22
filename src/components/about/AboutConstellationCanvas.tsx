import { useEffect, useRef, type MutableRefObject, type RefObject } from 'react';
import type { ConstellationAnchor, MandalaFieldSnapshot } from '../Mandala';
import {
  addBannerRipple,
  createBannerFieldState,
  drawBannerField,
  type BannerCore,
  type BannerFolderAnchor,
} from './aboutBannerField';

export type Rgb = readonly [number, number, number];

/** One mineral accent per desktop folder, drawn from the hero network palette. */
export const ABOUT_FOLDER_ACCENTS: Record<string, Rgb> = {
  daniel: [61, 78, 216],
  influences: [128, 88, 68],
  explorer: [52, 122, 118],
  strengths: [108, 68, 98],
  likes: [118, 98, 58],
  principles: [42, 88, 132],
};

/** z-index of the sprite engine canvas, which is portaled to the body; folders sit above it. */
export const ABOUT_CORE_CANVAS_Z = 2;
/** While the core is held it lifts above folders and the dock, still under the Finder window. */
export const ABOUT_CORE_CANVAS_Z_HELD = 95;

const DEFAULT_ACCENT: Rgb = [61, 78, 216];
const INK: Rgb = [12, 21, 40];
export function accentFor(id: string): Rgb {
  return ABOUT_FOLDER_ACCENTS[id] ?? DEFAULT_ACCENT;
}

function rgba(rgb: Rgb, alpha: number) {
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
}

type Node = { id: string; x: number; y: number };
type AboutConstellationCanvasProps = {
  surfaceRef: RefObject<HTMLDivElement | null>;
  /** Taller element sharing the surface's top-left; the field and the core both extend to its bottom. */
  extentRef?: RefObject<HTMLElement | null>;
  folderRefs: MutableRefObject<Map<string, HTMLButtonElement>>;
  folderIds: readonly string[];
  hoverIdRef: MutableRefObject<string | null>;
  draggingIdRef: MutableRefObject<string | null>;
  /** Folder centres in viewport space, read by the sprite engine to pull its ambient marks. */
  coreAnchorsRef: MutableRefObject<ConstellationAnchor[]>;
  /** The sprite engine's live core, in viewport space; the field moves and links around it. */
  coreSnapshotRef?: MutableRefObject<MandalaFieldSnapshot | null>;
  free: boolean;
  reduceMotion: boolean;
  /** The sprite engine draws the core; otherwise a still stand-in is drawn here. */
  liveCore: boolean;
  /** Changes whenever folder positions change, so static modes redraw. */
  layoutKey: string;
};

function polygon(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, sides: number, rot: number) {
  ctx.beginPath();
  for (let i = 0; i <= sides; i++) {
    const a = rot + (i / sides) * Math.PI * 2 - Math.PI / 2;
    const px = x + Math.cos(a) * r;
    const py = y + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
}

function drawStillCore(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  const ultramarine: Rgb = [61, 78, 216];
  const ochre: Rgb = [176, 132, 52];
  ctx.setLineDash([2, 5]);
  ctx.strokeStyle = rgba(INK, 0.28);
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.arc(x, y, r * 1.22, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  polygon(ctx, x, y, r * 0.92, 6, 0);
  ctx.strokeStyle = rgba(ultramarine, 0.5);
  ctx.lineWidth = 1;
  ctx.stroke();
  polygon(ctx, x, y, r * 0.74, 3, 0);
  ctx.fillStyle = rgba(ochre, 0.2);
  ctx.fill();
  ctx.strokeStyle = rgba(ochre, 0.55);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
  ctx.fillStyle = rgba(ultramarine, 0.2);
  ctx.fill();
  ctx.strokeStyle = rgba(INK, 0.42);
  ctx.stroke();
}

export default function AboutConstellationCanvas({
  surfaceRef,
  extentRef,
  folderRefs,
  folderIds,
  hoverIdRef,
  draggingIdRef,
  coreAnchorsRef,
  coreSnapshotRef,
  free,
  reduceMotion,
  liveCore,
  layoutKey,
}: AboutConstellationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fieldRef = useRef(createBannerFieldState());
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const drawRef = useRef<(now: number) => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    const surface = surfaceRef.current;
    if (!canvas || !surface) return;
    const field = extentRef?.current ?? surface;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let last = 0;
    let coreCanvas: HTMLCanvasElement | null = null;
    let prevCore: { x: number; y: number } | null = null;
    let coreVel = { x: 0, y: 0 };
    let pressPeak = 0;

    const readCore = (s: DOMRect, dt: number): BannerCore | null => {
      const snap = liveCore ? coreSnapshotRef?.current : null;
      if (!snap) {
        prevCore = null;
        pressPeak = 0;
        return null;
      }
      const x = snap.x - s.left;
      const y = snap.y - s.top;
      if (prevCore && dt > 0) {
        coreVel = {
          x: coreVel.x + ((x - prevCore.x) / dt - coreVel.x) * 0.25,
          y: coreVel.y + ((y - prevCore.y) / dt - coreVel.y) * 0.25,
        };
      }
      prevCore = { x, y };
      pressPeak = Math.max(pressPeak, snap.press);
      if (pressPeak > 0.6 && snap.press < 0.35) {
        addBannerRipple(fieldRef.current, x, y);
        pressPeak = 0;
      }
      return {
        x,
        y,
        r: snap.r,
        vx: coreVel.x,
        vy: coreVel.y,
        grab: snap.grab,
        press: snap.press,
        nodes: snap.nodes.map((n) => ({ x: n.x - s.left, y: n.y - s.top })),
      };
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = surface.clientWidth;
      h = Math.max(
        surface.clientHeight,
        Math.round(field.getBoundingClientRect().bottom - surface.getBoundingClientRect().top),
      );
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const measure = (s: DOMRect): Node[] => {
      const nodes: Node[] = [];
      for (const id of folderIds) {
        const icon = folderRefs.current.get(id)?.querySelector('.about-desktop-folder__icon');
        if (!icon) continue;
        const r = icon.getBoundingClientRect();
        nodes.push({ id, x: r.left + r.width / 2 - s.left, y: r.top + r.height / 2 - s.top });
      }
      return nodes;
    };

    const clipCore = (s: DOMRect) => {
      if (!liveCore) return;
      const bottom = field.getBoundingClientRect().bottom;
      if (!coreCanvas?.isConnected) {
        coreCanvas =
          [...document.querySelectorAll<HTMLCanvasElement>('canvas[data-mandala-interactive]')].find(
            (c) => c.style.zIndex === String(ABOUT_CORE_CANVAS_Z) || c.style.zIndex === String(ABOUT_CORE_CANVAS_Z_HELD),
          ) ?? null;
      }
      if (!coreCanvas) return;
      const clip = `inset(${Math.max(0, s.top)}px ${Math.max(0, window.innerWidth - s.right)}px ${Math.max(
        0,
        window.innerHeight - bottom,
      )}px ${Math.max(0, s.left)}px)`;
      if (coreCanvas.style.clipPath !== clip) coreCanvas.style.clipPath = clip;
    };

    const draw = (now: number) => {
      const animated = free && !reduceMotion;
      const dt = animated && last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      ctx.clearRect(0, 0, w, h);
      const s = surface.getBoundingClientRect();
      clipCore(s);
      const nodes = measure(s);
      if (nodes.length === 0) return;
      const hoverId = hoverIdRef.current;
      const dragId = draggingIdRef.current;
      const pointer =
        animated && pointerRef.current
          ? { x: pointerRef.current.x - s.left, y: pointerRef.current.y - s.top }
          : null;

      const fieldState = fieldRef.current;
      coreAnchorsRef.current = [
        ...nodes.map((n) => ({
          x: n.x + s.left,
          y: n.y + s.top,
          weight: n.id === dragId || n.id === hoverId ? 3 : 1.6,
        })),
        ...(animated
          ? [...fieldState.anchorDisplay, ...fieldState.midDisplay].map((p) => ({
              x: p.x + s.left,
              y: p.y + s.top,
              weight: 0.5,
            }))
          : []),
      ];

      const folders: BannerFolderAnchor[] = nodes.map((n) => ({
        x: n.x,
        y: n.y,
        rgb: accentFor(n.id),
        active: n.id === hoverId || n.id === dragId,
      }));
      drawBannerField(ctx, fieldRef.current, {
        w,
        h,
        dt,
        pointer,
        folders,
        dragIndex: nodes.findIndex((n) => n.id === dragId),
        eco: !free || reduceMotion,
        core: animated ? readCore(s, dt) : null,
      });

      ctx.globalAlpha = 1;
      nodes.forEach((n) => {
        const active = n.id === hoverId || n.id === dragId;
        const rgb = accentFor(n.id);
        const glowR = active ? 66 : 54;
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR);
        g.addColorStop(0, rgba(rgb, active ? 0.3 : 0.16));
        g.addColorStop(1, rgba(rgb, 0));
        ctx.fillStyle = g;
        ctx.fillRect(n.x - glowR, n.y - glowR, glowR * 2, glowR * 2);
      });

      if (free && !liveCore) {
        const sh = surface.clientHeight;
        drawStillCore(ctx, w / 2, sh / 2, Math.min(52, Math.max(30, Math.min(w, sh) * 0.06)));
      }
    };

    drawRef.current = draw;
    resize();

    const animated = free && !reduceMotion;
    let raf = 0;
    let visible = true;
    const loop = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!animated || raf || !visible || document.hidden) return;
      last = 0;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const ro = new ResizeObserver(() => {
      resize();
      if (!animated) draw(performance.now());
    });
    ro.observe(surface);
    if (field !== surface) ro.observe(field);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(field);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);

    const onPointerMove = (event: PointerEvent) => {
      pointerRef.current = { x: event.clientX, y: event.clientY };
    };
    const onPointerLeave = () => {
      pointerRef.current = null;
    };
    const onPointerDown = (event: PointerEvent) => {
      if (event.target !== surface && event.target !== field) return;
      const s = surface.getBoundingClientRect();
      addBannerRipple(fieldRef.current, event.clientX - s.left, event.clientY - s.top);
    };
    const onScroll = () => clipCore(surface.getBoundingClientRect());
    if (animated) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', onPointerLeave);
      field.addEventListener('pointerdown', onPointerDown);
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    let timeout = 0;
    if (animated) start();
    else timeout = window.setTimeout(() => draw(performance.now()), 500);

    return () => {
      stop();
      window.clearTimeout(timeout);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      field.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('scroll', onScroll);
    };
  }, [coreAnchorsRef, coreSnapshotRef, draggingIdRef, extentRef, folderIds, folderRefs, free, hoverIdRef, liveCore, reduceMotion, surfaceRef]);

  useEffect(() => {
    if (free && !reduceMotion) return;
    const id = requestAnimationFrame((now) => drawRef.current(now));
    return () => cancelAnimationFrame(id);
  }, [free, layoutKey, reduceMotion]);

  return <canvas ref={canvasRef} className="about-constellation-canvas" aria-hidden />;
}
