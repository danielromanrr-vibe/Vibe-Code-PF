import { useEffect, useRef, useState } from 'react';

type TrailKind = 'spark' | 'dash' | 'diamond';
type TrailPoint = {
  id: number;
  x: number;
  y: number;
  born: number;
  kind: TrailKind;
  source: 'ambient' | 'click';
};

const EMIT_INTERVAL_MS = 36;
const POINT_LIFETIME_MS = 1150;
const MAX_POINTS = 64;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const RANDOM_KINDS: TrailKind[] = ['spark', 'dash', 'diamond'];

function pickRandomKind(previous: TrailKind | null): TrailKind {
  // Weighted toward lines for a subtle ambient texture.
  const roll = Math.random();
  let next: TrailKind = roll < 0.46 ? 'spark' : roll < 0.84 ? 'dash' : 'diamond';

  // Avoid long repeated runs of the same shape.
  if (previous && next === previous && Math.random() < 0.65) {
    const alternatives = RANDOM_KINDS.filter((kind) => kind !== previous);
    next = alternatives[Math.floor(Math.random() * alternatives.length)] ?? next;
  }
  return next;
}

/**
 * Ambient mandala trail for page background hover.
 * Emits only when pointer is over non-interactive background surfaces.
 */
export default function AmbientMandalaTrail({ className = '' }: { className?: string }) {
  const layerRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);
  const lastEmitAtRef = useRef(0);
  const pointCountRef = useRef(0);
  const lastAmbientKindRef = useRef<TrailKind | null>(null);
  const [points, setPoints] = useState<TrailPoint[]>([]);

  useEffect(() => {
    pointCountRef.current = points.length;
  }, [points]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const emit = (clientX: number, clientY: number, kind?: TrailKind, source: 'ambient' | 'click' = 'ambient') => {
      const layer = layerRef.current;
      if (!layer) return;
      const rect = layer.getBoundingClientRect();
      const x = clamp(clientX - rect.left, 0, rect.width);
      const y = clamp(clientY - rect.top, 0, rect.height);
      const id = ++idRef.current;
      const resolvedKind: TrailKind = kind ?? pickRandomKind(lastAmbientKindRef.current);
      if (source === 'ambient') lastAmbientKindRef.current = resolvedKind;

      setPoints((prev) => [
        ...prev.slice(-(MAX_POINTS - 1)),
        { id, x, y, born: performance.now(), kind: resolvedKind, source },
      ]);
    };

    const emitClickBurst = (clientX: number, clientY: number) => {
      const kinds: TrailKind[] = ['spark', 'dash', 'diamond'];
      const count = 7;
      for (let i = 0; i < count; i += 1) {
        const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
        const radius = 8 + Math.random() * 20;
        const x = clientX + Math.cos(angle) * radius;
        const y = clientY + Math.sin(angle) * radius;
        emit(x, y, kinds[i % kinds.length], 'click');
      }
    };

    let rafId = 0;
    const tick = () => {
      const now = performance.now();
      setPoints((prev) => prev.filter((point) => now - point.born < POINT_LIFETIME_MS));
      if (pointCountRef.current > 0) rafId = requestAnimationFrame(tick);
      else rafId = 0;
    };

    const onMouseMove = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (!target) return;

      const isInteractive = !!target.closest(
        'button, a, input, textarea, select, [role="button"]',
      );
      if (isInteractive) return;

      const now = performance.now();
      if (now - lastEmitAtRef.current < EMIT_INTERVAL_MS) return;
      lastEmitAtRef.current = now;
      emit(event.clientX, event.clientY);
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    const onMouseDown = (event: MouseEvent) => {
      emitClickBurst(event.clientX, event.clientY);
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={layerRef}
      aria-hidden
      className={`pointer-events-none fixed inset-0 overflow-hidden ${className}`.trim()}
    >
      {points.map((point) => {
        const age = performance.now() - point.born;
        const life = clamp(1 - age / POINT_LIFETIME_MS, 0, 1);
        const isClick = point.source === 'click';

        if (point.kind === 'diamond') {
          return (
            <span
              key={point.id}
              className="absolute border border-violet-500/20"
              style={{
                left: point.x,
                top: point.y,
                width: isClick ? 10 : 8,
                height: isClick ? 10 : 8,
                transform: `translate(-50%, -50%) rotate(45deg) scale(${(isClick ? 1.04 : 0.86) + (1 - life) * (isClick ? 0.75 : 0.5)})`,
                opacity: life * (isClick ? 0.58 : 0.42),
              }}
            />
          );
        }

        if (point.kind === 'spark') {
          return (
            <span
              key={point.id}
              className="absolute h-px bg-blue-500/30"
              style={{
                left: point.x,
                top: point.y,
                width: isClick ? 6 : 3,
                transform: `translate(-50%, -50%) rotate(${(point.id * 31) % 180}deg)`,
                opacity: life * (isClick ? 0.68 : 0.5),
              }}
            />
          );
        }

        return (
          <span
            key={point.id}
            className="absolute h-px w-2 bg-violet-500/30"
            style={{
              left: point.x,
              top: point.y,
              width: isClick ? 4 : 2,
              transform: `translate(-50%, -50%) rotate(${(point.id * 19) % 180}deg)`,
              opacity: life * (isClick ? 0.6 : 0.45),
            }}
          />
        );
      })}
    </div>
  );
}
