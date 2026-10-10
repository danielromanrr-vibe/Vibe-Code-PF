import { useRef } from 'react';
import { aboutMe } from '../content/home';
import HomeChapterLabel from './HomeChapterLabel';
import TextLinkLabelWords from './TextLinkLabelWords';
import { useTextLinkArrowFollow } from './useTextLinkArrowFollow';

export default function ThinkingThroughDesignSection({ onAboutClick }: { onAboutClick: () => void }) {
  const aboutCtaRef = useRef<HTMLButtonElement>(null);
  useTextLinkArrowFollow(aboutCtaRef);

  return (
    <section
      aria-labelledby="about-home-bio-heading"
      className="home-about-section w-full overflow-visible px-4 pb-0 pt-0 sm:px-6 md:px-12 md:pt-0"
    >
      <div className="home-chapter-band">
        <HomeChapterLabel id="home-chapter-about" field="about">
          {aboutMe.chapterH2}
        </HomeChapterLabel>
      </div>

      <div className="home-about-bio mx-auto max-w-[1180px]">
        <h2
          id="about-home-bio-heading"
          className="home-about-bio__title mb-0 max-w-[28ch] text-pretty font-heading text-[length:var(--text-h2)] font-semibold leading-[var(--leading-h2)] tracking-[-0.052em] text-[var(--color-heading-h2)]"
        >
          {aboutMe.h2}
        </h2>
        <p className="home-about-bio__body adopt-body m-0 max-w-[54ch] text-pretty text-ink/72">
          {aboutMe.body}
        </p>
        <button
          ref={aboutCtaRef}
          type="button"
          className="home-case-study-cta text-link-tilt"
          onClick={onAboutClick}
        >
          <TextLinkLabelWords label={aboutMe.cta} />
          <span className="home-case-study-cta__arrow" aria-hidden>
            →
          </span>
        </button>
      </div>
    </section>
  );
}
