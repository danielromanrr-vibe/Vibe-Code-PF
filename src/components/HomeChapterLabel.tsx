import { useEffect, useRef, type PointerEvent } from 'react';

export type HomeChapterField = 'studies' | 'team' | 'about';

type HomeChapterLabelProps = {
  id: string;
  field: HomeChapterField;
  children: string;
};

const REDUCE_MOTION = '(prefers-reduced-motion: reduce)';

function hexPoints(cx: number, cy: number, r: number) {
  return Array.from({ length: 6 }, (_, s) => {
    const a = (s / 6) * Math.PI * 2 - Math.PI / 2;
    return `${(cx + Math.cos(a) * r).toFixed(2)},${(cy + Math.sin(a) * r).toFixed(2)}`;
  }).join(' ');
}

function FieldStudies() {
  return (
    <>
      <g className="home-chapter-label__orbit">
        <path className="home-chapter-label__arc" d="M18 78 A118 72 0 0 1 236 40" stroke="currentColor" strokeWidth="0.85" />
        <path
          className="home-chapter-label__dash home-chapter-label__dash--slow"
          d="M48 70 A86 52 0 0 1 214 36"
          stroke="currentColor"
          strokeWidth="0.65"
          strokeDasharray="2.2 4.4"
        />
        <g className="home-chapter-label__sat">
          <circle
            className="home-chapter-label__dash"
            cx="232"
            cy="28"
            r="22"
            stroke="currentColor"
            strokeWidth="0.6"
            strokeDasharray="1.6 3.2"
          />
        </g>
      </g>
      <g className="home-chapter-label__paths">
        <path
          className="home-chapter-label__dash home-chapter-label__dash--drift"
          d="M22 52 L72 40 L128 48 L186 32 L232 28"
          stroke="currentColor"
          strokeWidth="0.45"
          strokeDasharray="1.5 3.6"
        />
        <path className="home-chapter-label__arc" d="M72 40 Q150 18 232 28" stroke="currentColor" strokeWidth="0.45" />
      </g>
      <g className="home-chapter-label__node home-chapter-label__node--a">
        <g className="home-chapter-label__breath home-chapter-label__breath--a">
          <circle cx="22" cy="52" r="1.3" fill="currentColor" />
          <circle cx="22" cy="52" r="4" stroke="currentColor" strokeWidth="0.5" />
        </g>
      </g>
      <g className="home-chapter-label__node home-chapter-label__node--b">
        <g className="home-chapter-label__breath home-chapter-label__breath--b">
          <polygon points={hexPoints(72, 40, 6.5)} fill="currentColor" opacity="0.4" />
          <circle
            className="home-chapter-label__dash"
            cx="72"
            cy="40"
            r="9.2"
            stroke="currentColor"
            strokeWidth="0.45"
            strokeDasharray="1.7 2.8"
          />
        </g>
      </g>
      <g className="home-chapter-label__node home-chapter-label__node--c">
        <g className="home-chapter-label__breath home-chapter-label__breath--c">
          <circle cx="128" cy="48" r="1.15" fill="currentColor" />
          <circle cx="186" cy="32" r="1.05" fill="currentColor" />
        </g>
      </g>
      <g className="home-chapter-label__node home-chapter-label__node--d">
        <g className="home-chapter-label__breath home-chapter-label__breath--d">
          <circle cx="232" cy="28" r="1.45" fill="currentColor" />
          <circle cx="232" cy="28" r="3.6" stroke="currentColor" strokeWidth="0.45" />
        </g>
      </g>
    </>
  );
}

