import { useEffect, useRef, useState, type CSSProperties } from 'react';
import ProjectCarousel, { type ProjectCarouselSlide } from './ProjectCarousel';

export type FeaturedWorkSubsectionProps = {
  projectId: string;
  title: string;
  scopeLines: readonly string[];
  impactLines: readonly string[];
  slides: ProjectCarouselSlide[];
  reducedMotion?: boolean;
};

/**
 * One unpacked cross-functional row: left-aligned title, Scope / Impact slabs,
 * and a trailing image viewer aligned to those slabs.
 */
export default function FeaturedWorkSubsection({
  projectId,
  title,
  scopeLines,
  impactLines,
  slides,
  reducedMotion = false,
}: FeaturedWorkSubsectionProps) {
  const headingId = `featured-work-${projectId}`;
  const panelId = `${headingId}-panel`;
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const scopeSlabRef = useRef<HTMLDivElement>(null);
  const impactSlabRef = useRef<HTMLDivElement>(null);
  const [mediaFrameHeight, setMediaFrameHeight] = useState<number | undefined>(undefined);
  const [mediaTopOffset, setMediaTopOffset] = useState(0);

  useEffect(() => {
    const node = leftColumnRef.current;
    if (!node) return;

    const grid = node.closest('.home-featured-work-grid');

    const syncHeight = () => {
      const leftRect = node.getBoundingClientRect();
      const leftHeight = Math.round(leftRect.height);
      const scopeEl = scopeSlabRef.current;
      const impactEl = impactSlabRef.current;
      const topOffset = scopeEl
        ? Math.round(scopeEl.getBoundingClientRect().top - leftRect.top)
        : 0;
      const bottomOffset = impactEl
        ? Math.round(leftRect.bottom - impactEl.getBoundingClientRect().bottom)
        : 0;
      const viewportHeight = leftHeight - topOffset - bottomOffset;
      if (viewportHeight > 0) {
        setMediaFrameHeight((prev) => (prev === viewportHeight ? prev : viewportHeight));
        setMediaTopOffset((prev) => (prev === topOffset ? prev : topOffset));
      }
    };

    syncHeight();
    const raf = requestAnimationFrame(syncHeight);
    const observer = new ResizeObserver(() => syncHeight());
    observer.observe(node);
    if (grid) observer.observe(grid);
    const scopeNode = scopeSlabRef.current;
    const impactNode = impactSlabRef.current;
    if (scopeNode) observer.observe(scopeNode);
    if (impactNode) observer.observe(impactNode);
    window.addEventListener('resize', syncHeight);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('resize', syncHeight);
    };
  }, [projectId, scopeLines.length, impactLines.length]);

  return (
    <article
      className="home-featured-subsection"
      aria-labelledby={headingId}
    >
      <div className="home-featured-work-grid grid grid-cols-1 items-start gap-6 overflow-x-clip md:grid-cols-2 md:items-start md:gap-8">
        <div
          ref={leftColumnRef}
          className="home-featured-left-column order-1 flex min-h-0 min-w-0 flex-col gap-5 md:order-none"
        >
          <h3 id={headingId} className="home-featured-subsection-title mb-0 text-left">
            {title}
          </h3>

          <div id={panelId} className="home-featured-scope-impact-panel min-h-0 min-w-0 space-y-5">
            <section className="space-y-2">
              <p className="home-featured-scope-impact-eyebrow">Scope</p>
              <div ref={scopeSlabRef}>
                <div className="home-page-slab h-[10.05rem] overflow-y-auto border border-ink/10 bg-ink/[0.04] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] modal-scroll md:h-[10.75rem]">
                  <ul className="mb-0 list-none space-y-1.5 pl-0 pr-1">
                    {scopeLines.map((line) => (
                      <li
                        key={line}
                        className="flex gap-2 font-body text-[length:var(--text-body)] leading-[1.34] tracking-[var(--tracking-body)] text-ink/74"
                      >
                        <span className="mt-[0.48rem] h-1 w-1 shrink-0 rounded-full bg-ink/22" aria-hidden />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-2">
              <p className="home-featured-scope-impact-eyebrow">Impact</p>
              <div ref={impactSlabRef}>
                <div className="home-page-slab h-[10.05rem] overflow-y-auto border border-ink/10 bg-ink/[0.04] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] modal-scroll md:h-[10.75rem]">
                  <ul className="mb-0 list-none space-y-1.5 pl-0 pr-1">
                    {impactLines.map((line) => (
                      <li
                        key={line}
                        className="flex gap-2 font-body text-[length:var(--text-body)] leading-[1.34] tracking-[var(--tracking-body)] text-ink/74"
                      >
                        <span className="mt-[0.48rem] h-1 w-1 shrink-0 rounded-full bg-ink/22" aria-hidden />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div
          className="home-featured-media-column featured-work-carousel-bleed order-2 flex min-h-0 min-w-0 flex-col md:order-none"
          style={
            {
              ...(mediaFrameHeight != null
                ? { ['--featured-viewport-h' as string]: `${mediaFrameHeight}px` }
                : {}),
              ['--featured-media-top-offset' as string]:
                mediaTopOffset > 0 ? `${mediaTopOffset}px` : '0px',
            } as CSSProperties
          }
        >
          <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col md:max-w-none">
            <ProjectCarousel
              projectKey={projectId}
              slides={slides}
              ariaLabel={`${title} image gallery`}
              reducedMotion={reducedMotion}
              bleedEdge="trailing"
              layout="featuredFixed"
              className="min-h-0 min-w-0 w-full md:max-w-none"
            />
          </div>
        </div>
      </div>
    </article>
  );
}
