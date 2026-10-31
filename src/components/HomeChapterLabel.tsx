import { useEffect, useRef, type PointerEvent } from 'react';

export type HomeChapterField = 'studies' | 'team' | 'about';

export type HomeChapterTocItem = {
  targetId: string;
  label: string;
};

type HomeChapterLabelProps = {
  id: string;
  field: HomeChapterField;
  children: string;
  /** Second line under the bold label — same body size, regular weight. */
  kicker?: string;
  /**
   * Quieter crop-mark + sky (~50% less decoration).
   * Use off-homepage so the home chapter markers stay the celebratory ones.
   */
  quiet?: boolean;
  /** Transient emphasis after nav jump (e.g. Product → Case studies). */
  highlighted?: boolean;
  /** When false, TOC stays hidden even if `toc` is provided. */
  tocOpen?: boolean;
  /** Optional mini TOC branching from the marker (Case studies). */
  toc?: readonly HomeChapterTocItem[];
};

const REDUCE_MOTION = '(prefers-reduced-motion: reduce)';

function hexPoints(cx: number, cy: number, r: number) {
  return Array.from({ length: 6 }, (_, s) => {
    const a = (s / 6) * Math.PI * 2 - Math.PI / 2;
    return `${(cx + Math.cos(a) * r).toFixed(2)},${(cy + Math.sin(a) * r).toFixed(2)}`;
  }).join(' ');
}

type Pt = [number, number];

type BendSpec = {
  knots: Pt[];
  handles: [Pt, Pt][];
  knotGain: number;
  handleGain: number;
  closed?: boolean;
  /** How strongly pointer X spreads this drawing. */
  xVar?: number;
  /** How strongly pointer Y lifts this drawing. */
  yVar?: number;
};

const BEND_REACH = 88;
const BEND_CAP = 0.42;

function fmt(n: number) {
  return n.toFixed(2);
}

/** Fast-out cubic so the first movement of the pointer already bows the curve. */
function easeOutCubic(t: number) {
  const u = 1 - t;
  return 1 - u * u * u;
}

/**
 * Pointer X and pointer Y move a point differently.
 * X spreads the shape around its own center and twists the outgoing handle.
 * Y stretches it the other way and twists the incoming handle.
 * A share of the move still chases the cursor, so the bow from before stays.
 */
function place(
  pt: Pt,
  px: number,
  py: number,
  gain: number,
  hot: number,
  mode: 'out' | 'in' | 'knot',
  origin: Pt,
  xVar: number,
  yVar: number,
  axisX: number,
  axisY: number,
): Pt {
  if (gain <= 0 || hot < 0.001) return pt;
  const ease = easeOutCubic(Math.min(1.15, Math.max(0, hot)));
  const dx = px - pt[0];
  const dy = py - pt[1];
  const dist = Math.hypot(dx, dy) || 1;
  const t = Math.min(BEND_CAP, gain * Math.exp(-dist / BEND_REACH)) * ease;
  const xChase = mode === 'out' ? 1.35 : mode === 'in' ? 0.45 : 1;
  const yChase = mode === 'in' ? 1.35 : mode === 'out' ? 0.45 : 1;
  const mx = Math.max(-1.15, Math.min(1.15, axisX));
  const my = Math.max(-1.15, Math.min(1.15, axisY));
  const localX = (pt[0] - origin[0]) / 80;
  const localY = (pt[1] - origin[1]) / 36;
  const twist = mode === 'out' ? 1 : mode === 'in' ? -1 : 0;
  let ox = dx * t * xChase + (mx * localX * 30 * xVar + my * twist * 18 * yVar) * gain * ease;
  let oy = dy * t * yChase + (my * localY * 32 * yVar + mx * twist * 10 * xVar) * gain * ease;
  const mag = Math.hypot(ox, oy);
  const max = 36 * Math.max(0.45, gain);
  if (mag > max) {
    ox = (ox / mag) * max;
    oy = (oy / mag) * max;
  }
  return [pt[0] + ox, pt[1] + oy];
}

const AXIS_REACH = 1.2;

/** Nearer tip gets the larger share. A floor keeps the far tip, and a pointer past the drawing, answering. */
function tipWeight(pt: Pt, px: number, py: number) {
  const dist = Math.hypot(px - pt[0], py - pt[1]);
  return 0.42 + 0.5 * Math.exp(-dist / 150);
}

function tipOffset(pt: Pt, px: number, py: number, handleGain: number, hot: number, axisX: number, axisY: number): Pt {
  if (hot < 0.001) return pt;
  const ease = easeOutCubic(Math.min(1.15, Math.max(0, hot)));
  const mx = Math.max(-1.15, Math.min(1.15, axisX));
  const my = Math.max(-1.15, Math.min(1.15, axisY));
  const gain = handleGain * tipWeight(pt, px, py);
  return [pt[0] + mx * 24 * gain * ease, pt[1] + my * 18 * gain * ease];
}

type BandPull = { dx: number; dy: number; left: number; right: number };

