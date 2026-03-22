/**
 * Adopt-a-School — System Architecture diagram (canvas).
 * Triad + purple loop; Shared Mission = strong mandala core (heart of the system).
 */
import { useEffect, useRef } from 'react';
import { NOUN_HANDSHAKE_PATHS, NOUN_HANDSHAKE_VIEWBOX } from '../data/nounHandshakePaths';
import { adoptBreathFast, adoptMandalaBeat, adoptPulseGlobal } from '../utils/adoptDiagramMotion';

const ACCENT = '#8b5cf6';
const INK = '#141414';
const INK_FAINT = 'rgba(20, 20, 20, 0.22)';
const INK_MED = 'rgba(20, 20, 20, 0.45)';

const LABELS = ['Discovery', 'Activation', 'Participation'] as const;
const CENTER_LINES = ['Shared', 'mission'] as const;
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
  const yBot = h - margin - Math.min(px * 0.125, innerH * 0.17);
  const xLeft = margin + clusterR;
  const xRight = w - margin - clusterR;
  return {
    nodes: [
      { x: cx, y: yTop - discoveryLift },
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

export default function AdoptSystemDiagram() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1e6, y: -1e6 });
  const reducedMotionRef = useRef(false);
  const rafRef = useRef(0);

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

    const TENDRIL_MOUSE_REACH = 280;
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
        /* Lighter vertical anchor than stroke icons + vb nudge so the glyph reads centered in the disc. */
        ctx.translate(x, y - s * 0.018);
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
        /* Sparkle cluster — 128×128 viewBox */
        ctx.translate(x, y - s * 0.02);
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

    /** Shared Mission core: rich mandala + heartbeat pulse (visual “heart” of the system). */
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
      const layers = 5;
      for (let li = 0; li < layers; li++) {
        const lr =
          baseR * (0.36 + li * 0.17) * (0.97 + breath * 0.06 + beat * (0.04 + li * 0.012));
        const rotL = rot * (0.55 + li * 0.32) + li * 0.85;
        const stretch = 1 + Math.sin(rotL * 2.1 + li) * (0.055 + beat * 0.03);
        const v = li / Math.max(1, layers - 1);
        ctx.strokeStyle = v > 0.45 ? ACCENT : INK_MED;
        ctx.lineWidth = li === 0 ? 0.62 : li < 3 ? 0.48 : 0.38;
        ctx.globalAlpha = 0.22 + pulse * 0.18 + beat * 0.12 - li * 0.035 + v * 0.06;
        if (li % 2 === 0) ctx.setLineDash([3, 6]);
        else ctx.setLineDash([9, 5]);
        ctx.beginPath();
        ctx.ellipse(x, y, lr * stretch, lr * (2 - stretch) * 0.91, rotL, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        if (li === 2) {
          for (let k = 0; k < 8; k++) {
            const a = (k / 8) * Math.PI * 2 + rotL * 0.45;
            ctx.globalAlpha = 0.14 + pulse * 0.12 + beat * 0.1;
            ctx.strokeStyle = ACCENT;
            ctx.lineWidth = 0.4;
            ctx.beginPath();
            ctx.moveTo(x + Math.cos(a) * lr * 0.28, y + Math.sin(a) * lr * 0.28);
            ctx.lineTo(x + Math.cos(a) * lr * 1.08, y + Math.sin(a) * lr * 1.08);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
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
      const { nodes, center: centroid } = diagramLayout(wCss, hCss, px);

      const ICON_MULT = 1.28;
      /** Activation reads small vs Participation handshake — scale up slightly. */
      const ACTIVATION_ICON_SCALE = 1.14;
      /** Nudge Participation glyph down so it aligns with Activation on the baseline row. */
      const PARTICIPATION_ICON_NUDGE_Y = Math.min(px * 0.024, 11);
      const R_NODE = px * 0.072;
      /** Outer triad only — smaller disc + icon footprint vs center. */
      const OUTER_DISC_SCALE = 0.78;
      const labelPx = Math.max(9, px * 0.026);
      const labelFont = `500 ${labelPx}px ui-sans-serif, system-ui, sans-serif`;
      const DISC_STROKE = 0.62;
      const ICON_STROKE = 0.92;

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
        const mpx = mouseRef.current.x;
        const mpy = mouseRef.current.y;
        if (!rm && mpx > -1e5) {
          const dm = dist(mpx, mpy, midX, midY);
          const influence = Math.max(0, 1 - dm / TENDRIL_MOUSE_REACH) ** 1.65;
          const elastic = 0.26 * influence;
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
        ctx.lineDashOffset = rm ? 0 : -(t * 26 + phaseKey * 6) % 48;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
      };

      edges.forEach((e) => {
        const a = nodes[e.i];
        const b = nodes[e.j];
        strokeTendril(a, b, e.cp, ACCENT, e.i);
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
      const rotC = rm ? 0.2 : t * 0.38;
      const pulseSm = 0.42 + pulseGlobal * 0.28;
      const glowRC = baseRC * 2.1;
      const gC = ctx.createRadialGradient(centroid.x, centroid.y, 0, centroid.x, centroid.y, glowRC);
      gC.addColorStop(0, `rgba(139, 92, 246, ${0.12 + pulseGlobal * 0.08})`);
      gC.addColorStop(0.5, `rgba(139, 92, 246, ${0.04 + pulseGlobal * 0.03})`);
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
      const rDisc = baseRC * 0.92;
      ctx.fillStyle = '#fafafa';
      ctx.beginPath();
      ctx.arc(centroid.x, centroid.y, rDisc, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = INK;
      ctx.lineWidth = DISC_STROKE;
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(centroid.x, centroid.y, rDisc, 0, Math.PI * 2);
      ctx.stroke();
      drawIcon(3, centroid.x, centroid.y - baseRC * 0.05, baseRC * ICON_MULT, INK, ICON_STROKE);
      ctx.save();
      ctx.font = labelFont;
      ctx.fillStyle = INK;
      ctx.globalAlpha = 1;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      const tcx = centroid.x;
      const lineGap = labelPx * 1.15;
      const tcy = centroid.y + baseRC * 1.2;
      ctx.fillText(CENTER_LINES[0], tcx, tcy);
      ctx.fillText(CENTER_LINES[1], tcx, tcy + lineGap);
      ctx.globalAlpha = 1;
      const w0 = ctx.measureText(CENTER_LINES[0]).width;
      const w1 = ctx.measureText(CENTER_LINES[1]).width;
      const underY0 = tcy + labelPx * 0.92;
      const underY1 = tcy + lineGap + labelPx * 0.92;
      ctx.fillRect(tcx - w0 / 2, underY0, w0, 0.45);
      ctx.fillRect(tcx - w1 / 2, underY1, w1, 0.45);
      ctx.globalAlpha = 1;
      ctx.restore();

      const outerPulse = 0.26 + pulseGlobal * 0.14;
      for (let idx = 0; idx < 3; idx++) {
        const p = nodes[idx];
        const baseR = R_NODE * OUTER_DISC_SCALE;
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

        ctx.fillStyle = 'rgba(252, 252, 252, 0.97)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, baseR * 0.92, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = INK;
        ctx.lineWidth = DISC_STROKE;
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, baseR * 0.92, 0, Math.PI * 2);
        ctx.stroke();

        {
          const baseAnchorY = p.y - baseR * 0.06;
          let iconY = baseAnchorY;
          let iconS = baseR * ICON_MULT;
          let strokeW = ICON_STROKE;
          if (idx === 1) {
            iconS *= ACTIVATION_ICON_SCALE;
            strokeW *= 1.06;
          }
          if (idx === 2) {
            iconY += PARTICIPATION_ICON_NUDGE_Y;
          }
          drawIcon(NODE_ICONS[idx], p.x, iconY, iconS, INK, strokeW);
        }

        ctx.save();
        ctx.font = labelFont;
        ctx.fillStyle = INK;
        ctx.globalAlpha = 1;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        const label = LABELS[idx];
        const lw = ctx.measureText(label).width;
        const tx = p.x;
        const ty = p.y + baseR * 1.35;
        ctx.fillText(label, tx, ty);
        ctx.globalAlpha = 0.62;
        ctx.fillRect(tx - lw / 2, ty + labelPx * 0.92, lw, 0.45);
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
