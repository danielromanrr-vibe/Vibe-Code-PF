import { AnimatePresence, motion } from 'motion/react';
import type { ProcessTurningPoint } from '../content/adoptProcessTurningPoints';
import { ProcessSlideMediaFill } from './processOverviewMedia';

type TurningPointCaptionProps = {
  moment: ProcessTurningPoint;
  chapterLabel: string;
  reducedMotion?: boolean;
};

function formatIndex(n: number): string {
  return String(n).padStart(2, '0');
}

/** Minimal editorial overlay — canvas carries the systemic story. */
export default function TurningPointCaption({
  moment,
  chapterLabel,
  reducedMotion = false,
}: TurningPointCaptionProps) {
  return (
    <div className="turning-point-caption pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col justify-end">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={moment.id}
          className="turning-point-caption__inner mx-3 mb-3 sm:mx-4 sm:mb-4 md:mx-5 md:mb-5"
          initial={reducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? undefined : { opacity: 0, y: 6 }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.42, ease: [0.22, 0.82, 0.24, 1] }}
        >
          <div className="turning-point-caption__glass rounded-xl border border-ink/[0.07] bg-[#FAF8F4]/88 px-4 py-3.5 shadow-[0_8px_32px_-12px_rgba(12,21,40,0.18)] backdrop-blur-md sm:px-5 sm:py-4 md:max-w-[min(100%,36rem)]">
            <div className="mb-2 flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
              <span className="turning-point-panel__index adopt-meta-label">{formatIndex(moment.index)}</span>
              <span className="adopt-meta-label text-ink/36">{chapterLabel}</span>
            </div>
            <h3 className="turning-point-caption__title mb-1.5 text-pretty font-heading text-[length:var(--text-body)] font-semibold leading-[1.28] tracking-[-0.02em] text-ink md:text-[1.0625rem]">
              {moment.title}
            </h3>
            <p className="turning-point-caption__shift m-0 text-pretty font-body text-[length:var(--text-body)] font-medium leading-[1.42] text-ink/76">
              {moment.shift}
            </p>
            <p className="turning-point-caption__body sr-only">{moment.body}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      {moment.evidence ? (
        <motion.aside
          key={`evidence-${moment.id}`}
          className="turning-point-caption__evidence pointer-events-none absolute right-3 top-3 z-10 hidden overflow-hidden rounded-lg border border-ink/[0.08] bg-white/80 shadow-[0_4px_20px_-8px_rgba(12,21,40,0.2)] sm:block md:right-5 md:top-4"
          initial={reducedMotion ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.5, delay: 0.12 }}
          aria-label={moment.evidenceCaption ?? 'Supporting evidence'}
        >
          <div className="relative h-16 w-[4.5rem] md:h-[4.5rem] md:w-20">
            <ProcessSlideMediaFill media={moment.evidence} />
          </div>
        </motion.aside>
      ) : null}
    </div>
  );
}
