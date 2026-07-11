import { ABOUT_INFLUENCE_CARDS } from '../../content/aboutMandalaFacets';

export type RelationshipEdge = {
  fromId: string;
  toId: string;
  label: string;
  description: string;
};

export function relationshipEdgesForCard(cardId: string): RelationshipEdge[] {
  const card = ABOUT_INFLUENCE_CARDS.find((c) => c.id === cardId);
  if (!card) return [];
  return card.relatedInfluences.map((rel) => ({
    fromId: cardId,
    toId: rel.id,
    label: rel.label,
    description: rel.description,
  }));
}

export function relatedIdsForCard(cardId: string): Set<string> {
  return new Set(relationshipEdgesForCard(cardId).map((e) => e.toId));
}

export function allRelationshipEdges(): RelationshipEdge[] {
  return ABOUT_INFLUENCE_CARDS.flatMap((card) => relationshipEdgesForCard(card.id));
}

export function edgeKey(fromId: string, toId: string): string {
  return `${fromId}→${toId}`;
}

/** Quadratic path from influence to influence, bowing toward field center. */
export function relationshipPathD(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  centerX: number,
  centerY: number,
): string {
  const midX = (fromX + toX) / 2;
  const midY = (fromY + toY) / 2;
  const bendX = midX + (centerX - midX) * 0.2;
  const bendY = midY + (centerY - midY) * 0.2;
  return `M ${fromX} ${fromY} Q ${bendX} ${bendY} ${toX} ${toY}`;
}

export function pathLabelPoint(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  centerX: number,
  centerY: number,
  t = 0.5,
): { x: number; y: number } {
  const midX = (fromX + toX) / 2;
  const midY = (fromY + toY) / 2;
  const cx = midX + (centerX - midX) * 0.2;
  const cy = midY + (centerY - midY) * 0.2;
  const u = 1 - t;
  return {
    x: u * u * fromX + 2 * u * t * cx + t * t * toX,
    y: u * u * fromY + 2 * u * t * cy + t * t * toY,
  };
}
