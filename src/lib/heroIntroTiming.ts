/**
 * Hero intro + shooting-star rhythm.
 *
 * THREE SYSTEMS — hard boundaries (do not merge clocks):
 * 1) Type + portrait (star light) — name, role, subhead, portrait material.
 * 2) Sky (navy → rest) — colour-map after the star is gone.
 * 3) Constellation — opacity fade after the star is gone; rest paint always.
 *
 * Apple-style tenants (do not violate in App.tsx):
 * - Light reveals, it never creates. Type and portrait are present in shadow before lit.
 * - Star lights name, role, subhead, and portrait material — never sky, MandalaBanner,
 *   or ambient field. No canvas bloom onto neighbouring objects.
 * - Name: traveling colour front at star x — behind white, ahead navy.
 *   Specular is only the leading edge. No illuminate fill on the name.
 * - Role + subhead: one illuminate beat as the star approaches the portrait,
 *   then stay lit. Portrait lifts on the same approach cadence (filter/opacity only).
 * - Colour / opacity / filter only — no y, blur, scale, bounce.
 * - Once lit, type and portrait stay lit. Settled type drops the light map → flat white.
 * - Sky: abyss for the whole pass. After pass complete, one colour map
 *   interpolates abyss → rest. Never an opacity wash of a second gradient.
 *   Never flash. Never ramp up then down. Never start on portrait cross.
 * - Constellation: untouched during the pass. After pass: one-way fade to rest
 *   on the same post-pass clock as sky (keep it from lagging type).
 * - Comet is in the scene from frame 0 (dim, far).
 */

export const heroIntroTiming = {
  bundleDurationS: 0.68,
  staggerChildrenS: 0.1,
  itemDurationS: 0.54,
  /** Comet starts immediately, far left. */
  preStarPauseMs: 0,
  starPassDurationMs: 2680,
  starLingerMs: 440,
  starVisualScale: 1.05,
  /** Role + subhead illuminate — one shot to full, not a sky clock. */
  typeIlluminateDurationMs: 820,
  /** How early portrait material lifts along the star path. */
  starLightLeadPortrait: 0.22,
  starLightTail: 0.05,
  /** Portrait present in shadow before light reaches it. */
  portraitUnlitOpacity: 0.42,
  /** Peak of the rest sky colour map (matches prior settled lift). */
  skyLitPeak: 0.4,
  /** Ambient banner rest — post-intro look; hover lens is separate. */
  bannerRestOpacity: 0.14,
  /** Specular band strength on type surfaces. */
  lightBandStrength: 0.92,
  /** Comet envelope never starts at 0. */
  starEnvelopeFloor: 0.28,
} as const;

/** Named clocks — keep these separate in App.tsx. */
export type HeroIntroClocks = {
  /** Star path 0–1 + fade envelope for the name traveling front. */
  starPath: number;
  starEnvelope: number;
  /** Role + subhead fill 0–1. Triggered on portrait approach. Never drives sky. */
  typeIlluminate: number;
  /** Sky colour-map + banner opacity 0–1. Starts only after pass complete. */
  postPassField: number;
};

export type StarLightingFrame = {
  pathProgress: number;
  envelope: number;
  portraitProgress: number;
};

export type HeroPathSpan = { start: number; end: number; center: number };

export function measureHeroPathSpan(fieldEl: HTMLElement, targetEl: HTMLElement): HeroPathSpan {
  const fr = fieldEl.getBoundingClientRect();
  const tr = targetEl.getBoundingClientRect();
  const w = Math.max(1, fr.width);
  const toPath = (clientX: number) => ((clientX - fr.left) / w + 0.1) / 1.2;
  const start = toPath(tr.left);
  const end = toPath(tr.right);
  return { start, end, center: Math.min(1, Math.max(0, (start + end) * 0.5)) };
}

function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}

function smoothstep(u: number): number {
  const x = Math.min(1, Math.max(0, u));
  return x * x * (3 - 2 * x);
}

/** Specular band position within a surface — percentage string for `--hero-light-x`. */
export function heroBandPositionAt(starProgress: number, span: HeroPathSpan): string {
  const width = Math.max(1e-4, span.end - span.start);
  const u = ((starProgress - span.start) / width) * 100;
  return `${Math.min(170, Math.max(-70, u)).toFixed(1)}%`;
}

