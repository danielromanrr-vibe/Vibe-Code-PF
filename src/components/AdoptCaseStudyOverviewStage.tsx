import { type ReactNode, type RefObject } from 'react';
import AdoptContextMetricsStrip from './AdoptContextMetricsStrip';
import AdoptFloatingIntroCard from './AdoptFloatingIntroCard';
import AdoptQuickScan from './AdoptQuickScan';

export default function AdoptCaseStudyOverviewStage({
  contextColumn,
  scrollContainerRef,
  reducedMotion,
}: {
  contextColumn: ReactNode;
  scrollContainerRef?: RefObject<HTMLElement | null>;
  reducedMotion?: boolean;
}) {
  const stageShell = (
    <div className="adopt-case-study-stage-shell flex min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-2xl">
      <div className="flex min-h-0 w-full min-w-0 flex-col md:min-h-0 md:flex-row md:items-stretch">
        <div className="adopt-intro-col-left min-h-0 min-w-0 overflow-hidden border-ink/[0.07] md:flex-[0_0_50%] md:border-r md:border-r-ink/[0.07]">
          <div className="adopt-intro-col-pad h-full min-h-0 overflow-y-auto overflow-x-hidden px-4 text-left sm:px-5 md:px-5 lg:px-6">
            {contextColumn}
          </div>
        </div>

        <div className="adopt-intro-col-right flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden border-t border-ink/[0.08] md:border-l-0 md:border-t-0">
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            <div className="flex h-full min-h-0 flex-col overflow-hidden pt-0 text-left">
              <div className="adopt-intro-col-pad h-full min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 text-left sm:px-5 md:px-5 lg:px-6">
                <AdoptQuickScan thumbnailStrip thumbnailStripDecorative />
              </div>
            </div>
          </div>
        </div>
      </div>

      <AdoptContextMetricsStrip className="adopt-context-metrics--full-bleed shrink-0 border-t border-ink/[0.1] px-4 sm:px-5 md:px-5 lg:px-6" />
    </div>
  );

  return (
    <div className="adopt-intro-grid adopt-intro-stage relative mb-0 mt-0 min-w-0 md:mt-1">
      {scrollContainerRef ? (
        <AdoptFloatingIntroCard scrollContainerRef={scrollContainerRef} reducedMotion={reducedMotion}>
          {stageShell}
        </AdoptFloatingIntroCard>
      ) : (
        stageShell
      )}
    </div>
  );
}
