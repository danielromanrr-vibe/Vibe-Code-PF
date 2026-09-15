import { useEffect, useRef } from 'react';
import { ABOUT_HERO_ROOMS } from '../../content/aboutStoryRooms';
import { MANDALA_SPRITE_NAMES, type MandalaSpriteId } from '../../lib/mandalaSprite';
import TextLinkLabelWords from '../TextLinkLabelWords';
import { useTextLinkArrowFollow } from '../useTextLinkArrowFollow';

type AboutStoryColumnProps = {
  spriteId: MandalaSpriteId;
  onSpriteChange: (id: MandalaSpriteId) => void;
  onThinkingClick?: () => void;
};

export default function AboutStoryColumn({
  spriteId,
  onSpriteChange,
  onThinkingClick,
}: AboutStoryColumnProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const onSpriteChangeRef = useRef(onSpriteChange);
  onSpriteChangeRef.current = onSpriteChange;

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;

    const nodes = [...root.querySelectorAll<HTMLElement>('[data-story-room]')];
    if (nodes.length === 0) return;

    const pickRoom = () => {
      const padTop = parseFloat(getComputedStyle(root).paddingTop) || 0;
      const snapLine = root.getBoundingClientRect().top + padTop + 8;
      let active = nodes[0];
      for (const node of nodes) {
        const rect = node.getBoundingClientRect();
        if (rect.top <= snapLine) active = node;
        if (rect.top <= snapLine && rect.bottom > snapLine) {
          active = node;
          break;
        }
      }
      const id = active?.getAttribute('data-story-room') as MandalaSpriteId | null;
      if (id) onSpriteChangeRef.current(id);
    };

    pickRoom();
    root.addEventListener('scroll', pickRoom, { passive: true });

    const observer = new IntersectionObserver(
      () => pickRoom(),
      {
        root,
        rootMargin: '-8% 0px -42% 0px',
        threshold: [0.16, 0.32, 0.5, 0.72],
      },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => {
      observer.disconnect();
      root.removeEventListener('scroll', pickRoom);
    };
  }, []);

  return (
    <div ref={scrollerRef} className="about-story-copy">
      <div className="about-story-sheet">
        {ABOUT_HERO_ROOMS.map((room) => {
          return (
            <section
              key={room.id}
              id={room.id}
              data-story-room={room.spriteId}
              className="about-story-section"
              aria-labelledby={`${room.id}-title`}
            >
              <div className="about-story-section__main">
                <p className="about-story-section__kicker">{room.kicker}</p>
                <h2 id={`${room.id}-title`} className="about-story-section__title">
                  {room.title}
                </h2>
                {room.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="about-story-section__body">
                    {paragraph}
                  </p>
                ))}
              </div>
              {room.aside ? <p className="about-story-section__aside">{room.aside}</p> : null}
              {room.cta && onThinkingClick ? (
                <AboutThinkingCta label={room.cta.label} onClick={onThinkingClick} />
              ) : null}
            </section>
          );
        })}
      </div>
      <span className="sr-only" aria-live="polite">
        {MANDALA_SPRITE_NAMES[spriteId]}
      </span>
    </div>
  );
}

function AboutThinkingCta({ label, onClick }: { label: string; onClick: () => void }) {
  const ctaRef = useRef<HTMLAnchorElement>(null);
  useTextLinkArrowFollow(ctaRef);

  return (
    <a
      ref={ctaRef}
      href="/#thinking-cards-heading"
      className="about-story-section__cta text-link-tilt"
      onClick={(event) => {
        event.preventDefault();
        onClick();
      }}
    >
      <TextLinkLabelWords label={label} />
      <span className="about-story-section__cta-arrow" aria-hidden>
        →
      </span>
    </a>
  );
}
