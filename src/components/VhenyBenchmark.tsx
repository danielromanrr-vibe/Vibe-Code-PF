import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { ChevronRight } from 'lucide-react';

const FRAMES = [
  {
    src: '/vheny-diamonds/diamtrade/Vheny-diamonds-diamtrade.jpg',
    alt: 'Diamtrade stock list on a laptop, a dense color-banded trading table.',
    ratio: 1,
  },
  {
    src: '/vheny-diamonds/diamtrade/Vheny-diamonds-diamtrade2.jpg',
    alt: 'Diamtrade dashboard on a laptop, with colored totals above a stock summary.',
    ratio: 1,
  },
] as const;

type VhenyBenchmarkColumn = {
  h4: string;
  items: readonly string[];
};

type VhenyBenchmarkProps = {
  headingId: string;
  eyebrow: string;
  title: string;
  body: readonly string[];
  legacy: VhenyBenchmarkColumn;
  vision: VhenyBenchmarkColumn;
  reducedMotion: boolean;
};

function aside(title: string, items: readonly string[]) {
  if (items.length === 0) return '';
  const sentences = items.map((item) => (item.endsWith('.') ? item : `${item}.`));
  return `${title}. ${sentences.join(' ')}`;
}

export default function VhenyBenchmark({
  headingId,
  eyebrow,
  title,
  body,
  legacy,
  vision,
  reducedMotion,
}: VhenyBenchmarkProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [canAdvance, setCanAdvance] = useState(true);
  const paragraphs = [body[0] ?? '', aside(legacy.h4, legacy.items), aside(vision.h4, vision.items)].filter(Boolean);

  const sync = useCallback(() => {
    const rail = railRef.current;
    const slot = rail?.parentElement;
    if (!rail || !slot) return;
    const left = slot.getBoundingClientRect().left;
    slot.style.setProperty('--vheny-rail-left', `${Math.max(0, left)}px`);
    const remaining = rail.scrollWidth - rail.clientWidth - rail.scrollLeft;
    setCanAdvance(remaining > 8);
  }, []);

  useLayoutEffect(() => {
    const rail = railRef.current;
    const slot = rail?.parentElement;
    if (!rail || !slot) return;
    sync();
    const scrollParent = rail.closest('[id$="-scroll"]');
    const observer = new ResizeObserver(sync);
    observer.observe(slot);
    rail.addEventListener('scroll', sync, { passive: true });
    scrollParent?.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    return () => {
      observer.disconnect();
      rail.removeEventListener('scroll', sync);
      scrollParent?.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [sync]);

  const advance = () => {
    const rail = railRef.current;
    const card = rail?.querySelector<HTMLElement>('.vheny-starting-point__card');
    if (!rail || !card) return;
    const gap = parseFloat(getComputedStyle(rail).columnGap || '0') || 0;
    rail.scrollBy({ left: card.offsetWidth + gap, behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  return (
    <div className="vheny-benchmark">
      <div className="vheny-benchmark__copy">
        <p className="adopt-meta-label vheny-subsection__eyebrow">{eyebrow}</p>
        <h3 id={headingId} className="adopt-alt-h3 m-0 scroll-mt-6 text-balance">
          {title}
        </h3>
        {paragraphs.map((line) => (
          <p key={line} className="adopt-body mb-0 text-pretty text-ink/82">
            {line}
          </p>
        ))}
      </div>
      <div className="vheny-starting-point__rail-slot">
        <div ref={railRef} className="vheny-starting-point__rail" tabIndex={0} role="region" aria-label="Diamtrade benchmark">
          {FRAMES.map((frame) => (
            <figure key={frame.src} className="vheny-starting-point__card" style={{ ['--frame-ratio' as string]: frame.ratio }}>
              <img src={frame.src} alt={frame.alt} loading="lazy" decoding="async" draggable={false} />
            </figure>
          ))}
          <div className="vheny-starting-point__end" aria-hidden />
        </div>
        {canAdvance ? (
          <button type="button" className="home-featured-carousel-hint vheny-starting-point__hint" aria-label="See next benchmark" onClick={advance}>
            <ChevronRight className="h-5 w-5" strokeWidth={2.2} aria-hidden />
          </button>
        ) : null}
      </div>
    </div>
  );
}
