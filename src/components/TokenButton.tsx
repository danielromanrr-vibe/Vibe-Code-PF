import { useEffect, useRef, useState } from 'react';
import type { ButtonHTMLAttributes, MouseEvent as ReactMouseEvent, ReactNode } from 'react';

/**
 * Home-page CTA token button.
 * Simple CTA button with a clean default and regular hover/focus states.
 */
export const tokenButtonClassName =
  'relative inline-flex h-11 max-w-full items-center justify-center gap-2 overflow-hidden rounded-full border border-ink/14 bg-white px-6 font-heading text-[length:var(--text-body)] font-semibold leading-tight tracking-[var(--tracking-body)] text-[color:var(--expand-media-icon)] shadow-[0_1px_2px_rgba(20,20,20,0.06)] transition-[border-color,box-shadow,color,transform] hover:border-ink/20 hover:shadow-[0_2px_6px_rgba(20,20,20,0.08)] hover:text-[color:var(--expand-media-icon-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--expand-media-icon)] focus-visible:ring-offset-2 focus-visible:ring-offset-bg active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100';

export type TokenButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
  children: ReactNode;
};

type TrailKind = 'node' | 'ring' | 'spark';
type TrailPoint = {
  id: number;
  x: number;
  y: number;
  born: number;
  kind: TrailKind;
};

const TRAIL_ACTIVE_WINDOW_MS = 1700;
const TRAIL_POINT_LIFETIME_MS = 860;
const TRAIL_EMIT_INTERVAL_MS = 26;
const MAX_TRAIL_POINTS = 30;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export default function TokenButton({ className = '', children, onClick, ...props }: TokenButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const lastEmitAtRef = useRef(0);
  const pointIdRef = useRef(0);
  const activeUntilRef = useRef(0);
  const trailCountRef = useRef(0);
  const [trailPoints, setTrailPoints] = useState<TrailPoint[]>([]);
  const [trailActive, setTrailActive] = useState(false);

  useEffect(() => {
    trailCountRef.current = trailPoints.length;
  }, [trailPoints]);

  const emitTrailPoint = (clientX: number, clientY: number, kind: TrailKind) => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const x = clamp(clientX - rect.left, 0, rect.width);
    const y = clamp(clientY - rect.top, 0, rect.height);
    const id = ++pointIdRef.current;

    setTrailPoints((prev) => [...prev.slice(-(MAX_TRAIL_POINTS - 1)), { id, x, y, born: performance.now(), kind }]);
  };

  useEffect(() => {
    if (!trailActive) return;

    const onPointerMove = (event: MouseEvent) => {
      const now = performance.now();
      if (now - lastEmitAtRef.current < TRAIL_EMIT_INTERVAL_MS) return;
      lastEmitAtRef.current = now;
      const kind: TrailKind = pointIdRef.current % 5 === 0 ? 'ring' : pointIdRef.current % 3 === 0 ? 'spark' : 'node';
      emitTrailPoint(event.clientX, event.clientY, kind);
    };

    window.addEventListener('mousemove', onPointerMove, { passive: true });

    let rafId = 0;
    const tick = () => {
      const now = performance.now();
      setTrailPoints((prev) => prev.filter((point) => now - point.born < TRAIL_POINT_LIFETIME_MS));

      if (now > activeUntilRef.current && trailCountRef.current === 0) {
        setTrailActive(false);
        return;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onPointerMove);
      cancelAnimationFrame(rafId);
    };
  }, [trailActive]);

  const handleClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    activeUntilRef.current = performance.now() + TRAIL_ACTIVE_WINDOW_MS;
    setTrailActive(true);
    emitTrailPoint(event.clientX, event.clientY, 'ring');
    onClick?.(event);
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      data-cursor="hand"
      className={`${tokenButtonClassName} ${className}`.trim()}
      onClick={handleClick}
      {...props}
    >
      <span aria-hidden className="pointer-events-none absolute inset-0 z-0">
        {trailPoints.map((point) => {
          const age = performance.now() - point.born;
          const life = clamp(1 - age / TRAIL_POINT_LIFETIME_MS, 0, 1);

          if (point.kind === 'ring') {
            return (
              <span
                key={point.id}
                className="absolute rounded-full border border-violet-500/35"
                style={{
                  left: point.x,
                  top: point.y,
                  width: 16,
                  height: 16,
                  transform: `translate(-50%, -50%) scale(${0.72 + (1 - life) * 1.35})`,
                  opacity: life * 0.62,
                }}
              />
            );
          }

          if (point.kind === 'spark') {
            return (
              <span
                key={point.id}
                className="absolute h-px w-3 bg-blue-500/45"
                style={{
                  left: point.x,
                  top: point.y,
                  transform: `translate(-50%, -50%) rotate(${(point.id * 37) % 180}deg) scale(${0.8 + life * 0.4})`,
                  opacity: life * 0.66,
                }}
              />
            );
          }

          return (
            <span
              key={point.id}
              className="absolute rounded-full bg-violet-500/42"
              style={{
                left: point.x,
                top: point.y,
                width: 4,
                height: 4,
                transform: `translate(-50%, -50%) scale(${0.75 + life * 0.55})`,
                opacity: life * 0.9,
              }}
            />
          );
        })}
      </span>
      <span className="relative z-10 inline-flex min-w-0 items-center justify-center gap-2">{children}</span>
    </button>
  );
}
