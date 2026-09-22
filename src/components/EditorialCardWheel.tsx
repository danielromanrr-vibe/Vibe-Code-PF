import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type KeyboardEvent,
  type MutableRefObject,
  type ReactNode,
  type RefObject,
} from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';
import ProcessSlideControls from './ProcessSlideControls';
import {
  overlayScrollTopForProgress,
  useOverlayTrackProgress,
} from '../hooks/useOverlayTrackProgress';
import {
  CARD_SPRING,
  EDITORIAL_STAGE_MIN_HEIGHT,
  getCardStackMotion,
  nearestStepIndex,
  progressFromIndex,
  scrollPosition,
  STACK_PEEK_SCALE,
  PEEK_RIM_PX,
  STACK_PEEK_Y,
  STACK_REF_HEIGHT,
  wheelDistance,
} from './editorialCardWheelMotion';
import { useChapterPreview } from './chapterPreview';

/** Scroll track depth per card — wheel scrubs inside pinned viewport */
export const SCROLL_VH_PER_STEP = 42;

export type EditorialWheelMoment = {
  id: string;
  title: string;
};

function formatMomentIndex(n: number, prefix = ''): string {
  return `${prefix}${n}`;
}

/** Page list with a progress spine — the pages of one chapter, lit by the card stack's progress. */
export function ChapterPageOutline<T extends EditorialWheelMoment>({
  progress,
  moments,
  momentCount,
  onSelectMoment,
  indexPrefix = '',
  markerOnly = false,
  className = '',
}: {
  progress: MotionValue<number>;
  moments: readonly T[];
  momentCount: number;
  onSelectMoment?: (index: number) => void;
  /** Chapter number before each page number, e.g. "1." → 1.1, 1.2. */
  indexPrefix?: string;
  /** Only the current page carries a marker — no spine, no track behind the others. */
  markerOnly?: boolean;
  className?: string;
}) {
  const activeFloat = useTransform(progress, (p) => scrollPosition(p, momentCount));
  const fillScale = useTransform(progress, (p) => {
    if (momentCount <= 1) return 1;
    return scrollPosition(p, momentCount) / Math.max(1, momentCount - 1);
  });

  return (
    <div className={`process-chapter-outline__list relative flex min-h-0 flex-1 flex-col ${className}`.trim()}>
      {markerOnly ? null : (
      <div
        className="process-chapter-outline__spine pointer-events-none absolute bottom-0 left-0 top-0 w-px bg-ink/[0.08]"
        aria-hidden
      >
        <motion.div
          className="process-chapter-outline__spine-fill absolute inset-x-0 top-0 h-full origin-top bg-ink/30"
          style={{ scaleY: fillScale }}
        />
      </div>
      )}

      <ol className="process-chapter-outline__nodes relative m-0 flex list-none flex-col justify-between gap-0 p-0">
        {moments.map((moment, i) => (
          <TimelineNode
            key={moment.id}
            moment={moment}
            index={i}
            activeFloat={activeFloat}
            onSelect={onSelectMoment}
            indexPrefix={indexPrefix}
            markerOnly={markerOnly}
          />
        ))}
      </ol>
    </div>
  );
}

