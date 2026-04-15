import { useRef, useState, useCallback, useEffect, type ReactNode } from 'react';

const BASE = '/adopt-a-school';

const HERO = [
  `${BASE}/Hero1_Humanize-shot_IMG_9441.jpg`,
  `${BASE}/Humanize-shot_IMG_9448.jpg`,
  `${BASE}/Humanize-shot_IMG_9409.jpg`,
];

const OTHERS = [
  'Humanize-shot_IMG_1060.jpg',
  'Humanize-shot_IMG_1064.jpg',
  'Humanize-shot_IMG_1324.jpg',
  'Humanize-shot_IMG_7506.jpg',
  'Humanize-shot_IMG_8564.jpg',
  'Humanize-shot_IMG_9398.jpg',
  'Humanize-shot_IMG_9406.jpg',
  'Humanize-shot_IMG_9413.jpg',
  'Humanize-shot_IMG_9414.jpg',
  'Humanize-shot_IMG_9433.jpg',
  'Humanize-shot_IMG_9434.jpg',
  'Humanize-shot_IMG_9437.jpg',
  'Humanize-shot_IMG_9438.jpg',
  'Humanize-shot_IMG_9444.jpg',
  'Humanize-shot_IMG_9446.jpg',
  'Humanize-shot_IMG_9454.jpg',
  'Humanize-shot_IMG_9459.jpg',
].map((f) => `${BASE}/${f}`);

const POSTIT = [
  `${BASE}/Post-it1_Humanize-shot_IMG_45BA9A89-BCBD-4C66-9217-A16D52AB06F3.jpg`,
  `${BASE}/Post-it2_Humanize-shot_IMG_A3ED68D9-E6CD-458B-9491-802831EF13FB.jpg`,
  `${BASE}/Post-it3_Humanize-shot_IMG_8754.jpg`,
];

const ALL = [...HERO, ...OTHERS, ...POSTIT];

const PARALLAX_MOUSE = 6;
const PARALLAX_SCROLL = 0.12;

const TILT_MAX = 6;
const PARALLAX_GRID = 8;

function GridVariant() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(m.matches);
    const fn = () => setReduceMotion(m.matches);
    m.addEventListener('change', fn);
    return () => m.removeEventListener('change', fn);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const x = (e.clientX - cx) / rect.width;
    const y = (e.clientY - cy) / rect.height;
    setMouse({ x, y });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMouse({ x: 0, y: 0 });
  }, []);

  const gridImages = ALL.slice(0, -3);
  const rx = reduceMotion ? 0 : mouse.y * TILT_MAX;
  const ry = reduceMotion ? 0 : -mouse.x * TILT_MAX;
  const tx = reduceMotion ? 0 : mouse.x * PARALLAX_GRID;
  const ty = reduceMotion ? 0 : mouse.y * PARALLAX_GRID;

  return (
    <div
      ref={containerRef}
      className="w-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 transition-transform duration-150 ease-out"
        style={{
          transform: `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translate(${tx}px, ${ty}px)`,
        }}
      >
        {gridImages.map((src, i) => (
          <div
            key={src}
            className="relative aspect-[4/3] overflow-hidden rounded-lg border border-ink/15 bg-ink/5"
          >
            <img
              src={src}
              alt=""
              className="h-full w-full object-cover"
              loading={i < 6 ? 'eager' : 'lazy'}
              decoding="async"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Tilt + parallax (same constants as grid) for Key interactions media blocks. */
export function KeyInteractionParallaxMedia({
  children,
  className = '',
  innerClassName = '',
  hugContent = false,
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  /** When true, height follows children (e.g. intrinsic video) instead of filling a fixed aspect box. */
  hugContent?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(m.matches);
    const fn = () => setReduceMotion(m.matches);
    m.addEventListener('change', fn);
    return () => m.removeEventListener('change', fn);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const x = (e.clientX - cx) / rect.width;
    const y = (e.clientY - cy) / rect.height;
    setMouse({ x, y });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMouse({ x: 0, y: 0 });
  }, []);

  const rx = reduceMotion ? 0 : mouse.y * TILT_MAX;
  const ry = reduceMotion ? 0 : -mouse.x * TILT_MAX;
  const tx = reduceMotion ? 0 : mouse.x * PARALLAX_GRID;
  const ty = reduceMotion ? 0 : mouse.y * PARALLAX_GRID;

  return (
    <div
      ref={containerRef}
      className={`w-full min-h-0 ${className}`.trim()}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`${hugContent ? 'w-full' : 'h-full w-full min-h-0'} transition-transform duration-150 ease-out ${innerClassName}`.trim()}
        style={{
          transform: `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translate(${tx}px, ${ty}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default function AdoptCaseStudyMedia({
  tall = false,
  variant = 'carousel',
}: {
  tall?: boolean;
  variant?: 'carousel' | 'grid';
}) {
  if (variant === 'grid') {
    return <GridVariant />;
  }

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [scrollOffset, setScrollOffset] = useState(0);
  const [hover, setHover] = useState(false);
  const heightDefault = '10rem'; // 160px base
  const heightHover = tall ? '12rem' : '11rem';

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const x = (e.clientX - cx) / rect.width;
      const y = (e.clientY - cy) / rect.height;
      setParallax({ x: x * PARALLAX_MOUSE, y: y * PARALLAX_MOUSE });
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setParallax({ x: 0, y: 0 });
    setHover(false);
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setScrollOffset(el.scrollLeft * PARALLAX_SCROLL);
  }, []);

  const tx = parallax.x - scrollOffset;
  const ty = parallax.y;
  const nudgeLeft = hover ? -2 : 0;

  return (
    <div
      ref={containerRef}
      className="w-full shrink-0 overflow-hidden rounded-t-xl border-b border-ink/10 transition-[height] duration-300 ease-out"
      style={{ height: hover ? heightHover : heightDefault }}
      onMouseEnter={() => setHover(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={scrollRef}
        className="h-full overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth scrollbar-hide"
        onScroll={handleScroll}
      >
        <div
          className="flex h-full gap-2 py-2 px-2"
          style={{
            transform: `translate(${tx + nudgeLeft}px, ${ty}px)`,
            transition: parallax.x === 0 && parallax.y === 0 ? 'transform 0.2s ease-out' : 'none',
          }}
        >
          {ALL.map((src, i) => (
            <div
              key={src}
              className={`relative h-full flex-shrink-0 snap-center overflow-hidden rounded-lg border border-ink/15 bg-ink/5 ${i < 3 ? 'w-56' : 'w-44'}`}
            >
              <img
                src={src}
                alt=""
                className="h-full w-full object-cover"
                loading={i < 4 ? 'eager' : 'lazy'}
                decoding="async"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
