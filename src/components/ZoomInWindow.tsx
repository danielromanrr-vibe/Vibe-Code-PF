/**
 * Zoom-in window: same size as static media window (aspect-[4/5] content + caption).
 * Content scrolls inside the window so the user can view all images. Parallax on
 * inner content while scrolling.
 */
import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import type { GalleryImage } from './EditorialGalleryModal';

type Props = {
  children: React.ReactNode;
  caption?: React.ReactNode;
  galleryImages?: GalleryImage[];
  projectTitle?: string;
  subtitle?: string;
};

const PARALLAX_RATE = 0.15;
const SPRING = { stiffness: 150, damping: 25 };

export default function ZoomInWindow({
  children,
  caption,
  galleryImages,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  const springY = useSpring(y, SPRING);

  const hasGallery = galleryImages && galleryImages.length > 0;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !hasGallery) return;

    function update() {
      y.set(el.scrollTop * PARALLAX_RATE);
    }

    update();
    el.addEventListener('scroll', update, { passive: true });
    return () => el.removeEventListener('scroll', update);
  }, [y, hasGallery]);

  if (!hasGallery) {
    return <>{children}</>;
  }

  const hero = galleryImages!.find((i) => i.isHero);
  const gridImages = galleryImages!.filter((img) => !img.isHero);

  return (
    <div className="w-full rounded-lg overflow-hidden border border-ink/20">
      {/* Content area: same size as static window — aspect-[4/5], scrollable so user can view all images */}
      <div
        ref={scrollRef}
        className="aspect-[4/5] w-full bg-ink/5 overflow-y-auto overflow-x-hidden"
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
            />
          )}
          <div className="flex flex-wrap gap-2">
            {gridImages.map((img, i) => (
              <img
                key={i}
                src={img.src}
                alt=""
                className="max-w-full h-auto object-contain rounded border border-ink/10"
              />
            ))}
          </div>
        </motion.div>
      </div>
      {caption != null && (
        <div className="border-t border-ink/20 bg-ink/5 px-4 py-3">
          {caption}
        </div>
      )}
    </div>
  );
}
