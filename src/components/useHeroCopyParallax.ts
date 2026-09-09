import { useEffect, type RefObject } from 'react';
import { useMotionValue, useSpring, useTransform } from 'motion/react';

const SPRING = { stiffness: 62, damping: 26, mass: 0.48 };

/**
 * Quiet pointer parallax for the homepage lockup.
 * Type moves more than the subhead; the portrait barely moves.
 */
export function useHeroCopyParallax(
  sectionRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const nx = useMotionValue(0);
  const ny = useMotionValue(0);
  const sx = useSpring(nx, SPRING);
  const sy = useSpring(ny, SPRING);

  const typeStyle = {
    x: useTransform(sx, (v) => v * 6),
    y: useTransform(sy, (v) => v * 5),
  };
  const subStyle = {
    x: useTransform(sx, (v) => v * 3),
    y: useTransform(sy, (v) => v * 2.5),
  };
  const portraitStyle = {
    x: useTransform(sx, (v) => v * 1.25),
    y: useTransform(sy, (v) => v * 1),
  };

  useEffect(() => {
    if (!enabled) {
      nx.set(0);
      ny.set(0);
      return;
    }

    const root = sectionRef.current;
    if (!root) return;

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!fine.matches) return;

    let raf = 0;
    let pendingX = 0;
    let pendingY = 0;

    const apply = () => {
      raf = 0;
      nx.set(pendingX);
      ny.set(pendingY);
    };

    const onMove = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      if (rect.width < 8 || rect.height < 8) return;
      pendingX = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1));
      pendingY = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1));
      if (!raf) raf = window.requestAnimationFrame(apply);
    };

    const onLeave = () => {
      pendingX = 0;
      pendingY = 0;
      if (!raf) raf = window.requestAnimationFrame(apply);
    };

    root.addEventListener('pointermove', onMove, { passive: true });
    root.addEventListener('pointerleave', onLeave);
    return () => {
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
      if (raf) window.cancelAnimationFrame(raf);
      nx.set(0);
      ny.set(0);
    };
  }, [enabled, nx, ny, sectionRef]);

  return { typeStyle, subStyle, portraitStyle };
}
