import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { motion } from 'motion/react';
import CarouselPagination from './CarouselPagination';

export type ProjectCarouselSlide = {
  image: string;
  alt: string;
  caption: string;
  objectPosition?: string;
  imageScale?: number;
};

export type ProjectCarouselProps = {
  slides: ProjectCarouselSlide[];
  projectKey: string;
  ariaLabel: string;
  reducedMotion?: boolean;
  className?: string;
  /** When set, desktop slide widths follow homepage editorial bleed (peek on the open edge). */
  bleedEdge?: 'leading' | 'trailing';
  /**
   * Featured homepage: fixed landscape frame aligned to Scope/Impact panel
   * (not intrinsic image height).
   */
  layout?: 'default' | 'featuredFixed';
};

const AUTOPLAY_MS = 4500;
const RESUME_AFTER_MS = 8000;

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

export default function ProjectCarousel({
  slides,
  projectKey,
  ariaLabel,
  reducedMotion = false,
  className = '',
  bleedEdge,
  layout = 'default',
}: ProjectCarouselProps) {
  const featuredFixed = layout === 'featuredFixed';
  const peekSlideClass =
    bleedEdge === 'leading'
      ? 'w-[88%] min-w-[88%] md:w-[calc(100%-2.5rem)] md:min-w-[calc(100%-2.5rem)]'
      : 'w-[88%] min-w-[88%] md:w-[calc(100%-2.5rem)] md:min-w-[calc(100%-2.5rem)]';
  const slideSizeClass = featuredFixed || bleedEdge ? peekSlideClass : 'w-[88%] min-w-[88%]';
  const viewportRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  activeIndexRef.current = activeIndex;

  const pausedRef = useRef({
    hover: false,
    focusWithin: false,
    drag: false,
    manualScroll: false,
  });
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [inView, setInView] = useState(false);

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

  const slidesKey = useMemo(() => slides.map((s) => s.image).join('|'), [slides]);

  const syncActiveFromScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || slides.length === 0) return;
    const stride = readScrollStride(el);
    if (stride <= 0) return;
    const next = Math.round(el.scrollLeft / stride);
    const clamped = Math.max(0, Math.min(slides.length - 1, next));
    setActiveIndex((prev) => (prev === clamped ? prev : clamped));
  }, [slides.length]);

  useEffect(() => {
    pausedRef.current.manualScroll = false;
    pausedRef.current.drag = false;
    setActiveIndex(0);

    const el = scrollRef.current;
    if (!el) return;

    const resetScroll = () => {
      el.scrollLeft = 0;
      syncActiveFromScroll();
    };

    resetScroll();
    const raf1 = requestAnimationFrame(() => {
      resetScroll();
      requestAnimationFrame(resetScroll);
    });

    return () => cancelAnimationFrame(raf1);
  }, [projectKey, slidesKey, syncActiveFromScroll]);

  const onScrollThrottled = useThrottleCallback(syncActiveFromScroll, 72);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      onScrollThrottled();
      pausedRef.current.manualScroll = true;
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = setTimeout(() => {
        pausedRef.current.manualScroll = false;
        resumeTimerRef.current = null;
      }, RESUME_AFTER_MS);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, [onScrollThrottled, projectKey]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      syncActiveFromScroll();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [syncActiveFromScroll, projectKey]);

  useEffect(() => {
    const root = viewportRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      ([e]) => {
        const ratio = e?.intersectionRatio ?? 0;
        setInView(!!e?.isIntersecting && ratio >= 0.42);
      },
      { threshold: [0, 0.25, 0.42, 0.55, 0.75, 1] },
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (slides.length <= 1 || !inView || reducedMotion) return;
    if (
      pausedRef.current.hover ||
      pausedRef.current.focusWithin ||
      pausedRef.current.drag ||
      pausedRef.current.manualScroll
    )
      return;

    const id = window.setInterval(() => {
      const p = pausedRef.current;
      if (p.hover || p.focusWithin || p.drag || p.manualScroll || !viewportRef.current) return;
      const r = viewportRef.current.getBoundingClientRect();
      if (r.height <= 0 || r.bottom < 0 || r.top > window.innerHeight) return;

      const next = (activeIndexRef.current + 1) % slides.length;
      scrollToIndex(next, 'smooth');
    }, AUTOPLAY_MS);

    return () => window.clearInterval(id);
  }, [slides.length, inView, reducedMotion, scrollToIndex, projectKey]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (slides.length <= 1) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollToIndex(activeIndex + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollToIndex(activeIndex - 1);
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
      className={`flex min-w-0 w-full flex-col ${featuredFixed ? 'min-h-0 flex-1' : 'md:min-h-0 md:flex-1'} ${className}`}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
    >
      <motion.div
        ref={viewportRef}
        className={`relative w-full min-w-0 bg-transparent ${
          featuredFixed
            ? 'home-featured-media-viewport shrink-0 overflow-hidden'
            : 'overflow-x-visible overflow-y-visible md:flex md:min-h-0 md:flex-1 md:flex-col'
        }`}
        initial={featuredFixed || reducedMotion ? false : { opacity: 0.88, y: 10 }}
        whileInView={featuredFixed || reducedMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.22 }}
        transition={{ duration: 0.45, ease: [0.22, 0.85, 0.24, 1] }}
        onMouseEnter={() => {
          pausedRef.current.hover = true;
        }}
        onMouseLeave={() => {
          pausedRef.current.hover = false;
        }}
        onPointerDown={() => {
          pausedRef.current.drag = true;
        }}
        onPointerUp={() => {
          pausedRef.current.drag = false;
        }}
        onPointerCancel={() => {
          pausedRef.current.drag = false;
        }}
      >
        <div
          ref={scrollRef}
          tabIndex={0}
          className={`flex gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth pb-1 pl-0 pr-0 [-ms-overflow-style:none] [scrollbar-width:none] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F9FA] [&::-webkit-scrollbar]:hidden ${
            featuredFixed ? 'h-full max-h-full items-stretch' : 'md:min-h-0 md:flex-1 md:items-stretch'
          }`}
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
          }}
          onKeyDown={onKeyDown}
          onFocus={() => {
            pausedRef.current.focusWithin = true;
          }}
          onBlur={(e) => {
            if (!scrollRef.current?.contains(e.relatedTarget as Node)) {
              pausedRef.current.focusWithin = false;
            }
          }}
        >
          {slides.map((slide, i) => (
            <article
              key={`${projectKey}-${slide.image}-${i}`}
              className={`flex shrink-0 snap-start flex-col overflow-hidden border border-ink/10 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_40px_-18px_rgba(20,20,20,0.12)] ${
                featuredFixed
                  ? 'home-featured-carousel-slide h-full max-h-full min-h-0 rounded-2xl md:rounded-r-none'
                  : 'rounded-2xl md:h-full md:min-h-0'
              } ${slideSizeClass}`}
            >
              <div
                className={`relative w-full overflow-hidden ${
                  featuredFixed
                    ? 'h-full min-h-0 max-h-full'
                    : 'min-h-[12rem] max-md:aspect-video md:min-h-0 md:flex-1'
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.alt}
                  className={
                    featuredFixed
                      ? 'absolute inset-0 h-full w-full max-h-full object-cover'
                      : 'h-full w-full object-cover'
                  }
                  style={{
                    objectPosition: slide.objectPosition ?? '50% 50%',
                    transform: slide.imageScale != null ? `scale(${slide.imageScale})` : undefined,
                  }}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  draggable={false}
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] flex justify-start bg-gradient-to-t from-black/30 via-black/10 to-transparent px-3 pb-2.5 pt-12 md:px-4 md:pb-3 md:pt-14">
                  <p className="media-caption-float pointer-events-none">{slide.caption}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </motion.div>

      <div className={featuredFixed ? 'home-featured-carousel-pagination shrink-0' : 'shrink-0'}>
        <CarouselPagination
          count={slides.length}
          activeIndex={activeIndex}
          reducedMotion={reducedMotion}
          variant="organic"
          layoutIdPrefix={`featured-work-${projectKey}`}
          onSelect={(i) => {
            pausedRef.current.manualScroll = true;
            scrollToIndex(i);
            if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
            resumeTimerRef.current = setTimeout(() => {
              pausedRef.current.manualScroll = false;
              resumeTimerRef.current = null;
            }, RESUME_AFTER_MS);
          }}
        />
      </div>

      <p className="sr-only" aria-live="polite">
        Slide {activeIndex + 1} of {slides.length}: {slides[activeIndex]?.caption}
      </p>
    </div>
  );
}
