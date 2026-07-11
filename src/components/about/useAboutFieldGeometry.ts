import { useCallback, useEffect, useState, type RefObject } from 'react';
import { ABOUT_INFLUENCE_CARDS } from '../../content/aboutMandalaFacets';
import { atmosphereRingRadii, authoredInfluencePosition } from './aboutFieldLayout';
import { layoutForCard } from './aboutOrbitNodeUtils';
import type { MandalaSystemNodeLayout } from '../Mandala';

const ANCHOR_ID = 'mandala-about-center';

export type AboutFieldGeometry = {
  centerX: number;
  centerY: number;
  anchorRect: DOMRect | null;
  positions: ReadonlyMap<string, { x: number; y: number }>;
  ringRadii: readonly number[];
  fieldTimeSec: number;
};

function emptyGeometry(): AboutFieldGeometry {
  return {
    centerX: 0,
    centerY: 0,
    anchorRect: null,
    positions: new Map(),
    ringRadii: [],
    fieldTimeSec: 0,
  };
}

function measureGeometry(
  layouts: readonly MandalaSystemNodeLayout[],
  timeSec: number,
  driftEnabled: boolean,
): AboutFieldGeometry {
  const anchor = document.getElementById(ANCHOR_ID);
  const anchorRect = anchor?.getBoundingClientRect() ?? null;

  if (!anchorRect || anchorRect.width <= 0 || anchorRect.height <= 0) {
    return emptyGeometry();
  }

  const centerX = anchorRect.left + anchorRect.width / 2;
  const centerY = anchorRect.top + anchorRect.height / 2;
  const viewportWidth = window.innerWidth;

  const positions = new Map<string, { x: number; y: number }>();
  for (const card of ABOUT_INFLUENCE_CARDS) {
    const layout = layoutForCard(layouts, card);
    if (!layout) continue;
    positions.set(
      card.id,
      authoredInfluencePosition(
        card.id,
        centerX,
        centerY,
        anchorRect,
        viewportWidth,
        timeSec,
        driftEnabled,
      ),
    );
  }

  return {
    centerX,
    centerY,
    anchorRect,
    positions,
    ringRadii: atmosphereRingRadii(anchorRect),
    fieldTimeSec: timeSec,
  };
}

export function useAboutFieldGeometry(
  layoutsRef: RefObject<readonly MandalaSystemNodeLayout[]>,
  layoutTick = 0,
): AboutFieldGeometry {
  const [geometry, setGeometry] = useState<AboutFieldGeometry>(emptyGeometry);

  const syncLayout = useCallback(
    (timeSec: number, driftEnabled: boolean) => {
      setGeometry(measureGeometry(layoutsRef.current ?? [], timeSec, driftEnabled));
    },
    [layoutsRef],
  );

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const driftEnabled = !reducedMotion.matches;

    syncLayout(0, driftEnabled);

    const anchor = document.getElementById(ANCHOR_ID);
    let ro: ResizeObserver | null = null;
    const onResize = () => syncLayout(performance.now() / 1000, driftEnabled);
    if (anchor && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(onResize);
      ro.observe(anchor);
    }

    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, { passive: true });

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const timeSec = (now - start) / 1000;
      syncLayout(timeSec, driftEnabled);
      raf = requestAnimationFrame(tick);
    };

    if (driftEnabled) {
      raf = requestAnimationFrame(tick);
    }

    const onMotionChange = () => {
      const enabled = !reducedMotion.matches;
      if (!enabled) {
        cancelAnimationFrame(raf);
        syncLayout(0, false);
      } else if (!raf) {
        raf = requestAnimationFrame(tick);
      }
    };
    reducedMotion.addEventListener('change', onMotionChange);

    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize);
      reducedMotion.removeEventListener('change', onMotionChange);
    };
  }, [syncLayout, layoutTick]);

  return geometry;
}
