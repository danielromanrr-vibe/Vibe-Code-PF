import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Mandala, { type ConstellationAnchor, type MandalaSystemNodeLayout } from '../Mandala';
import {
  ABOUT_INFLUENCE_CARDS,
  cardById,
  type AboutPracticeAction,
  type InfluenceDepth,
} from '../../content/aboutMandalaFacets';
import AboutOrbitNodesLayer, {
  getLockedAnchor,
  type LockedFieldAnchor,
} from './AboutOrbitNodesLayer';
import AboutRelationshipField from './AboutRelationshipField';
import InfluenceConstellationField from './InfluenceConstellationField';
import AboutInfluenceFieldNav from './AboutInfluenceFieldNav';
import { ABOUT_MANDALA_FIELD_SCALE } from './aboutFieldLayout';
import { ABOUT_FOLDERS, folderFiles, folderTitle } from './aboutFolders';
import { anchorWeight } from './aboutInfluenceConstellation';
import { edgeKey, relatedIdsForCard } from './aboutRelationshipGraph';
import { useAboutFieldGeometry } from './useAboutFieldGeometry';

type AboutMandalaExperienceProps = {
  onPracticeClick?: (action: AboutPracticeAction) => void;
};

const TRAVEL_MS = 420;

export default function AboutMandalaExperience({ onPracticeClick }: AboutMandalaExperienceProps) {
  const location = useLocation();
  const layoutsRef = useRef<readonly MandalaSystemNodeLayout[]>([]);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const liveRef = useRef<HTMLDivElement>(null);
  const hashOpenAttempts = useRef(0);
  const travelTimerRef = useRef<number | null>(null);
  const constellationAnchorsRef = useRef<readonly ConstellationAnchor[]>([]);
  const walkFromRef = useRef<string | null>(null);
  const walkIndexRef = useRef(0);

  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [depth, setDepth] = useState<InfluenceDepth>('collapsed');
  const [lockedAnchor, setLockedAnchor] = useState<LockedFieldAnchor | null>(null);
  const [previewCardId, setPreviewCardId] = useState<string | null>(null);
  const [highlightedEdgeKey, setHighlightedEdgeKey] = useState<string | null>(null);
  const [travelingEdgeKey, setTravelingEdgeKey] = useState<string | null>(null);
  const [visitedIds, setVisitedIds] = useState<Set<string>>(() => new Set());
  const [discoveredEdgeKeys, setDiscoveredEdgeKeys] = useState<Set<string>>(() => new Set());
  const [openFolderId, setOpenFolderId] = useState<string | null>(null);
  const [openFileId, setOpenFileId] = useState<string | null>(null);

  const announce = useCallback((message: string) => {
    const el = liveRef.current;
    if (!el) return;
    el.textContent = message;
  }, []);

  const [layoutTick, setLayoutTick] = useState(0);
  const [wideField, setWideField] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches,
  );
  const geometry = useAboutFieldGeometry(layoutTick);

  useEffect(() => {
    const focusId = activeCardId ?? previewCardId;
    const related = focusId ? relatedIdsForCard(focusId) : null;
    constellationAnchorsRef.current = [...geometry.positions.entries()].map(([id, pos]) => ({
      x: pos.x,
      y: pos.y,
      weight: anchorWeight(id, activeCardId, previewCardId, related),
    }));
  }, [geometry.positions, activeCardId, previewCardId]);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)');
    const onChange = () => setWideField(media.matches);
    onChange();
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const handleMandalaLayout = useCallback((nodes: readonly MandalaSystemNodeLayout[]) => {
    layoutsRef.current = nodes;
    setLayoutTick((t) => t + 1);
  }, []);

  const markDiscovered = useCallback((cardId: string) => {
    const card = cardById(cardId);
    if (!card) return;
    setDiscoveredEdgeKeys((prev) => {
      const next = new Set(prev);
      for (const rel of card.relatedInfluences) {
        next.add(edgeKey(cardId, rel.id));
      }
      return next;
    });
  }, []);

  const closeInfluence = useCallback(() => {
    setActiveCardId(null);
    setDepth('collapsed');
    setLockedAnchor(null);
    setPreviewCardId(null);
    setHighlightedEdgeKey(null);
    setTravelingEdgeKey(null);
    setOpenFolderId(null);
    setOpenFileId(null);
    window.history.replaceState(null, '', '/about');
  }, []);

  const openFolder = useCallback(
    (folderId: string) => {
      setOpenFolderId(folderId);
      setOpenFileId(null);
      setActiveCardId(folderId);
      setDepth('collapsed');
      setLockedAnchor(null);
      setPreviewCardId(null);
      setVisitedIds((prev) => new Set(prev).add(folderId));
      markDiscovered(folderId);
      window.history.replaceState(null, '', `#${folderId}`);
      announce(folderTitle(folderId));
    },
    [announce, markDiscovered],
  );

  const handleNodeActivate = useCallback(
    (card: import('../../content/aboutMandalaFacets').AboutInfluenceCard) => {
      if (openFolderId === card.id && openFileId) {
        setOpenFileId(null);
        announce(card.title);
        return;
      }
      if (openFolderId === card.id) {
        closeInfluence();
        return;
      }
      openFolder(card.id);
    },
    [announce, closeInfluence, openFileId, openFolder, openFolderId],
  );

  const handleFieldNavSelect = useCallback(
    (cardId: string) => {
      if (openFolderId === cardId && openFileId) {
        setOpenFileId(null);
        announce(folderTitle(cardId));
        return;
      }
      if (openFolderId === cardId) {
        closeInfluence();
        return;
      }
      openFolder(cardId);
    },
    [announce, closeInfluence, openFileId, openFolder, openFolderId],
  );

  const handlePreviewEnter = useCallback(
    (cardId: string) => {
      if (depth !== 'collapsed') return;
      setPreviewCardId(cardId);
    },
    [depth],
  );

  const handlePreviewLeave = useCallback((cardId: string) => {
    setPreviewCardId((current) => (current === cardId ? null : current));
    setHighlightedEdgeKey(null);
  }, []);

  const handleExplore = useCallback(
    (cardId: string) => {
      if (activeCardId !== cardId) return;
      setDepth('reflection');
      const card = cardById(cardId);
      if (card) announce(`${card.title} — reflection`);
    },
    [activeCardId, announce],
  );

  const handleStepBack = useCallback(() => {
    if (depth !== 'reflection') return;
    setDepth('annotation');
    setHighlightedEdgeKey(null);
    const card = activeCardId ? cardById(activeCardId) : null;
    if (card) announce(`${card.title} — annotation`);
  }, [activeCardId, announce, depth]);

  const handleRelatedHover = useCallback(
    (fromCardId: string, toCardId: string | null) => {
      if (depth !== 'reflection' || activeCardId !== fromCardId) {
        return;
      }
      if (!toCardId) {
        setHighlightedEdgeKey(null);
        return;
      }
      setHighlightedEdgeKey(edgeKey(fromCardId, toCardId));
    },
    [activeCardId, depth],
  );

  const handleRelated = useCallback(
    (cardId: string) => {
      if (!activeCardId || travelingEdgeKey) return;
      const key = edgeKey(activeCardId, cardId);
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setDiscoveredEdgeKeys((prev) => new Set(prev).add(key));
      announce(`Following connection to ${folderTitle(cardId)}`);
      if (reduceMotion) {
        openFolder(cardId);
        return;
      }
      setTravelingEdgeKey(key);

      if (travelTimerRef.current) window.clearTimeout(travelTimerRef.current);
      travelTimerRef.current = window.setTimeout(() => {
        openFolder(cardId);
        setTravelingEdgeKey(key);
        window.setTimeout(() => setTravelingEdgeKey(null), 280);
      }, TRAVEL_MS);
    },
    [activeCardId, announce, openFolder, travelingEdgeKey],
  );

  useEffect(() => {
    return () => {
      if (travelTimerRef.current) window.clearTimeout(travelTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (!hash) {
      hashOpenAttempts.current = 0;
      return;
    }
    if (!cardById(hash)) return;

    const tryOpenFromHash = () => {
      if (folderFiles(hash).length === 0) return;
      const anchor = getLockedAnchor(layoutsRef.current, hash);
      if (!anchor && cardById(hash) && hashOpenAttempts.current < 12) {
        hashOpenAttempts.current += 1;
        requestAnimationFrame(tryOpenFromHash);
        return;
      }
      hashOpenAttempts.current = 0;
      setOpenFolderId(hash);
      setOpenFileId(null);
      setActiveCardId(hash);
      setDepth('collapsed');
      setLockedAnchor(anchor);
      setVisitedIds((prev) => new Set(prev).add(hash));
      markDiscovered(hash);
    };

    tryOpenFromHash();
  }, [location.hash, markDiscovered]);

  useEffect(() => {
    if (!openFolderId && depth === 'collapsed') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.preventDefault();
      if (openFileId) {
        setOpenFileId(null);
        if (openFolderId) announce(folderTitle(openFolderId));
        return;
      }
      closeInfluence();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [announce, closeInfluence, depth, openFileId, openFolderId]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      const target = e.target as HTMLElement | null;
      if (!target?.closest('.about-mandala-experience, [data-about-influence-node], [data-about-aside-node], .about-folder-bloom, .about-influence-list')) return;
      if (target.closest('input, textarea, select')) return;
      const current = activeCardId ?? previewCardId;
      if (!current) {
        const first = ABOUT_INFLUENCE_CARDS[0];
        if (!first) return;
        e.preventDefault();
        setPreviewCardId(first.id);
        return;
      }
      const related = [...relatedIdsForCard(current)];
      if (related.length === 0) return;
      e.preventDefault();
      const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1;
      if (walkFromRef.current !== current) {
        walkFromRef.current = current;
        walkIndexRef.current = dir > 0 ? -1 : 0;
      }
      walkIndexRef.current = (walkIndexRef.current + dir + related.length) % related.length;
      const nextId = related[walkIndexRef.current];
      if (!nextId) return;
      if (openFolderId) {
        handleRelated(nextId);
        return;
      }
      setPreviewCardId(nextId);
      document
        .querySelector<HTMLButtonElement>(`[data-about-influence-node="${nextId}"] button`)
        ?.focus();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [activeCardId, handleRelated, openFolderId, previewCardId]);

  useEffect(() => {
    if (!openFolderId && depth === 'collapsed') return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest('.top-nav-strip, [data-about-influence-node], [data-about-aside-node], .about-folder-bloom, .about-influence-list')) return;
      closeInfluence();
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [closeInfluence, depth, openFolderId]);

  useEffect(() => {
    if (depth === 'collapsed') {
      const el = returnFocusRef.current;
      if (el) {
        el.focus();
        returnFocusRef.current = null;
      }
      return;
    }

    const timer = window.setTimeout(() => {
      const shell = document.querySelector(`[data-about-influence-node="${activeCardId}"]`);
      const closeBtn = shell?.querySelector('.about-influence-node__close') as HTMLButtonElement | null;
      closeBtn?.focus();
    }, 120);

    return () => window.clearTimeout(timer);
  }, [activeCardId, depth]);

  return (
    <section className="about-mandala-experience" aria-label="Influences">
      <div ref={liveRef} className="sr-only" aria-live="polite" aria-atomic="true" />
      <AboutInfluenceFieldNav onSelect={handleFieldNavSelect} />

      <ul className="about-influence-list">
        {ABOUT_FOLDERS.map((folder) => {
          const isActive = openFolderId === folder.id;
          const files = folderFiles(folder.id);
          const openFile = files.find((file) => file.id === openFileId);
          return (
            <li key={folder.id}>
              <button
                type="button"
                className="about-influence-list__node"
                aria-expanded={isActive}
                onClick={() => handleFieldNavSelect(folder.id)}
              >
                <span>{folder.title}</span>
                <span>{folder.teaser}</span>
              </button>
              {isActive ? (
                <div className="about-influence-list__panel">
                  <ul>
                    {files.map((file) => (
                      <li key={file.id}>
                        <button type="button" onClick={() => {
                          if (file.kind === 'alias' && file.aliasId) {
                            openFolder(file.aliasId);
                            return;
                          }
                          setOpenFileId(file.id);
                        }}>
                          {file.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                  {openFile && openFile.kind !== 'alias' ? (
                    <>
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
                    </>
                  ) : null}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>

      {wideField ? (
      <div className="about-mandala-experience__discover">
        <div className="about-mandala-experience__playground-wrap">
          <div id="about-mandala-stage" className="about-mandala-experience__playground">
            <div id="mandala-about-center" className="about-mandala-experience__anchor" aria-hidden />

            <Mandala
              variant="heroIntegrated"
              anchorId="mandala-about-center"
              interactionProfile="explore"
              rotationPace={0.25}
              fieldScale={ABOUT_MANDALA_FIELD_SCALE}
              onSystemNodeLayout={handleMandalaLayout}
              constellationAnchorsRef={constellationAnchorsRef}
              canvasLayerZIndex={12}
            />

            <InfluenceConstellationField
              geometry={geometry}
              fieldTimeSec={geometry.fieldTimeSec}
              activeCardId={activeCardId}
              previewCardId={previewCardId}
              depth={depth}
            />

            <AboutRelationshipField
              geometry={geometry}
              previewCardId={previewCardId}
              activeCardId={activeCardId}
              depth={depth}
              highlightedEdgeKey={highlightedEdgeKey}
              travelingEdgeKey={travelingEdgeKey}
              visitedIds={visitedIds}
              discoveredEdgeKeys={discoveredEdgeKeys}
            />

            <AboutOrbitNodesLayer
              geometry={geometry}
              layoutsRef={layoutsRef}
              activeCardId={activeCardId}
              previewCardId={previewCardId}
              depth={depth}
              lockedAnchor={lockedAnchor}
              visitedIds={visitedIds}
              onNodeActivate={handleNodeActivate}
              onPreviewEnter={handlePreviewEnter}
              onPreviewLeave={handlePreviewLeave}
              onClose={closeInfluence}
              onExplore={handleExplore}
              onStepBack={handleStepBack}
              onRelated={handleRelated}
              onRelatedHover={handleRelatedHover}
              onPracticeClick={onPracticeClick}
              openFolderId={openFolderId}
              openFileId={openFileId}
              onOpenFile={setOpenFileId}
              onOpenAlias={openFolder}
              onCloseFile={() => setOpenFileId(null)}
              onAsideActivate={handleFieldNavSelect}
              returnFocusRef={returnFocusRef}
            />

            <p className="about-mandala-experience__diagram-key m-0 font-eyebrow text-[length:var(--text-slab-eyebrow)] uppercase tracking-[var(--tracking-eyebrow)] text-[var(--about-muted)]">
              <span className="block text-ink/55">Six influences</span>
              <span className="mt-0.5 block text-[var(--about-muted)]">A living field</span>
            </p>
          </div>
        </div>
      </div>
      ) : null}
    </section>
  );
}
