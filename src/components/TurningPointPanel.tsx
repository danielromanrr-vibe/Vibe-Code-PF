import type { ProcessTurningPoint } from '../content/adoptProcessTurningPoints';
import { ProcessSlideMediaFill } from './processOverviewMedia';

type TurningPointPanelProps = {
  moment: ProcessTurningPoint;
  chapterLabel: string;
  momentIndexInChapter: number;
  momentCountInChapter: number;
  priorityMedia?: boolean;
};

function formatIndex(n: number): string {
  return String(n).padStart(2, '0');
}

export default function TurningPointPanel({
  moment,
  chapterLabel,
  momentIndexInChapter,
  momentCountInChapter,
  priorityMedia = false,
}: TurningPointPanelProps) {
  return (
    <article
      className="turning-point-panel flex h-full min-h-0 w-full flex-col md:flex-row md:items-stretch md:gap-8 lg:gap-10"
      aria-label={`Turning point ${momentIndexInChapter + 1} of ${momentCountInChapter} in ${chapterLabel}`}
    >
      <div className="turning-point-panel__narrative flex min-h-0 min-w-0 flex-1 flex-col justify-center px-6 py-7 sm:px-8 sm:py-8 md:px-9 md:py-9 lg:px-10">
        <header className="mb-5 md:mb-6">
          <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="turning-point-panel__index adopt-meta-label">{formatIndex(moment.index)}</span>
            <span className="turning-point-panel__chapter adopt-meta-label text-ink/38">{chapterLabel}</span>
          </div>
          <h3 className="turning-point-panel__title mb-3 text-pretty font-heading text-[length:var(--text-h3)] font-semibold leading-[1.12] tracking-[-0.03em] text-ink">
            {moment.title}
          </h3>
          <p className="turning-point-panel__shift m-0 text-pretty font-body text-[length:var(--text-body)] font-medium leading-[1.45] text-ink/78">
            {moment.shift}
          </p>
        </header>
        <p className="turning-point-panel__body adopt-body adopt-prototype-strip-copy m-0 max-w-[48ch] text-pretty leading-[1.52]">
          {moment.body}
        </p>
      </div>

      {moment.evidence ? (
        <aside
          className="turning-point-panel__evidence shrink-0 border-t border-ink/[0.08] md:w-[min(100%,17.5rem)] md:border-l md:border-t-0 lg:w-[min(100%,19rem)]"
          aria-label="Supporting evidence"
        >
          <div className="relative mx-auto aspect-[4/3] w-full max-w-[280px] overflow-hidden md:mx-0 md:mt-0 md:h-full md:max-w-none md:min-h-[220px] md:flex-1 md:aspect-auto">
            <div className="absolute inset-0 bg-ink/[0.03]">
              <ProcessSlideMediaFill media={moment.evidence} priority={priorityMedia} />
            </div>
          </div>
          {moment.evidenceCaption ? (
            <p className="turning-point-panel__evidence-caption adopt-meta-label m-0 px-5 py-3 text-center text-ink/42 md:px-4 md:text-left">
              {moment.evidenceCaption}
            </p>
          ) : null}
        </aside>
      ) : null}
    </article>
  );
}
