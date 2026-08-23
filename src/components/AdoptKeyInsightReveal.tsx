import { motion } from 'motion/react';
import { makeRevealItem, makeRevealSection } from '../lib/editorialRevealMotion';
import { tokenButtonClassName } from './TokenButton';

export type KeyInsightLine = {
  text: string;
  mod?: '' | 'muted' | 'punch' | string;
};

type AdoptKeyInsightRevealProps = {
  lines: readonly KeyInsightLine[];
  reducedMotion: boolean;
  eyebrow?: string;
  learnMoreHref?: string;
  learnMoreLabel?: string;
};

/**
 * Key insight — editorial pause between process and strategy.
 * Single in-view reveal; no scroll pinning or staged scroll beats.
 */
export default function AdoptKeyInsightReveal({
  lines,
  reducedMotion,
  eyebrow = 'Key insight',
  learnMoreHref = '#adopt-section-strategic-decisions',
  learnMoreLabel = 'Learn more',
}: AdoptKeyInsightRevealProps) {
  return (
    <motion.div
      className="adopt-key-insight-block"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.42 }}
      variants={makeRevealSection(reducedMotion)}
    >
      <motion.p
        id="adopt-key-insight-heading"
        className="adopt-key-insight-eyebrow adopt-meta-label tracking-widest uppercase text-center text-ink/45"
        variants={makeRevealItem(reducedMotion)}
      >
        {eyebrow}
      </motion.p>

      <div className="adopt-key-insight-statement">
        {lines.map(({ text, mod }) => (
          <motion.p
            key={text}
            className={`insight-line${mod ? ` insight-line--${mod}` : ''}`}
            variants={makeRevealItem(reducedMotion)}
          >
            {text}
          </motion.p>
        ))}
      </div>

      <motion.div className="adopt-key-insight-cta-wrap" variants={makeRevealItem(reducedMotion)}>
        <a href={learnMoreHref} className={`${tokenButtonClassName} adopt-key-insight-cta`}>
          {learnMoreLabel}
        </a>
      </motion.div>
    </motion.div>
  );
}
