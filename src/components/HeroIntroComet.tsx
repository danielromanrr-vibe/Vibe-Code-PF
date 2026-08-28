import { useEffect, useRef } from 'react';
import {
  easeStarPass,
  heroIntroTiming,
  starBrightnessMap,
  starFadeEnvelope,
  starPortraitCrossGlow,
  STAR_PORTRAIT_ILLUMINATE_THRESHOLD,
  type StarLightingFrame,
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

const GBC_BRIGHT = [
  [255, 255, 248],
  [220, 236, 255],
  [255, 244, 200],
] as const;

type TrailPoint = {
  x: number;
  y: number;
  life: number;
  color: number;
  size: number;
};

type PortraitMetrics = {
  cx: number;
  cy: number;
  radius: number;
  progress: number;
};

type HeroIntroCometProps = {
  runKey: number;
  active: boolean;
  onComplete?: () => void;
  /** Per-frame star position — name traveling front only. */
  onStarFrame?: (frame: StarLightingFrame) => void;
  /** Once — star approaches the portrait; type illuminate (role + subhead). */
  onPortraitIlluminate?: () => void;
  /** Whole-pass opacity for overlay sync. */
  onEnvelope?: (opacity: number) => void;
  className?: string;
};

const TRAIL_MAX = 36;
const TRAIL_DECAY_PER_MS = 0.00165;

function measurePortrait(wrap: HTMLElement, w: number): PortraitMetrics | null {
  const el = wrap.parentElement?.querySelector('[data-hero-portrait]');
  if (!el || !(el instanceof HTMLElement)) return null;
  const wr = wrap.getBoundingClientRect();
  const pr = el.getBoundingClientRect();
  const cx = (pr.left + pr.right) * 0.5 - wr.left;
  const cy = (pr.top + pr.bottom) * 0.5 - wr.top;
  const radius = Math.max(pr.width, pr.height) * 0.54;
  const progress = Math.min(1, Math.max(0, (cx / w + 0.1) / 1.2));
  return { cx, cy, radius, progress };
}

function lerpRgb(
  a: readonly [number, number, number],
  b: readonly [number, number, number],
  t: number,
): readonly [number, number, number] {
  const u = Math.min(1, Math.max(0, t));
  return [
    Math.round(a[0] + (b[0] - a[0]) * u),
    Math.round(a[1] + (b[1] - a[1]) * u),
    Math.round(a[2] + (b[2] - a[2]) * u),
  ];
}

function headPalette(glow: number): readonly [number, number, number] {
  const t = Math.min(1, glow / V);
  return lerpRgb(GBC[0], GBC_BRIGHT[0], t * 0.85);
}

/**
 * Mandala shooting star — paints itself only.
 * Clipped off the portrait so it never lights non-type surfaces.
 */
export default function HeroIntroComet({
  runKey,
  active,
  onComplete,
  onStarFrame,
  onPortraitIlluminate,
  onEnvelope,
  className = '',
}: HeroIntroCometProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  const onCompleteRef = useRef(onComplete);
  const onStarFrameRef = useRef(onStarFrame);
  const onPortraitIlluminateRef = useRef(onPortraitIlluminate);
  const onEnvelopeRef = useRef(onEnvelope);
  activeRef.current = active;
  onCompleteRef.current = onComplete;
  onStarFrameRef.current = onStarFrame;
  onPortraitIlluminateRef.current = onPortraitIlluminate;
  onEnvelopeRef.current = onEnvelope;

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
    let portraitMetrics: PortraitMetrics | null = null;
    let portraitIlluminated = false;
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
      portraitMetrics = measurePortrait(wrap, w);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    if (wrap.parentElement) ro.observe(wrap.parentElement);
    resize();

    const pathPos = (p: number) => {
      const cx = w * (-0.1 + p * 1.2);
      const cy = h * (-0.05 + p * 1.1);
      const angle = Math.atan2(h * 0.92, w) + Math.PI;
      return { cx, cy, angle };
    };

    const spawnTrail = (cx: number, cy: number, angle: number, life: number, speed: number) => {
      if (speed < 0.0012) return;
      const back = 6 + speed * 48;
      trail.push({
        x: cx - Math.cos(angle) * back,
        y: cy - Math.sin(angle) * back,
        life,
        color: 0,
        size: 1,
      });
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
        onStarFrameRef.current?.({ pathProgress: 0, envelope: 0, portraitProgress: 0.46 });
        onEnvelopeRef.current?.(0);
        raf = requestAnimationFrame(draw);
        return;
      }

      if (!passStart) passStart = now;
      const elapsed = now - passStart;
      const linear = Math.min(1, elapsed / heroIntroTiming.starPassDurationMs);
      const p = easeStarPass(linear);
      const envelope = starFadeEnvelope(linear, p) * V;
      onEnvelopeRef.current?.(starFadeEnvelope(linear, p));

      if (!portraitMetrics || linear < 0.02) portraitMetrics = measurePortrait(wrap, w);
      const portraitP = portraitMetrics?.progress ?? 0.46;
      const crossGlow = starPortraitCrossGlow(p, portraitP);
      const bright = starBrightnessMap(crossGlow);

      const speed = Math.abs(p - lastProgress);
      lastProgress = p;

      animT += 0.014 + speed * 0.08;
      const { cx, cy, angle } = pathPos(p);

      const exitFade = starFadeEnvelope(linear, p);
      if (exitFade > 0.08) {
        spawnTrail(cx, cy, angle, 1, speed);
      }

      const dt = lastFrame ? Math.min(32, now - lastFrame) : 16;
      lastFrame = now;
      const trailDecayMul = exitFade < 0.55 ? 1.4 + (0.55 - exitFade) * 5.5 : 1;

      for (let i = trail.length - 1; i >= 0; i -= 1) {
        trail[i].life -= TRAIL_DECAY_PER_MS * dt * trailDecayMul;
        if (trail[i].life <= 0) trail.splice(i, 1);
      }

      ctx.clearRect(0, 0, w, h);

      if (portraitMetrics) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, w, h);
        ctx.arc(
          portraitMetrics.cx,
          portraitMetrics.cy,
          portraitMetrics.radius * 1.38,
          0,
          Math.PI * 2,
          true,
        );
        ctx.clip('evenodd');
      }

      onStarFrameRef.current?.({
        pathProgress: p,
        envelope: starFadeEnvelope(linear, p),
        portraitProgress: portraitP,
      });

      if (!portraitIlluminated && bright.badge >= STAR_PORTRAIT_ILLUMINATE_THRESHOLD) {
        portraitIlluminated = true;
        onPortraitIlluminateRef.current?.();
      }

      const headRgb = headPalette(crossGlow);

      if (trail.length > 2) {
        const recent = trail.slice(-14);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        for (let i = recent.length - 1; i >= 0; i -= 1) {
          ctx.lineTo(recent[i].x, recent[i].y);
        }
        const streakA = envelope * bright.trail * 0.62;
        const streakRgb = lerpRgb(GBC[1], GBC_BRIGHT[1], 0.55 + (crossGlow / V) * 0.35);
        ctx.strokeStyle = `rgba(${streakRgb[0]},${streakRgb[1]},${streakRgb[2]},${streakA})`;
        ctx.lineWidth = 2.2 + bright.head * 1.4;
        ctx.stroke();
      }

      for (let i = 0; i < trail.length; i += 1) {
        const pt = trail[i];
        const t = i / Math.max(1, trail.length - 1);
        const a = pt.life * envelope * bright.trail * (0.22 + t * 0.35);
        const rgb = lerpRgb(GBC[1], GBC_BRIGHT[2], 0.4 + (crossGlow / V) * 0.4);
        drawPixel(pt.x, pt.y, 1, rgb, a);
      }

      const headA = envelope * bright.head;
      const flare = ctx.createRadialGradient(cx, cy, 0, cx, cy, bright.flareRadius);
      flare.addColorStop(0, `rgba(${headRgb[0]}, ${headRgb[1]}, ${headRgb[2]}, ${headA})`);
      flare.addColorStop(0.32, `rgba(200, 224, 255, ${headA * (0.48 + bright.twinkle * 0.22)})`);
      flare.addColorStop(1, 'rgba(104, 136, 200, 0)');
      ctx.fillStyle = flare;
      ctx.beginPath();
      ctx.arc(cx, cy, bright.flareRadius + 6, 0, Math.PI * 2);
      ctx.fill();

      const spin = animT * (1.6 + bright.twinkle * 2.2);
      const orbit = 9 + bright.head * 5;
      const nodes = 4;
      for (let a = 0; a < nodes; a += 1) {
        const th = spin + (a / nodes) * Math.PI * 2;
        const px = cx + Math.cos(th) * orbit;
        const py = cy + Math.sin(th) * orbit * 0.88;
        const rgb = lerpRgb(GBC[(a + 1) % GBC.length], GBC_BRIGHT[a % GBC_BRIGHT.length], bright.twinkle * 0.7);
        drawMandalaNode(px, py, 1.4 + (a % 2) * 0.3 + bright.head * 0.4, rgb, headA * 0.95);
        if (a === 0) {
          ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${headA * 0.3})`;
          ctx.lineWidth = 0.6 + bright.head * 0.5;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(px, py);
          ctx.stroke();
        }
      }

      const tw = 0.78 + Math.sin(animT * (14 + bright.twinkle * 10)) * 0.22;
      drawPixel(cx, cy, 2, headRgb, headA * tw);
      if (bright.twinkle > 0.55) {
        drawPixel(cx - 1, cy - 1, 1, GBC_BRIGHT[0], headA * tw * 0.45);
        drawPixel(cx + 1, cy + 1, 1, GBC_BRIGHT[0], headA * tw * 0.35);
      }
      drawPixel(cx - 3, cy, 1, GBC_BRIGHT[2], headA * 0.75 * tw);
      drawPixel(cx + 3, cy - 2, 1, GBC_BRIGHT[1], headA * 0.6 * tw);

      ctx.globalAlpha = 1;
      if (portraitMetrics) ctx.restore();

      const inExitPhase = linear >= 0.58 || p >= 0.72;
      if (inExitPhase && exitFade < 0.03) {
        ctx.clearRect(0, 0, w, h);
        onStarFrameRef.current?.({ pathProgress: p, envelope: 0, portraitProgress: portraitP });
        onEnvelopeRef.current?.(0);
        if (!completed) {
          completed = true;
          onCompleteRef.current?.();
        }
        raf = requestAnimationFrame(draw);
        return;
      }

      if (linear >= 1 && exitFade < 0.05 && trail.length < 4 && !completed) {
        completed = true;
        onCompleteRef.current?.();
      }

      raf = requestAnimationFrame(draw);
    };

    passStart = 0;
    lastProgress = 0;
    completed = false;
    portraitIlluminated = false;
    trail.length = 0;
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      onEnvelopeRef.current?.(0);
    };
  }, [runKey, active]);

  return (
    <div ref={wrapRef} className={['absolute inset-0', className].filter(Boolean).join(' ')}>
      <canvas ref={canvasRef} className="block h-full w-full" aria-hidden />
    </div>
  );
}
