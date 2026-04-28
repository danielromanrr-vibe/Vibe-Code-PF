import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

/**
 * Click bursts + scroll trails at the pointer. Native OS cursors are used everywhere (no custom hand overlay).
 */
export default function CustomCursor() {
  const [clickBursts, setClickBursts] = useState<Array<{ id: number; x: number; y: number; seed: number; driftX: number; driftY: number; kind: 0 | 1 | 2 }>>([]);
  const [clickGhosts, setClickGhosts] = useState<Array<{ id: number; x: number; y: number; seed: number; rot: number; size: number }>>([]);
  const [scrollTrails, setScrollTrails] = useState<Array<{ id: number; x: number; y: number; size: number; dx: number; dy: number }>>([]);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const idRef = useRef(0);
  const lastWheelAtRef = useRef(0);

  useEffect(() => {
    const nextId = () => {
      idRef.current += 1;
      return idRef.current;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current.x = e.clientX;
      mousePosRef.current.y = e.clientY;
    };

    const handleMouseDown = (e: MouseEvent) => {
      const burstCount = 2 + Math.floor(Math.random() * 2);
      const burstIds: number[] = [];
      const ghostPayload: Array<{ id: number; x: number; y: number; seed: number; rot: number; size: number }> = [];

      for (let i = 0; i < burstCount; i++) {
        const id = nextId();
        const seed = Math.random();
        const driftAngle = (i / burstCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.8;
        const driftMag = 8 + Math.random() * 14;
        const driftX = Math.cos(driftAngle) * driftMag;
        const driftY = Math.sin(driftAngle) * driftMag;
        const kind = (Math.floor(Math.random() * 3) as 0 | 1 | 2);
        const offsetR = Math.random() * 5;
        const offsetA = Math.random() * Math.PI * 2;
        const x = e.clientX + Math.cos(offsetA) * offsetR;
        const y = e.clientY + Math.sin(offsetA) * offsetR;
        burstIds.push(id);
        setClickBursts((prev) => [...prev, { id, x, y, seed, driftX, driftY, kind }]);

        if (i < 1) {
          const ghostId = nextId();
          ghostPayload.push({
            id: ghostId,
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

    const handleWheel = (e: WheelEvent) => {
      const now = performance.now();
      if (now - lastWheelAtRef.current < 46) return;
      lastWheelAtRef.current = now;
      const id = nextId();
      const size = 4.8 + Math.random() * 3.2;
      const jitterX = (Math.random() - 0.5) * 8;
      const jitterY = (Math.random() - 0.5) * 8;
      const dy = Math.max(-14, Math.min(14, e.deltaY * 0.055));
      const dx = Math.max(-8, Math.min(8, e.deltaX * 0.055));
      setScrollTrails((prev) => [
        ...prev,
        { id, x: mousePosRef.current.x + jitterX, y: mousePosRef.current.y + jitterY, size, dx, dy },
      ]);
      const id2 = nextId();
      setScrollTrails((prev) => [
        ...prev,
        {
          id: id2,
          x: mousePosRef.current.x + jitterX - dx * 0.7,
          y: mousePosRef.current.y + jitterY - dy * 0.7,
          size: Math.max(3.6, size - 0.9),
          dx: dx * 0.6,
          dy: dy * 0.6,
        },
      ]);
      window.setTimeout(() => {
        setScrollTrails((prev) => prev.filter((t) => t.id !== id));
      }, 640);
      window.setTimeout(() => {
        setScrollTrails((prev) => prev.filter((t) => t.id !== id2));
      }, 720);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

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
            style={{ width: g.size * 1.45, height: g.size * 1.45, left: -(g.size * 0.725), top: -(g.size * 0.725) }}
          />
        </motion.div>
      ))}

      {scrollTrails.map((t) => (
        <motion.div
          key={t.id}
          className="pointer-events-none fixed rounded-full border border-accent/45 bg-accent/22 z-[9997]"
          style={{ left: t.x - t.size / 2, top: t.y - t.size / 2, width: t.size, height: t.size }}
          initial={{ opacity: 0.5, scale: 0.95, x: 0, y: 0 }}
          animate={{ opacity: 0, scale: 1.9, x: t.dx, y: t.dy }}
          transition={{ duration: 0.62, ease: 'easeOut' }}
        />
      ))}
    </>
  );
}
