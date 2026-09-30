import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { ChevronRight } from 'lucide-react';

const FRAMES = [
  { src: '/vheny-diamonds/atlas-starting-point/00.png', alt: 'Past iteration: a jewel production list.', ratio: 2483 / 1600 },
  { src: '/vheny-diamonds/atlas-starting-point/01.png', alt: 'Past iteration: a dense singles spreadsheet.', ratio: 1427 / 1600 },
  { src: '/vheny-diamonds/atlas-starting-point/02.png', alt: 'Past iteration: a certificate profile for one stone.', ratio: 2351 / 1600 },
  { src: '/vheny-diamonds/atlas-starting-point/03.png', alt: 'Past iteration: a transaction and accounting record.', ratio: 2627 / 1400 },
  { src: '/vheny-diamonds/atlas-starting-point/04.png', alt: 'Past iteration: a running ledger.', ratio: 2641 / 1600 },
] as const;

type VhenyStartingPointProps = {
  headingId: string;
  eyebrow: string;
  title: string;
  body: readonly string[];
  reducedMotion: boolean;
};

export default function VhenyStartingPoint({ headingId, eyebrow, title, body, reducedMotion }: VhenyStartingPointProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [canAdvance, setCanAdvance] = useState(true);

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
    <div className="vheny-starting-point">
      <div className="vheny-starting-point__copy">
        <p className="adopt-meta-label vheny-subsection__eyebrow">{eyebrow}</p>
        <h3 id={headingId} className="adopt-alt-h3 m-0 scroll-mt-6 text-balance">
          {title}
        </h3>
        {body.map((line) => (
          <p key={line} className="adopt-body mb-0 text-pretty text-ink/82">
            {line}
          </p>
        ))}
      </div>
      <div className="vheny-starting-point__rail-slot">
        <div
          ref={railRef}
          className="vheny-starting-point__rail"
          tabIndex={0}
          role="region"
          aria-label="Past iterations"
        >
          {FRAMES.map((frame) => (
            <figure key={frame.src} className="vheny-starting-point__card" style={{ ['--frame-ratio' as string]: frame.ratio }}>
              <img src={frame.src} alt={frame.alt} loading="lazy" decoding="async" draggable={false} />
            </figure>
          ))}
          <div className="vheny-starting-point__end" aria-hidden />
        </div>
        {canAdvance ? (
          <button type="button" className="home-featured-carousel-hint vheny-starting-point__hint" aria-label="See next iteration" onClick={advance}>
            <ChevronRight className="h-5 w-5" strokeWidth={2.2} aria-hidden />
          </button>
        ) : null}
      </div>
    </div>
  );
}
