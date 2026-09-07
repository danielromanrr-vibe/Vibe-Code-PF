import { useEffect } from 'react';
import { SiteFooter } from '../components/Footer';
import TopNavStrip from '../components/TopNavStrip';
import AboutHeroSection from '../components/about/AboutHeroSection';
import type { AboutPracticeAction } from '../content/aboutMandalaFacets';
import { ABOUT_PRINCIPLES } from '../content/aboutStoryRooms';
import { setMandalaSpriteId } from '../lib/mandalaSprite';

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
}: AboutPageProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
    setMandalaSpriteId('euphoria');
  }, []);

  return (
    <div className="about-playground-page about-story-page bg-bg" style={{ backgroundColor: '#F8F9FA' }}>
      <TopNavStrip
        page="about"
        mandalaAnchorId="mandala-nav-about"
        onHomeClick={onHomeClick}
        onAboutClick={onAboutClick}
        onCvClick={onCvClick}
      />

      <main>
        <AboutHeroSection />

        <section
          id={ABOUT_PRINCIPLES.id}
          className="about-page-chapter"
          aria-labelledby="design-principles-heading"
        >
          <h2 id="design-principles-heading" className="about-page-chapter__title">
            {ABOUT_PRINCIPLES.title}
          </h2>
          <p className="about-page-chapter__body">{ABOUT_PRINCIPLES.body}</p>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
