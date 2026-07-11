import { useEffect } from 'react';
import { SiteFooter } from '../components/Footer';
import Mandala from '../components/Mandala';
import TopNavStrip from '../components/TopNavStrip';
import AboutInfluenceSlabs from '../components/about/AboutInfluenceSlabs';
import type { AboutPracticeAction } from '../content/aboutMandalaFacets';

const ABOUT_FIELD_SCALE = 1.35;

type AboutPageProps = {
  onHomeClick: () => void;
  onAboutClick: () => void;
  onCvClick: () => void;
  onPracticeClick?: (action: AboutPracticeAction) => void;
};

export default function AboutPage({
  onHomeClick,
  onAboutClick,
  onCvClick,
  onPracticeClick,
}: AboutPageProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className="min-h-screen selection:bg-accent selection:text-white overflow-x-hidden bg-bg"
      style={{ backgroundColor: '#F8F9FA' }}
    >
      <TopNavStrip
        page="about"
        mandalaAnchorId="mandala-nav-about"
        onHomeClick={onHomeClick}
        onAboutClick={onAboutClick}
        onCvClick={onCvClick}
      />
      <main className="editorial-page relative z-20 pt-0">
        <section className="about-mandala-experience about-page-hero" aria-labelledby="about-heading">
          <div className="about-mandala-experience__discover about-page-hero__discover">
            <div className="about-mandala-experience__playground-wrap">
              <div id="about-mandala-stage" className="about-mandala-experience__playground">
                <div id="mandala-about-center" className="about-mandala-experience__anchor" aria-hidden />

                <Mandala
                  variant="heroIntegrated"
                  anchorId="mandala-about-center"
                  interactionProfile="euphoria"
                  placementMode="anchorHome"
                  rotationPace={0.25}
                  fieldScale={ABOUT_FIELD_SCALE}
                  canvasLayerZIndex={12}
                />

                <h1 id="about-heading" className="about-page-hero__title m-0">
                  About me
                </h1>
              </div>
            </div>
          </div>
        </section>

        <AboutInfluenceSlabs onPracticeClick={onPracticeClick} />
      </main>
      <SiteFooter />
    </div>
  );
}
