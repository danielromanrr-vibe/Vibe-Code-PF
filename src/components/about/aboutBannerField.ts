/**
 * About-only fork of the MandalaBanner "full Kandinsky mandala" field.
 * Same clusters, mid nodes, trails, entity reveals, pointer links, particles, and grain;
 * the banner's band repeats down tall fields at the footer banner's density and intensity, and
 * six first-band anchors are pinned to the desktop folders so they live inside the network.
 * Nodes ride springs: they lean toward a resting cursor, give way to a fast one, and ride press ripples.
 * The live sprite core moves them by the engine's own law, and its hold-to-bloom ties them into its orbit.
 * The homepage banner is untouched — keep this file in sync by hand if the banner changes.
 */

type Pt = { x: number; y: number };
type Rgb = readonly [number, number, number];

export type BannerFolderAnchor = { x: number; y: number; rgb: Rgb; active: boolean };

/** The live sprite core in field space; velocity in px/s, grab and press 0–1, nodes are its orbiting marks. */
export type BannerCore = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  grab: number;
  press: number;
  nodes: readonly Pt[];
};

const NUM_ANCHORS = 14;
const NUM_MIDS = 6;
const LAYERS_PER_ANCHOR = 5;
const NUM_PARTICLES = 64;
const PUSH_RADIUS = 120;
const CLUSTER_MAX_RADIUS_EST = 52;
const ACT_FACTOR = 0.72;
const ENTITY_REVEAL_RADIUS = 115;
const ENTITY_HOVER_THRESH = 0.18;
const CURSOR_LERP = 0.16;
const ENTITY_REVEAL_LERP = 0.1;
const PALETTE_SIZE = 48;
const DRAG_PULL_RADIUS = 240;
/** Same reach family as the sprite engine: far nodes lean in, near nodes give way. */
const LEAN_REACH = 380;
const LEAN_MAX = 16;
const GIVE_RADIUS = 130;
const GIVE_MAX = 30;
const SPRING = 0.11;
const DAMPING = 0.8;
const RIPPLE_SPEED = 520;
const RIPPLE_LIFE = 1.6;
const RIPPLE_BAND = 34;
const CURSOR_LINK_RADIUS = 210;
const FLASH_LIFE = 0.76;
/** First-band anchor slots that follow the folders; every other slot is a free Kandinsky cluster. */
const FOLDER_SLOTS = [0, 3, 5, 8, 10, 13] as const;
/** Footer and hero banners run at intensity 22: max(0.15, min(1.4, 0.22 / 0.72)). */
const PAINT_FACTOR = 0.22 / 0.72;
/** The footer banner fills a strip about this tall; taller fields repeat the band to keep its density. */
const BAND_H = 340;
/** At rest the field sits back like the footer banner; cursor heat and the folder wake lift it to full ink. */
const REST_INK = 0.5;
/** The sprite core shares the engine's law: a repulsive disc, a swirling ring, and a hold that gathers then blooms. */
const CORE_PUSH = 40;
const CORE_SWIRL = 9;
const CORE_GATHER = 22;
const CORE_BLOOM = 56;
const CORE_LINKS = 16;

const EDITORIAL_ACCENT_POOL = [
  'rgb(42, 88, 132)', 'rgb(56, 102, 128)', 'rgb(72, 118, 138)', 'rgb(52, 122, 118)',
  'rgb(88, 108, 92)', 'rgb(108, 92, 72)', 'rgb(128, 88, 68)', 'rgb(118, 72, 78)',
  'rgb(108, 68, 98)', 'rgb(88, 72, 118)', 'rgb(72, 82, 128)', 'rgb(68, 96, 118)',
  'rgb(118, 98, 58)', 'rgb(98, 118, 72)', 'rgb(58, 108, 108)', 'rgb(78, 118, 108)',
  'rgb(98, 78, 108)', 'rgb(118, 82, 92)', 'rgb(92, 108, 118)', 'rgb(118, 108, 72)',
  'rgb(82, 118, 98)', 'rgb(108, 82, 118)', 'rgb(72, 108, 128)', 'rgb(128, 92, 82)',
  'rgb(92, 72, 88)', 'rgb(118, 72, 58)', 'rgb(58, 92, 118)', 'rgb(88, 118, 118)',
  'rgb(108, 72, 108)', 'rgb(72, 118, 88)', 'rgb(118, 92, 72)', 'rgb(82, 72, 108)',
  'rgb(98, 92, 118)', 'rgb(118, 72, 108)', 'rgb(72, 98, 118)', 'rgb(108, 118, 92)',
  'rgb(92, 118, 108)', 'rgb(118, 78, 82)', 'rgb(78, 108, 118)', 'rgb(108, 98, 118)',
  'rgb(88, 98, 118)', 'rgb(118, 88, 72)', 'rgb(72, 118, 118)', 'rgb(98, 108, 88)',
  'rgb(108, 72, 92)', 'rgb(82, 118, 118)',
] as const;

const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

function buildPalette(): Rgb[] {
  const a = [...EDITORIAL_ACCENT_POOL];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return Array.from({ length: PALETTE_SIZE }, (_, i) => {
    const m = a[i % a.length]!.match(/\d+/g)!.map(Number);
    const drift = ((i * 17) % 11) - 5;
    const c = (v: number) => Math.max(38, Math.min(142, v + drift));
    return [c(m[0]!), c(m[1]!), c(m[2]!)] as const;
  });
}

type Body = { ox: number; oy: number; vx: number; vy: number };
type Ripple = { x: number; y: number; age: number };
type Flash = { x: number; y: number; age: number; rgb: Rgb };

export type BannerFieldState = {
  t: number;
  rot: number;
  hf: number;
  mouse: Pt;
  lastRaw: Pt | null;
  /** 0–1 pointer speed; a fast pass scatters the field, a resting cursor gathers it. */
  speed: number;
  palette: Rgb[];
  anchorDisplay: Pt[];
  midDisplay: Pt[];
  reveal: number[];
  anchorBodies: Body[];
  midBodies: Body[];
  particleBodies: Body[];
  ripples: Ripple[];
  flashes: Flash[];
  folderLinks: Set<string> | null;
};

