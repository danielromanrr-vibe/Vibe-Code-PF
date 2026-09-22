import {
  useCallback,
  useEffect,
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
  STACK_PEEK_Y,
} from './editorialCardWheelMotion';
import { useChapterPreview } from './chapterPreview';

/** Scroll track depth per card — wheel scrubs inside pinned viewport */
export const SCROLL_VH_PER_STEP = 42;

export type EditorialWheelMoment = {
  id: string;
  title: string;
};

function formatMomentIndex(n: number): string {
  return String(n);
}

function NarrativeTimeline<T extends EditorialWheelMoment>({
  progress,
  moments,
  railLabel,
  momentCount,
  onSelectMoment,
  className = '',
}: {
  progress: MotionValue<number>;
  moments: readonly T[];
  railLabel: string;
  momentCount: number;
  onSelectMoment?: (index: number) => void;
  className?: string;
}) {
  const activeFloat = useTransform(progress, (p) => scrollPosition(p, momentCount));
  const fillScale = useTransform(progress, (p) => {
    if (momentCount <= 1) return 1;
    return scrollPosition(p, momentCount) / Math.max(1, momentCount - 1);
  });

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
      <div className="process-chapter-outline__list relative flex min-h-0 flex-1 flex-col">
        <div
          className="process-chapter-outline__spine pointer-events-none absolute bottom-0 left-0 top-0 w-px bg-ink/[0.08]"
          aria-hidden
        >
          <motion.div
            className="process-chapter-outline__spine-fill absolute inset-x-0 top-0 h-full origin-top bg-ink/30"
            style={{ scaleY: fillScale }}
          />
        </div>

        <ol className="process-chapter-outline__nodes relative m-0 flex list-none flex-col justify-between gap-0 p-0">
          {moments.map((moment, i) => (
            <TimelineNode
              key={moment.id}
              moment={moment}
              index={i}
              activeFloat={activeFloat}
              onSelect={onSelectMoment}
            />
          ))}
        </ol>
      </div>
    </aside>
  );
}

function TimelineNode<T extends EditorialWheelMoment>({
  moment,
  index,
  activeFloat,
  onSelect,
}: {
  moment: T;
  index: number;
  activeFloat: MotionValue<number>;
  onSelect?: (index: number) => void;
}) {
  const state = useTransform(activeFloat, (v) => {
    if (v > index + 0.45) return 'completed';
    if (v >= index - 0.08 && v <= index + 0.45) return 'active';
    return 'upcoming';
  });

  const borderColor = useTransform(state, (s) =>
    s === 'active' ? 'rgba(20, 20, 20, 0.82)' : s === 'completed' ? 'rgba(20, 20, 20, 0.16)' : 'rgba(20, 20, 20, 0.06)',
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
            {formatMomentIndex(chapterMoment)}
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
  children,
}: {
  moment: EditorialWheelMoment;
  slotIndex: number;
  momentCount: number;
  scrollProgress: MotionValue<number>;
  reducedMotion: boolean;
  dealIn?: boolean;
  children: ReactNode;
}) {
  const rawY = useTransform(scrollProgress, (p) => getCardStackMotion(slotIndex, p, momentCount).y);
  const rawOpacity = useTransform(scrollProgress, (p) => getCardStackMotion(slotIndex, p, momentCount).opacity);
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
}: {
  moments: readonly T[];
  progress: MotionValue<number>;
  reducedMotion: boolean;
  stageMinHeight?: string;
  titleIdPrefix?: string;
  renderCard: (moment: T, index: number, titleId: string) => ReactNode;
  /** Cards mounting now rise from the back of the stack into their places. */
  dealIn?: boolean;
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
  /** Wheel over the card stack scrubs pages; wheel anywhere else scrolls the page. */
  wheelScrub?: boolean;
  /** Chapter handoff for the scrub — pulling past the first/last page turns the chapter. */
  hasNextChapter?: boolean;
  hasPrevChapter?: boolean;
  onNextChapter?: () => void;
  onPrevChapter?: () => void;
};

