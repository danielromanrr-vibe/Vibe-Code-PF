/**
 * Shared hero intro + shooting-star rhythm (keep in sync with App.tsx motion variants).
 */
export const heroIntroTiming = {
  bundleDurationS: 0.68,
  staggerChildrenS: 0.1,
  itemDurationS: 0.54,
  /** Beat after copy has settled — then the star appears */
  pauseAfterIntroMs: 820,
  /** ~15% faster + lighter than prior pass */
  starPassDurationMs: 2210,
  starLingerMs: 440,
  /** Scales comet opacity, counts, and flare */
  starVisualScale: 1.05,
} as const;

/** When the h1 row finishes its intro (parent uses `when: 'beforeChildren'`). */
export function heroH1IntroSettleMs(): number {
  const { bundleDurationS, staggerChildrenS, itemDurationS } = heroIntroTiming;
  return (bundleDurationS + 0 * staggerChildrenS + itemDurationS) * 1000;
}

export function msUntilStarPass(): number {
  return heroH1IntroSettleMs() + heroIntroTiming.pauseAfterIntroMs;
}

/** Slow approach → swift sweep across the name → soft exit */
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

function smoothstep(u: number): number {
  const x = Math.min(1, Math.max(0, u));
  return x * x * (3 - 2 * x);
}

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
