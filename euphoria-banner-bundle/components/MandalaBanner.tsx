import { useEffect, useRef } from 'react';

/**
 * MandalaBanner — editorial sibling to Euphoria Mandala.
 * 16:9 frame: many nodes, mandala clusters, paths connecting them; mouse gently pushes entities away.
 * Scaled elements, stroke variation, charcoal/accent, breathing, grain.
 */

const NUM_ANCHORS = 12;
const LAYERS_PER_ANCHOR = 4;
const NUM_PARTICLES = 48;
const PUSH_RADIUS = 110;
const PUSH_STRENGTH = 20;
const CLUSTER_MAX_RADIUS_EST = 52;
const ACT_FACTOR = 0.72;
const ENTITY_REVEAL_RADIUS = 115;
const ENTITY_HOVER_THRESH = 0.18;

const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

const getRandomColor = () => {
  const h = Math.random();
  const s = 0.7 + Math.random() * 0.2;
  const l = 0.5 + Math.random() * 0.1;
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
  const g = Math.round(hue2rgb(p, q, h) * 255);
  const b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);
  return `rgb(${r}, ${g}, ${b})`;
};

const CURSOR_LERP = 0.16;
const NODE_POS_LERP = 0.22;
const ENTITY_REVEAL_LERP = 0.1;

