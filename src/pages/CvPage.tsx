import { useEffect, useRef } from 'react';
import { SiteFooter } from '../components/Footer';
import TopNavStrip from '../components/TopNavStrip';
import { useTextLinkArrowFollow } from '../components/useTextLinkArrowFollow';

type CvPageProps = {
  onHomeClick: () => void;
  onAboutClick: () => void;
  onCvClick: () => void;
};

function CvMailtoLink() {
  const linkRef = useRef<HTMLAnchorElement>(null);
  useTextLinkArrowFollow(linkRef);

  return (
    <a ref={linkRef} className="text-link-tilt" href="mailto:hello@danielroman.design">
      hello@danielroman.design
    </a>
  );
}

export default function CvPage({ onHomeClick, onAboutClick, onCvClick }: CvPageProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className="min-h-screen selection:bg-accent selection:text-white overflow-x-hidden bg-bg"
      style={{ backgroundColor: '#F8F9FA' }}
    >
      <TopNavStrip
        page="cv"
        mandalaAnchorId="mandala-nav-cv"
        onHomeClick={onHomeClick}
        onAboutClick={onAboutClick}
        onCvClick={onCvClick}
      />
      <main className="editorial-page relative z-20 flex-1 px-5 py-8 pb-24 pt-11 sm:px-8 md:px-12 md:py-12">
        <div className="editorial-container editorial-page">
          <section className="bg-bg" style={{ backgroundColor: '#F8F9FA' }} aria-labelledby="cv-heading">
            <h1 id="cv-heading" className="mb-4 md:mb-5">
              Daniel Roman - CV
            </h1>
            <p className="editorial-body mb-4 max-w-measure">
              Full CV is available on request. For current work history, project scope, and case study outcomes,
              please use the portfolio pages.
            </p>
            <p className="editorial-body mb-0 max-w-measure">
              Contact: <CvMailtoLink />
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
