import { type ReactNode, type RefObject } from 'react';
import AdoptFloatingIntroCard from './AdoptFloatingIntroCard';
import CaseStudyMetricsStrip, { type CaseStudyMetric } from './CaseStudyMetricsStrip';

export type CaseStudyOverviewStageProps = {
  contextColumn: ReactNode;
  scopeTitle?: string;
  scopeContent: ReactNode;
  metrics: readonly CaseStudyMetric[];
  metricsAriaLabel: string;
  /** When set, applies the same floating-card chrome + parallax as Adopt Context & Intro. */
  scrollContainerRef?: RefObject<HTMLElement | null>;
  reducedMotion?: boolean;
};

export default function CaseStudyOverviewStage({
  contextColumn,
  scopeTitle = 'Scope',
  scopeContent,
  metrics,
  metricsAriaLabel,
  scrollContainerRef,
  reducedMotion = false,
}: CaseStudyOverviewStageProps) {
  const stageShell = (
    <div className="adopt-case-study-stage-shell flex min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-2xl">
      <div className="flex min-h-0 w-full min-w-0 flex-col md:min-h-0 md:flex-row md:items-stretch">
        <div className="adopt-intro-col-left min-h-0 min-w-0 overflow-hidden border-ink/[0.07] md:flex-[0_0_50%] md:border-r md:border-r-ink/[0.07]">
          <div className="adopt-intro-col-pad h-full min-h-0 overflow-y-auto overflow-x-hidden px-4 text-left sm:px-5 md:px-5 lg:px-6">
            {contextColumn}
          </div>
        </div>

        <div className="adopt-intro-col-right flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden border-t border-ink/[0.08] md:border-l-0 md:border-t-0">
          <div className="adopt-intro-col-pad flex h-full min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden px-4 text-left sm:px-5 md:px-5 lg:px-6">
            <h3 className="adopt-context-heading mb-5 scroll-mt-6 text-pretty text-left font-heading text-[length:var(--text-h3)] font-semibold leading-[var(--leading-h3)] tracking-[-0.02em] text-ink md:mb-6">
              {scopeTitle}
            </h3>
            {scopeContent}
          </div>
        </div>
      </div>

      <CaseStudyMetricsStrip
        metrics={metrics}
        ariaLabel={metricsAriaLabel}
        className="adopt-context-metrics--full-bleed shrink-0 border-t border-ink/[0.1] px-4 sm:px-5 md:px-5 lg:px-6"
      />
    </div>
  );

  return (
    <div className="adopt-intro-grid adopt-intro-stage relative mb-0 mt-0 min-w-0 md:mt-1">
      {scrollContainerRef ? (
        <AdoptFloatingIntroCard scrollContainerRef={scrollContainerRef} reducedMotion={reducedMotion}>
          {stageShell}
        </AdoptFloatingIntroCard>
      ) : (
        <div className="adopt-intro-floating-card">{stageShell}</div>
      )}
    </div>
  );
}
