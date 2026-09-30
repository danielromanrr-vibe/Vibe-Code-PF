import { useEffect, useState, type RefObject } from 'react';

/**
 * The last owned heading whose top has passed the reading line.
 * Headings that have scrolled away still count, so a long run of images
 * keeps the title you are in. Null until the first owned heading arrives.
 */
export function useActiveSection(
  rootRef: RefObject<HTMLElement | null>,
  enabled: boolean,
): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!enabled || !root) return;

    const nodes = [...root.querySelectorAll<HTMLElement>('[data-ownership-id]')];
    if (nodes.length === 0) return;

    let frame = 0;
    const pick = () => {
      const rootRect = root.getBoundingClientRect();
      const line = rootRect.top + Math.min(180, rootRect.height * 0.28);
      let chosen: string | null = null;
      for (const node of nodes) {
        if (node.getBoundingClientRect().top <= line) {
          chosen = node.dataset.ownershipId ?? chosen;
        }
      }
      setActiveId(chosen);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(pick);
    };

    const observer = new IntersectionObserver(onScroll, {
      root,
      threshold: [0, 0.25, 0.5, 1],
    });
    nodes.forEach((node) => observer.observe(node));
    root.addEventListener('scroll', onScroll, { passive: true });
    pick();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      root.removeEventListener('scroll', onScroll);
    };
  }, [rootRef, enabled]);

  return activeId;
}
