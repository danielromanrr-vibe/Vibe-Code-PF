/**
 * Zoom-in window: same size as static media window. Default = hero only.
 * User controls view via + button in caption (bottom right): view more (grid) or view less (hero).
 * No automatic open/close logic.
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
  projectTitle?: string;
  subtitle?: string;
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
}: Props) {
  const [affordanceActivated, setAffordanceActivated] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
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

  if (!hasGallery) {
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
    <div className="w-full rounded-lg overflow-hidden border border-ink/20">
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
            <div className="w-full aspect-[4/4.5] min-h-full">
              <img
                src={hero.src}
                alt=""
                className="w-full h-full object-cover object-center"
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
