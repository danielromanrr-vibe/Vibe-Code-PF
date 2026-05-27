import { useRef, type ReactNode, type RefObject } from 'react';
import { motion } from 'motion/react';
import {
  useEditorialScrollParallax,
  type EditorialParallaxVariant,
} from '../hooks/useEditorialScrollParallax';

type AdoptCaseStudyParallaxProps = {
  children: ReactNode;
  scrollContainerRef: RefObject<HTMLElement | null>;
  reducedMotion: boolean;
  variant?: EditorialParallaxVariant;
  className?: string;
  as?: 'div' | 'section';
  id?: string;
  'aria-labelledby'?: string;
};

export default function AdoptCaseStudyParallax({
  children,
  scrollContainerRef,
  reducedMotion,
  variant = 'body',
  className,
  as = 'div',
  id,
  'aria-labelledby': ariaLabelledby,
}: AdoptCaseStudyParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const y = useEditorialScrollParallax(
    ref as RefObject<HTMLElement | null>,
    scrollContainerRef,
    reducedMotion,
    variant,
  );
  const Comp = as === 'section' ? motion.section : motion.div;

  return (
    <Comp ref={ref} style={{ y }} className={className} id={id} aria-labelledby={ariaLabelledby}>
      {children}
    </Comp>
  );
}