/** Wheel travel per page as a share of viewport height — the depth of the old scroll track. */
const WHEEL_PAGE_VH = 0.34;
const WHEEL_PAGE_MIN_PX = 200;
const WHEEL_PAGE_MAX_PX = 340;
/** Quiet time after the last wheel event before the deck settles on a page. */
const WHEEL_SETTLE_MS = 140;
/** A released scrub past this share of a page lands on the page it was heading to. */
const WHEEL_INTENT = 0.2;
/** Events closer than this with non-growing delta belong to the same gesture (trackpad inertia). */
const WHEEL_INERTIA_GAP_MS = 110;
/** Share of the card stack that must be on screen before the wheel is captured. */
const WHEEL_ENGAGE_VISIBLE = 0.85;
/** Pull past a chapter's edge (in pages) that turns to the neighbouring chapter. */
const CHAPTER_COMMIT = 0.5;
/** How far the chapter underline leans toward its neighbour at the commit point. */
const CHAPTER_PREVIEW_MAX = 0.35;
/** Rubber-band offset of the stack at the commit point (px). */
const CHAPTER_PULL_PX = 28;
const SETTLE_EASE = [0.22, 0.82, 0.24, 1] as const;
const PULL_RELEASE_SPRING = { type: 'spring' as const, stiffness: 380, damping: 32, mass: 0.7 };

