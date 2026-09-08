import { motion, useReducedMotion } from 'motion/react';
import type { AboutFieldGeometry } from './useAboutFieldGeometry';
import {
  allRelationshipEdges,
  edgeKey,
  pathLabelPoint,
  relationshipPathD,
  type RelationshipEdge,
} from './aboutRelationshipGraph';
import { type InfluenceDepth } from '../../content/aboutMandalaFacets';

type AboutRelationshipFieldProps = {
  geometry: AboutFieldGeometry;
  previewCardId: string | null;
  activeCardId: string | null;
  depth: InfluenceDepth;
  highlightedEdgeKey: string | null;
  travelingEdgeKey: string | null;
  visitedIds: ReadonlySet<string>;
  discoveredEdgeKeys: ReadonlySet<string>;
};

function edgeStrength(
  edge: RelationshipEdge,
  previewCardId: string | null,
  activeCardId: string | null,
  depth: InfluenceDepth,
  highlightedEdgeKey: string | null,
  travelingEdgeKey: string | null,
): number {
  const key = edgeKey(edge.fromId, edge.toId);
  if (travelingEdgeKey === key) return 0.55;
  if (highlightedEdgeKey === key) return 0.48;

  const sourceId = activeCardId ?? previewCardId;
  if (!sourceId) return 0.06;

  if (edge.fromId === sourceId) {
    if (activeCardId && depth !== 'collapsed') return 0.38;
    return 0.22;
  }

  return 0.05;
}

function showLabel(
  edge: RelationshipEdge,
  highlightedEdgeKey: string | null,
  travelingEdgeKey: string | null,
  activeCardId: string | null,
  depth: InfluenceDepth,
): boolean {
  const key = edgeKey(edge.fromId, edge.toId);
  if (highlightedEdgeKey === key || travelingEdgeKey === key) return true;
  return Boolean(activeCardId && depth === 'reflection' && edge.fromId === activeCardId);
}

export default function AboutRelationshipField({
  geometry,
  previewCardId,
  activeCardId,
  depth,
  highlightedEdgeKey,
  travelingEdgeKey,
  visitedIds,
  discoveredEdgeKeys,
}: AboutRelationshipFieldProps) {
  const reduceMotion = useReducedMotion();
  const { centerX, centerY, anchorRect, positions, ringRadii } = geometry;

  if (!anchorRect) return null;

  const ringCy = centerY - anchorRect.height * 0.04;
  const edges = allRelationshipEdges();

  return (
    <svg className="about-relationship-field pointer-events-none fixed inset-0 z-[17]" aria-hidden>
      {ringRadii.map((radius, i) => (
        <circle
          key={`ring-${i}`}
          cx={centerX}
          cy={ringCy}
          r={radius}
          className="about-relationship-field__ring"
          fill="none"
          stroke="rgba(12, 21, 40, 0.055)"
          strokeWidth={0.75}
          strokeDasharray={i === 0 ? '2 6' : i === 1 ? '4 8' : '6 10'}
        />
      ))}

      {edges.map((edge) => {
        const from = positions.get(edge.fromId);
        const to = positions.get(edge.toId);
        if (!from || !to) return null;

        const key = edgeKey(edge.fromId, edge.toId);
        const d = relationshipPathD(from.x, from.y, to.x, to.y, centerX, centerY);
        const strength = edgeStrength(
          edge,
          previewCardId,
          activeCardId,
          depth,
          highlightedEdgeKey,
          travelingEdgeKey,
        );
        const discovered = discoveredEdgeKeys.has(key);
        const baseOpacity = discovered ? Math.max(strength, 0.09) : strength;
        const labelPt = pathLabelPoint(from.x, from.y, to.x, to.y, centerX, centerY, 0.48);
        const labelVisible = showLabel(edge, highlightedEdgeKey, travelingEdgeKey, activeCardId, depth);
        const isHighlighted = highlightedEdgeKey === key || travelingEdgeKey === key;

        return (
          <g key={key} className="about-relationship-field__edge">
            <motion.path
              d={d}
              fill="none"
              stroke={isHighlighted ? 'rgba(12, 21, 40, 0.32)' : 'rgba(12, 21, 40, 0.2)'}
              strokeWidth={isHighlighted ? 1.6 : 1.1}
              strokeLinecap="round"
              initial={false}
              animate={{
                opacity: baseOpacity,
                pathLength: reduceMotion ? 1 : baseOpacity > 0.1 ? 1 : 0.35,
              }}
              transition={{
                opacity: { duration: reduceMotion ? 0 : 0.45, ease: 'easeOut' },
                pathLength: { duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] },
              }}
            />
            {isHighlighted && !reduceMotion ? (
              <motion.circle
                r={2.5}
                fill="rgba(12, 21, 40, 0.28)"
                initial={{ offsetDistance: '0%' }}
                animate={{ offsetDistance: '100%' }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'linear' }}
                style={{ offsetPath: `path("${d}")` }}
              />
            ) : null}
            {labelVisible ? (
              <motion.foreignObject
                x={labelPt.x - 90}
                y={labelPt.y - 14}
                width={180}
                height={28}
                initial={false}
                animate={{ opacity: isHighlighted ? 0.92 : 0.55 }}
                transition={{ duration: reduceMotion ? 0 : 0.35 }}
              >
                <p className="about-relationship-field__label m-0 text-center text-[length:var(--text-slab-eyebrow)] italic leading-[1.3] text-ink/52">
                  {edge.label}
                </p>
              </motion.foreignObject>
            ) : null}
          </g>
        );
      })}

      {[...visitedIds].map((id) => {
        const pos = positions.get(id);
        if (!pos) return null;
        return (
          <circle
            key={`visited-${id}`}
            cx={pos.x}
            cy={pos.y}
            r={14}
            className="about-relationship-field__visited"
            fill="none"
            stroke="rgba(12, 21, 40, 0.1)"
            strokeWidth={1}
          />
        );
      })}
    </svg>
  );
}
