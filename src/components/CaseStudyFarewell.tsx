import { useRef, type RefObject } from 'react';
import TextLinkLabelWords from './TextLinkLabelWords';
import { useTextLinkArrowFollow } from './useTextLinkArrowFollow';

type CaseStudyFarewellProps = {
  scrollContainerRef: RefObject<HTMLElement | null>;
};

export default function CaseStudyFarewell({ scrollContainerRef }: CaseStudyFarewellProps) {
  const linkRef = useRef<HTMLButtonElement>(null);
  useTextLinkArrowFollow(linkRef);

  const backToTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <div className="adopt-case-farewell">
      <p className="adopt-body adopt-case-farewell__note mb-0">Thank you for making it this far!</p>
      <button ref={linkRef} type="button" className="home-case-study-cta text-link-tilt" onClick={backToTop}>
        <span className="home-case-study-cta__arrow is-north" aria-hidden>
          →
        </span>
        <TextLinkLabelWords label="Back to top" />
      </button>
    </div>
  );
}