/** Sweep for role/subhead — rides typeIlluminate, not star x. */
export function heroSweepPositionAt(light: number): string {
  return `${(-45 + clamp01(light) * 190).toFixed(1)}%`;
}

/** Specular only while a surface is still partly unlit. */
export function heroBandAlphaAt(envelope: number, light: number): string {
  return (clamp01(envelope) * (1 - clamp01(light)) * heroIntroTiming.lightBandStrength).toFixed(3);
}

/** Pulse band for the illuminate beat — peaks mid-transition. */
export function heroSweepAlphaAt(light: number): string {
  const u = clamp01(light);
  return (4 * u * (1 - u) * heroIntroTiming.lightBandStrength * 0.9).toFixed(3);
}

/** Light-map variable: 0 = navy silhouette, 1 = flat white. */
export function heroTextLightVarAt(light: number): string {
  return clamp01(light).toFixed(4);
}

/** Role + subhead — progress is the light (0→1 after portrait approach). */
export function heroTypeIlluminateAt(progress: number): number {
  return clamp01(progress);
}

/**
 * Progressive illumination — rises as the star approaches an anchor, holds at 1 once passed.
 * Filter / opacity only.
 */
export function starProgressiveLight(
  starProgress: number,
  elementProgress: number,
  lead = heroIntroTiming.starLightLeadPortrait,
  tail = heroIntroTiming.starLightTail,
): number {
  const start = elementProgress - lead;
  const end = elementProgress + tail;
  if (starProgress <= start) return 0;
  if (starProgress >= end) return 1;
  return smoothstep((starProgress - start) / (end - start));
}

/**
 * Portrait material light — star proximity, finished by typeIlluminate so it
 * settles with role/subhead. Never drives sky or constellation.
 */
export function heroPortraitLightAt(
  starProgress: number,
  portraitAnchor: number,
  typeIlluminate: number,
): number {
  return Math.max(
    starProgressiveLight(starProgress, portraitAnchor),
    heroTypeIlluminateAt(typeIlluminate),
  );
}

/** Portrait filter — dim/desaturated in shadow, full colour under light. */
export function heroPortraitFilterAt(
  starProgress: number,
  portraitAnchor: number,
  typeIlluminate: number,
): string {
  const lit = heroPortraitLightAt(starProgress, portraitAnchor, typeIlluminate);
  const gray = (1 - lit).toFixed(3);
  const saturate = (0.22 + lit * 0.84).toFixed(3);
  const brightness = (0.48 + lit * 0.52).toFixed(3);
  const contrast = (0.88 + lit * 0.14).toFixed(3);
  return `grayscale(${gray}) saturate(${saturate}) brightness(${brightness}) contrast(${contrast})`;
}

/** Portrait always present — unlit floor lifted by star / illuminate. */
export function heroPortraitPresenceAt(
  starProgress: number,
  portraitAnchor: number,
  typeIlluminate: number,
): number {
  const floor = heroIntroTiming.portraitUnlitOpacity;
  return floor + (1 - floor) * heroPortraitLightAt(starProgress, portraitAnchor, typeIlluminate);
}

/** @deprecated Use heroTypeIlluminateAt */
export function heroSecondaryCopyLightAt(progress: number): number {
  return heroTypeIlluminateAt(progress);
}

/** Shared ease — slow-in, slower-out (no overshoot). */
export const HERO_INTRO_EASE = [0.25, 0.1, 0.25, 1] as const;

const HERO_SKY_ABYSS = { r: 5, g: 12, b: 24 };
const HERO_SKY_REST_LINEAR = [
  { r: 5, g: 9, b: 18 },
  { r: 7, g: 14, b: 24 },
  { r: 12, g: 21, b: 40 },
  { r: 18, g: 28, b: 48 },
  { r: 24, g: 36, b: 56 },
] as const;
const HERO_SKY_REST_RADIAL = { r: 29, g: 49, b: 72 };

function mixRgb(
  a: { r: number; g: number; b: number },
  b: { r: number; g: number; b: number },
  t: number,
): { r: number; g: number; b: number } {
  const u = clamp01(t);
  return {
    r: Math.round(a.r + (b.r - a.r) * u),
    g: Math.round(a.g + (b.g - a.g) * u),
    b: Math.round(a.b + (b.b - a.b) * u),
  };
}

function rgbCss(c: { r: number; g: number; b: number }): string {
  return `rgb(${c.r},${c.g},${c.b})`;
}

