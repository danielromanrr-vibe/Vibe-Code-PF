import { useCallback, useEffect, useRef, type KeyboardEvent, type ReactNode, type RefObject } from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';
import ProcessSlideControls from './ProcessSlideControls';
import { useOverlayTrackProgress } from '../hooks/useOverlayTrackProgress';
import {
  CARD_SPRING,
  EDITORIAL_STAGE_MIN_HEIGHT,
  getCardStackMotion,
  nearestStepIndex,
  progressFromIndex,
  scrollPosition,
} from './editorialCardWheelMotion';

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
    if (v > index + 0.45) return 0.58;
    if (v >= index - 0.08 && v <= index + 0.45) return 1;
    return 0.34;
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
            className="font-eyebrow text-[0.625rem] tabular-nums tracking-[0.04em] text-ink/28"
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
  slotIndex,
  momentCount,
  scrollProgress,
  reducedMotion,
  titleId,
  children,
}: {
  moment: EditorialWheelMoment;
  slotIndex: number;
  momentCount: number;
  scrollProgress: MotionValue<number>;
  reducedMotion: boolean;
  titleId: string;
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
        aria-labelledby={titleId}
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
}: {
  moments: readonly T[];
  progress: MotionValue<number>;
  reducedMotion: boolean;
  stageMinHeight?: string;
  titleIdPrefix?: string;
  renderCard: (moment: T, index: number, titleId: string) => ReactNode;
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
              titleId={titleId}
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

      const trackRect = track.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const trackTopInContainer = container.scrollTop + (trackRect.top - containerRect.top);
      const stepHeight = track.offsetHeight / momentCount;
      const targetScroll = trackTopInContainer + stepHeight * index + stepHeight * 0.08;
      container.scrollTo({ top: targetScroll, behavior: 'auto' });
      return true;
    },
    [momentCount, scrollContainerRef],
  );

  /** Cards always follow index. Overlay scroll is applied when the container is available. */
  const goToMoment = useCallback(
    (index: number) => {
      const next = Math.max(0, Math.min(momentCount - 1, index));
      suppressScrollDriveRef.current = true;
      wheelProgress.set(progressFromIndex(next, momentCount));
      onActiveIndexChange(next);
      tryScrollContainerToIndex(next);
      requestAnimationFrame(() => {
        suppressScrollDriveRef.current = false;
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

    goToMoment(0);
  }, [deckKey, goToMoment]);

  useEffect(() => {
    if (scrollSessionKey == null || initialScrollIndex == null) return;
    if (!trackRef.current || !scrollContainerRef.current) return;
    const frame = requestAnimationFrame(() => goToMoment(initialScrollIndex));
    return () => cancelAnimationFrame(frame);
  }, [scrollSessionKey, initialScrollIndex, goToMoment]);

  const trackHeightVh = momentCount * scrollVhPerStep;
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
                navGroupLabel="Moment navigation"
                prevLabel="Previous moment"
                nextLabel="Next moment"
                paginationAriaLabel="Moments in this chapter"
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
};

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
}: EditorialCardWheelStageProps<T>) {
  const momentCount = moments.length;
  const clampedIndex = Math.max(0, Math.min(momentCount - 1, activeIndex));
  const progress = useMotionValue(clampedIndex);

  useEffect(() => {
    if (reducedMotion) {
      progress.set(clampedIndex);
      return;
    }
    const controls = animate(progress, clampedIndex, {
      type: 'spring',
      stiffness: CARD_SPRING.stiffness,
      damping: CARD_SPRING.damping,
      mass: CARD_SPRING.mass,
    });
    return () => controls.stop();
  }, [clampedIndex, progress, reducedMotion]);

  const goPrev = useCallback(() => {
    if (clampedIndex > 0) onActiveIndexChange(clampedIndex - 1);
    else onRequestPrev?.();
  }, [clampedIndex, onActiveIndexChange, onRequestPrev]);

  const goNext = useCallback(() => {
    if (clampedIndex < momentCount - 1) onActiveIndexChange(clampedIndex + 1);
    else onRequestNext?.();
  }, [clampedIndex, momentCount, onActiveIndexChange, onRequestNext]);

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

        <div className="process-scroll-stage flex min-h-0 min-w-0 w-full flex-1">
          <EditorialCardWheelViewport
            moments={moments}
            progress={progress}
            reducedMotion={reducedMotion}
            stageMinHeight={stageMinHeight}
            renderCard={renderCard}
            titleIdPrefix={titleIdPrefix}
          />
        </div>
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
