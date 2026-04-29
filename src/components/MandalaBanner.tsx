import { useEffect, useRef } from 'react';

/**
 * MandalaBanner — editorial sibling to Euphoria Mandala.
 * 16:9 frame: many nodes, mandala clusters, paths connecting them; mouse gently pushes entities away.
 * Scaled elements, stroke variation, charcoal/accent, breathing, grain.
 */

const NUM_ANCHORS = 14;
const LAYERS_PER_ANCHOR = 5;
const NUM_PARTICLES = 64;
const PUSH_RADIUS = 120;
const PUSH_STRENGTH = 24;
const CLUSTER_MAX_RADIUS_EST = 52;
const ACT_FACTOR = 0.72;
const ENTITY_REVEAL_RADIUS = 115;
const ENTITY_HOVER_THRESH = 0.18;

const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

/**
 * Curated accent pool: lively chroma, art-directed (mineral / ink / poster), not toy primaries.
 * Each paletteVersion reshuffles and samples so reveals feel fresh but always “selected.”
 */
const EDITORIAL_ACCENT_POOL = [
  'rgb(42, 88, 132)',
  'rgb(56, 102, 128)',
  'rgb(72, 118, 138)',
  'rgb(52, 122, 118)',
  'rgb(88, 108, 92)',
  'rgb(108, 92, 72)',
  'rgb(128, 88, 68)',
  'rgb(118, 72, 78)',
  'rgb(108, 68, 98)',
  'rgb(88, 72, 118)',
  'rgb(72, 82, 128)',
  'rgb(68, 96, 118)',
  'rgb(118, 98, 58)',
  'rgb(98, 118, 72)',
  'rgb(58, 108, 108)',
  'rgb(78, 118, 108)',
  'rgb(98, 78, 108)',
  'rgb(118, 82, 92)',
  'rgb(92, 108, 118)',
  'rgb(118, 108, 72)',
  'rgb(82, 118, 98)',
  'rgb(108, 82, 118)',
  'rgb(72, 108, 128)',
  'rgb(128, 92, 82)',
  'rgb(92, 72, 88)',
  'rgb(118, 72, 58)',
  'rgb(58, 92, 118)',
  'rgb(88, 118, 118)',
  'rgb(108, 72, 108)',
  'rgb(72, 118, 88)',
  'rgb(118, 92, 72)',
  'rgb(82, 72, 108)',
  'rgb(98, 92, 118)',
  'rgb(118, 72, 108)',
  'rgb(72, 98, 118)',
  'rgb(108, 118, 92)',
  'rgb(92, 118, 108)',
  'rgb(118, 78, 82)',
  'rgb(78, 108, 118)',
  'rgb(108, 98, 118)',
  'rgb(88, 98, 118)',
  'rgb(118, 88, 72)',
  'rgb(72, 118, 118)',
  'rgb(98, 108, 88)',
  'rgb(108, 72, 92)',
  'rgb(82, 118, 118)',
] as const;

const CURSOR_LERP = 0.16;
const NODE_POS_LERP = 0.22;
const ENTITY_REVEAL_LERP = 0.1;
/** Rich per-node hues on each paletteVersion bump (hero reveal, footer hover, etc.). */
const PALETTE_SIZE = 48;

const shufflePool = (pool: readonly string[]): string[] => {
  const a = [...pool];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i];
    a[i] = a[j]!;
    a[j] = t!;
  }
  return a;
};

/** Slight per-slot lightness nudge so adjacent nodes aren’t identical but stay in the same world. */
const nudgeRgbString = (rgb: string, slot: number): string => {
  const m = rgb.match(/\d+/g);
  if (!m || m.length < 3) return rgb;
  const drift = ((slot * 17) % 11) - 5;
  const r = Math.max(38, Math.min(142, Number(m[0]) + drift));
  const g = Math.max(38, Math.min(142, Number(m[1]) + drift));
  const b = Math.max(38, Math.min(142, Number(m[2]) + drift));
  return `rgb(${r}, ${g}, ${b})`;
};

const buildPalette = (): string[] => {
  const shuffled = shufflePool(EDITORIAL_ACCENT_POOL);
  const out: string[] = [];
  for (let i = 0; i < PALETTE_SIZE; i += 1) {
    const base = shuffled[i % shuffled.length]!;
    out.push(nudgeRgbString(base, i));
  }
  return out;
};

type MandalaBannerProps = {
  className?: string;
  fullBleed?: boolean;
  interactive?: boolean;
  /** 0-100 visual intensity; 72 keeps legacy behavior. */
  intensity?: number;
  /**
   * Lighter strokes / auras for dark surfaces (e.g. footer overlay). Canvas stays transparent;
   * no solid backdrop is drawn.
   */
  onDarkBackground?: boolean;
  /**
   * Increment (or any change) to regenerate the three accent colors — e.g. footer bumps this on
   * each debounced hover reveal so the palette feels fresh like a page reload.
   */
  paletteVersion?: number;
  /** Skip the animation loop while true (e.g. hero reveal layer when invisible). Saves CPU/GPU. */
  suspendAnimation?: boolean;
  /** Fewer particles, grain dots, and mouse segments — same structure, lighter draw cost. */
  ecoMode?: boolean;
};

