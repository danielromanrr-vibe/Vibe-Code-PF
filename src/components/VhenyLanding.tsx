import { useCallback, useState } from 'react';
import { motion } from 'motion/react';
import TopNavStrip from './TopNavStrip';
import VhenyPreviewModal from './VhenyPreviewModal';
import { VhenySplitPill } from './VhenyWorkPill';
import { VHENY_COVERS, type VhenyWorkKind } from '../content/vhenyDiamonds';
import { landing as vhenyLanding } from '../content/vheny';

type VhenyLandingProps = {
  onHomeClick: () => void;
  onAboutClick: () => void;
  onVisualBrandingClick: () => void;
  onProductClick: () => void;
  onOpenStudy: (kind: VhenyWorkKind) => void;
  reducedMotion: boolean;
};

export default function VhenyLanding({
  onHomeClick,
  onAboutClick,
  onVisualBrandingClick,
  onProductClick,
  onOpenStudy,
  reducedMotion,
}: VhenyLandingProps) {
  const [preview, setPreview] = useState<VhenyWorkKind | null>(null);
  const [keyed, setKeyed] = useState<VhenyWorkKind | null>(null);

  const closePreview = useCallback(() => setPreview(null), []);

  const plateClass = (kind: VhenyWorkKind) => {
    const classes = ['vheny-landing__plate'];
    if (keyed === kind) classes.push('is-keyed');
    if (keyed && keyed !== kind) classes.push('is-dimmed');
    return classes.join(' ');
  };

  return (
    <motion.div
      id="vheny-landing"
      className={`vheny-landing fixed inset-0 z-[200] flex flex-col overflow-hidden${preview ? ' vheny-landing--preview' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <TopNavStrip
        page="vheny"
        mandalaAnchorId="mandala-nav-vheny"
        onHomeClick={onHomeClick}
        onAboutClick={onAboutClick}
        onVisualBrandingClick={onVisualBrandingClick}
        onProductClick={onProductClick}
        surface="media"
      />

      <div className="vheny-landing__diptych" aria-hidden={Boolean(preview)}>
        <div className="vheny-landing__frame">
          <button
            type="button"
            className={plateClass('branding')}
            onClick={() => setPreview('branding')}
            onMouseEnter={() => setKeyed('branding')}
            onMouseLeave={() => setKeyed(null)}
            onFocus={() => setKeyed('branding')}
            onBlur={() => setKeyed(null)}
            aria-expanded={preview === 'branding'}
            aria-label="Preview branding"
          >
            <img
              src={VHENY_COVERS.branding.src}
              alt=""
              className="vheny-landing__img"
              loading="eager"
              decoding="async"
            />
          </button>
          <p className="vheny-landing__caption adopt-meta-label">{vhenyLanding.captions.branding}</p>
        </div>
        <div className="vheny-landing__spine" aria-hidden />
        <div className="vheny-landing__frame">
          <button
            type="button"
            className={plateClass('product')}
            onClick={() => setPreview('product')}
            onMouseEnter={() => setKeyed('product')}
            onMouseLeave={() => setKeyed(null)}
            onFocus={() => setKeyed('product')}
            onBlur={() => setKeyed(null)}
            aria-expanded={preview === 'product'}
            aria-label="Preview product design"
          >
            <img
              src={VHENY_COVERS.product.src}
              alt=""
              className="vheny-landing__img"
              loading="eager"
              decoding="async"
            />
          </button>
          <p className="vheny-landing__caption adopt-meta-label">{vhenyLanding.captions.product}</p>
        </div>
      </div>
      <div className="vheny-landing__veil" aria-hidden />

      <main className="vheny-landing__stage">
        <div className="vheny-landing__copy">
          <p className="vheny-landing__kicker adopt-meta-label">{vhenyLanding.kicker}</p>
          <h1 className="vheny-landing__title">{vhenyLanding.h1}</h1>
          <p className="vheny-landing__body">{vhenyLanding.body}</p>
          <VhenySplitPill
            onSelect={setPreview}
            onHoverChange={setKeyed}
            ariaLabel="Preview a body of work"
          />
        </div>
      </main>

      <VhenyPreviewModal
        kind={preview}
        reducedMotion={reducedMotion}
        onClose={closePreview}
        onOpenStudy={onOpenStudy}
      />
    </motion.div>
  );
}
