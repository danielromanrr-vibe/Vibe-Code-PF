import type { MandalaSystemNodeLayout } from '../Mandala';
import { cardById } from '../../content/aboutMandalaFacets';
import { resolveInfluencePosition } from './aboutFieldLayout';
import { layoutForCard } from './aboutOrbitNodeUtils';

const ANCHOR_ID = 'mandala-about-center';
const NODE_HIT = 44;

export type AboutAnnotationOrigin = {
  rect: DOMRect;
  kind: 0 | 1 | 2;
  centerX: number;
  centerY: number;
  nodeX: number;
  nodeY: number;
};

function mandalaCenter(layouts: readonly MandalaSystemNodeLayout[]): { x: number; y: number } {
  const anchor = document.getElementById(ANCHOR_ID);
  if (anchor) {
    const r = anchor.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }
  if (layouts.length > 0) {
    const cx = layouts.reduce((s, n) => s + n.x, 0) / layouts.length;
    const cy = layouts.reduce((s, n) => s + n.y, 0) / layouts.length;
    return { x: cx, y: cy };
  }
  return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
}

export function buildAnnotationOrigin(
  layouts: readonly MandalaSystemNodeLayout[],
  cardId: string,
  rect?: DOMRect,
): AboutAnnotationOrigin | null {
  const card = cardById(cardId);
  if (!card) return null;
  const layout = layoutForCard(layouts, card);
  if (!layout) return null;

  const center = mandalaCenter(layouts);
  const anchor = document.getElementById(ANCHOR_ID);
  const anchorRect = anchor?.getBoundingClientRect() ?? null;
  const positioned = resolveInfluencePosition(card.id, center.x, center.y, anchorRect, layout);
  const nodeX = positioned.x;
  const nodeY = positioned.y;
  const nodeRect =
    rect ?? new DOMRect(nodeX - NODE_HIT / 2, nodeY - NODE_HIT / 2, NODE_HIT, NODE_HIT);

  return {
    rect: nodeRect,
    kind: layout.kind,
    centerX: center.x,
    centerY: center.y,
    nodeX,
    nodeY,
  };
}
