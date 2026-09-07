import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  THINKING_CARDS,
  type ThinkingCard,
} from '../content/thinkingThroughDesign';
import { BACK_ARTS, CARD_THEMES } from './thinkingCardArt';
import EditorialCardWheelStage, { EditorialCardScrollDeck } from './EditorialCardWheel';
import { stackPeekBandForCount } from './editorialCardWheelMotion';
import {
  EditorialCardBody,
  EditorialCardContent,
  EditorialCardDivider,
  EditorialCardGrid,
  EditorialCardLead,
  EditorialCardTitle,
  EditorialCardVisual,
  EditorialSectionLabel,
} from './EditorialEvidenceCard';

type ThinkingCardDeckProps = {
  activeIndex: number | null;
  onActiveIndexChange: (index: number | null) => void;
  onNavigateMoment: (href: string) => void;
};

function EvidencePanel({
  card,
  onNavigateMoment,
  titleId,
}: {
  card: ThinkingCard;
  onNavigateMoment: (href: string) => void;
  titleId: string;
}) {
  const theme = CARD_THEMES[card.artIndex];
  const BackArt = BACK_ARTS[card.artIndex];

  return (
    <div className="thinking-card-wheel-panel h-full min-h-0 overflow-hidden">
      <EditorialCardGrid>
        <EditorialCardVisual eyebrow={card.eyebrow} eyebrowColor={`${theme.ink}B8`} background={theme.back}>
          <BackArt t={theme} />
        </EditorialCardVisual>

        <EditorialCardContent className="thinking-card-wheel-panel__copy">
          <EditorialSectionLabel>Principle</EditorialSectionLabel>
          <EditorialCardTitle id={titleId}>{card.title}</EditorialCardTitle>
          <EditorialCardLead>{card.statement}</EditorialCardLead>

          <EditorialCardDivider />

          <EditorialSectionLabel>Reflection</EditorialSectionLabel>
          <EditorialCardBody>{card.reflection}</EditorialCardBody>

          <EditorialCardDivider />

          <EditorialSectionLabel>Supporting moments</EditorialSectionLabel>
          <ul className="thinking-card-wheel-panel__moments m-0 list-none space-y-0 p-0">
            {card.supportingMoments.map((moment) => (
              <li key={moment.href}>
                <a
                  href={moment.href}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateMoment(moment.href);
                  }}
                  className={[
                    'group flex items-start gap-2 rounded-lg py-2 pr-2 text-[length:var(--text-label)] leading-[1.42]',
                    'text-ink/82 underline decoration-transparent underline-offset-[5px]',
                    'transition-colors hover:bg-ink/[0.035] hover:text-ink hover:decoration-ink/30',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20 focus-visible:ring-offset-2',
                  ].join(' ')}
                >
                  <span
                    className="mt-[0.22em] shrink-0 font-eyebrow text-[length:var(--text-label)] font-normal text-ink/32 transition-colors group-hover:text-ink/65"
                    aria-hidden
                  >
                    ↗
                  </span>
                  <span className="font-medium group-hover:underline">{moment.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </EditorialCardContent>
      </EditorialCardGrid>
    </div>
  );
}

export default function ThinkingCardDeck({
  activeIndex,
  onActiveIndexChange,
  onNavigateMoment,
}: ThinkingCardDeckProps) {
  const prefersReduced = useReducedMotion();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollSession, setScrollSession] = useState(0);
  const [entryIndex, setEntryIndex] = useState(0);
  const open = activeIndex !== null;
  const momentCount = THINKING_CARDS.length;
  const clampedIndex =
    activeIndex === null ? 0 : Math.max(0, Math.min(momentCount - 1, activeIndex));
  const reducedMotion = prefersReduced ?? false;
  const useScrollDeck = !reducedMotion && momentCount > 1;

  const close = useCallback(() => onActiveIndexChange(null), [onActiveIndexChange]);

  const handleIndexChange = useCallback(
    (index: number) => onActiveIndexChange(index),
    [onActiveIndexChange],
  );

  useEffect(() => {
    if (!open) return;
    setEntryIndex(clampedIndex);
    setScrollSession((key) => key + 1);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const scrollY = window.scrollY;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    const prevBodyPosition = document.body.style.position;
    const prevBodyTop = document.body.style.top;
    const prevBodyWidth = document.body.style.width;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.position = prevBodyPosition;
      document.body.style.top = prevBodyTop;
      document.body.style.width = prevBodyWidth;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  const wheelMoments = THINKING_CARDS.map((card) => ({ id: card.id, title: card.title }));
  const wheelStyle = {
    ['--stack-peek-band' as string]: stackPeekBandForCount(momentCount),
    ['--wheel-moment-count' as string]: String(momentCount),
  };

  const renderCard = (moment: { id: string; title: string }, _i: number, titleId: string) => {
    const card = THINKING_CARDS.find((c) => c.id === moment.id);
    if (!card) return null;
    return <EvidencePanel card={card} onNavigateMoment={onNavigateMoment} titleId={titleId} />;
  };

  const deckProps = {
    moments: wheelMoments,
    activeIndex: clampedIndex,
    onActiveIndexChange: handleIndexChange,
    ariaLabel: 'Design principles in practice',
    railLabel: 'Principles',
    reducedMotion,
    showTimeline: true,
    timelineInteractive: false,
    timelineClassName: 'thinking-card-deck-rail',
    stageMaxWidthClass: 'max-w-[min(100%,52rem)]',
    stageMinHeight: 'var(--thinking-deck-stage-height)',
    panelId: 'thinking-deck-panel',
    titleIdPrefix: 'thinking-evidence-title',
    renderCard,
  } as const;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          key="thinking-deck"
          className="thinking-card-deck-overlay fixed inset-0 z-[200] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.22 }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[#FAF8F4]/72 backdrop-blur-[20px]"
          />

          <button
            type="button"
            onClick={close}
            className="thinking-card-deck-close fixed right-5 z-[210] flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-ink/50 shadow-[0_2px_12px_rgba(12,21,40,0.08)] backdrop-blur-sm transition-colors hover:bg-white hover:text-ink hover:shadow-[0_4px_16px_rgba(12,21,40,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          <div
            ref={scrollContainerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`thinking-evidence-title-${THINKING_CARDS[clampedIndex]?.id ?? 'deck'}`}
            className="thinking-card-deck-scroll relative z-10 h-full w-full overflow-y-auto overflow-x-clip overscroll-contain [-webkit-overflow-scrolling:touch]"
          >
            <div
              className="thinking-card-deck-scroll__frame mx-auto w-full max-w-[min(100%,52rem)] px-4 sm:px-6"
              style={wheelStyle}
            >
              {useScrollDeck ? (
                <EditorialCardScrollDeck
                  {...deckProps}
                  scrollContainerRef={scrollContainerRef}
                  scrollSessionKey={scrollSession}
                  initialScrollIndex={entryIndex}
                  pinnedTop="var(--wheel-pinned-top)"
                  pinnedHeight="var(--wheel-pinned-height)"
                  className="thinking-card-deck-wheel thinking-card-deck-wheel--subtle-rail"
                />
              ) : (
                <div className="thinking-card-deck-scroll__static flex min-h-[100dvh] items-center py-14">
                  <EditorialCardWheelStage
                    {...deckProps}
                    showPagination
                    layoutIdPrefix="thinking-deck"
                    className="thinking-card-deck-wheel thinking-card-deck-wheel--subtle-rail w-full"
                    stageClassName="thinking-card-deck-wheel__stage"
                    navGroupLabel="Principle navigation"
                    prevLabel="Previous principle"
                    nextLabel="Next principle"
                    paginationAriaLabel="Design principles"
                  />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
