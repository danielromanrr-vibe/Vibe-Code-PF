/**
 * Adopt-a-School — System diagram (canvas).
 * Left–right polarity: Business (organic) ↔ Shared mission (gravity) ↔ Backpack warehouse (structured).
 * Discovery, digital engagement, and ongoing support are transformation states on an orbit — not a vertical sequence.
 * Mandala vocabulary (thin strokes, soft glow, cyclical flow).
 */
import { useEffect, useRef } from 'react';
import { NOUN_HANDSHAKE_PATHS, NOUN_HANDSHAKE_VIEWBOX } from '../data/nounHandshakePaths';
import {
  adoptBreathFast,
  adoptCenterPulse,
  adoptMandalaBeat,
  adoptPulseGlobal,
} from '../utils/adoptDiagramMotion';

const ACCENT = '#8b5cf6';
/** Brighter violet for center mandala strokes. */
const ACCENT_NEON = '#c4b5fd';
const ACCENT_NEON_CORE = '#e9d5ff';
/** Editorial ink — aligned with case study headings / body */
const INK = 'rgb(18, 18, 18)';
const INK_LABEL = 'rgb(18, 18, 18)';
const INK_CAPTION = 'rgba(20, 20, 20, 0.72)';
const INK_FAINT = 'rgba(20, 20, 20, 0.2)';
const INK_MED = 'rgba(20, 20, 20, 0.42)';
/** North pole only — electric blue accents (distinct from mission violet). */
const NORTH_ELECTRIC_BLUE = '#2563eb';
const NORTH_ELECTRIC_FAINT = 'rgba(37, 99, 235, 0.22)';
/** South pole cluster — red accents (distinct from north blue). */
const SOUTH_VOLUNTEER_RED = '#dc2626';
const SOUTH_RED_FAINT = 'rgba(220, 38, 38, 0.26)';
/** Pole captions — [warehouse right], [business left] line breaks. */
const POLE_LABEL_LINES: [readonly string[], readonly string[]] = [
  ['Backpack', 'warehouse'],
  ['Business', 'location'],
] as const;
const CENTER_LABEL = 'Ambient discovery';
/** State label — avoids “funnel” / linear journey metaphor. */
const DIGITAL_STATE_LABEL = 'Digital engagement';
const ONGOING_SUPPORT_LABEL = 'Ongoing support';
/** 4 = square (warehouse), 5 = diamond, 0 = apple, 6 = smartphone (digital funnel). */
const NODE_ICONS = [4, 5] as const;

/** Extra canvas inset so nodes, halos, and labels clear edges (readability + touch). */
const DIAGRAM_MARGIN = 56;

/** Multiplier for space between node centers (accessibility). */
const NODE_SPACING_SCALE = 1.7;

/** Uniform icon-to-label gap across the diagram (CSS px). */
const ICON_LABEL_GAP = 2;

/** Shift Business left and warehouse right from center (CSS px). */
const POLE_OUTER_SHIFT_PX = 100;
/** Expands all peripheral nodes outward from Shared mission. */
const POLARITY_NODE_EXPANSION = 1.26;
/** Extra outward push for left/right polarity poles from center. */
const POLE_CENTER_DISTANCE_MULT = 1.18;

/** Min inset from canvas edge for state nodes + labels (all quadrants). */
const STATE_EDGE_RESERVE_PX = 72;
/** Shared mission icon/text sit slightly below the mandala center. */
const CENTER_NODE_Y_SHIFT_PX = 10;
/** Push top/bottom state nodes farther from center for cleaner bypass ellipses. */
const DIGITAL_VERTICAL_MULT = 1.2;
const SUPPORT_VERTICAL_MULT = 1.24;

/**
 * Left–right polarity on the horizontal midline; Shared mission at geometric center.
 * State nodes sit in the field as transformation points (not a top-to-bottom sequence).
 */
function diagramLayout(w: number, h: number, px: number) {
  const margin = DIAGRAM_MARGIN;
  const innerW = Math.max(1, w - 2 * margin);
  const innerH = Math.max(1, h - 2 * margin);
  const cx = w / 2;
  const cy = h / 2;
  const S = NODE_SPACING_SCALE;

  const maxArm = Math.max(64, (cx - margin - 12) * 0.9);
  let mainGap = Math.min(innerW * 0.1 * S, px * 0.095 * S, 72);
  if (mainGap > maxArm * 0.96) mainGap *= (maxArm * 0.96) / mainGap;

  const shift = POLE_OUTER_SHIFT_PX * POLARITY_NODE_EXPANSION;
  const radiusX = Math.min(innerW * 0.38, mainGap * POLARITY_NODE_EXPANSION + shift);
  const radiusY = Math.min(innerH * 0.32, px * 0.24 * POLARITY_NODE_EXPANSION);
  const at = (angle: number) => ({
    x: cx + Math.cos(angle) * radiusX,
    y: cy + Math.sin(angle) * radiusY,
  });
  let business = { x: cx - radiusX * POLE_CENTER_DISTANCE_MULT, y: cy };
  let warehouse = { x: cx + radiusX * POLE_CENTER_DISTANCE_MULT, y: cy };
  let discovery = at(-2.2);
  const centerVerticalOffset = radiusY * 1.06;
  let digitalFunnel = { x: cx, y: cy - centerVerticalOffset * DIGITAL_VERTICAL_MULT };
  let ongoingSupport = { x: cx, y: cy + centerVerticalOffset * SUPPORT_VERTICAL_MULT };

  const clampX = (x: number) => Math.min(w - margin - STATE_EDGE_RESERVE_PX, Math.max(margin + STATE_EDGE_RESERVE_PX, x));
  const clampY = (y: number) => Math.min(h - margin - STATE_EDGE_RESERVE_PX, Math.max(margin + STATE_EDGE_RESERVE_PX, y));
  business = { x: clampX(business.x), y: clampY(business.y) };
  warehouse = { x: clampX(warehouse.x), y: clampY(warehouse.y) };
  discovery = { x: clampX(discovery.x), y: clampY(discovery.y) };
  digitalFunnel = { x: clampX(digitalFunnel.x), y: clampY(digitalFunnel.y) };
  ongoingSupport = { x: clampX(ongoingSupport.x), y: clampY(ongoingSupport.y) };

  return {
    mission: { x: cx, y: cy },
    discovery,
    business,
    warehouse,
    digitalFunnel,
    ongoingSupport,
  };
}

