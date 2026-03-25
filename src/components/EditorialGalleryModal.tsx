/**
 * New optional image-gallery interaction: modal overlay with project title,
 * hero image (dimensions preserved), and responsive grid. Does not replace
 * existing carousel (AdoptCaseStudyMedia). Use via ZoomInWindow opt-in.
 */
import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export type GalleryImage = { src: string; isHero?: boolean } | { placeholder: true };

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
  const hero = images.find((i): i is { src: string; isHero?: boolean } => 'src' in i && !!i.isHero) ?? images.find((i): i is { src: string; isHero?: boolean } => 'src' in i);
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
        <div
          className="absolute inset-0 bg-ink/50"
          aria-hidden
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-xl border border-ink/20 bg-white shadow-xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="shrink-0 flex justify-between items-start gap-4 p-6 border-b border-ink/20">
            <div>
              {projectTitle && (
                <h2 className="text-ink">
                  {projectTitle}
                </h2>
              )}
              {subtitle && (
                <p className="text-ink/70 mt-1 font-body text-[length:var(--text-body)]">{subtitle}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-ink/10 rounded transition-colors shrink-0"
              aria-label="Close gallery"
              data-cursor="hand"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {hero && 'src' in hero && (
              <div className="mb-6">
                <img
                  src={hero.src}
                  alt=""
                  className="w-full h-auto object-contain max-h-[50vh] rounded-lg border border-ink/10"
                  style={{ objectFit: 'contain' }}
                />
              </div>
            )}
            {gridImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {gridImages.map((img, i) =>
                  'placeholder' in img && img.placeholder ? (
                    <div
                      key={i}
                      className="flex items-center justify-center aspect-square rounded-lg border border-dashed border-ink/20 bg-ink/5 text-ink/50 label text-sm"
                    >
                      Work in progress
                    </div>
                  ) : (
                    <a
                      key={i}
                      href={(img as { src: string }).src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block aspect-square rounded-lg overflow-hidden border border-ink/20 bg-ink/5 focus:outline-none focus:ring-2 focus:ring-ink/30"
                    >
                      <img
                        src={(img as { src: string }).src}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </a>
                  )
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
