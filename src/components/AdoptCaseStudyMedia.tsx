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

/** Validation — physical group: exactly **3** images (post-it frames). */
export const ADOPT_VALIDATION_PHYSICAL_IMAGES: readonly string[] = POSTIT.slice(0, 3);
/** Validation — digital group: exactly **3** images (hero frames). */
export const ADOPT_VALIDATION_DIGITAL_IMAGES: readonly string[] = HERO.slice(0, 3);

const PARALLAX_MOUSE = 6;
const PARALLAX_SCROLL = 0.12;

const TILT_MAX = 6;
const PARALLAX_GRID = 8;

const triptychFrameBase =
  'group relative overflow-hidden rounded-2xl bg-ink/[0.02] shadow-[0_14px_44px_rgba(20,20,20,0.08)]';
const triptychFrame = `${triptychFrameBase} ring-1 ring-ink/[0.06]`;
/** Stacked molecule overlap: halo separates figures from page bg when tucked together. */
const triptychFrameMolecule = `${triptychFrameBase} ring-2 ring-bg`;
const triptychImg =
  'h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]';

/**
 * Validation images — `stack` = vertical editorial column (staggered, breathing room);
 * `row` = three-across (legacy / wide layouts).
 */
export function AdoptValidationTriptych({
  sources,
  layout = 'stack',
  moleculeOverlap = false,
  moleculeClusterAlign = 'end',
}: {
  sources: readonly string[];
  layout?: 'stack' | 'row';
  /** Stack images with stronger overlap + z-depth (validation molecule layout). */
  moleculeOverlap?: boolean;
  /** Single-column bundle: all figures hug one edge (no zigzag “two columns”). */
  moleculeClusterAlign?: 'end' | 'start';
}) {
  const items = sources.slice(0, 3);

  if (layout === 'row') {
    return (
      <div className="grid grid-cols-1 gap-12 sm:gap-14 md:grid-cols-3 md:gap-x-10 lg:gap-x-14 xl:gap-x-[4.5rem]">
        {items.map((src, i) => (
          <figure
            key={`${src}-${i}`}
            className={`${triptychFrame} aspect-[4/5] w-full max-w-lg justify-self-center md:max-w-none md:justify-self-stretch ${
              i === 1 ? 'md:translate-y-7 lg:translate-y-8' : i === 2 ? 'md:-translate-y-3 lg:-translate-y-4' : ''
            }`}
          >
            <img
              src={src}
              alt=""
              className={triptychImg}
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
          </figure>
        ))}
      </div>
    );
  }

  /* Stacked column — moleculeOverlap: images tuck under each other with z-depth */
  const figH = moleculeOverlap
    ? 'h-[min(22svh,168px)] sm:h-[min(23svh,176px)] md:h-[min(24svh,184px)] aspect-[4/5] w-auto shrink-0'
    : 'h-[min(19svh,148px)] sm:h-[min(20svh,156px)] md:h-[min(21svh,164px)] aspect-[4/5] w-auto shrink-0';

  const zFor = (i: number) => (i === 0 ? 'z-10' : i === 1 ? 'z-20' : 'z-30');

  const clusterItems =
    moleculeOverlap && moleculeClusterAlign === 'end'
      ? 'items-end'
      : moleculeOverlap && moleculeClusterAlign === 'start'
        ? 'items-start'
        : '';

  return (
    <div
      className={`flex w-full min-w-0 flex-col ${moleculeOverlap ? `gap-0 ${clusterItems}` : 'gap-2 md:gap-2.5'}`}
    >
      {items.map((src, i) => (
        <figure
          key={`${src}-${i}`}
          className={`${
            moleculeOverlap ? triptychFrameMolecule : triptychFrame
          } overflow-hidden ${figH} ${moleculeOverlap ? zFor(i) : ''} ${
            moleculeOverlap
              ? [
                  'relative',
                  i === 0
                    ? 'max-w-[11.5rem]'
                    : i === 1
                      ? 'max-w-[10.75rem] -mt-10 md:-mt-[3.25rem]'
                      : 'max-w-[11.25rem] -mt-10 md:-mt-[3.25rem]',
                  /* Subtle horizontal nudge—depth without a second vertical column. */
                  i === 1 ? (moleculeClusterAlign === 'end' ? 'md:-translate-x-1' : 'md:translate-x-1') : '',
                  i === 2 ? (moleculeClusterAlign === 'end' ? 'md:translate-x-0.5' : 'md:-translate-x-0.5') : '',
                ]
                  .filter(Boolean)
                  .join(' ')
              : i === 0
                ? 'max-w-[11.25rem]'
                : i === 1
                  ? 'max-w-[10rem] self-end md:-translate-y-px'
                  : 'max-w-[10.5rem] self-start -mt-1.5 md:-mt-2.5'
          }`}
        >
          <img
            src={src}
            alt=""
            className={triptychImg}
            loading={i === 0 ? 'eager' : 'lazy'}
            decoding="async"
          />
        </figure>
      ))}
    </div>
  );
}

