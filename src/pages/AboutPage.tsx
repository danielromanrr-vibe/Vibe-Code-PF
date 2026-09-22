import { useEffect } from 'react';
import { SiteFooter } from '../components/Footer';
import TopNavStrip from '../components/TopNavStrip';
import AboutHeroSection from '../components/about/AboutHeroSection';
import type { AboutPracticeAction } from '../content/aboutMandalaFacets';

type AboutPageProps = {
  onHomeClick: () => void;
  onAboutClick: () => void;
  onVisualBrandingClick: () => void;
  onProductClick: () => void;
  onPracticeClick?: (action: AboutPracticeAction) => void;
};

export default function AboutPage({
  onHomeClick,
  onAboutClick,
  onVisualBrandingClick,
  onProductClick,
}: AboutPageProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-playground-page about-story-page bg-bg" style={{ backgroundColor: '#F8F9FA' }}>
      <TopNavStrip
        page="about"
        mandalaAnchorId="mandala-nav-about"
        onHomeClick={onHomeClick}
        onAboutClick={onAboutClick}
        onVisualBrandingClick={onVisualBrandingClick}
        onProductClick={onProductClick}
      />

      <main>
        <AboutHeroSection />
      </main>

      <SiteFooter />
    </div>
  );
}
