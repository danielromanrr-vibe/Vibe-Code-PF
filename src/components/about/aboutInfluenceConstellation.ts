/** Per-influence celestial drift — pixels, not degrees. */
export type InfluenceDrift = {
  phaseRad: number;
  orbitPx: number;
  periodSec: number;
};

export const INFLUENCE_DRIFT: Record<string, InfluenceDrift> = {
  curiosity: { phaseRad: 0, orbitPx: 2.8, periodSec: 92 },
  places: { phaseRad: 1.1, orbitPx: 2.4, periodSec: 104 },
  'art-making': { phaseRad: 2.3, orbitPx: 2.6, periodSec: 88 },
  'people-community': { phaseRad: 0.7, orbitPx: 2.2, periodSec: 112 },
  'learning-work': { phaseRad: 1.8, orbitPx: 2.5, periodSec: 98 },
  systems: { phaseRad: 2.9, orbitPx: 2.7, periodSec: 106 },
};

export function influenceDriftOffset(
  cardId: string,
  timeSec: number,
  enabled = true,
): { dx: number; dy: number } {
  if (!enabled) return { dx: 0, dy: 0 };
  const drift = INFLUENCE_DRIFT[cardId];
  if (!drift) return { dx: 0, dy: 0 };
  const a = (timeSec / drift.periodSec) * Math.PI * 2 + drift.phaseRad;
  return {
    dx: Math.cos(a) * drift.orbitPx,
    dy: Math.sin(a * 0.92) * drift.orbitPx * 0.88,
  };
}

/** Gravitational halo radii — unique per influence (px at ~1x spread). */
export function influenceHaloRadii(cardId: string): readonly [number, number, number] {
  const seeds: Record<string, [number, number, number]> = {
    curiosity: [26, 40, 54],
    places: [28, 44, 58],
    'art-making': [24, 38, 52],
    'people-community': [27, 42, 56],
    'learning-work': [25, 39, 53],
    systems: [29, 45, 60],
  };
  return seeds[cardId] ?? [26, 40, 54];
}

export type ConstellationSatellite = {
  angleRad: number;
  distFrac: number;
  r: number;
};

/** Micro constellation markers orbiting each landmark. */
export function influenceSatellites(cardId: string): readonly ConstellationSatellite[] {
  const base = cardId.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
  const count = 5 + (base % 2);
  return Array.from({ length: count }, (_, i) => ({
    angleRad: (i / count) * Math.PI * 2 + (base % 17) * 0.11,
    distFrac: 0.72 + (i % 3) * 0.08,
    r: 0.9 + (i % 2) * 0.35,
  }));
}

export type ConstellationAnchor = {
  id: string;
  x: number;
  y: number;
  /** 0–1 pull on ambient field particles */
  weight: number;
};

export function anchorWeight(
  cardId: string,
  activeCardId: string | null,
  previewCardId: string | null,
  relatedIds: ReadonlySet<string> | null,
): number {
  if (activeCardId === cardId) return 1;
  if (previewCardId === cardId) return 0.42;
  if (relatedIds?.has(cardId)) return 0.55;
  return 0.18;
}
