import { ADOPT_CONTEXT_METRICS } from '../content/adoptCaseStudy';
import CaseStudyMetricsStrip from './CaseStudyMetricsStrip';

export type AdoptContextMetricsStripProps = {
  className?: string;
};

export default function AdoptContextMetricsStrip({ className = '' }: AdoptContextMetricsStripProps) {
  return (
    <CaseStudyMetricsStrip
      metrics={ADOPT_CONTEXT_METRICS}
      ariaLabel="Evidence from field research, synthesis, and validation at a glance"
      className={className}
    />
  );
}
