/**
 * Adopt-a-School — System Architecture diagram (canvas).
 * Triad + purple loop; Shared Mission = strong mandala core (heart of the system).
 */
import { useEffect, useRef } from 'react';
import { NOUN_HANDSHAKE_PATHS, NOUN_HANDSHAKE_VIEWBOX } from '../data/nounHandshakePaths';
import { adoptBreathFast, adoptMandalaBeat, adoptPulseGlobal } from '../utils/adoptDiagramMotion';

const ACCENT = '#8b5cf6';
/** Brighter violet for neon mandala strokes (Shared Mission). */
const ACCENT_NEON = '#c4b5fd';
const ACCENT_NEON_CORE = '#e9d5ff';
const INK = '#141414';
const INK_FAINT = 'rgba(20, 20, 20, 0.22)';
const INK_MED = 'rgba(20, 20, 20, 0.45)';

const LABELS = ['Discovery', 'Activation', 'Participation'] as const;
const CENTER_LABEL = 'Shared mission';
/** 0 = apple (Discovery), 1 = person + heart (Activation), 2 = Noun handshake (Participation), 3 = sparkles (center) */
const NODE_ICONS = [0, 1, 2] as const;

const EDGE_SATELLITES = [0.35, 0.65] as const;

const DIAGRAM_MARGIN = 40;
/** Extra top inset so outer mandala halos aren’t clipped by the canvas edge (see layout bleed). */
function topInset(px: number, innerH: number, clusterR: number) {
  return DIAGRAM_MARGIN + Math.max(px * 0.09, clusterR * 0.5, 28) + Math.min(px * 0.035, innerH * 0.05);
}

/** Discovery + Shared Mission share x = center (vertical alignment). Generous insets for free-floating halos. */
function diagramLayout(w: number, h: number, px: number) {
  const margin = DIAGRAM_MARGIN;
  const cx = w / 2;
  const cy = h / 2;
  const innerW = Math.max(1, w - 2 * margin);
  const innerH = Math.max(1, h - 2 * margin);
  const clusterR = Math.min(px * 0.18, innerW * 0.23, innerH * 0.21);
  const yTop = topInset(px, innerH, clusterR);
  /** Lift Discovery slightly for more open space inside the triangle. */
  const discoveryLift = Math.min(px * 0.026, innerH * 0.032, 20);
  /** Narrow viewports: move Discovery (and attached tendrils/label) up ~30px for accessibility. */
  const discoveryMobileLift = w < 640 ? 30 : 0;
  const yBot = h - margin - Math.min(px * 0.125, innerH * 0.17);
  const xLeft = margin + clusterR;
  const xRight = w - margin - clusterR;
  return {
    nodes: [
      { x: cx, y: yTop - discoveryLift - discoveryMobileLift },
      { x: xLeft, y: yBot },
      { x: xRight, y: yBot },
    ],
    center: { x: cx, y: cy },
  };
}

/** Quadratic Bézier: P0 → P1 control → P2 */
function quadPoint(p0: { x: number; y: number }, p1: { x: number; y: number }, p2: { x: number; y: number }, u: number) {
  const o = 1 - u;
  return {
    x: o * o * p0.x + 2 * o * u * p1.x + u * u * p2.x,
    y: o * o * p0.y + 2 * o * u * p1.y + u * u * p2.y,
  };
}

function dist(ax: number, ay: number, bx: number, by: number) {
  const dx = ax - bx;
  const dy = ay - by;
  return Math.sqrt(dx * dx + dy * dy);
}

/** Soft pull toward pointer — same falloff family as tendril elasticity; keeps motion subtle. */
function subtlePullTowardMouse(
  x: number,
  y: number,
  mx: number,
  my: number,
  rm: boolean,
  reach: number,
  maxShift: number,
): { dx: number; dy: number } {
  if (rm || mx < -1e5) return { dx: 0, dy: 0 };
  const d = dist(mx, my, x, y);
  if (d < 1e-6) return { dx: 0, dy: 0 };
  const influence = Math.max(0, 1 - d / reach) ** 1.38;
  const pull = maxShift * influence;
  return { dx: ((mx - x) / d) * pull, dy: ((my - y) / d) * pull };
}

