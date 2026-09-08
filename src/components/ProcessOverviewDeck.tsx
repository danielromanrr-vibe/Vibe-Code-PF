import {
  useCallback,
  useEffect,
  useRef,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import type { ProcessPresentationSlide } from './AdoptProcessOverview';
import ProcessSlideControls from './ProcessSlideControls';

export type ProcessOverviewDeckProps = {
  chapterKey: string;
  slides: ProcessPresentationSlide[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  ariaLabel: string;
  reducedMotion?: boolean;
  renderMedia: (slide: ProcessPresentationSlide, index: number) => ReactNode;
  /** Called when user requests next slide past the last (e.g. ArrowRight). */
  onRequestNextChapter?: () => void;
  /** Called when user requests previous slide before the first. */
  onRequestPrevChapter?: () => void;
  canGoPrev?: boolean;
  canGoNext?: boolean;
  className?: string;
};

function useThrottleCallback<T extends (...args: unknown[]) => void>(fn: T, ms: number): T {
  const last = useRef(0);
  const fnRef = useRef(fn);
  fnRef.current = fn;
  return useCallback(
    ((...args: unknown[]) => {
      const now = performance.now();
      if (now - last.current >= ms) {
        last.current = now;
        fnRef.current(...args);
      }
    }) as T,
    [ms],
  );
}

function readScrollStride(scrollEl: HTMLDivElement): number {
  const first = scrollEl.firstElementChild as HTMLElement | null;
  if (!first) return scrollEl.clientWidth;
  const style = getComputedStyle(scrollEl);
  const gap = parseFloat(style.columnGap || style.gap || '0') || 0;
  return first.offsetWidth + gap;
}

/** Contained peek — next card edge visible; no viewport-margin bleed. */
const slideSizeClass =
  'w-[calc(100%-1.5rem)] min-w-[calc(100%-1.5rem)] md:w-[calc(100%-2.25rem)] md:min-w-[calc(100%-2.25rem)]';

/**
 * Horizontal scroll-snap deck — same gesture model as homepage ProjectCarousel.
 * No autoplay; organic dot pagination per chapter.
 */
export default function ProcessOverviewDeck({
  chapterKey,
  slides,
  activeIndex,
  onActiveIndexChange,
  ariaLabel,
  reducedMotion = false,
  renderMedia,
  onRequestNextChapter,
  onRequestPrevChapter,
  canGoPrev = false,
  canGoNext = false,
  className = '',
}: ProcessOverviewDeckProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;

  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = 'smooth') => {
      const el = scrollRef.current;
      if (!el) return;
      const stride = readScrollStride(el);
      if (stride <= 0) return;
      const clamped = Math.max(0, Math.min(slides.length - 1, index));
      el.scrollTo({ left: clamped * stride, behavior: reducedMotion ? 'auto' : behavior });
    },
    [slides.length, reducedMotion],
  );

  const syncActiveFromScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || slides.length === 0) return;
    const stride = readScrollStride(el);
    if (stride <= 0) return;
    const next = Math.round(el.scrollLeft / stride);
    const clamped = Math.max(0, Math.min(slides.length - 1, next));
    if (clamped !== activeIndexRef.current) {
      onActiveIndexChange(clamped);
    }
  }, [slides.length, onActiveIndexChange]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const resetScroll = () => {
      el.scrollLeft = 0;
      syncActiveFromScroll();
    };
    resetScroll();
    const raf = requestAnimationFrame(() => {
      resetScroll();
      requestAnimationFrame(resetScroll);
    });
    return () => cancelAnimationFrame(raf);
  }, [chapterKey, slides.length, syncActiveFromScroll]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || slides.length === 0) return;
    const stride = readScrollStride(el);
    if (stride <= 0) return;
    const target = activeIndex * stride;
    if (Math.abs(el.scrollLeft - target) > 8) {
      scrollToIndex(activeIndex, reducedMotion ? 'auto' : 'smooth');
    }
  }, [activeIndex, chapterKey, scrollToIndex, reducedMotion, slides.length]);

  const onScrollThrottled = useThrottleCallback(syncActiveFromScroll, 72);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => onScrollThrottled();
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [onScrollThrottled, chapterKey]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => syncActiveFromScroll());
    ro.observe(el);
    return () => ro.disconnect();
  }, [syncActiveFromScroll, chapterKey]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (slides.length === 0) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (activeIndex < slides.length - 1) {
        scrollToIndex(activeIndex + 1);
      } else {
        onRequestNextChapter?.();
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (activeIndex > 0) {
        scrollToIndex(activeIndex - 1);
      } else {
        onRequestPrevChapter?.();
      }
    } else if (e.key === 'Home') {
      e.preventDefault();
      scrollToIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      scrollToIndex(slides.length - 1);
    }
  };

  if (slides.length === 0) return null;

  return (
    <div
      className={`flex min-h-0 w-full min-w-0 flex-col ${className}`}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
    >
      <div
        id="process-overview-deck-panel"
        role="tabpanel"
        className="process-overview-deck-viewport relative w-full min-w-0 shrink-0"
      >
        <div
          ref={scrollRef}
          tabIndex={0}
          className="process-overview-deck-scroll flex h-full max-h-full items-start gap-4 overflow-x-auto overflow-y-visible overscroll-x-contain scroll-smooth pb-8 [-ms-overflow-style:none] [scrollbar-width:none] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F9FA] [&::-webkit-scrollbar]:hidden md:pb-10"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
          }}
          onKeyDown={onKeyDown}
        >
          {slides.map((slide, i) => {
            const hasMedia = Boolean(slide.media);

            return (
              <article
                key={`${chapterKey}-${slide.id}`}
                className={`process-overview-deck-slide flex shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_40px_-18px_rgba(12,21,40,0.12)] ${slideSizeClass}`}
                aria-label={`Slide ${i + 1} of ${slides.length}`}
              >
                <div
                  className={`flex h-full min-h-0 flex-1 flex-col ${
                    hasMedia
                      ? slide.mediaFirst
                        ? 'md:flex-row-reverse'
                        : 'md:flex-row'
                      : ''
                  }`}
                >
                  {hasMedia && slide.media ? (
                    <div
                      className="process-overview-deck-media relative min-h-[min(56vw,280px)] min-w-0 flex-1 overflow-hidden bg-ink/[0.03] md:aspect-[4/3] md:min-h-0"
                      aria-label={slide.media.ariaLabel}
                    >
                      <div className="absolute inset-0 min-h-0">{renderMedia(slide, i)}</div>
                    </div>
                  ) : null}

                  <div
                    className={`process-overview-deck-slab flex min-h-0 flex-col justify-center ${
                      hasMedia
                        ? 'shrink-0 border-t border-ink/10 bg-ink/[0.04] px-5 py-5 md:w-[min(100%,22rem)] md:border-t-0 md:border-ink/10 md:px-6 md:py-6'
                        : 'flex-1 bg-ink/[0.04] px-6 py-8 md:px-8 md:py-9'
                    } ${hasMedia && !slide.mediaFirst ? 'md:border-r md:border-ink/10' : ''} ${hasMedia && slide.mediaFirst ? 'md:border-l md:border-ink/10' : ''}`}
                  >
                    {slide.text.heading ? (
                      <h3 className="adopt-card-title mb-3 text-balance leading-snug md:mb-3.5">
                        {slide.text.heading}
                      </h3>
                    ) : null}
                    <p className="adopt-body mb-0 max-w-[42ch] text-pretty text-ink/72">
                      {slide.text.body}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="process-overview-deck-pagination shrink-0 pt-3 md:pt-3.5">
        <ProcessSlideControls
          slideCount={slides.length}
          activeSlideIndex={activeIndex}
          onSlideSelect={(i) => {
            onActiveIndexChange(i);
            scrollToIndex(i);
          }}
          onPrev={() => {
            if (activeIndex > 0) {
              const next = activeIndex - 1;
              onActiveIndexChange(next);
              scrollToIndex(next);
            } else {
              onRequestPrevChapter?.();
            }
          }}
          onNext={() => {
            if (activeIndex < slides.length - 1) {
              const next = activeIndex + 1;
              onActiveIndexChange(next);
              scrollToIndex(next);
            } else {
              onRequestNextChapter?.();
            }
          }}
          canGoPrev={canGoPrev}
          canGoNext={canGoNext}
          reducedMotion={reducedMotion}
          layoutIdPrefix={`process-deck-${chapterKey}`}
        />
      </div>

      <p className="sr-only" aria-live="polite">
        Slide {activeIndex + 1} of {slides.length}
      </p>
    </div>
  );
}