function dist(ax: number, ay: number, bx: number, by: number) {
  const dx = ax - bx;
  const dy = ay - by;
  return Math.sqrt(dx * dx + dy * dy);
}

/** Cubic Bézier point helper for packet travel on tendrils. */
function cubicPoint(
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number },
  u: number,
) {
  const o = 1 - u;
  const oo = o * o;
  const uu = u * u;
  return {
    x: oo * o * p0.x + 3 * oo * u * p1.x + 3 * o * uu * p2.x + u * uu * p3.x,
    y: oo * o * p0.y + 3 * oo * u * p1.y + 3 * o * uu * p2.y + u * uu * p3.y,
  };
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

/** Matches `p` / `--text-body` in index.css (Manrope body size). */
function readBodyFontSizePx(): number {
  if (typeof document === 'undefined') return 18;
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--text-body').trim();
  const n = parseFloat(raw);
  return Number.isFinite(n) && n > 0 ? n : 18;
}

/** Pole captions — adopt-card-lede scale (~14px). */
function captionFontSizePx(bodyPx: number): number {
  const n = Math.round(bodyPx * 0.78);
  return n >= 13 ? n : 14;
}

/** State / node titles — h4 tier (Manrope 600). */
function fontHeadingLabel(): string {
  return '600 15px "Manrope", system-ui, sans-serif';
}

function fontBodyCaption(captionPx: number): string {
  return `400 ${captionPx}px "Manrope", system-ui, sans-serif`;
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
      } else if (type === 3) {
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
      } else if (type === 4) {
        /* Simple square — warehouse / staging (128×128 viewBox). */
        ctx.translate(x, y - s * 0.04);
        ctx.scale(scale, scale);
        ctx.translate(-64, -64);
        ctx.lineWidth = lineWidth / scale;
        ctx.beginPath();
        ctx.rect(36, 36, 56, 56);
        ctx.stroke();
      } else if (type === 5) {
        /* Diamond — host / activation site (128×128 viewBox). */
        ctx.translate(x, y - s * 0.04);
        ctx.scale(scale, scale);
        ctx.translate(-64, -64);
        ctx.lineWidth = lineWidth / scale;
        ctx.beginPath();
        ctx.moveTo(64, 34);
        ctx.lineTo(90, 64);
        ctx.lineTo(64, 94);
        ctx.lineTo(38, 64);
        ctx.closePath();
        ctx.stroke();
      } else if (type === 6) {
        /* Smartphone silhouette (iPhone-like): chassis, screen, dynamic island, home bar. 128×128 viewBox. */
        ctx.translate(x, y - s * 0.04);
        ctx.scale(scale, scale);
        ctx.translate(-64, -64);
        ctx.lineWidth = lineWidth / scale;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.roundRect(44, 20, 40, 90, 8);
        ctx.stroke();
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.roundRect(48, 34, 32, 62, 4);
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.roundRect(54, 26, 20, 6, 3);
        ctx.stroke();
        ctx.beginPath();
        ctx.roundRect(52, 104, 24, 3.5, 1.75);
        ctx.stroke();
      } else {
        ctx.translate(x, y - s * 0.04);
        ctx.scale(scale, scale);
        ctx.translate(-64, -64);
        ctx.lineWidth = lineWidth / scale;
        const main = new Path2D('M64 26 L74 54 L102 64 L74 74 L64 102 L54 74 L26 64 L54 54 Z');
        ctx.stroke(main);
      }
      ctx.restore();
    };

    /** Pole halo: north = lighter / open; south = denser / grounded. */
    const drawMandalaSubtle = (
      x: number,
      y: number,
      baseR: number,
      rot: number,
      pulse: number,
      faint: string,
      breath: number,
      pole: 'north' | 'south',
    ) => {
      const layers = pole === 'south' ? 3 : 2;
      const alphaMul = pole === 'south' ? 1.12 : 0.92;
      for (let li = 0; li < layers; li++) {
        const lr =
          baseR *
          (pole === 'north' ? 0.5 + li * 0.28 : 0.44 + li * 0.22) *
          (0.96 + breath * 0.05);
        const rotL = rot * (0.5 + li * 0.3) + li * 0.7;
        const stretch = 1 + Math.sin(rotL * 1.9 + li) * (pole === 'north' ? 0.04 : 0.028);
        ctx.strokeStyle = faint;
        ctx.lineWidth = li === 0 ? 0.42 : pole === 'south' ? 0.4 : 0.34;
        ctx.globalAlpha = (0.2 + pulse * 0.12 - li * 0.03) * alphaMul;
        ctx.setLineDash(li === 0 ? [4, 7] : [11, 6]);
        ctx.beginPath();
        ctx.ellipse(x, y, lr * stretch, lr * (2 - stretch) * 0.93, rotL, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      ctx.globalAlpha = 1;
    };

    /**
     * Pole “container” as partial mandala arcs (opens toward field outside), not a full ring.
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
      pole: 'north' | 'south',
    ) => {
      const outward = Math.atan2(y - cy, x - cx);
      const rDisc = baseR * 0.92;
      const poleKind = pole;
      const dense = poleKind === 'south' ? 1.1 : 1;
      for (let li = 0; li < 3; li++) {
        const rr = rDisc * (1.02 + li * 0.095);
        const span =
          (poleKind === 'north' ? Math.PI * 0.42 : Math.PI * 0.33) + breath * 0.05 + li * 0.04;
        const start = outward - span / 2 + rot * (0.12 + li * 0.11) + seed * 0.2;
        const end = outward + span / 2 + rot * (0.12 + li * 0.11) + seed * 0.2;
        ctx.strokeStyle = li === 0 ? INK : INK_MED;
        ctx.lineWidth = li === 0 ? 0.52 : 0.36;
        ctx.globalAlpha = (0.38 + pulse * 0.14 - li * 0.07) * dense;
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

    const render = (now: number) => {
      const rm = reducedMotionRef.current;
      const t = rm ? 0 : now / 1000;

      const px = baseSize();
      const breathFast = adoptBreathFast(t, rm);
      const layout = diagramLayout(wCss, hCss, px);
      const mpx = mouseRef.current.x;
      const mpy = mouseRef.current.y;

      const NODE_MOUSE_REACH = 460;
      const NODE_MAX_SHIFT = Math.min(px * 0.009, 4.5);
      const CENTER_MOUSE_REACH = 540;
      const CENTER_MAX_SHIFT = Math.min(px * 0.0055, 2.8);

      const ICON_MULT = 1.28;
      const OUTER_DISC_SCALE = 0.78;
      const R_NODE = px * 0.072;

      const pull = (lx: number, ly: number, reach = NODE_MOUSE_REACH, max = NODE_MAX_SHIFT) =>
        subtlePullTowardMouse(lx, ly, mpx, mpy, rm, reach, max);

      const pBiz = pull(layout.business.x, layout.business.y);
      const businessPole = {
        x: layout.business.x + pBiz.dx,
        y: layout.business.y + pBiz.dy,
      };
      const pWh = pull(layout.warehouse.x, layout.warehouse.y);
      const warehousePole = {
        x: layout.warehouse.x + pWh.dx,
        y: layout.warehouse.y + pWh.dy,
      };
      const pullDF = pull(layout.digitalFunnel.x, layout.digitalFunnel.y);
      const digitalFunnel = {
        x: layout.digitalFunnel.x + pullDF.dx,
        y: layout.digitalFunnel.y + pullDF.dy,
      };
      const pullSupport = pull(layout.ongoingSupport.x, layout.ongoingSupport.y);
      const ongoingSupport = {
        x: layout.ongoingSupport.x + pullSupport.dx,
        y: layout.ongoingSupport.y + pullSupport.dy,
      };

      const cPull = subtlePullTowardMouse(
        layout.mission.x,
        layout.mission.y,
        mpx,
        mpy,
        rm,
        CENTER_MOUSE_REACH,
        CENTER_MAX_SHIFT,
      );
      const centroid = { x: layout.mission.x + cPull.dx, y: layout.mission.y + cPull.dy };
      const layoutMission = layout.mission;

      /** Business — slightly larger icon than north row for legibility. */
      const SOUTH_ICON_SCALE = 1.08;
      /** Icon anchor sits slightly above node center (harmonizes with notional disc radius). */
      const ICON_CENTER_OFFSET_RATIO = 0.06;
      /** Slightly lower anchor — pulls Discovery icon toward its label. */
      const ICON_CENTER_OFFSET_RATIO_MISSION = 0.038;
      /** Ink extent below anchor → bottom of glyph (per icon; balances optical center in the halo). */
      const ICON_BOTTOM_FRAC_OUTER: [number, number] = [0.52, 0.49];
      const ICON_BOTTOM_FRAC_CENTER = 0.52;
      const bodyPx = bodyFontSizePxRef.current;
      const capPx = captionFontSizePx(bodyPx);
      const fontCaption = fontBodyCaption(capPx);
      const fontStateLabel = fontHeadingLabel();
      const ICON_STROKE = 0.92;

      const inkBottom = (anchorY: number, iconS: number, frac: number) => anchorY + iconS * frac;

      ctx.font = fontCaption;
      const captionProbe = ctx.measureText('Mg');
      const captionAscent =
        typeof captionProbe.fontBoundingBoxAscent === 'number' ? captionProbe.fontBoundingBoxAscent : capPx * 0.72;
      ctx.font = fontStateLabel;
      const headingProbe = ctx.measureText('Mg');
      const headingAscent =
        typeof headingProbe.fontBoundingBoxAscent === 'number' ? headingProbe.fontBoundingBoxAscent : 15 * 0.72;

      const poleLineGap = capPx * (1.22 + (NODE_SPACING_SCALE - 1) * 0.35);

      ctx.clearRect(0, 0, wCss, hCss);

      const pulseGlobal = adoptPulseGlobal(t, rm);
      const pulseCenter = adoptCenterPulse(t, rm);
      const mandalaBeat = adoptMandalaBeat(t, rm);

      const ringBaseR = R_NODE * OUTER_DISC_SCALE;

      /** Shared mission gravity — orbital rings (diffused field, behind connections). */
      if (!rm) {
        for (let ri = 0; ri < 8; ri++) {
          const rr = R_NODE * (2.05 + ri * 0.62) * (1 + pulseCenter * 0.055 + ri * 0.014);
          const wobble = Math.sin(t * 0.55 + ri * 0.9) * 0.024;
          ctx.strokeStyle = ACCENT_NEON;
          ctx.lineWidth = ri < 3 ? 0.38 : 0.3;
          ctx.globalAlpha = (0.068 - ri * 0.005) * (0.78 + mandalaBeat * 0.28) * 0.88;
          ctx.setLineDash(ri % 2 === 0 ? [6, 10] : [14, 8]);
          ctx.lineDashOffset = -(t * (4 + ri)) % 40;
          ctx.beginPath();
          ctx.ellipse(centroid.x, centroid.y, rr, rr * (0.97 + wobble), t * 0.022 + ri * 0.18, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
      }

      const drawCenterParticleField = (cx: number, cy: number, baseR: number, time: number, rmLocal: boolean) => {
        const n = rmLocal ? 8 : 14;
        for (let i = 0; i < n; i++) {
          const seed = i * 1.618033 + i * i * 0.01;
          const ang = seed * 4.712 + time * (rmLocal ? 0 : 0.25) + i * 0.4;
          const jitter = Math.sin(seed * 11 + time * 1.2);
          const rad = baseR * (0.06 + (seed % 1) ** 2.1 * 0.44) + jitter * baseR * 0.02;
          const px = cx + Math.cos(ang) * rad;
          const py = cy + Math.sin(ang) * rad;
          ctx.fillStyle = `rgba(233, 213, 255, ${0.05 + (seed % 1) * 0.12})`;
          ctx.beginPath();
          ctx.arc(px, py, 0.45 + (seed % 1) * 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      };
      drawCenterParticleField(centroid.x, centroid.y, R_NODE * 2.5, t, rm);

      const drawCenterTendril = (
        from: { x: number; y: number },
        accent: string,
        faint: string,
        phase: number,
        curveSign: number,
      ) => {
        const dx = centroid.x - from.x;
        const dy = centroid.y - from.y;
        const len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;
        const c1 = {
          x: from.x + dx * 0.34 + nx * curveSign * ringBaseR * 0.78,
          y: from.y + dy * 0.34 + ny * curveSign * ringBaseR * 0.78,
        };
        const c2 = {
          x: from.x + dx * 0.76 + nx * curveSign * ringBaseR * 0.32,
          y: from.y + dy * 0.76 + ny * curveSign * ringBaseR * 0.32,
        };
        const tendril = { p0: from, p1: c1, p2: c2, p3: centroid };

        ctx.beginPath();
        ctx.moveTo(tendril.p0.x, tendril.p0.y);
        ctx.bezierCurveTo(tendril.p1.x, tendril.p1.y, tendril.p2.x, tendril.p2.y, tendril.p3.x, tendril.p3.y);
        ctx.strokeStyle = faint;
        ctx.globalAlpha = 0.28;
        ctx.lineWidth = 0.9;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(tendril.p0.x, tendril.p0.y);
        ctx.bezierCurveTo(tendril.p1.x, tendril.p1.y, tendril.p2.x, tendril.p2.y, tendril.p3.x, tendril.p3.y);
        ctx.strokeStyle = accent;
        ctx.globalAlpha = 0.42;
        ctx.lineWidth = 1.1;
        ctx.setLineDash([10, 16]);
        ctx.lineDashOffset = rm ? 0 : -(t * 4.2 + phase * 9);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;

        // Final 20% toward center gets extra saturation/weight to imply acceleration and pull.
        const endBoostColorMid = accent === SOUTH_VOLUNTEER_RED ? 'rgba(220, 38, 38, 0.68)' : 'rgba(37, 99, 235, 0.68)';
        const endBoostColorEnd = accent === SOUTH_VOLUNTEER_RED ? 'rgba(220, 38, 38, 0.9)' : 'rgba(37, 99, 235, 0.9)';
        const endBoost = ctx.createLinearGradient(from.x, from.y, centroid.x, centroid.y);
        endBoost.addColorStop(0, 'rgba(0,0,0,0)');
        endBoost.addColorStop(0.78, 'rgba(0,0,0,0)');
        endBoost.addColorStop(0.9, endBoostColorMid);
        endBoost.addColorStop(1, endBoostColorEnd);
        ctx.beginPath();
        ctx.moveTo(tendril.p0.x, tendril.p0.y);
        ctx.bezierCurveTo(tendril.p1.x, tendril.p1.y, tendril.p2.x, tendril.p2.y, tendril.p3.x, tendril.p3.y);
        ctx.strokeStyle = endBoost;
        ctx.globalAlpha = 1;
        ctx.lineWidth = 1.42;
        ctx.stroke();

        const packetBase = rm ? 0.18 : (t * 0.09 + phase * 0.17) % 1;
        const packetUs = [packetBase, (packetBase + 0.34) % 1, (packetBase + 0.62) % 1];
        for (let pi = 0; pi < packetUs.length; pi++) {
          const u = packetUs[pi] ?? 0.5;
          const pkt = cubicPoint(tendril.p0, tendril.p1, tendril.p2, tendril.p3, u);
          const centerBias = 0.28 + u * 0.9;
          const g = ctx.createRadialGradient(pkt.x, pkt.y, 0, pkt.x, pkt.y, ringBaseR * (0.42 + centerBias * 0.28));
          g.addColorStop(0, accent);
          g.addColorStop(0.45, `rgba(167, 139, 250, ${0.1 + centerBias * 0.18})`);
          g.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = g;
          ctx.globalAlpha = 0.2 + centerBias * 0.58;
          ctx.beginPath();
          ctx.arc(pkt.x, pkt.y, ringBaseR * (0.1 + centerBias * 0.16), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      };
      drawCenterTendril(businessPole, SOUTH_VOLUNTEER_RED, SOUTH_RED_FAINT, 0.18, -1);
      drawCenterTendril(warehousePole, NORTH_ELECTRIC_BLUE, NORTH_ELECTRIC_FAINT, 0.62, 1);
      const drawCenterToDigitalTendril = (phase: number, curveSign: number) => {
        const dx = digitalFunnel.x - centroid.x;
        const dy = digitalFunnel.y - centroid.y;
        const len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;
        const c1 = {
          x: centroid.x + dx * 0.34 + nx * curveSign * ringBaseR * 0.56,
          y: centroid.y + dy * 0.34 + ny * curveSign * ringBaseR * 0.56,
        };
        const c2 = {
          x: centroid.x + dx * 0.78 + nx * curveSign * ringBaseR * 0.24,
          y: centroid.y + dy * 0.78 + ny * curveSign * ringBaseR * 0.24,
        };

        ctx.beginPath();
        ctx.moveTo(centroid.x, centroid.y);
        ctx.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, digitalFunnel.x, digitalFunnel.y);
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.14)';
        ctx.globalAlpha = 0.24;
        ctx.lineWidth = 0.9;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(centroid.x, centroid.y);
        ctx.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, digitalFunnel.x, digitalFunnel.y);
        ctx.strokeStyle = ACCENT;
        ctx.globalAlpha = 0.36;
        ctx.lineWidth = 1.06;
        ctx.setLineDash([8, 14]);
        ctx.lineDashOffset = rm ? 0 : -(t * 4.6 + phase * 10);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;

        const u = rm ? 0.56 : (t * 0.052 + phase) % 1;
        const pkt = cubicPoint(
          { x: centroid.x, y: centroid.y },
          c1,
          c2,
          { x: digitalFunnel.x, y: digitalFunnel.y },
          u,
        );
        const g = ctx.createRadialGradient(pkt.x, pkt.y, 0, pkt.x, pkt.y, ringBaseR * 0.54);
        g.addColorStop(0, 'rgba(167, 139, 250, 0.62)');
        g.addColorStop(0.45, 'rgba(139, 92, 246, 0.2)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(pkt.x, pkt.y, ringBaseR * 0.18, 0, Math.PI * 2);
        ctx.fill();
      };
      drawCenterToDigitalTendril(0.24, -1);

      /**
       * Wide outer arcs: Digital engagement ↔ Ongoing support, bypassing left/right poles (reference: teal → purple).
       */
      const drawDigitalToSupportBypassArc = (side: 'left' | 'right', phase: number) => {
        const p0 = digitalFunnel;
        const p3 = ongoingSupport;
        const midY = (p0.y + p3.y) / 2;
        ctx.font = fontCaption;
        const leftTextHalf = Math.max(
          ctx.measureText(POLE_LABEL_LINES[1][0]).width,
          ctx.measureText(POLE_LABEL_LINES[1][1]).width,
        ) / 2;
        const rightTextHalf = Math.max(
          ctx.measureText(POLE_LABEL_LINES[0][0]).width,
          ctx.measureText(POLE_LABEL_LINES[0][1]).width,
        ) / 2;
        const leftGlowReserve = ringBaseR * 2.35;
        const rightGlowReserve = ringBaseR * 2.3;
        const labelReserve = 20;
        const leftClearX = businessPole.x - (leftTextHalf + leftGlowReserve + labelReserve);
        const rightClearX = warehousePole.x + (rightTextHalf + rightGlowReserve + labelReserve);
        const pad = ringBaseR * 4.1;
        const sideDominance = ringBaseR * 0.7;
        const outwardX =
          side === 'left'
            ? Math.min(leftClearX - pad - sideDominance, centroid.x - ringBaseR * 7.2)
            : Math.max(rightClearX + pad + sideDominance, centroid.x + ringBaseR * 7.2);
        const curvePull = side === 'left' ? 0.37 : 0.39;
        const shoulderEase = 0.9;
        const p1 = {
          x: p0.x + (outwardX - p0.x) * shoulderEase,
          y: p0.y + (midY - p0.y) * curvePull,
        };
        const p2 = {
          x: p3.x + (outwardX - p3.x) * shoulderEase,
          y: p3.y - (p3.y - midY) * curvePull,
        };

        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.12)';
        ctx.globalAlpha = 0.42;
        ctx.lineWidth = 1.05;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
        ctx.strokeStyle = ACCENT;
        ctx.globalAlpha = 0.48;
        ctx.lineWidth = 1.12;
        ctx.setLineDash([9, 15]);
        ctx.lineDashOffset = rm ? 0 : -(t * 3.8 + phase * 14);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;

        const flowBase = rm ? 0.18 : (t * 0.052 + phase) % 1;
        const dotUs = [flowBase, (flowBase + 0.24) % 1, (flowBase + 0.44) % 1];
        const dotAlpha = [0.14, 0.34, 0.08];
        for (let di = 0; di < dotUs.length; di++) {
          const u = dotUs[di] ?? 0.2;
          const pt = cubicPoint(p0, p1, p2, p3, u);
          const a = dotAlpha[di] ?? 0.2;
          const g = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, ringBaseR * 0.42);
          g.addColorStop(0, `rgba(196, 181, 253, ${a * 0.45})`);
          g.addColorStop(0.28, `rgba(167, 139, 250, ${a})`);
          g.addColorStop(0.62, `rgba(139, 92, 246, ${a * 0.08})`);
          g.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, ringBaseR * (0.11 + (di % 2) * 0.03), 0, Math.PI * 2);
          ctx.fill();
        }
      };
      drawDigitalToSupportBypassArc('left', 0.08);
      drawDigitalToSupportBypassArc('right', 0.72);

      const drawOrbitingGlowDots = (
        node: { x: number; y: number },
        colorInner: string,
        colorMid: string,
        count: number,
        speed: number,
        radiusMul: number,
        subtleMul: number,
      ) => {
        for (let i = 0; i < count; i++) {
          const phase = i / count;
          const baseAng = rm ? phase * Math.PI * 2 : t * speed + phase * Math.PI * 2;
          const drift = rm ? 0 : Math.sin(t * 0.19 + i * 1.37) * 0.14 + Math.cos(t * 0.11 + i * 0.9) * 0.08;
          const ang = baseAng + drift + (i % 2 === 0 ? 0 : 0.18);
          const rx = ringBaseR * radiusMul * (1 + (i % 3) * 0.09);
          const ry = rx * (0.72 + (i % 2) * 0.08);
          const x = node.x + Math.cos(ang) * rx;
          const y = node.y + Math.sin(ang) * ry;
          const g = ctx.createRadialGradient(x, y, 0, x, y, ringBaseR * 0.42);
          g.addColorStop(0, colorInner);
          g.addColorStop(0.45, colorMid);
          g.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = g;
          ctx.globalAlpha = subtleMul;
          ctx.beginPath();
          ctx.arc(x, y, ringBaseR * 0.16, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      };
      drawOrbitingGlowDots(
        businessPole,
        'rgba(220, 38, 38, 0.32)',
        'rgba(220, 38, 38, 0.1)',
        5,
        0.23,
        1.68,
        0.52,
      );
      drawOrbitingGlowDots(
        warehousePole,
        'rgba(37, 99, 235, 0.32)',
        'rgba(37, 99, 235, 0.1)',
        5,
        0.21,
        1.62,
        0.58,
      );

      const centerAnchorY = centroid.y + CENTER_NODE_Y_SHIFT_PX;
      const centerIconY = centerAnchorY - R_NODE * ICON_CENTER_OFFSET_RATIO_MISSION;
      const centerIconS = R_NODE * ICON_MULT;
      const centerFirstLineTop = inkBottom(centerIconY, centerIconS, ICON_BOTTOM_FRAC_CENTER) + ICON_LABEL_GAP;

      let rotC = rm ? 0.2 : t * 0.38;
      let pulseSm = 0.42 + pulseGlobal * 0.28;
      if (!rm && mpx > -1e5) {
        const dCenter = dist(mpx, mpy, layoutMission.x, layoutMission.y);
        const inf = Math.max(0, 1 - dCenter / 520) ** 1.28;
        rotC += (mpx - layoutMission.x) * 0.00002 * inf + (mpy - layoutMission.y) * 0.000018 * inf;
        pulseSm += inf * 0.028;
      }
      // Subtle red/blue convergence blend; only here colors mix into faint purple.
      const blendOffset = ringBaseR * 0.36;
      const redMix = ctx.createRadialGradient(
        centroid.x - blendOffset,
        centroid.y + ringBaseR * 0.06,
        0,
        centroid.x - blendOffset,
        centroid.y + ringBaseR * 0.06,
        ringBaseR * 1.25,
      );
      redMix.addColorStop(0, 'rgba(220, 38, 38, 0.12)');
      redMix.addColorStop(1, 'rgba(220, 38, 38, 0)');
      ctx.fillStyle = redMix;
      ctx.beginPath();
      ctx.arc(centroid.x - blendOffset, centroid.y, ringBaseR * 1.3, 0, Math.PI * 2);
      ctx.fill();

      const blueMix = ctx.createRadialGradient(
        centroid.x + blendOffset,
        centroid.y - ringBaseR * 0.03,
        0,
        centroid.x + blendOffset,
        centroid.y - ringBaseR * 0.03,
        ringBaseR * 1.25,
      );
      blueMix.addColorStop(0, 'rgba(37, 99, 235, 0.12)');
      blueMix.addColorStop(1, 'rgba(37, 99, 235, 0)');
      ctx.fillStyle = blueMix;
      ctx.beginPath();
      ctx.arc(centroid.x + blendOffset, centroid.y, ringBaseR * 1.3, 0, Math.PI * 2);
      ctx.fill();

      const drawMandalaCore = (
        x: number,
        y: number,
        baseR: number,
        rot: number,
        pulse: number,
        breath: number,
        time: number,
        rmLocal: boolean,
      ) => {
        const beat = adoptMandalaBeat(time, rmLocal);
        const neonPulse = 0.55 + pulse * 0.35 + beat * 0.2;
        const layers = 5;
        for (let li = 0; li < layers; li++) {
          const lr = baseR * (0.36 + li * 0.17) * (0.97 + breath * 0.06 + beat * (0.04 + li * 0.012));
          const rotL = rot * (0.55 + li * 0.32) + li * 0.85;
          const stretch = 1 + Math.sin(rotL * 2.1 + li) * (0.055 + beat * 0.03);
          const v = li / Math.max(1, layers - 1);
          const rx = lr * stretch;
          const ry = lr * (2 - stretch) * 0.91;
          const dashAnim = rmLocal ? 0 : -(time * (10 + li * 3)) % 120;
          const strokeEllipseNeon = (width: number, alpha: number, style: string, glow: boolean) => {
            ctx.save();
            ctx.strokeStyle = style;
            ctx.lineWidth = width;
            ctx.globalAlpha = alpha;
            ctx.setLineDash(li % 2 === 0 ? [3, 6] : [9, 5]);
            ctx.lineDashOffset = dashAnim;
            if (glow && !rmLocal) {
              ctx.shadowColor = `rgba(167, 139, 250, ${0.45 + neonPulse * 0.25})`;
              ctx.shadowBlur = 10 + beat * 8 + pulse * 6;
            }
            ctx.beginPath();
            ctx.ellipse(x, y, rx, ry, rotL, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          };
          strokeEllipseNeon(li === 0 ? 1.15 : li < 3 ? 0.95 : 0.78, (0.12 + pulse * 0.1 + beat * 0.08 - li * 0.025) * neonPulse, `rgba(196, 181, 253, ${0.55 + v * 0.2})`, true);
          strokeEllipseNeon(li === 0 ? 0.72 : li < 3 ? 0.52 : 0.4, 0.28 + pulse * 0.22 + beat * 0.14 - li * 0.03 + v * 0.05, li >= 2 ? ACCENT_NEON : v > 0.35 ? ACCENT : INK_MED, false);
          strokeEllipseNeon(li === 0 ? 0.38 : 0.32, (0.2 + beat * 0.12) * (li >= 2 ? 1.15 : 0.85), li >= 3 ? ACCENT_NEON_CORE : ACCENT_NEON, false);
          ctx.setLineDash([]);
          ctx.shadowBlur = 0;
        }
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      };
      drawMandalaCore(centroid.x, centroid.y, R_NODE * 2.35, rotC, pulseSm, breathFast, t, rm);
      drawIcon(0, centroid.x, centerIconY, centerIconS, INK, ICON_STROKE);
      ctx.save();
      ctx.font = fontStateLabel;
      ctx.fillStyle = INK_LABEL;
      ctx.globalAlpha = 1;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(CENTER_LABEL, centroid.x, centerFirstLineTop);
      ctx.restore();
      const outerPulse = 0.26 + pulseGlobal * 0.14;

      const northIconS = ringBaseR * ICON_MULT;
      const whIconY = warehousePole.y - ringBaseR * ICON_CENTER_OFFSET_RATIO;
      const southBizIconY = businessPole.y - ringBaseR * ICON_CENTER_OFFSET_RATIO;
      const southBizIconS = ringBaseR * ICON_MULT * SOUTH_ICON_SCALE;
      const southStrokeW = ICON_STROKE * 1.04;

      const warehouseLabelTop = inkBottom(whIconY, northIconS, ICON_BOTTOM_FRAC_OUTER[0]) + ICON_LABEL_GAP;

      const drawNorthPoleGlyph = (
        p: { x: number; y: number },
        iconType: number,
        iconAnchorY: number,
        strokeW: number,
        seedRot: number,
      ) => {
        const pole: 'north' | 'south' = 'north';
        const baseR = ringBaseR;
        const rot = rm ? seedRot : t * 0.36 + seedRot;
        const glowR = baseR * 2.2;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
        g.addColorStop(0, `rgba(139, 92, 246, ${0.065 + pulseGlobal * 0.06})`);
        g.addColorStop(0.45, `rgba(139, 92, 246, ${0.025 + pulseGlobal * 0.02})`);
        g.addColorStop(1, 'rgba(139, 92, 246, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
        ctx.fill();

        drawMandalaSubtle(p.x, p.y, baseR * 2.1, rot, outerPulse, INK_MED, breathFast, pole);

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
          seedRot * 2.1,
          pole,
        );

        drawIcon(iconType, p.x, iconAnchorY, northIconS, INK, strokeW);
      };

      const drawSouthPoleGlyph = (
        p: { x: number; y: number },
        iconType: number,
        iconAnchorY: number,
        strokeW: number,
        seedRot: number,
        iconS: number,
      ) => {
        const pole: 'north' | 'south' = 'south';
        const baseR = ringBaseR;
        const rot = rm ? seedRot : t * 0.35 + seedRot;
        const glowR = baseR * 1.8;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
        g.addColorStop(0, `rgba(139, 92, 246, ${0.09 + pulseGlobal * 0.06})`);
        g.addColorStop(0.45, `rgba(139, 92, 246, ${0.025 + pulseGlobal * 0.02})`);
        g.addColorStop(1, 'rgba(139, 92, 246, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
        ctx.fill();

        drawMandalaSubtle(p.x, p.y, baseR * 2.1, rot, outerPulse, INK_MED, breathFast, pole);

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
          seedRot * 2.1,
          pole,
        );

        drawIcon(iconType, p.x, iconAnchorY, iconS, INK, strokeW);
      };

      drawSouthPoleGlyph(businessPole, NODE_ICONS[1], southBizIconY, southStrokeW, 1.05, southBizIconS);
      drawNorthPoleGlyph(warehousePole, NODE_ICONS[0], whIconY, ICON_STROKE, 0.85);

      ctx.save();
      ctx.font = fontCaption;
      ctx.fillStyle = INK_CAPTION;
      ctx.globalAlpha = 1;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      POLE_LABEL_LINES[0].forEach((line, L) => {
        ctx.fillText(line, warehousePole.x, warehouseLabelTop + L * poleLineGap);
      });
      const bizLines = POLE_LABEL_LINES[1];
      const bizFirstBaseline =
        inkBottom(southBizIconY, southBizIconS, ICON_BOTTOM_FRAC_OUTER[1]) + ICON_LABEL_GAP + captionAscent;
      ctx.textBaseline = 'alphabetic';
      bizLines.forEach((line, L) => {
        ctx.fillText(line, businessPole.x, bizFirstBaseline + L * poleLineGap);
      });
      ctx.restore();

      const dfIconY = digitalFunnel.y - ringBaseR * ICON_CENTER_OFFSET_RATIO;
      drawNorthPoleGlyph(digitalFunnel, 6, dfIconY, ICON_STROKE, 0.55);
      const supportIconY = ongoingSupport.y - ringBaseR * ICON_CENTER_OFFSET_RATIO;
      drawNorthPoleGlyph(ongoingSupport, 2, supportIconY, ICON_STROKE, 0.95);

      ctx.save();
      ctx.font = fontStateLabel;
      ctx.fillStyle = INK_LABEL;
      ctx.globalAlpha = 1;
      ctx.textAlign = 'center';
      const dfFirstBaseline =
        inkBottom(dfIconY, northIconS, ICON_BOTTOM_FRAC_OUTER[0]) + ICON_LABEL_GAP + headingAscent;
      const supportFirstBaseline =
        inkBottom(supportIconY, northIconS, ICON_BOTTOM_FRAC_OUTER[0]) + ICON_LABEL_GAP + headingAscent;
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(DIGITAL_STATE_LABEL, digitalFunnel.x, dfFirstBaseline);
      ctx.fillText(ONGOING_SUPPORT_LABEL, ongoingSupport.x, supportFirstBaseline);
      ctx.restore();

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
      className="relative h-full min-h-[480px] w-full touch-none select-none overflow-visible"
      role="img"
      aria-label="System diagram: Ambient discovery is centered with an apple icon and orbital rings. Business location and Backpack warehouse sit left and right; Digital engagement is above center and Ongoing support below. Red and blue dashed tendrils run from each side pole toward the center. A purple tendril links the center to Digital engagement. Two wide purple arcs connect Digital engagement to Ongoing support, curving outward past the left and right poles. Red and blue glowing dots orbit Business location and Backpack warehouse."
    >
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
    </div>
  );
}
