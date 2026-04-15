/**
 * Zoom-in window: same size as static media window. Default = hero only.
 * User controls view via + button in caption (bottom right): view more (grid) or view less (hero).
 * If the expanded (grid) state is open and this window leaves the viewport, it auto-closes
 * so multiple featured-work tabs don’t keep many grids open at once.
 */
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import type { GalleryImage } from './EditorialGalleryModal';

type Props = {
  children: React.ReactNode;
  caption?: React.ReactNode;
  galleryImages?: GalleryImage[];
  /** When true, non-hero gallery images stack in one column at full width (no flex-wrap row). */
  galleryStackFullWidth?: boolean;
  /** Hero image fit in the media window. `contain` shows full image within the box (no crop). Default `cover`. */
  heroFit?: 'cover' | 'contain';
  projectTitle?: string;
  subtitle?: string;
  /**
   * When there is no gallery but `caption` is set, render the same bordered window shell
   * (media area + caption strip) without the expand affordance.
   */
  mediaAreaClassName?: string;
};

const PARALLAX_RATE = 0.15;
const SPRING = { stiffness: 150, damping: 25 };
const CLOSE_DURATION_S = 0.42;
const OPEN_DURATION_S = 0.52;
const OPEN_OFFSET_PX = 14;
const EDITORIAL_EASE = [0.22, 0.61, 0.36, 1]; /* smooth, editorial */

