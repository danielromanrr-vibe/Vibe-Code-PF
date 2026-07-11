import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type {
  AboutInfluenceCard,
  AboutPracticeAction,
  InfluenceDepth,
} from '../../content/aboutMandalaFacets';
import { cardById } from '../../content/aboutMandalaFacets';

const EDITORIAL_EASE = [0.22, 1, 0.36, 1] as const;

const reflectionReveal = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

const reflectionSection = {
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: EDITORIAL_EASE },
  },
};

type AboutInfluenceSlabProps = {
  card: AboutInfluenceCard;
  index: number;
  depth: InfluenceDepth;
  isActive: boolean;
  isDimmed: boolean;
  isVisited: boolean;
  onOpen: (trigger: HTMLElement) => void;
  onClose: () => void;
  onExplore: () => void;
  onStepBack: () => void;
  onRelated: (cardId: string) => void;
  onPracticeClick?: (action: AboutPracticeAction) => void;
};

export default function AboutInfluenceSlab({
  card,
  index,
  depth,
  isActive,
  isDimmed,
  isVisited,
  onOpen,
  onClose,
  onExplore,
  onStepBack,
  onRelated,
  onPracticeClick,
}: AboutInfluenceSlabProps) {
  const reduceMotion = useReducedMotion();
  const isOpen = isActive && depth !== 'collapsed';
  const isReflecting = isActive && depth === 'reflection';
  const [showContent, setShowContent] = useState(isOpen && !!reduceMotion);

  useEffect(() => {
    if (!isOpen) {
      setShowContent(false);
      return;
    }
    if (reduceMotion) {
      setShowContent(true);
      return;
    }
    const timer = window.setTimeout(() => setShowContent(true), isReflecting ? 120 : 180);
    return () => window.clearTimeout(timer);
  }, [isOpen, isReflecting, reduceMotion]);

  const eyebrow = String(index + 1).padStart(2, '0');
  const tone = index % 2 === 0 ? 'light' : 'warm';

  return (
    <article
      data-about-influence-slab={card.id}
      className={[
        'about-influence-slab',
        `about-influence-slab--${index}`,
        `about-influence-slab--${tone}`,
        isOpen ? 'about-influence-slab--open' : '',
        isReflecting ? 'about-influence-slab--reflection' : '',
        isDimmed ? 'about-influence-slab--dimmed' : '',
        isVisited ? 'about-influence-slab--visited' : '',
      ].join(' ')}
      aria-labelledby={`about-slab-title-${card.id}`}
    >
      {!isOpen ? (
        <button
          type="button"
          className="about-influence-slab__trigger flex h-full w-full cursor-pointer flex-col items-start border-0 bg-transparent p-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20 focus-visible:ring-offset-2"
          onClick={(e) => onOpen(e.currentTarget)}
          aria-expanded={false}
          aria-controls={`about-slab-panel-${card.id}`}
        >
          <span className="about-influence-slab__eyebrow font-eyebrow text-[length:var(--text-label)] uppercase tracking-[0.11em] text-ink/38">
            {eyebrow}
          </span>
          <h2 id={`about-slab-title-${card.id}`} className="about-influence-slab__title m-0 mt-2 text-pretty font-body text-[length:var(--text-h3)] font-bold leading-[1.12] tracking-[-0.03em] text-ink">
            {card.title}
          </h2>
          <p className="about-influence-slab__teaser m-0 mt-2.5 max-w-[42ch] text-pretty text-[length:var(--text-body)] leading-[1.5] text-ink/68">
            {card.teaser}
          </p>
          <span className="about-influence-slab__hint mt-4 font-eyebrow text-[0.62rem] uppercase tracking-[0.09em] text-ink/40">
            Open influence
            <span aria-hidden className="ml-1">
              →
            </span>
          </span>
        </button>
      ) : (
        <div id={`about-slab-panel-${card.id}`} className="about-influence-slab__panel flex min-h-0 flex-col">
          <div className="about-influence-slab__chrome flex shrink-0 items-center gap-2 border-b border-ink/[0.07] px-4 py-3 sm:px-5">
            <button
              type="button"
              className="about-influence-slab__origin flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-ink/[0.1] bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20"
              aria-label={isReflecting ? `Back to ${card.title} summary` : `Close ${card.title}`}
              onClick={() => (isReflecting ? onStepBack() : onClose())}
            >
              <span className="h-2 w-2 rounded-full bg-ink/55" aria-hidden />
            </button>
            {isReflecting ? (
              <button
                type="button"
                onClick={onStepBack}
                className="font-eyebrow text-[0.58rem] uppercase tracking-[0.09em] text-ink/44 transition-colors hover:text-ink/68"
              >
                Summary
              </button>
            ) : null}
            <span className="min-w-0 flex-1 truncate font-eyebrow text-[0.58rem] uppercase tracking-[0.09em] text-ink/40">
              {card.title}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 cursor-pointer border-0 bg-transparent px-1 py-1 font-eyebrow text-[0.58rem] uppercase tracking-[0.09em] text-ink/48 transition-colors hover:text-ink/76 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20"
            >
              Close
            </button>
          </div>

          <motion.div
            className="about-influence-slab__body min-h-0 flex-1 px-4 py-4 sm:px-5 sm:py-5"
            initial={false}
            animate={{ opacity: showContent ? 1 : 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.28, ease: EDITORIAL_EASE }}
          >
            {!isReflecting ? (
              <>
                <h3 className="m-0 text-pretty font-body text-[length:var(--text-body)] font-bold leading-[1.15] tracking-[-0.02em] text-ink">
                  {card.title}
                </h3>
                <p className="m-0 mt-2 text-pretty text-[length:var(--text-body)] font-medium leading-[1.48] text-ink/82">
                  {card.teaser}
                </p>
                <p className="m-0 mt-3 text-pretty text-[length:var(--text-body)] leading-[1.52] text-ink/58">
                  {card.annotationLine}
                </p>
                <p className="m-0 mt-3 text-pretty text-[0.8125rem] italic leading-[1.48] text-ink/42">
                  {card.spatialNote}
                </p>
                <button
                  type="button"
                  onClick={onExplore}
                  className="mt-4 inline-flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 font-eyebrow text-[0.62rem] uppercase tracking-[0.09em] text-ink/48 transition-colors hover:text-ink/72 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20"
                >
                  Explore influence
                  <span aria-hidden>→</span>
                </button>
              </>
            ) : (
              <motion.div
                variants={reduceMotion ? undefined : reflectionReveal}
                initial={reduceMotion ? false : 'hidden'}
                animate={showContent ? 'show' : 'hidden'}
              >
                <motion.h3
                  variants={reduceMotion ? undefined : reflectionSection}
                  className="m-0 text-pretty font-body text-[length:var(--text-h3)] font-bold leading-[1.12] tracking-[-0.03em] text-ink"
                >
                  {card.title}
                </motion.h3>

                <motion.p
                  variants={reduceMotion ? undefined : reflectionSection}
                  className="m-0 mt-3 text-pretty text-[length:var(--text-body)] leading-[1.56] text-ink/74"
                >
                  {card.reflection}
                </motion.p>

                <motion.p
                  variants={reduceMotion ? undefined : reflectionSection}
                  className="m-0 mt-5 font-eyebrow text-[0.58rem] uppercase tracking-[0.1em] text-ink/40"
                >
                  How it shapes my work
                </motion.p>
                <motion.ul
                  variants={reduceMotion ? undefined : reflectionSection}
                  className="m-0 mt-2 list-none space-y-2 p-0"
                >
                  {card.shapesWork.map((item) => (
                    <li
                      key={item}
                      className="relative pl-3 text-pretty text-[length:var(--text-body)] leading-[1.48] text-ink/64 before:absolute before:left-0 before:top-[0.55em] before:h-1 before:w-1 before:rounded-full before:bg-ink/24"
                    >
                      {item}
                    </li>
                  ))}
                </motion.ul>

                <motion.div
                  variants={reduceMotion ? undefined : reflectionSection}
                  className="mt-5 border-t border-ink/[0.07] pt-5"
                >
                  <p className="m-0 font-eyebrow text-[0.58rem] uppercase tracking-[0.1em] text-ink/40">
                    Relationship paths
                  </p>
                  <ul className="m-0 mt-2.5 list-none space-y-2.5 p-0">
                    {card.relatedInfluences.map((rel) => {
                      const related = cardById(rel.id);
                      if (!related) return null;
                      return (
                        <li key={rel.id}>
                          <button
                            type="button"
                            onClick={() => onRelated(rel.id)}
                            className="group w-full cursor-pointer rounded-xl border border-ink/[0.07] bg-ink/[0.02] p-3 text-left transition-colors hover:bg-ink/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20"
                          >
                            <span className="block text-pretty text-[length:var(--text-body)] font-medium leading-[1.34] text-ink/78 group-hover:text-ink">
                              {rel.label}
                            </span>
                            <span className="mt-1 block text-pretty text-[length:var(--text-label)] leading-[1.44] text-ink/48">
                              {rel.description}
                            </span>
                            <span className="mt-1.5 block font-eyebrow text-[0.56rem] uppercase tracking-[0.08em] text-ink/36">
                              → {related.title}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>

                <motion.p
                  variants={reduceMotion ? undefined : reflectionSection}
                  className="m-0 mt-5 font-eyebrow text-[0.58rem] uppercase tracking-[0.1em] text-ink/40"
                >
                  Where it shows up
                </motion.p>
                <motion.ul
                  variants={reduceMotion ? undefined : reflectionSection}
                  className="m-0 mt-2 list-none space-y-1.5 p-0"
                >
                  {card.whereItShowsUp.map((ref) => (
                    <li key={ref.label}>
                      {ref.action && onPracticeClick ? (
                        <button
                          type="button"
                          onClick={() => onPracticeClick(ref.action!)}
                          className="cursor-pointer border-0 bg-transparent p-0 text-left text-[length:var(--text-body)] leading-[1.45] text-ink/50 transition-colors hover:text-ink/68 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20"
                        >
                          {ref.label}
                        </button>
                      ) : (
                        <span className="text-[length:var(--text-body)] leading-[1.45] text-ink/50">{ref.label}</span>
                      )}
                    </li>
                  ))}
                </motion.ul>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </article>
  );
}
