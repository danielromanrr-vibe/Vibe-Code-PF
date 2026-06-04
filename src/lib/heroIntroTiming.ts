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
  /** Scales comet opacity, counts, and flare (~15% subtler) */
  starVisualScale: 0.85,
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

/** Peak brightness while crossing “Daniel” / portrait band */
export function starNameCrossGlow(progress: number): number {
  const d = (progress - 0.46) / 0.16;
  return Math.exp(-(d * d)) * heroIntroTiming.starVisualScale;
}

/** Fade the whole pass in and out — fleeting shooting star */
export function starFadeEnvelope(linear: number): number {
  const t = Math.min(1, Math.max(0, linear));
  if (t < 0.14) {
    const u = t / 0.14;
    return u * u * (3 - 2 * u);
  }
  if (t > 0.86) {
    const u = (1 - t) / 0.14;
    return u * u * (3 - 2 * u);
  }
  return 1;
}
