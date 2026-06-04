import { useCallback, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  CARD_PRACTICE_CTA,
  THINKING_CARDS,
  THINKING_SECTION_HEADING,
  THINKING_SECTION_INTRO,
  navigateThinkingMomentHref,
  type ThinkingCard,
  type ThinkingNavigateHandlers,
} from '../content/thinkingThroughDesign';
import ThinkingCardDeck from './ThinkingCardDeck';
import { BACK_ARTS, CARD_THEMES, FRONT_ARTS } from './thinkingCardArt';

/** Peels end cards outward so top-left indices stay visible in the fan */
const FAN_SPREAD_X = [-10, -4, 0, 4, 10] as const;

function makeDeckOrder(frontIndex: number): number[] {
  return [
    frontIndex,
    ...THINKING_CARDS.map((_, i) => i).filter((i) => i !== frontIndex),
  ];
}

export type ThinkingThroughDesignActions = ThinkingNavigateHandlers;

// ─── Motion variants ──────────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

function makeItemVariants(prefersReduced: boolean) {
  return {
    hidden: (card: ThinkingCard) => ({
      y: prefersReduced ? 0 : 110,
      opacity: 0,
      rotate: prefersReduced ? 0 : card.rotate + 10,
    }),
    visible: (card: ThinkingCard) => ({
      y: prefersReduced ? 0 : card.yOffset,
      opacity: 1,
      rotate: prefersReduced ? 0 : card.rotate,
      transition: { type: 'spring' as const, stiffness: 180, damping: 22 },
    }),
  };
}

// ─── Single card ──────────────────────────────────────────────────────────────

