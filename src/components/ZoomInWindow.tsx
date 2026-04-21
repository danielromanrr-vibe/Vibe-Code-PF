/**
 * Zoom-in window: 16:9 hero; default strip is + only (no caption text). Expanded grid: each tile is 16:9 + one-line caption.
 */
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import type { GalleryImage } from './EditorialGalleryModal';
import ExpandMediaButton from './ExpandMediaButton';

type Props = {
  children?: React.ReactNode;
  caption?: React.ReactNode;
  galleryImages?: GalleryImage[];
  galleryStackFullWidth?: boolean;
  heroFit?: 'cover' | 'contain';
  projectTitle?: string;
  subtitle?: string;
  mediaAreaClassName?: string;
  expandViewportOnActivate?: boolean;
};

const PARALLAX_RATE = 0.15;
const SPRING = { stiffness: 150, damping: 25 };
const CLOSE_DURATION_S = 0.42;
const OPEN_DURATION_S = 0.52;
const OPEN_OFFSET_PX = 14;
const EDITORIAL_EASE = [0.22, 0.61, 0.36, 1];

function galleryCaption(img: GalleryImage): string {
  if ('placeholder' in img) return '';
  if ('videoSrc' in img) return (img as { caption?: string }).caption?.trim() ?? '';
  if ('src' in img) return (img as { caption?: string }).caption?.trim() ?? '';
  return '';
}

export default function ZoomInWindow({
  children,
  caption,
  galleryImages,
  galleryStackFullWidth: _galleryStackFullWidth = false,
  heroFit = 'cover',
  mediaAreaClassName,
  expandViewportOnActivate = false,
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
              mediaAreaClassName ?? 'media-window-content overflow-hidden relative flex items-center justify-center bg-transparent'
            }
          >
            {children}
          </div>
          <div className="border-t border-ink/20 bg-ink/5 px-2 py-3">
            <div className="zoom-window-caption min-w-0 flex flex-col gap-1.5">{caption}</div>
          </div>
        </div>
      );
    }
    return <>{children}</>;
  }

  const hero =
    galleryImages!.find((i): i is { src: string; isHero?: boolean } => 'src' in i && !!i.isHero) ??
    galleryImages!.find((i): i is { src: string; isHero?: boolean } => 'src' in i);
  const gridImages = galleryImages!.filter((img) => img !== hero);

  const isGridVisible = affordanceActivated && !isClosing;
  const shouldExpandViewport = expandViewportOnActivate && affordanceActivated;

  function handleToggle() {
    if (isGridVisible) {
      setIsClosing(true);
    } else {
      setAffordanceActivated(true);
    }
  }

  function renderGridTile(img: GalleryImage, key: string | number) {
    const cap = galleryCaption(img);
    const frame = 'relative w-full overflow-hidden rounded-md border border-ink/10 bg-ink aspect-video';
    const imgFit =
      heroFit === 'contain'
        ? 'h-full w-full object-contain object-center'
        : 'h-full w-full object-cover object-center';

    if ('placeholder' in img && img.placeholder) {
      return (
        <div key={key} className="w-full">
          <div className={`${frame} flex items-center justify-center text-ink/50 label`}>Work in progress</div>
          {cap ? (
            <p className="mt-1.5 truncate font-body text-body leading-snug text-ink/70" title={cap}>
              {cap}
            </p>
          ) : null}
        </div>
      );
    }
    if ('videoSrc' in img) {
      return (
        <div key={key} className="w-full">
          <div className={frame}>
            <video
              src={img.videoSrc}
              className={imgFit}
              autoPlay
              muted
              loop
              playsInline
              controls
            />
          </div>
          {cap ? (
            <p className="mt-1.5 truncate font-body text-body leading-snug text-ink/70" title={cap}>
              {cap}
            </p>
          ) : null}
        </div>
      );
    }
    const src = (img as { src: string }).src;
    return (
      <div key={key} className="w-full">
        <div className={frame}>
          <img src={src} alt="" className={imgFit} loading={src.toLowerCase().endsWith('.gif') ? 'eager' : undefined} />
        </div>
        {cap ? (
          <p className="mt-1.5 truncate font-body text-body leading-snug text-ink/70" title={cap}>
            {cap}
          </p>
        ) : null}
      </div>
    );
  }

  const tiles: GalleryImage[] = hero ? [hero, ...gridImages] : [...gridImages];

  return (
    <div ref={containerRef} className="w-full overflow-hidden rounded-lg border border-ink/20">
      <div
        className="media-window-content relative overflow-hidden transition-[min-height] duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)]"
        style={{
          minHeight: shouldExpandViewport ? 'clamp(320px,64vh,760px)' : undefined,
        }}
      >
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

        {affordanceActivated ? (
          <motion.div
            ref={scrollRef}
            className="absolute inset-0 z-10 h-full min-h-0 touch-pan-y overflow-y-auto overflow-x-hidden overscroll-y-contain bg-white scrollbar-hide [scrollbar-width:none] [-ms-overflow-style:none]"
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
            <motion.div className="flex flex-col gap-4 px-1 pb-1 pt-1" style={{ y: springY }}>
              {tiles.map((img, i) => renderGridTile(img, i))}
            </motion.div>
          </motion.div>
        ) : null}

        <ExpandMediaButton
          onClick={handleToggle}
          expanded={isGridVisible}
          aria-expanded={isGridVisible}
          aria-label={isGridVisible ? 'View less' : 'View more'}
          className="absolute bottom-[max(0.75rem,env(safe-area-inset-bottom))] right-[max(0.75rem,env(safe-area-inset-right))] z-30 sm:bottom-4 sm:right-4"
        />
      </div>
    </div>
  );
}
