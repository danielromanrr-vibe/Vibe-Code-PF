import { useEffect } from 'react';
import { SiteFooter } from '../components/Footer';
import TopNavStrip from '../components/TopNavStrip';
import AboutHeroSection from '../components/about/AboutHeroSection';
import type { AboutPracticeAction } from '../content/aboutMandalaFacets';
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
  onPracticeClick,
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
        <AboutHeroSection onThinkingClick={() => onPracticeClick?.('thinking')} />
      </main>

      <SiteFooter />
    </div>
  );
}
