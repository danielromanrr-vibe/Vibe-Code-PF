import { type RefObject } from 'react';
import { useScroll, useTransform, useSpring } from 'motion/react';

export type EditorialParallaxVariant = 'lead' | 'body';

const PARALLAX_RANGE: Record<EditorialParallaxVariant, [number, number]> = {
  lead: [8, -10],
  body: [5, -7],
};

const PARALLAX_SPRING: Record<EditorialParallaxVariant, { stiffness: number; damping: number; mass: number }> = {
  lead: { stiffness: 88, damping: 26, mass: 0.34 },
  body: { stiffness: 82, damping: 24, mass: 0.36 },
};

/** Scroll-linked Y parallax for editorial blocks (matches homepage hero intro). */
export function useEditorialScrollParallax(
  targetRef: RefObject<HTMLElement | null>,
  scrollContainerRef: RefObject<HTMLElement | null>,
  reducedMotion: boolean,
  variant: EditorialParallaxVariant = 'lead',
) {
  const { scrollYProgress } = useScroll({
    target: targetRef,
    container: scrollContainerRef,
    offset: ['start end', 'end start'],
  });
  const [from, to] = PARALLAX_RANGE[variant];
  const y = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [from, to]);
  return useSpring(y, PARALLAX_SPRING[variant]);
}
