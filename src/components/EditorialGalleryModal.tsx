/**
 * New optional image-gallery interaction: modal overlay with project title,
 * hero image (dimensions preserved), and responsive grid. Does not replace
 * existing carousel (AdoptCaseStudyMedia). Use via ZoomInWindow opt-in.
 */
import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export type GalleryImage =
  | { src: string; isHero?: boolean; caption?: string }
  | { placeholder: true }
  | { videoSrc: string; caption?: string };

type Props = {
  open: boolean;
  onClose: () => void;
  projectTitle?: string;
  subtitle?: string;
  images: GalleryImage[];
};

export default function EditorialGalleryModal({
  open,
  onClose,
  projectTitle,
  subtitle,
  images,
}: Props) {
  const hero =
    images.find((i): i is { src: string; isHero?: boolean; caption?: string } => 'src' in i && !!i.isHero) ??
    images.find((i): i is { src: string; isHero?: boolean; caption?: string } => 'src' in i);
  const gridImages = images.filter((i) => i !== hero);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, handleEscape]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[210] flex items-center justify-center p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Image gallery"
      >
        <div className="absolute inset-0 bg-ink/42 backdrop-blur-[2px]" aria-hidden />
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="relative flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-ink/14 bg-[#f6f6f6] shadow-[0_18px_56px_rgba(0,0,0,0.2)]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="shrink-0 flex items-start justify-between gap-4 border-b border-ink/14 px-5 py-4 sm:px-7 sm:py-5">
            <div>
              {projectTitle && (
                <h2 className="text-ink">
                  {projectTitle}
                </h2>
              )}
              {subtitle && (
                <p className="meta mt-1 text-ink/65">{subtitle}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-lg p-2 text-ink/62 transition-colors hover:bg-ink/8 hover:text-ink"
              aria-label="Close gallery"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 pb-7 pt-5 sm:px-7">
            {(hero || gridImages.length > 0) && (
              <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
                {[...(hero ? [hero] : []), ...gridImages].map((img, i) => {
                  const driftClass =
                    i % 3 === 0 ? 'mt-0' : i % 3 === 1 ? 'mt-4 sm:mt-8' : 'mt-2 sm:mt-5';
                  const wrapperClass = `relative mb-5 break-inside-avoid ${driftClass}`;

                  return 'placeholder' in img && img.placeholder ? (
                    <figure key={i} className={wrapperClass}>
                      <div className="flex aspect-[4/5] items-center justify-center rounded-2xl border border-ink/16 bg-white/70 text-sm text-ink/55">
                        Work in progress
                      </div>
                    </figure>
                  ) : 'videoSrc' in img ? (
                    <figure key={i} className={`${wrapperClass} sm:mb-6`}>
                      <div className="relative overflow-hidden rounded-2xl border border-ink/14 bg-white">
                        <video
                          src={img.videoSrc}
                          className="h-auto w-full object-contain"
                          autoPlay
                          muted
                          loop
                          playsInline
                          controls
                        />
                        {img.caption && (
                          <figcaption className="caption absolute bottom-2 left-2 right-2 rounded-md border border-ink/12 bg-white/96 px-2.5 py-1.5 text-ink shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
                            {img.caption}
                          </figcaption>
                        )}
                      </div>
                    </figure>
                  ) : (
                    <figure key={i} className={wrapperClass}>
                      <a
                        href={(img as { src: string }).src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative block overflow-hidden rounded-2xl border border-ink/14 bg-white focus:outline-none focus:ring-2 focus:ring-ink/30"
                        aria-label={(img as { caption?: string }).caption ?? 'Open image in new tab'}
                      >
                        <img
                          src={(img as { src: string }).src}
                          alt={(img as { caption?: string }).caption ?? ''}
                          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.01]"
                        />
                        {(img as { caption?: string }).caption && (
                          <figcaption className="caption absolute bottom-2 left-2 right-2 rounded-md border border-ink/12 bg-white/96 px-2.5 py-1.5 text-ink shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
                            {(img as { caption?: string }).caption}
                          </figcaption>
                        )}
                      </a>
                    </figure>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
