/**
 * Adopt-a-School — System Architecture diagram (canvas).
 * Three nodes in a triangle, animated data paths, mandala halos, hover proximity,
 * satellite nodes + traveling packets for a more “breathing” system feel.
 */
import { useEffect, useRef } from 'react';

const ACCENT = '#8b5cf6';
const INK = '#141414';
const INK_FAINT = 'rgba(20, 20, 20, 0.22)';
const INK_MED = 'rgba(20, 20, 20, 0.45)';

const LABELS = ['School Discovery', 'Donor Activation', 'Impact Engagement'] as const;
/** 0 = magnifying glass (Discovery), 1 = heart (Activation), 2 = phone (Engagement) */
const NODE_ICONS = [0, 1, 2] as const;

const NUM_SPECKS = 36;
const EDGE_SATELLITES = [0.28, 0.55, 0.78] as const;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function triangleLayout(w: number, h: number) {
  const cx = w / 2;
  const cy = h * 0.52;
  const R = Math.min(w, h) * 0.31;
  const top = { x: cx + R * Math.cos(-Math.PI / 2), y: cy + R * Math.sin(-Math.PI / 2) };
  const bl = { x: cx + R * Math.cos((5 * Math.PI) / 6), y: cy + R * Math.sin((5 * Math.PI) / 6) };
  const br = { x: cx + R * Math.cos(Math.PI / 6), y: cy + R * Math.sin(Math.PI / 6) };
  return { nodes: [top, bl, br], cx, cy, R };
}

