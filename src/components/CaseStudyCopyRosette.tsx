import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import {
  CELEBRATION_INK_PALETTES,
  inkWithPresence,
  paintCelebrationMark,
  type ScrollTrailKind,
} from '../lib/celebrationInk';

type Mark = {
  kind: ScrollTrailKind;
  x: number;
  y: number;
  rot: number;
  seed: number;
  glyph: number;
};

const PETALS = 6;

function rosetteMarks(): Mark[] {
  const marks: Mark[] = [
    { kind: 'orb', x: 0, y: 0, rot: 0, seed: 2, glyph: 0.48 },
    { kind: 'mandala', x: 0, y: 0, rot: 12, seed: 5, glyph: 0.82 },
  ];
  for (let i = 0; i < PETALS; i += 1) {
    const angle = (i / PETALS) * Math.PI * 2 - Math.PI / 2;
    marks.push({
      kind: i % 2 === 0 ? 'arc' : 'dash',
      x: Math.cos(angle) * 13,
      y: Math.sin(angle) * 13,
      rot: (angle * 180) / Math.PI + 90,
      seed: i + 4,
      glyph: 0.46,
    });
  }
  return marks;
}

const MARKS = rosetteMarks();

function paletteFor(act: string) {
  let n = 0;
  for (let i = 0; i < act.length; i += 1) n += act.charCodeAt(i);
  return inkWithPresence(CELEBRATION_INK_PALETTES[n % CELEBRATION_INK_PALETTES.length]!, 1.05);
}

type CaseStudyCopyRosetteProps = {
  sectionRef: RefObject<HTMLElement | null>;
  scrollRootRef: RefObject<HTMLElement | null>;
  act: string;
  reducedMotion: boolean;
};

/**
 * One quiet Kandinsky rosette when a case-study copy block enters the reading zone.
 * Plays once, in the gutter beside the heading, then leaves.
 */
export default function CaseStudyCopyRosette({
  sectionRef,
  scrollRootRef,
  act,
  reducedMotion,
}: CaseStudyCopyRosetteProps) {
  const [played, setPlayed] = useState(false);
  const [place, setPlace] = useState<{ top: number; left: number } | null>(null);
  const markRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const palette = paletteFor(act);

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;
    const target = section.querySelector('h2, h3') ?? section;
    const root = scrollRootRef.current;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setPlayed(true);
        io.disconnect();
      },
      { root, threshold: 0.55 },
    );
    io.observe(target);
    return () => io.disconnect();
  }, [reducedMotion, scrollRootRef, sectionRef]);

  useLayoutEffect(() => {
    if (!played) return;
    const section = sectionRef.current;
    const heading = section?.querySelector('h2, h3');
    if (!section || !heading) {
      setPlayed(false);
      return;
    }
    const sectionBox = section.getBoundingClientRect();
    const headingBox = heading.getBoundingClientRect();
    setPlace({
      top: headingBox.top - sectionBox.top + headingBox.height * 0.42,
      left: headingBox.left - sectionBox.left - 16,
    });
  }, [played, sectionRef]);

  useLayoutEffect(() => {
    if (!place) return;
    MARKS.forEach((mark, index) => {
      const el = markRefs.current[index];
      if (!el) return;
      paintCelebrationMark(el, mark.kind, palette, 1, mark.rot, mark.seed, mark.glyph);
    });
  }, [place, palette]);

  if (!played || !place) return null;

  return (
    <span
      className="case-study-copy-rosette"
      style={{ top: place.top, left: place.left }}
      aria-hidden
      onAnimationEnd={() => setPlayed(false)}
    >
      {MARKS.map((mark, index) => (
        <span
          key={`${mark.kind}-${index}`}
          ref={(node) => {
            markRefs.current[index] = node;
          }}
          className="case-study-copy-rosette__mark"
          style={{ left: mark.x, top: mark.y }}
        />
      ))}
    </span>
  );
}
