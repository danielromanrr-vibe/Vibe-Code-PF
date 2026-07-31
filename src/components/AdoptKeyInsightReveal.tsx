import { useRef, type RefObject } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import TokenButton, { tokenButtonClassName } from './TokenButton';

export type KeyInsightLine = {
  text: string;
  mod?: '' | 'muted' | 'punch' | string;
};

type AdoptKeyInsightRevealProps = {
  lines: readonly KeyInsightLine[];
  scrollContainerRef: RefObject<HTMLElement | null>;
  reducedMotion: boolean;
  eyebrow?: string;
  learnMoreHref?: string;
  learnMoreLabel?: string;
};

const PROGRESS_SPRING = { stiffness: 40, damping: 34, mass: 0.65 };

/**
 * Rhythm: “Key insight” → rest → statement + Learn more together.
 *   0.00–0.28  Eyebrow lands
 *   0.28–0.48  Pause
 *   0.48–1.00  Statement string + CTA (same beat)
 */
const PAUSE_END = 0.48;

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function smoothstep(t: number) {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
}

function windowProgress(p: number, start: number, end: number) {
  if (end <= start) return p >= end ? 1 : 0;
  return smoothstep((p - start) / (end - start));
}

/**
 * Key insight — label, rest, then statement + Learn more as one beat.
 */
export default function AdoptKeyInsightReveal({
  lines,
  scrollContainerRef,
  reducedMotion,
  eyebrow = 'Key insight',
  learnMoreHref = '#adopt-section-strategic-decisions',
  learnMoreLabel = 'Learn more',
}: AdoptKeyInsightRevealProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    container: scrollContainerRef,
    offset: ['start start', 'end end'],
  });
  const progress = useSpring(scrollYProgress, PROGRESS_SPRING);

  // —— Beat 1: Key insight ——
  const eyebrowOpacity = useTransform(progress, (p) => windowProgress(p, 0.02, 0.2));
  const eyebrowY = useTransform(progress, (p) => 18 * (1 - windowProgress(p, 0.02, 0.22)));
  const eyebrowTracking = useTransform(progress, (p) => {
    const t = windowProgress(p, 0.02, 0.24);
    return `${(0.22 - t * 0.11).toFixed(3)}em`;
  });

  // —— Beat 2: statement + CTA together ——
  const bodyOpacity = useTransform(progress, (p) => windowProgress(p, PAUSE_END, 0.72));
  const bodyY = useTransform(progress, (p) => 22 * (1 - windowProgress(p, PAUSE_END, 0.74)));
  const bodyBlur = useTransform(progress, (p) => {
    const t = windowProgress(p, PAUSE_END, 0.72);
    return `blur(${(4.5 * (1 - t)).toFixed(2)}px)`;
  });
  const bodyPointer = useTransform(progress, (p) => (p >= PAUSE_END + 0.12 ? 'auto' : 'none'));

  const atmosphereOpacity = useTransform(progress, (p) =>
    windowProgress(p, PAUSE_END + 0.04, 0.82),
  );

  const stageY = useTransform(progress, (p) => {
    const enter = windowProgress(p, 0, 0.14);
    const exit = windowProgress(p, 0.9, 1);
    return 12 * (1 - enter) - 8 * exit;
  });

  const scrollToLearnMore = () => {
    const target = document.querySelector(learnMoreHref);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const statement = (
    <div className="adopt-key-insight-statement">
      {lines.map(({ text, mod }) => (
        <p key={text} className={`insight-line${mod ? ` insight-line--${mod}` : ''}`}>
          {text}
        </p>
      ))}
    </div>
  );

  if (reducedMotion) {
    return (
      <div className="adopt-key-insight-theater adopt-key-insight-theater--static">
        <div className="adopt-key-insight-theater__stage">
          <p
            id="adopt-key-insight-heading"
            className="adopt-key-insight-eyebrow adopt-meta-label tracking-widest uppercase text-center text-ink/45"
          >
            {eyebrow}
          </p>
          {statement}
          <div className="adopt-key-insight-cta-wrap">
            <a href={learnMoreHref} className={`${tokenButtonClassName} adopt-key-insight-cta`}>
              {learnMoreLabel}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={trackRef} className="adopt-key-insight-theater">
      <div className="adopt-key-insight-theater__pin">
        <motion.div
          className="adopt-key-insight-atmosphere"
          aria-hidden
          style={{ opacity: atmosphereOpacity }}
        />

        <motion.div className="adopt-key-insight-theater__stage" style={{ y: stageY }}>
          <motion.p
            id="adopt-key-insight-heading"
            className="adopt-key-insight-eyebrow adopt-meta-label uppercase text-center text-ink/45"
            style={{
              opacity: eyebrowOpacity,
              y: eyebrowY,
              letterSpacing: eyebrowTracking,
            }}
          >
            {eyebrow}
          </motion.p>

          <motion.div
            className="adopt-key-insight-body"
            style={{
              opacity: bodyOpacity,
              y: bodyY,
              filter: bodyBlur,
              pointerEvents: bodyPointer,
            }}
          >
            {statement}
            <div className="adopt-key-insight-cta-wrap">
              <TokenButton className="adopt-key-insight-cta" onClick={scrollToLearnMore}>
                {learnMoreLabel}
              </TokenButton>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