export default function MandalaBanner() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rawMouseRef = useRef({ x: 0, y: 0 });
  const mouseRef = useRef({ x: 0, y: 0 });
  const hoveringRef = useRef(false);
  const paletteRef = useRef([getRandomColor(), getRandomColor(), getRandomColor()]);
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

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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

    let animationFrame = 0;

    const render = () => {
      const state = frameRef.current;
      const now = performance.now();
      const dt = state.lastFrameTime > 0 ? Math.min((now - state.lastFrameTime) / 1000, 0.1) : 1 / 60;
      state.lastFrameTime = now;

      mouseRef.current.x = lerp(mouseRef.current.x, rawMouseRef.current.x, CURSOR_LERP);
      mouseRef.current.y = lerp(mouseRef.current.y, rawMouseRef.current.y, CURSOR_LERP);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      const hoverLerp = hoveringRef.current ? 0.08 : 0.06;
      const hf = (state.hoverFactor = lerp(state.hoverFactor, hoveringRef.current ? 1 : 0, hoverLerp));
      const cx0 = wCss / 2;
      const cy0 = hCss / 2;

      const t = state.frameCount;
      const oscSpeed = 0.35 + hf * 0.25;
      state.frameCount += oscSpeed * dt;
      state.rotationAccumulator += (0.25 + hf * 0.15) * dt;

      const dx = mx - cx0;
      const dy = my - cy0;
      const distFromCenter = Math.sqrt(dx * dx + dy * dy);
      const d = Math.min(distFromCenter / Math.max(wCss, hCss, 80), 1.0);

      const activePalette = paletteRef.current;
      const size = state.currentSize;
      const clusterScale = Math.min(1.25, Math.min(wCss, hCss) * 0.58 / CLUSTER_MAX_RADIUS_EST);

      const heartbeat = Math.pow(Math.sin(t * 0.8), 6) * (8 + hf * 5);
      const waveX = Math.sin(t * 1.2) * (6 + ACT_FACTOR * 8);
      const waveY = Math.cos(t * 1.0) * (6 + ACT_FACTOR * 8);

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
        if (distToMouse < PUSH_RADIUS && distToMouse > 2) {
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
        if (distToMouse < PUSH_RADIUS && distToMouse > 2) {
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
        const target = hf > ENTITY_HOVER_THRESH && distA < ENTITY_REVEAL_RADIUS ? 1 : 0;
        entityRevealRef.current[a] = lerp(entityRevealRef.current[a], target, ENTITY_REVEAL_LERP);
      }
      for (let m = 0; m < 6; m++) {
        const distM = Math.sqrt((midNodes[m].x - mx) ** 2 + (midNodes[m].y - my) ** 2);
        const target = hf > ENTITY_HOVER_THRESH && distM < ENTITY_REVEAL_RADIUS ? 1 : 0;
        entityRevealRef.current[12 + m] = lerp(entityRevealRef.current[12 + m], target, ENTITY_REVEAL_LERP);
      }

      ctx.clearRect(0, 0, wCss, hCss);

      const charcoal = { r: 20, g: 20, b: 20 };
      const rgbMatch0 = activePalette[0].match(/\d+/g);
      const accentRGB0 = rgbMatch0 ? rgbMatch0.map(Number) : [80, 100, 200];
      const targetColor0 = { r: accentRGB0[0], g: accentRGB0[1], b: accentRGB0[2] };
      const nodeColorFactor = Math.min(1, 0.5 + hf * 0.25);
      const nodeStrokeR = Math.round(lerp(charcoal.r, targetColor0.r, nodeColorFactor));
      const nodeStrokeG = Math.round(lerp(charcoal.g, targetColor0.g, nodeColorFactor));
      const nodeStrokeB = Math.round(lerp(charcoal.b, targetColor0.b, nodeColorFactor));
      const nodeStrokeColor = `rgb(${nodeStrokeR}, ${nodeStrokeG}, ${nodeStrokeB})`;

      const anchorDisplay = anchorDisplayRef.current;

      // Per-anchor mandala clusters and generative entities (crossfade by reveal factor)
      for (let a = 0; a < NUM_ANCHORS; a++) {
        const ax = anchorDisplay[a].x;
        const ay = anchorDisplay[a].y;
        const phase = a * 0.7;
        const anchorSizeScale = 0.82 + Math.sin(t * 0.35 + a) * 0.16;
        const revealFactor = entityRevealRef.current[a];

        if (revealFactor > 0.01) {
          const entityAlpha = (0.2 + 0.18 * revealFactor) * revealFactor;
          const baseR = (8 + phase) * (size / 50) * anchorSizeScale * clusterScale;
          const entityType = a % 4;
          ctx.strokeStyle = nodeStrokeColor;
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
            ctx.fillStyle = nodeStrokeColor;
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
          const driftMag = (8 + ACT_FACTOR * 14 + hf * 6) * (li / LAYERS_PER_ANCHOR);
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
          const oscAmp = (10 + ACT_FACTOR * 18 + hf * 8) * (1 + d * 0.6);
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
          ctx.globalAlpha = clusterAlphaScale * (0.38 + hf * 0.12) * (1 - (li / LAYERS_PER_ANCHOR) * 0.38) * (0.92 + Math.sin(t * 0.4 + i * 0.5) * 0.08);
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
          const entityAlphaMid = (0.18 + 0.14 * revealFactorMid) * revealFactorMid;
          const baseR = 6 * (size / 50) * clusterScale;
          const midType = m % 3;
          ctx.strokeStyle = nodeStrokeColor;
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
            ctx.fillStyle = nodeStrokeColor;
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
            ctx.strokeStyle = nodeStrokeColor;
            ctx.globalAlpha = clusterAlphaScaleMid * (0.2 + hf * 0.08);
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
        ctx.setLineDash(dash);
        ctx.lineWidth = lineW;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(midX, midY);
        ctx.lineTo(next.x, next.y);
        ctx.stroke();
      };
      ctx.strokeStyle = nodeStrokeColor;
      for (let i = 0; i < NUM_ANCHORS; i++) {
        drawTrail(i, i + 1, 0.13 + hf * 0.07, 0.6, [2, 5]);
        drawTrail(i, i + 2, 0.07 + hf * 0.04, 0.45, [3, 7]);
        drawTrail(i, i + 3, 0.045 + hf * 0.025, 0.35, [4, 10]);
      }
      // Connect mid nodes lightly into the system
      ctx.setLineDash([1, 7]);
      ctx.globalAlpha = 0.07 + hf * 0.04;
      ctx.lineWidth = 0.4;
      for (let m = 0; m < midDisplay.length; m++) {
        const a = midDisplay[m];
        const b = anchorDisplay[(m * 2) % NUM_ANCHORS];
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
      const inZone = allNodesDisplay
        .map((p, i) => ({ i, x: p.x, y: p.y, d: Math.sqrt((p.x - mx) ** 2 + (p.y - my) ** 2) }))
        .filter((n) => n.d < MOUSE_CONNECTION_RADIUS)
        .sort((a, b) => a.d - b.d);
      const drawn = new Set<string>();
      const maxMouseSegments = 14;
      let mouseSegments = 0;
      ctx.strokeStyle = nodeStrokeColor;
      ctx.setLineDash([2, 4]);
      ctx.lineWidth = 0.58;
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
          const baseAlpha = 0.1 + (1 - a.d / MOUSE_CONNECTION_RADIUS) * 0.14 + hf * 0.05;
          const falloff = 1 - a.d / MOUSE_CONNECTION_RADIUS;
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
      ctx.fillStyle = nodeStrokeColor;
      for (let p = 0; p < NUM_PARTICLES; p++) {
        const seedX = (Math.sin(p * 3.1) * 0.5 + 0.5) * wCss;
        const seedY = (Math.cos(p * 2.7) * 0.5 + 0.5) * hCss;
        const driftX = Math.sin(t * 0.4 + p * 0.6) * (14 + ACT_FACTOR * 10);
        const driftY = Math.cos(t * 0.35 + p * 0.5) * (14 + ACT_FACTOR * 10);
        let px = (seedX + driftX + wCss * 2) % wCss;
        let py = (seedY + driftY + hCss * 2) % hCss;
        const dx = px - mx;
        const dy = py - my;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        if (distToMouse < PUSH_RADIUS * 0.8 && distToMouse > 2) {
          const strength = (1 - distToMouse / (PUSH_RADIUS * 0.8)) * (PUSH_STRENGTH * 0.5);
          const nx = dx / distToMouse;
          const ny = dy / distToMouse;
          px += nx * strength;
          py += ny * strength;
        }
        const radius = 1.2 + (Math.sin(p * 1.1) * 0.5 + 0.5) * 1.2;
        ctx.globalAlpha = 0.2 + Math.sin(t * 0.5 + p * 0.3) * 0.08;
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Node auras then dark centers at each anchor
      const auraColor = `rgba(${nodeStrokeR}, ${nodeStrokeG}, ${nodeStrokeB}, `;
      for (let i = 0; i < NUM_ANCHORS; i++) {
        const p = anchorDisplay[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = auraColor + '0.08)';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = auraColor + '0.055)';
        ctx.fill();
      }
      for (let i = 0; i < midDisplay.length; i++) {
        const p = midDisplay[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = auraColor + '0.05)';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = auraColor + '0.035)';
        ctx.fill();
      }
      const nodeRadius = 1.1;
      ctx.globalAlpha = 1;
      ctx.fillStyle = 'rgb(18, 18, 18)';
      ctx.strokeStyle = nodeStrokeColor;
      ctx.lineWidth = 0.5;
      for (let i = 0; i < NUM_ANCHORS; i++) {
        const p = anchorDisplay[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, nodeRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.5 + hf * 0.22;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
      for (let i = 0; i < midDisplay.length; i++) {
        const p = midDisplay[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, nodeRadius * 0.95, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.45 + hf * 0.22;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Subtle grain overlay — stippled texture, breathes with t
      ctx.fillStyle = `rgba(20, 20, 20, ${0.04 + Math.sin(t * 0.3) * 0.02})`;
      for (let g = 0; g < 180; g++) {
        const px = ((Math.sin(g * 7.3 + t * 0.2) * 0.5 + 0.5) * wCss) % wCss;
        const py = ((Math.cos(g * 5.1 + t * 0.15) * 0.5 + 0.5) * hCss) % hCss;
        ctx.fillRect(px, py, 1, 1);
      }

      animationFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      ro.disconnect();
      wrap.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative w-full max-w-full aspect-[16/9] max-h-[38vh] touch-none select-none overflow-hidden"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
    </div>
  );
}
