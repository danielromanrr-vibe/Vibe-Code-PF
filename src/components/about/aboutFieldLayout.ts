/** Canvas field scale for the About mandala (1 = default engine size). */
export const ABOUT_MANDALA_FIELD_SCALE = 1.35;

export type LabelPlacement = 'below' | 'above';

type InfluenceSlot = {
  /** Degrees from east, counter-clockwise (0 = right, -90 = top). */
  angleDeg: number;
};

/**
 * Six influences on one ring — even 60° spacing, consistent radius.
 * Meaning lives in interaction (paths, hover, disclosure), not static position.
 */
export const ABOUT_INFLUENCE_SLOTS: Record<string, InfluenceSlot> = {
  curiosity: { angleDeg: -90 },
  places: { angleDeg: -30 },
  'art-making': { angleDeg: 30 },
  'people-community': { angleDeg: 90 },
  'learning-work': { angleDeg: 150 },
  systems: { angleDeg: -150 },
};

import { influenceDriftOffset } from './aboutInfluenceConstellation';

/** Shared radial distance — room for glyph + label at each spoke. */
const RADIUS_FRAC = 0.76;
const FIELD_ENVELOPE_FRAC = 0.36;
const CENTER_LIFT_FRAC = 0.045;

function fieldEnvelopeRadius(anchorRect: DOMRect): number {
  return Math.min(anchorRect.width, anchorRect.height) * FIELD_ENVELOPE_FRAC;
}

function layoutSpread(viewportWidth: number): number {
  if (viewportWidth < 480) return 0.78;
  if (viewportWidth < 640) return 0.86;
  if (viewportWidth < 900) return 0.94;
  return 1;
}

/** Lower-arc labels sit above the node to avoid the diagram key. */
export function labelPlacementForSlot(angleDeg: number): LabelPlacement {
  return angleDeg > 40 && angleDeg < 200 ? 'above' : 'below';
}

export function labelPlacementForCard(cardId: string): LabelPlacement {
  const slot = ABOUT_INFLUENCE_SLOTS[cardId];
  return slot ? labelPlacementForSlot(slot.angleDeg) : 'below';
}

export function atmosphereRingRadii(anchorRect: DOMRect): readonly number[] {
  const envelope = fieldEnvelopeRadius(anchorRect);
  return [envelope * RADIUS_FRAC];
}

export function authoredInfluencePosition(
  cardId: string,
  centerX: number,
  centerY: number,
  anchorRect: DOMRect,
  viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1024,
  timeSec = 0,
  driftEnabled = true,
): { x: number; y: number } {
  const slot = ABOUT_INFLUENCE_SLOTS[cardId];
  if (!slot) return { x: centerX, y: centerY };

  const placementCenterY = centerY - anchorRect.height * CENTER_LIFT_FRAC;
  const r = fieldEnvelopeRadius(anchorRect) * RADIUS_FRAC * layoutSpread(viewportWidth);
  const rad = (slot.angleDeg * Math.PI) / 180;
  const drift = influenceDriftOffset(cardId, timeSec, driftEnabled);

  return {
    x: centerX + Math.cos(rad) * r + drift.dx,
    y: placementCenterY + Math.sin(rad) * r + drift.dy,
  };
}

export function radialPositionFromCenter(
  x: number,
  y: number,
  centerX: number,
  centerY: number,
  scale = 1.08,
): { x: number; y: number } {
  return {
    x: centerX + (x - centerX) * scale,
    y: centerY + (y - centerY) * scale,
  };
}

export function resolveInfluencePosition(
  cardId: string,
  centerX: number,
  centerY: number,
  anchorRect: DOMRect | null,
  layout?: { x: number; y: number },
  viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1024,
  timeSec = 0,
  driftEnabled = true,
): { x: number; y: number } {
  if (anchorRect && anchorRect.width > 0 && anchorRect.height > 0) {
    return authoredInfluencePosition(cardId, centerX, centerY, anchorRect, viewportWidth, timeSec, driftEnabled);
  }
  if (layout) {
    return radialPositionFromCenter(layout.x, layout.y, centerX, centerY);
  }
  return { x: centerX, y: centerY };
}
