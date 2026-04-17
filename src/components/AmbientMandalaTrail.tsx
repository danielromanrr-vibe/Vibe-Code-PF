import { useEffect, useRef, useState } from 'react';

type TrailKind = 'node' | 'ring' | 'spark';
type TrailPoint = {
  id: number;
  x: number;
  y: number;
  born: number;
  kind: TrailKind;
};

const EMIT_INTERVAL_MS = 36;
const POINT_LIFETIME_MS = 1150;
const MAX_POINTS = 64;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * Ambient mandala trail for page background hover.
 * Emits only when pointer is over non-interactive background surfaces.
 */
export default function AmbientMandalaTrail({ className = '' }: { className?: string }) {
  const layerRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);
  const lastEmitAtRef = useRef(0);
  const pointCountRef = useRef(0);
  const [points, setPoints] = useState<TrailPoint[]>([]);

  useEffect(() => {
    pointCountRef.current = points.length;
  }, [points]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const emit = (clientX: number, clientY: number) => {
      const layer = layerRef.current;
      if (!layer) return;
      const rect = layer.getBoundingClientRect();
      const x = clamp(clientX - rect.left, 0, rect.width);
      const y = clamp(clientY - rect.top, 0, rect.height);
      const id = ++idRef.current;
      const kind: TrailKind = id % 6 === 0 ? 'ring' : id % 4 === 0 ? 'spark' : 'node';

      setPoints((prev) => [
        ...prev.slice(-(MAX_POINTS - 1)),
        { id, x, y, born: performance.now(), kind },
      ]);
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
        'button, a, input, textarea, select, [role="button"], [data-cursor="hand"]',
      );
      if (isInteractive) return;

      const now = performance.now();
      if (now - lastEmitAtRef.current < EMIT_INTERVAL_MS) return;
      lastEmitAtRef.current = now;
      emit(event.clientX, event.clientY);
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
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

        if (point.kind === 'ring') {
          return (
            <span
              key={point.id}
              className="absolute rounded-full border border-violet-500/22"
              style={{
                left: point.x,
                top: point.y,
                width: 16,
                height: 16,
                transform: `translate(-50%, -50%) scale(${0.7 + (1 - life) * 1.25})`,
              opacity: life * 0.52,
              }}
            />
          );
        }

        if (point.kind === 'spark') {
          return (
            <span
              key={point.id}
              className="absolute h-px w-3 bg-blue-500/30"
              style={{
                left: point.x,
                top: point.y,
                transform: `translate(-50%, -50%) rotate(${(point.id * 31) % 180}deg)`,
              opacity: life * 0.58,
              }}
            />
          );
        }

        return (
          <span
            key={point.id}
            className="absolute rounded-full bg-violet-500/32"
            style={{
              left: point.x,
              top: point.y,
              width: 3,
              height: 3,
              transform: 'translate(-50%, -50%)',
              opacity: life * 0.83,
            }}
          />
        );
      })}
    </div>
  );
}
