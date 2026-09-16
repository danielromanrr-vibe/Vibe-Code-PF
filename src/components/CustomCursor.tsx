import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  CELEBRATION_INK_PALETTES,
  inkWithPresence,
  SCROLL_TRAIL_KINDS,
  type ScrollTrailKind,
} from '../lib/celebrationInk';

type CustomCursorProps = {
  /** `scroll` — wheel trails only (default when click celebration lives elsewhere). `all` — click + scroll. */
  mode?: 'scroll' | 'all';
};

type ScrollTrail = {
  id: number;
  x: number;
  y: number;
  size: number;
  /** 0–1; higher = slower chase / more path delay. */
  lag: number;
  born: number;
  /** Sit after drawing, then ride the delayed pointer path. */
  holdMs: number;
  /** How far behind the live pointer this mark reads the path. */
  delayMs: number;
  lifeMs: number;
  waveSeed: number;
  /** Soft scroll-direction bias that decays quickly. */
  biasX: number;
  biasY: number;
  kind: ScrollTrailKind;
  paletteIndex: number;
  rot: number;
};

type PathSample = { t: number; x: number; y: number };

const PATH_KEEP_MS = 4200;
const PATH_MIN_STEP_PX = 3;

const isCoarsePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

const irregularFieldOffset = (mobile: boolean) => {
  const near = Math.random() < 0.86;
  const spread = near ? (mobile ? 18 : 14) : (mobile ? 28 : 22);
  let ox = (Math.random() * 2 - 1) * spread;
  let oy = (Math.random() * 2 - 1) * spread;
  if (Math.random() < 0.5) ox *= 0.22 + Math.random() * 0.45;
  else oy *= 0.22 + Math.random() * 0.45;
  const min = 7;
  if (ox * ox + oy * oy < min * min) {
    ox = (Math.random() < 0.5 ? 1 : -1) * (min + Math.random() * 8);
    oy = (Math.random() < 0.5 ? 1 : -1) * (3 + Math.random() * 10);
  }
  return { ox, oy };
};

const biasToRot = (biasX: number, biasY: number) => {
  if (Math.abs(biasX) + Math.abs(biasY) < 0.15) return Math.random() * 180;
  return (Math.atan2(biasY, biasX) * 180) / Math.PI;
};

const prunePath = (path: PathSample[], now: number) => {
  while (path.length > 1 && now - path[0].t > PATH_KEEP_MS) path.shift();
};

const samplePath = (path: PathSample[], at: number, fallback: { x: number; y: number }) => {
  if (path.length === 0) return { x: fallback.x, y: fallback.y, tx: 1, ty: 0 };
  if (path.length === 1 || at <= path[0].t) {
    const a = path[0];
    const b = path[1] ?? a;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    return { x: a.x, y: a.y, tx: dx / len, ty: dy / len };
  }
  const last = path[path.length - 1];
  if (at >= last.t) {
    const prev = path[path.length - 2] ?? last;
    const dx = last.x - prev.x;
    const dy = last.y - prev.y;
    const len = Math.hypot(dx, dy) || 1;
    return { x: last.x, y: last.y, tx: dx / len, ty: dy / len };
  }
  let i = 1;
  while (i < path.length && path[i].t < at) i += 1;
  const b = path[i];
  const a = path[i - 1];
  const span = b.t - a.t || 1;
  const u = (at - a.t) / span;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  return {
    x: a.x + dx * u,
    y: a.y + dy * u,
    tx: dx / len,
    ty: dy / len,
  };
};

/**
 * Pointer celebrations: click bursts and/or scroll trails.
 * Trail skin shares click-celebration ink + geometric vocabulary; interaction degree unchanged.
 * Native OS cursors are used everywhere (no custom hand overlay).
 */
