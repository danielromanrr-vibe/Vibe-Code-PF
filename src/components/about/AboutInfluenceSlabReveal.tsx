import { useRef, type ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { EDITORIAL_REVEAL_EASE } from '../../lib/editorialRevealMotion';

type AboutInfluenceSlabRevealProps = {
  index: number;
  id: string;
  className: string;
  children: ReactNode;
};

/** Scroll parallax + in-view reveal for each About influence card cell. */
export default function AboutInfluenceSlabReveal({
  index,
  id,
  className,
  children,
}: AboutInfluenceSlabRevealProps) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const parallaxFrom = index % 2 === 0 ? 10 : 6;
  const parallaxTo = index % 2 === 0 ? -12 : -8;
  const parallaxY = useSpring(
    useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [parallaxFrom, parallaxTo]),
    { stiffness: 84, damping: 26, mass: 0.34 },
  );

  const variants = reducedMotion
    ? { hidden: { opacity: 1, y: 0, scale: 1 }, show: { opacity: 1, y: 0, scale: 1 } }
    : {
        hidden: { opacity: 0, y: 36, scale: 0.988, filter: 'blur(4px)' },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          transition: {
            duration: 0.54,
            ease: EDITORIAL_REVEAL_EASE,
            delay: index * 0.06,
          },
        },
      };

  return (
    <motion.div ref={ref} id={id} className={className} style={{ y: parallaxY }}>
      <motion.div
        className="about-influence-slabs__reveal-inner min-h-0"
        variants={variants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.22 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