/** Editorial validation — 6 images only; collage on md+ (layered bento reference), simple grid on small screens. */
function EditorialGridVariant({
  featuredCaption,
  supportingCaption,
}: {
  featuredCaption?: string;
  supportingCaption?: string;
}) {
  const shots = ALL.slice(0, 6);
  const [a, b, c, d, e, f] = shots;
  const img =
    'h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]';
  const pic =
    'group pointer-events-auto overflow-hidden bg-ink/[0.04] shadow-[0_10px_36px_rgba(20,20,20,0.14)] ring-1 ring-ink/[0.06]';

  return (
    <div className="w-full min-w-0">
      {/* Mobile / narrow: readable 2×3 grid */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:hidden">
        {[a, b, c, d, e, f].map((src, i) =>
          src ? (
            <figure key={src} className={`${pic} aspect-square rounded-xl`}>
              <img src={src} alt="" className={img} loading={i < 2 ? 'eager' : 'lazy'} decoding="async" />
            </figure>
          ) : null,
        )}
      </div>

      {/* Desktop: staggered collage — tall anchor right, cluster left + circular focal */}
      <div className="relative isolate hidden min-h-[min(52vw,420px)] w-full md:block md:min-h-[380px] lg:min-h-[440px]">
        {/* Back: dominant tall (right) */}
        {a ? (
          <figure
            className={`absolute inset-y-3 right-2 z-10 w-[min(44%,280px)] md:right-3 lg:inset-y-4 ${pic} rounded-2xl`}
          >
            <img src={a} alt="" className={`${img} object-[48%_42%]`} loading="eager" decoding="async" />
          </figure>
        ) : null}

        {/* Square top-left */}
        {b ? (
          <figure
            className={`absolute left-3 top-8 z-20 w-[min(34%,200px)] md:left-5 md:top-10 lg:left-6 aspect-square ${pic} rounded-2xl`}
          >
            <img src={b} alt="" className={img} loading="eager" decoding="async" />
          </figure>
        ) : null}

        {/* Landscape mid-left, overlaps tall */}
        {c ? (
          <figure
            className={`absolute left-[6%] top-[28%] z-30 w-[min(42%,240px)] md:left-[7%] aspect-[4/3] ${pic} rounded-xl`}
          >
            <img src={c} alt="" className={img} loading="lazy" decoding="async" />
          </figure>
        ) : null}

        {/* Portrait bottom-left */}
        {d ? (
          <figure
            className={`absolute bottom-12 left-4 z-40 w-[min(28%,160px)] md:bottom-14 md:left-6 aspect-[3/5] ${pic} rounded-xl`}
          >
            <img src={d} alt="" className={img} loading="lazy" decoding="async" />
          </figure>
        ) : null}

        {/* Small square */}
        {e ? (
          <figure
            className={`absolute bottom-[16%] left-[min(38%,220px)] z-50 aspect-square w-[min(22%,120px)] md:bottom-[18%] ${pic} rounded-xl`}
          >
            <img src={e} alt="" className={img} loading="lazy" decoding="async" />
          </figure>
        ) : null}

        {/* Front: circular crop */}
        {f ? (
          <figure
            className={`absolute bottom-4 left-[min(42%,240px)] z-[60] aspect-square w-[min(18%,104px)] md:bottom-5 ${pic} rounded-full ring-4 ring-bg`}
          >
            <img src={f} alt="" className={`${img} scale-[1.06]`} loading="lazy" decoding="async" />
          </figure>
        ) : null}
      </div>

      {(featuredCaption || supportingCaption) && (
        <div className="mt-4 space-y-2 md:mt-5">
          {featuredCaption ? (
            <p className="caption max-w-[48ch] border-t border-ink/10 pt-3 text-ink/55">{featuredCaption}</p>
          ) : null}
          {supportingCaption ? (
            <p className="caption max-w-[42ch] text-ink/50">{supportingCaption}</p>
          ) : null}
        </div>
      )}
    </div>
  );
}

function GridVariant({ compactNine = false }: { compactNine?: boolean }) {
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

  const gridImages = compactNine ? ALL.slice(0, 9) : ALL.slice(0, -3);
  const rx = reduceMotion ? 0 : mouse.y * TILT_MAX;
  const ry = reduceMotion ? 0 : -mouse.x * TILT_MAX;
  const tx = reduceMotion ? 0 : mouse.x * PARALLAX_GRID;
  const ty = reduceMotion ? 0 : mouse.y * PARALLAX_GRID;

  const gridClass = compactNine
    ? 'grid w-full min-w-0 grid-cols-3 gap-3 sm:gap-4'
    : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4';

  const cellClass = compactNine
    ? 'relative aspect-square overflow-hidden rounded-md border border-ink/10 bg-ink/[0.04]'
    : 'relative aspect-[4/3] overflow-hidden rounded-lg border border-ink/15 bg-ink/5';

  return (
    <div
      ref={containerRef}
      className="w-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`${gridClass} transition-transform duration-150 ease-out`}
        style={{
          transform: `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translate(${tx}px, ${ty}px)`,
        }}
      >
        {gridImages.map((src, i) => (
          <div key={src} className={cellClass}>
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
  gridCompactNine = false,
  featuredCaption,
  supportingCaption,
}: {
  tall?: boolean;
  variant?: 'carousel' | 'grid' | 'editorial';
  /** When `variant` is `grid`, use a smaller 3×3 layout (nine images). */
  gridCompactNine?: boolean;
  /** Shown under the lead validation image when `variant` is `editorial`. */
  featuredCaption?: string;
  /** Shown under the secondary featured (landscape) image when `variant` is `editorial`. */
  supportingCaption?: string;
}) {
  if (variant === 'grid') {
    return <GridVariant compactNine={gridCompactNine} />;
  }
  if (variant === 'editorial') {
    return (
      <EditorialGridVariant featuredCaption={featuredCaption} supportingCaption={supportingCaption} />
    );
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