/**
 * Sky colour map. 0 = abyss (section base). 1 = settled rest look.
 * Stops interpolate — never fade a second gradient by opacity onto dark.
 */
export function heroSkyBackgroundImageAt(progress: number): string {
  const lift = clamp01(progress) * heroIntroTiming.skyLitPeak;
  const stops = HERO_SKY_REST_LINEAR.map((stop) => mixRgb(HERO_SKY_ABYSS, stop, lift));
  const radialA = (0.28 * lift).toFixed(3);
  const [s0, s1, s2, s3, s4] = stops;
  return [
    `radial-gradient(ellipse 130% 70% at 50% -8%, rgba(${HERO_SKY_REST_RADIAL.r},${HERO_SKY_REST_RADIAL.g},${HERO_SKY_REST_RADIAL.b},${radialA}) 0%, transparent 52%)`,
    `linear-gradient(180deg, ${rgbCss(s0)} 0%, ${rgbCss(s1)} 24%, ${rgbCss(s2)} 48%, ${rgbCss(s3)} 72%, ${rgbCss(s4)} 100%)`,
  ].join(', ');
}

/** Banner ambient opacity — rest paint always; coverage only. */
export function heroBannerAmbientOpacityAt(progress: number): number {
  return clamp01(progress) * heroIntroTiming.bannerRestOpacity;
}

/** Post-pass sky + constellation — keep with type, not lagging or elongating the intro. */
export function heroFieldRevealDurationS(): number {
  return 1.05;
}

/** Soft ease-in — still no ease-out pop, less hold in darkness than t². */
export function heroFieldRevealEase(u: number): number {
  const t = clamp01(u);
  return t * t * (3 - 2 * t);
}

export function heroH1IntroSettleMs(): number {
  const { bundleDurationS, staggerChildrenS, itemDurationS } = heroIntroTiming;
  return (bundleDurationS + 0 * staggerChildrenS + itemDurationS) * 1000;
}

export function msUntilStarPass(): number {
  return heroIntroTiming.preStarPauseMs;
}

/** Slow approach → swift sweep → soft exit. */
export function easeStarPass(linear: number): number {
  const t = Math.min(1, Math.max(0, linear));
  if (t < 0.36) {
    const u = t / 0.36;
    return u * u * 0.12;
  }
  if (t < 0.78) {
    const u = (t - 0.36) / 0.42;
    return 0.12 + u * 0.74;
  }
  const u = (t - 0.78) / 0.22;
  const ease = 1 - (1 - u) ** 3;
  return 0.86 + ease * 0.14;
}

/** Peak brightness while near the portrait (triggers type illuminate only). */
export function starPortraitCrossGlow(
  progress: number,
  portraitProgress: number,
  sigma = 0.085,
): number {
  const d = (progress - portraitProgress) / sigma;
  return Math.exp(-(d * d)) * heroIntroTiming.starVisualScale;
}

/** Compact star — does not bloom onto neighbouring objects. */
export function starBrightnessMap(crossGlow: number) {
  const g = Math.min(1, Math.max(0, crossGlow / heroIntroTiming.starVisualScale));
  return {
    head: 0.62 + g * 0.2,
    flareRadius: 11,
    trail: 0.38 + g * 0.22,
    twinkle: Math.min(0.55, g * 0.7),
    badge: g > 0.12 ? (g - 0.12) / 0.88 : 0,
  };
}

/** Portrait-approach intensity that triggers type illuminate (not sky / field). */
export const STAR_PORTRAIT_ILLUMINATE_THRESHOLD = 0.22;

/** Whole-pass fade envelope. */
export function starFadeEnvelope(linear: number, pathProgress?: number): number {
  const t = Math.min(1, Math.max(0, linear));
  const floor = heroIntroTiming.starEnvelopeFloor;
  let fadeIn = 1;
  if (t < 0.18) {
    fadeIn = floor + (1 - floor) * smoothstep(t / 0.18);
  }

  let fadeOut = 1;
  if (t > 0.58) {
    fadeOut = smoothstep((1 - t) / 0.42);
  }

  if (pathProgress !== undefined && pathProgress > 0.7) {
    fadeOut = Math.min(fadeOut, smoothstep((1 - pathProgress) / 0.3));
  }

  return fadeIn * fadeOut;
}
