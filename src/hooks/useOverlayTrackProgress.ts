import { useEffect, type RefObject } from 'react';

/** Framer `useScroll` start/start → end/end, measured against a real overlay scroller. */
export function measureOverlayTrackProgress(track: HTMLElement, container: HTMLElement): number {
  const trackRect = track.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  const trackTopInContent = container.scrollTop + (trackRect.top - containerRect.top);
  const range = track.offsetHeight - container.clientHeight;
  if (range <= 1) return 0;
  return Math.max(0, Math.min(1, (container.scrollTop - trackTopInContent) / range));
}

/**
 * Drive wheel progress from the case-study overlay’s own scroll.
 * Does not use Framer `useScroll` (that hook can bind to `window` if the overlay
 * ref is late, which is silent on a locked body — the live-site “dead wheel”).
 */
export function useOverlayTrackProgress(
  trackRef: RefObject<HTMLElement | null>,
  containerRef: RefObject<HTMLElement | null>,
  onProgress: (progress: number) => void,
): void {
  useEffect(() => {
    let cancelled = false;
    let detach = () => {};

    const bind = () => {
      if (cancelled) return;
      const track = trackRef.current;
      const container = containerRef.current;
      if (!track || !container) {
        requestAnimationFrame(bind);
        return;
      }

      const emit = () => {
        onProgress(measureOverlayTrackProgress(track, container));
      };

      container.addEventListener('scroll', emit, { passive: true });
      window.addEventListener('resize', emit);
      const observer = new ResizeObserver(emit);
      observer.observe(track);
      observer.observe(container);
      emit();

      detach = () => {
        container.removeEventListener('scroll', emit);
        window.removeEventListener('resize', emit);
        observer.disconnect();
      };
    };

    bind();
    return () => {
      cancelled = true;
      detach();
    };
  }, [trackRef, containerRef, onProgress]);
}
