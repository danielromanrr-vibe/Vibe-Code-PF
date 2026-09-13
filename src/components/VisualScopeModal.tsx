import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { VISUAL_WORK, type VisualMediaItem, type VisualWorkKind } from '../content/visualDesign';

type VisualScopeModalProps = {
  kind: VisualWorkKind | null;
  reducedMotion: boolean;
  onClose: () => void;
};

const BRIEF_SLABS = [
  { key: 'role', eyebrow: 'Role' },
  { key: 'scope', eyebrow: 'Scope' },
  { key: 'impact', eyebrow: 'Impact' },
] as const;

function VisualScopeSheet({
  kind,
  media,
  reducedMotion,
  onClose,
}: {
  kind: VisualWorkKind;
  media: readonly VisualMediaItem[];
  reducedMotion: boolean;
  onClose: () => void;
}) {
  const titleId = 'visual-scope-title';
  const closeRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lockRef = useRef(false);
  const [active, setActive] = useState(0);
  const work = VISUAL_WORK[kind];

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
        className="vheny-preview__sheet vheny-preview__sheet--visual adopt-case-study-stage-shell"
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

        <div className="vheny-preview__stage">
          <aside className="vheny-preview__rail" aria-label="Project brief">
            <h3
              id={titleId}
              className="adopt-context-heading vheny-preview__rail-title mb-0 text-pretty font-heading text-[length:var(--text-h3)] font-semibold leading-[var(--leading-h3)] tracking-[-0.02em] text-ink"
            >
              {work.title}
            </h3>
            <dl className="vheny-preview__brief">
              {BRIEF_SLABS.map(({ key, eyebrow }) => (
                <div key={key} className="vheny-preview__slab">
                  <dt className="adopt-meta-label home-featured-scope-impact-eyebrow mb-0">{eyebrow}</dt>
                  <dd className="adopt-body vheny-preview__slab-body mb-0 text-pretty text-ink/74">{work[key]}</dd>
                </div>
              ))}
            </dl>
          </aside>

          <div ref={scrollRef} className="vheny-preview__scroll" aria-label={`${work.title} media`}>
            {media.map((item, index) => (
              <figure key={item.src} className="vheny-preview__plate" data-vheny-plate={index}>
                <img src={item.src} alt={item.alt} className="vheny-preview__media" loading="lazy" decoding="async" />
              </figure>
            ))}
          </div>
        </div>

        <div className="vheny-preview__spine">
          <div className="vheny-preview__tabs" role="tablist" aria-label="Surfaces">
            {media.map((item, index) => {
              const selected = index === active;
              return (
                <button
                  key={`${item.label}-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  id={`visual-scope-tab-${index}`}
                  className={`vheny-preview__tab adopt-body${selected ? ' is-active' : ''}`}
                  onClick={() => goToPlate(index)}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function VisualScopeModal({ kind, reducedMotion, onClose }: VisualScopeModalProps) {
  const media = kind ? VISUAL_WORK[kind].media : null;

  return (
    <AnimatePresence>
      {kind && media && media.length > 0 ? (
        <VisualScopeSheet
          key={kind}
          kind={kind}
          media={media}
          reducedMotion={reducedMotion}
          onClose={onClose}
        />
      ) : null}
    </AnimatePresence>
  );
}
