import AboutStoryColumn from './AboutStoryColumn';
import { hero as aboutHero } from '../../content/about';

export default function AboutHeroSection() {
  return (
    <section className="about-hero-section" aria-label="About intro">
      <div className="about-story" aria-labelledby="about-heading">
        <div className="about-story-split">
          <div className="about-story-copy">
            <header className="about-story-hero">
              <h1 id="about-heading" className="about-story-hero__title">
                {aboutHero.h1Lines.map((line) => (
                  <span key={line} className="about-story-hero__title-line">
                    {line}
                  </span>
                ))}
              </h1>
            </header>
            <AboutStoryColumn />
          </div>
          <figure className="about-story-hero__media">
            <div className="about-story-hero__frame">
              <img src="/about-me.jpg" alt="Daniel on a bridge overlook above the water." />
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}
