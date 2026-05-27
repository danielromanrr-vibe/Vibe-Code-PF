import { type ReactNode } from 'react';
import AdoptContextMetricsStrip from './AdoptContextMetricsStrip';
import AdoptQuickScan from './AdoptQuickScan';

export default function AdoptCaseStudyOverviewStage({ contextColumn }: { contextColumn: ReactNode }) {
  return (
    <div className="adopt-intro-grid adopt-intro-stage relative mb-0 mt-0 min-w-0 md:mt-1">
      <div className="adopt-case-study-stage-shell flex min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-ink/[0.07] bg-ink/[0.02] shadow-[0_1px_0_rgba(20,20,20,0.04)]">
        <div className="flex min-h-0 w-full min-w-0 flex-col md:min-h-0 md:flex-row md:items-stretch">
          <div className="adopt-intro-col-left min-h-0 min-w-0 overflow-hidden border-ink/[0.07] md:flex-[0_0_50%] md:border-r md:border-r-ink/[0.07]">
            <div className="h-full min-h-0 overflow-y-auto overflow-x-hidden py-5 pl-0 pr-3 text-left sm:pr-4 md:py-6 md:pl-5 md:pr-5 lg:pl-6 lg:pr-6">
              {contextColumn}
            </div>
          </div>

          <div className="adopt-intro-col-right flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden border-t border-ink/[0.08] md:border-l-0 md:border-t-0">
            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
              <div className="flex h-full min-h-0 flex-col overflow-hidden pt-5 text-left md:pt-6">
                <div className="adopt-prototype-rail-head shrink-0 px-4 pb-5 text-left sm:px-5 md:px-5 md:pb-6 lg:px-6">
                  <h3
                    id="adopt-section-scope"
                    className="adopt-context-heading mb-0 scroll-mt-6 text-pretty text-left font-heading text-[clamp(1.15rem,2.2vw,1.35rem)] font-semibold leading-snug tracking-[-0.02em] text-ink"
                  >
                    Scope
                  </h3>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 pb-5 pt-0 text-left sm:px-5 md:px-5 md:pb-6 lg:px-6">
                  <AdoptQuickScan thumbnailStrip thumbnailStripDecorative />
                </div>
              </div>
            </div>
          </div>
        </div>

        <AdoptContextMetricsStrip className="adopt-context-metrics--full-bleed shrink-0 border-t border-ink/[0.1] px-4 py-5 sm:px-5 md:px-5 md:py-6 lg:px-6" />
      </div>
    </div>
  );
}
