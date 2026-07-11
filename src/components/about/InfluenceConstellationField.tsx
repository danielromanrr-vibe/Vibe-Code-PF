import { motion, useReducedMotion } from 'motion/react';
import { ABOUT_INFLUENCE_CARDS } from '../../content/aboutMandalaFacets';
import type { AboutFieldGeometry } from './useAboutFieldGeometry';
import {
  anchorWeight,
  influenceHaloRadii,
  influenceSatellites,
} from './aboutInfluenceConstellation';
import { relatedIdsForCard } from './aboutRelationshipGraph';
import { type InfluenceDepth } from '../../content/aboutMandalaFacets';

type InfluenceConstellationFieldProps = {
  geometry: AboutFieldGeometry;
  fieldTimeSec: number;
  activeCardId: string | null;
  previewCardId: string | null;
  depth: InfluenceDepth;
};

function tierOpacity(weight: number, ring: 0 | 1 | 2): number {
  const base = [0.1, 0.07, 0.045][ring];
  return base + weight * [0.14, 0.1, 0.06][ring];
}

export default function InfluenceConstellationField({
  geometry,
  fieldTimeSec,
  activeCardId,
  previewCardId,
  depth,
}: InfluenceConstellationFieldProps) {
  const reduceMotion = useReducedMotion();
  const { positions } = geometry;
  if (!positions.size) return null;

  const focusId = activeCardId ?? previewCardId;
  const focusRelated = focusId ? relatedIdsForCard(focusId) : null;
  const isEngaged = depth !== 'collapsed' && Boolean(activeCardId);

  return (
    <svg className="influence-constellation-field pointer-events-none fixed inset-0 z-[16]" aria-hidden>
      {ABOUT_INFLUENCE_CARDS.map((card) => {
        const pos = positions.get(card.id);
        if (!pos) return null;

        const weight = anchorWeight(card.id, activeCardId, previewCardId, focusRelated);
        const halos = influenceHaloRadii(card.id);
        const satellites = influenceSatellites(card.id);
        const pulse = reduceMotion
          ? 1
          : 1 + Math.sin(fieldTimeSec * 0.55 + card.nodeIndex * 0.4) * 0.018 * (0.5 + weight);

        return (
          <g key={card.id} className="influence-constellation-field__landmark" transform={`translate(${pos.x} ${pos.y})`}>
            {halos.map((radius, i) => (
              <motion.circle
                key={`halo-${i}`}
                r={radius * pulse}
                fill="none"
                stroke="rgba(12, 21, 40, 0.2)"
                strokeWidth={i === 0 ? 0.85 : 0.65}
                strokeDasharray={i === 0 ? '1 7' : i === 1 ? '3 9' : '5 11'}
                initial={false}
                animate={{
                  opacity: tierOpacity(weight, i as 0 | 1 | 2),
                  r: radius * pulse,
                }}
                transition={{ duration: reduceMotion ? 0 : 0.8, ease: 'easeOut' }}
              />
            ))}

            {satellites.map((sat, i) => {
              const a = sat.angleRad + (reduceMotion ? 0 : fieldTimeSec * 0.08 * (i % 2 === 0 ? 1 : -1));
              const dist = halos[0] * sat.distFrac;
              const sx = Math.cos(a) * dist;
              const sy = Math.sin(a) * dist;
              return (
                <circle
                  key={`sat-${i}`}
                  cx={sx}
                  cy={sy}
                  r={sat.r}
                  fill="rgba(12, 21, 40, 0.22)"
                  opacity={0.35 + weight * 0.35}
                />
              );
            })}

            {!reduceMotion ? (
              <motion.path
                d={`M ${halos[1] * 0.3} ${-halos[1] * 0.15} A ${halos[1]} ${halos[1]} 0 0 1 ${halos[1] * 0.55} ${halos[1] * 0.42}`}
                fill="none"
                stroke="rgba(12, 21, 40, 0.16)"
                strokeWidth={0.7}
                strokeDasharray="2 6"
                animate={{ opacity: 0.12 + weight * 0.2, rotate: fieldTimeSec * 4 }}
                transition={{ duration: 0.6 }}
                style={{ transformOrigin: '0px 0px' }}
              />
            ) : null}

            {isEngaged && activeCardId === card.id ? (
              <circle
                r={halos[2] * 1.05}
                fill="none"
                stroke="rgba(12, 21, 40, 0.12)"
                strokeWidth={0.5}
                strokeDasharray="1 12"
                opacity={0.5}
              />
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
