import { useRef, type ReactNode, type RefObject } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useEditorialScrollParallax } from '../hooks/useEditorialScrollParallax';

type AdoptFloatingIntroCardProps = {
  children: ReactNode;
  scrollContainerRef: RefObject<HTMLElement | null>;
  reducedMotion?: boolean;
};

/** Scroll parallax + passive breathe — mirrors homepage editorial card feel. */
export default function AdoptFloatingIntroCard({
  children,
  scrollContainerRef,
  reducedMotion: reducedMotionProp,
}: AdoptFloatingIntroCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const systemReduced = useReducedMotion();
  const reducedMotion = reducedMotionProp ?? systemReduced ?? false;
  const y = useEditorialScrollParallax(ref, scrollContainerRef, reducedMotion, 'lead');

  return (
    <motion.div ref={ref} style={{ y }} className="adopt-intro-floating-card">
      {children}
    </motion.div>
  );
}