const body = (): Body => ({ ox: 0, oy: 0, vx: 0, vy: 0 });
const grow = (list: Body[], n: number) => {
  while (list.length < n) list.push(body());
};

export function createBannerFieldState(): BannerFieldState {
  return {
    t: 0,
    rot: 0,
    hf: 0,
    mouse: { x: -9999, y: -9999 },
    lastRaw: null,
    speed: 0,
    palette: buildPalette(),
    anchorDisplay: [],
    midDisplay: [],
    reveal: [],
    anchorBodies: [],
    midBodies: [],
    particleBodies: [],
    ripples: [],
    flashes: [],
    folderLinks: null,
  };
}

/** A press on open desktop sends a ring through the field. */
export function addBannerRipple(s: BannerFieldState, x: number, y: number) {
  s.ripples.push({ x, y, age: 0 });
  if (s.ripples.length > 4) s.ripples.shift();
}

export type BannerFieldOptions = {
  w: number;
  h: number;
  /** Seconds since the last frame; 0 draws a still frame. */
  dt: number;
  pointer: Pt | null;
  folders: readonly BannerFolderAnchor[];
  /** Index into `folders` of the folder being dragged, or -1. */
  dragIndex: number;
  eco: boolean;
  core?: BannerCore | null;
};

const smoothstep = (e0: number, e1: number, x: number) => {
  const k = Math.max(0, Math.min(1, (x - e0) / (e1 - e0 || 1)));
  return k * k * (3 - 2 * k);
};

