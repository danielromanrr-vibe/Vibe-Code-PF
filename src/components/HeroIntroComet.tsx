import { useEffect, useRef } from 'react';
import {
  easeStarPass,
  heroIntroTiming,
  starFadeEnvelope,
  starNameCrossGlow,
} from '../lib/heroIntroTiming';

const V = heroIntroTiming.starVisualScale;

/** Game Boy Color–ish mandala star palette (muted, limited) */
const GBC = [
  [248, 248, 232],
  [168, 200, 240],
  [104, 136, 200],
  [216, 184, 240],
  [240, 216, 120],
  [72, 128, 168],
] as const;

type TrailPoint = {
  x: number;
  y: number;
  life: number;
  color: number;
  size: number;
};

type HeroIntroCometProps = {
  /** Bump to restart the pass */
  runKey: number;
  active: boolean;
  onComplete?: () => void;
  className?: string;
};

const TRAIL_MAX = 52;
const TRAIL_DECAY_PER_MS = 0.00135;

/**
 * Mandala shooting star — GBC-inspired pixels, history trail, fade in/out.
 * Animates on canvas rAF (not React progress steps) so motion feels alive.
 */
export default function HeroIntroComet({
  runKey,
  active,
  onComplete,
  className = '',
}: HeroIntroCometProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  const onCompleteRef = useRef(onComplete);
  activeRef.current = active;
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 1;
    let h = 1;
    let raf = 0;
    let animT = 0;
    let passStart = 0;
    let lastFrame = 0;
    let lastProgress = 0;
    let completed = false;
    const trail: TrailPoint[] = [];

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    const pathPos = (p: number) => {
      const wobble = Math.sin(animT * 9 + p * 11) * 2.2;
      const cx = w * (-0.1 + p * 1.2);
      const cy = h * (-0.05 + p * 1.1);
      const angle = Math.atan2(h * 0.92, w) + Math.PI;
      return {
        cx: cx + Math.cos(angle + Math.PI / 2) * wobble,
        cy: cy + Math.sin(angle + Math.PI / 2) * wobble,
        angle,
      };
    };

    const spawnTrail = (cx: number, cy: number, life: number, speed: number) => {
      const count = speed > 0.02 ? 2 : 1;
      for (let n = 0; n < count; n += 1) {
        trail.push({
          x: cx + (Math.random() - 0.5) * 1.2,
          y: cy + (Math.random() - 0.5) * 1.2,
          life,
          color: Math.floor(Math.random() * GBC.length),
          size: Math.random() > 0.55 ? 2 : 1,
        });
      }
      while (trail.length > TRAIL_MAX) trail.shift();
    };

    const drawPixel = (x: number, y: number, size: number, rgb: readonly [number, number, number], a: number) => {
      const px = Math.round(x) - (size === 2 ? 1 : 0);
      const py = Math.round(y) - (size === 2 ? 1 : 0);
      ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`;
      ctx.fillRect(px, py, size, size);
    };

    const drawMandalaNode = (cx: number, cy: number, r: number, rgb: readonly [number, number, number], a: number) => {
      ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`;
      ctx.fillRect(Math.round(cx) - 1, Math.round(cy) - 1, 2, 2);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    };

    const draw = (now: number) => {
      if (!activeRef.current) {
        ctx.clearRect(0, 0, w, h);
        raf = requestAnimationFrame(draw);
        return;
      }

      if (!passStart) passStart = now;
      const elapsed = now - passStart;
      const linear = Math.min(1, elapsed / heroIntroTiming.starPassDurationMs);
      const envelope = starFadeEnvelope(linear) * V;
      const p = easeStarPass(linear);
      const glow = starNameCrossGlow(p);
      const speed = Math.abs(p - lastProgress);
      lastProgress = p;

      animT += 0.014 + speed * 0.08;
      const { cx, cy, angle } = pathPos(p);

      spawnTrail(cx, cy, 1, speed);

      const dt = lastFrame ? Math.min(32, now - lastFrame) : 16;
      lastFrame = now;

      for (let i = trail.length - 1; i >= 0; i -= 1) {
        trail[i].life -= TRAIL_DECAY_PER_MS * dt;
        if (trail[i].life <= 0) trail.splice(i, 1);
      }

      ctx.clearRect(0, 0, w, h);

      if (envelope < 0.01 && linear >= 1 && trail.length === 0) {
        if (!completed) {
          completed = true;
          onCompleteRef.current?.();
        }
        raf = requestAnimationFrame(draw);
        return;
      }

      // Streak along recent history
      if (trail.length > 2) {
        const recent = trail.slice(-10);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        for (let i = 1; i < recent.length; i += 1) {
          const a = recent[i].life * envelope * 0.22;
          const [r, g, b] = GBC[recent[i].color % GBC.length];
          ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
          ctx.lineWidth = 1 + recent[i].life * 1.2;
          ctx.beginPath();
          ctx.moveTo(recent[i - 1].x, recent[i - 1].y);
          ctx.lineTo(recent[i].x, recent[i].y);
          ctx.stroke();
        }
      }

      // Fading pixel trail (GBC sparkles)
      for (let i = 0; i < trail.length; i += 1) {
        const pt = trail[i];
        const a = pt.life * envelope * (0.35 + (i / trail.length) * 0.4);
        const [r, g, b] = GBC[pt.color % GBC.length];
        drawPixel(pt.x, pt.y, pt.size, [r, g, b], a);
        if (pt.life > 0.55 && i % 4 === 0) {
          const bx = pt.x - Math.cos(angle) * 3;
          const by = pt.y - Math.sin(angle) * 3;
          drawPixel(bx, by, 1, GBC[4], a * 0.5);
        }
      }

      // Soft head glow
      const headA = envelope * (0.55 + glow * 0.35);
      const flare = ctx.createRadialGradient(cx, cy, 0, cx, cy, 28 + glow * 10);
      flare.addColorStop(0, `rgba(248, 248, 232, ${headA * 0.85})`);
      flare.addColorStop(0.35, `rgba(168, 200, 240, ${headA * 0.35})`);
      flare.addColorStop(1, 'rgba(104, 136, 200, 0)');
      ctx.fillStyle = flare;
      ctx.beginPath();
      ctx.arc(cx, cy, 32 + glow * 8, 0, Math.PI * 2);
      ctx.fill();

      // Simple mandala cross — 4 nodes + diagonals, slow spin
      const spin = animT * 1.6;
      const orbit = 9 + glow * 4;
      const nodes = 4;
      for (let a = 0; a < nodes; a += 1) {
        const th = spin + (a / nodes) * Math.PI * 2;
        const px = cx + Math.cos(th) * orbit;
        const py = cy + Math.sin(th) * orbit * 0.88;
        const rgb = GBC[(a + 1) % GBC.length];
        drawMandalaNode(px, py, 1.4 + (a % 2) * 0.3, rgb, headA * 0.9);
        if (a === 0) {
          ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${headA * 0.25})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(px, py);
          ctx.stroke();
        }
      }

      // Core sparkle (twinkle)
      const tw = 0.7 + Math.sin(animT * 14) * 0.3;
      drawPixel(cx, cy, 2, GBC[0], headA * tw);
      drawPixel(cx - 3, cy, 1, GBC[4], headA * 0.65 * tw);
      drawPixel(cx + 3, cy - 2, 1, GBC[3], headA * 0.5 * tw);

      if (linear >= 1 && !completed && trail.length < 4) {
        completed = true;
        onCompleteRef.current?.();
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    passStart = 0;
    lastProgress = 0;
    completed = false;
    trail.length = 0;
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [runKey, active]);

  return (
    <div ref={wrapRef} className={['absolute inset-0', className].filter(Boolean).join(' ')}>
      <canvas ref={canvasRef} className="block h-full w-full" aria-hidden />
    </div>
  );
}
