import { useEffect, useRef, useState } from 'react';

type TrailKind =
  | 'spark'
  | 'dash'
  | 'diamond'
  | 'orb'
  | 'trail'
  | 'mandala'
  | 'hex'
  | 'ellipse'
  | 'path'
  | 'triangle'
  | 'wedge'
  | 'bar'
  | 'thickBar'
  | 'arc'
  | 'kite'
  | 'sweep'
  | 'zig'
  | 'shard';
type TrailPoint = {
  id: number;
  x: number;
  y: number;
  born: number;
  kind: TrailKind;
  paletteIndex: number;
};

const POINT_LIFETIME_MS = 980;
const MAX_POINTS = 48;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * Curated hue families (monochrome triads per entry)—muted saturation, ink-adjacent.
 * Random choice varies the “edition,” not a toy rainbow.
 */
const CLICK_PALETTES = [
  {
    line: 'rgba(55, 68, 86, 0.24)',
    fill: 'rgba(88, 100, 118, 0.1)',
    ring: 'rgba(68, 80, 98, 0.19)',
  },
  {
    line: 'rgba(78, 78, 86, 0.23)',
    fill: 'rgba(108, 108, 116, 0.09)',
    ring: 'rgba(92, 92, 100, 0.18)',
  },
  {
    line: 'rgba(72, 86, 80, 0.24)',
    fill: 'rgba(98, 112, 104, 0.1)',
    ring: 'rgba(82, 96, 90, 0.18)',
  },
  {
    line: 'rgba(90, 78, 96, 0.23)',
    fill: 'rgba(116, 104, 122, 0.09)',
    ring: 'rgba(102, 90, 110, 0.18)',
  },
  {
    line: 'rgba(68, 90, 94, 0.24)',
    fill: 'rgba(94, 116, 120, 0.09)',
    ring: 'rgba(78, 102, 108, 0.18)',
  },
  {
    line: 'rgba(104, 92, 84, 0.22)',
    fill: 'rgba(128, 116, 108, 0.09)',
    ring: 'rgba(116, 104, 96, 0.17)',
  },
  {
    line: 'rgba(78, 72, 88, 0.23)',
    fill: 'rgba(108, 100, 118, 0.09)',
    ring: 'rgba(92, 86, 104, 0.18)',
  },
] as const;

/**
 * Click celebration shapes only (no ambient mousemove trail).
 */
