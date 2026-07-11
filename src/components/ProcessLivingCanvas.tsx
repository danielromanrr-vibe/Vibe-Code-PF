import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  CANVAS_CENTER,
  CANVAS_EDGES,
  CANVAS_NODES,
  canvasDeltaAtStep,
  chapterAtStep,
  edgeOpacity,
  nodeOpacity,
  nodePosition,
  type CanvasEdgeDef,
  type CanvasNodeDef,
} from '../content/processSystemCanvas';
import type { PrototypeTrack } from './AdoptProcessOverview';
import { adoptBreathFast, adoptMandalaBeat } from '../utils/adoptDiagramMotion';

const CHAPTER_TINT: Record<string, { stroke: string; node: string; field: string }> = {
  research: {
    stroke: 'rgba(51, 96, 173, 0.42)',
    node: 'rgba(51, 96, 173, 0.55)',
    field: 'rgba(51, 96, 173, 0.07)',
  },
  definition: {
    stroke: 'rgba(113, 76, 160, 0.44)',
    node: 'rgba(139, 92, 246, 0.58)',
    field: 'rgba(113, 76, 160, 0.08)',
  },
  'rapid-prototyping': {
    stroke: 'rgba(200, 148, 8, 0.44)',
    node: 'rgba(220, 166, 0, 0.58)',
    field: 'rgba(220, 166, 0, 0.07)',
  },
  validation: {
    stroke: 'rgba(0, 125, 86, 0.44)',
    node: 'rgba(33, 170, 127, 0.58)',
    field: 'rgba(0, 125, 86, 0.07)',
  },
};

type ProcessLivingCanvasProps = {
  globalStep: number;
  prototypeTrack?: PrototypeTrack;
  className?: string;
};

function edgePath(from: CanvasNodeDef, to: CanvasNodeDef, step: number): string {
  const a = nodePosition(from, step);
  const b = nodePosition(to, step);
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2 - 4;
  return `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`;
}