const BAND_BY_FIELD = {
  studies: { left: 16, right: 254 },
  team: { left: 22, right: 226 },
  about: { left: 18, right: 248 },
} as const;

function smoothstep(t: number) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

/** Pin the far end. Travel eases in along the drawing so the free end carries the stretch. */
function rubberPoint(pt: Pt, pull: BandPull | null): Pt {
  if (!pull) return pt;
  if (Math.abs(pull.dx) < 0.01 && Math.abs(pull.dy) < 0.01) return pt;
  const span = pull.right - pull.left || 1;
  const raw = pull.dx >= 0 ? (pt[0] - pull.left) / span : (pull.right - pt[0]) / span;
  const t = Math.max(0, Math.min(1, raw));
  const along = t * (0.55 + 0.45 * smoothstep(t));
  const tension = Math.min(22, Math.hypot(pull.dx, pull.dy) * 0.07);
  const belly = Math.sin(t * Math.PI) * tension * (Math.abs(pull.dy) > 8 ? Math.sign(pull.dy) : 1);
  return [pt[0] + pull.dx * along, pt[1] + pull.dy * along * 0.7 + belly];
}

/** Held: a soft catch onto the cursor. Released: one short return past rest, then settle. */
function bandSpring(cur: number, vel: number, target: number, held: boolean, lead: boolean) {
  const k = held ? (lead ? 0.26 : 0.18) : lead ? 0.2 : 0.16;
  const damp = held ? 0.58 : 0.62;
  const v = (vel + (target - cur) * k) * damp;
  return [cur + v, v] as const;
}

function bendToD(
  spec: BendSpec,
  px: number,
  py: number,
  axisX: number,
  axisY: number,
  hot: number,
  pull: BandPull | null = null,
) {
  const last = spec.knots.length - 1;
  let ox = 0;
  let oy = 0;
  for (const knot of spec.knots) {
    ox += knot[0];
    oy += knot[1];
  }
  const origin: Pt = [ox / spec.knots.length, oy / spec.knots.length];
  const xVar = spec.xVar ?? 1;
  const yVar = spec.yVar ?? 1;
  const knots = spec.knots.map((pt, i) => {
    const isEnd = !spec.closed && (i === 0 || i === last);
    const placed = isEnd
      ? tipOffset(pt, px, py, spec.handleGain, hot, axisX, axisY)
      : place(pt, px, py, spec.knotGain, hot, 'knot', origin, xVar, yVar, axisX, axisY);
    return rubberPoint(placed, pull);
  });
  const handles = spec.handles.map(
    ([c1, c2]) =>
      [
        rubberPoint(place(c1, px, py, spec.handleGain, hot, 'out', origin, xVar, yVar, axisX, axisY), pull),
        rubberPoint(place(c2, px, py, spec.handleGain, hot, 'in', origin, xVar, yVar, axisX, axisY), pull),
      ] as [Pt, Pt],
  );
  let d = `M${fmt(knots[0][0])} ${fmt(knots[0][1])}`;
  for (let i = 0; i < handles.length; i += 1) {
    const end = spec.closed && i === handles.length - 1 ? knots[0] : knots[i + 1];
    const [c1, c2] = handles[i];
    d += `C${fmt(c1[0])} ${fmt(c1[1])} ${fmt(c2[0])} ${fmt(c2[1])} ${fmt(end[0])} ${fmt(end[1])}`;
  }
  if (spec.closed) d += 'Z';
  return d;
}

function spring(cur: number, vel: number, target: number, k: number, damp: number) {
  const v = (vel + (target - cur) * k) * damp;
  return [cur + v, v] as const;
}

function lineSpec(pts: Pt[], handleGain: number, knotGain: number): BendSpec {
  const handles: [Pt, Pt][] = [];
  for (let i = 0; i < pts.length - 1; i += 1) {
    const a = pts[i];
    const b = pts[i + 1];
    handles.push([
      [a[0] + (b[0] - a[0]) / 3, a[1] + (b[1] - a[1]) / 3],
      [a[0] + (2 * (b[0] - a[0])) / 3, a[1] + (2 * (b[1] - a[1])) / 3],
    ]);
  }
  return { knots: pts, handles, handleGain, knotGain };
}

function quadSpec(p0: Pt, c: Pt, p1: Pt, handleGain: number): BendSpec {
  return {
    knots: [p0, p1],
    handles: [[
      [p0[0] + (2 / 3) * (c[0] - p0[0]), p0[1] + (2 / 3) * (c[1] - p0[1])],
      [p1[0] + (2 / 3) * (c[0] - p1[0]), p1[1] + (2 / 3) * (c[1] - p1[1])],
    ]],
    handleGain,
    knotGain: 0,
  };
}

function cubicSpec(p0: Pt, c1: Pt, c2: Pt, p1: Pt, handleGain: number): BendSpec {
  return {
    knots: [p0, p1],
    handles: [[c1, c2]],
    handleGain,
    knotGain: 0,
  };
}

