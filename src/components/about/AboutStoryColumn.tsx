import { intro } from '../../content/about';

export default function AboutStoryColumn() {
  return (
    <div className="about-story-copy">
      <div className="about-story-sheet">
        <section id={intro.id} className="about-story-section" aria-labelledby={`${intro.id}-title`}>
          <h2 id={`${intro.id}-title`} className="about-story-section__title">
            {intro.h2}
          </h2>
          <p className="about-story-section__body">{intro.body}</p>
        </section>
      </div>
    </div>
  );
}
