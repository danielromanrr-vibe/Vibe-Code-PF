export type CaseStudyMetric = {
  stat: string;
  label: string;
  /** Optional evidence-oriented descriptor (Zilla eyebrow above label). */
  context?: string;
};

export type CaseStudyMetricsStripProps = {
  metrics: readonly CaseStudyMetric[];
  ariaLabel: string;
  className?: string;
};

export default function CaseStudyMetricsStrip({
  metrics,
  ariaLabel,
  className = '',
}: CaseStudyMetricsStripProps) {
  return (
    <div
      className={`adopt-context-metrics min-w-0 ${className}`.trim()}
      role="group"
      aria-label={ariaLabel}
    >
      <div className="grid w-full grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4 sm:gap-x-6 sm:gap-y-0 md:gap-x-8">
        {metrics.map((m) => (
          <div
            key={`${m.stat}-${m.label}`}
            className="adopt-context-metric-cell flex min-w-0 flex-col items-center gap-1 text-center sm:gap-1.5"
          >
            {m.context ? (
              <span className="adopt-context-metric-context adopt-meta-label mb-0 block max-w-[14ch] text-pretty">
                {m.context}
              </span>
            ) : null}
            <span className="adopt-context-metric-stat font-heading text-[clamp(1.25rem,2.5vw,1.75rem)] font-semibold tabular-nums tracking-[-0.03em]">
              {m.stat}
            </span>
            <span className="adopt-context-metric-label adopt-body mx-auto mb-0 block max-w-[22ch] text-pretty text-ink/72">
              {m.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
