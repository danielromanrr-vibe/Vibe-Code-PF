import { useRef, useState, useCallback } from 'react';

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
const DOT_COUNT = 4;

export default function AdoptCaseStudyMedia({ tall = false }: { tall?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [scrollOffset, setScrollOffset] = useState(0);
  const [activeDot, setActiveDot] = useState(0);
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
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
      setActiveDot(0);
      return;
    }
    const t = el.scrollLeft / maxScroll;
    const index = Math.round(t * (DOT_COUNT - 1));
    setActiveDot(Math.max(0, Math.min(DOT_COUNT - 1, index)));
  }, []);

  const scrollToDot = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) return;
    const target = (index / (DOT_COUNT - 1)) * maxScroll;
    el.scrollTo({ left: target, behavior: 'smooth' });
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
      <div className="flex justify-center gap-1.5 py-2 px-2 border-t border-ink/10">
        {Array.from({ length: DOT_COUNT }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => scrollToDot(i)}
            aria-label={`Go to section ${i + 1}`}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${activeDot === i ? 'bg-ink' : 'bg-ink/30 hover:bg-ink/50'}`}
            data-cursor="hand"
          />
        ))}
      </div>
    </div>
  );
}
