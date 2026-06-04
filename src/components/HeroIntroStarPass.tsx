import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import HeroIntroComet from './HeroIntroComet';
import { heroIntroTiming, msUntilStarPass } from '../lib/heroIntroTiming';

type StarPhase = 'waiting' | 'passing' | 'done';

/**
 * Mandala shooting star — waits for parallax intro + pause, then sweeps the h1 row.
 */
export default function HeroIntroStarPass() {
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<StarPhase>('waiting');
  const [runKey, setRunKey] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;

    let delayTimer = 0;

    const startPass = () => {
      setRunKey((k) => k + 1);
      setPhase('passing');
    };

    setPhase('waiting');
    delayTimer = window.setTimeout(startPass, msUntilStarPass());

    return () => {
      window.clearTimeout(delayTimer);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  const visible = phase === 'passing';

  return (
    <div
      className="pointer-events-none absolute -inset-x-[14%] -inset-y-[110%] z-[30] transition-opacity duration-150"
      style={{ opacity: visible ? heroIntroTiming.starVisualScale : 0 }}
      aria-hidden
    >
      <HeroIntroComet
        key={runKey}
        runKey={runKey}
        active={phase === 'passing'}
        onComplete={() => setPhase('done')}
      />
    </div>
  );
}
