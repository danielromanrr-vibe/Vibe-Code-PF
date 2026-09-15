import { motion } from 'motion/react';
import { SiteFooter } from './Footer';
import TopNavStrip from './TopNavStrip';
import {
  VISUAL_LANDING_GRID,
  VISUAL_LANDING_SUBHEADER,
  VISUAL_LANDING_TITLE_LINES,
  visualTagsLabel,
  type VisualWorkBody,
  type VisualWorkKind,
} from '../content/visualDesign';

type VisualDesignLandingProps = {
  onHomeClick: () => void;
  onAboutClick: () => void;
  onVisualBrandingClick: () => void;
  onProductClick: () => void;
  onOpenWork: (kind: VisualWorkKind) => void;
  reducedMotion: boolean;
};

export default function VisualDesignLanding({
  onHomeClick,
  onAboutClick,
  onVisualBrandingClick,
  onProductClick,
  onOpenWork,
  reducedMotion,
}: VisualDesignLandingProps) {
  return (
    <motion.div
      id="visual-design-scroll"
      className="vheny-landing vheny-landing--visual fixed inset-0 z-[200] flex flex-col overflow-x-hidden overflow-y-auto overscroll-y-contain"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reducedMotion ? undefined : { opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <TopNavStrip
        page="visual"
        mandalaAnchorId="mandala-nav-visual"
        onHomeClick={onHomeClick}
        onAboutClick={onAboutClick}
        onVisualBrandingClick={onVisualBrandingClick}
        onProductClick={onProductClick}
        surface="default"
      />

      <main className="visual-landing" aria-labelledby="visual-landing-heading">
        <header className="visual-landing__intro">
          <div className="visual-landing__intro-inner">
            <h1 id="visual-landing-heading" className="mb-0 text-center">
              {VISUAL_LANDING_TITLE_LINES[0]}
              <br />
              {VISUAL_LANDING_TITLE_LINES[1]}
            </h1>
            <p className="visual-landing__subheader editorial-hero-subheader mb-0 text-center text-pretty">
              {VISUAL_LANDING_SUBHEADER}
            </p>
          </div>
        </header>

        <ul className="visual-landing__grid">
          {VISUAL_LANDING_GRID.map((work) => (
            <VisualLandingCell key={work.id} work={work} onOpen={() => onOpenWork(work.id)} />
          ))}
        </ul>
      </main>

      <SiteFooter />
    </motion.div>
  );
}

function VisualLandingCell({ work, onOpen }: { work: VisualWorkBody; onOpen: () => void }) {
  const titleId = `visual-work-title-${work.id}`;

  return (
    <li className="visual-landing__cell">
      <button
        type="button"
        className="visual-landing__plate group"
        onClick={onOpen}
        aria-labelledby={titleId}
      >
        <img
          src={work.coverSrc}
          alt=""
          className="visual-landing__img"
          loading="eager"
          decoding="async"
        />
        <div className="visual-landing__hover">
          <h2 id={titleId} className="visual-landing__hover-title">
            {work.title}
          </h2>
          <p className="visual-landing__hover-tags">{visualTagsLabel(work.tags)}</p>
        </div>
      </button>
    </li>
  );
}
