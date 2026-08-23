import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import HeroIntroComet from './HeroIntroComet';
import { heroIntroTiming, msUntilStarPass, type StarLightingFrame } from '../lib/heroIntroTiming';

type StarPhase = 'waiting' | 'passing' | 'done';

type HeroIntroStarPassProps = {
  onPortraitTwinkle?: (intensity: number) => void;
  onStarFrame?: (frame: StarLightingFrame) => void;
  /** Fires once when the star sweeps the portrait — begins sky / mandala reveal */
  onPortraitIlluminate?: () => void;
  /** Fires when the pass finishes — settles the reveal */
  onPassComplete?: () => void;
};

/**
 * Mandala shooting star — waits for parallax intro + pause, then sweeps the h1 row.
 */
export default function HeroIntroStarPass({
  onPortraitTwinkle,
  onStarFrame,
  onPortraitIlluminate,
  onPassComplete,
}: HeroIntroStarPassProps) {
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<StarPhase>('waiting');
  const [runKey, setRunKey] = useState(0);
  const [passOpacity, setPassOpacity] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;

    let delayTimer = 0;

    const startPass = () => {
      setRunKey((k) => k + 1);
      setPassOpacity(0);
      setPhase('passing');
    };

    setPhase('waiting');
    delayTimer = window.setTimeout(startPass, msUntilStarPass());

    return () => {
      window.clearTimeout(delayTimer);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  const overlayOpacity =
    phase === 'passing' ? passOpacity * heroIntroTiming.starVisualScale : 0;

  return (
    <div
      data-hero-star-field
      className="pointer-events-none absolute -inset-x-[14%] -inset-y-[110%] z-[30]"
      style={{ opacity: overlayOpacity }}
      aria-hidden
    >
      <HeroIntroComet
        key={runKey}
        runKey={runKey}
        active={phase === 'passing'}
        onPortraitTwinkle={onPortraitTwinkle}
        onStarFrame={onStarFrame}
        onPortraitIlluminate={onPortraitIlluminate}
        onEnvelope={setPassOpacity}
        onComplete={() => {
          setPassOpacity(0);
          setPhase('done');
          onPassComplete?.();
        }}
      />
    </div>
  );
}