function scaleFromCenter(
  points: { x: number; y: number }[],
  cx: number,
  cy: number,
  s: number,
) {
  return points.map((p) => ({
    x: cx + (p.x - cx) * s,
    y: cy + (p.y - cy) * s,
  }));
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

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function fract(x: number) {
  return x - Math.floor(x);
}

export default function AdoptSystemDiagram() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1e6, y: -1e6 });
  const hoverRef = useRef([0, 0, 0]);
  const reducedMotionRef = useRef(false);
  const rafRef = useRef(0);
  const speckSeedRef = useRef<number[] | null>(null);

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

    const HOVER_REACH = 96;
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
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      if (type === 0) {
        const r = s * 0.35;
        ctx.beginPath();
        ctx.arc(x - s * 0.08, y - s * 0.05, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + r * 0.65, y + r * 0.65);
        ctx.lineTo(x + s * 0.55, y + s * 0.55);
        ctx.stroke();
      } else if (type === 1) {
        const sc = s * 0.42;
        ctx.beginPath();
        ctx.moveTo(x, y + sc * 0.35);
        ctx.bezierCurveTo(x - sc * 0.9, y - sc * 0.25, x - sc * 0.35, y - sc * 0.85, x, y - sc * 0.45);
        ctx.bezierCurveTo(x + sc * 0.35, y - sc * 0.85, x + sc * 0.9, y - sc * 0.25, x, y + sc * 0.35);
        ctx.stroke();
      } else {
        const rw = s * 0.28;
        const rh = s * 0.48;
        const rx = 4;
        ctx.beginPath();
        ctx.roundRect(x - rw, y - rh * 0.5, rw * 2, rh, rx);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x - rw * 0.35, y + rh * 0.25);
        ctx.lineTo(x + rw * 0.35, y + rh * 0.25);
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawMandala = (
      x: number,
      y: number,
      baseR: number,
      rot: number,
      pulse: number,
      faint: string,
      breath: number,
    ) => {
      const layers = 4;
      for (let li = 0; li < layers; li++) {
        const lr = baseR * (0.45 + li * 0.22) * (0.96 + breath * 0.08);
        const rotL = rot * (0.6 + li * 0.35) + li * 0.9;
        const stretch = 1 + Math.sin(rotL * 2 + li) * (0.06 + breath * 0.04);
        ctx.strokeStyle = faint;
        ctx.lineWidth = li === 0 ? 0.55 : 0.4;
        ctx.globalAlpha = 0.35 + pulse * 0.2 - li * 0.06;
        if (li % 2 === 0) ctx.setLineDash([3, 6]);
        else ctx.setLineDash([10, 5]);
        ctx.beginPath();
        ctx.ellipse(x, y, lr * stretch, lr * (2 - stretch) * 0.92, rotL, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        if (li === 1) {
          for (let k = 0; k < 6; k++) {
            const a = (k / 6) * Math.PI * 2 + rotL * 0.5;
            ctx.globalAlpha = 0.2 + pulse * 0.15;
            ctx.beginPath();
            ctx.moveTo(x + Math.cos(a) * lr * 0.3, y + Math.sin(a) * lr * 0.3);
            ctx.lineTo(x + Math.cos(a) * lr * 1.05, y + Math.sin(a) * lr * 1.05);
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

      const raw = triangleLayout(wCss, hCss);
      const breath = rm ? 1 : 1 + 0.024 * Math.sin(t * 0.72);
      const breathFast = rm ? 0 : Math.sin(t * 1.05) * 0.5 + 0.5;
      const nodes = scaleFromCenter(raw.nodes, raw.cx, raw.cy, breath);

      const px = baseSize();

      for (let i = 0; i < 3; i++) {
        const d = dist(mouseRef.current.x, mouseRef.current.y, nodes[i].x, nodes[i].y);
        const target = 1 - smoothstep(HOVER_REACH - 36, HOVER_REACH + 20, d);
        hoverRef.current[i] = lerp(hoverRef.current[i], target, rm ? 0.35 : 0.12);
      }

      ctx.clearRect(0, 0, wCss, hCss);

      const pulseGlobal = rm ? 0.35 : 0.35 + Math.sin(t * 2.2) * 0.12;

      if (!speckSeedRef.current || speckSeedRef.current.length !== NUM_SPECKS * 2) {
        speckSeedRef.current = Array.from({ length: NUM_SPECKS * 2 }, (_, i) =>
          fract(Math.sin(i * 12.9898) * 43758.5453123),
        );
      }
      const seeds = speckSeedRef.current;
      for (let s = 0; s < NUM_SPECKS; s++) {
        const sx = seeds[s * 2] * wCss;
        const sy = seeds[s * 2 + 1] * hCss;
        const dx = Math.sin(t * 0.22 + s * 0.7) * 5;
        const dy = Math.cos(t * 0.19 + s * 0.55) * 4;
        const pr = 0.6 + (Math.sin(s * 2.1) * 0.5 + 0.5) * 1.1;
        ctx.fillStyle = INK;
        ctx.globalAlpha = 0.04 + breathFast * 0.035;
        ctx.beginPath();
        ctx.arc(sx + dx, sy + dy, pr, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      const centroid = {
        x: (nodes[0].x + nodes[1].x + nodes[2].x) / 3,
        y: (nodes[0].y + nodes[1].y + nodes[2].y) / 3,
      };
      const hubR = px * 0.018 * (0.92 + breathFast * 0.12);
      ctx.strokeStyle = INK_FAINT;
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = 0.2 + pulseGlobal * 0.15;
      ctx.setLineDash([2, 6]);
      ctx.beginPath();
      ctx.arc(centroid.x, centroid.y, hubR * 4.2 + breathFast * 3, t * 0.15, t * 0.15 + Math.PI * 1.6);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 0.35 + pulseGlobal * 0.1;
      ctx.beginPath();
      ctx.arc(centroid.x, centroid.y, hubR * 1.8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = `rgba(139, 92, 246, ${0.03 + breathFast * 0.04})`;
      ctx.beginPath();
      ctx.arc(centroid.x, centroid.y, hubR, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

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
        const mx = (a.x + b.x) / 2 + Math.sin(t * 1.1 + i) * (6 + breathFast * 5);
        const my = (a.y + b.y) / 2 + Math.cos(t * 0.9 + j) * (6 + breathFast * 5);
        edges.push({ i, j, cp: { x: mx, y: my } });
      }

      const drawEdge = (e: (typeof edges)[0]) => {
        const a = nodes[e.i];
        const b = nodes[e.j];
        const { cp } = e;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo(cp.x, cp.y, b.x, b.y);
        ctx.strokeStyle = INK_FAINT;
        ctx.lineWidth = 0.75;
        ctx.globalAlpha = 0.55;
        ctx.setLineDash([]);
        ctx.stroke();
        ctx.strokeStyle = ACCENT;
        ctx.lineWidth = 1.1;
        ctx.globalAlpha = 0.2 + pulseGlobal * 0.35;
        const dash = [10, 14];
        ctx.setLineDash(dash);
        ctx.lineDashOffset = rm ? 0 : -(t * 28) % 48;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
      };

      edges.forEach(drawEdge);

      edges.forEach((e, edgeIdx) => {
        const a = nodes[e.i];
        const b = nodes[e.j];
        const { cp } = e;

        for (const u of EDGE_SATELLITES) {
          const p = quadPoint(a, cp, b, u);
          const wobble = rm ? 0 : Math.sin(t * 1.3 + u * 8 + edgeIdx) * 1.2;
          drawSatelliteNode(p.x + wobble * 0.3, p.y - wobble * 0.2, px * 0.012, t, edgeIdx * 10 + u * 100, rm);
        }
      });

      for (let pk = 0; pk < 2; pk++) {
        const s = rm ? 0.35 + pk * 0.55 : ((t * 0.095 + pk * 0.5) % 3 + 3) % 3;
        const edgeIdx = Math.min(2, Math.floor(s));
        const u = s - Math.floor(s);
        const e = edges[edgeIdx];
        const a = nodes[e.i];
        const b = nodes[e.j];
        const pkt = quadPoint(a, e.cp, b, u);
        const g = ctx.createRadialGradient(pkt.x, pkt.y, 0, pkt.x, pkt.y, px * 0.032);
        g.addColorStop(0, 'rgba(139, 92, 246, 0.55)');
        g.addColorStop(0.45, 'rgba(139, 92, 246, 0.14)');
        g.addColorStop(1, 'rgba(139, 92, 246, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(pkt.x, pkt.y, px * 0.015 + breathFast * 0.005, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.75)';
        ctx.globalAlpha = 0.45;
        ctx.beginPath();
        ctx.arc(pkt.x - 1.2, pkt.y - 1.2, 1.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      const order = [0, 1, 2].sort((a, b) => hoverRef.current[a] - hoverRef.current[b]);

      for (const idx of order) {
        const p = nodes[idx];
        const hf = hoverRef.current[idx];
        const scale = 1 + hf * 0.11;
        const baseR = px * 0.072 * scale;
        const rot = rm ? idx * 0.5 : t * (0.35 + idx * 0.08) + idx;

        const glowR = baseR * (2.4 + hf * 0.8);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
        g.addColorStop(0, `rgba(139, 92, 246, ${0.06 + hf * 0.18 + pulseGlobal * 0.06})`);
        g.addColorStop(0.45, `rgba(139, 92, 246, ${0.02 + hf * 0.05})`);
        g.addColorStop(1, 'rgba(139, 92, 246, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
        ctx.fill();

        drawMandala(p.x, p.y, baseR * 2.1, rot, hf + pulseGlobal * 0.3, INK_MED, breathFast);

        ctx.fillStyle = `rgba(250, 250, 250, ${0.65 + hf * 0.2})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, baseR * 0.92, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = INK;
        ctx.lineWidth = 0.65 + hf * 0.35;
        ctx.globalAlpha = 0.25 + hf * 0.45;
        ctx.beginPath();
        ctx.arc(p.x, p.y, baseR * 0.92, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;

        const iconStroke = lerp(0.35, 1, hf) < 0.5 ? INK_MED : INK;
        drawIcon(NODE_ICONS[idx], p.x, p.y - baseR * 0.06, baseR * 1.35, iconStroke, 0.9 + hf * 0.35);

        ctx.save();
        ctx.font = `500 ${Math.max(9, px * 0.028)}px ui-sans-serif, system-ui, sans-serif`;
        ctx.fillStyle = INK;
        ctx.globalAlpha = 0.55 + hf * 0.35;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        const label = LABELS[idx];
        const lw = ctx.measureText(label).width;
        const tx = p.x;
        const ty = p.y + baseR * 1.35;
        ctx.fillText(label, tx, ty);
        ctx.globalAlpha = 0.35;
        ctx.fillRect(tx - lw / 2, ty + px * 0.038, lw, 0.5);
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
      className="relative h-full min-h-[200px] w-full touch-none select-none overflow-hidden"
      role="img"
      aria-label="System diagram: School Discovery, Donor Activation, and Impact Engagement connected in a continuous loop."
    >
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
    </div>
  );
}