function ringSpec(cx: number, cy: number, rx: number, ry: number, handleGain: number): BendSpec {
  const kx = rx * 0.5522847498;
  const ky = ry * 0.5522847498;
  return {
    closed: true,
    knotGain: 0,
    handleGain,
    knots: [
      [cx, cy - ry],
      [cx + rx, cy],
      [cx, cy + ry],
      [cx - rx, cy],
    ],
    handles: [
      [[cx + kx, cy - ry], [cx + rx, cy - ky]],
      [[cx + rx, cy + ky], [cx + kx, cy + ry]],
      [[cx - kx, cy + ry], [cx - rx, cy + ky]],
      [[cx - rx, cy - ky], [cx - kx, cy - ry]],
    ],
  };
}

function arcSpec(
  x1: number,
  y1: number,
  rxIn: number,
  ryIn: number,
  phi: number,
  large: boolean,
  sweep: boolean,
  x2: number,
  y2: number,
  handleGain: number,
  knotGain: number,
): BendSpec {
  const sin = Math.sin(phi);
  const cos = Math.cos(phi);
  const dx = (x1 - x2) / 2;
  const dy = (y1 - y2) / 2;
  const x1p = cos * dx + sin * dy;
  const y1p = -sin * dx + cos * dy;
  let rx = Math.abs(rxIn);
  let ry = Math.abs(ryIn);
  let rx2 = rx * rx;
  let ry2 = ry * ry;
  const x1p2 = x1p * x1p;
  const y1p2 = y1p * y1p;
  const lam = x1p2 / rx2 + y1p2 / ry2;
  if (lam > 1) {
    const s = Math.sqrt(lam);
    rx *= s;
    ry *= s;
    rx2 = rx * rx;
    ry2 = ry * ry;
  }
  const sign = large === sweep ? -1 : 1;
  const sq = Math.max(0, (rx2 * ry2 - rx2 * y1p2 - ry2 * x1p2) / (rx2 * y1p2 + ry2 * x1p2));
  const coef = sign * Math.sqrt(sq);
  const cxp = (coef * rx * y1p) / ry;
  const cyp = (coef * -ry * x1p) / rx;
  const cx = cos * cxp - sin * cyp + (x1 + x2) / 2;
  const cy = sin * cxp + cos * cyp + (y1 + y2) / 2;
  const ang = (ux: number, uy: number, vx: number, vy: number) => {
    const dot = ux * vx + uy * vy;
    const len = Math.hypot(ux, uy) * Math.hypot(vx, vy) || 1;
    let a = Math.acos(Math.min(1, Math.max(-1, dot / len)));
    if (ux * vy - uy * vx < 0) a = -a;
    return a;
  };
  const theta1 = ang(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry);
  let dtheta = ang((x1p - cxp) / rx, (y1p - cyp) / ry, (-x1p - cxp) / rx, (-y1p - cyp) / ry);
  if (!sweep && dtheta > 0) dtheta -= Math.PI * 2;
  if (sweep && dtheta < 0) dtheta += Math.PI * 2;

  const knots: Pt[] = [];
  const handles: [Pt, Pt][] = [];
  let left = dtheta;
  let t0 = theta1;
  while (Math.abs(left) > 1e-6) {
    const step = Math.sign(left) * Math.min(Math.abs(left), Math.PI / 2);
    const alpha = Math.tan(step / 4) * (4 / 3);
    const at = (th: number): Pt => {
      const xr = Math.cos(th) * rx;
      const yr = Math.sin(th) * ry;
      return [cx + xr * cos - yr * sin, cy + xr * sin + yr * cos];
    };
    const deriv = (th: number): Pt => {
      const xr = -Math.sin(th) * rx;
      const yr = Math.cos(th) * ry;
      return [xr * cos - yr * sin, xr * sin + yr * cos];
    };
    const p0 = at(t0);
    const p1 = at(t0 + step);
    const d0 = deriv(t0);
    const d1 = deriv(t0 + step);
    if (knots.length === 0) knots.push(p0);
    knots.push(p1);
    handles.push([
      [p0[0] + d0[0] * alpha, p0[1] + d0[1] * alpha],
      [p1[0] - d1[0] * alpha, p1[1] - d1[1] * alpha],
    ]);
    t0 += step;
    left -= step;
  }
  return { knots, handles, handleGain, knotGain };
}

const bendSpecs = new WeakMap<SVGPathElement, BendSpec>();

function SkyCurve({
  spec,
  className,
  strokeWidth,
  dash,
}: {
  spec: BendSpec;
  className?: string;
  strokeWidth: number;
  dash?: string;
}) {
  return (
    <path
      ref={(node) => {
        if (node) bendSpecs.set(node, spec);
      }}
      data-sky-bend=""
      className={className}
      d={bendToD(spec, 0, 0, 0, 0, 0)}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeDasharray={dash}
    />
  );
}

function bias(spec: BendSpec, xVar: number, yVar: number, knotGain?: number): BendSpec {
  return knotGain == null ? { ...spec, xVar, yVar } : { ...spec, xVar, yVar, knotGain };
}

const PULL_CAP = 168;
const PULL_SLOP = 6;

