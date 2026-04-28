/**
 * Euphoria Mandala — **placement & activation** model
 *
 * **Nav branding** (`variant === 'navIntegrated'`): the mandala is an interactive branding element
 * anchored in the main menu. At rest it stays in **mandala tiny state** (reduced field, chip clip).
 * When grabbed or after a placed drop, it **activates** — full viewport, same Euphoria behavior as legacy hero.
 *
 * **Visual design intent (branding / tiny state)**  
 * - Readable core rings in the chip; calmer timebase; no glow — a glyph next to the wordmark, not a mini hero.  
 * - Slightly ink-forward color on the bar. Shell chrome lives on `NavBrandingMount` (overlay above the strip).
 *
 * **Activation (leaves the navigation)**  
 * The nav strip uses `backdrop-filter`, which makes `position: fixed` descendants use that strip as their
 * containing block — the canvas was trapped to ~44px tall. The canvas is **portaled to `document.body`** so it
 * always uses the viewport. Tiny state: `clip-path` to `#anchorId` + moderate z-index. Activated: clip off,
 * `z-index` above app overlays so breakout behaves like a system layer.
 *
 * This module holds the single source of truth for those modes (pure helpers + clip styling).
 */

export type EuphoriaMandalaVariant = 'default' | 'heroIntegrated' | 'navIntegrated';

/** Motion throttle in branding chip: slower = calmer “logo” behavior vs full Euphoria. */
export const BRANDING_TIME_SCALE = 0.52;

/** Idle motion / stroke emphasis in the chip (remaining layers after simplification). */
export const MANDALA_TINY_STATE_VISUAL_BOOST = 1.42;
/** Extra stroke weight in tiny state (core layers). */
export const MANDALA_TINY_STATE_STROKE_WIDTH_MULT = 1.28;
/** Pull strokes slightly toward ink for contrast on the nav bar. */
export const MANDALA_TINY_STATE_INK_BIAS = 0.14;
/** Hit radius multiplier while only the branding chip is shown. */
export const MANDALA_TINY_STATE_HIT_RADIUS_SCALE = 0.48;

/** Draw every Nth core layer in branding mode (1 = all). 2 = half the rings → clearer silhouette. */
export const BRANDING_CORE_LAYER_STRIDE = 2;

/**
 * Tiny-state nav home mark: horizontal offset in **chip-local** px (after `translate(left,top)` stack).
 * Positive shifts right; usually `0` once coords match the clip.
 */
export const NAV_BRANDING_HOME_DRAW_NUDGE_X = 0;

/** Center must be within this distance (px) of the anchor before nav “reintegrates” visually (clip + tiny mark). */
export const NAV_HOME_REINTEGRATE_DIST_PX = 34;

/**
 * Activation blend (0 = settled in nav chip, 1 = full viewport). Above this threshold we draw full core layers
 * instead of the compact nav glyph (while physics is still “tiny” but the field hasn’t settled home yet).
 */
export const NAV_GLYPH_TO_FULL_BLEND = 0.38;

export function isNavBrandingVariant(variant: EuphoriaMandalaVariant): boolean {
  return variant === 'navIntegrated';
}

/**
 * **Mandala tiny state** — at rest in the nav anchor: scaled clip, reduced field, compact hit target.
 * Leaving this state (grab or placed position) means the mandala is **activated** for full-canvas Euphoria.
 */
export function isMandalaTinyState(
  variant: EuphoriaMandalaVariant,
  isGrabbed: boolean,
  hasPlacedPosition: boolean,
): boolean {
  return variant === 'navIntegrated' && !isGrabbed && !hasPlacedPosition;
}

/**
 * Peripheral ecosystem + full hero-scale field.
 * `activationBlend` (nav only): while reintegrating, ecosystem fades in as blend rises past ~0.1.
 */
export function shouldDrawPeripheralEcosystem(
  variant: EuphoriaMandalaVariant,
  mandalaTinyState: boolean,
  activationBlend = 0,
): boolean {
  if (variant === 'heroIntegrated') return true;
  if (variant === 'navIntegrated') {
    return !mandalaTinyState || activationBlend > 0.1;
  }
  return false;
}

/** Full-screen ambient grid — suppressed in settled nav tiny state; emerges with activation blend. */
export function allowAmbientGridForPlacement(
  variant: EuphoriaMandalaVariant,
  mandalaTinyState: boolean,
  activationBlend = 0,
): boolean {
  return !isNavBrandingVariant(variant) || !mandalaTinyState || activationBlend > 0.08;
}

/**
 * Scale factor drawing the core into the nav chip (viewport space → scaled around center).
 * Uses the smaller chip side so the mark fits square and non-square anchors.
 */
export function getNavBrandingScale(chipMinSidePx: number): number {
  return Math.max(0.14, Math.min(0.58, chipMinSidePx / 176));
}

/** Skip intermediate core layers so the chip reads as one intentional mark, not moiré. */
export function shouldRenderCoreLayerInBrandingMode(layerIndex: number, stride: number): boolean {
  if (stride <= 1) return true;
  return layerIndex % stride === 0;
}

/**
 * Clip the canvas toward the branding chip (`activationBlend` 0) or full viewport (`1`).
 * Interpolates rect and z-index for smooth breakout / reintegration.
 * Only meaningful for `navIntegrated` (caller may skip if !isNavBrandingVariant).
 */
export function applyNavBrandingClipToCanvas(
  canvas: HTMLCanvasElement,
  anchorId: string,
  activationBlend: number,
): void {
  const t = Math.min(1, Math.max(0, activationBlend));
  const vw = typeof window !== 'undefined' ? window.innerWidth : 0;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 0;

  if (t >= 0.998) {
    canvas.style.clipPath = '';
    canvas.style.removeProperty('-webkit-clip-path');
    canvas.style.zIndex = '240';
    return;
  }

  const box = document.getElementById(anchorId)?.getBoundingClientRect();
  if (!box || box.width <= 0 || vw <= 0 || vh <= 0) {
    canvas.style.clipPath = '';
    canvas.style.removeProperty('-webkit-clip-path');
    canvas.style.zIndex = '240';
    return;
  }

  const left = box.left + (0 - box.left) * t;
  const top = box.top + (0 - box.top) * t;
  const width = box.width + (vw - box.width) * t;
  const height = box.height + (vh - box.height) * t;
  const roundPx = 3 * (1 - t);
  const clip =
    roundPx > 0.05
      ? `xywh(${left}px ${top}px ${width}px ${height}px round ${roundPx}px)`
      : `xywh(${left}px ${top}px ${width}px ${height}px)`;
  canvas.style.clipPath = clip;
  canvas.style.setProperty('-webkit-clip-path', clip);
  const zi = Math.round(196 + 44 * t);
  canvas.style.zIndex = String(zi);
}
