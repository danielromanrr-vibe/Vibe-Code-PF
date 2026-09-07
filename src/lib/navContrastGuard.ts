import { useEffect, useState, type RefObject } from 'react';

type NavSurface = 'default' | 'media' | 'hero';

type Rgb = { r: number; g: number; b: number };

const INK: Rgb = { r: 20, g: 20, b: 20 };
const WHITE: Rgb = { r: 255, g: 255, b: 255 };
const PAGE_GRAY: Rgb = { r: 248, g: 249, b: 250 };
const NAVY: Rgb = { r: 12, g: 21, b: 40 };
const MEDIA_NAVY: Rgb = { r: 6, g: 12, b: 24 };

const FAIL_RATIO = 4.5;
const RECOVER_RATIO = 5.2;

const GROUND: Record<NavSurface, Rgb> = {
  hero: NAVY,
  media: WHITE,
  default: PAGE_GRAY,
};

const NAV_TINT: Record<NavSurface, { rgb: Rgb; a: number }> = {
  hero: { rgb: NAVY, a: 0 },
  media: { rgb: MEDIA_NAVY, a: 0.62 },
  default: { rgb: PAGE_GRAY, a: 0.94 },
};

const TEXT: Record<NavSurface, { rgb: Rgb; a: number }> = {
  hero: { rgb: WHITE, a: 1 },
  media: { rgb: WHITE, a: 1 },
  default: { rgb: INK, a: 0.78 },
};

function linearize(channel: number): number {
  const s = channel / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function luminance(rgb: Rgb): number {
  return 0.2126 * linearize(rgb.r) + 0.7152 * linearize(rgb.g) + 0.0722 * linearize(rgb.b);
}

function contrastRatio(a: Rgb, b: Rgb): number {
  const l1 = luminance(a);
  const l2 = luminance(b);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

function mix(fg: Rgb, bg: Rgb, a: number): Rgb {
  const t = Math.max(0, Math.min(1, a));
  return {
    r: fg.r * t + bg.r * (1 - t),
    g: fg.g * t + bg.g * (1 - t),
    b: fg.b * t + bg.b * (1 - t),
  };
}

function readCssZ(el: HTMLElement): number {
  const z = Number.parseInt(getComputedStyle(el).zIndex, 10);
  return Number.isFinite(z) ? z : 0;
}

function sampleCanvasPixel(
  canvas: HTMLCanvasElement,
  cssX: number,
  cssY: number,
): { rgb: Rgb; a: number } | null {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  if (w < 2 || h < 2) return null;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const sx = Math.max(0, Math.min(canvas.width - 1, Math.round((cssX / w) * canvas.width)));
  const sy = Math.max(0, Math.min(canvas.height - 1, Math.round((cssY / h) * canvas.height)));
  try {
    const px = ctx.getImageData(sx, sy, 1, 1).data;
    const a = (px[3] ?? 0) / 255;
    if (a < 0.04) return null;
    return { rgb: { r: px[0] ?? 0, g: px[1] ?? 0, b: px[2] ?? 0 }, a };
  } catch {
    return null;
  }
}

function sampleBehindNav(strip: HTMLElement, surface: NavSurface): number {
  const rect = strip.getBoundingClientRect();
  if (rect.width < 8 || rect.height < 8) return 21;

  const navZ = readCssZ(strip);
  const canvases = [...document.querySelectorAll<HTMLCanvasElement>('canvas[data-mandala-interactive]')]
    .filter((canvas) => readCssZ(canvas) <= navZ)
    .sort((a, b) => readCssZ(a) - readCssZ(b));

  const xs = [0.06, 0.18, 0.36, 0.55, 0.72, 0.86, 0.95];
  const ys = [0.38, 0.68];
  let worst = 21;

  for (const xf of xs) {
    for (const yf of ys) {
      const x = rect.left + rect.width * xf;
      const y = rect.top + rect.height * yf;
      let behind = GROUND[surface];
      for (const canvas of canvases) {
        const hit = sampleCanvasPixel(canvas, x, y);
        if (hit) behind = mix(hit.rgb, behind, hit.a);
      }
      const tint = NAV_TINT[surface];
      const glazed = mix(tint.rgb, behind, tint.a);
      const ink = TEXT[surface];
      const glazedFg = mix(ink.rgb, glazed, ink.a);
      const rawFg = mix(ink.rgb, behind, ink.a);
      worst = Math.min(worst, contrastRatio(glazedFg, glazed), contrastRatio(rawFg, behind));
    }
  }

  return worst;
}

/**
 * Locks the main nav to a solid, ink-on-gray surface when the field behind
 * it would drop type below WCAG AA (4.5:1).
 */
export function useNavContrastRescue(
  stripRef: RefObject<HTMLElement | null>,
  surface: NavSurface,
): boolean {
  const [rescue, setRescue] = useState(false);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;

    let timer = 0;
    let frame = 0;
    let active = rescue;

    const measure = () => {
      if (document.hidden) return;
      const ratio = sampleBehindNav(strip, surface);
      const next = active ? ratio < RECOVER_RATIO : ratio < FAIL_RATIO;
      if (next !== active) {
        active = next;
        setRescue(next);
      }
    };

    const queue = () => {
      if (timer) return;
      timer = window.setTimeout(() => {
        timer = 0;
        frame = window.requestAnimationFrame(measure);
      }, 120);
    };

    measure();
    queue();
    window.addEventListener('scroll', queue, { passive: true, capture: true });
    window.addEventListener('resize', queue);
    window.addEventListener('pointermove', queue, { passive: true });
    const mo = new MutationObserver(queue);
    mo.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['style', 'class'] });

    return () => {
      window.clearTimeout(timer);
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', queue, true);
      window.removeEventListener('resize', queue);
      window.removeEventListener('pointermove', queue);
      mo.disconnect();
    };
  }, [stripRef, surface]);

  return rescue;
}