function clientOnSky(marker: HTMLElement, clientX: number, clientY: number) {
  const sky = marker.querySelector('svg')?.getBoundingClientRect();
  if (!sky || sky.width < 2 || sky.height < 2) return false;
  return (
    clientX >= sky.left - 10 &&
    clientX <= sky.right + 10 &&
    clientY >= sky.top - 10 &&
    clientY <= sky.bottom + 10
  );
}

type MarkHome = { kind: 'circle'; cx: number; cy: number } | { kind: 'poly'; points: string };

const markHomes = new WeakMap<SVGElement, MarkHome>();

function stretchMarks(root: HTMLElement, pull: BandPull | null) {
  root.querySelectorAll<SVGCircleElement>('circle').forEach((circle) => {
    let home = markHomes.get(circle);
    if (!home || home.kind !== 'circle') {
      home = { kind: 'circle', cx: Number(circle.getAttribute('cx')), cy: Number(circle.getAttribute('cy')) };
      markHomes.set(circle, home);
    }
    const moved = rubberPoint([home.cx, home.cy], pull);
    circle.setAttribute('cx', moved[0].toFixed(2));
    circle.setAttribute('cy', moved[1].toFixed(2));
  });
  root.querySelectorAll<SVGPolygonElement>('polygon').forEach((poly) => {
    let home = markHomes.get(poly);
    if (!home || home.kind !== 'poly') {
      home = { kind: 'poly', points: poly.getAttribute('points') || '' };
      markHomes.set(poly, home);
    }
    if (!pull) {
      poly.setAttribute('points', home.points);
      return;
    }
    const next = home.points
      .trim()
      .split(/\s+/)
      .map((pair) => {
        const [x, y] = pair.split(',').map(Number);
        const moved = rubberPoint([x, y], pull);
        return `${moved[0].toFixed(2)},${moved[1].toFixed(2)}`;
      })
      .join(' ');
    poly.setAttribute('points', next);
  });
}

function paintBends(
  root: HTMLElement,
  px: number,
  py: number,
  axisX: number,
  axisY: number,
  hot: number,
  pull: BandPull | null = null,
) {
  const tips: { x: number; y: number; dx: number; dy: number }[] = [];
  root.querySelectorAll<SVGPathElement>('[data-sky-bend]').forEach((path) => {
    const spec = bendSpecs.get(path);
    if (!spec) return;
    path.setAttribute('d', bendToD(spec, px, py, axisX, axisY, hot, pull));
    if (spec.closed) return;
    const last = spec.knots.length - 1;
    for (const pt of [spec.knots[0], spec.knots[last]]) {
      const moved = tipOffset(pt, px, py, spec.handleGain, hot, axisX, axisY);
      tips.push({ x: pt[0], y: pt[1], dx: moved[0] - pt[0], dy: moved[1] - pt[1] });
    }
  });
  root.querySelectorAll<SVGGElement>('.home-chapter-label__node').forEach((node) => {
    if (pull) {
      node.style.setProperty('--tip-x', '0px');
      node.style.setProperty('--tip-y', '0px');
    }
  });
  stretchMarks(root, pull);
  if (pull) return;
  const svg = root.querySelector('svg');
  const unit = svg && svg.getBoundingClientRect().width > 1 ? svg.getBoundingClientRect().width / 280 : 0;
  root.querySelectorAll<SVGGElement>('.home-chapter-label__node').forEach((node) => {
    const circle = node.querySelector('circle');
    if (!circle || unit === 0) {
      node.style.setProperty('--tip-x', '0px');
      node.style.setProperty('--tip-y', '0px');
      return;
    }
    const home = markHomes.get(circle);
    const x = home && home.kind === 'circle' ? home.cx : Number(circle.getAttribute('cx'));
    const y = home && home.kind === 'circle' ? home.cy : Number(circle.getAttribute('cy'));
    let best: { dx: number; dy: number } | null = null;
    let bestDist = 2.5;
    for (const tip of tips) {
      const dist = Math.hypot(tip.x - x, tip.y - y);
      if (dist < bestDist) {
        best = tip;
        bestDist = dist;
      }
    }
    node.style.setProperty('--tip-x', best ? `${(best.dx * unit).toFixed(2)}px` : '0px');
    node.style.setProperty('--tip-y', best ? `${(best.dy * unit).toFixed(2)}px` : '0px');
  });
}

const STUDIES_SWEEP = bias(arcSpec(18, 78, 118, 72, 0, false, true, 236, 40, 1.05, 0.12), AXIS_REACH, AXIS_REACH);
const STUDIES_INNER = bias(arcSpec(48, 70, 86, 52, 0, false, true, 214, 36, 1.05, 0.12), AXIS_REACH, AXIS_REACH);
const STUDIES_CHAIN = bias(
  lineSpec(
    [
      [22, 52],
      [72, 40],
      [128, 48],
      [186, 32],
      [232, 28],
    ],
  1.15,
  0.2,
),
  AXIS_REACH,
  AXIS_REACH,
);
const STUDIES_BOW = bias(quadSpec([72, 40], [150, 18], [232, 28], 1.2), AXIS_REACH, AXIS_REACH);

