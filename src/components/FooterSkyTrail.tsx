import { useEffect, useRef, useState } from 'react';
import { CELEBRATION_INK_PALETTES, type ScrollTrailKind } from '../lib/celebrationInk';
import { isCoarseMouse, isFineMouse, shufflePick } from '../lib/pointerGesture';

type MarkKind = Extract<
  ScrollTrailKind,
  'spark' | 'dash' | 'trail' | 'orb' | 'diamond' | 'hex' | 'triangle' | 'bar'
>;

type TrailMark = {
  id: number;
  x: number;
  y: number;
  born: number;
  kind: MarkKind;
  paletteIndex: number;
  rot: number;
};

const KINDS: readonly MarkKind[] = ['spark', 'dash', 'trail', 'orb', 'diamond', 'hex', 'triangle', 'bar'];
const LIFE_MS = 920;
const MAX_MARKS = 16;
const MOVE_GAP_PX = 22;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * Footer pointer language — same Kandinsky ink as click/scroll celebrations.
 * Discrete marks that fade, not a second hero mandala field.
 */
export default function FooterSkyTrail({ live = false, hot = false }: { live?: boolean; hot?: boolean }) {
  const layerRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);
  const lastMoveRef = useRef({ t: 0, x: 0, y: 0 });
  const countRef = useRef(0);
  const [marks, setMarks] = useState<TrailMark[]>([]);

  useEffect(() => {
    countRef.current = marks.length;
  }, [marks]);

  useEffect(() => {
    if (!live) {
      setMarks([]);
      return;
    }
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const layer = layerRef.current;
    const host = layer?.parentElement;
    if (!layer || !host) return;

    const toLocal = (clientX: number, clientY: number) => {
      const rect = layer.getBoundingClientRect();
      return {
        x: clamp(clientX - rect.left, 0, rect.width),
        y: clamp(clientY - rect.top, 0, rect.height),
      };
    };

    const emit = (clientX: number, clientY: number, kind: MarkKind, paletteIndex: number) => {
      const { x, y } = toLocal(clientX, clientY);
      const id = ++idRef.current;
      setMarks((prev) => [
        ...prev.slice(-(MAX_MARKS - 1)),
        { id, x, y, born: performance.now(), kind, paletteIndex, rot: (id * 23) % 180 },
      ]);
    };

    let raf = 0;
    const tick = () => {
      const now = performance.now();
      setMarks((prev) => prev.filter((mark) => now - mark.born < LIFE_MS));
      raf = countRef.current > 0 ? requestAnimationFrame(tick) : 0;
    };
    const startTick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      if (!isFineMouse(event)) return;
      const now = performance.now();
      const gap = hot ? 48 : 78;
      const dx = event.clientX - lastMoveRef.current.x;
      const dy = event.clientY - lastMoveRef.current.y;
      if (now - lastMoveRef.current.t < gap || dx * dx + dy * dy < MOVE_GAP_PX * MOVE_GAP_PX) return;
      lastMoveRef.current = { t: now, x: event.clientX, y: event.clientY };
      emit(
        event.clientX,
        event.clientY,
        KINDS[idRef.current % KINDS.length]!,
        idRef.current % CELEBRATION_INK_PALETTES.length,
      );
      startTick();
    };

    const onDown = (event: PointerEvent) => {
      if (event.button !== 0 && event.pointerType === 'mouse') return;
      if (isCoarseMouse(event)) return;
      if (event.target instanceof Element && event.target.closest('a, button')) return;
      const kinds = shufflePick(KINDS, 3);
      const paletteIndex = Math.floor(Math.random() * CELEBRATION_INK_PALETTES.length);
      const count = 5;
      for (let i = 0; i < count; i += 1) {
        const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
        const radius = 18 + Math.random() * 16 + (i % 2) * 6;
        emit(
          event.clientX + Math.cos(angle) * radius,
          event.clientY + Math.sin(angle) * radius,
          kinds[i % kinds.length]!,
          paletteIndex,
        );
      }
      startTick();
    };

    host.addEventListener('pointermove', onMove, { passive: true });
    host.addEventListener('pointerdown', onDown);
    return () => {
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerdown', onDown);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [live, hot]);

  return (
    <div ref={layerRef} className="site-footer-sky-trail" aria-hidden>
      {marks.map((mark) => (
        <SkyMark key={mark.id} mark={mark} />
      ))}
    </div>
  );
}

function SkyMark({ mark }: { mark: TrailMark }) {
  const life = Math.max(0, Math.min(1, 1 - (performance.now() - mark.born) / LIFE_MS));
  const palette = CELEBRATION_INK_PALETTES[mark.paletteIndex % CELEBRATION_INK_PALETTES.length]!;
  const op = (alpha: number) => life * alpha;
  const scale = 0.92 + (1 - life) * 0.28;
  const pos = { left: mark.x, top: mark.y } as const;

  if (mark.kind === 'spark') {
    return (
      <span
        className="site-footer-sky-trail__mark"
        style={{
          ...pos,
          width: 7 + (mark.id % 5),
          height: mark.id % 3 === 0 ? 2.5 : 1.25,
          backgroundColor: palette.line,
          opacity: op(0.7),
          transform: `translate(-50%, -50%) rotate(${mark.rot}deg) scale(${scale})`,
        }}
      />
    );
  }

  if (mark.kind === 'dash') {
    return (
      <span
        className="site-footer-sky-trail__mark site-footer-sky-trail__mark--line"
        style={{
          ...pos,
          width: 12 + (mark.id % 4) * 2,
          borderTopColor: palette.line,
          borderTopStyle: mark.id % 3 === 0 ? 'dashed' : 'solid',
          opacity: op(0.64),
          transform: `translate(-50%, -50%) rotate(${mark.rot}deg)`,
        }}
      />
    );
  }

  if (mark.kind === 'trail') {
    return (
      <span
        className="site-footer-sky-trail__mark"
        style={{
          ...pos,
          width: 11 + (mark.id % 4) * 2,
          height: 2,
          borderRadius: mark.id % 2 === 0 ? '2px 0 0 2px' : '0 2px 2px 0',
          background: `linear-gradient(90deg, ${palette.line}, ${palette.fill})`,
          opacity: op(0.66),
          transform: `translate(-50%, -50%) rotate(${mark.rot}deg) scaleX(${0.8 + (1 - life) * 0.7})`,
        }}
      />
    );
  }

  if (mark.kind === 'orb') {
    return (
      <span
        className="site-footer-sky-trail__mark site-footer-sky-trail__mark--orb"
        style={{
          ...pos,
          width: 8,
          height: 8,
          borderColor: palette.ring,
          backgroundColor: palette.fill,
          opacity: op(0.42),
          transform: `translate(-50%, -50%) scale(${0.84 + (1 - life) * 0.4})`,
        }}
      />
    );
  }

  if (mark.kind === 'diamond') {
    return (
      <span
        className="site-footer-sky-trail__mark site-footer-sky-trail__mark--orb"
        style={{
          ...pos,
          width: 8,
          height: 8,
          borderColor: palette.ring,
          opacity: op(0.52),
          transform: `translate(-50%, -50%) rotate(45deg) scale(${scale})`,
        }}
      />
    );
  }

  if (mark.kind === 'hex') {
    return (
      <span
        className="site-footer-sky-trail__mark site-footer-sky-trail__mark--orb"
        style={{
          ...pos,
          width: 9,
          height: 9,
          borderColor: palette.ring,
          clipPath: 'polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)',
          opacity: op(0.4),
          transform: `translate(-50%, -50%) rotate(${mark.rot}deg) scale(${scale})`,
        }}
      />
    );
  }

  if (mark.kind === 'triangle') {
    return (
      <span
        className="site-footer-sky-trail__mark"
        style={{
          ...pos,
          width: 11,
          height: 10,
          backgroundColor: palette.fill,
          border: `1px solid ${palette.ring}`,
          clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
          opacity: op(0.48),
          transform: `translate(-50%, -50%) rotate(${mark.rot}deg) scale(${scale})`,
        }}
      />
    );
  }

  return (
    <span
      className="site-footer-sky-trail__mark"
      style={{
        ...pos,
        width: 2,
        height: 13 + (mark.id % 4),
        backgroundColor: palette.line,
        borderRadius: 1,
        opacity: op(0.58),
        transform: `translate(-50%, -50%) rotate(${mark.rot + 16}deg) scale(${scale})`,
      }}
    />
  );
}
