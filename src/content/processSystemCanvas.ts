import type { ProcessOverviewChapterId } from '../components/AdoptProcessOverview';
import type { PrototypeTrack } from '../components/AdoptProcessOverview';

/** Global step 0–11 across all twelve turning points. */
export type CanvasGlobalStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export type CanvasNodeDef = {
  id: string;
  label: string;
  x: number;
  y: number;
  /** First global step where node becomes visible */
  revealAt: CanvasGlobalStep;
  /** Optional step after which node fades (weak paths in validation) */
  fadeAfter?: CanvasGlobalStep;
  role: 'observation' | 'actor' | 'signal' | 'structure';
};

export type CanvasEdgeVariant = 'whisper' | 'trace' | 'candidate' | 'validated';

export type CanvasEdgeDef = {
  id: string;
  from: string;
  to: string;
  revealAt: CanvasGlobalStep;
  fadeAfter?: CanvasGlobalStep;
  strengthenAt?: CanvasGlobalStep;
  variant: CanvasEdgeVariant;
  /** Only visible for matching prototype track (prototyping chapter) */
  track?: PrototypeTrack;
};

export const CANVAS_NODES: readonly CanvasNodeDef[] = [
  { id: 'field', label: 'Field', x: 14, y: 38, revealAt: 0, role: 'observation' },
  { id: 'donor', label: 'Donor', x: 22, y: 58, revealAt: 0, role: 'actor' },
  { id: 'aisle', label: 'Aisle', x: 30, y: 72, revealAt: 1, role: 'observation' },
  { id: 'warehouse', label: 'Warehouse', x: 84, y: 26, revealAt: 1, role: 'actor' },
  { id: 'signal', label: 'Signal', x: 44, y: 46, revealAt: 2, role: 'signal' },
  { id: 'map', label: 'Map', x: 58, y: 34, revealAt: 3, role: 'structure' },
  { id: 'object', label: 'Object', x: 36, y: 64, revealAt: 4, role: 'structure' },
  { id: 'mission', label: 'Mission', x: 50, y: 42, revealAt: 5, role: 'signal' },
  { id: 'digital', label: 'Digital', x: 62, y: 58, revealAt: 6, role: 'structure' },
  { id: 'path-b', label: 'Alt path', x: 72, y: 68, revealAt: 7, fadeAfter: 10, role: 'observation' },
  { id: 'framework', label: 'Framework', x: 48, y: 54, revealAt: 8, role: 'structure' },
  { id: 'ops', label: 'Ops', x: 78, y: 48, revealAt: 9, role: 'actor' },
  { id: 'repeat', label: 'Repeat', x: 54, y: 38, revealAt: 11, role: 'signal' },
];

export const CANVAS_EDGES: readonly CanvasEdgeDef[] = [
  { id: 'e-donor-wh', from: 'donor', to: 'warehouse', revealAt: 1, fadeAfter: 9, variant: 'whisper' },
  { id: 'e-field-signal', from: 'field', to: 'signal', revealAt: 2, variant: 'trace' },
  { id: 'e-aisle-signal', from: 'aisle', to: 'signal', revealAt: 2, variant: 'trace' },
  { id: 'e-signal-map', from: 'signal', to: 'map', revealAt: 3, strengthenAt: 5, variant: 'trace' },
  { id: 'e-object-signal', from: 'object', to: 'signal', revealAt: 4, variant: 'trace' },
  { id: 'e-map-mission', from: 'map', to: 'mission', revealAt: 5, strengthenAt: 8, variant: 'trace' },
  { id: 'e-object-mission', from: 'object', to: 'mission', revealAt: 5, variant: 'trace' },
  { id: 'e-object-digital', from: 'object', to: 'digital', revealAt: 6, strengthenAt: 9, variant: 'trace', track: 'digital' },
  { id: 'e-aisle-object', from: 'aisle', to: 'object', revealAt: 6, strengthenAt: 9, variant: 'trace', track: 'physical' },
  { id: 'e-digital-candidate', from: 'digital', to: 'path-b', revealAt: 7, fadeAfter: 10, variant: 'candidate', track: 'digital' },
  { id: 'e-object-candidate', from: 'object', to: 'path-b', revealAt: 7, fadeAfter: 10, variant: 'candidate', track: 'physical' },
  { id: 'e-digital-framework', from: 'digital', to: 'framework', revealAt: 8, variant: 'trace', track: 'digital' },
  { id: 'e-object-framework', from: 'object', to: 'framework', revealAt: 8, variant: 'trace', track: 'physical' },
  { id: 'e-framework-mission', from: 'framework', to: 'mission', revealAt: 8, strengthenAt: 10, variant: 'trace' },
  { id: 'e-digital-ops', from: 'digital', to: 'ops', revealAt: 9, strengthenAt: 11, variant: 'validated', track: 'digital' },
  { id: 'e-mission-ops', from: 'mission', to: 'ops', revealAt: 9, strengthenAt: 11, variant: 'validated' },
  { id: 'e-mission-repeat', from: 'mission', to: 'repeat', revealAt: 11, variant: 'validated' },
  { id: 'e-ops-repeat', from: 'ops', to: 'repeat', revealAt: 11, variant: 'validated' },
];