export default function CustomCursor({ mode = 'scroll' }: CustomCursorProps) {
  const [clickBursts, setClickBursts] = useState<
    Array<{ id: number; x: number; y: number; seed: number; driftX: number; driftY: number; kind: 0 | 1 | 2 }>
  >([]);
  const [clickGhosts, setClickGhosts] = useState<
    Array<{ id: number; x: number; y: number; seed: number; rot: number; size: number }>
  >([]);
  const [scrollTrails, setScrollTrails] = useState<ScrollTrail[]>([]);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const pathRef = useRef<PathSample[]>([]);
  const trailsRef = useRef<ScrollTrail[]>([]);
  const idRef = useRef(0);
  const lastWheelAtRef = useRef(0);
  const lastTouchSpawnAtRef = useRef(0);
  const touchScrollRef = useRef({ x: 0, y: 0, active: false });
  const gesturePaletteRef = useRef(0);
  const rafRef = useRef(0);
  const lastFrameRef = useRef(0);
  const lastPublishRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const nextId = () => {
      idRef.current += 1;
      return idRef.current;
    };

    const publishTrails = () => {
      setScrollTrails(trailsRef.current.map((t) => ({ ...t })));
    };

    const syncPointer = (clientX: number, clientY: number) => {
      mousePosRef.current.x = clientX;
      mousePosRef.current.y = clientY;
      const now = performance.now();
      const path = pathRef.current;
      const last = path[path.length - 1];
      if (!last || Math.hypot(clientX - last.x, clientY - last.y) >= PATH_MIN_STEP_PX) {
        path.push({ t: now, x: clientX, y: clientY });
        prunePath(path, now);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      syncPointer(e.clientX, e.clientY);
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (mode !== 'all') return;
      const burstCount = 2 + Math.floor(Math.random() * 2);
      const burstIds: number[] = [];
      const ghostPayload: Array<{ id: number; x: number; y: number; seed: number; rot: number; size: number }> =
        [];

      for (let i = 0; i < burstCount; i++) {
        const id = nextId();
        const seed = Math.random();
        const driftAngle = (i / burstCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.8;
        const driftMag = 8 + Math.random() * 14;
        const driftX = Math.cos(driftAngle) * driftMag;
        const driftY = Math.sin(driftAngle) * driftMag;
        const kind = Math.floor(Math.random() * 3) as 0 | 1 | 2;
        const offsetR = Math.random() * 5;
        const offsetA = Math.random() * Math.PI * 2;
        const x = e.clientX + Math.cos(offsetA) * offsetR;
        const y = e.clientY + Math.sin(offsetA) * offsetR;
        burstIds.push(id);
        setClickBursts((prev) => [...prev, { id, x, y, seed, driftX, driftY, kind }]);

        if (i < 1) {
          ghostPayload.push({
            id: nextId(),
            x: x - driftX * 0.28,
            y: y - driftY * 0.28,
            seed,
            rot: (seed - 0.5) * 120,
            size: 10 + seed * 8,
          });
        }
      }
      if (ghostPayload.length) {
        setClickGhosts((prev) => [...prev, ...ghostPayload]);
      }
      window.setTimeout(() => {
        setClickBursts((prev) => prev.filter((b) => !burstIds.includes(b.id)));
      }, 620);
      if (ghostPayload.length) {
        const ghostIds = ghostPayload.map((g) => g.id);
        window.setTimeout(() => {
          setClickGhosts((prev) => prev.filter((g) => !ghostIds.includes(g.id)));
        }, 840);
      }
    };

    const spawnScrollTrails = (
      anchorX: number,
      anchorY: number,
      biasX: number,
      biasY: number,
      mobile = false,
    ) => {
      const now = performance.now();
      const { ox, oy } = irregularFieldOffset(mobile);
      const holdMs = 420 + Math.random() * 360;
      const delayMs = 620 + Math.random() * 520;
      trailsRef.current.push({
        id: nextId(),
        x: anchorX + ox,
        y: anchorY + oy,
        size: (3.6 + Math.random() * 1.7) * (mobile ? 1.08 : 1),
        lag: 0.48 + Math.random() * 0.28,
        born: now,
        holdMs,
        delayMs,
        lifeMs: holdMs + delayMs + 640 + Math.random() * 480,
        waveSeed: Math.random() * Math.PI * 2,
        biasX,
        biasY,
        kind: SCROLL_TRAIL_KINDS[Math.floor(Math.random() * SCROLL_TRAIL_KINDS.length)],
        paletteIndex: gesturePaletteRef.current,
        rot: biasToRot(biasX, biasY) + (Math.random() - 0.5) * 48,
      });

      const cap = mobile ? 4 : 5;
      if (trailsRef.current.length > cap) {
        trailsRef.current = trailsRef.current.slice(-cap);
      }
      publishTrails();
    };

    const handleWheel = (e: WheelEvent) => {
      const now = performance.now();
      if (now - lastWheelAtRef.current < 150) return;
      // New palette edition when a scroll gesture resumes after a pause.
      if (now - lastWheelAtRef.current > 220) {
        gesturePaletteRef.current = Math.floor(Math.random() * CELEBRATION_INK_PALETTES.length);
      }
      lastWheelAtRef.current = now;

      const biasY = Math.max(-10, Math.min(10, e.deltaY * 0.04));
      const biasX = Math.max(-6, Math.min(6, e.deltaX * 0.04));
      spawnScrollTrails(mousePosRef.current.x, mousePosRef.current.y, biasX, biasY);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) {
        touchScrollRef.current.active = false;
        return;
      }
      const touch = e.touches[0];
      syncPointer(touch.clientX, touch.clientY);
      touchScrollRef.current = { x: touch.clientX, y: touch.clientY, active: true };
      gesturePaletteRef.current = Math.floor(Math.random() * CELEBRATION_INK_PALETTES.length);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1 || !touchScrollRef.current.active) return;

      const touch = e.touches[0];
      const now = performance.now();
      const throttleMs = isCoarsePointer() ? 140 : 150;
      syncPointer(touch.clientX, touch.clientY);

      const dx = touch.clientX - touchScrollRef.current.x;
      const dy = touch.clientY - touchScrollRef.current.y;
      touchScrollRef.current = { x: touch.clientX, y: touch.clientY, active: true };

      if (Math.abs(dx) + Math.abs(dy) < 4) return;
      if (now - lastTouchSpawnAtRef.current < throttleMs) return;
      lastTouchSpawnAtRef.current = now;

      const mobile = isCoarsePointer();
      const biasY = Math.max(-10, Math.min(10, -dy * (mobile ? 0.16 : 0.12)));
      const biasX = Math.max(-6, Math.min(6, -dx * (mobile ? 0.16 : 0.12)));
      spawnScrollTrails(touch.clientX, touch.clientY, biasX, biasY, mobile);
    };

    const handleTouchEnd = () => {
      touchScrollRef.current.active = false;
    };

    const tick = (now: number) => {
      rafRef.current = requestAnimationFrame(tick);
      const last = lastFrameRef.current || now;
      const dt = Math.min(32, now - last) / 16.67;
      lastFrameRef.current = now;

      if (trailsRef.current.length === 0) return;

      trailsRef.current = trailsRef.current.filter((t) => {
        const age = now - t.born;
        if (age >= t.lifeMs) return false;

        // Drawn, then wait — then brush a delayed, wavy copy of the pointer path.
        if (age < t.holdMs) return true;

        const delayed = samplePath(pathRef.current, now - t.delayMs, mousePosRef.current);
        const wave = Math.sin(age * 0.0028 + t.waveSeed) * (2.1 + t.lag * 3.2);
        const nx = -delayed.ty;
        const ny = delayed.tx;
        const tx = delayed.x + nx * wave;
        const ty = delayed.y + ny * wave;
        const follow = (0.07 + (1 - t.lag) * 0.12) * dt;
        t.x += (tx - t.x) * follow + t.biasX * 0.035 * dt;
        t.y += (ty - t.y) * follow + t.biasY * 0.035 * dt;
        t.rot = (Math.atan2(delayed.ty, delayed.tx) * 180) / Math.PI;
        t.biasX *= Math.pow(0.92, dt);
        t.biasY *= Math.pow(0.92, dt);
        return true;
      });

      if (now - lastPublishRef.current >= 32 || trailsRef.current.length === 0) {
        lastPublishRef.current = now;
        publishTrails();
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [mode]);

  return (
    <>
      {clickBursts.map((b) => {
        const rot = (b.seed - 0.5) * 120;
        const ringA = 16 + b.seed * 10;
        const ringB = ringA + 10;
        return (
          <motion.div
            key={b.id}
            className="pointer-events-none fixed z-[9998]"
            style={{ left: b.x, top: b.y }}
            initial={{ opacity: 0.32, scale: 0.78, rotate: rot, x: 0, y: 0 }}
            animate={{ opacity: 0, scale: 1.22, rotate: rot + 18, x: b.driftX, y: b.driftY }}
            transition={{ duration: 0.58, ease: 'easeOut' }}
          >
            <div
              className="absolute rounded-full bg-accent/18 blur-[1px]"
              style={{
                width: 2 + b.seed * 3,
                height: 22 + b.seed * 12,
                left: -(1 + b.seed * 1.5),
                top: -8,
                transform: `rotate(${Math.atan2(b.driftY, b.driftX) * (180 / Math.PI)}deg)`,
                transformOrigin: 'center 70%',
              }}
            />
            <div
              className="absolute rounded-full border border-accent/45"
              style={{ width: ringA, height: ringA, left: -ringA / 2, top: -ringA / 2 }}
            />
            <div
              className="absolute rounded-full border border-accent/30"
              style={{ width: ringB, height: ringB, left: -ringB / 2, top: -ringB / 2 }}
            />
            <div
              className="absolute rounded-full bg-accent/34"
              style={{ width: 3, height: 3, left: -1.5, top: -1.5 }}
            />
            {b.kind === 1 && (
              <div
                className="absolute border border-accent/35"
                style={{
                  width: ringA * 0.9,
                  height: ringA * 0.9,
                  left: -(ringA * 0.45),
                  top: -(ringA * 0.45),
                  transform: `rotate(${rot + 15}deg)`,
                  clipPath: 'polygon(25% 6%, 75% 6%, 100% 50%, 75% 94%, 25% 94%, 0% 50%)',
                }}
              />
            )}
            {b.kind === 2 && (
              <>
                <div className="absolute w-[1px] h-[14px] bg-accent/34 -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute w-[14px] h-[1px] bg-accent/34 -translate-x-1/2 -translate-y-1/2" />
              </>
            )}
          </motion.div>
        );
      })}

      {clickGhosts.map((g) => (
        <motion.div
          key={g.id}
          className="pointer-events-none fixed z-[9996]"
          style={{ left: g.x, top: g.y }}
          initial={{ opacity: 0.16, scale: 0.88, rotate: g.rot }}
          animate={{ opacity: 0, scale: 1.05, rotate: g.rot + 8 }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
        >
          <div
            className="absolute rounded-full border border-accent/24"
            style={{ width: g.size, height: g.size, left: -g.size / 2, top: -g.size / 2 }}
          />
          <div
            className="absolute rounded-full border border-accent/16"
            style={{
              width: g.size * 1.45,
              height: g.size * 1.45,
              left: -(g.size * 0.725),
              top: -(g.size * 0.725),
            }}
          />
        </motion.div>
      ))}

      {scrollTrails.map((t) => (
        <ScrollTrailMark key={t.id} trail={t} />
      ))}
    </>
  );
}

function ScrollTrailMark({ trail: t }: { trail: ScrollTrail }) {
  const life = Math.max(0, Math.min(1, 1 - (performance.now() - t.born) / t.lifeMs));
  const palette = inkWithPresence(CELEBRATION_INK_PALETTES[t.paletteIndex % CELEBRATION_INK_PALETTES.length]);
  const op = (a: number) => Math.min(1, life * a);
  const scale = 0.94 + (1 - life) * 0.38;
  const glyph = 0.82;
  const id = t.id;
  const rot = t.rot;
  const s = t.size;
  const mark = 'pointer-events-none fixed z-[9997]';
  const pos = {
    left: t.x,
    top: t.y,
    willChange: 'left, top, opacity, transform',
  } as const;

  if (t.kind === 'spark') {
    const w = 8 + (id % 6) * 1.6;
    return (
      <span
        className={`${mark} rounded-[1px]`}
        style={{
          ...pos,
          width: w,
          height: id % 3 === 0 ? 3 : 1.5,
          backgroundColor: palette.line,
          opacity: op(0.78),
          transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${scale * glyph})`,
        }}
      />
    );
  }

  if (t.kind === 'dash') {
    return (
      <span
        className={`${mark} border-t`}
        style={{
          ...pos,
          width: 14 + (id % 4) * 2.2,
          borderTopColor: palette.line,
          borderTopStyle: id % 3 === 0 ? 'dashed' : 'solid',
          opacity: op(0.72),
          transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${scale * glyph})`,
        }}
      />
    );
  }

  if (t.kind === 'trail') {
    const len = 12 + (id % 5) * 2.4;
    return (
      <span
        className={mark}
        style={{
          ...pos,
          width: len,
          height: 2.5,
          borderRadius: id % 2 === 0 ? '2px 0 0 2px' : '0 2px 2px 0',
          background: `linear-gradient(90deg, ${palette.line}, ${palette.fill})`,
          opacity: op(0.74),
          transform: `translate(-50%, -50%) rotate(${rot}deg) scaleX(${(0.78 + (1 - life) * 1.1) * glyph})`,
        }}
      />
    );
  }

  if (t.kind === 'thickBar') {
    return (
      <span
        className={mark}
        style={{
          ...pos,
          width: 16 + (id % 4),
          height: 3 + (id % 2),
          backgroundColor: palette.line,
          borderRadius: 1,
          opacity: op(0.7),
          transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${scale * glyph})`,
        }}
      />
    );
  }

  if (t.kind === 'bar') {
    return (
      <span
        className={mark}
        style={{
          ...pos,
          width: 2 + (id % 2),
          height: 15 + (id % 5),
          backgroundColor: palette.line,
          borderRadius: 1,
          opacity: op(0.7),
          transform: `translate(-50%, -50%) rotate(${rot + 18}deg) scale(${scale * glyph})`,
        }}
      />
    );
  }

  if (t.kind === 'path') {
    return (
      <span
        className={`${mark} border-t`}
        style={{
          ...pos,
          width: 18 + (id % 5) * 2,
          height: 8 + (id % 3),
          borderTopColor: palette.line,
          borderTopWidth: 1.5,
          borderRadius: 999,
          opacity: op(0.74),
          transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${scale * glyph})`,
        }}
      />
    );
  }

  if (t.kind === 'zig') {
    return (
      <span
        className={mark}
        style={{
          ...pos,
          width: 18,
          height: 11,
          background: `linear-gradient(115deg, transparent 40%, ${palette.line} 40%, ${palette.line} 45%, transparent 45%, transparent 55%, ${palette.line} 55%, ${palette.line} 60%, transparent 60%)`,
          opacity: op(0.68),
          transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${scale * glyph})`,
        }}
      />
    );
  }

  if (t.kind === 'diamond') {
    const d = 10 + (id % 3);
    return (
      <span
        className={`${mark} border`}
        style={{
          ...pos,
          width: d,
          height: d,
          borderColor: palette.ring,
          borderWidth: 1.5,
          opacity: op(0.68),
          transform: `translate(-50%, -50%) rotate(${45 + (id % 2) * 18}deg) scale(${scale * glyph})`,
        }}
      />
    );
  }

  if (t.kind === 'triangle') {
    return (
      <span
        className={mark}
        style={{
          ...pos,
          width: 15,
          height: 13,
          backgroundColor: palette.fill,
          border: `1.5px solid ${palette.ring}`,
          clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
          opacity: op(0.66),
          transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${scale * glyph})`,
        }}
      />
    );
  }

  if (t.kind === 'kite') {
    return (
      <span
        className={mark}
        style={{
          ...pos,
          width: 13,
          height: 13,
          background: `linear-gradient(135deg, ${palette.fill}, transparent 55%)`,
          border: `1.5px solid ${palette.ring}`,
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          opacity: op(0.66),
          transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${scale * glyph})`,
        }}
      />
    );
  }

  if (t.kind === 'shard') {
    return (
      <span
        className={mark}
        style={{
          ...pos,
          width: 11,
          height: 17,
          backgroundColor: palette.line,
          clipPath: 'polygon(50% 0%, 100% 35%, 80% 100%, 20% 100%, 0% 35%)',
          opacity: op(0.62),
          transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${scale * glyph})`,
        }}
      />
    );
  }

  if (t.kind === 'arc') {
    const a = 16 + (id % 4);
    return (
      <span
        className={`${mark} rounded-full`}
        style={{
          ...pos,
          width: a,
          height: a,
          border: `1.5px solid ${palette.ring}`,
          borderBottomColor: 'transparent',
          borderLeftColor: id % 2 === 0 ? 'transparent' : palette.ring,
          opacity: op(0.66),
          transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${scale * glyph})`,
        }}
      />
    );
  }

  if (t.kind === 'wedge') {
    const span = 48 + (id % 5) * 14;
    return (
      <span
        className={mark}
        style={{
          ...pos,
          width: 22,
          height: 22,
          background: `conic-gradient(from ${rot}deg, ${palette.fill} 0deg ${span}deg, transparent ${span}deg)`,
          opacity: op(0.62),
          transform: `translate(-50%, -50%) scale(${scale * glyph})`,
        }}
      />
    );
  }

  if (t.kind === 'sweep') {
    const span = 70 + (id % 4) * 12;
    return (
      <span
        className={`${mark} rounded-full`}
        style={{
          ...pos,
          width: 24,
          height: 24,
          background: `conic-gradient(from ${rot}deg, ${palette.line} 0deg ${span}deg, transparent ${span}deg, transparent 360deg)`,
          opacity: op(0.58),
          transform: `translate(-50%, -50%) scale(${scale * glyph})`,
        }}
      />
    );
  }

  if (t.kind === 'mandala') {
    const m = 13 + (id % 3);
    return (
      <span
        className={`${mark} rounded-full border`}
        style={{
          ...pos,
          width: m,
          height: m,
          borderColor: palette.ring,
          boxShadow: `0 0 0 1px ${palette.fill} inset`,
          opacity: op(0.7),
          transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${scale * glyph})`,
        }}
      />
    );
  }

  if (t.kind === 'hex') {
    const h = 11 + (id % 2);
    return (
      <span
        className={`${mark} border`}
        style={{
          ...pos,
          width: h,
          height: h,
          borderColor: palette.ring,
          borderWidth: 1.5,
          clipPath: 'polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)',
          opacity: op(0.62),
          transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${scale * glyph})`,
        }}
      />
    );
  }

  if (t.kind === 'ellipse') {
    return (
      <span
        className={`${mark} rounded-full border`}
        style={{
          ...pos,
          width: 16 + (id % 5) * 2,
          height: 9 + (id % 4),
          borderColor: palette.ring,
          borderWidth: 1.5,
          opacity: op(0.72),
          transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${scale * glyph})`,
        }}
      />
    );
  }

  const o = Math.max(8, s * 1.15);
  return (
    <span
      className={`${mark} rounded-full border`}
      style={{
        ...pos,
        width: o,
        height: o,
        borderColor: palette.ring,
        backgroundColor: palette.fill,
        opacity: op(0.58),
        transform: `translate(-50%, -50%) scale(${scale * glyph})`,
      }}
    />
  );
}
