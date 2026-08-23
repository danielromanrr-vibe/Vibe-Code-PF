/**
 * Hero intro + shooting-star rhythm.
 *
 * Design tenants (Apple-style product reveal — do not violate in App.tsx):
 * - Star is a real light source — proximity drives progressive illumination on each element.
 * - Light reveals, it never creates: copy and portrait are always present, unlit, in shadow.
 *   Pre-star they sit at silhouette contrast (~1.9:1 navy on abyss), never at opacity 0.
 * - Reveal uses colour, opacity and filter only — no y, blur, scale, bounce on type.
 * - Light is directional: a specular band tracks the star's position across each surface.
 * - No scroll parallax on hero type — sheet covers fixed copy (Apple hero pattern).
 * - Portrait cross: specular glimmer + mandala bloom + global illuminate (one quick beat).
 * - Once lit, elements stay lit (no flicker back to dark as the star exits).
 * - Resting state is flat white; the light map is dropped entirely once the intro settles.
 */
export const heroIntroTiming = {
  bundleDurationS: 0.68,
  staggerChildrenS: 0.1,
  itemDurationS: 0.54,
  /** Beat on dark hero before the star appears */
  preStarPauseMs: 1100,
  starPassDurationMs: 2210,
  starLingerMs: 440,
  /** Scales comet opacity, counts, and flare */
  starVisualScale: 1.05,
  /** Hero sky reveal — portrait cross → partial, pass end → full */
  skyRevealPortraitDurationMs: 820,
  skyRevealSettleMs: 560,
  skyRevealPortraitTarget: 0.72,
  skyRevealFinalTarget: 1,
  /** Global illuminate window — completes at portrait cross (not after pass exit) */
  globalIlluminateSpanProgress: 0.11,
  /** Star proximity — how early light reaches an element along the path (path progress units) */
  starLightLeadName: 0.24,
  starLightLeadPortrait: 0.22,
  starLightTail: 0.05,
  /** Unlit floor — the portrait is present in shadow before any light reaches it */
  portraitUnlitOpacity: 0.4,
  orbitUnlitOpacity: 0.16,
  /** Peak alpha of the specular band that tracks the star across a surface */
  lightBandStrength: 0.92,
  /** Phosphor-like overshoot as light leaves a surface */
  afterglowPeak: 0.08,
  afterglowSigma: 0.075,
  afterglowLagProgress: 0.03,
  /** Mandala bloom at the portrait cross — one pulse, then back to ambient */
  mandalaBloomMs: 460,
  mandalaBloomPeak: 0.52,
} as const;

export type StarLightingFrame = {
  pathProgress: number;
  envelope: number;
  portraitProgress: number;
};

/**
 * Element edges mapped into the comet's coordinate space.
 * `start`/`end` stay unclamped so the specular band can travel on and off a surface;
 * `center` is clamped because it doubles as the element's proximity-lighting anchor.
 */
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

/** Specular band position within a surface — percentage string for `--hero-light-x`. */
export function heroBandPositionAt(starProgress: number, span: HeroPathSpan): string {
  const width = Math.max(1e-4, span.end - span.start);
  const u = ((starProgress - span.start) / width) * 100;
  return `${Math.min(170, Math.max(-70, u)).toFixed(1)}%`;
}

/**
 * Band position for copy that sits off the star's path (the subhead).
 * Rides the illuminate beat instead of star position, so light still reads as travelling.
 */
export function heroSweepPositionAt(light: number): string {
  return `${(-45 + clamp01(light) * 190).toFixed(1)}%`;
}

/** Specular only reads while a surface is still partly unlit; gone once it is white. */
export function heroBandAlphaAt(envelope: number, light: number): string {
  return (clamp01(envelope) * (1 - clamp01(light)) * heroIntroTiming.lightBandStrength).toFixed(3);
}

/** Pulse band for the illuminate beat — peaks mid-transition, absent at both ends. */
export function heroSweepAlphaAt(light: number): string {
  const u = clamp01(light);
  return (4 * u * (1 - u) * heroIntroTiming.lightBandStrength * 0.9).toFixed(3);
}

