import { forwardRef, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { AboutInfluenceCard, AboutPracticeAction, InfluenceDepth } from '../../content/aboutMandalaFacets';
import { cardById } from '../../content/aboutMandalaFacets';
import MandalaInfluenceGlyph, { mandalaAccentRgb } from './mandalaInfluenceGlyph';
import type { LabelPlacement } from './aboutFieldLayout';
import { annotationPlacement, capsuleRadius, clampExpandedPlacement } from './aboutAnnotationPlacement';
import { reflectionMaxHeight, shellWidthForDepth } from './aboutShellLayout';
import { nodeSizeFromLayout } from './aboutOrbitNodeUtils';

function rgba(rgb: readonly [number, number, number], alpha: number): string {
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
}

const CHROME_HEIGHT = 40;
const ANNOTATION_HEIGHT = 168;
const SHAPE_MS = 0.5;
const DEEPEN_MS = 0.55;
const CONTENT_DELAY_MS = 500;
const DEEPEN_CONTENT_DELAY_MS = 450;
const CONTENT_MS = 0.32;
const COLLAPSE_CONTENT_MS = 200;
const COLLAPSE_SHAPE_MS = 0.45;
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

type AboutInfluenceNodeProps = {
  card: AboutInfluenceCard;
  kind: 0 | 1 | 2;
  visualSize: number;
  rgb: readonly [number, number, number];
  nodeX: number;
  nodeY: number;
  centerX: number;
  centerY: number;
  depth: InfluenceDepth;
  isDimmed: boolean;
  isRelated?: boolean;
  isPreviewed?: boolean;
  isVisited?: boolean;
  isActive?: boolean;
  labelPlacement?: LabelPlacement;
  onPreviewEnter?: () => void;
  onPreviewLeave?: () => void;
  onNodeActivate: (card: AboutInfluenceCard, trigger: HTMLButtonElement) => void;
  onClose: () => void;
  onExplore: (cardId: string) => void;
  onStepBack: () => void;
  onRelated: (cardId: string) => void;
  onRelatedHover?: (relatedId: string | null) => void;
  onPracticeClick?: (action: AboutPracticeAction) => void;
};

const AboutInfluenceNode = forwardRef<HTMLDivElement, AboutInfluenceNodeProps>(function AboutInfluenceNode(
  {
    card,
    kind,
    visualSize,
    rgb,
    nodeX,
    nodeY,
    centerX,
    centerY,
    depth,
    isDimmed,
    isRelated = false,
    isPreviewed = false,
    isVisited = false,
    isActive = false,
    labelPlacement = 'below',
    onPreviewEnter,
    onPreviewLeave,
    onNodeActivate,
    onClose,
    onExplore,
    onStepBack,
    onRelated,
    onRelatedHover,
    onPracticeClick,
  },
  ref,
) {
  const reduceMotion = useReducedMotion();
  const accent = mandalaAccentRgb(rgb);
  const glyphSize = nodeSizeFromLayout(visualSize);
  const constellationSize = Math.round(glyphSize * 1.42);
  const glyphPresence = isActive
    ? 'active'
    : isPreviewed
      ? 'preview'
      : isRelated
        ? 'related'
        : isVisited
          ? 'visited'
          : 'rest';
  const isOpen = depth !== 'collapsed';
  const isReflecting = depth === 'reflection';

  const [viewport, setViewport] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  }));

  const [shellOpen, setShellOpen] = useState(isOpen);
  const [showContent, setShowContent] = useState(isOpen && reduceMotion);

  useEffect(() => {
    const onResize = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setShellOpen(isOpen);
      setShowContent(isOpen);
      return;
    }

    if (isOpen) {
      setShellOpen(true);
      const delay = isReflecting ? DEEPEN_CONTENT_DELAY_MS : CONTENT_DELAY_MS;
      const contentTimer = window.setTimeout(() => setShowContent(true), delay);
      return () => window.clearTimeout(contentTimer);
    }

    setShowContent(false);
    const shellTimer = window.setTimeout(() => setShellOpen(false), COLLAPSE_CONTENT_MS);
    return () => window.clearTimeout(shellTimer);
  }, [isOpen, isReflecting, reduceMotion]);

  useEffect(() => {
    if (!isReflecting) return;
    setShowContent(false);
    if (reduceMotion) {
      setShowContent(true);
      return;
    }
    const t = window.setTimeout(() => setShowContent(true), DEEPEN_CONTENT_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [isReflecting, reduceMotion]);

  const shellWidth = shellOpen ? shellWidthForDepth(depth, glyphSize, viewport.width) : constellationSize;
  const shellMaxH = isReflecting ? reflectionMaxHeight(viewport.height) : ANNOTATION_HEIGHT;

  const basePlacement = annotationPlacement(nodeX, nodeY, centerX, centerY, shellOpen);
  const placement =
    shellOpen && isReflecting
      ? clampExpandedPlacement(basePlacement, shellWidth, shellMaxH)
      : shellOpen
        ? clampExpandedPlacement(basePlacement, shellWidth, ANNOTATION_HEIGHT - CHROME_HEIGHT)
        : basePlacement;
  const expandedRadius = capsuleRadius(nodeX, nodeY, centerX, centerY);

  const shapeTransition = reduceMotion
    ? { duration: 0 }
    : {
        duration: isOpen ? (isReflecting ? DEEPEN_MS : SHAPE_MS) : COLLAPSE_SHAPE_MS,
        ease: EDITORIAL_EASE,
      };

  const contentTransition = reduceMotion
    ? { duration: 0 }
    : { duration: CONTENT_MS, ease: 'easeOut' as const };

  return (
    <div
      ref={ref}
      className={[
        'about-influence-node__anchor pointer-events-none absolute left-0 top-0',
        'about-influence-node__anchor--landmark',
        isActive ? 'about-influence-node__anchor--active' : '',
        isRelated ? 'about-influence-node__anchor--related' : '',
        isPreviewed ? 'about-influence-node__anchor--previewed' : '',
        isVisited ? 'about-influence-node__anchor--visited' : '',
      ].join(' ')}
      onMouseEnter={onPreviewEnter}
      onMouseLeave={onPreviewLeave}
      onFocus={onPreviewEnter}
      onBlur={onPreviewLeave}
      style={{
        left: placement.left,
        top: placement.top,
        transform: placement.translate,
        zIndex: shellOpen ? 26 : isActive ? 9 : isPreviewed ? 7 : isRelated ? 5 : isDimmed ? 1 : 4,
        opacity: isDimmed ? (isRelated ? 0.68 : 0.32) : 1,
        transition: 'opacity 0.45s ease',
      }}
    >
      <motion.div
        data-about-influence-node={card.id}
        role="region"
        aria-label={isReflecting ? `${card.title} reflection` : isOpen ? `${card.title} annotation` : card.title}
        aria-expanded={shellOpen}
        className={[
          'about-influence-node pointer-events-auto relative',
          shellOpen ? 'about-influence-node--open' : '',
          isReflecting ? 'about-influence-node--reflection' : '',
        ].join(' ')}
        initial={false}
        animate={{
          width: shellWidth,
          height: shellOpen ? (isReflecting ? 'auto' : ANNOTATION_HEIGHT) : constellationSize,
          borderRadius: shellOpen ? expandedRadius : 0,
        }}
        transition={shapeTransition}
        style={{
          transformOrigin: placement.transformOrigin,
          overflow: 'hidden',
          maxHeight: isReflecting ? shellMaxH : undefined,
          background: shellOpen ? 'rgba(244, 239, 228, 0.9)' : 'transparent',
          boxShadow: shellOpen
            ? `0 0 0 1px rgba(12, 21, 40, 0.08), 0 0 0 5px ${rgba(accent, 0.08)}, 0 8px 28px rgba(12, 21, 40, 0.06)`
            : 'none',
          backdropFilter: shellOpen ? 'blur(10px)' : undefined,
        }}
      >
        {!shellOpen ? (
          <button
            type="button"
            className="about-influence-node__hit absolute inset-0 flex h-full w-full cursor-pointer items-center justify-center border-0 bg-transparent p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25 focus-visible:ring-offset-2"
            aria-label={`${card.title}: ${card.teaser}`}
            onClick={(e) => onNodeActivate(card, e.currentTarget)}
          >
            <MandalaInfluenceGlyph
              kind={kind}
              nodeIndex={card.nodeIndex}
              rgb={accent}
              size={constellationSize}
              presence={glyphPresence}
            />
          </button>
        ) : (
          <div className="about-influence-node__open flex min-h-0 flex-col">
            <div className="about-influence-node__chrome flex shrink-0 items-center gap-2 border-b border-ink/[0.06] px-3 py-2">
              <button
                type="button"
                className="about-influence-node__origin flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20"
                aria-label={isReflecting ? `Back to ${card.title} summary` : `Close ${card.title}`}
                onClick={() => (isReflecting ? onStepBack() : onClose())}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    background: rgba(accent, 0.85),
                    boxShadow: `0 0 0 2px ${rgba(accent, 0.28)}`,
                  }}
                  aria-hidden
                />
              </button>
              {isReflecting ? (
                <button
                  type="button"
                  onClick={onStepBack}
                  className="font-eyebrow text-[length:var(--text-slab-eyebrow)] uppercase tracking-[var(--tracking-eyebrow)] text-ink/44 transition-colors hover:text-ink/68"
                >
                  Summary
                </button>
              ) : null}
              <span className="min-w-0 flex-1 truncate font-eyebrow text-[length:var(--text-slab-eyebrow)] uppercase tracking-[var(--tracking-eyebrow)] text-ink/40">
                {card.title}
              </span>
              <button
                type="button"
                onClick={onClose}
                className="about-influence-node__close shrink-0 cursor-pointer border-0 bg-transparent px-1 py-1 font-eyebrow text-[length:var(--text-slab-eyebrow)] uppercase tracking-[var(--tracking-eyebrow)] text-ink/48 transition-colors hover:text-ink/76 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20"
              >
                Close
              </button>
            </div>

            <motion.div
              className="about-influence-node__body flex min-h-0 flex-1 flex-col"
              initial={false}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={contentTransition}
            >
              <div
                className="about-influence-node__scroll flex min-h-0 flex-1 overflow-y-auto px-3 py-3 sm:px-4 sm:py-3.5"
                style={{ maxHeight: isReflecting ? shellMaxH : undefined }}
                aria-label={isReflecting ? `${card.title} reflection` : `${card.title} annotation`}
              >
                <div className="min-w-0 flex-1">
                {!isReflecting ? (
                  <>
                    <h3 className="m-0 text-pretty font-body text-[length:var(--text-body)] font-semibold leading-[1.15] tracking-[-0.02em] text-ink">
                      {card.title}
                    </h3>
                    <p className="m-0 mt-1.5 text-pretty text-[length:var(--text-body)] font-medium leading-[1.44] text-ink/84">
                      {card.teaser}
                    </p>
                    <p className="m-0 mt-2 text-pretty text-[length:var(--text-body)] leading-[1.5] text-ink/56">
                      {card.annotationLine}
                    </p>
                    <p className="about-influence-node__spatial m-0 mt-2 text-pretty text-[length:var(--text-body)] italic leading-[1.48] text-ink/40">
                      {card.spatialNote}
                    </p>
                    <button
                      type="button"
                      onClick={() => onExplore(card.id)}
                      className="about-influence-node__cta mt-3 inline-flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 font-eyebrow text-[length:var(--text-slab-eyebrow)] uppercase tracking-[var(--tracking-eyebrow)] text-ink/48 transition-colors hover:text-ink/72 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20"
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
                      className="m-0 text-pretty font-body text-[length:var(--text-body)] font-semibold leading-[1.12] tracking-[-0.02em] text-ink"
                    >
                      {card.title}
                    </motion.h3>

                    <motion.p
                      variants={reduceMotion ? undefined : reflectionSection}
                      className="m-0 mt-2.5 text-pretty text-[length:var(--text-body)] leading-[1.54] text-ink/74"
                    >
                      {card.reflection}
                    </motion.p>

                    <motion.p
                      variants={reduceMotion ? undefined : reflectionSection}
                      className="about-influence-node__section-label m-0 mt-4 font-eyebrow text-[length:var(--text-slab-eyebrow)] uppercase tracking-[var(--tracking-eyebrow)] text-ink/40"
                    >
                      How it shapes my work
                    </motion.p>
                    <motion.ul
                      variants={reduceMotion ? undefined : reflectionSection}
                      className="m-0 mt-1.5 list-none space-y-1.5 p-0"
                    >
                      {card.shapesWork.map((item) => (
                        <li
                          key={item}
                          className="relative pl-3 text-pretty text-[length:var(--text-body)] leading-[1.46] text-ink/64 before:absolute before:left-0 before:top-[0.55em] before:h-1 before:w-1 before:rounded-full before:bg-ink/24"
                        >
                          {item}
                        </li>
                      ))}
                    </motion.ul>

                    <motion.div
                      variants={reduceMotion ? undefined : reflectionSection}
                      className="about-influence-node__ecosystem mt-4 border-t border-ink/[0.06] pt-4"
                    >
                      <p className="about-influence-node__section-label m-0 font-eyebrow text-[length:var(--text-slab-eyebrow)] uppercase tracking-[var(--tracking-eyebrow)] text-ink/40">
                        Relationship paths
                      </p>
                      <ul className="m-0 mt-2 list-none space-y-2.5 p-0">
                        {card.relatedInfluences.map((rel) => {
                          const related = cardById(rel.id);
                          if (!related) return null;
                          return (
                            <li key={rel.id}>
                              <button
                                type="button"
                                onClick={() => onRelated(rel.id)}
                                onMouseEnter={() => onRelatedHover?.(rel.id)}
                                onMouseLeave={() => onRelatedHover?.(null)}
                                onFocus={() => onRelatedHover?.(rel.id)}
                                onBlur={() => onRelatedHover?.(null)}
                                className="about-influence-node__related group w-full cursor-pointer rounded-lg border-0 bg-ink/[0.025] p-3 text-left transition-colors hover:bg-ink/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20"
                                style={{ boxShadow: `inset 3px 0 0 ${rgba(accent, 0.32)}` }}
                              >
                                <span className="block text-pretty text-[length:var(--text-body)] font-medium leading-[1.32] text-ink/78 transition-colors group-hover:text-ink">
                                  {rel.label}
                                </span>
                                <span className="mt-1 block text-pretty text-[length:var(--text-body)] leading-[1.44] text-ink/48">
                                  {rel.description}
                                </span>
                                <span className="mt-1.5 block font-eyebrow text-[length:var(--text-slab-eyebrow)] uppercase tracking-[var(--tracking-eyebrow)] text-ink/36 transition-colors group-hover:text-ink/52">
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
                      className="about-influence-node__section-label m-0 mt-4 font-eyebrow text-[length:var(--text-slab-eyebrow)] uppercase tracking-[var(--tracking-eyebrow)] text-ink/40"
                    >
                      Where it shows up
                    </motion.p>
                    <motion.ul
                      variants={reduceMotion ? undefined : reflectionSection}
                      className="m-0 mt-1.5 list-none space-y-1 p-0"
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
                            <span className="text-[length:var(--text-body)] leading-[1.45] text-ink/50">
                              {ref.label}
                            </span>
                          )}
                        </li>
                      ))}
                    </motion.ul>

                    <motion.p
                      variants={reduceMotion ? undefined : reflectionSection}
                      className="about-influence-node__spatial m-0 mt-4 border-t border-ink/[0.05] pt-3 text-pretty text-[length:var(--text-body)] italic leading-[1.5] text-ink/38"
                    >
                      {card.spatialNote}
                    </motion.p>
                  </motion.div>
                )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>

      {!shellOpen ? (
        <>
          <span
            className={[
              'about-influence-node__label pointer-events-none absolute left-1/2 max-w-[7.75rem] -translate-x-1/2 text-center font-eyebrow text-[length:var(--text-slab-eyebrow)] font-normal uppercase tracking-[var(--tracking-eyebrow)] text-ink/82',
              labelPlacement === 'above'
                ? 'bottom-[calc(100%+7px)]'
                : 'top-[calc(100%+7px)]',
            ].join(' ')}
          >
            {card.title}
          </span>
          {isPreviewed ? (
            <motion.span
              initial={{ opacity: 0, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              className={[
                'about-influence-node__teaser-preview pointer-events-none absolute left-1/2 max-w-[9rem] -translate-x-1/2 text-center text-[length:var(--text-body)] italic leading-[1.38] text-ink/50',
                labelPlacement === 'above'
                  ? 'bottom-[calc(100%+1.65rem)]'
                  : 'top-[calc(100%+1.5rem)]',
              ].join(' ')}
            >
              {card.teaser}
            </motion.span>
          ) : null}
        </>
      ) : null}
    </div>
  );
});

export default AboutInfluenceNode;
