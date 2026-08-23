/**
 * Adopt-a-School — System diagram (canvas).
 * Left–right polarity: Business (organic) ↔ Shared mission (gravity) ↔ Backpack warehouse (structured).
 * Discovery, digital engagement, and ongoing support are transformation states on an orbit — not a vertical sequence.
 * Mandala vocabulary (thin strokes, soft glow, cyclical flow).
 */
import { useEffect, useRef } from 'react';
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
const INK = 'rgb(20, 20, 20)';
const INK_LABEL = 'rgb(20, 20, 20)';
const INK_LABEL_MUTED = 'rgba(20, 20, 20, 0.48)';
const INK_CAPTION = 'rgba(20, 20, 20, 0.78)';
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
const CENTER_LABEL_LINES = ['Discovery of', "n.g.o's mission"];
/** State label — avoids “funnel” / linear journey metaphor. */
const DIGITAL_STATE_LABEL = 'Digital engagement';
const ONGOING_SUPPORT_LABEL = 'Ongoing support';

/** Extra canvas inset so nodes, halos, and labels clear edges (readability + touch). */
const DIAGRAM_MARGIN = 16;

/** Multiplier for space between node centers (accessibility). */
const NODE_SPACING_SCALE = 1.45;

/** Uniform icon-to-label gap across the diagram (CSS px). */
const ICON_LABEL_GAP = 2;

/** Min inset from canvas edge for state nodes + labels (all quadrants). */
const STATE_EDGE_RESERVE_PX = 16;
/** Shared mission icon/text sit slightly below the mandala center. */
const CENTER_NODE_Y_SHIFT_PX = 10;

/** Particles, tendril packets, convergence wash, and mandala-core neon in the mission field. */
const CENTER_FIELD_ANIM_INTENSITY = 0.5;

/**
 * Left–right polarity on the horizontal midline; Shared mission at geometric center.
 * State nodes sit in the field as transformation points (not a top-to-bottom sequence).
 */