export default function AmbientMandalaTrail({ className = '' }: { className?: string }) {
  const layerRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);
  const pointCountRef = useRef(0);
  const mousePosRef = useRef({ x: 0, y: 0, active: false });
  const [points, setPoints] = useState<TrailPoint[]>([]);

  useEffect(() => {
    pointCountRef.current = points.length;
  }, [points]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const emit = (
      clientX: number,
      clientY: number,
      kind: TrailKind,
      paletteIndex = 0,
    ) => {
      const layer = layerRef.current;
      if (!layer) return;
      const rect = layer.getBoundingClientRect();
      const x = clamp(clientX - rect.left, 0, rect.width);
      const y = clamp(clientY - rect.top, 0, rect.height);
      const id = ++idRef.current;
      setPoints((prev) => [
        ...prev.slice(-(MAX_POINTS - 1)),
        { id, x, y, born: performance.now(), kind, paletteIndex },
      ]);
    };

    const emitClickBurst = (clientX: number, clientY: number) => {
      const clickPool: TrailKind[] = [
        'spark',
        'thickBar',
        'bar',
        'triangle',
        'wedge',
        'kite',
        'arc',
        'sweep',
        'zig',
        'shard',
        'path',
        'ellipse',
        'path',
        'mandala',
        'diamond',
        'hex',
        'orb',
        'trail',
        'dash',
      ];
      const count = 9;
      const offset = Math.floor(Math.random() * clickPool.length);
      const paletteIndex = Math.floor(Math.random() * CLICK_PALETTES.length);
      for (let i = 0; i < count; i += 1) {
        const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.28;
        const radius = (18 + Math.random() * 26 + (i % 2) * 6) * 0.9;
        const x = clientX + Math.cos(angle) * radius;
        const y = clientY + Math.sin(angle) * radius;
        emit(x, y, clickPool[(offset + i) % clickPool.length], paletteIndex);
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
      mousePosRef.current.x = event.clientX;
      mousePosRef.current.y = event.clientY;
      mousePosRef.current.active = true;
    };

    const onMouseDown = (event: MouseEvent) => {
      mousePosRef.current.x = event.clientX;
      mousePosRef.current.y = event.clientY;
      mousePosRef.current.active = true;
      emitClickBurst(event.clientX, event.clientY);
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    const onMouseLeaveWindow = () => {
      mousePosRef.current.active = false;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseout', onMouseLeaveWindow);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseout', onMouseLeaveWindow);
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
        const palette = CLICK_PALETTES[point.paletteIndex % CLICK_PALETTES.length];
        const deg = (point.id * 37) % 360;
        const deg2 = (point.id * 53) % 360;
        const op = (a: number) => life * a * 0.83;
        let displayX = point.x;
        let displayY = point.y;
        if (mousePosRef.current.active) {
          const dx = mousePosRef.current.x - point.x;
          const dy = mousePosRef.current.y - point.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const proximity = clamp(1 - dist / 340, 0, 1);
          const followStrength = 0.14 * proximity * life;
          displayX += dx * followStrength;
          displayY += dy * followStrength;
        }

        if (point.kind === 'diamond') {
          return (
            <span
              key={point.id}
              className="absolute border"
              style={{
                left: displayX,
                top: displayY,
                width: 9 + (point.id % 3),
                height: 9 + (point.id % 3),
                borderColor: palette.ring,
                borderWidth: 1,
                transform: `translate(-50%, -50%) rotate(${45 + (point.id % 2) * 18}deg) scale(${1.02 + (1 - life) * 0.48})`,
                opacity: op(0.58),
              }}
            />
          );
        }

        if (point.kind === 'spark') {
          const w = 5 + (point.id % 6) * 1.4;
          const h = point.id % 3 === 0 ? 3 : 1;
          return (
            <span
              key={point.id}
              className="absolute rounded-[1px]"
              style={{
                left: displayX,
                top: displayY,
                width: w,
                height: h,
                backgroundColor: palette.line,
                transform: `translate(-50%, -50%) rotate(${deg}deg) scale(${0.94 + (1 - life) * 0.22})`,
                opacity: op(0.7),
              }}
            />
          );
        }

        if (point.kind === 'orb') {
          return (
            <span
              key={point.id}
              className="absolute rounded-full border"
              style={{
                left: displayX,
                top: displayY,
                width: 8,
                height: 8,
                borderColor: palette.ring,
                backgroundColor: palette.fill,
                transform: `translate(-50%, -50%) scale(${0.82 + (1 - life) * 0.65})`,
                opacity: op(0.42),
              }}
            />
          );
        }

        if (point.kind === 'trail') {
          const len = 9 + (point.id % 5) * 2;
          return (
            <span
              key={point.id}
              className="absolute"
              style={{
                left: displayX,
                top: displayY,
                width: len,
                height: 2,
                borderRadius: point.id % 2 === 0 ? '2px 0 0 2px' : '0 2px 2px 0',
                background: `linear-gradient(90deg, ${palette.line}, ${palette.fill})`,
                transform: `translate(-50%, -50%) rotate(${deg}deg) scaleX(${0.75 + (1 - life) * 1.15})`,
                opacity: op(0.64),
              }}
            />
          );
        }

        if (point.kind === 'dash') {
          return (
            <span
              key={point.id}
              className="absolute border-t"
              style={{
                left: displayX,
                top: displayY,
                width: 12 + (point.id % 4) * 2,
                borderTopColor: palette.line,
                borderTopStyle: point.id % 3 === 0 ? 'dashed' : 'solid',
                transform: `translate(-50%, -50%) rotate(${deg2}deg)`,
                opacity: op(0.62),
              }}
            />
          );
        }

        if (point.kind === 'thickBar') {
          return (
            <span
              key={point.id}
              className="absolute"
              style={{
                left: displayX,
                top: displayY,
                width: 15 + (point.id % 4),
                height: 3 + (point.id % 2),
                backgroundColor: palette.line,
                borderRadius: 1,
                transform: `translate(-50%, -50%) rotate(${deg}deg) scale(${0.88 + (1 - life) * 0.5})`,
                opacity: op(0.58),
              }}
            />
          );
        }

        if (point.kind === 'bar') {
          return (
            <span
              key={point.id}
              className="absolute"
              style={{
                left: displayX,
                top: displayY,
                width: 2 + (point.id % 2),
                height: 14 + (point.id % 5),
                backgroundColor: palette.line,
                borderRadius: 1,
                transform: `translate(-50%, -50%) rotate(${deg2}deg)`,
                opacity: op(0.6),
              }}
            />
          );
        }

        if (point.kind === 'triangle') {
          return (
            <span
              key={point.id}
              className="absolute"
              style={{
                left: displayX,
                top: displayY,
                width: 14,
                height: 12,
                backgroundColor: palette.fill,
                border: `1px solid ${palette.ring}`,
                clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
                transform: `translate(-50%, -50%) rotate(${deg}deg) scale(${0.85 + (1 - life) * 0.45})`,
                opacity: op(0.52),
              }}
            />
          );
        }

        if (point.kind === 'kite') {
          return (
            <span
              key={point.id}
              className="absolute"
              style={{
                left: displayX,
                top: displayY,
                width: 12,
                height: 12,
                background: `linear-gradient(135deg, ${palette.fill}, transparent 55%)`,
                border: `1px solid ${palette.ring}`,
                clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                transform: `translate(-50%, -50%) rotate(${deg2}deg) scale(${0.82 + (1 - life) * 0.4})`,
                opacity: op(0.5),
              }}
            />
          );
        }

        if (point.kind === 'shard') {
          return (
            <span
              key={point.id}
              className="absolute"
              style={{
                left: displayX,
                top: displayY,
                width: 10,
                height: 16,
                backgroundColor: palette.line,
                clipPath: 'polygon(50% 0%, 100% 35%, 80% 100%, 20% 100%, 0% 35%)',
                transform: `translate(-50%, -50%) rotate(${deg}deg) scale(${0.9 + (1 - life) * 0.35})`,
                opacity: op(0.48),
              }}
            />
          );
        }

        if (point.kind === 'zig') {
          return (
            <span
              key={point.id}
              className="absolute"
              style={{
                left: displayX,
                top: displayY,
                width: 16,
                height: 10,
                background: `linear-gradient(115deg, transparent 40%, ${palette.line} 40%, ${palette.line} 45%, transparent 45%, transparent 55%, ${palette.line} 55%, ${palette.line} 60%, transparent 60%)`,
                transform: `translate(-50%, -50%) rotate(${deg2}deg)`,
                opacity: op(0.55),
              }}
            />
          );
        }

        if (point.kind === 'arc') {
          const s = 15 + (point.id % 4);
          return (
            <span
              key={point.id}
              className="absolute rounded-full"
              style={{
                left: displayX,
                top: displayY,
                width: s,
                height: s,
                border: `1px solid ${palette.ring}`,
                borderBottomColor: 'transparent',
                borderLeftColor: point.id % 2 === 0 ? 'transparent' : palette.ring,
                transform: `translate(-50%, -50%) rotate(${deg}deg) scale(${0.92 + (1 - life) * 0.18})`,
                opacity: op(0.54),
              }}
            />
          );
        }

        if (point.kind === 'wedge') {
          const span = 48 + (point.id % 5) * 14;
          return (
            <span
              key={point.id}
              className="absolute"
              style={{
                left: displayX,
                top: displayY,
                width: 20,
                height: 20,
                background: `conic-gradient(from ${deg}deg, ${palette.fill} 0deg ${span}deg, transparent ${span}deg)`,
                transform: `translate(-50%, -50%) scale(${0.85 + (1 - life) * 0.3})`,
                opacity: op(0.5),
              }}
            />
          );
        }

        if (point.kind === 'sweep') {
          const span = 70 + (point.id % 4) * 12;
          return (
            <span
              key={point.id}
              className="absolute rounded-full"
              style={{
                left: displayX,
                top: displayY,
                width: 22,
                height: 22,
                background: `conic-gradient(from ${deg2}deg, ${palette.line} 0deg ${span}deg, transparent ${span}deg, transparent 360deg)`,
                transform: `translate(-50%, -50%) scale(${0.78 + (1 - life) * 0.35})`,
                opacity: op(0.46),
              }}
            />
          );
        }

        if (point.kind === 'mandala') {
          return (
            <span
              key={point.id}
              className="absolute rounded-full border"
              style={{
                left: displayX,
                top: displayY,
                width: 12 + (point.id % 3),
                height: 12 + (point.id % 3),
                borderColor: palette.ring,
                boxShadow: `0 0 0 1px ${palette.fill} inset`,
                transform: `translate(-50%, -50%) scale(${0.78 + (1 - life) * 0.72}) rotate(${deg2}deg)`,
                opacity: op(0.58),
              }}
            />
          );
        }

        if (point.kind === 'hex') {
          return (
            <span
              key={point.id}
              className="absolute border"
              style={{
                left: displayX,
                top: displayY,
                width: 9 + (point.id % 2),
                height: 9 + (point.id % 2),
                borderColor: palette.ring,
                clipPath: 'polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)',
                transform: `translate(-50%, -50%) rotate(${deg}deg) scale(${0.82 + (1 - life) * 1.08})`,
                opacity: op(0.4),
              }}
            />
          );
        }

        if (point.kind === 'ellipse') {
          const ew = 14 + (point.id % 5) * 2;
          const eh = 8 + (point.id % 4);
          return (
            <span
              key={point.id}
              className="absolute rounded-full border"
              style={{
                left: displayX,
                top: displayY,
                width: ew,
                height: eh,
                borderColor: palette.ring,
                borderWidth: 1,
                transform: `translate(-50%, -50%) rotate(${deg}deg) scale(${0.86 + (1 - life) * 0.72})`,
                opacity: op(0.62),
              }}
            />
          );
        }

        if (point.kind === 'path') {
          return (
            <span
              key={point.id}
              className="absolute border-t"
              style={{
                left: displayX,
                top: displayY,
                width: 16 + (point.id % 5) * 2,
                height: 8 + (point.id % 3),
                borderTopColor: palette.line,
                borderTopWidth: 1,
                borderRadius: '999px',
                transform: `translate(-50%, -50%) rotate(${deg2}deg) scale(${0.92 + (1 - life) * 0.72})`,
                opacity: op(0.66),
              }}
            />
          );
        }

        return (
          <span
            key={point.id}
            className="absolute h-px w-2"
            style={{
              left: displayX,
              top: displayY,
              width: 4,
              backgroundColor: palette.line,
              transform: `translate(-50%, -50%) rotate(${(point.id * 19) % 180}deg)`,
              opacity: op(0.6),
            }}
          />
        );
      })}
    </div>
  );
}