const TEAM_LEFT = bias(arcSpec(36, 22, 54, 54, 0, false, true, 36, 74, 1.1, 0), AXIS_REACH, AXIS_REACH);
const TEAM_RIGHT = bias(arcSpec(168, 18, 58, 58, 0, false, false, 168, 78, 1.1, 0), AXIS_REACH, AXIS_REACH);
const TEAM_LENS = bias(arcSpec(92, 48, 38, 22, 0, true, true, 148, 48, 0.95, 0.16), AXIS_REACH, AXIS_REACH);
const TEAM_WAVE = bias(cubicSpec([58, 48], [92, 28], [124, 68], [156, 48], 1.25), AXIS_REACH, AXIS_REACH);
const TEAM_CHAIN = bias(
  lineSpec(
    [
      [58, 48],
      [96, 40],
      [124, 56],
      [156, 48],
    ],
    1.15,
    0.22,
  ),
  AXIS_REACH,
  AXIS_REACH,
);

const ABOUT_RING = bias(ringSpec(52, 48, 34, 34, 0.85), 1.2, 1.2, 0.28);
const ABOUT_DASH = bias(ringSpec(52, 48, 22, 22, 0.7), 1.2, 1.2, 0.28);
const ABOUT_CORE = bias(ringSpec(52, 48, 7, 7, 0.45), 1.2, 1.2, 0.28);
const ABOUT_BOW = bias(quadSpec([86, 40], [148, 18], [232, 34], 1.2), 1.2, 1.2);
const ABOUT_CHAIN = bias(
  lineSpec(
    [
      [86, 56],
      [140, 62],
      [198, 44],
      [246, 52],
    ],
    1.15,
    0.2,
  ),
  1.2,
  1.2,
);

function FieldStudies() {
  return (
    <>
      <g className="home-chapter-label__orbit">
        <SkyCurve spec={STUDIES_SWEEP} className="home-chapter-label__arc" strokeWidth={0.85} />
        <SkyCurve
          spec={STUDIES_INNER}
          className="home-chapter-label__dash home-chapter-label__dash--slow"
          strokeWidth={0.65}
          dash="2.2 4.4"
        />
        <g className="home-chapter-label__sat">
          <circle
            className="home-chapter-label__dash"
            cx="232"
            cy="28"
            r="22"
            stroke="currentColor"
            strokeWidth="0.6"
            strokeDasharray="1.6 3.2"
          />
        </g>
      </g>
      <g className="home-chapter-label__paths">
        <SkyCurve
          spec={STUDIES_CHAIN}
          className="home-chapter-label__dash home-chapter-label__dash--drift"
          strokeWidth={0.45}
          dash="1.5 3.6"
        />
        <SkyCurve spec={STUDIES_BOW} className="home-chapter-label__arc" strokeWidth={0.45} />
      </g>
      <g className="home-chapter-label__node home-chapter-label__node--a">
        <g className="home-chapter-label__breath home-chapter-label__breath--a">
          <circle cx="22" cy="52" r="1.3" fill="currentColor" />
          <circle cx="22" cy="52" r="4" stroke="currentColor" strokeWidth="0.5" />
        </g>
      </g>
      <g className="home-chapter-label__node home-chapter-label__node--b">
        <g className="home-chapter-label__breath home-chapter-label__breath--b">
          <polygon points={hexPoints(72, 40, 6.5)} fill="currentColor" opacity="0.4" />
          <circle
            className="home-chapter-label__dash"
            cx="72"
            cy="40"
            r="9.2"
            stroke="currentColor"
            strokeWidth="0.45"
            strokeDasharray="1.7 2.8"
          />
        </g>
      </g>
      <g className="home-chapter-label__node home-chapter-label__node--c">
        <g className="home-chapter-label__breath home-chapter-label__breath--c">
          <circle cx="128" cy="48" r="1.15" fill="currentColor" />
          <circle cx="186" cy="32" r="1.05" fill="currentColor" />
        </g>
      </g>
      <g className="home-chapter-label__node home-chapter-label__node--d">
        <g className="home-chapter-label__breath home-chapter-label__breath--d">
          <circle cx="232" cy="28" r="1.45" fill="currentColor" />
          <circle cx="232" cy="28" r="3.6" stroke="currentColor" strokeWidth="0.45" />
        </g>
      </g>
    </>
  );
}

