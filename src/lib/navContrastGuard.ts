import { useEffect, useState, type RefObject } from 'react';

type NavSurface = 'default' | 'media' | 'hero';

export type NavInk = 'ink' | 'white';

export type NavContrastState = {
  /** Solid gray bar + ink type — last resort when neither white nor ink meets AA. */
  rescue: boolean;
  /** Type color that currently meets WCAG AA against the sampled field. */
  ink: NavInk;
};

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

function parseCssColor(input: string): { rgb: Rgb; a: number } | null {
  if (!input || input === 'transparent') return null;
  const m = input.trim().match(
    /^rgba?\(\s*([\d.]+)\s*[,/\s]\s*([\d.]+)\s*[,/\s]\s*([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/i,
  );
  if (!m) return null;
  const alphaToken = m[4];
  const a = alphaToken
    ? alphaToken.endsWith('%')
      ? Number.parseFloat(alphaToken) / 100
      : Number.parseFloat(alphaToken)
    : 1;
  if (!Number.isFinite(a) || a < 0.04) return null;
  return {
    rgb: { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]) },
    a: Math.max(0, Math.min(1, a)),
  };
}

function sampleCanvasPixel(
  canvas: HTMLCanvasElement,
  cssX: number,
  cssY: number,
): { rgb: Rgb; a: number } | null {
  const rect = canvas.getBoundingClientRect();
  if (cssX < rect.left || cssX > rect.right || cssY < rect.top || cssY > rect.bottom) return null;
  const w = rect.width;
  const h = rect.height;
  if (w < 2 || h < 2 || canvas.width < 2 || canvas.height < 2) return null;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const sx = Math.max(0, Math.min(canvas.width - 1, Math.round(((cssX - rect.left) / w) * canvas.width)));
  const sy = Math.max(0, Math.min(canvas.height - 1, Math.round(((cssY - rect.top) / h) * canvas.height)));
  try {
    const px = ctx.getImageData(sx, sy, 1, 1).data;
    const a = (px[3] ?? 0) / 255;
    if (a < 0.04) return null;
    return { rgb: { r: px[0] ?? 0, g: px[1] ?? 0, b: px[2] ?? 0 }, a };
  } catch {
    return null;
  }
}

function sampleDomOverlay(x: number, y: number, nav: HTMLElement, under: Rgb): Rgb {
  const stack = document.elementsFromPoint(x, y);
  for (const node of stack) {
    if (!(node instanceof HTMLElement)) continue;
    if (node === nav || nav.contains(node)) continue;
    if (node.tagName === 'CANVAS') continue;
    if (node.classList.contains('home-page-surface') || node.closest('.home-page-surface')) {
      return PAGE_GRAY;
    }
    const parsed = parseCssColor(getComputedStyle(node).backgroundColor);
    if (!parsed) continue;
    under = mix(parsed.rgb, under, parsed.a);
    if (parsed.a >= 0.92) return under;
  }
  return under;
}

function sampleBehindNav(
  strip: HTMLElement,
  surface: NavSurface,
): { white: number; ink: number } {
  const rect = strip.getBoundingClientRect();
  if (rect.width < 8 || rect.height < 8) return { white: 21, ink: 21 };

  const navZ = readCssZ(strip);
  const canvases = [...document.querySelectorAll<HTMLCanvasElement>('canvas[data-mandala-interactive]')]
    .filter((canvas) => readCssZ(canvas) <= navZ)
    .sort((a, b) => readCssZ(a) - readCssZ(b));

  const xs = [0.06, 0.18, 0.36, 0.55, 0.72, 0.86, 0.95];
  const ys = [0.38, 0.68];
  let worstWhite = 21;
  let worstInk = 21;
  const tint = NAV_TINT[surface];

  for (const xf of xs) {
    for (const yf of ys) {
      const x = rect.left + rect.width * xf;
      const y = rect.top + rect.height * yf;
      let behind = GROUND[surface];
      for (const canvas of canvases) {
        const hit = sampleCanvasPixel(canvas, x, y);
        if (hit) behind = mix(hit.rgb, behind, hit.a);
      }
      behind = sampleDomOverlay(x, y, strip, behind);
      const glazed = mix(tint.rgb, behind, tint.a);
      worstWhite = Math.min(worstWhite, contrastRatio(WHITE, glazed), contrastRatio(WHITE, behind));
      worstInk = Math.min(worstInk, contrastRatio(INK, glazed), contrastRatio(INK, behind));
    }
  }

  return { white: worstWhite, ink: worstInk };
}

function pickState(
  sample: { white: number; ink: number },
  prev: NavContrastState,
  surface: NavSurface,
): NavContrastState {
  const whiteFloor = prev.ink === 'white' && !prev.rescue ? RECOVER_RATIO : FAIL_RATIO;
  const inkFloor = prev.ink === 'ink' && !prev.rescue ? RECOVER_RATIO : FAIL_RATIO;
  const whiteOk = sample.white >= whiteFloor;
  const inkOk = sample.ink >= inkFloor;

  if (!whiteOk && !inkOk) {
    return { rescue: true, ink: 'ink' };
  }

  if (surface === 'default' && inkOk) {
    return { rescue: false, ink: 'ink' };
  }

  if (whiteOk && inkOk) {
    const preferWhite = surface === 'hero' || surface === 'media';
    if (preferWhite && sample.white >= FAIL_RATIO) return { rescue: false, ink: 'white' };
    return { rescue: false, ink: sample.ink >= sample.white ? 'ink' : 'white' };
  }

  return { rescue: false, ink: whiteOk ? 'white' : 'ink' };
}

/**
 * Samples the field behind the main nav and picks ink vs white type so copy
 * stays at WCAG AA (4.5:1). Falls back to a solid gray bar when neither works.
 */
export function useNavContrastRescue(
  stripRef: RefObject<HTMLElement | null>,
  surface: NavSurface,
): NavContrastState {
  const [state, setState] = useState<NavContrastState>(() => ({
    rescue: false,
    ink: surface === 'default' ? 'ink' : 'white',
  }));

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;

    let timer = 0;
    let frame = 0;
    let pulse = 0;
    let current: NavContrastState = {
      rescue: false,
      ink: surface === 'default' ? 'ink' : 'white',
    };

    const measure = () => {
      if (document.hidden) return;
      const next = pickState(sampleBehindNav(strip, surface), current, surface);
      if (next.rescue !== current.rescue || next.ink !== current.ink) {
        current = next;
        setState(next);
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
    pulse = window.setInterval(queue, 480);
    window.addEventListener('scroll', queue, { passive: true, capture: true });
    window.addEventListener('resize', queue);
    window.addEventListener('pointermove', queue, { passive: true });
    const mo = new MutationObserver(queue);
    mo.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['style', 'class'] });

    return () => {
      window.clearTimeout(timer);
      window.clearInterval(pulse);
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', queue, true);
      window.removeEventListener('resize', queue);
      window.removeEventListener('pointermove', queue);
      mo.disconnect();
    };
  }, [stripRef, surface]);

  return state;
}
