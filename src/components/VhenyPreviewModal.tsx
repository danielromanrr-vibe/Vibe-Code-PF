import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { VHENY_MINI, type VhenyMediaItem, type VhenyWorkKind } from '../content/vhenyDiamonds';
import TextLinkLabelWords from './TextLinkLabelWords';
import { useTextLinkArrowFollow } from './useTextLinkArrowFollow';

type VhenyPreviewModalProps = {
  kind: VhenyWorkKind | null;
  reducedMotion: boolean;
  onClose: () => void;
  onOpenStudy: (kind: VhenyWorkKind) => void;
};

function VhenyPreviewSheet({
  kind,
  media,
  reducedMotion,
  onClose,
  onOpenStudy,
}: {
  kind: VhenyWorkKind;
  media: readonly VhenyMediaItem[];
  reducedMotion: boolean;
  onClose: () => void;
  onOpenStudy: (kind: VhenyWorkKind) => void;
}) {
  const titleId = 'vheny-preview-title';
  const closeRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const lockRef = useRef(false);
  const [active, setActive] = useState(0);

  useTextLinkArrowFollow(ctaRef);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;

    const plates = Array.from(root.querySelectorAll<HTMLElement>('[data-vheny-plate]'));
    if (!plates.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (lockRef.current) return;
        const next = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!next) return;
        const index = Number(next.target.getAttribute('data-vheny-plate'));
        if (!Number.isNaN(index)) setActive(index);
      },
      { root, threshold: [0.4, 0.55, 0.7] },
    );

    plates.forEach((plate) => observer.observe(plate));
    return () => observer.disconnect();
  }, [kind]);

  const goToPlate = useCallback(
    (index: number) => {
      const root = scrollRef.current;
      const plate = root?.querySelector<HTMLElement>(`[data-vheny-plate="${index}"]`);
      if (!root || !plate) return;
      setActive(index);
      lockRef.current = true;
      const nextTop = root.scrollTop + (plate.getBoundingClientRect().top - root.getBoundingClientRect().top);
      root.scrollTo({ top: nextTop, behavior: reducedMotion ? 'auto' : 'smooth' });
      window.setTimeout(() => {
        lockRef.current = false;
      }, reducedMotion ? 0 : 420);
    },
    [reducedMotion],
  );

  return (
    <motion.div
      className="vheny-preview"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.22 }}
    >
      <button type="button" className="vheny-preview__backdrop" aria-label="Close preview" onClick={onClose} />

      <motion.div
        className="vheny-preview__sheet adopt-case-study-stage-shell"
        initial={reducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: reducedMotion ? 0 : 0.22 }}
      >
        <button
          ref={closeRef}
          type="button"
          className="vheny-preview__close"
          onClick={onClose}
          aria-label="Close preview"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
            <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <div ref={scrollRef} className="vheny-preview__scroll" aria-label="Scope media">
          {media.map((item, index) => (
            <figure key={item.src} className="vheny-preview__plate" data-vheny-plate={index}>
              {item.type === 'video' ? (
                <video
                  src={item.src}
                  className="vheny-preview__media"
                  autoPlay={!reducedMotion}
                  muted
                  loop
                  playsInline
                  controls={reducedMotion}
                  aria-label={item.alt}
                />
              ) : (
                <img src={item.src} alt={item.alt} className="vheny-preview__media" loading="lazy" decoding="async" />
              )}
            </figure>
          ))}
        </div>

        <div className="vheny-preview__spine">
          <h3
            id={titleId}
            className="adopt-context-heading vheny-preview__scope-title mb-0 text-pretty font-heading text-[length:var(--text-h3)] font-semibold leading-[var(--leading-h3)] tracking-[-0.02em] text-ink"
          >
            Scope
          </h3>

          <div className="vheny-preview__tabs" role="tablist" aria-label="Scope">
            {media.map((item, index) => {
              const selected = index === active;
              return (
                <button
                  key={item.scope}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  id={`vheny-scope-tab-${index}`}
                  className={`vheny-preview__tab adopt-body${selected ? ' is-active' : ''}`}
                  onClick={() => goToPlate(index)}
                >
                  {item.scope}
                </button>
              );
            })}
          </div>

          <div className="home-case-study-copy-shell vheny-preview__cta-shell">
            <button
              ref={ctaRef}
              type="button"
              className="home-case-study-cta text-link-tilt"
              onClick={() => onOpenStudy(kind)}
            >
              <TextLinkLabelWords label="View full case study" />
              <span className="home-case-study-cta__arrow" aria-hidden>
                →
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function VhenyPreviewModal({
  kind,
  reducedMotion,
  onClose,
  onOpenStudy,
}: VhenyPreviewModalProps) {
  return (
    <AnimatePresence>
      {kind ? (
        <VhenyPreviewSheet
          key={kind}
          kind={kind}
          media={VHENY_MINI[kind]}
          reducedMotion={reducedMotion}
          onClose={onClose}
          onOpenStudy={onOpenStudy}
        />
      ) : null}
    </AnimatePresence>
  );
}