function diagramLayout(w: number, h: number, _px: number) {
  const margin = DIAGRAM_MARGIN;
  const cx = w / 2;
  const cy = h / 2;

  const maxR = Math.min(w - 2 * margin, h - 2 * margin) / 2 - STATE_EDGE_RESERVE_PX;
  const R = Math.max(48, maxR * 0.96);
  const RY = R * 0.88;

  const at = (angleDeg: number) => {
    const a = (angleDeg * Math.PI) / 180;
    return { x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * RY };
  };

  return {
    mission: { x: cx, y: cy },
    business: at(180),
    warehouse: at(0),
    digitalFunnel: at(270),
    ongoingSupport: at(90),
    discovery: at(225),
    radius: R,
    radiusY: RY,
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
  if (typeof document === 'undefined') return 14;
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--text-body').trim();
  const n = parseFloat(raw);
  return Number.isFinite(n) && n > 0 ? n : 14;
}

/** All diagram labels — regular weight, same as page body (`--text-body`). */
function fontDiagramBody(px: number): string {
  return `400 ${px}px "Manrope", system-ui, sans-serif`;
}

export type DiagramHighlightNode = 'business' | 'warehouse' | 'discovery' | 'digital' | 'support';

export type AdoptSystemDiagramProps = {
  compact?: boolean;
  highlightedNode?: DiagramHighlightNode | null;
  /** Softer orbit, particles, and pole halos — for paired artifact layout. */
  quietVisuals?: boolean;
  /** Mouse/touch pull on nodes — off for static case-study pairing. */
  pointerInteractive?: boolean;
};

export default function AdoptSystemDiagram({
  compact = false,
  highlightedNode = null,
  quietVisuals = false,
  pointerInteractive = true,
}: AdoptSystemDiagramProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1e6, y: -1e6 });
  const reducedMotionRef = useRef(false);
  const highlightedNodeRef = useRef<DiagramHighlightNode | null>(null);
  const quietVisualsRef = useRef(false);
  const pointerInteractiveRef = useRef(true);
  const rafRef = useRef(0);
  const bodyFontSizePxRef = useRef(14);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    highlightedNodeRef.current = highlightedNode;
  }, [highlightedNode]);

  useEffect(() => {
    quietVisualsRef.current = quietVisuals;
  }, [quietVisuals]);

  useEffect(() => {
    pointerInteractiveRef.current = pointerInteractive;
    if (!pointerInteractive) {
      highlightedNodeRef.current = null;
      mouseRef.current.x = -1e6;
      mouseRef.current.y = -1e6;
    }
  }, [pointerInteractive]);

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

    const iconSrcs: Record<string, string> = {
      discovery: '/adopt-a-school/icons/Discovery-object-diagram.svg',
      business: '/adopt-a-school/icons/Business.svg',
      warehouse: '/adopt-a-school/icons/Warehouse.svg',
      digital: '/adopt-a-school/icons/Map-interface.svg',
      support: '/adopt-a-school/icons/Ongoing-support.svg',
    };
    const iconImgs: Record<string, HTMLImageElement> = {};
    for (const [key, src] of Object.entries(iconSrcs)) {
      const img = new Image();
      img.src = src;
      iconImgs[key] = img;
    }

    const drawSvgIcon = (key: string, x: number, y: number, size: number) => {
      const img = iconImgs[key];
      if (!img || !img.complete || !img.naturalWidth) return;
      const aspect = img.naturalWidth / img.naturalHeight;
      let w: number, h: number;
      if (aspect >= 1) {
        w = size;
        h = size / aspect;
      } else {
        h = size;
        w = size * aspect;
      }
      ctx.drawImage(img, x - w / 2, y - h / 2, w, h);
    };

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

    if (pointerInteractiveRef.current) {
      wrap.addEventListener('mousemove', onMove);
      wrap.addEventListener('mouseleave', onLeave);
      wrap.addEventListener('touchmove', onTouch, { passive: true });
      wrap.addEventListener('touchstart', onTouch, { passive: true });
    }

    const baseSize = () => Math.min(wCss, hCss);

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
      const alphaMul = pole === 'south' ? 0.85 : 0.7;
      for (let li = 0; li < layers; li++) {
        const lr =
          baseR *
          (pole === 'north' ? 0.5 + li * 0.28 : 0.44 + li * 0.22) *
          (0.96 + breath * 0.05);
        const rotL = rot * (0.5 + li * 0.3) + li * 0.7;
        const stretch = 1 + Math.sin(rotL * 1.9 + li) * (pole === 'north' ? 0.04 : 0.028);
        ctx.strokeStyle = faint;
        ctx.lineWidth = li === 0 ? 0.34 : pole === 'south' ? 0.3 : 0.26;
        ctx.globalAlpha = (0.14 + pulse * 0.08 - li * 0.025) * alphaMul;
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
        ctx.lineWidth = li === 0 ? 0.4 : 0.28;
        ctx.globalAlpha = (0.25 + pulse * 0.1 - li * 0.05) * dense;
        ctx.setLineDash(li === 0 ? [4, 7] : [9, 8]);
        ctx.lineDashOffset = rm ? 0 : -(time * 7 + li * 3 + seed * 2);
        ctx.beginPath();
        ctx.arc(x, y, rr, start, end);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.globalAlpha = 0.14 + pulse * 0.05;
      ctx.strokeStyle = INK_FAINT;
      ctx.lineWidth = 0.28;
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
      const fontDiagram = fontDiagramBody(bodyPx);

      const inkBottom = (anchorY: number, iconS: number, frac: number) => anchorY + iconS * frac;

      ctx.font = fontDiagram;
      const textProbe = ctx.measureText('Mg');
      const textAscent =
        typeof textProbe.fontBoundingBoxAscent === 'number' ? textProbe.fontBoundingBoxAscent : bodyPx * 0.72;

      const poleLineGap = bodyPx * (1.08 + (NODE_SPACING_SCALE - 1) * 0.3);

      ctx.clearRect(0, 0, wCss, hCss);

      const pulseGlobal = adoptPulseGlobal(t, rm);
      const pulseCenter = adoptCenterPulse(t, rm);
      const mandalaBeat = adoptMandalaBeat(t, rm);
      const hi = pointerInteractiveRef.current ? highlightedNodeRef.current : null;
      const quiet = quietVisualsRef.current;
      const decorMul = quiet ? 0.52 : 1;
      const nodeAlpha = (id: DiagramHighlightNode) => {
        if (!hi) return 1;
        return hi === id ? 1 : 0.34;
      };
      const labelFor = (id: DiagramHighlightNode) => (hi === id ? INK_LABEL : hi ? INK_LABEL_MUTED : INK_LABEL);
      const labelWeight = (id: DiagramHighlightNode) => (hi === id ? 600 : 500);

      const ringBaseR = R_NODE * OUTER_DISC_SCALE;

      const orbitR = layout.radius;
      const orbitRY = layout.radiusY;

      /** Shared mission gravity — elliptical orbit rings. */
      if (!rm) {
        for (let ri = 0; ri < (quiet ? 2 : 4); ri++) {
          const scale = (0.55 + ri * 0.2) * (1 + pulseCenter * 0.02);
          ctx.strokeStyle = ACCENT_NEON;
          ctx.lineWidth = ri < 2 ? 0.3 : 0.22;
          ctx.globalAlpha = (0.04 - ri * 0.005) * (0.78 + mandalaBeat * 0.18) * 0.7 * decorMul;
          ctx.setLineDash(ri % 2 === 0 ? [6, 12] : [14, 10]);
          ctx.lineDashOffset = -(t * (3 + ri)) % 50;
          ctx.beginPath();
          ctx.ellipse(centroid.x, centroid.y, orbitR * scale, orbitRY * scale, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
      }

      /** Main elliptical orbit path through all nodes. */
      ctx.strokeStyle = ACCENT_NEON;
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = (0.12 + pulseGlobal * 0.06) * decorMul;
      ctx.setLineDash([8, 14]);
      ctx.lineDashOffset = rm ? 0 : -(t * 5) % 60;
      ctx.beginPath();
      ctx.ellipse(centroid.x, centroid.y, orbitR, orbitRY, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;

      const drawCenterParticleField = (cx: number, cy: number, baseR: number, time: number, rmLocal: boolean) => {
        const n = rmLocal ? 6 : quiet ? 8 : 14;
        const tone = CENTER_FIELD_ANIM_INTENSITY;
        for (let i = 0; i < n; i++) {
          const seed = i * 1.618033 + i * i * 0.01;
          const ang = seed * 4.712 + time * (rmLocal ? 0 : 0.25) + i * 0.4;
          const jitter = Math.sin(seed * 11 + time * 1.2);
          const rad = baseR * (0.06 + (seed % 1) ** 2.1 * 0.44) + jitter * baseR * 0.02;
          const px = cx + Math.cos(ang) * rad;
          const py = cy + Math.sin(ang) * rad;
          ctx.fillStyle = `rgba(233, 213, 255, ${(0.05 + (seed % 1) * 0.12) * tone})`;
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
        const tone = CENTER_FIELD_ANIM_INTENSITY;
        ctx.strokeStyle = faint;
        ctx.globalAlpha = 0.28 * tone;
        ctx.lineWidth = 0.9;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(tendril.p0.x, tendril.p0.y);
        ctx.bezierCurveTo(tendril.p1.x, tendril.p1.y, tendril.p2.x, tendril.p2.y, tendril.p3.x, tendril.p3.y);
        ctx.strokeStyle = accent;
        ctx.globalAlpha = 0.42 * tone;
        ctx.lineWidth = 1.1;
        ctx.setLineDash([10, 16]);
        ctx.lineDashOffset = rm ? 0 : -(t * 4.2 + phase * 9);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;

        // Final 20% toward center gets extra saturation/weight to imply acceleration and pull.
        const endBoostColorMid = accent === SOUTH_VOLUNTEER_RED ? `rgba(220, 38, 38, ${0.68 * tone})` : `rgba(37, 99, 235, ${0.68 * tone})`;
        const endBoostColorEnd = accent === SOUTH_VOLUNTEER_RED ? `rgba(220, 38, 38, ${0.9 * tone})` : `rgba(37, 99, 235, ${0.9 * tone})`;
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
          g.addColorStop(0.45, `rgba(167, 139, 250, ${(0.1 + centerBias * 0.18) * tone})`);
          g.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = g;
          ctx.globalAlpha = (0.2 + centerBias * 0.58) * tone;
          ctx.beginPath();
          ctx.arc(pkt.x, pkt.y, ringBaseR * (0.1 + centerBias * 0.16), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      };
      drawCenterTendril(businessPole, SOUTH_VOLUNTEER_RED, SOUTH_RED_FAINT, 0.18, -1);
      drawCenterTendril(warehousePole, NORTH_ELECTRIC_BLUE, NORTH_ELECTRIC_FAINT, 0.62, 1);
      const drawCenterToDigitalTendril = (phase: number, curveSign: number) => {
        const tone = CENTER_FIELD_ANIM_INTENSITY;
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
        ctx.globalAlpha = 0.24 * tone;
        ctx.lineWidth = 0.9;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(centroid.x, centroid.y);
        ctx.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, digitalFunnel.x, digitalFunnel.y);
        ctx.strokeStyle = ACCENT;
        ctx.globalAlpha = 0.36 * tone;
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
        g.addColorStop(0, `rgba(167, 139, 250, ${0.62 * tone})`);
        g.addColorStop(0.45, `rgba(139, 92, 246, ${0.2 * tone})`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(pkt.x, pkt.y, ringBaseR * 0.18, 0, Math.PI * 2);
        ctx.fill();
      };
      drawCenterToDigitalTendril(0.24, -1);

      /**
       * Circular arc segments: semicircles connecting Digital → pole → Ongoing Support
       * using bezier-approximated quarter arcs for rounded corners at poles.
       */
      const K = 0.5523;
      const drawHalfOrbitArc = (side: 'left' | 'right', phase: number) => {
        const top = digitalFunnel;
        const bot = ongoingSupport;
        const pole = side === 'left' ? businessPole : warehousePole;
        const cpLenX = orbitR * K;
        const cpLenY = orbitRY * K;

        const cp1 = side === 'left'
          ? { x: top.x - cpLenX, y: top.y }
          : { x: top.x + cpLenX, y: top.y };
        const cp2 = side === 'left'
          ? { x: pole.x, y: pole.y - cpLenY }
          : { x: pole.x, y: pole.y - cpLenY };
        const cp3 = side === 'left'
          ? { x: pole.x, y: pole.y + cpLenY }
          : { x: pole.x, y: pole.y + cpLenY };
        const cp4 = side === 'left'
          ? { x: bot.x - cpLenX, y: bot.y }
          : { x: bot.x + cpLenX, y: bot.y };

        ctx.beginPath();
        ctx.moveTo(top.x, top.y);
        ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, pole.x, pole.y);
        ctx.bezierCurveTo(cp3.x, cp3.y, cp4.x, cp4.y, bot.x, bot.y);
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.1)';
        ctx.globalAlpha = 0.35;
        ctx.lineWidth = 0.9;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(top.x, top.y);
        ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, pole.x, pole.y);
        ctx.bezierCurveTo(cp3.x, cp3.y, cp4.x, cp4.y, bot.x, bot.y);
        ctx.strokeStyle = ACCENT;
        ctx.globalAlpha = 0.32;
        ctx.lineWidth = 0.9;
        ctx.setLineDash([8, 14]);
        ctx.lineDashOffset = rm ? 0 : -(t * 3.2 + phase * 12);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;

        const flowBase = rm ? 0.18 : (t * 0.042 + phase) % 1;
        const dotUs = [flowBase, (flowBase + 0.35) % 1];
        for (let di = 0; di < dotUs.length; di++) {
          const u = dotUs[di] ?? 0.2;
          let pt: { x: number; y: number };
          if (u < 0.5) {
            pt = cubicPoint(top, cp1, cp2, pole, u * 2);
          } else {
            pt = cubicPoint(pole, cp3, cp4, bot, (u - 0.5) * 2);
          }
          const g = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, ringBaseR * 0.36);
          g.addColorStop(0, 'rgba(196, 181, 253, 0.12)');
          g.addColorStop(0.4, 'rgba(167, 139, 250, 0.2)');
          g.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, ringBaseR * 0.1, 0, Math.PI * 2);
          ctx.fill();
        }
      };
      drawHalfOrbitArc('left', 0.08);
      drawHalfOrbitArc('right', 0.72);

      /**
       * Auxiliary flow indicators — static, editorial chevrons placed outside the orbit
       * to annotate direction without competing with the living diagram.
       */
      const drawAuxFlowChevron = (
        from: { x: number; y: number },
        to: { x: number; y: number },
        offsetSide: number,
      ) => {
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const len = Math.hypot(dx, dy) || 1;
        const ux = dx / len;
        const uy = dy / len;
        const nx = -uy;
        const ny = ux;

        const midX = (from.x + to.x) / 2 + nx * offsetSide;
        const midY = (from.y + to.y) / 2 + ny * offsetSide;

        const chevronLen = 5;
        const chevronSpread = 3.2;

        const tipX = midX + ux * chevronLen * 0.5;
        const tipY = midY + uy * chevronLen * 0.5;
        const leftX = midX - ux * chevronLen * 0.5 + nx * chevronSpread;
        const leftY = midY - uy * chevronLen * 0.5 + ny * chevronSpread;
        const rightX = midX - ux * chevronLen * 0.5 - nx * chevronSpread;
        const rightY = midY - uy * chevronLen * 0.5 - ny * chevronSpread;

        ctx.save();
        ctx.strokeStyle = INK_FAINT;
        ctx.lineWidth = 0.9;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = 0.55;
        ctx.beginPath();
        ctx.moveTo(leftX, leftY);
        ctx.lineTo(tipX, tipY);
        ctx.lineTo(rightX, rightY);
        ctx.stroke();
        ctx.restore();
      };

      const chevronOffset = orbitR * 0.14;
      drawAuxFlowChevron(centroid, digitalFunnel, chevronOffset);
      drawAuxFlowChevron(digitalFunnel, ongoingSupport, chevronOffset);

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
      if (!quiet) {
        drawOrbitingGlowDots(
          businessPole,
          'rgba(220, 38, 38, 0.22)',
          'rgba(220, 38, 38, 0.06)',
          4,
          0.18,
          1.72,
          0.38,
        );
        drawOrbitingGlowDots(
          warehousePole,
          'rgba(37, 99, 235, 0.22)',
          'rgba(37, 99, 235, 0.06)',
          4,
          0.16,
          1.66,
          0.42,
        );
      }

      const centerAnchorY = centroid.y + CENTER_NODE_Y_SHIFT_PX;
      const centerIconY = centerAnchorY - R_NODE * ICON_CENTER_OFFSET_RATIO_MISSION;
      const centerIconS = R_NODE * ICON_MULT;
      const centerFirstLineTop = inkBottom(centerIconY, centerIconS, ICON_BOTTOM_FRAC_CENTER) + ICON_LABEL_GAP;

      let rotC = rm ? 0.2 : t * 0.38;
      let pulseSm = 0.42 + pulseGlobal * 0.28;
      if (pointerInteractiveRef.current && !rm && mpx > -1e5) {
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
      redMix.addColorStop(0, `rgba(220, 38, 38, ${0.12 * CENTER_FIELD_ANIM_INTENSITY})`);
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
      blueMix.addColorStop(0, `rgba(37, 99, 235, ${0.12 * CENTER_FIELD_ANIM_INTENSITY})`);
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
        const midTone = CENTER_FIELD_ANIM_INTENSITY;
        const beat = adoptMandalaBeat(time, rmLocal);
        const neonPulse = 0.55 + pulse * 0.35 + beat * 0.2;
        const layers = 5;
        for (let li = 0; li < layers; li++) {
          const lr = baseR * (0.36 + li * 0.17) * (0.97 + breath * 0.06 + beat * (0.04 + li * 0.012));
          const rotL = rot * (0.55 + li * 0.32) + li * 0.85;
          const stretch = 1 + Math.sin(rotL * 2.1 + li) * (0.028 + beat * 0.015);
          const v = li / Math.max(1, layers - 1);
          const rx = lr * stretch;
          const ry = lr * (2 - stretch) * 0.97;
          const dashAnim = rmLocal ? 0 : -(time * (10 + li * 3)) % 120;
          const strokeEllipseNeon = (width: number, alpha: number, style: string, glow: boolean) => {
            ctx.save();
            ctx.strokeStyle = style;
            ctx.lineWidth = width;
            ctx.globalAlpha = alpha * midTone;
            ctx.setLineDash(li % 2 === 0 ? [3, 6] : [9, 5]);
            ctx.lineDashOffset = dashAnim;
            if (glow && !rmLocal) {
              ctx.shadowColor = `rgba(167, 139, 250, ${(0.45 + neonPulse * 0.25) * midTone})`;
              ctx.shadowBlur = (10 + beat * 8 + pulse * 6) * midTone;
            }
            ctx.beginPath();
            ctx.ellipse(x, y, rx, ry, rotL, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          };
          strokeEllipseNeon(
            li === 0 ? 1.15 : li < 3 ? 0.95 : 0.78,
            (0.12 + pulse * 0.1 + beat * 0.08 - li * 0.025) * neonPulse,
            `rgba(196, 181, 253, ${0.55 + v * 0.2})`,
            true,
          );
          strokeEllipseNeon(
            li === 0 ? 0.72 : li < 3 ? 0.52 : 0.4,
            0.28 + pulse * 0.22 + beat * 0.14 - li * 0.03 + v * 0.05,
            li >= 2 ? ACCENT_NEON : v > 0.35 ? ACCENT : INK_MED,
            false,
          );
          strokeEllipseNeon(
            li === 0 ? 0.38 : 0.32,
            (0.2 + beat * 0.12) * (li >= 2 ? 1.15 : 0.85),
            li >= 3 ? ACCENT_NEON_CORE : ACCENT_NEON,
            false,
          );
          ctx.setLineDash([]);
          ctx.shadowBlur = 0;
        }
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      };
      ctx.save();
      ctx.globalAlpha = nodeAlpha('discovery');
      drawMandalaCore(centroid.x, centroid.y, R_NODE * (quiet ? 2.05 : 2.35), rotC, pulseSm, breathFast, t, rm);
      drawSvgIcon('discovery', centroid.x, centerIconY, centerIconS);
      ctx.restore();
      ctx.save();
      ctx.font = `${hi === 'discovery' ? 600 : 500} ${bodyPx}px "Manrope", system-ui, sans-serif`;
      ctx.fillStyle = labelFor('discovery');
      ctx.globalAlpha = nodeAlpha('discovery');
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      CENTER_LABEL_LINES.forEach((line, L) => {
        ctx.fillText(line, centroid.x, centerFirstLineTop + L * poleLineGap);
      });
      ctx.restore();
      const outerPulse = 0.26 + pulseGlobal * 0.14;

      const northIconS = ringBaseR * ICON_MULT;
      const whIconY = warehousePole.y - ringBaseR * ICON_CENTER_OFFSET_RATIO;
      const southBizIconY = businessPole.y - ringBaseR * ICON_CENTER_OFFSET_RATIO;
      const southBizIconS = ringBaseR * ICON_MULT * SOUTH_ICON_SCALE;

      const warehouseLabelTop = inkBottom(whIconY, northIconS, ICON_BOTTOM_FRAC_OUTER[0]) + ICON_LABEL_GAP;

      const drawPoleGlyph = (
        nodeId: DiagramHighlightNode,
        p: { x: number; y: number },
        iconKey: string,
        iconAnchorY: number,
        seedRot: number,
        iconS: number,
        pole: 'north' | 'south',
      ) => {
        const emphasis = nodeAlpha(nodeId);
        const baseR = ringBaseR;
        const rot = rm ? seedRot : t * (pole === 'north' ? 0.36 : 0.35) + seedRot;
        const glowR = baseR * (pole === 'north' ? 2.2 : 1.8);
        ctx.save();
        ctx.globalAlpha = emphasis * (quiet ? 0.85 : 1);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
        const innerA = (pole === 'north' ? 0.065 : 0.09) * decorMul;
        g.addColorStop(0, `rgba(139, 92, 246, ${innerA + pulseGlobal * 0.06})`);
        g.addColorStop(0.45, `rgba(139, 92, 246, ${0.025 + pulseGlobal * 0.02})`);
        g.addColorStop(1, 'rgba(139, 92, 246, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
        ctx.fill();

        if (!quiet || hi === nodeId) {
          drawMandalaSubtle(p.x, p.y, baseR * 2.1, rot, outerPulse, INK_MED, breathFast, pole);
          if (!quiet) {
            drawOuterMandalaGuide(
              p.x, p.y, baseR, rot, outerPulse, breathFast,
              centroid.x, centroid.y, t, rm, seedRot * 2.1, pole,
            );
          }
        }

        drawSvgIcon(iconKey, p.x, iconAnchorY, iconS);
        ctx.restore();
      };

      drawPoleGlyph('business', businessPole, 'business', southBizIconY, 1.05, southBizIconS, 'south');
      drawPoleGlyph('warehouse', warehousePole, 'warehouse', whIconY, 0.85, northIconS * 1.15, 'north');

      ctx.save();
      ctx.font = fontDiagram;
      ctx.fillStyle = INK_CAPTION;
      ctx.globalAlpha = nodeAlpha('warehouse');
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      POLE_LABEL_LINES[0].forEach((line, L) => {
        ctx.fillText(line, warehousePole.x, warehouseLabelTop + L * poleLineGap);
      });
      const bizLines = POLE_LABEL_LINES[1];
      const bizFirstBaseline =
        inkBottom(southBizIconY, southBizIconS, ICON_BOTTOM_FRAC_OUTER[1]) + ICON_LABEL_GAP + textAscent;
      ctx.textBaseline = 'alphabetic';
      ctx.globalAlpha = nodeAlpha('business');
      bizLines.forEach((line, L) => {
        ctx.fillText(line, businessPole.x, bizFirstBaseline + L * poleLineGap);
      });
      ctx.restore();

      const dfIconY = digitalFunnel.y - ringBaseR * ICON_CENTER_OFFSET_RATIO;
      drawPoleGlyph('digital', digitalFunnel, 'digital', dfIconY, 0.55, northIconS * 1.10, 'north');
      const supportIconY = ongoingSupport.y - ringBaseR * ICON_CENTER_OFFSET_RATIO;
      drawPoleGlyph('support', ongoingSupport, 'support', supportIconY, 0.95, northIconS * 1.15, 'north');

      ctx.save();
      ctx.textAlign = 'center';
      const dfFirstBaseline =
        inkBottom(dfIconY, northIconS, ICON_BOTTOM_FRAC_OUTER[0]) + ICON_LABEL_GAP + textAscent;
      const supportFirstBaseline =
        inkBottom(supportIconY, northIconS, ICON_BOTTOM_FRAC_OUTER[0]) + ICON_LABEL_GAP + textAscent;
      ctx.textBaseline = 'alphabetic';
      ctx.font = `500 ${bodyPx}px "Manrope", system-ui, sans-serif`;
      ctx.font = `${labelWeight('digital')} ${bodyPx}px "Manrope", system-ui, sans-serif`;
      ctx.fillStyle = labelFor('digital');
      ctx.globalAlpha = nodeAlpha('digital');
      ctx.fillText(DIGITAL_STATE_LABEL, digitalFunnel.x, dfFirstBaseline);
      ctx.font = `${labelWeight('support')} ${bodyPx}px "Manrope", system-ui, sans-serif`;
      ctx.fillStyle = labelFor('support');
      ctx.globalAlpha = nodeAlpha('support');
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
      className={`relative h-full w-full touch-none select-none overflow-visible ${
        compact ? 'min-h-0' : 'min-h-[480px]'
      }`}
      role="img"
      aria-label="System diagram: Ambient discovery is centered with an apple icon and orbital rings. Business location and Backpack warehouse sit left and right; Digital engagement is above center and Ongoing support below. Red and blue dashed tendrils run from each side pole toward the center. A purple tendril links the center to Digital engagement. Two wide purple arcs connect Digital engagement to Ongoing support, curving outward past the left and right poles. Red and blue glowing dots orbit Business location and Backpack warehouse."
    >
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
    </div>
  );
}