export default function ProcessLivingCanvas({
  globalStep,
  prototypeTrack = 'digital',
  className = '',
}: ProcessLivingCanvasProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const step = Math.max(0, Math.min(11, globalStep));
  const chapterId = chapterAtStep(step);
  const tint = CHAPTER_TINT[chapterId] ?? CHAPTER_TINT.research;
  const delta = canvasDeltaAtStep(step, prototypeTrack);
  const emphasizeNodes = new Set(delta.newNodeIds);
  const emphasizeEdges = new Set(delta.newEdgeIds);
  const fadingEdges = new Set(delta.fadingEdgeIds);

  const [pulse, setPulse] = useState(0.5);
  const rafRef = useRef(0);

  useEffect(() => {
    if (reducedMotion) {
      setPulse(0.5);
      return;
    }
    const tick = () => {
      const t = performance.now() / 1000;
      setPulse(adoptMandalaBeat(t, false) * 0.5 + adoptBreathFast(t, false) * 0.2);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [reducedMotion]);

  const nodeMap = Object.fromEntries(CANVAS_NODES.map((n) => [n.id, n]));

  return (
    <div
      className={['process-living-canvas absolute inset-0 overflow-hidden', className].filter(Boolean).join(' ')}
      aria-hidden
    >
      <div
        className="absolute inset-0 transition-[background] duration-[1.2s] ease-out"
        style={{
          background: `radial-gradient(ellipse 75% 65% at 50% 44%, ${tint.field} 0%, transparent 68%)`,
        }}
      />
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 88"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
      >
        <motion.ellipse
          cx={CANVAS_CENTER.x}
          cy={CANVAS_CENTER.y}
          rx={32 + step * 0.8}
          ry={24 + step * 0.5}
          stroke={tint.stroke}
          strokeWidth="0.15"
          fill="none"
          animate={{ opacity: 0.12 + step * 0.04 }}
          transition={{ duration: reducedMotion ? 0 : 0.9, ease: [0.22, 0.82, 0.24, 1] }}
        />

        {CANVAS_EDGES.map((edge) => {
          const from = nodeMap[edge.from];
          const to = nodeMap[edge.to];
          if (!from || !to) return null;
          const opacity = edgeOpacity(edge, step, prototypeTrack);
          if (opacity <= 0.02) return null;
          const d = edgePath(from, to, step);
          return (
            <CanvasEdge
              key={edge.id}
              edge={edge}
              d={d}
              opacity={opacity}
              stroke={tint.stroke}
              reducedMotion={reducedMotion}
              step={step}
              emphasized={emphasizeEdges.has(edge.id)}
              fading={fadingEdges.has(edge.id)}
            />
          );
        })}

        {CANVAS_NODES.map((node) => {
          const opacity = nodeOpacity(node, step);
          if (opacity <= 0.02) return null;
          const pos = nodePosition(node, step);
          const isNew = step === node.revealAt;
          const emphasized = emphasizeNodes.has(node.id);
          return (
            <CanvasNode
              key={node.id}
              node={node}
              x={pos.x}
              y={pos.y}
              opacity={opacity}
              fill={tint.node}
              stroke={tint.stroke}
              pulse={pulse}
              reducedMotion={reducedMotion}
              emphasize={isNew || emphasized}
            />
          );
        })}
      </svg>
    </div>
  );
}

function CanvasEdge({
  edge,
  d,
  opacity,
  stroke,
  reducedMotion,
  step,
  emphasized = false,
  fading = false,
}: {
  edge: CanvasEdgeDef;
  d: string;
  opacity: number;
  stroke: string;
  reducedMotion: boolean;
  step: number;
  emphasized?: boolean;
  fading?: boolean;
}) {
  const isCandidate = edge.variant === 'candidate';
  const isValidated = edge.variant === 'validated';
  const strengthened = edge.strengthenAt != null && step >= edge.strengthenAt;
  const displayOpacity = fading ? opacity * 0.35 : emphasized ? Math.min(1, opacity + 0.25) : opacity;

  return (
    <motion.path
      d={d}
      stroke={stroke}
      strokeWidth={emphasized ? 0.28 : strengthened ? 0.22 : isValidated ? 0.2 : 0.14}
      strokeDasharray={isCandidate ? '1.2 1.4' : undefined}
      fill="none"
      initial={false}
      animate={{ opacity: displayOpacity, pathLength: 1 }}
      transition={{
        opacity: { duration: reducedMotion ? 0 : 0.65, ease: 'easeOut' },
        pathLength: { duration: reducedMotion ? 0 : 0.85, ease: [0.22, 0.82, 0.24, 1] },
      }}
    />
  );
}

function CanvasNode({
  node,
  x,
  y,
  opacity,
  fill,
  stroke,
  pulse,
  reducedMotion,
  emphasize,
}: {
  node: CanvasNodeDef;
  x: number;
  y: number;
  opacity: number;
  fill: string;
  stroke: string;
  pulse: number;
  reducedMotion: boolean;
  emphasize: boolean;
}) {
  const r = node.role === 'signal' ? 1.35 : node.role === 'structure' ? 1.15 : 0.95;
  const glowR = r + 2 + pulse * 0.8;

  return (
    <g>
      {emphasize && !reducedMotion ? (
        <motion.circle
          cx={x}
          cy={y}
          r={glowR}
          fill={fill}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 0.18, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 0.82, 0.24, 1] }}
        />
      ) : null}
      <motion.circle
        cx={x}
        cy={y}
        r={r}
        fill={fill}
        stroke={stroke}
        strokeWidth="0.12"
        initial={false}
        animate={{ opacity, scale: 1 }}
        transition={{
          opacity: { duration: reducedMotion ? 0 : 0.55 },
          scale: emphasize && !reducedMotion ? { type: 'spring', stiffness: 280, damping: 22 } : { duration: 0 },
        }}
      />
      <motion.text
        x={x}
        y={y + 3.8}
        textAnchor="middle"
        className="process-living-canvas__label"
        initial={false}
        animate={{ opacity: Math.min(opacity + 0.15, 0.72) }}
        transition={{ duration: reducedMotion ? 0 : 0.5 }}
      >
        {node.label}
      </motion.text>
    </g>
  );
}
