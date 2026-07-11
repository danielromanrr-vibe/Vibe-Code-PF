import type { MandalaSystemNodeLayout } from '../Mandala';
import { CARD_THEMES } from '../thinkingCardArt';
import type { AboutInfluenceCard } from '../../content/aboutMandalaFacets';

export function nodeSizeFromLayout(r: number): number {
  return Math.max(32, Math.min(44, r * 4.8 * 0.78));
}

/** WCAG 2.2 target size — interactive box (visual glyph may be smaller inside). */
export const MIN_NODE_HIT_PX = 44;

export function kindBorderRadius(kind: 0 | 1 | 2): string {
  if (kind === 0) return '9999px';
  if (kind === 1) return '10px';
  return '50% / 42%';
}

export function kindRotation(kind: 0 | 1 | 2): number {
  return kind === 1 ? 45 : 0;
}

export function cardTheme(card: AboutInfluenceCard) {
  return CARD_THEMES[card.artIndex % CARD_THEMES.length];
}

export function outwardOffset(
  x: number,
  y: number,
  centerX: number,
  centerY: number,
  distance: number,
): { x: number; y: number } {
  const dx = x - centerX;
  const dy = y - centerY;
  const len = Math.hypot(dx, dy) || 1;
  return {
    x: x + (dx / len) * distance,
    y: y + (dy / len) * distance,
  };
}

export function layoutForCard(
  layouts: readonly MandalaSystemNodeLayout[],
  card: AboutInfluenceCard,
) {
  return layouts.find((n) => n.index === card.nodeIndex);
}

/** @deprecated */
export const facetTheme = cardTheme;
/** @deprecated */
export const layoutForFacet = layoutForCard;