/** Matches `p` / `--text-body` in index.css (Zilla Slab, body size, normal weight; line-height uses --leading-body). */
function readBodyFontSizePx(): number {
  if (typeof document === 'undefined') return 18;
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--text-body').trim();
  const n = parseFloat(raw);
  return Number.isFinite(n) && n > 0 ? n : 18;
}

export default function AdoptSystemDiagram() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1e6, y: -1e6 });
  const reducedMotionRef = useRef(false);
  const rafRef = useRef(0);
  const bodyFontSizePxRef = useRef(18);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let wCss = 1;
    let hCss = 1;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      wCss = Math.max(1, rect.width);
      hCss = Math.max(1, rect.height);
      bodyFontSizePxRef.current = readBodyFontSizePx();
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      canvas.width = Math.floor(wCss * dpr);
      canvas.height = Math.floor(hCss * dpr);
      canvas.style.width = `${wCss}px`;
      canvas.style.height = `${hCss}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const ro = new ResizeObserver(() => resize());
    ro.observe(wrap);
    resize();

    const setPointer = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = clientX - rect.left;
      mouseRef.current.y = clientY - rect.top;
    };
    const onMove = (e: MouseEvent) => setPointer(e.clientX, e.clientY);
    const onLeave = () => {
      mouseRef.current.x = -1e6;
      mouseRef.current.y = -1e6;
    };

    const onTouch = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      setPointer(touch.clientX, touch.clientY);
    };

    wrap.addEventListener('mousemove', onMove);
    wrap.addEventListener('mouseleave', onLeave);
    wrap.addEventListener('touchmove', onTouch, { passive: true });
    wrap.addEventListener('touchstart', onTouch, { passive: true });

    const TENDRIL_MOUSE_REACH = 430;
    const baseSize = () => Math.min(wCss, hCss);

    const drawIcon = (
      type: number,
      x: number,
      y: number,
      s: number,
      strokeStyle: string,
      lineWidth: number,
    ) => {
      ctx.save();
      ctx.strokeStyle = strokeStyle;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      const scale = s / 128;

      if (type === 0) {
        /* Apple pictogram — 128×128 viewBox */
        ctx.translate(x, y - s * 0.04);
        ctx.scale(scale, scale);
        ctx.translate(-64, -64);
        ctx.lineWidth = lineWidth / scale;
        const appleBody = new Path2D(
          'M64 34 C40 18, 18 46, 30 74 C40 96, 56 104, 64 104 C72 104, 88 96, 98 74 C110 46, 88 18, 64 34 Z',
        );
        ctx.stroke(appleBody);
        ctx.beginPath();
        ctx.moveTo(64, 34);
        ctx.lineTo(64, 22);
        ctx.stroke();
        ctx.save();
        ctx.translate(64, 24);
        ctx.rotate(-Math.PI / 6);
        ctx.translate(-64, -24);
        const leaf = new Path2D('M64 24 C82 8, 104 18, 90 36 C74 34, 68 30, 64 24 Z');
        ctx.stroke(leaf);
        ctx.restore();
        const pedestal = new Path2D('M26 104 L102 104 L114 118 L14 118 Z');
        ctx.stroke(pedestal);
      } else if (type === 1) {
        /* Person + heart — 128×128 viewBox */
        ctx.translate(x, y - s * 0.04);
        ctx.scale(scale, scale);
        ctx.translate(-64, -64);
        ctx.lineWidth = lineWidth / scale;
        ctx.beginPath();
        ctx.arc(64, 40, 12, 0, Math.PI * 2);
        ctx.stroke();
        const shoulders = new Path2D('M40 88 C40 68, 52 60, 64 60 C76 60, 88 68, 88 88');
        ctx.stroke(shoulders);
        const heart = new Path2D(
          'M64 78 C61 74, 55 74, 55 80 C55 85, 64 90, 64 90 C64 90, 73 85, 73 80 C73 74, 67 74, 64 78 Z',
        );
        ctx.stroke(heart);
      } else if (type === 2) {
        /* Participation — filled Noun handshake (see src/assets/noun-hand-shake-2434029.svg) */
        /* Same anchor convention as other triad icons (y − 0.04s) for consistent halo centering. */
        ctx.translate(x, y - s * 0.04);
        ctx.scale(scale, scale);
        ctx.translate(-64, -64);
        const { w: vbW, h: vbH } = NOUN_HANDSHAKE_VIEWBOX;
        const k = Math.min(128 / vbW, 128 / vbH);
        const ox = (128 - vbW * k) / 2;
        const oy = (128 - vbH * k) / 2;
        ctx.translate(ox, oy);
        ctx.scale(k, k);
        ctx.translate(0, 4.1);
        ctx.fillStyle = strokeStyle;
        for (const d of NOUN_HANDSHAKE_PATHS) {
          ctx.fill(new Path2D(d));
        }
      } else {
        /* Sparkle cluster — 128×128 viewBox; same −0.04s anchor as triad for alignment. */
        ctx.translate(x, y - s * 0.04);
        ctx.scale(scale, scale);
        ctx.translate(-64, -64);
        ctx.lineWidth = lineWidth / scale;
        const main = new Path2D('M64 26 L74 54 L102 64 L74 74 L64 102 L54 74 L26 64 L54 54 Z');
        ctx.stroke(main);
        const s1 = new Path2D('M94 26 L98 36 L108 40 L98 44 L94 54 L90 44 L80 40 L90 36 Z');
        ctx.stroke(s1);
        const s2 = new Path2D('M26 86 L30 96 L40 100 L30 104 L26 114 L22 104 L12 100 L22 96 Z');
        ctx.stroke(s2);
      }
      ctx.restore();
    };

    /** Outer triad: light mandala halo (same stroke vocabulary, lower presence). */
    const drawMandalaSubtle = (
      x: number,
      y: number,
      baseR: number,
      rot: number,
      pulse: number,
      faint: string,
      breath: number,
    ) => {
      const layers = 2;
      for (let li = 0; li < layers; li++) {
        const lr = baseR * (0.48 + li * 0.26) * (0.96 + breath * 0.05);
        const rotL = rot * (0.5 + li * 0.3) + li * 0.7;
        const stretch = 1 + Math.sin(rotL * 1.9 + li) * 0.035;
        ctx.strokeStyle = faint;
        ctx.lineWidth = li === 0 ? 0.42 : 0.34;
        ctx.globalAlpha = 0.2 + pulse * 0.12 - li * 0.03;
        ctx.setLineDash(li === 0 ? [4, 7] : [11, 6]);
        ctx.beginPath();
        ctx.ellipse(x, y, lr * stretch, lr * (2 - stretch) * 0.93, rotL, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      ctx.globalAlpha = 1;
    };

    /** Shared Mission: neon-leaning animated mandala **strokes** (glow + bright pass; no tendrils). */
    const drawMandalaCore = (
      x: number,
      y: number,
      baseR: number,
      rot: number,
      pulse: number,
      breath: number,
      time: number,
      rm: boolean,
    ) => {
      const beat = adoptMandalaBeat(time, rm);
      const neonPulse = 0.55 + pulse * 0.35 + beat * 0.2;
      const layers = 5;
      for (let li = 0; li < layers; li++) {
        const lr =
          baseR * (0.36 + li * 0.17) * (0.97 + breath * 0.06 + beat * (0.04 + li * 0.012));
        const rotL = rot * (0.55 + li * 0.32) + li * 0.85;
        const stretch = 1 + Math.sin(rotL * 2.1 + li) * (0.055 + beat * 0.03);
        const v = li / Math.max(1, layers - 1);
        const rx = lr * stretch;
        const ry = lr * (2 - stretch) * 0.91;
        const dashAnim = rm ? 0 : -(time * (10 + li * 3)) % 120;

        const strokeEllipseNeon = (width: number, alpha: number, style: string, glow: boolean) => {
          ctx.save();
          ctx.strokeStyle = style;
          ctx.lineWidth = width;
          ctx.globalAlpha = alpha;
          if (li % 2 === 0) ctx.setLineDash([3, 6]);
          else ctx.setLineDash([9, 5]);
          ctx.lineDashOffset = dashAnim;
          if (glow && !rm) {
            ctx.shadowColor = `rgba(167, 139, 250, ${0.45 + neonPulse * 0.25})`;
            ctx.shadowBlur = 10 + beat * 8 + pulse * 6;
          }
          ctx.beginPath();
          ctx.ellipse(x, y, rx, ry, rotL, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        };

        /* Wide soft glow pass */
        strokeEllipseNeon(
          li === 0 ? 1.15 : li < 3 ? 0.95 : 0.78,
          (0.12 + pulse * 0.1 + beat * 0.08 - li * 0.025) * neonPulse,
          `rgba(196, 181, 253, ${0.55 + v * 0.2})`,
          true,
        );
        /* Crisp neon stroke */
        strokeEllipseNeon(
          li === 0 ? 0.72 : li < 3 ? 0.52 : 0.4,
          0.28 + pulse * 0.22 + beat * 0.14 - li * 0.03 + v * 0.05,
          li >= 2 ? ACCENT_NEON : v > 0.35 ? ACCENT : INK_MED,
          false,
        );
        /* Hot edge */
        strokeEllipseNeon(
          li === 0 ? 0.38 : 0.32,
          (0.2 + beat * 0.12) * (li >= 2 ? 1.15 : 0.85),
          li >= 3 ? ACCENT_NEON_CORE : ACCENT_NEON,
          false,
        );
        ctx.setLineDash([]);
        ctx.shadowBlur = 0;

        if (li === 2) {
          for (let k = 0; k < 8; k++) {
            const a = (k / 8) * Math.PI * 2 + rotL * 0.45;
            ctx.save();
            ctx.strokeStyle = ACCENT_NEON;
            ctx.lineWidth = 0.55;
            ctx.globalAlpha = 0.35 + pulse * 0.2 + beat * 0.18;
            if (!rm) {
              ctx.shadowColor = 'rgba(196, 181, 253, 0.75)';
              ctx.shadowBlur = 6 + beat * 5;
            }
            ctx.beginPath();
            ctx.moveTo(x + Math.cos(a) * lr * 0.28, y + Math.sin(a) * lr * 0.28);
            ctx.lineTo(x + Math.cos(a) * lr * 1.08, y + Math.sin(a) * lr * 1.08);
            ctx.stroke();
            ctx.strokeStyle = ACCENT;
            ctx.lineWidth = 0.32;
            ctx.globalAlpha = 0.55 + pulse * 0.15;
            ctx.shadowBlur = 0;
            ctx.beginPath();
            ctx.moveTo(x + Math.cos(a) * lr * 0.28, y + Math.sin(a) * lr * 0.28);
            ctx.lineTo(x + Math.cos(a) * lr * 1.08, y + Math.sin(a) * lr * 1.08);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    };

    /**
     * Outer triad “container” as partial mandala arcs (opens toward outside of triangle), not a full ring.
     */
    const drawOuterMandalaGuide = (
      x: number,
      y: number,
      baseR: number,
      rot: number,
      pulse: number,
      breath: number,
      cx: number,
      cy: number,
      time: number,
      rm: boolean,
      seed: number,
    ) => {
      const outward = Math.atan2(y - cy, x - cx);
      const rDisc = baseR * 0.92;
      for (let li = 0; li < 3; li++) {
        const rr = rDisc * (1.02 + li * 0.095);
        const span = Math.PI * 0.38 + breath * 0.05 + li * 0.04;
        const start = outward - span / 2 + rot * (0.12 + li * 0.11) + seed * 0.2;
        const end = outward + span / 2 + rot * (0.12 + li * 0.11) + seed * 0.2;
        ctx.strokeStyle = li === 0 ? INK : INK_MED;
        ctx.lineWidth = li === 0 ? 0.52 : 0.36;
        ctx.globalAlpha = 0.38 + pulse * 0.14 - li * 0.07;
        ctx.setLineDash(li === 0 ? [4, 7] : [9, 8]);
        ctx.lineDashOffset = rm ? 0 : -(time * 7 + li * 3 + seed * 2);
        ctx.beginPath();
        ctx.arc(x, y, rr, start, end);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.globalAlpha = 0.22 + pulse * 0.08;
      ctx.strokeStyle = INK_FAINT;
      ctx.lineWidth = 0.35;
      ctx.beginPath();
      ctx.arc(x, y, rDisc * 0.99, outward + Math.PI * 0.35, outward + Math.PI * 1.65);
      ctx.stroke();
      ctx.globalAlpha = 1;
    };

    /** Short mandala ticks along outer span of each tendril (extends visual “scope” without new topology). */
    const drawTendrilMandalaTicks = (
      a: { x: number; y: number },
      b: { x: number; y: number },
      cp: { x: number; y: number },
      time: number,
      rm: boolean,
      pulse: number,
      phase: number,
    ) => {
      const us = [0.18, 0.42, 0.66, 0.88];
      for (let k = 0; k < us.length; k++) {
        const u = us[k];
        const o = 1 - u;
        const px = o * o * a.x + 2 * o * u * cp.x + u * u * b.x;
        const py = o * o * a.y + 2 * o * u * cp.y + u * u * b.y;
        const tx = 2 * (1 - u) * (cp.x - a.x) + 2 * u * (b.x - cp.x);
        const ty = 2 * (1 - u) * (cp.y - a.y) + 2 * u * (b.y - cp.y);
        const len = Math.sqrt(tx * tx + ty * ty) || 1;
        const nx = -ty / len;
        const ny = tx / len;
        const tick = 3.2 + pulse * 2.5;
        const onlyOuter = u > 0.28;
        if (!onlyOuter) continue;
        ctx.save();
        ctx.strokeStyle = ACCENT;
        ctx.globalAlpha = 0.12 + pulse * 0.14;
        ctx.lineWidth = 0.55;
        ctx.setLineDash([2, 4]);
        ctx.lineDashOffset = rm ? 0 : -(time * 11 + phase * 4 + k * 2);
        ctx.beginPath();
        ctx.moveTo(px - nx * tick, py - ny * tick);
        ctx.lineTo(px + nx * tick, py + ny * tick);
        ctx.stroke();
        ctx.restore();
      }
      ctx.globalAlpha = 1;
      ctx.setLineDash([]);
    };

    const drawSatelliteNode = (
      x: number,
      y: number,
      r: number,
      t: number,
      seed: number,
      rm: boolean,
    ) => {
      const pulse = rm ? 0.4 : 0.35 + Math.sin(t * 1.6 + seed) * 0.2;
      const microRot = rm ? 0 : t * (0.25 + (seed % 3) * 0.08);
      ctx.strokeStyle = INK_MED;
      ctx.lineWidth = 0.35;
      ctx.globalAlpha = 0.25 + pulse * 0.2;
      ctx.setLineDash([2, 5]);
      ctx.beginPath();
      ctx.arc(x, y, r * 2.1, microRot, microRot + Math.PI * 1.25);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(x, y, r * 0.55, 0, Math.PI * 2);
      ctx.strokeStyle = INK;
      ctx.globalAlpha = 0.35 + pulse * 0.25;
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.fillStyle = `rgba(139, 92, 246, ${0.04 + pulse * 0.06})`;
      ctx.beginPath();
      ctx.arc(x, y, r * 0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    };

    const render = (now: number) => {
      const rm = reducedMotionRef.current;
      const t = rm ? 0 : now / 1000;

      const px = baseSize();
      const breathFast = adoptBreathFast(t, rm);
      const { nodes: layoutNodes, center: layoutCenter } = diagramLayout(wCss, hCss, px);
      const mpx = mouseRef.current.x;
      const mpy = mouseRef.current.y;

      const NODE_MOUSE_REACH = 460;
      const NODE_MAX_SHIFT = Math.min(px * 0.009, 4.5);
      const CENTER_MOUSE_REACH = 540;
      const CENTER_MAX_SHIFT = Math.min(px * 0.0055, 2.8);

      const nodes = layoutNodes.map((p) => {
        const o = subtlePullTowardMouse(p.x, p.y, mpx, mpy, rm, NODE_MOUSE_REACH, NODE_MAX_SHIFT);
        return { x: p.x + o.dx, y: p.y + o.dy };
      });
      const cPull = subtlePullTowardMouse(
        layoutCenter.x,
        layoutCenter.y,
        mpx,
        mpy,
        rm,
        CENTER_MOUSE_REACH,
        CENTER_MAX_SHIFT,
      );
      const centroid = { x: layoutCenter.x + cPull.dx, y: layoutCenter.y + cPull.dy };

      const ICON_MULT = 1.28;
      /** Activation reads small vs Participation handshake — scale up slightly. */
      const ACTIVATION_ICON_SCALE = 1.32;
      /** Standard gap from lowest icon ink to label (all nodes + Shared Mission). */
      const ICON_LABEL_GAP = 12;
      /** Icon anchor sits slightly above node center (harmonizes with notional disc radius). */
      const ICON_CENTER_OFFSET_RATIO = 0.06;
      /** Ink extent below anchor → bottom of glyph (per icon; balances optical center in the halo). */
      const ICON_BOTTOM_FRAC_OUTER: [number, number, number] = [0.52, 0.51, 0.49];
      const ICON_BOTTOM_FRAC_CENTER = 0.52;
      const R_NODE = px * 0.072;
      /** Outer triad only — smaller disc + icon footprint vs center. */
      const OUTER_DISC_SCALE = 0.78;
      const bodyPx = bodyFontSizePxRef.current;
      const labelFont = `400 ${bodyPx}px "Zilla Slab", Georgia, serif`;
      const ICON_STROKE = 0.92;

      const inkBottom = (anchorY: number, iconS: number, frac: number) => anchorY + iconS * frac;

      ctx.font = labelFont;
      const ascentProbe = ctx.measureText('Mg');
      const labelAscent =
        typeof ascentProbe.fontBoundingBoxAscent === 'number' ? ascentProbe.fontBoundingBoxAscent : bodyPx * 0.72;

      ctx.clearRect(0, 0, wCss, hCss);

      const pulseGlobal = adoptPulseGlobal(t, rm);

      const edges: { i: number; j: number; cp: { x: number; y: number } }[] = [];
      const pair = [
        [0, 1],
        [1, 2],
        [2, 0],
      ] as const;
      for (let e = 0; e < 3; e++) {
        const [i, j] = pair[e];
        const a = nodes[i];
        const b = nodes[j];
        const midX = (a.x + b.x) / 2;
        const midY = (a.y + b.y) / 2;
        let mx = midX + Math.sin(t * 1.1 + i) * (4 + breathFast * 3);
        let my = midY + Math.cos(t * 0.9 + j) * (4 + breathFast * 3);
        if (!rm && mpx > -1e5) {
          const dm = dist(mpx, mpy, midX, midY);
          const influence = Math.max(0, 1 - dm / TENDRIL_MOUSE_REACH) ** 1.32;
          const elastic = 0.11 * influence;
          mx += (mpx - mx) * elastic;
          my += (mpy - my) * elastic;
        }
        edges.push({ i, j, cp: { x: mx, y: my } });
      }

      /** Purple tendrils — outer triad (triangle loop). */
      const strokeTendril = (
        a: { x: number; y: number },
        b: { x: number; y: number },
        cp: { x: number; y: number },
        accent: string,
        phaseKey: number,
      ) => {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo(cp.x, cp.y, b.x, b.y);
        ctx.strokeStyle = INK_FAINT;
        ctx.lineWidth = 0.75;
        ctx.globalAlpha = 0.52;
        ctx.setLineDash([]);
        ctx.stroke();
        ctx.strokeStyle = accent;
        ctx.lineWidth = 1.1;
        ctx.globalAlpha = 0.18 + pulseGlobal * 0.22;
        ctx.setLineDash([10, 14]);
        ctx.lineDashOffset = rm ? 0 : -(t * 14 + phaseKey * 4) % 48;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
      };

      edges.forEach((e) => {
        const a = nodes[e.i];
        const b = nodes[e.j];
        strokeTendril(a, b, e.cp, ACCENT, e.i);
        drawTendrilMandalaTicks(a, b, e.cp, t, rm, pulseGlobal, e.i * 13 + e.j);
      });

      edges.forEach((e, edgeIdx) => {
        const a = nodes[e.i];
        const b = nodes[e.j];
        const { cp } = e;

        for (const u of EDGE_SATELLITES) {
          const p = quadPoint(a, cp, b, u);
          const wobble = rm ? 0 : Math.sin(t * 1.2 + u * 8 + edgeIdx) * 0.8;
          drawSatelliteNode(p.x + wobble * 0.25, p.y - wobble * 0.15, px * 0.011, t, edgeIdx * 10 + u * 100, rm);
        }
      });

      {
        const s = rm ? 0.35 : ((t * 0.088) % 3 + 3) % 3;
        const edgeIdx = Math.min(2, Math.floor(s));
        const u = s - Math.floor(s);
        const e = edges[edgeIdx];
        const a = nodes[e.i];
        const b = nodes[e.j];
        const pkt = quadPoint(a, e.cp, b, u);
        const g = ctx.createRadialGradient(pkt.x, pkt.y, 0, pkt.x, pkt.y, px * 0.028);
        g.addColorStop(0, 'rgba(139, 92, 246, 0.45)');
        g.addColorStop(0.5, 'rgba(139, 92, 246, 0.1)');
        g.addColorStop(1, 'rgba(139, 92, 246, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(pkt.x, pkt.y, px * 0.013 + breathFast * 0.004, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.65)';
        ctx.globalAlpha = 0.35;
        ctx.beginPath();
        ctx.arc(pkt.x - 1, pkt.y - 1, 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      const baseRC = R_NODE;
      const centerIconY = centroid.y - baseRC * ICON_CENTER_OFFSET_RATIO;
      const centerIconS = baseRC * ICON_MULT;
      const centerFirstLineTop = inkBottom(centerIconY, centerIconS, ICON_BOTTOM_FRAC_CENTER) + ICON_LABEL_GAP;

      let rotC = rm ? 0.2 : t * 0.38;
      let pulseSm = 0.42 + pulseGlobal * 0.28;
      if (!rm && mpx > -1e5) {
        const dCenter = dist(mpx, mpy, layoutCenter.x, layoutCenter.y);
        const inf = Math.max(0, 1 - dCenter / 520) ** 1.28;
        rotC += (mpx - layoutCenter.x) * 0.00002 * inf + (mpy - layoutCenter.y) * 0.000018 * inf;
        pulseSm += inf * 0.028;
      }
      const glowRC = baseRC * 2.1;
      const gC = ctx.createRadialGradient(centroid.x, centroid.y, 0, centroid.x, centroid.y, glowRC);
      gC.addColorStop(0, `rgba(139, 92, 246, ${0.08 + pulseGlobal * 0.06})`);
      gC.addColorStop(0.5, `rgba(139, 92, 246, ${0.03 + pulseGlobal * 0.02})`);
      gC.addColorStop(1, 'rgba(139, 92, 246, 0)');
      ctx.fillStyle = gC;
      ctx.beginPath();
      ctx.arc(centroid.x, centroid.y, glowRC, 0, Math.PI * 2);
      ctx.fill();
      drawMandalaCore(
        centroid.x,
        centroid.y,
        baseRC * 1.95,
        rotC,
        pulseSm,
        breathFast,
        t,
        rm,
      );
      /* Shared Mission: same anchor offset + label gap as outer nodes. */
      drawIcon(3, centroid.x, centerIconY, centerIconS, INK, ICON_STROKE);
      ctx.save();
      ctx.font = labelFont;
      ctx.fillStyle = INK;
      ctx.globalAlpha = 1;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      const tcx = centroid.x;
      const tcy = centerFirstLineTop;
      ctx.fillText(CENTER_LABEL, tcx, tcy);
      ctx.globalAlpha = 1;
      ctx.restore();

      const outerPulse = 0.26 + pulseGlobal * 0.14;
      const outerBaseR = R_NODE * OUTER_DISC_SCALE;

      const outerIconY: number[] = [];
      const outerIconS: number[] = [];
      const outerStrokeW: number[] = [];
      for (let i = 0; i < 3; i++) {
        const p = nodes[i];
        let iconY = p.y - outerBaseR * ICON_CENTER_OFFSET_RATIO;
        let iconS = outerBaseR * ICON_MULT;
        let strokeW = ICON_STROKE;
        if (i === 1) {
          iconS *= ACTIVATION_ICON_SCALE;
          strokeW *= 1.06;
        }
        outerIconY.push(iconY);
        outerIconS.push(iconS);
        outerStrokeW.push(strokeW);
      }

      const discoveryLabelTop = inkBottom(outerIconY[0], outerIconS[0], ICON_BOTTOM_FRAC_OUTER[0]) + ICON_LABEL_GAP;

      for (let idx = 0; idx < 3; idx++) {
        const p = nodes[idx];
        const baseR = outerBaseR;
        const rot = rm ? idx * 0.5 : t * (0.35 + idx * 0.08) + idx;

        const glowR = baseR * 2.4;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
        g.addColorStop(0, `rgba(139, 92, 246, ${0.07 + pulseGlobal * 0.06})`);
        g.addColorStop(0.45, `rgba(139, 92, 246, ${0.025 + pulseGlobal * 0.02})`);
        g.addColorStop(1, 'rgba(139, 92, 246, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
        ctx.fill();

        drawMandalaSubtle(p.x, p.y, baseR * 2.1, rot, outerPulse, INK_MED, breathFast);

        /* Placement reference: same `baseR * 0.92` as before; no filled / stroked disc. */

        drawOuterMandalaGuide(
          p.x,
          p.y,
          baseR,
          rot,
          outerPulse,
          breathFast,
          centroid.x,
          centroid.y,
          t,
          rm,
          idx,
        );

        drawIcon(NODE_ICONS[idx], p.x, outerIconY[idx], outerIconS[idx], INK, outerStrokeW[idx]);

        ctx.save();
        ctx.font = labelFont;
        ctx.fillStyle = INK;
        ctx.globalAlpha = 1;
        ctx.textAlign = 'center';
        const label = LABELS[idx];
        const tx = p.x;
        if (idx === 1 || idx === 2) {
          const baselineY =
            inkBottom(outerIconY[idx], outerIconS[idx], ICON_BOTTOM_FRAC_OUTER[idx]) + ICON_LABEL_GAP + labelAscent;
          ctx.textBaseline = 'alphabetic';
          ctx.fillText(label, tx, baselineY);
        } else {
          ctx.textBaseline = 'top';
          ctx.fillText(label, tx, discoveryLabelTop);
        }
        ctx.globalAlpha = 1;
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      ro.disconnect();
      wrap.removeEventListener('mousemove', onMove);
      wrap.removeEventListener('mouseleave', onLeave);
      wrap.removeEventListener('touchmove', onTouch);
      wrap.removeEventListener('touchstart', onTouch);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative h-full min-h-[200px] w-full touch-none select-none overflow-visible"
      role="img"
      aria-label="System diagram: Shared mission at the center with a strong mandala halo; Discovery, Activation, and Participation are linked by purple tendrils."
    >
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
    </div>
  );
}
