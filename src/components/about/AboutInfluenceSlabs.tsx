import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  ABOUT_INFLUENCE_CARDS,
  cardById,
  type AboutPracticeAction,
  type InfluenceDepth,
} from '../../content/aboutMandalaFacets';
import AboutInfluenceFieldNav from './AboutInfluenceFieldNav';
import AboutInfluenceSlab from './AboutInfluenceSlab';
import AboutInfluenceSlabReveal from './AboutInfluenceSlabReveal';

const PRACTICE_STORAGE_KEY = 'pf-open-practice';

type AboutInfluenceSlabsProps = {
  onPracticeClick?: (action: AboutPracticeAction) => void;
};

export default function AboutInfluenceSlabs({ onPracticeClick }: AboutInfluenceSlabsProps) {
  const location = useLocation();
  const liveRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [depth, setDepth] = useState<InfluenceDepth>('collapsed');
  const [visitedIds, setVisitedIds] = useState<Set<string>>(() => new Set());

  const announce = useCallback((message: string) => {
    const el = liveRef.current;
    if (!el) return;
    el.textContent = message;
  }, []);

  const closeInfluence = useCallback(() => {
    setActiveCardId(null);
    setDepth('collapsed');
    window.history.replaceState(null, '', '/about');
    const el = returnFocusRef.current;
    if (el) {
      el.focus();
      returnFocusRef.current = null;
    }
  }, []);

  const openInfluence = useCallback(
    (cardId: string, atDepth: InfluenceDepth = 'annotation', focusEl?: HTMLElement | null) => {
      const card = cardById(cardId);
      if (!card) return;
      if (focusEl) returnFocusRef.current = focusEl;
      setActiveCardId(cardId);
      setDepth(atDepth);
      setVisitedIds((prev) => new Set(prev).add(cardId));
      window.history.replaceState(null, '', `#${cardId}`);
      announce(card.title);
    },
    [announce],
  );

  const handleSlabOpen = useCallback(
    (cardId: string, trigger: HTMLElement) => {
      if (activeCardId === cardId && depth === 'annotation') {
        closeInfluence();
        return;
      }
      openInfluence(cardId, 'annotation', trigger);
    },
    [activeCardId, closeInfluence, depth, openInfluence],
  );

  const handleExplore = useCallback(() => {
    if (!activeCardId) return;
    setDepth('reflection');
    const card = cardById(activeCardId);
    if (card) announce(`${card.title} — reflection`);
  }, [activeCardId, announce]);

  const handleStepBack = useCallback(() => {
    if (depth !== 'reflection' || !activeCardId) return;
    setDepth('annotation');
    const card = cardById(activeCardId);
    if (card) announce(`${card.title} — annotation`);
  }, [activeCardId, announce, depth]);

  const handleRelated = useCallback(
    (cardId: string) => {
      if (!activeCardId) return;
      const targetDepth: InfluenceDepth = depth === 'reflection' ? 'reflection' : 'annotation';
      openInfluence(cardId, targetDepth);
    },
    [activeCardId, depth, openInfluence],
  );

  const handleFieldNavSelect = useCallback(
    (cardId: string, trigger: HTMLButtonElement) => {
      if (activeCardId === cardId && depth !== 'collapsed') {
        closeInfluence();
        return;
      }
      openInfluence(cardId, 'annotation', trigger);
      document.getElementById(`about-slab-${cardId}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    },
    [activeCardId, closeInfluence, depth, openInfluence],
  );

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (!hash || !cardById(hash)) return;
    setActiveCardId(hash);
    setDepth('annotation');
    setVisitedIds((prev) => new Set(prev).add(hash));
    requestAnimationFrame(() => {
      document.getElementById(`about-slab-${hash}`)?.scrollIntoView({ behavior: 'auto', block: 'nearest' });
    });
  }, [location.hash]);

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

  const handlePractice = useCallback(
    (action: AboutPracticeAction) => {
      onPracticeClick?.(action);
    },
    [onPracticeClick],
  );

  return (
    <section className="about-influence-slabs-section" aria-labelledby="about-influence-heading">
      <div ref={liveRef} className="sr-only" aria-live="polite" aria-atomic="true" />
      <AboutInfluenceFieldNav onSelect={handleFieldNavSelect} />

      <header className="about-influence-slabs-section__header about-influence-slabs-section__header--editorial">
        <p className="mb-3 font-eyebrow text-[length:var(--text-label)] uppercase tracking-[0.11em] text-ink/42">
          Six influences
        </p>
        <h2 id="about-influence-heading" className="mb-3 md:mb-4">
          What shaped
          <br />
          my perspective
        </h2>
        <p className="editorial-body about-influence-slabs-section__lede m-0 max-w-measure text-ink/68">
          A map of the forces that still shape how I see problems, people, and systems.
        </p>
      </header>

      <div className="about-influence-slabs about-influence-slabs--editorial">
        {ABOUT_INFLUENCE_CARDS.map((card, index) => {
          const isActive = activeCardId === card.id;
          const isDimmed = activeCardId !== null && !isActive;
          return (
            <AboutInfluenceSlabReveal
              key={card.id}
              index={index}
              id={`about-slab-${card.id}`}
              className={`about-influence-slabs__cell about-influence-slabs__cell--${index}`}
            >
              <AboutInfluenceSlab
                card={card}
                index={index}
                depth={isActive ? depth : 'collapsed'}
                isActive={isActive}
                isDimmed={isDimmed}
                isVisited={visitedIds.has(card.id)}
                onOpen={(trigger) => handleSlabOpen(card.id, trigger)}
                onClose={closeInfluence}
                onExplore={handleExplore}
                onStepBack={handleStepBack}
                onRelated={handleRelated}
                onPracticeClick={handlePractice}
              />
            </AboutInfluenceSlabReveal>
          );
        })}
      </div>
    </section>
  );
}

export { PRACTICE_STORAGE_KEY };