function FieldTeam() {
  return (
    <>
      <g className="home-chapter-label__orbit">
        <SkyCurve spec={TEAM_LEFT} className="home-chapter-label__arc" strokeWidth={0.8} />
        <SkyCurve spec={TEAM_RIGHT} className="home-chapter-label__arc" strokeWidth={0.8} />
        <SkyCurve
          spec={TEAM_LENS}
          className="home-chapter-label__dash home-chapter-label__dash--slow"
          strokeWidth={0.6}
          dash="2 4.2"
        />
      </g>
      <g className="home-chapter-label__paths">
        <SkyCurve spec={TEAM_WAVE} className="home-chapter-label__arc" strokeWidth={0.5} />
        <SkyCurve
          spec={TEAM_CHAIN}
          className="home-chapter-label__dash home-chapter-label__dash--drift"
          strokeWidth={0.45}
          dash="1.4 3.4"
        />
      </g>
      <g className="home-chapter-label__node home-chapter-label__node--a">
        <g className="home-chapter-label__breath home-chapter-label__breath--a">
          <circle cx="58" cy="48" r="1.4" fill="currentColor" />
          <circle cx="58" cy="48" r="8.4" stroke="currentColor" strokeWidth="0.5" />
        </g>
      </g>
      <g className="home-chapter-label__node home-chapter-label__node--b">
        <g className="home-chapter-label__breath home-chapter-label__breath--b">
          <polygon points={hexPoints(108, 48, 5.8)} fill="currentColor" opacity="0.38" />
        </g>
      </g>
      <g className="home-chapter-label__node home-chapter-label__node--c">
        <g className="home-chapter-label__breath home-chapter-label__breath--c">
          <circle cx="156" cy="48" r="1.4" fill="currentColor" />
          <circle
            className="home-chapter-label__dash"
            cx="156"
            cy="48"
            r="8.4"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeDasharray="1.8 2.6"
          />
        </g>
      </g>
      <g className="home-chapter-label__node home-chapter-label__node--d">
        <g className="home-chapter-label__breath home-chapter-label__breath--d">
          <circle cx="96" cy="40" r="1.05" fill="currentColor" />
          <circle cx="124" cy="56" r="1.05" fill="currentColor" />
        </g>
      </g>
    </>
  );
}

function FieldAbout() {
  return (
    <>
      <g className="home-chapter-label__orbit">
        <SkyCurve spec={ABOUT_RING} className="home-chapter-label__arc" strokeWidth={0.75} />
        <SkyCurve
          spec={ABOUT_DASH}
          className="home-chapter-label__dash home-chapter-label__dash--slow"
          strokeWidth={0.55}
          dash="2.4 3.8"
        />
        <SkyCurve spec={ABOUT_CORE} className="home-chapter-label__arc" strokeWidth={0.5} />
      </g>
      <g className="home-chapter-label__paths">
        <SkyCurve spec={ABOUT_BOW} className="home-chapter-label__arc" strokeWidth={0.45} />
        <SkyCurve
          spec={ABOUT_CHAIN}
          className="home-chapter-label__dash home-chapter-label__dash--drift"
          strokeWidth={0.45}
          dash="1.6 3.5"
        />
      </g>
      <g className="home-chapter-label__node home-chapter-label__node--a">
        <g className="home-chapter-label__breath home-chapter-label__breath--a">
          <circle cx="52" cy="48" r="1.5" fill="currentColor" />
        </g>
      </g>
      <g className="home-chapter-label__node home-chapter-label__node--b">
        <g className="home-chapter-label__breath home-chapter-label__breath--b">
          <polygon points={hexPoints(140, 62, 6)} fill="currentColor" opacity="0.36" />
          <circle
            className="home-chapter-label__dash"
            cx="140"
            cy="62"
            r="9"
            stroke="currentColor"
            strokeWidth="0.45"
            strokeDasharray="1.7 2.8"
          />
        </g>
      </g>
      <g className="home-chapter-label__node home-chapter-label__node--c">
        <g className="home-chapter-label__breath home-chapter-label__breath--c">
          <circle cx="198" cy="44" r="1.15" fill="currentColor" />
          <circle cx="198" cy="44" r="3.4" stroke="currentColor" strokeWidth="0.45" />
        </g>
      </g>
      <g className="home-chapter-label__node home-chapter-label__node--d">
        <g className="home-chapter-label__breath home-chapter-label__breath--d">
          <circle cx="246" cy="52" r="1.3" fill="currentColor" />
        </g>
      </g>
    </>
  );
}

const FIELD_DRAW = {
  studies: FieldStudies,
  team: FieldTeam,
  about: FieldAbout,
} as const;