/** Phosphor-like overshoot just after light leaves a surface. */
export function heroAfterglowAt(starProgress: number, anchor: number): number {
  const { afterglowLagProgress, afterglowSigma, afterglowPeak } = heroIntroTiming;
  const d = (starProgress - (anchor + afterglowLagProgress)) / afterglowSigma;
  return Math.exp(-(d * d)) * afterglowPeak;
}

/** Light-map variable for text: 0 = navy silhouette, 1 = flat white. */
export function heroTextLightVarAt(light: number): string {
  return clamp01(light).toFixed(4);
}

export type StarLightOptions = {
  lead?: number;
  tail?: number;
};

/**
 * Progressive illumination — 0 in darkness, rises as the star approaches, holds at 1 once passed.
 * Opacity only; no motion on the element itself.
 */
export function starProgressiveLight(
  starProgress: number,
  elementProgress: number,
  options: StarLightOptions = {},
): number {
  const lead = options.lead ?? heroIntroTiming.starLightLeadName;
  const tail = options.tail ?? heroIntroTiming.starLightTail;
  const start = elementProgress - lead;
  const end = elementProgress + tail;
  if (starProgress <= start) return 0;
  if (starProgress >= end) return 1;
  return smoothstep((starProgress - start) / (end - start));
}

/** Combine star proximity with post-cross global illuminate (whichever is brighter). */
export function heroElementLightAt(
  starProgress: number,
  elementAnchor: number,
  skyProgress: number,
  starOptions?: StarLightOptions,
): number {
  return Math.max(
    starProgressiveLight(starProgress, elementAnchor, starOptions),
    heroGlobalIlluminateAt(skyProgress),
  );
}

function portraitLightAt(
  starProgress: number,
  portraitAnchor: number,
  skyProgress: number,
): number {
  return heroElementLightAt(starProgress, portraitAnchor, skyProgress, {
    lead: heroIntroTiming.starLightLeadPortrait,
  });
}

/**
 * Portrait material — desaturated and dim in shadow, full colour under light,
 * with a brief brightness overshoot as the star's light leaves the face.
 */
export function heroPortraitFilterAt(
  starProgress: number,
  portraitAnchor: number,
  skyProgress: number,
): string {
  const lit = portraitLightAt(starProgress, portraitAnchor, skyProgress);
  const glow = heroAfterglowAt(starProgress, portraitAnchor);
  const gray = (1 - lit).toFixed(3);
  const saturate = (0.18 + lit * 0.88).toFixed(3);
  const brightness = (0.44 + lit * 0.56 + glow).toFixed(3);
  const contrast = (0.86 + lit * 0.18).toFixed(3);
  return `grayscale(${gray}) saturate(${saturate}) brightness(${brightness}) contrast(${contrast})`;
}

/** Portrait is always present — an unlit floor lifted to full presence by star light. */
export function heroPortraitPresenceAt(
  starProgress: number,
  portraitAnchor: number,
  skyProgress: number,
): number {
  const floor = heroIntroTiming.portraitUnlitOpacity;
  return floor + (1 - floor) * portraitLightAt(starProgress, portraitAnchor, skyProgress);
}

/** Orbit ring — faint in shadow, resolves with the illuminate beat. */
export function heroOrbitPresenceAt(light: number): number {
  const floor = heroIntroTiming.orbitUnlitOpacity;
  return floor + (1 - floor) * clamp01(light);
}

/** Shared ease — slow-in, slower-out (no overshoot) */
export const HERO_INTRO_EASE = [0.25, 0.1, 0.25, 1] as const;

function smoothstep(u: number): number {
  const x = Math.min(1, Math.max(0, u));
  return x * x * (3 - 2 * x);
}

function windowProgress(p: number, start: number, end: number): number {
  if (p <= start) return 0;
  if (p >= end) return 1;
  return smoothstep((p - start) / (end - start));
}

/** Sky layer — environmental light; rises with the unified illuminate event at cross */
export function heroSkyLayerOpacityAt(progress: number): number {
  const cross = heroIntroTiming.skyRevealPortraitTarget;
  const end = heroIntroTiming.skyRevealFinalTarget;
  const illuminateEnd = cross;
  const crossLift = windowProgress(progress, cross - heroIntroTiming.globalIlluminateSpanProgress, illuminateEnd) * 0.94;
  const settle = windowProgress(progress, illuminateEnd, end) * 0.06;
  return Math.min(1, crossLift + settle);
}