export default function ZoomInWindow({
  children,
  caption,
  galleryImages,
  galleryStackFullWidth = false,
  heroFit = 'cover',
  mediaAreaClassName,
}: Props) {
  const [affordanceActivated, setAffordanceActivated] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const expandedRef = useRef(false);
  expandedRef.current = affordanceActivated;
  const y = useMotionValue(0);
  const springY = useSpring(y, SPRING);

  const hasGallery = galleryImages && galleryImages.length > 0;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !hasGallery || !affordanceActivated) return;
    const node = el;

    function update() {
      y.set(node.scrollTop * PARALLAX_RATE);
    }

    update();
    node.addEventListener('scroll', update, { passive: true });
    return () => node.removeEventListener('scroll', update);
  }, [y, hasGallery, affordanceActivated]);

  useEffect(() => {
    if (!hasGallery) return;
    const el = containerRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting && expandedRef.current) {
          setIsClosing(true);
        }
      },
      { root: null, threshold: 0 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [hasGallery]);

  if (!hasGallery) {
    if (caption != null) {
      return (
        <div className="w-full rounded-lg overflow-hidden border border-ink/20">
          <div
            className={
              mediaAreaClassName ?? 'media-window-content bg-ink/5 overflow-hidden relative flex items-center justify-center'
            }
          >
            {children}
          </div>
          <div className="border-t border-ink/20 bg-ink/5 px-4 py-3">
            <div className="min-w-0 flex flex-col gap-1.5">{caption}</div>
          </div>
        </div>
      );
    }
    return <>{children}</>;
  }

  const hero = galleryImages!.find((i): i is { src: string; isHero?: boolean } => 'src' in i && !!i.isHero) ?? galleryImages!.find((i): i is { src: string; isHero?: boolean } => 'src' in i);
  const gridImages = galleryImages!.filter((img) => img !== hero);

  const isGridVisible = affordanceActivated && !isClosing;

  function handleToggle() {
    if (isGridVisible) {
      setIsClosing(true);
    } else {
      setAffordanceActivated(true);
    }
  }

  return (
    <div ref={containerRef} className="w-full rounded-lg overflow-hidden border border-ink/20">
      <div className="media-window-content bg-ink/5 overflow-hidden relative">
        {/* Hero layer: fades out when grid is shown, fades back in on close */}
        {hero ? (
          <motion.div
            className={`absolute inset-0 z-0 overflow-hidden flex items-center justify-center ${affordanceActivated ? 'pointer-events-none' : ''}`}
            aria-hidden={affordanceActivated}
            initial={false}
            animate={{ opacity: affordanceActivated ? 0 : 1 }}
            transition={{ duration: OPEN_DURATION_S * 0.7, ease: EDITORIAL_EASE }}
          >
            <div className="flex h-full w-full min-h-0 items-center justify-center">
              <img
                src={hero.src}
                alt=""
                className={
                  heroFit === 'contain'
                    ? 'max-h-full max-w-full h-auto w-full object-contain object-center'
                    : 'h-full w-full object-cover object-center'
                }
                loading={hero.src.toLowerCase().endsWith('.gif') ? 'eager' : undefined}
              />
            </div>
          </motion.div>
        ) : null}

        {/* Grid layer: controlled by button only */}
        {affordanceActivated ? (
          <motion.div
            ref={scrollRef}
            className="absolute inset-0 z-10 h-full min-h-0 touch-pan-y overflow-y-auto overflow-x-hidden overscroll-y-contain scrollbar-hide [scrollbar-width:none] [-ms-overflow-style:none]"
            initial={{ opacity: 0, y: OPEN_OFFSET_PX }}
            animate={{
              opacity: isClosing ? 0 : 1,
              y: isClosing ? -8 : 0,
            }}
            transition={
              isClosing
                ? { duration: CLOSE_DURATION_S, ease: EDITORIAL_EASE }
                : { duration: OPEN_DURATION_S, ease: EDITORIAL_EASE }
            }
            onAnimationComplete={() => {
              if (isClosing) {
                setAffordanceActivated(false);
                setIsClosing(false);
                if (scrollRef.current) scrollRef.current.scrollTop = 0;
              }
            }}
          >
            <motion.div
              className="space-y-3 px-px pt-px"
              style={{ y: springY }}
            >
              {hero && (
                <img
                  src={hero.src}
                  alt=""
                  className="w-full h-auto object-contain rounded-lg border border-ink/10"
                  loading={hero.src.toLowerCase().endsWith('.gif') ? 'eager' : undefined}
                />
              )}
              <div
                className={
                  galleryStackFullWidth
                    ? 'flex flex-col gap-3 w-full'
                    : 'flex flex-wrap gap-2'
                }
              >
                {gridImages.map((img, i) =>
                  'placeholder' in img && img.placeholder ? (
                    <div
                      key={i}
                      className="flex items-center justify-center rounded border border-ink/20 border-dashed bg-ink/5 text-ink/50 label min-h-[120px] min-w-[140px]"
                    >
                      Work in progress
                    </div>
                  ) : 'videoSrc' in img ? (
                    <div
                      key={i}
                      className={
                        galleryStackFullWidth
                          ? 'w-full rounded-lg overflow-hidden border border-ink/10 bg-ink'
                          : 'w-full rounded-lg overflow-hidden border border-ink/10 bg-ink'
                      }
                    >
                      <video
                        src={img.videoSrc}
                        className="w-full h-auto object-contain"
                        autoPlay
                        muted
                        loop
                        playsInline
                        controls
                      />
                    </div>
                  ) : (
                    <img
                      key={i}
                      src={(img as { src: string }).src}
                      alt=""
                      className={
                        galleryStackFullWidth
                          ? 'w-full h-auto object-contain rounded-lg border border-ink/10'
                          : 'max-w-full h-auto object-contain rounded border border-ink/10'
                      }
                      loading={(img as { src: string }).src.toLowerCase().endsWith('.gif') ? 'eager' : undefined}
                    />
                  )
                )}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </div>

      {/* Caption + control button (bottom right) */}
      {caption != null && (
        <div className="border-t border-ink/20 bg-ink/5 px-4 py-3 flex justify-between items-end gap-3">
          {/* Taxonomy: `.label` note + body caption — passed as `caption` ReactNode from parent */}
          <div className="min-w-0 flex-1 flex flex-col gap-1.5">
            {caption}
          </div>
          <button
            type="button"
            onClick={handleToggle}
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-ink/30 bg-ink/5 text-[var(--color-heading-h3)] hover:bg-ink/10 hover:border-ink/40 transition-colors text-lg font-heading font-medium leading-none"
            aria-label={isGridVisible ? 'View less' : 'View more'}
            data-cursor="hand"
          >
            {isGridVisible ? '−' : '+'}
          </button>
        </div>
      )}
    </div>
  );
}
