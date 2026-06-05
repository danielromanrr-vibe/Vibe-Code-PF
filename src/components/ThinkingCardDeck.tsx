import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  THINKING_CARDS,
  type ThinkingCard,
} from '../content/thinkingThroughDesign';
import { BACK_ARTS, CARD_THEMES } from './thinkingCardArt';

/** Vertical step between stacked cards — enough to read eyebrow in top-left */
const TAB_PEEK = 38;
/** Visible height of each peek strip (art + index) */
const TAB_HEIGHT = 72;
const SPRING = { type: 'spring' as const, stiffness: 380, damping: 32 };

function tabLayerShadow(depth: number): string {
  const y = 2 + depth * 3;
  const blur = 8 + depth * 5;
  const alpha = 0.1 + depth * 0.025;
  return `0 ${y}px ${blur}px rgba(12, 21, 40, ${alpha})`;
}

type ThinkingCardDeckProps = {
  deckOrder: readonly number[];
  onDeckOrderChange: (order: number[]) => void;
  onClose: () => void;
  onNavigateMoment: (href: string) => void;
};

function EvidencePanel({
  card,
  onNavigateMoment,
}: {
  card: ThinkingCard;
  onNavigateMoment: (href: string) => void;
}) {
  const theme = CARD_THEMES[card.artIndex];
  const BackArt = BACK_ARTS[card.artIndex];

  return (
    <div className="grid min-h-0 flex-1 sm:grid-cols-[minmax(200px,240px)_1fr]">
      <div
        className="relative w-full shrink-0 overflow-hidden sm:min-h-[340px]"
        style={{ background: theme.back }}
      >
        <BackArt t={theme} />
        <span
          className="absolute left-5 top-5 font-eyebrow text-[length:var(--text-label)] font-normal uppercase tracking-[0.11em]"
          style={{ color: `${theme.ink}B8` }}
        >
          {card.eyebrow}
        </span>
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-ink/[0.06] to-transparent"
          aria-hidden
        />
      </div>

      <div className="flex min-h-0 flex-col overflow-y-auto px-7 py-8 sm:px-9 sm:py-9">
        <p className="mb-2 font-eyebrow text-[length:var(--text-label)] font-normal uppercase tracking-[0.11em] text-ink/40">
          Principle
        </p>
        <h2
          id={`thinking-evidence-title-${card.id}`}
          className="mb-3 mt-0 text-pretty font-body text-[length:var(--text-h3)] font-bold leading-[1.1] tracking-[-0.03em] text-ink text-balance"
        >
          {card.title}
        </h2>
        <p className="m-0 max-w-[42ch] text-pretty text-[length:var(--text-body)] leading-[1.48] text-ink/72">
          {card.statement}
        </p>

        <div className="my-7 h-px w-12 bg-gradient-to-r from-ink/14 to-transparent" aria-hidden />

        <p className="mb-2 font-eyebrow text-[length:var(--text-label)] font-normal uppercase tracking-[0.11em] text-ink/40">
          Reflection
        </p>
        <p className="m-0 max-w-[48ch] text-pretty text-[length:var(--text-body)] leading-[1.58] text-ink/62">
          {card.reflection}
        </p>

        <div className="my-7 h-px w-12 bg-gradient-to-r from-ink/14 to-transparent" aria-hidden />

        <p className="mb-3 font-eyebrow text-[length:var(--text-label)] font-normal uppercase tracking-[0.11em] text-ink/40">
          Supporting moments
        </p>
        <ul className="m-0 list-none space-y-0.5 p-0">
          {card.supportingMoments.map((moment) => (
            <li key={moment.href}>
              <a
                href={moment.href}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateMoment(moment.href);
                }}
                className={[
                  'group flex items-start gap-2.5 rounded-lg py-2.5 pr-3 text-[length:var(--text-body)] leading-[1.48]',
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
      </div>
    </div>
  );
}

export default function ThinkingCardDeck({
  deckOrder,
  onDeckOrderChange,
  onClose,
  onNavigateMoment,
}: ThinkingCardDeckProps) {
  const prefersReduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const open = deckOrder.length > 0;
  const frontIndex = deckOrder[0];
  const frontCard = frontIndex !== undefined ? THINKING_CARDS[frontIndex] : null;
  const behind = deckOrder.slice(1);
  const stackPeek = behind.length * TAB_PEEK;

  const bringToFront = useCallback(
    (cardIndex: number) => {
      const pos = deckOrder.indexOf(cardIndex);
      if (pos <= 0) return;
      onDeckOrderChange([cardIndex, ...deckOrder.filter((_, i) => i !== pos)]);
    },
    [deckOrder, onDeckOrderChange],
  );

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown' && behind.length > 0) {
        bringToFront(behind[0]);
      }
      if (e.key === 'ArrowUp' && behind.length > 0) {
        bringToFront(behind[behind.length - 1]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, behind, bringToFront, onClose]);

  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open, frontIndex]);

  return createPortal(
    <AnimatePresence>
      {open && frontCard && (
        <motion.div
          key="thinking-deck"
          className="fixed inset-0 z-[200] flex items-end justify-center p-4 sm:items-center sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReduced ? 0 : 0.22 }}
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default bg-[#FAF8F4]/72 backdrop-blur-[20px]"
            aria-label="Close deck"
            onClick={onClose}
          />

          <button
            type="button"
            onClick={onClose}
            className="fixed right-5 top-5 z-[210] flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-ink/50 shadow-[0_2px_12px_rgba(12,21,40,0.08)] backdrop-blur-sm transition-colors hover:bg-white hover:text-ink hover:shadow-[0_4px_16px_rgba(12,21,40,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          {/* Stack — layered peeks + front panel */}
          <div
            className="relative z-10 w-full max-w-[760px]"
            style={{
              paddingTop: stackPeek,
              filter: 'drop-shadow(0 16px 48px rgba(12, 21, 40, 0.14))',
            }}
          >
            {behind.map((cardIndex, i) => {
              const card = THINKING_CARDS[cardIndex];
              const theme = CARD_THEMES[card.artIndex];
              const BackArt = BACK_ARTS[card.artIndex];
              const depthFromFront = i + 1;

              return (
                <motion.button
                  key={card.id}
                  type="button"
                  layout={!prefersReduced}
                  initial={false}
                  animate={{ top: i * TAB_PEEK }}
                  whileHover={
                    prefersReduced
                      ? undefined
                      : { y: -3, transition: { type: 'spring', stiffness: 420, damping: 28 } }
                  }
                  transition={prefersReduced ? { duration: 0 } : SPRING}
                  className={[
                    'absolute left-0 right-0 overflow-hidden rounded-t-[18px] border-0 p-0',
                    'ring-1 ring-inset ring-white/[0.06]',
                    'transition-[box-shadow] duration-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25 focus-visible:ring-offset-2',
                  ].join(' ')}
                  style={{
                    height: TAB_HEIGHT,
                    zIndex: i + 1,
                    boxShadow: tabLayerShadow(depthFromFront),
                  }}
                  aria-label={`Bring ${card.title} to front`}
                  onClick={() => bringToFront(cardIndex)}
                >
                  <div className="absolute inset-0" style={{ background: theme.back }}>
                    <BackArt t={theme} />
                  </div>
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-black/20 to-transparent"
                    aria-hidden
                  />
                  <span
                    className="absolute left-5 top-4 z-10 font-eyebrow text-[length:var(--text-label)] font-normal uppercase tracking-[0.11em]"
                    style={{ color: `${theme.ink}CC`, textShadow: '0 1px 8px rgba(0,0,0,0.25)' }}
                  >
                    {card.eyebrow}
                  </span>
                </motion.button>
              );
            })}

            <motion.article
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`thinking-evidence-title-${frontCard.id}`}
              tabIndex={-1}
              layout={!prefersReduced}
              className={[
                'relative z-20 flex max-h-[min(86vh,740px)] w-full flex-col overflow-hidden rounded-2xl',
                'bg-[#FAF8F4] outline-none',
                'ring-1 ring-ink/[0.06]',
                'shadow-[0_4px_16px_rgba(12,21,40,0.06),0_20px_56px_rgba(12,21,40,0.14)]',
              ].join(' ')}
              initial={prefersReduced ? {} : { opacity: 0, y: 24, scale: 0.98 }}
              animate={prefersReduced ? {} : { opacity: 1, y: 0, scale: 1 }}
              exit={prefersReduced ? {} : { opacity: 0, y: 14, scale: 0.99 }}
              transition={SPRING}
            >
              <EvidencePanel card={frontCard} onNavigateMoment={onNavigateMoment} />
            </motion.article>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