export default function MandalaBanner({
  className = '',
  fullBleed = false,
  interactive = true,
  intensity = 72,
  onDarkBackground = false,
  paletteVersion = 0,
  suspendAnimation = false,
  ecoMode = false,
}: MandalaBannerProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rawMouseRef = useRef({ x: 0, y: 0 });
  const mouseRef = useRef({ x: 0, y: 0 });
  const hoveringRef = useRef(false);
  const paletteRef = useRef<string[]>(buildPalette());

  useEffect(() => {
    paletteRef.current = buildPalette();
  }, [paletteVersion]);

  const frameRef = useRef({
    frameCount: 0,
    hoverFactor: 0,
    rotationAccumulator: 0,
    currentSize: 42,
    lastFrameTime: 0,
  });
  const entityRevealRef = useRef<number[]>([]);
  const anchorDisplayRef = useRef<{ x: number; y: number }[]>([]);
  const midDisplayRef = useRef<{ x: number; y: number }[]>([]);
  const suspendRef = useRef(suspendAnimation);
  suspendRef.current = suspendAnimation;
  const rafKickRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reducedMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const eco = ecoMode || reducedMotion;
    const numParticles = eco ? 36 : NUM_PARTICLES;
    const numGrain = eco ? 100 : 180;
    const maxMouseSegments = eco ? 12 : 20;
    const intensityNorm = Math.max(0, Math.min(1, intensity / 100));
    const intensityFactor = Math.max(0.15, Math.min(1.4, intensityNorm / 0.72));

    let wCss = 0;
    let hCss = 0;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      wCss = Math.max(1, rect.width);
      hCss = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(wCss * dpr);
      canvas.height = Math.floor(hCss * dpr);
      canvas.style.width = `${wCss}px`;
      canvas.style.height = `${hCss}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cx = wCss / 2;
      const cy = hCss / 2;
      rawMouseRef.current.x = cx;
      rawMouseRef.current.y = cy;
      mouseRef.current.x = cx;
      mouseRef.current.y = cy;
    };

    const ro = new ResizeObserver(() => resize());
    ro.observe(wrap);
    resize();

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      rawMouseRef.current.x = e.clientX - rect.left;
      rawMouseRef.current.y = e.clientY - rect.top;
    };

    if (interactive) {
      wrap.addEventListener('mousemove', onMove);
      wrap.addEventListener('mouseenter', () => {
        hoveringRef.current = true;
      });
      wrap.addEventListener('mouseleave', () => {
        hoveringRef.current = false;
        const rect = wrap.getBoundingClientRect();
        rawMouseRef.current.x = rect.width / 2;
        rawMouseRef.current.y = rect.height / 2;
      });
    } else {
      hoveringRef.current = false;
    }

    let animationFrame = 0;

    const render = () => {
      if (suspendRef.current) {
        animationFrame = 0;
        return;
      }
      const state = frameRef.current;
      const now = performance.now();
      const dt = state.lastFrameTime > 0 ? Math.min((now - state.lastFrameTime) / 1000, 0.1) : 1 / 60;
      state.lastFrameTime = now;

      mouseRef.current.x = lerp(mouseRef.current.x, rawMouseRef.current.x, CURSOR_LERP);
      mouseRef.current.y = lerp(mouseRef.current.y, rawMouseRef.current.y, CURSOR_LERP);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      const hoverLerp = hoveringRef.current ? 0.08 : 0.06;
      const hf = (state.hoverFactor = lerp(state.hoverFactor, hoveringRef.current && interactive ? 1 : 0, hoverLerp));
      const cx0 = wCss / 2;
      const cy0 = hCss / 2;

      const t = state.frameCount;
      const actFactor = ACT_FACTOR * intensityFactor;
      const oscSpeed = (0.35 + hf * 0.25) * (0.75 + intensityFactor * 0.25);
      state.frameCount += oscSpeed * dt;
      state.rotationAccumulator += (0.25 + hf * 0.15) * dt * (0.8 + intensityFactor * 0.2);

      const dx = mx - cx0;
      const dy = my - cy0;
      const distFromCenter = Math.sqrt(dx * dx + dy * dy);
      const d = Math.min(distFromCenter / Math.max(wCss, hCss, 80), 1.0);

      const size = state.currentSize;
      const clusterScale = Math.min(1.25, Math.min(wCss, hCss) * 0.58 / CLUSTER_MAX_RADIUS_EST);

      const heartbeat = Math.pow(Math.sin(t * 0.8), 6) * (8 + hf * 5);
      const waveX = Math.sin(t * 1.2) * (6 + actFactor * 8);
      const waveY = Math.cos(t * 1.0) * (6 + actFactor * 8);

      // Base positions (no cursor-follow); then gentle push away from mouse so entities move around it
      const anchorPositions: { x: number; y: number }[] = [];
      for (let a = 0; a < NUM_ANCHORS; a++) {
        const k = a / Math.max(1, NUM_ANCHORS - 1);
        const offX = Math.sin(a * 2.4) * 0.08 + Math.cos(t * 0.2 + a) * 0.04;
        const offY = Math.cos(a * 1.9) * 0.1 + Math.sin(t * 0.15 + a * 0.7) * 0.06;
        let x = wCss * (0.08 + k * 0.84 + offX) + waveX + Math.sin(t * 0.35 + a * 0.9) * 6;
        let y = hCss * (0.15 + (Math.sin(a * 1.3) * 0.5 + 0.5) * 0.7 + offY) + waveY + heartbeat;
        const dx = x - mx;
        const dy = y - my;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        if (interactive && distToMouse < PUSH_RADIUS && distToMouse > 2) {
          const strength = (1 - distToMouse / PUSH_RADIUS) * PUSH_STRENGTH;
          const nx = dx / distToMouse;
          const ny = dy / distToMouse;
          x += nx * strength;
          y += ny * strength;
        }
        anchorPositions.push({ x, y });
      }

      if (anchorDisplayRef.current.length !== NUM_ANCHORS) {
        anchorDisplayRef.current = anchorPositions.map((p) => ({ x: p.x, y: p.y }));
      } else {
        for (let a = 0; a < NUM_ANCHORS; a++) {
          anchorDisplayRef.current[a].x = lerp(anchorDisplayRef.current[a].x, anchorPositions[a].x, NODE_POS_LERP);
          anchorDisplayRef.current[a].y = lerp(anchorDisplayRef.current[a].y, anchorPositions[a].y, NODE_POS_LERP);
        }
      }

      const midNodes: { x: number; y: number }[] = [];
      for (let m = 0; m < 6; m++) {
        let x = wCss * (0.22 + (m / 5) * 0.56) + Math.sin(t * 0.42 + m * 1.7) * 10;
        let y = hCss * (0.5 + Math.sin(t * 0.33 + m * 1.1) * 0.18) + Math.cos(t * 0.38 + m * 1.3) * 10;
        const ddx = x - mx;
        const ddy = y - my;
        const distToMouse = Math.sqrt(ddx * ddx + ddy * ddy);
        if (interactive && distToMouse < PUSH_RADIUS && distToMouse > 2) {
          const strength = (1 - distToMouse / PUSH_RADIUS) * (PUSH_STRENGTH * 0.7);
          x += (ddx / distToMouse) * strength;
          y += (ddy / distToMouse) * strength;
        }
        midNodes.push({ x, y });
      }

      if (midDisplayRef.current.length !== 6) {
        midDisplayRef.current = midNodes.map((p) => ({ x: p.x, y: p.y }));
      } else {
        for (let m = 0; m < 6; m++) {
          midDisplayRef.current[m].x = lerp(midDisplayRef.current[m].x, midNodes[m].x, NODE_POS_LERP);
          midDisplayRef.current[m].y = lerp(midDisplayRef.current[m].y, midNodes[m].y, NODE_POS_LERP);
        }
      }

      if (entityRevealRef.current.length !== 18) {
        entityRevealRef.current = Array(18).fill(0);
      }
      for (let a = 0; a < NUM_ANCHORS; a++) {
        const distA = Math.sqrt((anchorPositions[a].x - mx) ** 2 + (anchorPositions[a].y - my) ** 2);
        const target = interactive && hf > ENTITY_HOVER_THRESH && distA < ENTITY_REVEAL_RADIUS ? 1 : 0;
        entityRevealRef.current[a] = lerp(entityRevealRef.current[a], target, ENTITY_REVEAL_LERP);
      }
      for (let m = 0; m < 6; m++) {
        const distM = Math.sqrt((midNodes[m].x - mx) ** 2 + (midNodes[m].y - my) ** 2);
        const target = interactive && hf > ENTITY_HOVER_THRESH && distM < ENTITY_REVEAL_RADIUS ? 1 : 0;
        entityRevealRef.current[12 + m] = lerp(entityRevealRef.current[12 + m], target, ENTITY_REVEAL_LERP);
      }

      ctx.clearRect(0, 0, wCss, hCss);

      const charcoal = onDarkBackground
        ? { r: 198, g: 196, b: 212 }
        : { r: 20, g: 20, b: 20 };

      const activePalette = paletteRef.current;
      const paletteLen = Math.max(1, activePalette.length);
      const rgbFromPalette = (idx: number): [number, number, number] => {
        const m = activePalette[idx % paletteLen].match(/\d+/g);
        return m && m.length >= 3
          ? [Number(m[0]), Number(m[1]), Number(m[2])]
          : [80, 100, 200];
      };
      const nodeColorFactorGlobal = Math.min(1, 0.66 + hf * 0.2 + intensityFactor * 0.08);
      const strokeForAnchor = (idx: number) => {
        const [tr, tg, tb] = rgbFromPalette(idx);
        return `rgb(${Math.round(lerp(charcoal.r, tr, nodeColorFactorGlobal))},${Math.round(lerp(charcoal.g, tg, nodeColorFactorGlobal))},${Math.round(lerp(charcoal.b, tb, nodeColorFactorGlobal))})`;
      };
      const strokeBlendAnchors = (i: number, j: number) => {
        const [r1, g1, b1] = rgbFromPalette(i);
        const [r2, g2, b2] = rgbFromPalette(j);
        const tr = Math.round((r1 + r2) / 2);
        const tg = Math.round((g1 + g2) / 2);
        const tb = Math.round((b1 + b2) / 2);
        const f = Math.min(1, 0.52 + hf * 0.22 + intensityFactor * 0.1);
        return `rgb(${Math.round(lerp(charcoal.r, tr, f))},${Math.round(lerp(charcoal.g, tg, f))},${Math.round(lerp(charcoal.b, tb, f))})`;
      };
      const auraRgbFor = (idx: number) => {
        const [tr, tg, tb] = rgbFromPalette(idx);
        return {
          r: Math.round(lerp(charcoal.r, tr, nodeColorFactorGlobal)),
          g: Math.round(lerp(charcoal.g, tg, nodeColorFactorGlobal)),
          b: Math.round(lerp(charcoal.b, tb, nodeColorFactorGlobal)),
        };
      };

      const anchorDisplay = anchorDisplayRef.current;

      // Per-anchor mandala clusters and generative entities (crossfade by reveal factor)
      for (let a = 0; a < NUM_ANCHORS; a++) {
        const ax = anchorDisplay[a].x;
        const ay = anchorDisplay[a].y;
        const phase = a * 0.7;
        const anchorSizeScale = 0.82 + Math.sin(t * 0.35 + a) * 0.16;
        const revealFactor = entityRevealRef.current[a];

        if (revealFactor > 0.01) {
          const entityAlpha = (0.26 + 0.2 * revealFactor + intensityFactor * 0.06) * revealFactor;
          const baseR = (8 + phase) * (size / 50) * anchorSizeScale * clusterScale;
          const entityType = a % 4;
          ctx.strokeStyle = strokeForAnchor(a);
          ctx.globalAlpha = Math.min(0.38, entityAlpha);
          ctx.setLineDash([]);
          if (entityType === 0) {
            for (let li = 0; li < 6; li++) {
              const rot = state.rotationAccumulator * (0.008 + li * 0.006) + (a * 0.5 + li) * Math.PI / 3;
              const pulse = Math.sin(t * 0.5 + phase + li * 0.3) * Math.sin(t * 0.2 + li * 0.4) * 4;
              const r = Math.max(2, baseR * (0.4 + li * 0.12) + pulse);
              const stretch = 1 + Math.sin(t * 0.06 + li) * 0.15;
              ctx.lineWidth = 0.5 + li * 0.08;
              ctx.beginPath();
              ctx.ellipse(ax, ay, r * stretch, r * (2 - stretch), rot, 0, Math.PI * 2);
              ctx.stroke();
            }
          } else if (entityType === 1) {
            const r1 = baseR * 0.35;
            const r2 = baseR * 0.6;
            const r3 = baseR * 0.85;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.arc(ax, ay, r1, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([2, 4]);
            ctx.beginPath();
            ctx.arc(ax, ay, r2, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.arc(ax, ay, r3, 0, Math.PI * 2);
            ctx.stroke();
            const satAngle = t * 1.2 + a;
            const satR = r2 * 1.15;
            ctx.fillStyle = strokeForAnchor(a);
            ctx.globalAlpha = entityAlpha * 0.9;
            ctx.beginPath();
            ctx.arc(ax + Math.cos(satAngle) * satR, ay + Math.sin(satAngle) * satR, 1.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = Math.min(0.38, entityAlpha);
          } else if (entityType === 2) {
            const breath = 0.92 + Math.cos(t * 0.4 + a) * 0.08;
            const rOut = baseR * 0.7 * breath;
            const rIn = rOut * 0.7;
            const rotOut = state.rotationAccumulator * 0.02 + a * 0.2;
            const rotIn = -state.rotationAccumulator * 0.025 - a * 0.15;
            ctx.lineWidth = 0.55;
            for (let s = 0; s <= 6; s++) {
              const angle = (s / 6) * Math.PI * 2 + rotOut;
              const vx = ax + Math.cos(angle) * rOut;
              const vy = ay + Math.sin(angle) * rOut;
              if (s === 0) ctx.moveTo(vx, vy);
              else ctx.lineTo(vx, vy);
            }
            ctx.stroke();
            ctx.setLineDash([2, 5]);
            ctx.lineWidth = 0.4;
            ctx.beginPath();
            for (let s = 0; s <= 6; s++) {
              const angle = (s / 6) * Math.PI * 2 + rotIn;
              const vx = ax + Math.cos(angle) * rIn;
              const vy = ay + Math.sin(angle) * rIn;
              if (s === 0) ctx.moveTo(vx, vy);
              else ctx.lineTo(vx, vy);
            }
            ctx.stroke();
            ctx.setLineDash([]);
          } else {
            const numRays = 12;
            for (let s = 0; s < numRays; s++) {
              const baseAngle = (s / numRays) * Math.PI * 2 + state.rotationAccumulator * 0.015;
              const sway = Math.sin(t * 0.7 + s * 0.5) * 0.12;
              const angle = baseAngle + sway;
              const len = baseR * (0.5 + 0.35 * (1 + Math.sin(t * 0.5 + s) * 0.4));
              ctx.lineWidth = 0.45;
              ctx.beginPath();
              ctx.moveTo(ax, ay);
              ctx.lineTo(ax + Math.cos(angle) * len, ay + Math.sin(angle) * len);
              ctx.stroke();
            }
          }
          ctx.globalAlpha = 1;
        }

        if (revealFactor < 0.99) {
          const clusterAlphaScale = 1 - revealFactor;
        for (let li = 0; li < LAYERS_PER_ANCHOR; li++) {
          const i = a * LAYERS_PER_ANCHOR + li;
          const driftSeed = i * 133.7;
          const driftMag = (8 + actFactor * 14 + hf * 6) * (li / LAYERS_PER_ANCHOR);
          const driftX = (Math.sin(t * 0.14 + driftSeed) + Math.sin(t * 0.3 + i)) * driftMag;
          const driftY = (Math.cos(t * 0.2 - driftSeed) + Math.cos(t * 0.12 + i)) * driftMag;
          const jitterX = (Math.sin(t * 0.25 + i * 2.1) * 0.8 - 0.4);
          const jitterY = (Math.cos(t * 0.18 + i * 1.7) * 0.8 - 0.4);

          let lcx = ax + driftX + jitterX;
          let lcy = ay + driftY + jitterY;

          const stretchX = 1 + Math.sin(t * 0.06 + i * 1.8) * (0.22 + ACT_FACTOR * 0.28);
          const stretchY = 1 + Math.cos(t * 0.1 + i * 1.3) * (0.22 + ACT_FACTOR * 0.28);
          const depthScale = 1 - (li / LAYERS_PER_ANCHOR) * 0.32;

          const baseRadius = (5 + li * 6.5) * (size / 50) * depthScale * anchorSizeScale;
          const biologicalPulse = Math.sin(t * 0.55 + phase + li * 0.2) * Math.sin(t * 0.22 + li * 0.5);
          const oscAmp = (10 + actFactor * 18 + hf * 8) * (1 + d * 0.6);
          let radius = Math.max(0.1, baseRadius + biologicalPulse * oscAmp);
          radius *= clusterScale;

          const rotationOffset = state.rotationAccumulator * (0.01 + li * 0.004) + (i * Math.PI) / 1.1;

          const rgbMatch = activePalette[i % activePalette.length].match(/\d+/g);
          const accentRGB = rgbMatch ? rgbMatch.map(Number) : [80, 100, 200];
          const targetColor = { r: accentRGB[0], g: accentRGB[1], b: accentRGB[2] };
          const colorFactor = Math.min(1, 0.5 + hf * 0.28);
          const r = Math.round(lerp(charcoal.r, targetColor.r, colorFactor));
          const g = Math.round(lerp(charcoal.g, targetColor.g, colorFactor));
          const b = Math.round(lerp(charcoal.b, targetColor.b, colorFactor));
          const strokeColor = `rgb(${r}, ${g}, ${b})`;

          ctx.strokeStyle = strokeColor;
          ctx.globalAlpha =
            clusterAlphaScale *
            (0.52 + hf * 0.12 + intensityFactor * 0.09) *
            (1 - (li / LAYERS_PER_ANCHOR) * 0.32) *
            (0.92 + Math.sin(t * 0.4 + i * 0.5) * 0.08);
          const baseW = li % 3 === 0 ? 1.35 : 0.7;
          const strokeOsc = Math.sin(t * 0.5 + i) * 0.5 + 0.5;
          ctx.lineWidth = baseW * (0.85 + strokeOsc * 0.4);
          ctx.shadowBlur = 0;

          if (i % 7 === 0) ctx.setLineDash([22, 12]);
          else if (i % 5 === 0) ctx.setLineDash([4, 8]);
          else if (i % 4 === 0) ctx.setLineDash([2, 6]);
          else if (i % 9 === 0) ctx.setLineDash([10, 4, 2, 4]);
          else ctx.setLineDash([]);

          const layerType = i % 6;

          if (layerType === 1) {
            ctx.beginPath();
            ctx.ellipse(lcx, lcy, radius * stretchX, radius * stretchY, rotationOffset, 0, Math.PI * 2);
            ctx.stroke();
          } else if (layerType === 0) {
            const arcStart = rotationOffset;
            const arcEnd = arcStart + Math.PI * (0.5 + Math.sin(t * 0.2 + i) * 0.5);
            ctx.beginPath();
            ctx.arc(lcx, lcy, radius, arcStart, arcEnd);
            ctx.stroke();
            if (li % 2 === 0) {
              ctx.beginPath();
              ctx.arc(lcx, lcy, radius * 0.9, arcStart + Math.PI, arcEnd + Math.PI);
              ctx.stroke();
            }
          } else if (layerType === 4) {
            const numTicks = 8;
            for (let s = 0; s < numTicks; s++) {
              const angle = (s / numTicks) * Math.PI * 2 + rotationOffset * 0.5;
              const x1 = lcx + Math.cos(angle) * radius * 0.95;
              const y1 = lcy + Math.sin(angle) * radius * 0.95;
              const x2 = lcx + Math.cos(angle) * radius * 1.05;
              const y2 = lcy + Math.sin(angle) * radius * 1.05;
              ctx.beginPath();
              ctx.moveTo(x1, y1);
              ctx.lineTo(x2, y2);
              ctx.stroke();
            }
          } else if (layerType === 2) {
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
          } else if (layerType === 3) {
            const sides = 6;
            ctx.save();
            ctx.globalAlpha *= 0.4;
            ctx.beginPath();
            for (let s = 0; s <= sides; s++) {
              const angle = (s / sides) * Math.PI * 2 + rotationOffset;
              const vx = lcx + Math.cos(angle) * radius * stretchX;
              const vy = lcy + Math.sin(angle) * radius * stretchY;
              if (s === 0) ctx.moveTo(vx, vy);
              else ctx.lineTo(vx, vy);
            }
            ctx.stroke();
            ctx.restore();
          }

          if (li === 2 && a % 2 === 0) {
            ctx.save();
            ctx.globalAlpha *= 0.4;
            ctx.setLineDash([2, 6]);
            ctx.beginPath();
            ctx.arc(lcx, lcy, radius * 1.1, t * 0.4 + phase, t * 0.4 + phase + Math.PI * 0.4);
            ctx.stroke();
            ctx.restore();
          }
        }
        }
      }

      const midDisplay = midDisplayRef.current;
      // Mid nodes: default 2 ellipse layers, or small entity (crossfade by reveal factor)
      for (let m = 0; m < midDisplay.length; m++) {
        const ax = midDisplay[m].x;
        const ay = midDisplay[m].y;
        const revealFactorMid = entityRevealRef.current[12 + m];

        if (revealFactorMid > 0.01) {
          const entityAlphaMid = (0.22 + 0.16 * revealFactorMid + intensityFactor * 0.04) * revealFactorMid;
          const baseR = 6 * (size / 50) * clusterScale;
          const midType = m % 3;
          ctx.strokeStyle = strokeForAnchor(NUM_ANCHORS + m);
          ctx.globalAlpha = Math.min(0.32, entityAlphaMid);
          ctx.setLineDash([]);
          if (midType === 0) {
            ctx.lineWidth = 0.45;
            ctx.beginPath();
            ctx.arc(ax, ay, baseR * 0.4, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([2, 4]);
            ctx.beginPath();
            ctx.arc(ax, ay, baseR * 0.65, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.arc(ax, ay, baseR * 0.9, 0, Math.PI * 2);
            ctx.stroke();
            const satAngle = t * 1.1 + m * 2;
            ctx.fillStyle = strokeForAnchor(NUM_ANCHORS + m);
            ctx.globalAlpha = entityAlphaMid * 0.8;
            ctx.beginPath();
            ctx.arc(ax + Math.cos(satAngle) * baseR * 0.7, ay + Math.sin(satAngle) * baseR * 0.7, 1, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = Math.min(0.32, entityAlphaMid);
          } else if (midType === 1) {
            const breath = 0.94 + Math.cos(t * 0.5 + m) * 0.06;
            const rOut = baseR * 0.6 * breath;
            const rIn = rOut * 0.7;
            const rotOut = state.rotationAccumulator * 0.018 + m * 0.3;
            const rotIn = -state.rotationAccumulator * 0.02 - m * 0.25;
            ctx.lineWidth = 0.4;
            ctx.beginPath();
            for (let s = 0; s <= 6; s++) {
              const angle = (s / 6) * Math.PI * 2 + rotOut;
              if (s === 0) ctx.moveTo(ax + Math.cos(angle) * rOut, ay + Math.sin(angle) * rOut);
              else ctx.lineTo(ax + Math.cos(angle) * rOut, ay + Math.sin(angle) * rOut);
            }
            ctx.stroke();
            ctx.setLineDash([1, 4]);
            ctx.lineWidth = 0.35;
            ctx.beginPath();
            for (let s = 0; s <= 6; s++) {
              const angle = (s / 6) * Math.PI * 2 + rotIn;
              if (s === 0) ctx.moveTo(ax + Math.cos(angle) * rIn, ay + Math.sin(angle) * rIn);
              else ctx.lineTo(ax + Math.cos(angle) * rIn, ay + Math.sin(angle) * rIn);
            }
            ctx.stroke();
            ctx.setLineDash([]);
          } else {
            const numRays = 12;
            for (let s = 0; s < numRays; s++) {
              const baseAngle = (s / numRays) * Math.PI * 2 + state.rotationAccumulator * 0.012;
              const sway = Math.sin(t * 0.6 + s * 0.4) * 0.1;
              const angle = baseAngle + sway;
              const len = baseR * (0.4 + 0.3 * (1 + Math.sin(t * 0.4 + s) * 0.35));
              ctx.lineWidth = 0.35;
              ctx.beginPath();
              ctx.moveTo(ax, ay);
              ctx.lineTo(ax + Math.cos(angle) * len, ay + Math.sin(angle) * len);
              ctx.stroke();
            }
          }
          ctx.globalAlpha = 1;
        }

        if (revealFactorMid < 0.99) {
          const clusterAlphaScaleMid = 1 - revealFactorMid;
          for (let li = 0; li < 2; li++) {
            const i = 100 + m * 5 + li;
            const rotationOffset = state.rotationAccumulator * (0.012 + li * 0.008) + (i * Math.PI) / 1.1;
            const stretch = 1 + Math.sin(t * 0.08 + i) * 0.12;
            const baseRadius = (7 + li * 7) * (size / 50) * clusterScale;
            const pulse = Math.sin(t * 0.7 + m * 0.9 + li) * 6;
            const radius = Math.max(1, baseRadius + pulse);
            ctx.strokeStyle = strokeForAnchor(NUM_ANCHORS + m);
          ctx.globalAlpha = clusterAlphaScaleMid * (0.28 + hf * 0.08 + intensityFactor * 0.05);
            ctx.lineWidth = 0.55 + li * 0.15;
            ctx.setLineDash(li === 0 ? [2, 6] : []);
            ctx.beginPath();
            ctx.ellipse(ax, ay, radius * stretch, radius * (2 - stretch), rotationOffset, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }
      ctx.setLineDash([]);

      // Paths connecting nodes: nearest + skip-one + skip-two for a visible network (stroke variation)
      const drawTrail = (i: number, j: number, alpha: number, lineW: number, dash: number[]) => {
        const a = anchorDisplay[i];
        const next = anchorDisplay[j % NUM_ANCHORS];
        const midX = (a.x + next.x) / 2 + Math.sin(t * 0.6 + i * 1.2) * 8;
        const midY = (a.y + next.y) / 2 + Math.cos(t * 0.5 + i * 0.9) * 8;
        ctx.strokeStyle = strokeBlendAnchors(i, j % NUM_ANCHORS);
        ctx.setLineDash(dash);
        ctx.lineWidth = lineW;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(midX, midY);
        ctx.lineTo(next.x, next.y);
        ctx.stroke();
      };
      for (let i = 0; i < NUM_ANCHORS; i++) {
        drawTrail(i, i + 1, 0.16 + hf * 0.08, 0.68, [2, 5]);
        drawTrail(i, i + 2, 0.09 + hf * 0.05, 0.52, [3, 7]);
        drawTrail(i, i + 3, 0.06 + hf * 0.03, 0.4, [4, 10]);
      }
      // Connect mid nodes lightly into the system
      ctx.setLineDash([1, 7]);
      ctx.globalAlpha = 0.09 + hf * 0.05;
      ctx.lineWidth = 0.46;
      for (let m = 0; m < midDisplay.length; m++) {
        const a = midDisplay[m];
        const b = anchorDisplay[(m * 2) % NUM_ANCHORS];
        ctx.strokeStyle = strokeBlendAnchors(NUM_ANCHORS + m, (m * 2) % NUM_ANCHORS);
        const midX = (a.x + b.x) / 2 + Math.sin(t * 0.5 + m) * 10;
        const midY = (a.y + b.y) / 2 + Math.cos(t * 0.45 + m) * 10;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(midX, midY);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Mouse-proximity: extra strokes connecting nodes near the cursor (smooth falloff at radius)
      const allNodesDisplay = [...anchorDisplay, ...midDisplay];
      const MOUSE_CONNECTION_RADIUS = PUSH_RADIUS;
      const inZone = (interactive ? allNodesDisplay : [])
        .map((p, i) => ({ i, x: p.x, y: p.y, d: Math.sqrt((p.x - mx) ** 2 + (p.y - my) ** 2) }))
        .filter((n) => n.d < MOUSE_CONNECTION_RADIUS)
        .sort((a, b) => a.d - b.d);
      const drawn = new Set<string>();
      let mouseSegments = 0;
      ctx.setLineDash([2, 4]);
      ctx.lineWidth = 0.64;
      for (const a of inZone) {
        if (mouseSegments >= maxMouseSegments) break;
        const others = inZone
          .filter((b) => b.i !== a.i)
          .map((b) => ({ ...b, d: Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2) }))
          .sort((x, y) => x.d - y.d)
          .slice(0, 2);
        for (const b of others) {
          const key = a.i < b.i ? `${a.i}-${b.i}` : `${b.i}-${a.i}`;
          if (drawn.has(key)) continue;
          drawn.add(key);
          const baseAlpha = 0.12 + (1 - a.d / MOUSE_CONNECTION_RADIUS) * 0.16 + hf * 0.06;
          const falloff = 1 - a.d / MOUSE_CONNECTION_RADIUS;
          ctx.strokeStyle = strokeBlendAnchors(a.i, b.i);
          ctx.globalAlpha = baseAlpha * falloff;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          mouseSegments++;
          if (mouseSegments >= maxMouseSegments) break;
        }
      }
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;

      // Floating particles: drift + gentle push away from mouse (move around cursor)
      for (let p = 0; p < numParticles; p++) {
        const seedX = (Math.sin(p * 3.1) * 0.5 + 0.5) * wCss;
        const seedY = (Math.cos(p * 2.7) * 0.5 + 0.5) * hCss;
        const driftX = Math.sin(t * 0.4 + p * 0.6) * (14 + actFactor * 10);
        const driftY = Math.cos(t * 0.35 + p * 0.5) * (14 + actFactor * 10);
        let px = (seedX + driftX + wCss * 2) % wCss;
        let py = (seedY + driftY + hCss * 2) % hCss;
        const dx = px - mx;
        const dy = py - my;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        if (interactive && distToMouse < PUSH_RADIUS * 0.8 && distToMouse > 2) {
          const strength = (1 - distToMouse / (PUSH_RADIUS * 0.8)) * (PUSH_STRENGTH * 0.5);
          const nx = dx / distToMouse;
          const ny = dy / distToMouse;
          px += nx * strength;
          py += ny * strength;
        }
        const radius = 1.2 + (Math.sin(p * 1.1) * 0.5 + 0.5) * 1.2;
        ctx.fillStyle = strokeForAnchor(p);
        ctx.globalAlpha = 0.24 + Math.sin(t * 0.5 + p * 0.3) * 0.09;
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Node auras then dark centers at each anchor
      for (let i = 0; i < NUM_ANCHORS; i++) {
        const p = anchorDisplay[i];
        const { r, g, b } = auraRgbFor(i);
        const auraBase = `rgba(${r}, ${g}, ${b}, `;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = auraBase + `${0.11 + intensityFactor * 0.03})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = auraBase + `${0.075 + intensityFactor * 0.02})`;
        ctx.fill();
      }
      for (let i = 0; i < midDisplay.length; i++) {
        const p = midDisplay[i];
        const { r, g, b } = auraRgbFor(NUM_ANCHORS + i);
        const auraBase = `rgba(${r}, ${g}, ${b}, `;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = auraBase + `${0.072 + intensityFactor * 0.02})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = auraBase + `${0.05 + intensityFactor * 0.015})`;
        ctx.fill();
      }
      const nodeRadius = 1.1;
      ctx.globalAlpha = 1;
      ctx.fillStyle = onDarkBackground ? 'rgb(236, 234, 244)' : 'rgb(18, 18, 18)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < NUM_ANCHORS; i++) {
        const p = anchorDisplay[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, nodeRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.5 + hf * 0.22;
        ctx.strokeStyle = strokeForAnchor(i);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
      for (let i = 0; i < midDisplay.length; i++) {
        const p = midDisplay[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, nodeRadius * 0.95, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.45 + hf * 0.22;
        ctx.strokeStyle = strokeForAnchor(NUM_ANCHORS + i);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Subtle grain overlay — stippled texture, breathes with t (light specks on dark bg)
      ctx.fillStyle = onDarkBackground
        ? `rgba(255, 255, 255, ${(0.028 + Math.sin(t * 0.3) * 0.014) * (0.45 + intensityFactor * 0.45)})`
        : `rgba(20, 20, 20, ${(0.04 + Math.sin(t * 0.3) * 0.02) * (0.55 + intensityFactor * 0.45)})`;
      for (let g = 0; g < numGrain; g++) {
        const px = ((Math.sin(g * 7.3 + t * 0.2) * 0.5 + 0.5) * wCss) % wCss;
        const py = ((Math.cos(g * 5.1 + t * 0.15) * 0.5 + 0.5) * hCss) % hCss;
        ctx.fillRect(px, py, 1, 1);
      }

      animationFrame = requestAnimationFrame(render);
    };

    const kickRaf = () => {
      if (suspendRef.current) return;
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(render);
    };
    rafKickRef.current = kickRaf;

    if (!suspendRef.current) {
      animationFrame = requestAnimationFrame(render);
    }

    return () => {
      rafKickRef.current = null;
      ro.disconnect();
      if (interactive) wrap.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(animationFrame);
    };
  }, [intensity, interactive, onDarkBackground, ecoMode]);

  useEffect(() => {
    if (!suspendAnimation) rafKickRef.current?.();
  }, [suspendAnimation]);

  return (
    <div
      ref={wrapRef}
      className={`${fullBleed ? 'relative h-full w-full max-w-full touch-none select-none overflow-hidden' : 'relative w-full max-w-full aspect-[16/9] max-h-[38vh] touch-none select-none overflow-hidden'} ${className}`.trim()}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
    </div>
  );
}
