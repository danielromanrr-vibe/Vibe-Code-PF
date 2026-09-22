import { useEffect, useRef } from 'react';
import {
  CELEBRATION_INK_PALETTES,
  inkWithPresence,
  paintCelebrationMark,
  SCROLL_TRAIL_KINDS,
  type ScrollTrailKind,
} from '../lib/celebrationInk';
import { classifyContact, isFineMouse, isTouchLike, shufflePick } from '../lib/pointerGesture';

const CURSOR_LERP = 0.16;
const NODE_POS_LERP = 0.22;
const REVEAL_LERP = 0.1;
const HOVER_LERP_IN = 0.08;
const HOVER_LERP_OUT = 0.06;
const PUSH_RADIUS = 84;
const PUSH_STRENGTH = 10;
const REVEAL_THRESH = 0.18;
const SETTLE = 0.04;
const MARK_GLYPH = 0.7;
const MARK_ALPHA = 0.62;

type TitleEntity = {
  letter: HTMLSpanElement;
  mark: HTMLSpanElement | null;
  live: boolean;
  liveIndex: number;
  kind: ScrollTrailKind;
  seed: number;
  ox: number;
  oy: number;
  reveal: number;
  rot: number;
};

type PlayfulTitleFieldProps = {
  title: string;
  lines?: readonly string[];
  headingId: string;
  className?: string;
  reducedMotion: boolean;
};

const isLiveChar = (ch: string) => /[A-Za-z]/.test(ch);

const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

const collectEntities = (heading: HTMLHeadingElement): TitleEntity[] => {
  const letters = Array.from(heading.querySelectorAll<HTMLSpanElement>('[data-title-ch]'));
  let liveIndex = 0;
  return letters.map((letter, i) => {
    const live = letter.dataset.live === '1';
    const mark = letter.querySelector<HTMLSpanElement>('[data-title-mark]');
    const seed = (i * 17 + 11) % 24;
    if (mark) {
      const ang = (seed / 24) * Math.PI * 2;
      mark.style.left = `${50 + Math.cos(ang) * 72}%`;
      mark.style.top = `${48 + Math.sin(ang) * 62}%`;
    }
    const entity: TitleEntity = {
      letter,
      mark,
      live,
      liveIndex: live ? liveIndex : -1,
      kind: SCROLL_TRAIL_KINDS[0]!,
      seed,
      ox: 0,
      oy: 0,
      reveal: 0,
      rot: (seed / 24) * 180,
    };
    if (live) liveIndex += 1;
    return entity;
  });
};

const titleLines = (title: string, lines?: readonly string[]): readonly string[] =>
  lines && lines.length > 0 ? lines : [title];

