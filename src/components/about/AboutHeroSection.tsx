import { useCallback, useState } from 'react';
import Mandala from '../Mandala';
import AboutStoryColumn from './AboutStoryColumn';
import { nextAboutStoryRoom } from '../../content/aboutStoryRooms';
import type { MandalaSpriteId } from '../../lib/mandalaSprite';

const ABOUT_FIELD_SCALE = 0.5;

export default function AboutHeroSection() {
  const [storySprite, setStorySprite] = useState<MandalaSpriteId>('paloma');

  const cycleStoryFromMandala = useCallback(() => {
    const next = nextAboutStoryRoom(storySprite);
    setStorySprite(next.spriteId);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scroller = document.querySelector('.about-story-copy');
    const node = document.getElementById(next.id);
    if (scroller instanceof HTMLElement && node) {
      const top =
        node.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop;
      scroller.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
    }
  }, [storySprite]);

  return (
    <section className="about-hero-section" aria-label="About intro">
      <div className="about-story" aria-labelledby="about-heading">
        <header className="about-story-hero">
          <div className="about-story-hero__stack">
            <div className="about-story-hero__cluster">
              <div id="mandala-about-center" className="about-story-hero__anchor" aria-hidden />
              <h1 id="about-heading" className="about-story-hero__title">
                <span className="about-story-hero__title-line">I LOVE DESIGN,</span><br />
                <span className="about-story-hero__title-tight">TECHNOLOGY</span> &<br />
                <span className="about-story-hero__title-line">ARTS & CRAFTS</span>
              </h1>
            </div>
            <figure className="about-story-hero__media">
              <div className="about-story-hero__frame">
                <img src="/hero-inline-portrait.png" alt="" />
              </div>
            </figure>
          </div>
        </header>

        <AboutStoryColumn spriteId={storySprite} onSpriteChange={setStorySprite} />

        <Mandala
          variant="heroIntegrated"
          anchorId="mandala-about-center"
          interactionProfile="euphoria"
          placementMode="default"
          rotationPace={0.25}
          fieldScale={ABOUT_FIELD_SCALE}
          canvasLayerZIndex={18}
          spriteId={storySprite}
          onMobileDoubleTap={cycleStoryFromMandala}
        />
      </div>
    </section>
  );
}