function ThinkingCardItem({
  card,
  index,
  itemVariants,
  prefersReduced,
  alwaysReveal,
  onSelect,
}: {
  card: ThinkingCard;
  index: number;
  itemVariants: ReturnType<typeof makeItemVariants>;
  prefersReduced: boolean | null;
  alwaysReveal: boolean;
  onSelect: (card: ThinkingCard) => void;
}) {
  const [flipped, setFlipped] = useState(alwaysReveal);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (alwaysReveal) setFlipped(true);
  }, [alwaysReveal]);

  const artIndex = card.artIndex;
  const theme = CARD_THEMES[artIndex] ?? CARD_THEMES[0];
  const BackArt = BACK_ARTS[artIndex];
  const FrontArt = FRONT_ARTS[artIndex];

  const openEvidence = () => onSelect(card);

  // Spring config — fast response, no floatiness
  const SPRING = { type: 'spring' as const, stiffness: 380, damping: 24, mass: 0.8 };

  const hoverAnim = prefersReduced
    ? undefined
    : {
        scale: 1.06,
        y: card.yOffset - 24,
        rotate: card.rotate * 0.35,
        filter: 'drop-shadow(0px 22px 36px rgba(12,21,40,0.46))',
        transition: SPRING,
      };

  // Two-phase half-flip: back rotates away first, then front rotates in.
  // Avoids preserve-3d / backface-visibility entirely — works regardless of
  // ancestor opacity (which breaks 3D stacking contexts during scroll reveal).
  const backAnim = prefersReduced
    ? { rotateY: flipped ? -90 : 0, opacity: flipped ? 0 : 1 }
    : { rotateY: flipped ? -90 : 0, opacity: flipped ? 0 : 1 };

  const backTransition = prefersReduced
    ? { duration: 0 }
    : flipped
      ? { rotateY: { duration: 0.22, ease: 'easeIn' as const }, opacity: { duration: 0.18, ease: 'easeIn' as const } }
      : { rotateY: { duration: 0.22, ease: 'easeOut' as const, delay: 0.18 }, opacity: { duration: 0.12, ease: 'easeOut' as const, delay: 0.18 } };

  const frontAnim = prefersReduced
    ? { rotateY: flipped ? 0 : 90, opacity: flipped ? 1 : 0 }
    : { rotateY: flipped ? 0 : 90, opacity: flipped ? 1 : 0 };

  const frontTransition = prefersReduced
    ? { duration: 0 }
    : flipped
      ? { rotateY: { duration: 0.22, ease: 'easeOut' as const, delay: 0.18 }, opacity: { duration: 0.12, ease: 'easeOut' as const, delay: 0.18 } }
      : { rotateY: { duration: 0.22, ease: 'easeIn' as const }, opacity: { duration: 0.18, ease: 'easeIn' as const } };

  return (
    <motion.article
      custom={card}
      variants={itemVariants}
      className={[
        'relative flex-shrink-0',
        'w-full md:w-[180px] lg:w-[210px]',
        'h-[240px] md:h-[280px] lg:h-[308px]',
        index > 0 ? 'md:-ml-8 lg:-ml-11' : '',
      ].join(' ')}
      style={{
        zIndex: hovered ? card.zIndex + 10 : card.zIndex,
        transformOrigin: 'bottom center',
        filter: 'drop-shadow(0px 6px 16px rgba(12,21,40,0.22))',
        x: FAN_SPREAD_X[index] ?? 0,
      }}
      whileHover={hoverAnim}
      onMouseEnter={() => {
        setHovered(true);
        if (!alwaysReveal) setFlipped(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
        if (!alwaysReveal) setFlipped(false);
      }}
    >
      {/* Shared perspective container */}
      <div className="relative h-full w-full" style={{ perspective: '900px' }}>

        {/* ── BACK FACE — artwork + index only ── */}
        <motion.button
          type="button"
          aria-label={`Inspect card ${card.eyebrow}: ${card.title}`}
          animate={backAnim}
          transition={backTransition}
          className={[
            'absolute inset-0 cursor-pointer overflow-hidden rounded-2xl border-0 p-0',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2',
          ].join(' ')}
          tabIndex={flipped ? -1 : 0}
          onClick={openEvidence}
          onFocus={() => { if (!alwaysReveal) setFlipped(true); }}
          onBlur={() => { if (!alwaysReveal) setFlipped(false); }}
        >
          <div className="absolute inset-0">
            {BackArt && <BackArt t={theme} />}
          </div>
          <span
            className="absolute left-4 top-4 z-10 font-eyebrow text-[10px] font-semibold uppercase tracking-[0.13em]"
            style={{ color: `${theme.ink}99` }}
            aria-hidden
          >
            {card.eyebrow}
          </span>
        </motion.button>

        {/* ── FRONT FACE — centered type + ghost art ── */}
        <motion.button
          type="button"
          aria-label={`${card.title} — ${card.statement}`}
          animate={frontAnim}
          transition={frontTransition}
          className={[
            'absolute inset-0 cursor-pointer overflow-hidden rounded-2xl border-0 p-0',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2',
          ].join(' ')}
          tabIndex={flipped ? 0 : -1}
          onClick={openEvidence}
        >
          <div className="absolute inset-0" style={{ background: theme.front }} />
          {FrontArt && <FrontArt t={theme} />}

          <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-5 text-center">
            <motion.h3
              className="m-0 max-w-[18ch] text-pretty font-body text-[clamp(11px,1.05vw,13px)] font-bold leading-[1.28] tracking-[-0.01em] text-balance"
              style={{ color: theme.ink }}
              initial={false}
              animate={{ opacity: flipped ? 1 : 0, y: flipped ? 0 : 6 }}
              transition={{ duration: prefersReduced ? 0 : 0.2, ease: 'easeOut' }}
            >
              {card.title}
            </motion.h3>
            <motion.p
              className="m-0 mt-2 max-w-[22ch] text-pretty font-body text-[9px] leading-[1.45]"
              style={{ color: `${theme.ink}B3` }}
              initial={false}
              animate={{ opacity: flipped ? 1 : 0, y: flipped ? 0 : 4 }}
              transition={
                prefersReduced
                  ? { duration: 0 }
                  : { duration: 0.22, ease: 'easeOut', delay: flipped ? 0.08 : 0 }
              }
            >
              {card.statement}
            </motion.p>
            <motion.span
              className="mt-4 inline-flex items-center rounded-full px-3 py-1.5 font-body text-[9px] font-semibold leading-none tracking-[-0.01em]"
              style={{
                color: theme.ink,
                background: `${theme.ink}18`,
                border: `1px solid ${theme.ink}28`,
              }}
              initial={false}
              animate={{ opacity: flipped ? 1 : 0, y: flipped ? 0 : 4 }}
              transition={
                prefersReduced
                  ? { duration: 0 }
                  : { duration: 0.22, ease: 'easeOut', delay: flipped ? 0.14 : 0 }
              }
            >
              {CARD_PRACTICE_CTA}
            </motion.span>
          </div>
        </motion.button>

      </div>
    </motion.article>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function ThinkingThroughDesignSection(handlers: ThinkingThroughDesignActions) {
  const prefersReduced = useReducedMotion();
  const itemVariants = makeItemVariants(!!prefersReduced);

  const [alwaysReveal, setAlwaysReveal] = useState(false);
  const [deckOrder, setDeckOrder] = useState<number[]>([]);
  const deckOpen = deckOrder.length > 0;

  useEffect(() => {
    setAlwaysReveal(!window.matchMedia('(hover: hover)').matches);
  }, []);

  const handleSelect = useCallback((card: ThinkingCard) => {
    const frontIndex = THINKING_CARDS.findIndex((c) => c.id === card.id);
    if (frontIndex >= 0) setDeckOrder(makeDeckOrder(frontIndex));
  }, []);

  const handleNavigateMoment = useCallback(
    (href: string) => {
      setDeckOrder([]);
      navigateThinkingMomentHref(href, handlers);
    },
    [handlers],
  );

  return (
    <section
      aria-labelledby="thinking-cards-heading"
      className="w-full overflow-visible px-4 pb-0 pt-16 sm:px-6 md:px-12 md:pt-20"
    >
      <header className="mx-auto mb-12 flex max-w-[1180px] flex-col items-center text-center md:mb-16">
        <p className="mb-3 block font-eyebrow text-[10px] font-semibold uppercase tracking-[0.13em] text-ink/45">
          Thinking Through Design
        </p>
        <h2
          id="thinking-cards-heading"
          className="mb-4 mt-0 max-w-[22ch] text-pretty font-heading text-[length:var(--text-h2)] font-semibold leading-[var(--leading-h2)] tracking-[-0.052em] text-[var(--color-heading-h2)] text-balance"
        >
          {THINKING_SECTION_HEADING}
        </h2>
        <p className="m-0 w-full max-w-[52ch] text-pretty text-left text-[length:var(--text-body)] leading-[1.5] text-ink/60">
          {THINKING_SECTION_INTRO}
        </p>
      </header>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        animate={{
          opacity: deckOpen ? 0 : 1,
          scale: deckOpen ? 0.96 : 1,
          filter: deckOpen ? 'blur(4px)' : 'blur(0px)',
        }}
        transition={{ duration: prefersReduced ? 0 : 0.28, ease: 'easeOut' }}
        className={[
          'mx-auto flex max-w-[1180px] overflow-visible pb-16 md:pb-20',
          'flex-col items-center gap-5',
          'md:flex-row md:items-end md:justify-center md:gap-0 md:px-2',
          deckOpen ? 'pointer-events-none' : '',
        ].join(' ')}
        aria-label="Design principles"
        aria-hidden={deckOpen}
      >
        {THINKING_CARDS.map((card, i) => (
          <ThinkingCardItem
            key={card.id}
            card={card}
            index={i}
            itemVariants={itemVariants}
            prefersReduced={prefersReduced}
            alwaysReveal={alwaysReveal}
            onSelect={handleSelect}
          />
        ))}
      </motion.div>

      <ThinkingCardDeck
        deckOrder={deckOrder}
        onDeckOrderChange={setDeckOrder}
        onClose={() => setDeckOrder([])}
        onNavigateMoment={handleNavigateMoment}
      />
    </section>
  );
}