/** Mandala ambient — follows sky */
export function heroBannerAmbientOpacityAt(progress: number): number {
  return heroSkyLayerOpacityAt(progress) * 0.26;
}

/** Brief warmth at portrait cross — not a sustained glow */
export function heroIllumeFlashOpacityAt(progress: number): number {
  const cross = heroIntroTiming.skyRevealPortraitTarget;
  const peak = windowProgress(progress, cross - 0.02, cross + 0.02);
  const decay = 1 - windowProgress(progress, cross + 0.02, cross + 0.14);
  return peak * decay * 0.22;
}

/**
 * Global illuminate — completes at portrait cross (0.72).
 * Role, subhead, orbit, and sky settle use this so nothing waits for pass exit.
 */
export function heroGlobalIlluminateAt(progress: number): number {
  const cross = heroIntroTiming.skyRevealPortraitTarget;
  const start = cross - heroIntroTiming.globalIlluminateSpanProgress;
  const end = cross;
  return windowProgress(progress, start, end);
}

/** @deprecated Use heroGlobalIlluminateAt */
export function heroCopyPrimaryOpacityAt(progress: number): number {
  return heroGlobalIlluminateAt(progress);
}

/** Role + subhead — same beat, duotone fill driven by --hero-text-light */
export function heroSecondaryCopyLightAt(progress: number): number {
  return heroGlobalIlluminateAt(progress);
}

/** @deprecated Use heroSecondaryCopyLightAt */
export function heroCopySubOpacityAt(progress: number): number {
  return heroGlobalIlluminateAt(progress);
}

/** When the h1 row finishes its intro (parent uses `when: 'beforeChildren'`). */
export function heroH1IntroSettleMs(): number {
  const { bundleDurationS, staggerChildrenS, itemDurationS } = heroIntroTiming;
  return (bundleDurationS + 0 * staggerChildrenS + itemDurationS) * 1000;
}

export function msUntilStarPass(): number {
  return heroIntroTiming.preStarPauseMs;
}

/** Slow approach → swift sweep across the portrait → soft exit */
export function easeStarPass(linear: number): number {
  const t = Math.min(1, Math.max(0, linear));
  if (t < 0.22) {
    const u = t / 0.22;
    return u * u * 0.14;
  }
  if (t < 0.78) {
    const u = (t - 0.22) / 0.56;
    return 0.14 + u * 0.72;
  }
  const u = (t - 0.78) / 0.22;
  const ease = 1 - (1 - u) ** 3;
  return 0.86 + ease * 0.14;
}

/** Peak brightness while crossing the hero portrait (progress ≈ measured portrait center). */
export function starPortraitCrossGlow(
  progress: number,
  portraitProgress: number,
  sigma = 0.085,
): number {
  const d = (progress - portraitProgress) / sigma;
  return Math.exp(-(d * d)) * heroIntroTiming.starVisualScale;
}

/** @deprecated Use starPortraitCrossGlow with measured portrait progress */
export function starNameCrossGlow(progress: number): number {
  return starPortraitCrossGlow(progress, 0.46, 0.16);
}

/** Brightness map — scales head, trail, and badge twinkle from portrait-cross intensity (0–1). */
export function starBrightnessMap(crossGlow: number) {
  const g = Math.min(1, Math.max(0, crossGlow / heroIntroTiming.starVisualScale));
  return {
    head: 0.55 + g * 0.45,
    flareRadius: 28 + g * 30,
    trail: 0.42 + g * 0.58,
    twinkle: Math.min(1, g * 1.15),
    badge: g > 0.12 ? (g - 0.12) / 0.88 : 0,
  };
}

/** Portrait-cross intensity that triggers the hero sky / mandala reveal. */
export const STAR_PORTRAIT_ILLUMINATE_THRESHOLD = 0.22;

/**
 * Fade the whole pass in and out — long soft exit so the overlay mask edge is never obvious.
 * @param pathProgress Eased position along the sweep (0–1); fades before the path end.
 */
export function starFadeEnvelope(linear: number, pathProgress?: number): number {
  const t = Math.min(1, Math.max(0, linear));
  let fadeIn = 1;
  if (t < 0.12) {
    fadeIn = smoothstep(t / 0.12);
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
