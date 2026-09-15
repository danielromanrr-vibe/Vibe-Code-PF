import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

type CustomCursorProps = {
  /** `scroll` — wheel trails only (default when click celebration lives elsewhere). `all` — click + scroll. */
  mode?: 'scroll' | 'all';
};

type ScrollTrail = {
  id: number;
  x: number;
  y: number;
  size: number;
  /** 0–1; higher = slower chase (more ribbon lag). */
  lag: number;
  born: number;
  lifeMs: number;
  /** Soft scroll-direction bias that decays quickly. */
  biasX: number;
  biasY: number;
};

const isCoarsePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

/**
 * Pointer celebrations: click bursts and/or scroll trails.
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
  const trailsRef = useRef<ScrollTrail[]>([]);
  const idRef = useRef(0);
  const lastWheelAtRef = useRef(0);
  const lastTouchSpawnAtRef = useRef(0);
  const touchScrollRef = useRef({ x: 0, y: 0, active: false });
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
      const sizeBoost = mobile ? 1.2 : 1;
      const lifeBoost = mobile ? 1.12 : 1;

      const spawn = (lag: number, size: number, jitter = 6) => {
        trailsRef.current.push({
          id: nextId(),
          x: anchorX + (Math.random() - 0.5) * jitter,
          y: anchorY + (Math.random() - 0.5) * jitter,
          size: size * sizeBoost,
          lag,
          born: now,
          lifeMs: (680 + Math.random() * 160) * lifeBoost,
          biasX,
          biasY,
        });
      };

      spawn(0.35 + Math.random() * 0.25, 4.8 + Math.random() * 3.0);
      spawn(0.55 + Math.random() * 0.3, 3.6 + Math.random() * 2.2, mobile ? 12 : 10);

      const cap = mobile ? 24 : 28;
      if (trailsRef.current.length > cap) {
        trailsRef.current = trailsRef.current.slice(-cap);
      }
      publishTrails();
    };

    const handleWheel = (e: WheelEvent) => {
      const now = performance.now();
      if (now - lastWheelAtRef.current < 46) return;
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
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1 || !touchScrollRef.current.active) return;

      const touch = e.touches[0];
      const now = performance.now();
      const throttleMs = isCoarsePointer() ? 34 : 46;
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

      const mx = mousePosRef.current.x;
      const my = mousePosRef.current.y;

      trailsRef.current = trailsRef.current.filter((t) => {
        const age = now - t.born;
        if (age >= t.lifeMs) return false;

        // Chase pointer with lag — ribbon behind the cursor, not louder.
        const follow = (0.1 + (1 - t.lag) * 0.16) * dt;
        t.x += (mx - t.x) * follow + t.biasX * 0.08 * dt;
        t.y += (my - t.y) * follow + t.biasY * 0.08 * dt;
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

      {scrollTrails.map((t) => {
        const life = Math.max(0, Math.min(1, 1 - (performance.now() - t.born) / t.lifeMs));
        return (
          <div
            key={t.id}
            className="pointer-events-none fixed rounded-full border border-accent/40 bg-accent/18 z-[9997]"
            style={{
              left: t.x - t.size / 2,
              top: t.y - t.size / 2,
              width: t.size,
              height: t.size,
              opacity: 0.18 + life * 0.32,
              transform: `scale(${0.92 + (1 - life) * 0.55})`,
              willChange: 'left, top, opacity, transform',
            }}
          />
        );
      })}
    </>
  );
}
