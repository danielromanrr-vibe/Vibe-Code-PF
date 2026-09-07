import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

/**
 * Instrument bezel around the hero portrait — a hairline ring with radial ticks.
 *
 * Previously this carried the words STRATEGY · SYSTEMS · VISUAL. Those moved up into the
 * readable capability eyebrow, so the ring went non-verbal rather than repeat them at two
 * scales. Three major ticks still mark the three domains; the bezel just stops narrating.
 */
const MINOR_TICK_COUNT = 36;
/** Majors sit at the three former word centers, so the geometry still reads as thirds. */
const MAJOR_TICK_ANGLES = [-60, 60, 180] as const;

const MINOR_TICK_LENGTH = 2.25;
const MAJOR_TICK_LENGTH = 4.5;

export default function HeroOrbitRing() {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [radius, setRadius] = useState(52);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;

    const update = () => {
      setRadius((parent.offsetWidth / 2) * 1.2);
    };
    update();

    const ro = new ResizeObserver(update);
    ro.observe(parent);
    return () => ro.disconnect();
  }, []);

  const size = radius * 2;
  const c = radius;

  const tickAt = (angleDeg: number, length: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    return {
      x1: c + cos * radius,
      y1: c + sin * radius,
      x2: c + cos * (radius + length),
      y2: c + sin * (radius + length),
    };
  };

  const majorSet = new Set(MAJOR_TICK_ANGLES.map((a) => ((a % 360) + 360) % 360));
  const minorAngles = Array.from({ length: MINOR_TICK_COUNT }, (_, i) => {
    const step = 360 / MINOR_TICK_COUNT;
    return Math.round(i * step * 100) / 100;
  }).filter((angle) => !majorSet.has(((angle % 360) + 360) % 360));

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute"
      style={{
        width: size,
        height: size,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        overflow: 'visible',
        zIndex: 30,
      }}
      aria-hidden
    >
      <motion.svg
        className="hero-orbit-ring"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ overflow: 'visible', color: 'var(--color-hero-orbit-ink, #ffffff)' }}
        animate={prefersReducedMotion ? undefined : { rotate: 360 }}
        transition={
          prefersReducedMotion ? undefined : { duration: 32, repeat: Infinity, ease: 'linear' }
        }
      >
        <circle
          cx={c}
          cy={c}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={0.5}
          opacity={0.04}
        />

        {minorAngles.map((angle) => {
          const t = tickAt(angle, MINOR_TICK_LENGTH);
          return (
            <line
              key={`minor-${angle}`}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke="currentColor"
              strokeWidth={0.65}
              strokeLinecap="round"
              opacity={0.11}
            />
          );
        })}

        {MAJOR_TICK_ANGLES.map((angle) => {
          const t = tickAt(angle, MAJOR_TICK_LENGTH);
          return (
            <line
              key={`major-${angle}`}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke="currentColor"
              strokeWidth={0.85}
              strokeLinecap="round"
              opacity={0.22}
            />
          );
        })}
      </motion.svg>
    </div>
  );
}