function FieldTeam() {
  return (
    <>
      <g className="home-chapter-label__orbit">
        <path className="home-chapter-label__arc" d="M36 22 A54 54 0 0 1 36 74" stroke="currentColor" strokeWidth="0.8" />
        <path className="home-chapter-label__arc" d="M168 18 A58 58 0 0 0 168 78" stroke="currentColor" strokeWidth="0.8" />
        <path
          className="home-chapter-label__dash home-chapter-label__dash--slow"
          d="M92 48 A38 22 0 1 1 148 48"
          stroke="currentColor"
          strokeWidth="0.6"
          strokeDasharray="2 4.2"
        />
      </g>
      <g className="home-chapter-label__paths">
        <path className="home-chapter-label__arc" d="M58 48 C 92 28 124 68 156 48" stroke="currentColor" strokeWidth="0.5" />
        <path
          className="home-chapter-label__dash home-chapter-label__dash--drift"
          d="M58 48 L96 40 L124 56 L156 48"
          stroke="currentColor"
          strokeWidth="0.45"
          strokeDasharray="1.4 3.4"
        />
      </g>
      <g className="home-chapter-label__node home-chapter-label__node--a">
        <g className="home-chapter-label__breath home-chapter-label__breath--a">
          <circle cx="58" cy="48" r="1.4" fill="currentColor" />
          <circle cx="58" cy="48" r="8.4" stroke="currentColor" strokeWidth="0.5" />
        </g>
      </g>
      <g className="home-chapter-label__node home-chapter-label__node--b">
        <g className="home-chapter-label__breath home-chapter-label__breath--b">
          <polygon points={hexPoints(108, 48, 5.8)} fill="currentColor" opacity="0.38" />
        </g>
      </g>
      <g className="home-chapter-label__node home-chapter-label__node--c">
        <g className="home-chapter-label__breath home-chapter-label__breath--c">
          <circle cx="156" cy="48" r="1.4" fill="currentColor" />
          <circle
            className="home-chapter-label__dash"
            cx="156"
            cy="48"
            r="8.4"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeDasharray="1.8 2.6"
          />
        </g>
      </g>
      <g className="home-chapter-label__node home-chapter-label__node--d">
        <g className="home-chapter-label__breath home-chapter-label__breath--d">
          <circle cx="96" cy="40" r="1.05" fill="currentColor" />
          <circle cx="124" cy="56" r="1.05" fill="currentColor" />
        </g>
      </g>
    </>
  );
}

function FieldAbout() {
  return (
    <>
      <g className="home-chapter-label__orbit">
        <circle className="home-chapter-label__arc" cx="52" cy="48" r="34" stroke="currentColor" strokeWidth="0.75" />
        <circle
          className="home-chapter-label__dash home-chapter-label__dash--slow"
          cx="52"
          cy="48"
          r="22"
          stroke="currentColor"
          strokeWidth="0.55"
          strokeDasharray="2.4 3.8"
        />
        <circle className="home-chapter-label__arc" cx="52" cy="48" r="7" stroke="currentColor" strokeWidth="0.5" />
      </g>
      <g className="home-chapter-label__paths">
        <path className="home-chapter-label__arc" d="M86 40 Q 148 18 232 34" stroke="currentColor" strokeWidth="0.45" />
        <path
          className="home-chapter-label__dash home-chapter-label__dash--drift"
          d="M86 56 L140 62 L198 44 L246 52"
          stroke="currentColor"
          strokeWidth="0.45"
          strokeDasharray="1.6 3.5"
        />
      </g>
      <g className="home-chapter-label__node home-chapter-label__node--a">
        <g className="home-chapter-label__breath home-chapter-label__breath--a">
          <circle cx="52" cy="48" r="1.5" fill="currentColor" />
        </g>
      </g>
      <g className="home-chapter-label__node home-chapter-label__node--b">
        <g className="home-chapter-label__breath home-chapter-label__breath--b">
          <polygon points={hexPoints(140, 62, 6)} fill="currentColor" opacity="0.36" />
          <circle
            className="home-chapter-label__dash"
            cx="140"
            cy="62"
            r="9"
            stroke="currentColor"
            strokeWidth="0.45"
            strokeDasharray="1.7 2.8"
          />
        </g>
      </g>
      <g className="home-chapter-label__node home-chapter-label__node--c">
        <g className="home-chapter-label__breath home-chapter-label__breath--c">
          <circle cx="198" cy="44" r="1.15" fill="currentColor" />
          <circle cx="198" cy="44" r="3.4" stroke="currentColor" strokeWidth="0.45" />
        </g>
      </g>
      <g className="home-chapter-label__node home-chapter-label__node--d">
        <g className="home-chapter-label__breath home-chapter-label__breath--d">
          <circle cx="246" cy="52" r="1.3" fill="currentColor" />
        </g>
      </g>
    </>
  );
}