export function drawBannerField(ctx: CanvasRenderingContext2D, s: BannerFieldState, o: BannerFieldOptions) {
  const { w: wCss, h: hCss, dt, pointer, folders, dragIndex, eco } = o;
  const core = o.core ?? null;
  const bands = Math.max(1, Math.round(hCss / BAND_H));
  const bandH = hCss / bands;
  const numAnchors = bands * NUM_ANCHORS;
  const numMids = bands * NUM_MIDS;
  const numParticles = bands * (eco ? 36 : NUM_PARTICLES);
  const numGrain = bands * (eco ? 100 : 180);
  grow(s.anchorBodies, numAnchors);
  grow(s.midBodies, numMids);
  grow(s.particleBodies, numParticles);
  while (s.reveal.length < numAnchors + numMids) s.reveal.push(0);
  if (s.reveal.length > numAnchors + numMids) s.reveal.length = numAnchors + numMids;
  const ink = (near: number) => lerp(REST_INK, 1, Math.min(1, near));
  const maxMouseSegments = eco ? 12 : 20;
  const interactive = pointer != null;
  const still = dt === 0;
  const dragged = dragIndex >= 0 ? folders[dragIndex] : undefined;
  const dragPoint = dragged ? { x: dragged.x, y: dragged.y } : null;

  const rawMouse = pointer ?? { x: wCss / 2, y: hCss / 2 };
  if (s.mouse.x < -9000 || still) s.mouse = { ...rawMouse };
  s.mouse.x = lerp(s.mouse.x, rawMouse.x, CURSOR_LERP);
  s.mouse.y = lerp(s.mouse.y, rawMouse.y, CURSOR_LERP);
  const mx = s.mouse.x;
  const my = s.mouse.y;

  if (pointer && s.lastRaw && dt > 0) {
    const pxPerSec = Math.hypot(pointer.x - s.lastRaw.x, pointer.y - s.lastRaw.y) / dt;
    s.speed = lerp(s.speed, Math.min(1, pxPerSec / 1400), 0.18);
  } else {
    s.speed = lerp(s.speed, 0, 0.1);
  }
  s.lastRaw = pointer ? { ...pointer } : null;
  const speed = s.speed;
  const rest = 1 - speed;

  s.hf = lerp(s.hf, interactive ? 1 : 0, interactive ? 0.08 : 0.06);
  const hf = s.hf;
  const paintFactor = PAINT_FACTOR;
  const t = s.t;
  const actFactor = ACT_FACTOR * paintFactor;
  s.t += (0.35 + hf * 0.25 + speed * 0.3) * dt;
  s.rot += (0.25 + hf * 0.15 + speed * 0.2) * dt;

  for (const r of s.ripples) r.age += dt;
  s.ripples = s.ripples.filter((r) => r.age < RIPPLE_LIFE);
  const rippleAt = (x: number, y: number) => {
    let fx = 0;
    let fy = 0;
    let band = 0;
    for (const r of s.ripples) {
      const dx = x - r.x;
      const dy = y - r.y;
      const dist = Math.hypot(dx, dy) || 1;
      const front = r.age * RIPPLE_SPEED;
      const b = Math.exp(-(((dist - front) / RIPPLE_BAND) ** 2)) * (1 - r.age / RIPPLE_LIFE);
      band = Math.max(band, b);
      fx += (dx / dist) * b * 34;
      fy += (dy / dist) * b * 34;
    }
    return { fx, fy, band };
  };

  const coreSpeed = core ? Math.min(1, Math.hypot(core.vx, core.vy) / 1400) : 0;
  const coreClear = core ? core.r * 1.1 + 28 : 0;
  const coreForce = (x: number, y: number): Pt => {
    if (!core) return { x: 0, y: 0 };
    const dx = x - core.x;
    const dy = y - core.y;
    const dist = Math.hypot(dx, dy) || 1;
    const reach = coreClear * (2.4 + core.press * 1.2);
    if (dist > reach) return { x: 0, y: 0 };
    const nx = dx / dist;
    const ny = dy / dist;
    const push = dist < coreClear ? (1 - dist / coreClear) ** 1.2 * CORE_PUSH * (1 + coreSpeed * 1.6) : 0;
    const ring = Math.exp(-(((dist - coreClear * 1.5) / (coreClear * 0.55)) ** 2));
    const swirl = ring * CORE_SWIRL * (1 + core.grab * 0.5 + core.press);
    const p = core.press;
    const bloom = (p * p * CORE_BLOOM - p * (1 - p) * 4 * CORE_GATHER) * (1 - dist / reach);
    return { x: nx * (push + bloom) - ny * swirl, y: ny * (push + bloom) + nx * swirl };
  };

  /** Cursor heat: the field warms with hover; the full heat stays with the pointer. A held or blooming core warms its reach. */
  const heat = (x: number, y: number) => {
    const cursor = interactive
      ? hf * (1 - smoothstep(ENTITY_REVEAL_RADIUS * 0.25, ENTITY_REVEAL_RADIUS * 1.7, Math.hypot(x - mx, y - my)))
      : 0;
    if (!core) return cursor;
    const lift = core.grab * 0.35 + core.press * 0.65;
    if (lift < 0.01) return cursor;
    const dist = Math.hypot(x - core.x, y - core.y);
    return Math.max(cursor, lift * (1 - smoothstep(core.r * 0.6, core.r + 140 + core.press * 240, dist)));
  };

  const cx0 = wCss / 2;
  const cy0 = hCss / 2;
  const d = Math.min(Math.hypot(mx - cx0, my - cy0) / Math.max(wCss, hCss, 80), 1);
  const size = 42;
  const clusterScale = Math.min(1.25, (Math.min(wCss, hCss) * 0.58) / CLUSTER_MAX_RADIUS_EST);
  const heartbeat = Math.pow(Math.sin(t * 0.8), 6) * (8 + hf * 5);
  const waveX = Math.sin(t * 1.2) * (6 + actFactor * 8);
  const waveY = Math.cos(t * 1.0) * (6 + actFactor * 8);

  /**
   * Spring each body toward a target offset: lean toward a resting cursor from afar,
   * give way up close (harder on a fast pass), ride ripples, and gather toward a dragged folder.
   */
  const settle = (b: Body, base: Pt, gain: number, dragPull: number) => {
    if (still) {
      b.ox = b.oy = b.vx = b.vy = 0;
      return { x: base.x, y: base.y };
    }
    let tx = 0;
    let ty = 0;
    if (interactive) {
      const dx = mx - base.x;
      const dy = my - base.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 2 && dist < LEAN_REACH) {
        const nx = dx / dist;
        const ny = dy / dist;
        const lean = smoothstep(LEAN_REACH, GIVE_RADIUS * 1.1, dist) * LEAN_MAX * rest;
        const give = dist < GIVE_RADIUS ? (1 - dist / GIVE_RADIUS) ** 1.4 * GIVE_MAX * (1 + speed * 1.6) : 0;
        tx += nx * (lean - give) * gain;
        ty += ny * (lean - give) * gain;
      }
    }
    const rp = rippleAt(base.x, base.y);
    tx += rp.fx * gain;
    ty += rp.fy * gain;
    if (dragPoint && dragPull > 0) {
      const dx = dragPoint.x - base.x;
      const dy = dragPoint.y - base.y;
      const dist = Math.hypot(dx, dy);
      if (dist < DRAG_PULL_RADIUS) {
        const k = (1 - dist / DRAG_PULL_RADIUS) * dragPull;
        tx += dx * k;
        ty += dy * k;
      }
    }
    if (core) {
      const cf = coreForce(base.x, base.y);
      tx += cf.x * gain;
      ty += cf.y * gain;
    }
    const step = Math.min(2, dt * 60);
    b.vx = (b.vx + (tx - b.ox) * SPRING * step) * Math.pow(DAMPING, step);
    b.vy = (b.vy + (ty - b.oy) * SPRING * step) * Math.pow(DAMPING, step);
    b.ox += b.vx * step;
    b.oy += b.vy * step;
    return { x: base.x + b.ox, y: base.y + b.oy };
  };

  const folderBySlot = new Map<number, BannerFolderAnchor>();
  const slotByFolder: number[] = [];
  FOLDER_SLOTS.forEach((slot, i) => {
    const f = folders[i];
    if (f) {
      folderBySlot.set(slot, f);
      slotByFolder[i] = slot;
    }
  });

  // Each band is the banner's own layout; later bands shift their phase so they don't repeat.
  const anchorPositions: Pt[] = [];
  const freeSlots: number[] = [];
  for (let g = 0; g < numAnchors; g++) {
    const f = folderBySlot.get(g);
    if (f) {
      anchorPositions.push({ x: f.x, y: f.y });
      continue;
    }
    freeSlots.push(g);
    const band = Math.floor(g / NUM_ANCHORS);
    const local = g % NUM_ANCHORS;
    const a = local + band * 5.3;
    const k = local / (NUM_ANCHORS - 1);
    const offX = Math.sin(a * 2.4) * 0.08 + Math.cos(t * 0.2 + a) * 0.04;
    const offY = Math.cos(a * 1.9) * 0.1 + Math.sin(t * 0.15 + a * 0.7) * 0.06;
    const base = {
      x: wCss * (0.08 + k * 0.84 + offX) + waveX + Math.sin(t * 0.35 + a * 0.9) * 6,
      y: band * bandH + bandH * (0.15 + (Math.sin(a * 1.3) * 0.5 + 0.5) * 0.7 + offY) + waveY + heartbeat,
    };
    anchorPositions.push(settle(s.anchorBodies[g]!, base, 1, 0.18));
  }
  s.anchorDisplay = anchorPositions.map((p) => ({ ...p }));

  const midNodes: Pt[] = [];
  for (let m = 0; m < numMids; m++) {
    const band = Math.floor(m / NUM_MIDS);
    const local = m % NUM_MIDS;
    const phase = m + band * 2.9;
    const base = {
      x: wCss * (0.22 + (local / 5) * 0.56) + Math.sin(t * 0.42 + phase * 1.7) * 10,
      y: band * bandH + bandH * (0.5 + Math.sin(t * 0.33 + phase * 1.1) * 0.18) + Math.cos(t * 0.38 + phase * 1.3) * 10,
    };
    midNodes.push(settle(s.midBodies[m]!, base, 0.75, 0.12));
  }
  s.midDisplay = midNodes.map((p) => ({ ...p }));

  // Neighbour graph: each anchor to its three nearest, shared by trails and the hover wake.
  const neighbours: number[][] = anchorPositions.map((a, i) =>
    anchorPositions
      .map((b, j) => ({ j, d: Math.hypot(a.x - b.x, a.y - b.y) }))
      .filter((n) => n.j !== i)
      .sort((p, q) => p.d - q.d)
      .slice(0, 3)
      .map((n) => n.j),
  );
  const wake = new Array<number>(numAnchors).fill(0);
  for (let a = 0; a < numAnchors; a++) {
    if (!folderBySlot.get(a)?.active) continue;
    wake[a] = 1;
    for (const j of neighbours[a]!) wake[j] = Math.max(wake[j]!, 0.7);
  }

  const revealFor = (p: Pt, forced: number) => {
    const near = interactive && hf > ENTITY_HOVER_THRESH && Math.hypot(p.x - mx, p.y - my) < ENTITY_REVEAL_RADIUS * (1 + rest * 0.25);
    const rippled = rippleAt(p.x, p.y).band > 0.35;
    return Math.max(forced, near || rippled ? 1 : 0);
  };
  for (let a = 0; a < numAnchors; a++) {
    const target = revealFor(anchorPositions[a]!, wake[a]!);
    s.reveal[a] = still ? target : lerp(s.reveal[a]!, target, ENTITY_REVEAL_LERP);
  }
  for (let m = 0; m < numMids; m++) {
    const target = revealFor(midNodes[m]!, 0);
    s.reveal[numAnchors + m] = still ? target : lerp(s.reveal[numAnchors + m]!, target, ENTITY_REVEAL_LERP);
  }

  const charcoal = { r: 12, g: 21, b: 40 };
  const rgbFor = (idx: number): Rgb => {
    if (idx < numAnchors) {
      const f = folderBySlot.get(idx);
      if (f) return f.rgb;
    }
    return s.palette[idx % s.palette.length]!;
  };
  const mix = (rgb: Rgb, f: number) =>
    `rgb(${Math.round(lerp(charcoal.r, rgb[0], f))},${Math.round(lerp(charcoal.g, rgb[1], f))},${Math.round(lerp(charcoal.b, rgb[2], f))})`;
  const nodeColorFactor = Math.min(1, 0.66 + hf * 0.2 + paintFactor * 0.08);
  const strokeForAnchor = (idx: number) => mix(rgbFor(idx), nodeColorFactor);
  const strokeBlend = (i: number, j: number) => {
    const a = rgbFor(i);
    const b = rgbFor(j);
    const f = Math.min(1, 0.52 + hf * 0.22 + paintFactor * 0.1);
    return mix([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2], f);
  };

  const strokePoly = (cx: number, cy: number, radius: number, sides: number, rot: number, sx = 1, sy = 1) => {
    ctx.beginPath();
    for (let k = 0; k <= sides; k++) {
      const angle = (k / sides) * Math.PI * 2 + rot;
      const vx = cx + Math.cos(angle) * radius * sx;
      const vy = cy + Math.sin(angle) * radius * sy;
      if (k === 0) ctx.moveTo(vx, vy);
      else ctx.lineTo(vx, vy);
    }
    ctx.stroke();
  };
  const strokeBar = (cx: number, cy: number, len: number, rot: number) => {
    const c = Math.cos(rot);
    const sn = Math.sin(rot);
    ctx.beginPath();
    ctx.moveTo(cx - c * len, cy - sn * len);
    ctx.lineTo(cx + c * len, cy + sn * len);
    ctx.stroke();
  };
  const strokeWedge = (cx: number, cy: number, radius: number, rot: number) => {
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, rot, rot + Math.PI * 0.4);
    ctx.closePath();
    ctx.stroke();
  };
  const strokeLadder = (cx: number, cy: number, radius: number, rot: number) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    const span = radius * 0.82;
    const gap = radius * 0.26;
    for (let rung = -1; rung <= 1; rung++) {
      ctx.beginPath();
      ctx.moveTo(-span, rung * gap);
      ctx.lineTo(span * 0.7, rung * gap);
      ctx.stroke();
    }
    ctx.restore();
  };
  const strokeChecker = (cx: number, cy: number, radius: number, rot: number) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    const cell = radius * 0.36;
    ctx.beginPath();
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 2; col++) ctx.rect((col - 1) * cell, (row - 1) * cell, cell, cell);
    }
    ctx.stroke();
    ctx.restore();
  };
  const hexRing = (ax: number, ay: number, r: number, rot: number) => {
    ctx.beginPath();
    for (let k = 0; k <= 6; k++) {
      const angle = (k / 6) * Math.PI * 2 + rot;
      if (k === 0) ctx.moveTo(ax + Math.cos(angle) * r, ay + Math.sin(angle) * r);
      else ctx.lineTo(ax + Math.cos(angle) * r, ay + Math.sin(angle) * r);
    }
    ctx.stroke();
  };
  const rays = (ax: number, ay: number, baseR: number, rotMul: number, swayMul: number, lenA: number, lenB: number, lw: number) => {
    for (let k = 0; k < 12; k++) {
      const angle = (k / 12) * Math.PI * 2 + s.rot * rotMul + Math.sin(t * 0.7 + k * 0.5) * swayMul;
      const len = baseR * (lenA + lenB * (1 + Math.sin(t * 0.5 + k) * 0.4));
      ctx.lineWidth = lw;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(ax + Math.cos(angle) * len, ay + Math.sin(angle) * len);
      ctx.stroke();
    }
  };

  const anchorDisplay = s.anchorDisplay;
  const midDisplay = s.midDisplay;

  for (let a = 0; a < numAnchors; a++) {
    const ax = anchorDisplay[a]!.x;
    const ay = anchorDisplay[a]!.y;
    const phase = (a % NUM_ANCHORS) * 0.7;
    const anchorSizeScale = 0.82 + Math.sin(t * 0.35 + a) * 0.16;
    const revealFactor = s.reveal[a]!;
    const folder = folderBySlot.get(a);
    const near = Math.max(heat(ax, ay), wake[a]! * 0.6);
    const markInk = (folder ? 0.82 : 1) * (1 + near * 0.55) * ink(folder ? Math.max(near, 0.5) : near);

    if (revealFactor > 0.01) {
      const entityAlpha = (0.26 + 0.2 * revealFactor + paintFactor * 0.06) * revealFactor * (1 + near * 0.35);
      const baseR = (8 + phase) * (size / 50) * anchorSizeScale * clusterScale * (folder ? 1.5 : 1);
      const entityType = a % 4;
      ctx.strokeStyle = strokeForAnchor(a);
      ctx.globalAlpha = Math.min((folder ? 0.5 : 0.38) + near * 0.28, entityAlpha);
      ctx.setLineDash([]);
      if (entityType === 0) {
        const rot = s.rot * 0.012 + a * 0.45;
        const r = Math.max(2, baseR * 0.5 + Math.sin(t * 0.5 + phase) * 2);
        ctx.lineWidth = 0.65;
        ctx.beginPath();
        ctx.ellipse(ax, ay, r * 0.92, r * 0.62, rot, 0, Math.PI * 2);
        ctx.stroke();
        ctx.lineWidth = 0.55;
        strokePoly(ax, ay, baseR * 0.78, 3, rot + 0.7);
        strokeBar(ax, ay, baseR * 0.9, rot + 1.15);
        ctx.globalAlpha *= 0.8;
        strokeWedge(ax, ay, baseR * 0.46, rot + 2.1);
      } else if (entityType === 1) {
        const r1 = baseR * 0.4;
        const r2 = baseR * 0.72;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(ax, ay, r1, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([2, 4]);
        ctx.beginPath();
        ctx.arc(ax, ay, r2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        strokePoly(ax, ay, baseR * 0.9, 3, s.rot * 0.02 + a);
        const satAngle = t * 1.2 + a;
        ctx.fillStyle = strokeForAnchor(a);
        ctx.globalAlpha = entityAlpha * 0.9;
        ctx.beginPath();
        ctx.arc(ax + Math.cos(satAngle) * r2 * 1.15, ay + Math.sin(satAngle) * r2 * 1.15, 1.5, 0, Math.PI * 2);
        ctx.fill();
      } else if (entityType === 2) {
        const breath = 0.92 + Math.cos(t * 0.4 + a) * 0.08;
        const rOut = baseR * 0.7 * breath;
        ctx.lineWidth = 0.55;
        hexRing(ax, ay, rOut, s.rot * 0.02 + a * 0.2);
        ctx.setLineDash([2, 5]);
        ctx.lineWidth = 0.4;
        hexRing(ax, ay, rOut * 0.7, -s.rot * 0.025 - a * 0.15);
        ctx.setLineDash([]);
      } else {
        rays(ax, ay, baseR, 0.015, 0.12, 0.5, 0.35, 0.45);
      }
      ctx.globalAlpha = 1;
    }

    if (revealFactor < 0.99) {
      const clusterAlphaScale = 1 - revealFactor;
      for (let li = 0; li < LAYERS_PER_ANCHOR; li++) {
        const i = a * LAYERS_PER_ANCHOR + li;
        const driftSeed = i * 133.7;
        const driftMag = (8 + actFactor * 14 + hf * 6) * (li / LAYERS_PER_ANCHOR);
        const lcx = ax + (Math.sin(t * 0.14 + driftSeed) + Math.sin(t * 0.3 + i)) * driftMag + (Math.sin(t * 0.25 + i * 2.1) * 0.8 - 0.4);
        const lcy = ay + (Math.cos(t * 0.2 - driftSeed) + Math.cos(t * 0.12 + i)) * driftMag + (Math.cos(t * 0.18 + i * 1.7) * 0.8 - 0.4);
        const stretchX = 1 + Math.sin(t * 0.06 + i * 1.8) * (0.22 + ACT_FACTOR * 0.28);
        const stretchY = 1 + Math.cos(t * 0.1 + i * 1.3) * (0.22 + ACT_FACTOR * 0.28);
        const depthScale = 1 - (li / LAYERS_PER_ANCHOR) * 0.32;
        const baseRadius = (5 + li * 6.5) * (size / 50) * depthScale * anchorSizeScale * (folder ? 1.35 : 1);
        const biologicalPulse = Math.sin(t * 0.55 + phase + li * 0.2) * Math.sin(t * 0.22 + li * 0.5);
        const oscAmp = (10 + actFactor * 18 + hf * 8) * (1 + d * 0.6);
        const radius = Math.max(0.1, baseRadius + biologicalPulse * oscAmp) * clusterScale;
        const rotationOffset = s.rot * (0.01 + li * 0.004) + (i * Math.PI) / 1.1;

        const accent = folder ? folder.rgb : s.palette[i % s.palette.length]!;
        ctx.strokeStyle = mix(accent, Math.min(1, 0.5 + hf * 0.28 + near * 0.3 + (folder?.active ? 0.2 : 0)));
        ctx.globalAlpha =
          markInk *
          clusterAlphaScale *
          (0.52 + hf * 0.12 + paintFactor * 0.09) *
          (1 - (li / LAYERS_PER_ANCHOR) * 0.32) *
          (0.92 + Math.sin(t * 0.4 + i * 0.5) * 0.08);
        const baseW = li % 3 === 0 ? 1.35 : 0.7;
        ctx.lineWidth = baseW * (0.85 + (Math.sin(t * 0.5 + i) * 0.5 + 0.5) * 0.4);

        if (i % 7 === 0) ctx.setLineDash([22, 12]);
        else if (i % 5 === 0) ctx.setLineDash([4, 8]);
        else if (i % 4 === 0) ctx.setLineDash([2, 6]);
        else if (i % 9 === 0) ctx.setLineDash([10, 4, 2, 4]);
        else ctx.setLineDash([]);

        const motif = i % 8;
        if (motif === 7) {
          ctx.beginPath();
          ctx.ellipse(lcx, lcy, radius * stretchX, radius * stretchY, rotationOffset, 0, Math.PI * 2);
          ctx.stroke();
        } else if (motif === 0) {
          ctx.beginPath();
          ctx.arc(lcx, lcy, radius, rotationOffset, rotationOffset + Math.PI * (0.38 + Math.sin(t * 0.2 + i) * 0.22));
          ctx.stroke();
        } else if (motif === 1) {
          ctx.save();
          ctx.globalAlpha *= 0.85;
          strokePoly(lcx, lcy, radius * 0.82, 3, rotationOffset, stretchX, stretchY);
          ctx.restore();
        } else if (motif === 2) {
          const crossSize = radius * 0.35 * (0.35 + hf * 0.4);
          ctx.save();
          ctx.globalAlpha *= 0.35;
          ctx.translate(lcx, lcy);
          ctx.rotate(rotationOffset);
          ctx.beginPath();
          ctx.moveTo(-crossSize, 0);
          ctx.lineTo(crossSize, 0);
          ctx.moveTo(0, -crossSize);
          ctx.lineTo(0, crossSize);
          ctx.stroke();
          ctx.restore();
        } else if (motif === 3) {
          ctx.save();
          ctx.globalAlpha *= 0.4;
          strokePoly(lcx, lcy, radius, i % 16 < 8 ? 6 : 4, rotationOffset, stretchX, stretchY);
          ctx.restore();
        } else if (motif === 4) {
          strokeBar(lcx, lcy, radius * 0.95, rotationOffset);
        } else if (motif === 5) {
          ctx.save();
          ctx.globalAlpha *= 0.7;
          strokeWedge(lcx, lcy, radius * 0.78, rotationOffset);
          ctx.restore();
        } else {
          strokeLadder(lcx, lcy, radius * 0.7, rotationOffset);
        }

        if (li === 2 && a % 3 === 0) {
          ctx.save();
          ctx.globalAlpha *= 0.4;
          ctx.setLineDash([2, 6]);
          strokeBar(lcx + radius * 0.35, lcy, radius * 0.42, rotationOffset + 0.4);
          ctx.restore();
        } else if (li === 4 && a % 4 === 1) {
          ctx.save();
          ctx.globalAlpha *= 0.35;
          strokeChecker(lcx, lcy, radius * 0.45, rotationOffset);
          ctx.restore();
        }
      }
    }
  }

  for (let m = 0; m < numMids; m++) {
    const ax = midDisplay[m]!.x;
    const ay = midDisplay[m]!.y;
    const revealFactorMid = s.reveal[numAnchors + m]!;
    const idx = numAnchors + m;
    const nearMid = heat(ax, ay);
    const markInkMid = (1 + nearMid * 0.55) * ink(nearMid);

    if (revealFactorMid > 0.01) {
      const entityAlphaMid = (0.22 + 0.16 * revealFactorMid + paintFactor * 0.04) * revealFactorMid * (1 + nearMid * 0.35);
      const baseR = 6 * (size / 50) * clusterScale;
      ctx.strokeStyle = strokeForAnchor(idx);
      ctx.globalAlpha = Math.min(0.32 + nearMid * 0.24, entityAlphaMid);
      ctx.setLineDash([]);
      if (m % 3 === 0) {
        ctx.lineWidth = 0.45;
        ctx.beginPath();
        ctx.arc(ax, ay, baseR * 0.45, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([2, 4]);
        strokePoly(ax, ay, baseR * 0.85, 3, s.rot * 0.02 + m);
        ctx.setLineDash([]);
        const satAngle = t * 1.1 + m * 2;
        ctx.fillStyle = strokeForAnchor(idx);
        ctx.globalAlpha = entityAlphaMid * 0.8;
        ctx.beginPath();
        ctx.arc(ax + Math.cos(satAngle) * baseR * 0.7, ay + Math.sin(satAngle) * baseR * 0.7, 1, 0, Math.PI * 2);
        ctx.fill();
      } else if (m % 3 === 1) {
        const rOut = baseR * 0.6 * (0.94 + Math.cos(t * 0.5 + m) * 0.06);
        ctx.lineWidth = 0.4;
        hexRing(ax, ay, rOut, s.rot * 0.018 + m * 0.3);
        ctx.setLineDash([1, 4]);
        ctx.lineWidth = 0.35;
        hexRing(ax, ay, rOut * 0.7, -s.rot * 0.02 - m * 0.25);
        ctx.setLineDash([]);
      } else {
        rays(ax, ay, baseR, 0.012, 0.1, 0.4, 0.3, 0.35);
      }
      ctx.globalAlpha = 1;
    }

    if (revealFactorMid < 0.99) {
      for (let li = 0; li < 2; li++) {
        const i = 100 + m * 5 + li;
        const rotationOffset = s.rot * (0.012 + li * 0.008) + (i * Math.PI) / 1.1;
        const stretch = 1 + Math.sin(t * 0.08 + i) * 0.12;
        const radius = Math.max(1, (7 + li * 7) * (size / 50) * clusterScale + Math.sin(t * 0.7 + m * 0.9 + li) * 6);
        ctx.strokeStyle = strokeForAnchor(idx);
        ctx.globalAlpha = markInkMid * (1 - revealFactorMid) * (0.28 + hf * 0.08 + paintFactor * 0.05);
        ctx.lineWidth = 0.55 + li * 0.15;
        ctx.setLineDash(li === 0 ? [2, 6] : []);
        const midMotif = (m + li) % 5;
        if (midMotif === 0) {
          ctx.beginPath();
          ctx.ellipse(ax, ay, radius * stretch, radius * (2 - stretch), rotationOffset, 0, Math.PI * 2);
          ctx.stroke();
        } else if (midMotif === 1) strokePoly(ax, ay, radius * 0.75, 3, rotationOffset);
        else if (midMotif === 2) strokeBar(ax, ay, radius * 0.85, rotationOffset);
        else if (midMotif === 3) strokeWedge(ax, ay, radius * 0.7, rotationOffset);
        else strokeLadder(ax, ay, radius * 0.62, rotationOffset);
      }
    }
  }
  ctx.setLineDash([]);

  // Trails: each anchor to its three nearest anchors, the banner's next / skip-one / skip-two tiers.
  const tiers = [
    { alpha: 0.16 + hf * 0.08, lw: 0.68, dash: [2, 5] },
    { alpha: 0.09 + hf * 0.05, lw: 0.52, dash: [3, 7] },
    { alpha: 0.06 + hf * 0.03, lw: 0.4, dash: [4, 10] },
  ];
  const trailSeen = new Set<string>();
  const trail = (i: number, j: number, alpha: number, lw: number, dash: number[], wobble: number, calm = true) => {
    const a = anchorDisplay[i]!;
    const b = anchorDisplay[j]!;
    const midX = (a.x + b.x) / 2 + Math.sin(t * 0.6 + i * 1.2 + j * 0.3) * wobble;
    const midY = (a.y + b.y) / 2 + Math.cos(t * 0.5 + i * 0.9 + j * 0.2) * wobble;
    const warm = Math.max(heat(midX, midY), (wake[i]! + wake[j]!) * 0.5);
    ctx.strokeStyle = strokeBlend(i, j);
    ctx.setLineDash(dash);
    ctx.lineDashOffset = -t * (4 + warm * 10);
    ctx.lineWidth = lw * (1 + warm * 0.6);
    ctx.globalAlpha = Math.min(0.62, alpha * (1 + warm * 1.6) * (calm ? ink(warm) : 1));
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(midX, midY);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    return { x: midX, y: midY };
  };
  for (let i = 0; i < numAnchors; i++) {
    neighbours[i]!.forEach((j, tier) => {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (trailSeen.has(key)) return;
      trailSeen.add(key);
      const spec = tiers[tier]!;
      trail(i, j, spec.alpha, spec.lw, spec.dash, 8);
    });
  }

  // Folder links: folders within reach of each other stay tied; a new tie made by dragging flashes.
  const reach = Math.min(wCss, hCss) * 0.52;
  const folderLinks = new Set<string>();
  for (let fi = 0; fi < folders.length; fi++) {
    for (let fj = fi + 1; fj < folders.length; fj++) {
      const i = slotByFolder[fi];
      const j = slotByFolder[fj];
      if (i == null || j == null) continue;
      const a = anchorDisplay[i]!;
      const b = anchorDisplay[j]!;
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist > reach) continue;
      const key = `${fi}-${fj}`;
      folderLinks.add(key);
      const mid = trail(i, j, 0.08 + (1 - dist / reach) * 0.24, 0.7, [3, 6], 6, false);
      if (dragIndex >= 0 && (fi === dragIndex || fj === dragIndex) && s.folderLinks && !s.folderLinks.has(key)) {
        s.flashes.push({ x: mid.x, y: mid.y, age: 0, rgb: folders[dragIndex]!.rgb });
      }
    }
  }
  s.folderLinks = folderLinks;
  ctx.lineDashOffset = 0;

  ctx.setLineDash([1, 7]);
  ctx.lineWidth = 0.46;
  for (let m = 0; m < midDisplay.length; m++) {
    const a = midDisplay[m]!;
    let bi = freeSlots[0]!;
    let best = Infinity;
    for (const g of freeSlots) {
      const p = anchorDisplay[g]!;
      const dd = (p.x - a.x) ** 2 + (p.y - a.y) ** 2;
      if (dd < best) {
        best = dd;
        bi = g;
      }
    }
    const b = anchorDisplay[bi]!;
    const warm = heat(a.x, a.y);
    ctx.globalAlpha = (0.09 + hf * 0.05) * (1 + warm * 1.4) * ink(warm);
    ctx.strokeStyle = strokeBlend(numAnchors + m, bi);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo((a.x + b.x) / 2 + Math.sin(t * 0.5 + m) * 10, (a.y + b.y) / 2 + Math.cos(t * 0.45 + m) * 10);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  // Constellation state: while the core blooms, nearby nodes tie into its orbiting marks; release lets them go.
  if (core && core.press > 0.04) {
    const p = core.press;
    const linkReach = core.r + 120 + p * 240;
    const targets = core.nodes.length > 0 ? core.nodes : [{ x: core.x, y: core.y }];
    const near = [...anchorDisplay, ...midDisplay]
      .map((q, i) => ({ i, x: q.x, y: q.y, d: Math.hypot(q.x - core.x, q.y - core.y) }))
      .filter((n) => n.d < linkReach && n.d > core.r * 0.5)
      .sort((a, b) => a.d - b.d)
      .slice(0, CORE_LINKS);
    ctx.setLineDash([2, 5]);
    ctx.lineDashOffset = -t * (10 + p * 24);
    near.forEach((n, k) => {
      let to = targets[0]!;
      let best = Infinity;
      for (const q of targets) {
        const dd = (q.x - n.x) ** 2 + (q.y - n.y) ** 2;
        if (dd < best) {
          best = dd;
          to = q;
        }
      }
      const falloff = 1 - n.d / linkReach;
      const len = Math.sqrt(best) || 1;
      const bow = (k % 2 === 0 ? 1 : -1) * 0.14 * len;
      const qx = (n.x + to.x) / 2 + (-(to.y - n.y) / len) * bow;
      const qy = (n.y + to.y) / 2 + ((to.x - n.x) / len) * bow;
      ctx.strokeStyle = strokeForAnchor(n.i);
      ctx.lineWidth = 0.6 + falloff * 0.7 * p;
      ctx.globalAlpha = Math.min(0.7, p * (0.22 + falloff * 0.5));
      ctx.beginPath();
      ctx.moveTo(n.x, n.y);
      ctx.quadraticCurveTo(qx, qy, to.x, to.y);
      ctx.stroke();
    });
    ctx.setLineDash([]);
    ctx.lineDashOffset = 0;
  }

  if (interactive) {
    const all = [...anchorDisplay, ...midDisplay];
    const zone = PUSH_RADIUS * (1.4 + rest * 0.4);
    const inZone = all
      .map((p, i) => ({ i, x: p.x, y: p.y, d: Math.hypot(p.x - mx, p.y - my) }))
      .filter((n) => n.d < zone)
      .sort((p, q) => p.d - q.d);
    const drawn = new Set<string>();
    let segments = 0;
    ctx.setLineDash([2, 4]);
    ctx.lineWidth = 0.64;
    for (const a of inZone) {
      if (segments >= maxMouseSegments) break;
      const others = inZone
        .filter((b) => b.i !== a.i)
        .map((b) => ({ ...b, d: Math.hypot(a.x - b.x, a.y - b.y) }))
        .sort((p, q) => p.d - q.d)
        .slice(0, 2);
      for (const b of others) {
        const key = a.i < b.i ? `${a.i}-${b.i}` : `${b.i}-${a.i}`;
        if (drawn.has(key)) continue;
        drawn.add(key);
        const falloff = 1 - a.d / zone;
        ctx.strokeStyle = strokeBlend(a.i, b.i);
        ctx.globalAlpha = (0.12 + falloff * 0.16 + hf * 0.06) * falloff;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        segments++;
        if (segments >= maxMouseSegments) break;
      }
    }

    // The cursor joins the network: a resting pointer ties itself to the nearest nodes.
    const linkR = CURSOR_LINK_RADIUS * (0.6 + rest * 0.4);
    ctx.setLineDash([2, 4]);
    ctx.lineDashOffset = -t * 12;
    inZone
      .filter((n) => n.d < linkR)
      .slice(0, 3)
      .forEach((n, k) => {
        const falloff = 1 - n.d / linkR;
        const bow = (k % 2 === 0 ? 1 : -1) * 0.12 * n.d;
        const qx = (mx + n.x) / 2 + (-(n.y - my) / (n.d || 1)) * bow;
        const qy = (my + n.y) / 2 + ((n.x - mx) / (n.d || 1)) * bow;
        ctx.strokeStyle = strokeForAnchor(n.i);
        ctx.lineWidth = 0.7 + falloff * 0.6;
        ctx.globalAlpha = Math.min(0.7, (0.2 + falloff * 0.5) * (0.4 + rest * 0.6) * hf);
        ctx.beginPath();
        ctx.moveTo(mx, my);
        ctx.quadraticCurveTo(qx, qy, n.x, n.y);
        ctx.stroke();
      });
    ctx.setLineDash([]);
    ctx.lineDashOffset = 0;
  }

  for (let p = 0; p < numParticles; p++) {
    const seedX = (Math.sin(p * 3.1) * 0.5 + 0.5) * wCss;
    const seedY = (Math.cos(p * 2.7) * 0.5 + 0.5) * hCss;
    const base = {
      x: (seedX + Math.sin(t * 0.4 + p * 0.6) * (14 + actFactor * 10) + wCss * 2) % wCss,
      y: (seedY + Math.cos(t * 0.35 + p * 0.5) * (14 + actFactor * 10) + hCss * 2) % hCss,
    };
    const pos = settle(s.particleBodies[p]!, base, 0.6, 0.35);
    const warm = heat(pos.x, pos.y);
    ctx.fillStyle = strokeForAnchor(p);
    ctx.globalAlpha = (0.24 + Math.sin(t * 0.5 + p * 0.3) * 0.09) * (1 + warm * 1.3) * ink(warm);
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, (1.2 + (Math.sin(p * 1.1) * 0.5 + 0.5) * 1.2) * (1 + warm * 0.35), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  for (const r of s.ripples) {
    const k = r.age / RIPPLE_LIFE;
    ctx.strokeStyle = `rgba(${charcoal.r}, ${charcoal.g}, ${charcoal.b}, ${(1 - k) * 0.24})`;
    ctx.lineWidth = 0.8;
    ctx.setLineDash([2, 6]);
    ctx.beginPath();
    ctx.arc(r.x, r.y, r.age * RIPPLE_SPEED, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  for (const f of s.flashes) f.age += dt;
  s.flashes = s.flashes.filter((f) => f.age < FLASH_LIFE);
  for (const f of s.flashes) {
    const k = f.age / FLASH_LIFE;
    ctx.globalAlpha = 1;
    ctx.strokeStyle = `rgba(${f.rgb[0]}, ${f.rgb[1]}, ${f.rgb[2]}, ${(1 - k) * 0.7})`;
    ctx.lineWidth = 1.2 * (1 - k) + 0.3;
    ctx.beginPath();
    ctx.arc(f.x, f.y, 4 + k * 22, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = `rgba(${f.rgb[0]}, ${f.rgb[1]}, ${f.rgb[2]}, ${(1 - k) * 0.5})`;
    ctx.beginPath();
    ctx.arc(f.x, f.y, 2.4, 0, Math.PI * 2);
    ctx.fill();
  }

  const aura = (p: Pt, idx: number, r1: number, r2: number, a1: number, a2: number) => {
    const rgb = rgbFor(idx);
    const c = (f: number) => [0, 1, 2].map((k) => Math.round(lerp([charcoal.r, charcoal.g, charcoal.b][k]!, rgb[k]!, f)));
    const [r, g, b] = c(nodeColorFactor);
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a1})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r1, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a2})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r2, 0, Math.PI * 2);
    ctx.fill();
  };
  for (const i of freeSlots) aura(anchorDisplay[i]!, i, 4, 2.5, 0.14, 0.095);
  midDisplay.forEach((p, m) => aura(p, numAnchors + m, 3.5, 2, 0.092, 0.065));

  ctx.lineWidth = 0.5;
  ctx.fillStyle = 'rgb(20,20,20)';
  const dot = (p: Pt, idx: number, r: number, base: number) => {
    const k = ink(heat(p.x, p.y));
    ctx.globalAlpha = k;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = Math.min(1, (base + hf * 0.22) * k);
    ctx.strokeStyle = strokeForAnchor(idx);
    ctx.stroke();
  };
  for (const i of freeSlots) dot(anchorDisplay[i]!, i, 1.1, 0.5);
  midDisplay.forEach((p, m) => dot(p, numAnchors + m, 1.05, 0.45));
  ctx.globalAlpha = 1;

  const grainA = (0.04 + Math.sin(t * 0.3) * 0.02) * (0.55 + paintFactor * 0.45) * REST_INK;
  ctx.fillStyle = `rgba(20,20,20,${grainA})`;
  for (let g = 0; g < numGrain; g++) {
    const px = ((Math.sin(g * 7.3 + t * 0.2) * 0.5 + 0.5) * wCss) % wCss;
    const py = ((Math.cos(g * 5.1 + t * 0.15) * 0.5 + 0.5) * hCss) % hCss;
    ctx.fillRect(px, py, 1, 1);
  }
}