export default function PlayfulTitleField({
  title,
  lines,
  headingId,
  className = '',
  reducedMotion,
}: PlayfulTitleFieldProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const entitiesRef = useRef<TitleEntity[]>([]);
  const paletteRef = useRef(inkWithPresence(CELEBRATION_INK_PALETTES[0]));
  const kindsRef = useRef<ScrollTrailKind[]>(SCROLL_TRAIL_KINDS.slice(0, 3));
  const rawMouseRef = useRef({ x: 0, y: 0 });
  const mouseRef = useRef({ x: 0, y: 0 });
  const hoveringRef = useRef(false);
  const hoverFactorRef = useRef(0);
  const rafRef = useRef(0);
  const renderedLines = titleLines(title, lines);

  useEffect(() => {
    const heading = headingRef.current;
    if (!heading || reducedMotion) return;

    const beginEdition = (x: number, y: number) => {
      rawMouseRef.current.x = x;
      rawMouseRef.current.y = y;
      mouseRef.current.x = x;
      mouseRef.current.y = y;
      kindsRef.current = shufflePick(SCROLL_TRAIL_KINDS, 3);
      const paletteIndex = Math.floor(Math.random() * CELEBRATION_INK_PALETTES.length);
      paletteRef.current = inkWithPresence(CELEBRATION_INK_PALETTES[paletteIndex]!);
    };

    const bind = () => {
      entitiesRef.current = collectEntities(heading);
      hoveringRef.current = false;
      hoverFactorRef.current = 0;

      const stopRaf = () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      };

      const tick = () => {
        const hovering = hoveringRef.current;
        hoverFactorRef.current = lerp(
          hoverFactorRef.current,
          hovering ? 1 : 0,
          hovering ? HOVER_LERP_IN : HOVER_LERP_OUT,
        );
        const hf = hoverFactorRef.current;
        mouseRef.current.x = lerp(mouseRef.current.x, rawMouseRef.current.x, CURSOR_LERP);
        mouseRef.current.y = lerp(mouseRef.current.y, rawMouseRef.current.y, CURSOR_LERP);
        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;
        const palette = paletteRef.current;
        const kinds = kindsRef.current;
        let busy = hovering || hf > 0.01;

        entitiesRef.current.forEach((entity) => {
          if (!entity.live) return;
          entity.kind = kinds[entity.liveIndex % kinds.length]!;
          const rect = entity.letter.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = cx - mx;
          const dy = cy - my;
          const dist = Math.hypot(dx, dy) || 1;
          const inField = hf > REVEAL_THRESH && dist < PUSH_RADIUS;
          const falloff = inField ? 1 - dist / PUSH_RADIUS : 0;
          const nx = dx / dist;
          const ny = dy / dist;
          const tx = nx * falloff * PUSH_STRENGTH * hf;
          const ty = ny * falloff * PUSH_STRENGTH * hf;
          entity.ox = lerp(entity.ox, tx, NODE_POS_LERP);
          entity.oy = lerp(entity.oy, ty, NODE_POS_LERP);
          const revealTarget = falloff > 0.12 ? Math.min(1, falloff * 1.35) * hf : 0;
          entity.reveal = lerp(entity.reveal, revealTarget, REVEAL_LERP);
          entity.rot = lerp(entity.rot, (Math.atan2(dy, dx) * 180) / Math.PI, 0.12);
          entity.letter.style.transform = `translate(${entity.ox}px, ${entity.oy}px)`;
          if (entity.mark) {
            paintCelebrationMark(
              entity.mark,
              entity.kind,
              palette,
              entity.reveal * MARK_ALPHA,
              entity.rot,
              entity.seed,
              MARK_GLYPH,
            );
          }
          if (Math.abs(entity.ox) > SETTLE || Math.abs(entity.oy) > SETTLE || entity.reveal > SETTLE) {
            busy = true;
          }
        });

        if (busy) rafRef.current = requestAnimationFrame(tick);
        else rafRef.current = 0;
      };

      const kick = () => {
        if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
      };

      type TitleContact = {
        pointerId: number;
        x: number;
        y: number;
        startedAt: number;
        phase: 'pending' | 'brush' | 'scroll';
      };
      let contact: TitleContact | null = null;

      const onEnter = (event: PointerEvent) => {
        if (!isFineMouse(event)) return;
        hoveringRef.current = true;
        if (hoverFactorRef.current < 0.08) beginEdition(event.clientX, event.clientY);
        else {
          rawMouseRef.current.x = event.clientX;
          rawMouseRef.current.y = event.clientY;
        }
        kick();
      };

      const onMove = (event: PointerEvent) => {
        if (isFineMouse(event)) {
          rawMouseRef.current.x = event.clientX;
          rawMouseRef.current.y = event.clientY;
          if (hoveringRef.current) kick();
          return;
        }
        if (!isTouchLike(event) || !contact || contact.pointerId !== event.pointerId) return;
        rawMouseRef.current.x = event.clientX;
        rawMouseRef.current.y = event.clientY;
        const dx = event.clientX - contact.x;
        const dy = event.clientY - contact.y;
        const kind = classifyContact(dx, dy, performance.now() - contact.startedAt, { allowBrush: true });
        if (kind === 'scroll') {
          contact.phase = 'scroll';
          hoveringRef.current = false;
          kick();
          return;
        }
        if (kind === 'brush' && contact.phase !== 'scroll') {
          if (contact.phase !== 'brush') beginEdition(event.clientX, event.clientY);
          contact.phase = 'brush';
          hoveringRef.current = true;
          kick();
        }
      };

      const onLeave = (event: PointerEvent) => {
        hoveringRef.current = false;
        if (contact && event.pointerType !== 'mouse') contact.phase = 'scroll';
        kick();
      };

      const onPointerDown = (event: PointerEvent) => {
        if (!isTouchLike(event)) return;
        contact = {
          pointerId: event.pointerId,
          x: event.clientX,
          y: event.clientY,
          startedAt: performance.now(),
          phase: 'pending',
        };
      };

      const onPointerUp = (event: PointerEvent) => {
        if (!contact || contact.pointerId !== event.pointerId) return;
        hoveringRef.current = false;
        contact = null;
        kick();
      };

      heading.addEventListener('pointerenter', onEnter);
      heading.addEventListener('pointermove', onMove);
      heading.addEventListener('pointerleave', onLeave);
      heading.addEventListener('pointerdown', onPointerDown);
      heading.addEventListener('pointerup', onPointerUp);
      heading.addEventListener('pointercancel', onPointerUp);

      return () => {
        heading.removeEventListener('pointerenter', onEnter);
        heading.removeEventListener('pointermove', onMove);
        heading.removeEventListener('pointerleave', onLeave);
        heading.removeEventListener('pointerdown', onPointerDown);
        heading.removeEventListener('pointerup', onPointerUp);
        heading.removeEventListener('pointercancel', onPointerUp);
        stopRaf();
        entitiesRef.current.forEach((entity) => {
          entity.letter.style.transform = '';
          if (entity.mark) {
            entity.mark.style.opacity = '0';
            entity.mark.style.visibility = 'hidden';
          }
        });
        entitiesRef.current = [];
      };
    };

    const detach = bind();
    return () => detach();
  }, [reducedMotion]);

  return (
    <h1
      ref={headingRef}
      id={headingId}
      className={['playful-title', className].filter(Boolean).join(' ')}
      aria-label={title}
    >
      {reducedMotion ? (
        renderedLines.length > 1 ? (
          renderedLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))
        ) : (
          title
        )
      ) : (
        <span aria-hidden="true" className="visual-landing__title-field playful-title__field">
          {renderedLines.map((line, lineIndex) => (
            <span key={`${lineIndex}-${line}`} className="visual-landing__title-line playful-title__line">
              {line.split(/\s+/).filter(Boolean).map((chunk, chunkIndex) => (
                <span key={`${lineIndex}-w-${chunkIndex}`} className="playful-title__word">
                  {Array.from(chunk).map((ch, charIndex) => {
                    const live = isLiveChar(ch);
                    return (
                      <span
                        key={`${lineIndex}-${chunkIndex}-${charIndex}`}
                        data-title-ch=""
                        data-live={live ? '1' : '0'}
                        className={
                          live
                            ? 'visual-landing__title-ch visual-landing__title-ch--live playful-title__ch'
                            : 'visual-landing__title-ch playful-title__ch'
                        }
                      >
                        {ch}
                        {live ? (
                          <span data-title-mark="" className="visual-landing__title-mark playful-title__mark" />
                        ) : null}
                      </span>
                    );
                  })}
                </span>
              ))}
            </span>
          ))}
        </span>
      )}
    </h1>
  );
}
