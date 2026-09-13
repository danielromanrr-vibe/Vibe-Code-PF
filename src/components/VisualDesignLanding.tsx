import { useCallback, useState } from 'react';
import { motion } from 'motion/react';
import Footer from './Footer';
import HomeChapterLabel from './HomeChapterLabel';
import TopNavStrip from './TopNavStrip';
import VisualScopeModal from './VisualScopeModal';
import {
  VISUAL_LANDING_BODY,
  VISUAL_LANDING_SECTIONS,
  VISUAL_LANDING_TITLE,
  type VisualLandingCompose,
  type VisualWorkBody,
  type VisualWorkKind,
} from '../content/visualDesign';

type VisualDesignLandingProps = {
  onHomeClick: () => void;
  onAboutClick: () => void;
  onCvClick: () => void;
  onOpenBranding: () => void;
  reducedMotion: boolean;
};

export default function VisualDesignLanding({
  onHomeClick,
  onAboutClick,
  onCvClick,
  onOpenBranding,
  reducedMotion,
}: VisualDesignLandingProps) {
  const [preview, setPreview] = useState<VisualWorkKind | null>(null);
  const [keyed, setKeyed] = useState<VisualWorkKind | null>(null);

  const closePreview = useCallback(() => setPreview(null), []);

  const openWork = (work: VisualWorkBody) => {
    if (work.hrefRoute === 'vhenyBranding') {
      onOpenBranding();
      return;
    }
    setPreview(work.id);
  };

  const plateClass = (kind: VisualWorkKind, compose: VisualLandingCompose) => {
    const classes = ['visual-landing__plate', `visual-landing__plate--${compose}`];
    if (keyed === kind) classes.push('is-keyed');
    if (keyed && keyed !== kind) classes.push('is-dimmed');
    return classes.join(' ');
  };

  return (
    <motion.div
      id="visual-design-scroll"
      className={`vheny-landing vheny-landing--visual fixed inset-0 z-[200] flex flex-col overflow-x-hidden overflow-y-auto overscroll-y-contain${preview ? ' vheny-landing--preview' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <TopNavStrip
        page="visual"
        mandalaAnchorId="mandala-nav-visual"
        onHomeClick={onHomeClick}
        onAboutClick={onAboutClick}
        onCvClick={onCvClick}
        surface="media"
      />

      <main className="visual-landing" aria-labelledby="visual-landing-heading">
        <header className="visual-landing__intro">
          <h1 id="visual-landing-heading" className="visual-landing__title">
            {VISUAL_LANDING_TITLE}
          </h1>
          <p className="visual-landing__body adopt-body">{VISUAL_LANDING_BODY}</p>
        </header>

        {VISUAL_LANDING_SECTIONS.map((section) => (
          <section
            key={section.id}
            className={`visual-landing__section visual-landing__section--${section.id}`}
            aria-labelledby={section.labelId}
          >
            <div className="home-chapter-band visual-landing__chapter-band">
              <HomeChapterLabel id={section.labelId} field={section.field} quiet>
                {section.title}
              </HomeChapterLabel>
            </div>

            <ul className={`visual-landing__compose visual-landing__compose--${section.id}`}>
              {section.items.map(({ work, compose }) => {
                const titleId = `visual-work-title-${work.id}`;
                return (
                  <li
                    key={work.id}
                    className={`visual-landing__cell visual-landing__cell--${compose}`}
                  >
                    <button
                      type="button"
                      className={plateClass(work.id, compose)}
                      onClick={() => openWork(work)}
                      onMouseEnter={() => setKeyed(work.id)}
                      onMouseLeave={() => setKeyed(null)}
                      onFocus={() => setKeyed(work.id)}
                      onBlur={() => setKeyed(null)}
                      aria-expanded={preview === work.id}
                      aria-labelledby={titleId}
                    >
                      <img
                        src={work.coverSrc}
                        alt=""
                        className="visual-landing__img"
                        loading="eager"
                        decoding="async"
                      />
                      <h2 id={titleId} className="visual-landing__caption">
                        {work.title}
                      </h2>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </main>

      <Footer variant="bookend" />

      <VisualScopeModal kind={preview} reducedMotion={reducedMotion} onClose={closePreview} />
    </motion.div>
  );
}
