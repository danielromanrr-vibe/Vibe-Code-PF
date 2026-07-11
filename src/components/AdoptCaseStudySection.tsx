import { type ReactNode, type RefObject } from 'react';
import { motion } from 'motion/react';
import AdoptCaseStudyActSeparator from './AdoptCaseStudyActSeparator';
import AdoptCaseStudyParallax from './AdoptCaseStudyParallax';
import { makeRevealItem, makeRevealSection } from '../lib/editorialRevealMotion';
import type { EditorialParallaxVariant } from '../hooks/useEditorialScrollParallax';

type AdoptCaseStudySectionProps = {
  children: ReactNode;
  act: string;
  scrollContainerRef: RefObject<HTMLElement | null>;
  reducedMotion: boolean;
  showSeparator?: boolean;
  parallax?: EditorialParallaxVariant | false;
  reveal?: 'section' | 'item';
  className?: string;
  id?: string;
  'aria-labelledby'?: string;
  'aria-label'?: string;
};

export default function AdoptCaseStudySection({
  children,
  act,
  scrollContainerRef,
  reducedMotion,
  showSeparator = true,
  parallax = 'body',
  reveal = 'section',
  className = '',
  id,
  'aria-labelledby': ariaLabelledby,
  'aria-label': ariaLabel,
}: AdoptCaseStudySectionProps) {
  const variants = reveal === 'item' ? makeRevealItem(reducedMotion) : makeRevealSection(reducedMotion);

  const inner =
    parallax === false ? (
      children
    ) : (
      <AdoptCaseStudyParallax
        scrollContainerRef={scrollContainerRef}
        reducedMotion={reducedMotion}
        variant={parallax}
        className="adopt-case-study-act__parallax min-w-0"
      >
        {children}
      </AdoptCaseStudyParallax>
    );

  return (
    <>
      {showSeparator ? <AdoptCaseStudyActSeparator /> : null}
      <motion.section
        id={id}
        aria-labelledby={ariaLabelledby}
        aria-label={ariaLabel}
        className={['adopt-case-study-act', `adopt-case-study-act--${act}`, 'min-w-0 scroll-mt-6', className]
          .filter(Boolean)
          .join(' ')}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.14 }}
        variants={variants}
      >
        {inner}
      </motion.section>
    </>
  );
}