function NarrativeTimeline<T extends EditorialWheelMoment>({
  progress,
  moments,
  railLabel,
  momentCount,
  onSelectMoment,
  indexPrefix = '',
  className = '',
}: {
  progress: MotionValue<number>;
  moments: readonly T[];
  railLabel: string;
  momentCount: number;
  onSelectMoment?: (index: number) => void;
  indexPrefix?: string;
  className?: string;
}) {
  return (
    <aside
      className={[
        'process-narrative-rail process-chapter-outline flex h-full min-w-0 flex-1 flex-col',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={railLabel}
    >
      <ChapterPageOutline
        progress={progress}
        moments={moments}
        momentCount={momentCount}
        onSelectMoment={onSelectMoment}
        indexPrefix={indexPrefix}
      />
    </aside>
  );
}

function TimelineNode<T extends EditorialWheelMoment>({
  moment,
  index,
  activeFloat,
  onSelect,
  indexPrefix = '',
  markerOnly = false,
}: {
  moment: T;
  index: number;
  activeFloat: MotionValue<number>;
  onSelect?: (index: number) => void;
  indexPrefix?: string;
  markerOnly?: boolean;
}) {
  const state = useTransform(activeFloat, (v) => {
    if (v > index + 0.45) return 'completed';
    if (v >= index - 0.08 && v <= index + 0.45) return 'active';
    return 'upcoming';
  });

  const borderColor = useTransform(state, (s) =>
    s === 'active'
      ? 'rgba(20, 20, 20, 0.82)'
      : markerOnly
        ? 'rgba(20, 20, 20, 0)'
        : s === 'completed'
          ? 'rgba(20, 20, 20, 0.16)'
          : 'rgba(20, 20, 20, 0.06)',
  );

  const titleWeight = useTransform(state, (s) => (s === 'active' ? 600 : s === 'completed' ? 500 : 400));

  const titleOpacity = useTransform(activeFloat, (v) => {
    // Floor opacities so 14px body titles stay ≥ WCAG AA (~4.5:1) on page bg.
    if (v > index + 0.45) return 0.72; // completed
    if (v >= index - 0.08 && v <= index + 0.45) return 1; // active
    return 0.62; // upcoming
  });

  const NodeTag = onSelect ? 'button' : 'div';
  const chapterMoment = index + 1;

  return (
    <li className="process-chapter-outline__node min-h-0 flex-1 first:pt-0 last:pb-0">
      <NodeTag
        type={NodeTag === 'button' ? 'button' : undefined}
        className={[
          'process-chapter-outline__entry group flex h-full w-full border-0 bg-transparent py-2 pr-0 text-left sm:py-2.5',
          NodeTag === 'button'
            ? 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20 focus-visible:ring-offset-2'
            : '',
        ].join(' ')}
        onClick={NodeTag === 'button' ? () => onSelect?.(index) : undefined}
      >
        <motion.div
          className="flex min-w-0 flex-col gap-0.5 border-l-2 pl-3 sm:pl-3.5"
          style={{ borderColor }}
        >
          <motion.span
            className="font-eyebrow text-[length:var(--text-slab-eyebrow)] tabular-nums tracking-[var(--tracking-eyebrow)] text-ink/55"
            style={{ opacity: titleOpacity }}
          >
            {formatMomentIndex(chapterMoment, indexPrefix)}
          </motion.span>
          <motion.p
            className="m-0 text-pretty font-body text-[length:var(--text-body)] leading-[1.34] text-ink"
            style={{ opacity: titleOpacity, fontWeight: titleWeight }}
          >
            {moment.title}
          </motion.p>
        </motion.div>
      </NodeTag>
    </li>
  );
}

function WheelStageSlot({
  moment,
  slotIndex,
  momentCount,
  scrollProgress,
  reducedMotion,
  dealIn = false,
  peekRimPx,
  stackDepth = 2,
  children,
}: {
  moment: EditorialWheelMoment;
  slotIndex: number;
  momentCount: number;
  scrollProgress: MotionValue<number>;
  reducedMotion: boolean;
  dealIn?: boolean;
  /** Visible rim of the card waiting behind; defaults to the shared motion's rim. */
  peekRimPx?: number;
  /** Cards shown behind the front one (1 or 2). */
  stackDepth?: 1 | 2;
  children: ReactNode;
}) {
  const slotRef = useRef<HTMLDivElement>(null);
  const cardHeight = useMotionValue(STACK_REF_HEIGHT);
  useLayoutEffect(() => {
    const el = slotRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      if (el.offsetHeight > 0) cardHeight.set(el.offsetHeight);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [cardHeight]);
  // Peek offsets are tuned for STACK_REF_HEIGHT; taller cards shrink further from the top
  // under bottom-origin scale, so lift them by the difference to keep the same rim.
  const rawY = useTransform([scrollProgress, cardHeight], ([p, h]: number[]) => {
    const m = getCardStackMotion(slotIndex, p, momentCount);
    const behind = Math.max(0, Math.min(1, -wheelDistance(scrollPosition(p, momentCount), slotIndex, momentCount)));
    const rimShift = peekRimPx == null ? 0 : (PEEK_RIM_PX - peekRimPx) * behind;
    return m.y - (h - STACK_REF_HEIGHT) * (1 - m.scale) + rimShift;
  });
  const rawOpacity = useTransform(scrollProgress, (p) => {
    const { opacity } = getCardStackMotion(slotIndex, p, momentCount);
    if (stackDepth > 1) return opacity;
    // Past the first card behind, fade out instead of showing a second rim.
    const d = wheelDistance(scrollPosition(p, momentCount), slotIndex, momentCount);
    return d < -1 ? opacity * Math.max(0, 2 + d) : opacity;
  });
  const rawScale = useTransform(scrollProgress, (p) => getCardStackMotion(slotIndex, p, momentCount).scale);
  const zIndex = useTransform(scrollProgress, (p) => getCardStackMotion(slotIndex, p, momentCount).zIndex);
  const backgroundColor = useTransform(
    scrollProgress,
    (p) => getCardStackMotion(slotIndex, p, momentCount).backgroundColor,
  );
  const boxShadow = useTransform(scrollProgress, (p) => getCardStackMotion(slotIndex, p, momentCount).boxShadow);
  const isFront = useTransform(scrollProgress, (p) => getCardStackMotion(slotIndex, p, momentCount).isFront);
  const visible = useTransform(scrollProgress, (p) => getCardStackMotion(slotIndex, p, momentCount).visible);
  const display = useTransform(visible, (v) => (v ? 'flex' : 'none'));
  const pointerEvents = useTransform(isFront, (front) => (front ? 'auto' : 'none'));

  const springCfg = reducedMotion ? { stiffness: 500, damping: 50, mass: 0.2 } : CARD_SPRING;
  const y = useSpring(rawY, springCfg);
  const opacity = useSpring(rawOpacity, springCfg);
  const scale = useSpring(rawScale, springCfg);

  const dealInRef = useRef(dealIn);
  useEffect(() => {
    if (!dealInRef.current) return;
    // Start at the back of the stack, then let the springs carry each card to its place.
    y.jump(STACK_PEEK_Y.tier2);
    scale.jump(STACK_PEEK_SCALE.tier2);
    opacity.jump(0);
    const frame = requestAnimationFrame(() => {
      y.set(rawY.get());
      scale.set(rawScale.get());
      opacity.set(rawOpacity.get());
    });
    return () => cancelAnimationFrame(frame);
  }, [y, scale, opacity, rawY, rawScale, rawOpacity]);

  return (
    <motion.div
      ref={slotRef}
      className="process-scroll-stage__slot absolute inset-x-0 bottom-0 flex items-end"
      style={{ zIndex, opacity, pointerEvents, display }}
    >
      <motion.article
        className="process-scroll-stage__card editorial-evidence-card process-card-stack__shell flex w-full flex-col overflow-hidden rounded-2xl ring-1 ring-ink/[0.06]"
        style={{
          y,
          scale,
          backgroundColor,
          boxShadow,
          transformOrigin: '50% 100%',
        }}
        aria-label={moment.title}
      >
        {children}
      </motion.article>
    </motion.div>
  );
}

export function EditorialCardWheelViewport<T extends EditorialWheelMoment>({
  moments,
  progress,
  reducedMotion,
  stageMinHeight = EDITORIAL_STAGE_MIN_HEIGHT,
  renderCard,
  titleIdPrefix = 'editorial-wheel-card',
  dealIn = false,
  peekRimPx,
  stackDepth,
}: {
  moments: readonly T[];
  progress: MotionValue<number>;
  reducedMotion: boolean;
  stageMinHeight?: string;
  titleIdPrefix?: string;
  renderCard: (moment: T, index: number, titleId: string) => ReactNode;
  /** Cards mounting now rise from the back of the stack into their places. */
  dealIn?: boolean;
  peekRimPx?: number;
  stackDepth?: 1 | 2;
}) {
  const momentCount = moments.length;

  return (
    <div className="editorial-evidence-card__viewport process-scroll-stage__viewport process-scroll-stage__wheel relative h-full min-h-0 w-full flex-1 overflow-hidden">
      <div className="process-scroll-stage__stack relative h-full w-full" style={{ minHeight: stageMinHeight }}>
        {moments.map((moment, i) => {
          const titleId = `${titleIdPrefix}-${moment.id}`;
          return (
            <WheelStageSlot
              key={moment.id}
              moment={moment}
              slotIndex={i}
              momentCount={momentCount}
              scrollProgress={progress}
              reducedMotion={reducedMotion}
              dealIn={dealIn}
              peekRimPx={peekRimPx}
              stackDepth={stackDepth}
            >
              {renderCard(moment, i, titleId)}
            </WheelStageSlot>
          );
        })}
      </div>
    </div>
  );
}

export type EditorialCardScrollDeckProps<T extends EditorialWheelMoment> = {
  moments: readonly T[];
  scrollContainerRef: RefObject<HTMLElement | null>;
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  ariaLabel: string;
  reducedMotion?: boolean;
  showTimeline?: boolean;
  timelineInteractive?: boolean;
  timelineClassName?: string;
  railLabel?: string;
  deckKey?: string;
  scrollSessionKey?: number;
  initialScrollIndex?: number;
  scrollVhPerStep?: number;
  pinnedTop?: string;
  pinnedHeight?: string;
  stageMaxWidthClass?: string;
  stageMinHeight?: string;
  panelId?: string;
  pinnedHeader?: ReactNode;
  className?: string;
  titleIdPrefix?: string;
  showPagination?: boolean;
  canGoPrev?: boolean;
  canGoNext?: boolean;
  onRequestPrev?: () => void;
  onRequestNext?: () => void;
  layoutIdPrefix?: string;
  navGroupLabel?: string;
  prevLabel?: string;
  nextLabel?: string;
  paginationAriaLabel?: string;
  renderCard: (moment: T, index: number, titleId: string) => ReactNode;
};

/** Scroll-driven wheel — sticky viewport + tall track (Process Overview pattern). */
export function EditorialCardScrollDeck<T extends EditorialWheelMoment>({
  moments,
  scrollContainerRef,
  activeIndex,
  onActiveIndexChange,
  ariaLabel,
  reducedMotion = false,
  showTimeline = false,
  timelineInteractive = true,
  timelineClassName = '',
  railLabel = 'Outline',
  deckKey,
  scrollSessionKey,
  initialScrollIndex,
  scrollVhPerStep = SCROLL_VH_PER_STEP,
  pinnedTop = 'var(--wheel-pinned-top, var(--site-header-height))',
  pinnedHeight = 'var(--wheel-pinned-height, var(--process-pinned-height))',
  stageMaxWidthClass = 'max-w-[920px]',
  stageMinHeight = EDITORIAL_STAGE_MIN_HEIGHT,
  panelId = 'editorial-card-wheel-panel',
  pinnedHeader,
  className = '',
  titleIdPrefix,
  showPagination = false,
  canGoPrev = false,
  canGoNext = false,
  onRequestPrev,
  onRequestNext,
  layoutIdPrefix = 'process-scroll-deck',
  navGroupLabel = 'Moment navigation',
  prevLabel = 'Previous moment',
  nextLabel = 'Next moment',
  paginationAriaLabel = 'Moments in this chapter',
  renderCard,
}: EditorialCardScrollDeckProps<T>) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const momentCount = moments.length;
  const suppressScrollDriveRef = useRef(false);
  const activeIndexRef = useRef(activeIndex);
  const momentCountRef = useRef(momentCount);
  const onActiveIndexChangeRef = useRef(onActiveIndexChange);
  activeIndexRef.current = activeIndex;
  momentCountRef.current = momentCount;
  onActiveIndexChangeRef.current = onActiveIndexChange;
  const wheelProgress = useMotionValue(0);

  const onOverlayProgress = useCallback((latest: number) => {
    if (suppressScrollDriveRef.current) return;
    wheelProgress.set(latest);
    const idx = nearestStepIndex(latest, momentCountRef.current);
    if (idx !== activeIndexRef.current) onActiveIndexChangeRef.current(idx);
  }, [wheelProgress]);

  useOverlayTrackProgress(trackRef, scrollContainerRef, onOverlayProgress);

  useEffect(() => {
    let cancelled = false;
    let detach = () => {};

    const bind = () => {
      if (cancelled) return;
      const pin = pinRef.current;
      const container = scrollContainerRef.current;
      if (!pin || !container) {
        requestAnimationFrame(bind);
        return;
      }

      const onWheel = (event: WheelEvent) => {
        if (event.ctrlKey) return;
        event.preventDefault();
        container.scrollTop += event.deltaY;
      };

      pin.addEventListener('wheel', onWheel, { passive: false });
      detach = () => pin.removeEventListener('wheel', onWheel);
    };

    bind();
    return () => {
      cancelled = true;
      detach();
    };
  }, [scrollContainerRef]);

  const tryScrollContainerToIndex = useCallback(
    (index: number) => {
      const track = trackRef.current;
      const container = scrollContainerRef.current;
      if (!track || !container || momentCount <= 1) return false;

      const target = overlayScrollTopForProgress(
        track,
        container,
        progressFromIndex(index, momentCount),
      );
      if (target == null) return false;

      const delta = target - container.scrollTop;
      if (Math.abs(delta) < 2) return true;
      container.scrollTop = target;
      return true;
    },
    [momentCount, scrollContainerRef],
  );

  /** Cards follow index. Overlay only nudges inside the sticky range — never a page jump. */
  const goToMoment = useCallback(
    (index: number) => {
      const next = Math.max(0, Math.min(momentCount - 1, index));
      suppressScrollDriveRef.current = true;
      wheelProgress.set(progressFromIndex(next, momentCount));
      if (next !== activeIndexRef.current) onActiveIndexChange(next);
      tryScrollContainerToIndex(next);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          suppressScrollDriveRef.current = false;
        });
      });
    },
    [momentCount, onActiveIndexChange, tryScrollContainerToIndex, wheelProgress],
  );

  const goPrev = useCallback(() => {
    if (activeIndex > 0) goToMoment(activeIndex - 1);
    else onRequestPrev?.();
  }, [activeIndex, goToMoment, onRequestPrev]);

  const goNext = useCallback(() => {
    if (activeIndex < momentCount - 1) goToMoment(activeIndex + 1);
    else onRequestNext?.();
  }, [activeIndex, goToMoment, momentCount, onRequestNext]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      goNext();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goPrev();
    }
  };

  const prevDeckKeyRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (!deckKey) return;

    const isInitialMount = prevDeckKeyRef.current === undefined;
    const deckKeyChanged = prevDeckKeyRef.current !== deckKey;
    prevDeckKeyRef.current = deckKey;

    if (isInitialMount || !deckKeyChanged) return;

    goToMoment(activeIndexRef.current);
  }, [deckKey, goToMoment]);

  useEffect(() => {
    if (scrollSessionKey == null || initialScrollIndex == null) return;
    if (!trackRef.current || !scrollContainerRef.current) return;
    const frame = requestAnimationFrame(() => goToMoment(initialScrollIndex));
    return () => cancelAnimationFrame(frame);
  }, [scrollSessionKey, initialScrollIndex, goToMoment]);

  const rawTrackVh = momentCount * scrollVhPerStep;
  const trackHeightVh =
    momentCount > 1 && rawTrackVh < 108 ? 108 : rawTrackVh;
  const stageRowClass = showTimeline
    ? 'editorial-card-wheel-stage flex-col gap-5 md:flex-row md:items-start md:gap-8'
    : 'flex-col';

  return (
    <div
      className={`process-scroll-deck ${className}`.trim()}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div
        ref={trackRef}
        className="process-scroll-deck__track relative"
        style={{ height: `${trackHeightVh}vh` }}
      >
        <div
          ref={pinRef}
          className="process-scroll-deck__sticky sticky z-10 flex flex-col overflow-hidden"
          style={{
            top: pinnedTop,
            height: pinnedHeight,
            maxHeight: pinnedHeight,
          }}
        >
          {pinnedHeader ? (
            <div className="process-scroll-deck__nav shrink-0 pb-4 md:pb-5">{pinnedHeader}</div>
          ) : null}

          <div
            id={panelId}
            role="tabpanel"
            aria-label={ariaLabel}
            className={[
              'process-scroll-deck__stage mx-auto flex min-h-0 w-full flex-1',
              showTimeline ? 'editorial-card-wheel-stage' : '',
              stageMaxWidthClass,
              stageRowClass,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {showTimeline ? (
              <NarrativeTimeline
                progress={wheelProgress}
                moments={moments}
                railLabel={railLabel}
                momentCount={momentCount}
                onSelectMoment={timelineInteractive ? goToMoment : undefined}
                className={timelineClassName}
              />
            ) : null}

            <div className="process-scroll-stage flex min-h-0 min-w-0 w-full flex-1">
              <EditorialCardWheelViewport
                moments={moments}
                progress={wheelProgress}
                reducedMotion={reducedMotion}
                stageMinHeight={stageMinHeight}
                titleIdPrefix={titleIdPrefix}
                renderCard={renderCard}
              />
            </div>
          </div>

          {showPagination && momentCount > 1 ? (
            <div
              className={[
                'process-scroll-deck__pagination mx-auto w-full shrink-0 pt-3',
                stageMaxWidthClass,
              ].join(' ')}
            >
              <ProcessSlideControls
                slideCount={momentCount}
                activeSlideIndex={activeIndex}
                onSlideSelect={goToMoment}
                onPrev={goPrev}
                onNext={goNext}
                canGoPrev={canGoPrev}
                canGoNext={canGoNext}
                reducedMotion={reducedMotion}
                layoutIdPrefix={layoutIdPrefix}
                navGroupLabel={navGroupLabel}
                prevLabel={prevLabel}
                nextLabel={nextLabel}
                paginationAriaLabel={paginationAriaLabel}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export type EditorialCardWheelStageProps<T extends EditorialWheelMoment> = {
  moments: readonly T[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  ariaLabel: string;
  railLabel: string;
  reducedMotion?: boolean;
  showTimeline?: boolean;
  timelineInteractive?: boolean;
  timelineClassName?: string;
  layoutIdPrefix: string;
  className?: string;
  stageClassName?: string;
  stageMaxWidthClass?: string;
  stageMinHeight?: string;
  panelId?: string;
  showPagination?: boolean;
  canGoPrev?: boolean;
  canGoNext?: boolean;
  onRequestPrev?: () => void;
  onRequestNext?: () => void;
  navGroupLabel?: string;
  prevLabel?: string;
  nextLabel?: string;
  paginationAriaLabel?: string;
  onKeyDown?: (e: KeyboardEvent) => void;
  tabIndex?: number;
  pinnedHeader?: ReactNode;
  renderCard: (moment: T, index: number, titleId: string) => ReactNode;
  titleIdPrefix?: string;
  /** Wheel over the deck turns pages, one per gesture; wheel anywhere else scrolls the page. */
  wheelScrub?: boolean;
  /** Chapter handoff for the scrub — pulling past the first/last page turns the chapter. */
  hasNextChapter?: boolean;
  hasPrevChapter?: boolean;
  onNextChapter?: () => void;
  onPrevChapter?: () => void;
  /** Chapter number before page numbers on the rail and card rims, e.g. "1.". */
  indexPrefix?: string;
  /**
   * Replaces the page rail with a custom left column. It receives the stack's progress and the
   * page controls, so it moves in step with the cards; pagination is then not rendered below.
   */
  renderRail?: (ctx: EditorialWheelRailContext) => ReactNode;
  /** Touch swipe across the cards turns pages (and chapters at the edges). */
  swipe?: boolean;
  peekRimPx?: number;
  stackDepth?: 1 | 2;
};

export type EditorialWheelRailContext = {
  progress: MotionValue<number>;
  momentCount: number;
  activeIndex: number;
  onSelectMoment: (index: number) => void;
  controls: ReactNode;
};

/** Horizontal travel that makes a touch gesture a page swipe. */
const SWIPE_MIN_PX = 44;

/** Wheel travel within one gesture that turns exactly one page. */
const WHEEL_STEP_PX = 36;
/** Pull past a chapter's edge, in a gesture that started there, that turns the chapter. */
const WHEEL_CHAPTER_PX = 110;
/** Silence after the last wheel event that ends a gesture, trackpad inertia included. */
const WHEEL_QUIET_MS = 200;
/** Inertia counts as spent once its delta drops below this share of the gesture's peak. */
const WHEEL_TAIL_SHARE = 0.35;
/** Share of the card stack that must be visible below the site header before the wheel is captured. */
const WHEEL_ENGAGE_VISIBLE = 0.85;
/** How far the stack leans toward the next page before a step commits (in pages). */
const WHEEL_LEAN_PAGES = 0.12;
/** How far the chapter underline leans toward its neighbour at the commit point. */
export const CHAPTER_PREVIEW_MAX = 0.35;
/** Rubber-band offset of the stack at the commit point (px). */
const CHAPTER_PULL_PX = 28;
const SETTLE_EASE = [0.22, 0.82, 0.24, 1] as const;
const LEAN_RELEASE = { type: 'tween' as const, duration: 0.28, ease: SETTLE_EASE };
const PULL_RELEASE_SPRING = { type: 'spring' as const, stiffness: 380, damping: 32, mass: 0.7 };

type WheelScrubOptions = {
  progress: MotionValue<number>;
  pull: MotionValue<number>;
  preview: MotionValue<number> | null;
  activeIndex: number;
  momentCount: number;
  onActiveIndexChange: (index: number) => void;
  hasNextChapter: boolean;
  hasPrevChapter: boolean;
  onNextChapter?: () => void;
  onPrevChapter?: () => void;
  reducedMotion: boolean;
  scrubbingRef: MutableRefObject<boolean>;
};

const clampTo = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

/**
 * Scoped wheel paging: one gesture turns at most one page, however long its inertia runs.
 * A chapter only turns from a gesture that starts on the chapter's edge page.
 * The wheel is captured anywhere over the deck once its cards are in view, even mid-gesture,
 * and stays with the page at the ends of the book. Never writes the page's scroll position.
 */
function useWheelScrub(
  targetRef: RefObject<HTMLElement | null>,
  stackRef: RefObject<HTMLElement | null>,
  enabled: boolean,
  options: WheelScrubOptions,
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const el = targetRef.current;
    if (!enabled || !el) return;

    // Resolves --site-header-height (a calc()) to pixels.
    const headerProbe = document.createElement('div');
    headerProbe.setAttribute('aria-hidden', 'true');
    headerProbe.style.cssText =
      'position:fixed;top:0;left:0;width:0;height:var(--site-header-height,0px);visibility:hidden;pointer-events:none;';
    document.body.appendChild(headerProbe);

    let owner: 'deck' | 'page' | null = null;
    /** The gesture already turned a page or a chapter, or was caught mid-flight. */
    let spent = false;
    let travel = 0;
    let peak = 0;
    let tailSeen = false;
    let lastTime = 0;
    let lastMagnitude = 0;
    let quietTimer = 0;

    const lastPage = () => Math.max(0, optionsRef.current.momentCount - 1);

    const isEngaged = () => {
      const rect = (stackRef.current ?? el).getBoundingClientRect();
      const top = headerProbe.getBoundingClientRect().height;
      const room = window.innerHeight - top;
      const visible = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, top);
      return room > 0 && visible >= Math.min(rect.height, room) * WHEEL_ENGAGE_VISIBLE;
    };

    const edge = (forward: boolean) => {
      const o = optionsRef.current;
      const atEdge = forward ? o.activeIndex >= lastPage() : o.activeIndex <= 0;
      const hasChapter = forward
        ? o.hasNextChapter && Boolean(o.onNextChapter)
        : o.hasPrevChapter && Boolean(o.onPrevChapter);
      return { atEdge, atBookEdge: atEdge && !hasChapter };
    };

    /** Signed share (-1…1) of the way to turning a page. */
    const showLean = (share: number) => {
      const o = optionsRef.current;
      if (o.reducedMotion) return;
      const last = lastPage();
      o.progress.stop();
      o.scrubbingRef.current = true;
      const pos = clampTo(o.activeIndex + share * WHEEL_LEAN_PAGES, 0, last);
      o.progress.set(last > 0 ? pos / last : 0);
    };

    /** Signed share (-1…1) of the way to turning a chapter. */
    const showPull = (share: number) => {
      const { pull, preview, reducedMotion } = optionsRef.current;
      if (reducedMotion) return;
      pull.set(-CHAPTER_PULL_PX * share);
      preview?.set(CHAPTER_PREVIEW_MAX * share);
    };

    const release = () => {
      const o = optionsRef.current;
      const transition = o.reducedMotion ? { duration: 0 } : PULL_RELEASE_SPRING;
      if (o.pull.get() !== 0) animate(o.pull, 0, transition);
      if (o.preview && o.preview.get() !== 0) animate(o.preview, 0, transition);
      if (!o.scrubbingRef.current) return;
      o.scrubbingRef.current = false;
      const to = progressFromIndex(o.activeIndex, o.momentCount);
      if (o.reducedMotion) o.progress.set(to);
      else animate(o.progress, to, LEAN_RELEASE);
    };

    const endGesture = () => {
      window.clearTimeout(quietTimer);
      quietTimer = 0;
      owner = null;
      spent = false;
      travel = 0;
      peak = 0;
      tailSeen = false;
      release();
    };

    const turnPage = (forward: boolean) => {
      const o = optionsRef.current;
      spent = true;
      // The stage springs from the lean to the new page.
      o.scrubbingRef.current = false;
      o.onActiveIndexChange(o.activeIndex + (forward ? 1 : -1));
    };

    const turnChapter = (forward: boolean) => {
      const o = optionsRef.current;
      spent = true;
      o.scrubbingRef.current = false;
      (forward ? o.onNextChapter : o.onPrevChapter)?.();
      // After the new chapter commits, so the underline slides on from where it leaned.
      requestAnimationFrame(release);
    };

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey) return;
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
      const dy = event.deltaY * unit;
      const dx = event.deltaX * unit;
      const magnitude = Math.abs(dy);
      const now = performance.now();
      const gap = now - lastTime;
      lastTime = now;

      if (owner !== null) {
        if (magnitude < peak * WHEEL_TAIL_SHARE) tailSeen = true;
        // A new swipe on top of decayed inertia is a new gesture.
        const freshSwipe = tailSeen && magnitude > lastMagnitude * 2 + 8;
        if (gap > WHEEL_QUIET_MS || freshSwipe) endGesture();
      }
      lastMagnitude = magnitude;
      peak = Math.max(peak, magnitude);
      window.clearTimeout(quietTimer);
      quietTimer = window.setTimeout(endGesture, WHEEL_QUIET_MS);

      const vertical = dy !== 0 && Math.abs(dy) >= Math.abs(dx);
      const forward = dy > 0;

      if (owner === null) {
        if (!vertical) return;
        owner = isEngaged() && !edge(forward).atBookEdge ? 'deck' : 'page';
      } else if (owner === 'page' && vertical && isEngaged() && !edge(forward).atBookEdge) {
        // The deck arrived under the cursor mid-scroll: stop the page here, page on the next gesture.
        owner = 'deck';
        spent = true;
      }
      if (owner !== 'deck') return;

      event.preventDefault();
      if (spent || !vertical) return;

      travel += dy;
      const towardNext = travel > 0;
      const reach = Math.abs(travel);
      const { atEdge, atBookEdge } = edge(towardNext);

      if (atBookEdge) {
        showPull(0);
        return;
      }
      if (atEdge) {
        if (reach >= WHEEL_CHAPTER_PX) turnChapter(towardNext);
        else showPull((towardNext ? 1 : -1) * (reach / WHEEL_CHAPTER_PX));
        return;
      }
      if (optionsRef.current.pull.get() !== 0) showPull(0);
      if (reach >= WHEEL_STEP_PX) turnPage(towardNext);
      else showLean((towardNext ? 1 : -1) * (reach / WHEEL_STEP_PX));
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
      window.clearTimeout(quietTimer);
      headerProbe.remove();
    };
  }, [enabled, targetRef, stackRef]);
}

/** Static wheel stage — timeline rail + depth stack + optional pagination (Process Overview pattern). */
export default function EditorialCardWheelStage<T extends EditorialWheelMoment>({
  moments,
  activeIndex,
  onActiveIndexChange,
  ariaLabel,
  railLabel,
  reducedMotion = false,
  showTimeline = true,
  timelineInteractive = true,
  timelineClassName = '',
  layoutIdPrefix,
  className = '',
  stageClassName = '',
  stageMaxWidthClass = 'max-w-[920px]',
  stageMinHeight = EDITORIAL_STAGE_MIN_HEIGHT,
  panelId = 'editorial-card-wheel-panel',
  showPagination = true,
  canGoPrev = false,
  canGoNext = false,
  onRequestPrev,
  onRequestNext,
  navGroupLabel = 'Moment navigation',
  prevLabel = 'Previous moment',
  nextLabel = 'Next moment',
  paginationAriaLabel = 'Moments in this chapter',
  onKeyDown,
  tabIndex = 0,
  pinnedHeader,
  renderCard,
  titleIdPrefix,
  wheelScrub = false,
  hasNextChapter = false,
  hasPrevChapter = false,
  onNextChapter,
  onPrevChapter,
  indexPrefix = '',
  renderRail,
  swipe = false,
  peekRimPx,
  stackDepth,
}: EditorialCardWheelStageProps<T>) {
  const momentCount = moments.length;
  const clampedIndex = Math.max(0, Math.min(momentCount - 1, activeIndex));
  // The stack reads 0–1 progress across the deck, not a raw index.
  const targetProgress = progressFromIndex(clampedIndex, momentCount);
  const progress = useMotionValue(targetProgress);
  const pull = useMotionValue(0);
  const preview = useChapterPreview();
  const prevMomentsRef = useRef(moments);
  const scrubbingRef = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const deckChangedInRender = prevMomentsRef.current !== moments;
  // Cards of a newly arrived chapter rise into the stack instead of appearing in place.
  const dealIn = !reducedMotion && deckChangedInRender;
  // New chapter: its cards and page list mount reading progress, so it must already sit on
  // the new page; a write after mount can land before their subscriptions and be missed.
  if (deckChangedInRender && progress.get() !== targetProgress) progress.jump(targetProgress);

  useEffect(() => {
    // New chapter: land on its page directly instead of spinning through the old deck.
    const deckChanged = prevMomentsRef.current !== moments;
    prevMomentsRef.current = moments;
    if (reducedMotion || deckChanged) {
      progress.set(targetProgress);
      return;
    }
    // The wheel scrub is already driving progress toward this page.
    if (scrubbingRef.current) return;
    const controls = animate(progress, targetProgress, {
      type: 'spring',
      stiffness: CARD_SPRING.stiffness,
      damping: CARD_SPRING.damping,
      mass: CARD_SPRING.mass,
    });
    return () => controls.stop();
  }, [moments, targetProgress, progress, reducedMotion]);

  const goPrev = useCallback(() => {
    if (clampedIndex > 0) onActiveIndexChange(clampedIndex - 1);
    else onRequestPrev?.();
  }, [clampedIndex, onActiveIndexChange, onRequestPrev]);

  const goNext = useCallback(() => {
    if (clampedIndex < momentCount - 1) onActiveIndexChange(clampedIndex + 1);
    else onRequestNext?.();
  }, [clampedIndex, momentCount, onActiveIndexChange, onRequestNext]);

  useWheelScrub(rootRef, stackRef, wheelScrub, {
    progress,
    pull,
    preview,
    activeIndex: clampedIndex,
    momentCount,
    onActiveIndexChange,
    hasNextChapter,
    hasPrevChapter,
    onNextChapter,
    onPrevChapter,
    reducedMotion,
    scrubbingRef,
  });

  const swipeRef = useRef({ goNext, goPrev, atBookEnd: false });
  swipeRef.current = {
    goNext,
    goPrev,
    atBookEnd: clampedIndex >= momentCount - 1 && !hasNextChapter,
  };

  useEffect(() => {
    const el = stackRef.current;
    if (!swipe || !el) return;
    let start: { x: number; y: number; id: number } | null = null;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return;
      start = { x: e.clientX, y: e.clientY, id: e.pointerId };
    };
    const onUp = (e: PointerEvent) => {
      if (!start || e.pointerId !== start.id) return;
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      start = null;
      if (Math.abs(dx) < SWIPE_MIN_PX || Math.abs(dx) < Math.abs(dy) * 1.3) return;
      const s = swipeRef.current;
      if (dx < 0) {
        // A swipe never leaves the book; the exit is an explicit button.
        if (!s.atBookEnd) s.goNext();
      } else {
        s.goPrev();
      }
    };
    const onCancel = () => {
      start = null;
    };
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onCancel);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onCancel);
    };
  }, [swipe]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      goNext();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goPrev();
    }
    onKeyDown?.(e);
  };

  if (momentCount === 0) return null;

  const railControls = Boolean(renderRail) && showTimeline;
  const controls =
    showPagination && momentCount > 1 ? (
      <ProcessSlideControls
        slideCount={momentCount}
        activeSlideIndex={clampedIndex}
        onSlideSelect={onActiveIndexChange}
        onPrev={goPrev}
        onNext={goNext}
        canGoPrev={canGoPrev}
        canGoNext={canGoNext}
        reducedMotion={reducedMotion}
        layoutIdPrefix={layoutIdPrefix}
        navGroupLabel={navGroupLabel}
        prevLabel={prevLabel}
        nextLabel={nextLabel}
        paginationAriaLabel={paginationAriaLabel}
      />
    ) : null;

  return (
    <div
      ref={rootRef}
      className={`process-static-deck flex min-h-0 w-full min-w-0 flex-col ${className}`.trim()}
      onKeyDown={handleKeyDown}
      tabIndex={tabIndex}
    >
      {pinnedHeader ? (
        <div className="process-static-deck__nav shrink-0 pb-4 md:pb-5">{pinnedHeader}</div>
      ) : null}

      <div
        id={panelId}
        role="tabpanel"
        aria-label={ariaLabel}
        className={[
          'process-static-deck__stage mx-auto flex w-full',
          showTimeline
            ? 'editorial-card-wheel-stage flex-col gap-5 md:flex-row md:items-start md:gap-8'
            : 'flex-col',
          stageMaxWidthClass,
          stageClassName,
        ]
          .filter(Boolean)
          .join(' ')}
        style={{ minHeight: stageMinHeight }}
      >
        {showTimeline && renderRail
          ? renderRail({
              progress,
              momentCount,
              activeIndex: clampedIndex,
              onSelectMoment: onActiveIndexChange,
              controls,
            })
          : null}
        {showTimeline && !renderRail ? (
          <NarrativeTimeline
            progress={progress}
            moments={moments}
            railLabel={railLabel}
            momentCount={momentCount}
            onSelectMoment={timelineInteractive ? onActiveIndexChange : undefined}
            indexPrefix={indexPrefix}
            className={timelineClassName}
          />
        ) : null}

        <motion.div
          ref={stackRef}
          className={`process-scroll-stage flex min-h-0 min-w-0 w-full flex-1${swipe ? ' process-scroll-stage--swipe' : ''}`}
          style={{ y: pull }}
        >
          <EditorialCardWheelViewport
            moments={moments}
            progress={progress}
            reducedMotion={reducedMotion}
            stageMinHeight={stageMinHeight}
            renderCard={renderCard}
            titleIdPrefix={titleIdPrefix}
            dealIn={dealIn}
            peekRimPx={peekRimPx}
            stackDepth={stackDepth}
          />
        </motion.div>
      </div>

      {controls && !railControls ? (
        <div
          className={[
            'process-static-deck__pagination mx-auto w-full shrink-0 pt-3',
            stageMaxWidthClass,
          ].join(' ')}
        >
          {controls}
        </div>
      ) : null}
    </div>
  );
}

export { NarrativeTimeline };