const FIELD_DRAW = {
  studies: FieldStudies,
  team: FieldTeam,
  about: FieldAbout,
} as const;

/** Section index — crop-mark frame, quiet sky-banner constellation, body type. Not a control. */
export default function HomeChapterLabel({ id, field, children }: HomeChapterLabelProps) {
  const rootRef = useRef<HTMLParagraphElement>(null);
  const motion = useRef({ tx: 0, ty: 0, th: 0, cx: 0, cy: 0, ch: 0, raf: 0, run: false });
  const Draw = FIELD_DRAW[field];

  const stop = () => {
    const el = rootRef.current;
    const m = motion.current;
    if (m.raf) window.cancelAnimationFrame(m.raf);
    m.raf = 0;
    m.run = false;
    m.tx = 0;
    m.ty = 0;
    m.th = 0;
    m.cx = 0;
    m.cy = 0;
    m.ch = 0;
    if (!el) return;
    el.style.setProperty('--marker-mx', '0');
    el.style.setProperty('--marker-my', '0');
    el.style.setProperty('--marker-hot', '0');
  };

  const tick = () => {
    const el = rootRef.current;
    const m = motion.current;
    if (!el) {
      m.run = false;
      m.raf = 0;
      return;
    }
    m.cx += (m.tx - m.cx) * 0.14;
    m.cy += (m.ty - m.cy) * 0.14;
    m.ch += (m.th - m.ch) * 0.1;
    el.style.setProperty('--marker-mx', m.cx.toFixed(3));
    el.style.setProperty('--marker-my', m.cy.toFixed(3));
    el.style.setProperty('--marker-hot', m.ch.toFixed(3));
    const settling =
      Math.abs(m.tx - m.cx) < 0.004 && Math.abs(m.ty - m.cy) < 0.004 && Math.abs(m.th - m.ch) < 0.004;
    if (settling && m.th === 0) {
      m.run = false;
      m.raf = 0;
      return;
    }
    m.raf = window.requestAnimationFrame(tick);
  };

  const kick = () => {
    if (motion.current.run) return;
    motion.current.run = true;
    motion.current.raf = window.requestAnimationFrame(tick);
  };

  const onPointerMove = (event: PointerEvent<HTMLParagraphElement>) => {
    if (event.pointerType === 'touch') return;
    if (window.matchMedia(REDUCE_MOTION).matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width < 4 || rect.height < 4) return;
    motion.current.tx = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1));
    motion.current.ty = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1));
    motion.current.th = 1;
    kick();
  };

  const onPointerLeave = () => {
    motion.current.tx = 0;
    motion.current.ty = 0;
    motion.current.th = 0;
    kick();
  };

  useEffect(() => () => stop(), []);

  return (
    <p
      id={id}
      ref={rootRef}
      className={`home-chapter-label home-chapter-label--${field}`}
      onPointerMove={onPointerMove}
      onPointerEnter={onPointerMove}
      onPointerLeave={onPointerLeave}
      onPointerCancel={onPointerLeave}
    >
      <span className="home-chapter-label__sky" aria-hidden>
        <svg
          className="home-chapter-label__constellation"
          viewBox="0 0 280 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <Draw />
        </svg>
      </span>
      <span className="home-chapter-label__lockup">
        <span className="home-chapter-label__frame" aria-hidden>
          <span className="home-chapter-label__corner home-chapter-label__corner--tl" />
          <span className="home-chapter-label__corner home-chapter-label__corner--br" />
        </span>
        <span className="home-chapter-label__text">{children}</span>
      </span>
    </p>
  );
}
