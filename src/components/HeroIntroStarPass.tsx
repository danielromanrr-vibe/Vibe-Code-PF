import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import HeroIntroComet from './HeroIntroComet';
import { heroIntroTiming, msUntilStarPass, type StarLightingFrame } from '../lib/heroIntroTiming';

type StarPhase = 'waiting' | 'passing' | 'done';

type HeroIntroStarPassProps = {
  onStarFrame?: (frame: StarLightingFrame) => void;
  /** Once — star approaches the portrait; type illuminate only (role + subhead). */
  onPortraitIlluminate?: () => void;
  /** Once — pass finished; start post-pass sky + constellation. */
  onPassComplete?: () => void;
};

/**
 * Mandala shooting star — in the scene from frame 0, then sweeps the h1 row.
 * Does not light sky, constellation, portrait, or orbit.
 */
export default function HeroIntroStarPass({
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

    const delay = msUntilStarPass();
    if (delay <= 0) {
      startPass();
      return;
    }

    setPhase('waiting');
    delayTimer = window.setTimeout(startPass, delay);

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
      className="pointer-events-none absolute -inset-x-[12%] -inset-y-[32%] z-[30]"
      style={{ opacity: overlayOpacity, isolation: 'isolate', mixBlendMode: 'normal' }}
      aria-hidden
    >
      <HeroIntroComet
        key={runKey}
        runKey={runKey}
        active={phase === 'passing'}
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