type WheelScrubOptions = {
  progress: MotionValue<number>;
  pull: MotionValue<number>;
  preview: MotionValue<number> | null;
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
 * Scoped wheel scrub: cards follow the wheel over the stack, then settle on a page.
 * Pulling past a chapter's edge leans toward the next chapter and turns it past a threshold.
 * At the ends of the book (or with the stack off screen) the wheel stays with the page.
 * Never writes the page's scroll position.
 */
function useWheelScrub(
  targetRef: RefObject<HTMLElement | null>,
  enabled: boolean,
  options: WheelScrubOptions,
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const el = targetRef.current;
    if (!enabled || !el) return;

    /** Position in pages; runs past [0, last] while pulling toward a chapter. */
    let pos = 0;
    /** Page the current scrub started from — the reference for release intent. */
    let base = 0;
    let lastIndex = -1;
    let owner: 'deck' | 'page' = 'page';
    let swallowRest = false;
    let lastTime = 0;
    let lastMagnitude = 0;
    let settleTimer = 0;

    const pagePx = () =>
      clampTo(window.innerHeight * WHEEL_PAGE_VH, WHEEL_PAGE_MIN_PX, WHEEL_PAGE_MAX_PX);

    const isEngaged = () => {
      const rect = el.getBoundingClientRect();
      const visible = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
      return visible >= Math.min(rect.height, window.innerHeight) * WHEEL_ENGAGE_VISIBLE;
    };

    const setIndex = (index: number) => {
      if (index === lastIndex) return;
      lastIndex = index;
      optionsRef.current.onActiveIndexChange(index);
    };

    /** Signed pull in pages beyond the chapter edge. */
    const showPull = (over: number) => {
      const { pull, preview } = optionsRef.current;
      const share = clampTo(over / CHAPTER_COMMIT, -1, 1);
      pull.set(-CHAPTER_PULL_PX * share);
      preview?.set(CHAPTER_PREVIEW_MAX * share);
    };

    const releasePull = () => {
      const { pull, preview, reducedMotion } = optionsRef.current;
      const transition = reducedMotion ? { duration: 0 } : PULL_RELEASE_SPRING;
      if (pull.get() !== 0) animate(pull, 0, transition);
      if (preview && preview.get() !== 0) animate(preview, 0, transition);
    };

    const settle = () => {
      settleTimer = 0;
      const { progress, momentCount, reducedMotion, scrubbingRef } = optionsRef.current;
      const last = Math.max(0, momentCount - 1);
      const clamped = clampTo(pos, 0, last);
      let target = Math.round(clamped);
      const moved = clamped - base;
      if (target === base && Math.abs(moved) >= WHEEL_INTENT) target = base + Math.sign(moved);
      target = clampTo(target, 0, last);
      pos = target;
      base = target;
      scrubbingRef.current = false;
      setIndex(target);
      releasePull();
      const to = progressFromIndex(target, momentCount);
      if (reducedMotion) progress.set(to);
      else animate(progress, to, { type: 'tween', duration: 0.28, ease: SETTLE_EASE });
    };

    const scheduleSettle = () => {
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(settle, WHEEL_SETTLE_MS);
    };

    const commitChapter = (turn: () => void) => {
      window.clearTimeout(settleTimer);
      settleTimer = 0;
      swallowRest = true;
      optionsRef.current.scrubbingRef.current = false;
      turn();
      // After the new chapter commits, so the underline slides on from where it leaned.
      requestAnimationFrame(releasePull);
    };

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey) return;
      const dy = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY;
      if (dy === 0 || Math.abs(event.deltaX) > Math.abs(dy)) return;

      const now = performance.now();
      const magnitude = Math.abs(dy);
      // A pause or a fresh acceleration starts a gesture; a steady or decaying stream is its tail.
      const newGesture =
        now - lastTime > WHEEL_INERTIA_GAP_MS || magnitude > lastMagnitude * 1.5 + 4;
      lastTime = now;
      lastMagnitude = magnitude;

      const o = optionsRef.current;
      const last = Math.max(0, o.momentCount - 1);
      const forward = dy > 0;

      if (newGesture) {
        swallowRest = false;
        if (!isEngaged()) {
          // Momentum carried in from a page scroll stays with the page.
          owner = 'page';
        } else {
          if (!o.scrubbingRef.current) {
            // Resync with clicks, keys and chapter turns since the last scrub.
            pos = last > 0 ? Math.round(o.progress.get() * last) : 0;
            base = pos;
            lastIndex = pos;
          }
          const atBookEdge = forward
            ? pos >= last && !o.hasNextChapter
            : pos <= 0 && !o.hasPrevChapter;
          owner = atBookEdge ? 'page' : 'deck';
        }
      }
      if (owner !== 'deck') return;

      event.preventDefault();
      // Tail of a gesture that already turned a chapter or hit the end of the book.
      if (swallowRest) return;

      o.progress.stop();
      o.scrubbingRef.current = true;
      pos += dy / pagePx();

      if (pos > last) {
        if (!o.hasNextChapter || !o.onNextChapter) {
          pos = last;
          swallowRest = true;
        } else if (pos - last >= CHAPTER_COMMIT) {
          commitChapter(o.onNextChapter);
          return;
        } else {
          showPull(pos - last);
        }
      } else if (pos < 0) {
        if (!o.hasPrevChapter || !o.onPrevChapter) {
          pos = 0;
          swallowRest = true;
        } else if (-pos >= CHAPTER_COMMIT) {
          commitChapter(o.onPrevChapter);
          return;
        } else {
          showPull(pos);
        }
      } else if (o.pull.get() !== 0) {
        showPull(0);
      }

      const clamped = clampTo(pos, 0, last);
      o.progress.set(last > 0 ? clamped / last : 0);
      setIndex(Math.round(clamped));
      scheduleSettle();
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
      window.clearTimeout(settleTimer);
    };
  }, [enabled, targetRef]);
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
  const stackRef = useRef<HTMLDivElement>(null);
  // Cards of a newly arrived chapter rise into the stack instead of appearing in place.
  const dealIn = !reducedMotion && prevMomentsRef.current !== moments;

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

  useWheelScrub(stackRef, wheelScrub, {
    progress,
    pull,
    preview,
    momentCount,
    onActiveIndexChange,
    hasNextChapter,
    hasPrevChapter,
    onNextChapter,
    onPrevChapter,
    reducedMotion,
    scrubbingRef,
  });

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

  return (
    <div
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
        {showTimeline ? (
          <NarrativeTimeline
            progress={progress}
            moments={moments}
            railLabel={railLabel}
            momentCount={momentCount}
            onSelectMoment={timelineInteractive ? onActiveIndexChange : undefined}
            className={timelineClassName}
          />
        ) : null}

        <motion.div
          ref={stackRef}
          className="process-scroll-stage flex min-h-0 min-w-0 w-full flex-1"
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
          />
        </motion.div>
      </div>

      {showPagination && momentCount > 1 ? (
        <div
          className={[
            'process-static-deck__pagination mx-auto w-full shrink-0 pt-3',
            stageMaxWidthClass,
          ].join(' ')}
        >
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
        </div>
      ) : null}
    </div>
  );
}

export { NarrativeTimeline };