const CHAPTER_FOR_STEP: ProcessOverviewChapterId[] = [
  'research',
  'research',
  'research',
  'definition',
  'definition',
  'definition',
  'rapid-prototyping',
  'rapid-prototyping',
  'rapid-prototyping',
  'validation',
  'validation',
  'validation',
];

export function chapterAtStep(step: number): ProcessOverviewChapterId {
  return CHAPTER_FOR_STEP[Math.max(0, Math.min(11, step))] ?? 'research';
}

export function nodeOpacity(
  node: CanvasNodeDef,
  step: number,
): number {
  if (step < node.revealAt) return 0;
  if (node.fadeAfter != null && step > node.fadeAfter) return 0.12;
  const age = step - node.revealAt;
  const base = Math.min(1, 0.35 + age * 0.22);
  if (node.fadeAfter != null && step >= node.fadeAfter - 1) {
    return base * 0.35;
  }
  return base;
}

export function edgeOpacity(
  edge: CanvasEdgeDef,
  step: number,
  track: PrototypeTrack,
): number {
  if (edge.track && edge.track !== track) return 0;
  if (step < edge.revealAt) return 0;
  if (edge.fadeAfter != null && step > edge.fadeAfter) return 0;
  let base = edge.variant === 'whisper' ? 0.28 : edge.variant === 'candidate' ? 0.38 : 0.42;
  if (edge.strengthenAt != null && step >= edge.strengthenAt) {
    base = edge.variant === 'validated' ? 0.72 : 0.58;
  }
  if (edge.fadeAfter != null && step >= edge.fadeAfter - 1 && step <= edge.fadeAfter) {
    base *= 0.25;
  }
  const age = step - edge.revealAt;
  return Math.min(base, 0.2 + age * 0.15);
}

export function clusterPull(step: number): number {
  if (step <= 2) return 0;
  if (step <= 5) return (step - 2) / 3;
  if (step <= 8) return 1;
  return 1 - (step - 8) * 0.08;
}

export const CANVAS_CENTER = { x: 50, y: 44 };

export function nodePosition(node: CanvasNodeDef, step: number): { x: number; y: number } {
  const pull = clusterPull(step);
  return {
    x: node.x + (CANVAS_CENTER.x - node.x) * pull * 0.22,
    y: node.y + (CANVAS_CENTER.y - node.y) * pull * 0.22,
  };
}

/** Nodes and edges that change on this step — for canvas emphasis + caption binding. */
export function canvasDeltaAtStep(
  step: number,
  track: PrototypeTrack,
): { newNodeIds: string[]; newEdgeIds: string[]; fadingEdgeIds: string[] } {
  const s = Math.max(0, Math.min(11, step));
  const edgeVisible = (e: CanvasEdgeDef) => !e.track || e.track === track;

  return {
    newNodeIds: CANVAS_NODES.filter((n) => n.revealAt === s).map((n) => n.id),
    newEdgeIds: CANVAS_EDGES.filter((e) => e.revealAt === s && edgeVisible(e)).map((e) => e.id),
    fadingEdgeIds: CANVAS_EDGES.filter((e) => e.fadeAfter === s && edgeVisible(e)).map((e) => e.id),
  };
}
