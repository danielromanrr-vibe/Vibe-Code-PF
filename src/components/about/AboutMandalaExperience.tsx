import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Mandala, { type ConstellationAnchor, type MandalaSystemNodeLayout } from '../Mandala';
import {
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

  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [depth, setDepth] = useState<InfluenceDepth>('collapsed');
  const [lockedAnchor, setLockedAnchor] = useState<LockedFieldAnchor | null>(null);
  const [previewCardId, setPreviewCardId] = useState<string | null>(null);
  const [highlightedEdgeKey, setHighlightedEdgeKey] = useState<string | null>(null);
  const [travelingEdgeKey, setTravelingEdgeKey] = useState<string | null>(null);
  const [visitedIds, setVisitedIds] = useState<Set<string>>(() => new Set());
  const [discoveredEdgeKeys, setDiscoveredEdgeKeys] = useState<Set<string>>(() => new Set());

  const announce = useCallback((message: string) => {
    const el = liveRef.current;
    if (!el) return;
    el.textContent = message;
  }, []);

  const [layoutTick, setLayoutTick] = useState(0);
  const geometry = useAboutFieldGeometry(layoutsRef, layoutTick);

  useEffect(() => {
    const focusId = activeCardId ?? previewCardId;
    const related = focusId ? relatedIdsForCard(focusId) : null;
    constellationAnchorsRef.current = [...geometry.positions.entries()].map(([id, pos]) => ({
      x: pos.x,
      y: pos.y,
      weight: anchorWeight(id, activeCardId, previewCardId, related),
    }));
  }, [geometry.positions, activeCardId, previewCardId]);

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
    window.history.replaceState(null, '', '/about');
  }, []);

  const openInfluence = useCallback(
    (cardId: string, atDepth: InfluenceDepth = 'annotation', focusEl?: HTMLElement | null) => {
      const anchor = getLockedAnchor(layoutsRef.current, cardId);
      const card = cardById(cardId);
      if (!anchor || !card) return;
      if (focusEl) returnFocusRef.current = focusEl;
      setActiveCardId(cardId);
      setDepth(atDepth);
      setLockedAnchor(anchor);
      setPreviewCardId(null);
      setVisitedIds((prev) => new Set(prev).add(cardId));
      markDiscovered(cardId);
      window.history.replaceState(null, '', `#${cardId}`);
      announce(card.title);
    },
    [announce, markDiscovered],
  );

  const handleNodeActivate = useCallback(
    (card: import('../../content/aboutMandalaFacets').AboutInfluenceCard, trigger: HTMLButtonElement) => {
      if (activeCardId === card.id && depth === 'annotation') {
        closeInfluence();
        return;
      }
      openInfluence(card.id, 'annotation', trigger);
    },
    [activeCardId, closeInfluence, depth, openInfluence],
  );

  const handleFieldNavSelect = useCallback(
    (cardId: string, trigger: HTMLButtonElement) => {
      if (activeCardId === cardId && depth !== 'collapsed') {
        closeInfluence();
        return;
      }
      openInfluence(cardId, 'annotation', trigger);
    },
    [activeCardId, closeInfluence, depth, openInfluence],
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
      const targetDepth: InfluenceDepth = depth === 'reflection' ? 'reflection' : 'annotation';
      setTravelingEdgeKey(key);
      setDiscoveredEdgeKeys((prev) => new Set(prev).add(key));
      announce(`Following connection to ${cardById(cardId)?.title ?? cardId}`);

      if (travelTimerRef.current) window.clearTimeout(travelTimerRef.current);
      travelTimerRef.current = window.setTimeout(() => {
        openInfluence(cardId, targetDepth);
        setTravelingEdgeKey(key);
        window.setTimeout(() => setTravelingEdgeKey(null), 280);
      }, TRAVEL_MS);
    },
    [activeCardId, announce, depth, openInfluence, travelingEdgeKey],
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
      const anchor = getLockedAnchor(layoutsRef.current, hash);
      if (!anchor) {
        if (hashOpenAttempts.current < 90) {
          hashOpenAttempts.current += 1;
          requestAnimationFrame(tryOpenFromHash);
        }
        return;
      }
      hashOpenAttempts.current = 0;
      setActiveCardId(hash);
      setDepth('annotation');
      setLockedAnchor(anchor);
      setVisitedIds((prev) => new Set(prev).add(hash));
      markDiscovered(hash);
    };

    tryOpenFromHash();
  }, [location.hash, markDiscovered]);

  useEffect(() => {
    if (depth === 'collapsed') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.preventDefault();
      if (depth === 'reflection') {
        handleStepBack();
        return;
      }
      closeInfluence();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [closeInfluence, depth, handleStepBack]);

  useEffect(() => {
    if (depth === 'collapsed') return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest('[data-about-influence-node]')) return;
      closeInfluence();
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [closeInfluence, depth]);

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
    <section className="about-mandala-experience" aria-labelledby="about-mandala-heading">
      <div ref={liveRef} className="sr-only" aria-live="polite" aria-atomic="true" />
      <AboutInfluenceFieldNav onSelect={handleFieldNavSelect} />

      <header className="about-mandala-experience__header editorial-container">
        <h1 id="about-mandala-heading" className="mb-3 md:mb-4">
          What shaped
          <br />
          my perspective
        </h1>
        <p className="editorial-body about-mandala-experience__lede m-0 max-w-measure text-[var(--about-secondary)]">
          A map of the forces that still shape how I see problems, people, and systems.
        </p>
      </header>

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
              returnFocusRef={returnFocusRef}
            />

            <p className="about-mandala-experience__diagram-key m-0 font-eyebrow text-[length:var(--text-slab-eyebrow)] uppercase tracking-[var(--tracking-eyebrow)] text-[var(--about-muted)]">
              <span className="block text-ink/55">Six influences</span>
              <span className="mt-0.5 block text-[var(--about-muted)]">A living field</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
