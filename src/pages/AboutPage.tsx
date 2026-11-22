import { useEffect, useRef } from 'react';
import { SiteFooter } from '../components/Footer';
import TopNavStrip from '../components/TopNavStrip';
import AboutDesktop from '../components/about/AboutDesktop';
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
  onPracticeClick,
}: AboutPageProps) {
  const fieldRef = useRef<HTMLDivElement>(null);

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

      <div ref={fieldRef} className="about-field">
        <main>
          <AboutDesktop fieldRef={fieldRef} onPracticeClick={onPracticeClick} />
        </main>

        <SiteFooter field="none" />
      </div>
    </div>
  );
}
