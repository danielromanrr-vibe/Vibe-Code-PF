import { useRef } from 'react';
import { aboutMe, thinking, thinkingNotes } from '../content/home';
import HomeChapterLabel from './HomeChapterLabel';
import TextLinkLabelWords from './TextLinkLabelWords';
import { useTextLinkArrowFollow } from './useTextLinkArrowFollow';

type ThinkingNoteActions = {
  onAboutClick: () => void;
  onOpenAdopt?: () => void;
  onOpenDriver?: () => void;
  onOpenAi?: () => void;
  onOpenTouchpoints?: () => void;
  onOpenVhenyProduct?: () => void;
  onOpenVhenyBranding?: () => void;
  onOpenVisual?: () => void;
};

function openThinkingNote(href: string, actions: ThinkingNoteActions) {
  if (href.includes('adopt-a-school')) actions.onOpenAdopt?.();
  else if (href.includes('map-aid') || href.includes('driver-coordination')) actions.onOpenDriver?.();
  else if (href.includes('designing-with-ai')) actions.onOpenAi?.();
  else if (href.includes('vheny-diamonds/branding')) actions.onOpenVhenyBranding?.();
  else if (href.includes('vheny-diamonds')) {
    actions.onOpenVhenyProduct?.() ?? actions.onOpenTouchpoints?.();
  } else if (href.includes('visual-design')) actions.onOpenVisual?.();
}

function ThinkingLink({ label, onClick }: { label: string; onClick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  useTextLinkArrowFollow(ref);
  return (
    <button ref={ref} type="button" className="home-case-study-cta text-link-tilt" onClick={onClick}>
      <TextLinkLabelWords label={label} />
      <span className="home-case-study-cta__arrow" aria-hidden>
        →
      </span>
    </button>
  );
}

export default function ThinkingThroughDesignSection(actions: ThinkingNoteActions) {
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
          onClick={actions.onAboutClick}
        >
          <TextLinkLabelWords label={aboutMe.cta} />
          <span className="home-case-study-cta__arrow" aria-hidden>
            →
          </span>
        </button>
      </div>

      <div className="home-about-thinking" aria-labelledby="thinking-cards-heading">
        <h2
          id="thinking-cards-heading"
          className="home-about-thinking__heading mb-0 text-pretty font-heading text-[length:var(--text-h2)] font-semibold leading-[var(--leading-h2)] tracking-[-0.052em] text-[var(--color-heading-h2)]"
        >
          {thinking.h2}
        </h2>
        <ul className="home-about-thinking__list">
          {thinkingNotes.map((note) => (
            <li key={note.id}>
              <h3 className="home-about-thinking__title">{note.title}</h3>
              <p className="home-about-thinking__example">{note.example}</p>
              {note.linkLabel ? (
                <ThinkingLink label={note.linkLabel} onClick={() => openThinkingNote(note.linkHref, actions)} />
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