/** Section index — crop-mark frame, quiet sky-banner constellation, body type. Not a control. */
export default function HomeChapterLabel({
  id,
  field,
  children,
  kicker,
  quiet = false,
  highlighted = false,
  tocOpen = false,
  toc,
}: HomeChapterLabelProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const motion = useRef({
    tx: 0,
    ty: 0,
    th: 0,
    cx: 0,
    cy: 0,
    ch: 0,
    vx: 0,
    vy: 0,
    vh: 0,
    px: 140,
    py: 48,
    pvx: 0,
    pvy: 0,
    tpx: 140,
    tpy: 48,
    armed: false,
    pulling: false,
    pointerId: -1,
    originX: 0,
    originY: 0,
    hasTip: false,
    tipX: 0,
    tipY: 0,
    tbx: 0,
    tby: 0,
    bx: 0,
    by: 0,
    bvx: 0,
    bvy: 0,
    raf: 0,
    run: false,
  });
  const Draw = FIELD_DRAW[field];
  const showToc = Boolean(tocOpen && toc && toc.length > 0);

  const scrollToTarget = (targetId: string) => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const stop = () => {
    const el = rootRef.current;
    const m = motion.current;
    if (m.raf) window.cancelAnimationFrame(m.raf);
    m.raf = 0;
    m.run = false;
    m.tx = 0;
    m.ty = 0;
    m.th = 0;
    m.cx = 0;
    m.cy = 0;
    m.ch = 0;
    m.vx = 0;
    m.vy = 0;
    m.vh = 0;
    m.px = 140;
    m.py = 48;
    m.pvx = 0;
    m.pvy = 0;
    m.tpx = 140;
    m.tpy = 48;
    m.armed = false;
    m.pulling = false;
    m.pointerId = -1;
    m.hasTip = false;
    m.tipX = 0;
    m.tipY = 0;
    m.tbx = 0;
    m.tby = 0;
    m.bx = 0;
    m.by = 0;
    m.bvx = 0;
    m.bvy = 0;
    if (!el) return;
    el.classList.remove('home-chapter-label--pulling');
    el.style.setProperty('--marker-mx', '0');
    el.style.setProperty('--marker-my', '0');
    el.style.setProperty('--marker-hot', '0');
    paintBends(el, 140, 48, 0, 0, 0);
  };

  const tick = () => {
    const el = rootRef.current;
    const m = motion.current;
    if (!el) {
      m.run = false;
      m.raf = 0;
      return;
    }
    const k = 0.9;
    const damp = 0.55;
    [m.cx, m.vx] = spring(m.cx, m.vx, m.tx, k, damp);
    [m.cy, m.vy] = spring(m.cy, m.vy, m.ty, k, damp);
    [m.ch, m.vh] = spring(m.ch, m.vh, m.th, k, damp);
    [m.px, m.pvx] = spring(m.px, m.pvx, m.tpx, k, damp);
    [m.py, m.pvy] = spring(m.py, m.pvy, m.tpy, k, damp);
    [m.bx, m.bvx] = bandSpring(m.bx, m.bvx, m.tbx, m.pulling, true);
    [m.by, m.bvy] = bandSpring(m.by, m.bvy, m.tby, m.pulling, false);
    el.style.setProperty('--marker-mx', m.cx.toFixed(3));
    el.style.setProperty('--marker-my', m.cy.toFixed(3));
    el.style.setProperty('--marker-hot', m.ch.toFixed(3));
    const band = BAND_BY_FIELD[field];
    const pull: BandPull | null =
      m.hasTip && (m.pulling || Math.hypot(m.bx, m.by) > 0.15)
        ? { dx: m.bx, dy: m.by, left: band.left, right: band.right }
        : null;
    if (m.pulling) paintBends(el, 140, 48, 0, 0, 0, pull);
    else paintBends(el, m.px, m.py, m.cx, m.cy, m.ch, pull);
    const bandHome =
      Math.abs(m.tbx - m.bx) < 0.04 &&
      Math.abs(m.tby - m.by) < 0.04 &&
      Math.abs(m.bvx) < 0.04 &&
      Math.abs(m.bvy) < 0.04;
    const settling =
      Math.abs(m.tx - m.cx) < 0.004 &&
      Math.abs(m.ty - m.cy) < 0.004 &&
      Math.abs(m.th - m.ch) < 0.004 &&
      Math.abs(m.vx) < 0.004 &&
      Math.abs(m.vy) < 0.004 &&
      Math.abs(m.vh) < 0.004 &&
      Math.abs(m.tpx - m.px) < 0.05 &&
      Math.abs(m.tpy - m.py) < 0.05 &&
      bandHome;
    if (settling && m.th === 0 && !m.pulling) {
      paintBends(el, m.px, m.py, 0, 0, 0);
      m.run = false;
      m.raf = 0;
      return;
    }
    m.raf = window.requestAnimationFrame(tick);
  };

  const kick = () => {
    if (motion.current.run) return;
    motion.current.run = true;
    motion.current.raf = window.requestAnimationFrame(tick);
  };

  const canBand = !quiet;

  const trackHover = (marker: HTMLDivElement, clientX: number, clientY: number) => {
    const rect = marker.getBoundingClientRect();
    const svg = marker.querySelector('svg');
    const sky = svg?.getBoundingClientRect();
    const left = Math.min(rect.left, sky && sky.width > 1 ? sky.left : rect.left);
    const right = Math.max(rect.right, sky && sky.width > 1 ? sky.right : rect.right);
    const top = Math.min(rect.top, sky && sky.height > 1 ? sky.top : rect.top);
    const bottom = Math.max(rect.bottom, sky && sky.height > 1 ? sky.bottom : rect.bottom);
    const width = right - left;
    const height = bottom - top;
    if (width < 4 || height < 4) return;
    const m = motion.current;
    m.tx = Math.max(-1, Math.min(1, ((clientX - left) / width) * 2 - 1));
    m.ty = Math.max(-1, Math.min(1, ((clientY - top) / height) * 2 - 1));
    m.th = 1;
    if (svg && sky && sky.width > 1 && sky.height > 1) {
      m.tpx = ((clientX - sky.left) / sky.width) * 280;
      m.tpy = ((clientY - sky.top) / sky.height) * 96;
    }
    kick();
  };

  const endPull = (marker: HTMLDivElement, clientX: number, clientY: number, stayHover: boolean) => {
    const m = motion.current;
    m.armed = false;
    m.pulling = false;
    m.tbx = 0;
    m.tby = 0;
    rootRef.current?.classList.remove('home-chapter-label--pulling');
    if (marker.hasPointerCapture(m.pointerId)) marker.releasePointerCapture(m.pointerId);
    if (stayHover && clientOnSky(marker, clientX, clientY)) trackHover(marker, clientX, clientY);
    else {
      m.tx = 0;
      m.ty = 0;
      m.th = 0;
      kick();
    }
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!canBand || event.button !== 0) return;
    if (event.pointerType === 'touch') return;
    if (window.matchMedia(REDUCE_MOTION).matches) return;
    const m = motion.current;
    m.armed = true;
    m.pulling = false;
    m.pointerId = event.pointerId;
    m.originX = event.clientX;
    m.originY = event.clientY;
    m.hasTip = true;
    m.tipX = BAND_BY_FIELD[field].right;
    m.tipY = 48;
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* The pull still follows moves that stay on the marker. */
    }
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') return;
    if (window.matchMedia(REDUCE_MOTION).matches) return;
    const m = motion.current;
    if ((m.armed || m.pulling) && event.pointerId === m.pointerId) {
      const dist = Math.hypot(event.clientX - m.originX, event.clientY - m.originY);
      if (m.armed && dist >= PULL_SLOP) {
        m.armed = false;
        m.pulling = true;
        m.tx = 0;
        m.ty = 0;
        m.th = 0;
        rootRef.current?.classList.add('home-chapter-label--pulling');
        try {
          event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
          /* A press that is not a real pointer still stretches on later moves. */
        }
      }
      if (m.pulling) {
        const sky = event.currentTarget.querySelector('svg')?.getBoundingClientRect();
        const unit = sky && sky.width > 1 ? sky.width / 280 : 0.8;
        const dx = (event.clientX - m.originX) / unit;
        const dy = (event.clientY - m.originY) / unit;
        const max = PULL_CAP / unit;
        const mag = Math.hypot(dx, dy) || 1;
        const eased = smoothstep(Math.min(1, mag / max)) * max;
        const scale = eased / mag;
        m.tbx = dx * scale;
        m.tby = dy * scale;
        kick();
        return;
      }
    }
    trackHover(event.currentTarget, event.clientX, event.clientY);
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const m = motion.current;
    if (event.pointerId !== m.pointerId) return;
    if (!m.armed && !m.pulling && m.tbx === 0 && m.tby === 0) return;
    endPull(event.currentTarget, event.clientX, event.clientY, true);
  };

  const onPointerLeave = () => {
    if (motion.current.pulling || motion.current.armed) return;
    motion.current.armed = false;
    motion.current.tx = 0;
    motion.current.ty = 0;
    motion.current.th = 0;
    kick();
  };

  useEffect(() => () => stop(), []);

  return (
    <div
      id={id}
      ref={rootRef}
      className={[
        'home-chapter-label',
        `home-chapter-label--${field}`,
        quiet ? 'home-chapter-label--quiet' : '',
        highlighted ? 'home-chapter-label--highlighted' : '',
        showToc ? 'home-chapter-label--with-toc' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      data-highlighted={highlighted ? 'true' : undefined}
    >
      <div
        className="home-chapter-label__marker"
        onPointerMove={onPointerMove}
        onPointerEnter={onPointerMove}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerLeave}
        onPointerCancel={onPointerUp}
      >
        <span className="home-chapter-label__sky" aria-hidden>
          <svg
            className="home-chapter-label__constellation"
            viewBox="0 0 280 96"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Draw />
          </svg>
        </span>
        <span className="home-chapter-label__lockup">
          <span className="home-chapter-label__frame" aria-hidden>
            <span className="home-chapter-label__corner home-chapter-label__corner--tl" />
            {quiet ? null : <span className="home-chapter-label__corner home-chapter-label__corner--br" />}
          </span>
          <span className="home-chapter-label__text">
            <span className="home-chapter-label__title">{children}</span>
            {kicker ? <span className="home-chapter-label__kicker">{kicker}</span> : null}
          </span>
        </span>
      </div>

      {showToc ? (
        <nav className="home-chapter-label__toc" aria-label={`${children} contents`}>
          <span className="home-chapter-label__toc-rail" aria-hidden />
          <ol className="home-chapter-label__toc-list">
            {toc!.map((item, index) => (
              <li key={item.targetId} className="home-chapter-label__toc-item">
                <button
                  type="button"
                  className="home-chapter-label__toc-link"
                  onClick={() => scrollToTarget(item.targetId)}
                >
                  <span className="home-chapter-label__toc-index" aria-hidden>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="home-chapter-label__toc-label">{item.label}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}
    </div>
  );
}
