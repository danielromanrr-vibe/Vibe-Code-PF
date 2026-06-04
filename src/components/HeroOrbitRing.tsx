import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

// Each word is centered at the midpoint of its 1/3 slice of the circle.
// Midpoints: 1/6 = 16.67%, 1/2 = 50%, 5/6 = 83.33%
// Separators sit at the boundaries: 0%, 33.33%, 66.67%
const WORDS = ['STRATEGY', 'SYSTEMS', 'VISUAL'] as const;
const WORD_OFFSETS = ['16.67%', '50%', '83.33%'] as const;
// The VISUAL→STRATEGY boundary wraps at 0%/100%; use 98% to avoid textAnchor clipping at path start
const DOT_OFFSETS = ['98%', '33.33%', '66.67%'] as const;

export default function HeroOrbitRing() {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [radius, setRadius] = useState(52);

  useEffect(() => {
    if (prefersReducedMotion) return;
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
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  const size = radius * 2;
  const c = radius;
  const circlePath = `M ${c},${c - radius} A ${radius},${radius} 0 1,1 ${c},${c + radius} A ${radius},${radius} 0 1,1 ${c},${c - radius}`;

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
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
      >
        <defs>
          <path id="hero-orbit-circle-path" d={circlePath} />
        </defs>

        {/* Words — centered in their respective thirds */}
        {WORDS.map((word, i) => (
          <text
            key={word}
            fontFamily="var(--font-eyebrow, 'Zilla Slab', Georgia, serif)"
            fontSize="10.5"
            fontWeight="600"
            letterSpacing="0.55"
            fill="currentColor"
          >
            <textPath
              href="#hero-orbit-circle-path"
              startOffset={WORD_OFFSETS[i]}
              textAnchor="middle"
            >
              {word}
            </textPath>
          </text>
        ))}

        {/* Dot separators — sit at the boundaries between thirds */}
        {DOT_OFFSETS.map((offset) => (
          <text
            key={offset}
            fontFamily="var(--font-eyebrow, 'Zilla Slab', Georgia, serif)"
            fontSize="8"
            fill="currentColor"
          >
            <textPath
              href="#hero-orbit-circle-path"
              startOffset={offset}
              textAnchor="middle"
            >
              ·
            </textPath>
          </text>
        ))}
      </motion.svg>
    </div>
  );
}
