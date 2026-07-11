import { useCallback, useId, useMemo, useState, type RefObject } from 'react';
import { useReducedMotion } from 'motion/react';
import AdoptCaseStudyParallax from './AdoptCaseStudyParallax';
import {
  ADOPT_PROCESS_CHAPTERS,
  ADOPT_PROCESS_OVERVIEW_LEDE,
  ADOPT_PROCESS_OVERVIEW_SUBTITLE,
  ADOPT_PROCESS_OVERVIEW_TITLE,
  turningPointsForChapter,
} from '../content/adoptProcessTurningPoints';
import type { EditorialOverlapBundle } from './AdoptEditorialOverlapGrid';
import ProcessInvestigationViewport from './ProcessInvestigationViewport';
import ProcessStoryChapterNav from './ProcessStoryChapterNav';

export type ProcessOverviewChapterId =
  | 'research'
  | 'definition'
  | 'rapid-prototyping'
  | 'validation';

export const PROTOTYPING_CHAPTER_ID: ProcessOverviewChapterId = 'rapid-prototyping';

export type PrototypeTrack = 'digital' | 'physical';

const PROTOTYPE_TRACK_OPTIONS: { value: PrototypeTrack; label: string }[] = [
  { value: 'digital', label: 'Digital prototype' },
  { value: 'physical', label: 'Physical prototype' },
];

/** @deprecated Use ProcessOverviewChapterId */
export type ProcessOverviewTabId = ProcessOverviewChapterId;

export type ProcessOverviewMedia =
  | { type: 'img'; src: string; alt: string }
  | { type: 'video'; src: string; poster: string; alt: string }
  | { type: 'diagram' };

export type ProcessOverviewSupportingItem = {
  media: ProcessOverviewMedia;
  caption: string;
  eyebrow?: string;
};

export type ProcessOverviewStep = {
  id: ProcessOverviewChapterId;
  label: string;
  description: string;
  primaryEyebrow?: string;
  primaryCaption: string;
  primary: ProcessOverviewMedia;
  supporting: ProcessOverviewSupportingItem[];
};

type ProcessStoryTextBeat = {
  kind: 'text';
  chapterId: ProcessOverviewChapterId;
  heading: string;
  body: string;
};

type ProcessStoryMediaBeat = {
  kind: 'media';
  chapterId: ProcessOverviewChapterId;
  media: ProcessOverviewMedia;
  caption: string;
  ariaLabel: string;
};

export type ProcessStoryBeat = ProcessStoryTextBeat | ProcessStoryMediaBeat;

/** Shared validation thesis — Process Overview chapter + full-case-study spreads. */
export const ADOPT_PROCESS_VALIDATION_LEDE =
  'In-field validation surfaced bottlenecks tied to warehouse-centered coordination. System recommendations focused on improving repeatability across donor engagement, pledge intake, and fulfillment workflows.';

export type ProcessPresentationSlide = {
  id: string;
  text: { heading: string; body: string };
  media?: { media: ProcessOverviewMedia; ariaLabel: string; caption: string };
  mediaFirst: boolean;
};

type Props = {
  editorial: EditorialOverlapBundle;
  /** Case-study scroll root — parallax targets this container; omit on homepage previews. */
  scrollContainerRef?: RefObject<HTMLElement | null>;
  reducedMotion?: boolean;
  className?: string;
};

export default function AdoptProcessOverview({
  editorial: _editorial,
  scrollContainerRef,
  reducedMotion: reducedMotionProp,
  className = '',
}: Props) {
  const baseId = useId();
  const [prototypeTrack, setPrototypeTrack] = useState<PrototypeTrack>('digital');
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [activeMomentIndex, setActiveMomentIndex] = useState(0);

  const systemReducedMotion = useReducedMotion();
  const reduceMotion = reducedMotionProp ?? systemReducedMotion ?? false;
  const headingId = `${baseId}-process-overview-heading`;

  const chapters = ADOPT_PROCESS_CHAPTERS;
  const activeChapter = chapters[activeChapterIndex] ?? chapters[0];
  const moments = useMemo(
    () => turningPointsForChapter(activeChapter.id, prototypeTrack),
    [activeChapter.id, prototypeTrack],
  );
  const momentCount = moments.length;
  const clampedMomentIndex = Math.min(activeMomentIndex, Math.max(0, momentCount - 1));

  const prototypingChapterIndex = useMemo(
    () => chapters.findIndex((c) => c.id === PROTOTYPING_CHAPTER_ID),
    [chapters],
  );

  const goToChapter = useCallback((chapterIdx: number) => {
    const next = Math.max(0, Math.min(chapters.length - 1, chapterIdx));
    setActiveChapterIndex(next);
    setActiveMomentIndex(0);
  }, [chapters.length]);

  const goNext = useCallback(() => {
    if (clampedMomentIndex < momentCount - 1) {
      setActiveMomentIndex(clampedMomentIndex + 1);
      return;
    }
    if (activeChapterIndex < chapters.length - 1) {
      setActiveChapterIndex(activeChapterIndex + 1);
      setActiveMomentIndex(0);
    }
  }, [activeChapterIndex, clampedMomentIndex, momentCount, chapters.length]);

  const goPrev = useCallback(() => {
    if (clampedMomentIndex > 0) {
      setActiveMomentIndex(clampedMomentIndex - 1);
      return;
    }
    if (activeChapterIndex > 0) {
      const prevChapter = activeChapterIndex - 1;
      const prevMoments = turningPointsForChapter(chapters[prevChapter].id, prototypeTrack);
      setActiveChapterIndex(prevChapter);
      setActiveMomentIndex(Math.max(0, prevMoments.length - 1));
    }
  }, [activeChapterIndex, chapters, clampedMomentIndex, prototypeTrack]);

  const onPrototypeTrackChange = useCallback(
    (track: PrototypeTrack) => {
      setPrototypeTrack(track);
      setActiveMomentIndex(0);
      if (prototypingChapterIndex >= 0 && activeChapterIndex !== prototypingChapterIndex) {
        setActiveChapterIndex(prototypingChapterIndex);
      }
    },
    [activeChapterIndex, prototypingChapterIndex],
  );

  const deckChapterKey =
    activeChapter.id === PROTOTYPING_CHAPTER_ID
      ? `${activeChapter.id}-${prototypeTrack}`
      : activeChapter.id;

  const canGoPrev = clampedMomentIndex > 0 || activeChapterIndex > 0;
  const canGoNext = clampedMomentIndex < momentCount - 1 || activeChapterIndex < chapters.length - 1;

  const investigationViewport = (
    <ProcessInvestigationViewport
      chapterKey={deckChapterKey}
      chapterId={activeChapter.id}
      chapterLabel={activeChapter.label}
      moments={moments}
      activeIndex={clampedMomentIndex}
      prototypeTrack={prototypeTrack}
      onActiveIndexChange={setActiveMomentIndex}
      ariaLabel={`${activeChapter.label} chapter`}
      reducedMotion={reduceMotion}
      onRequestNextChapter={goNext}
      onRequestPrevChapter={goPrev}
      canGoPrev={canGoPrev}
      canGoNext={canGoNext}
      scrollContainerRef={scrollContainerRef}
      className="w-full md:max-w-none"
      pinnedHeader={
        <ProcessStoryChapterNav
          chapters={chapters}
          activeIndex={activeChapterIndex}
          onSelect={goToChapter}
          activeSlideIndex={clampedMomentIndex}
          slideCount={momentCount}
          momentFraming
          prototypingChapterId={PROTOTYPING_CHAPTER_ID}
          prototypeTrack={prototypeTrack}
          prototypeTrackOptions={PROTOTYPE_TRACK_OPTIONS}
          onPrototypeTrackChange={onPrototypeTrackChange}
        />
      }
    />
  );

  return (
    <div
      className={['adopt-process-overview min-w-0 pb-0', className].filter(Boolean).join(' ')}
      aria-labelledby={headingId}
    >
      {scrollContainerRef ? (
        <AdoptCaseStudyParallax
          scrollContainerRef={scrollContainerRef}
          reducedMotion={reduceMotion}
          variant="body"
          className="process-overview-intro mx-auto min-w-0 max-w-2xl text-center"
        >
          <h2
            id={headingId}
            className="adopt-context-heading mx-auto max-w-[28ch] text-balance"
          >
            {ADOPT_PROCESS_OVERVIEW_TITLE}
          </h2>
          <p className="process-overview-intro__subtitle mx-auto mb-0 max-w-[36ch] text-pretty">
            {ADOPT_PROCESS_OVERVIEW_SUBTITLE}
          </p>
          <p className="adopt-body process-overview-intro__lede mx-auto mb-0 max-w-[44ch] text-pretty text-ink/82">
            {ADOPT_PROCESS_OVERVIEW_LEDE}
          </p>
        </AdoptCaseStudyParallax>
      ) : (
        <div className="process-overview-intro mx-auto min-w-0 max-w-2xl text-center">
          <h2
            id={headingId}
            className="adopt-context-heading mx-auto max-w-[28ch] text-balance"
          >
            {ADOPT_PROCESS_OVERVIEW_TITLE}
          </h2>
          <p className="process-overview-intro__subtitle mx-auto mb-0 max-w-[36ch] text-pretty">
            {ADOPT_PROCESS_OVERVIEW_SUBTITLE}
          </p>
          <p className="adopt-body process-overview-intro__lede mx-auto mb-0 max-w-[44ch] text-pretty text-ink/82">
            {ADOPT_PROCESS_OVERVIEW_LEDE}
          </p>
        </div>
      )}

      <div className="process-overview-deck mx-auto w-full min-w-0 max-w-[min(100%,68rem)]">
        {investigationViewport}
      </div>

      <p className="sr-only" aria-live="polite">
        {activeChapter.label} chapter. Moment {clampedMomentIndex + 1} of {momentCount}:{' '}
        {moments[clampedMomentIndex]?.title ?? ''}.
      </p>
    </div>
  );
}

/** Re-export for CRAFT-style usage: `<ProcessOverview editorial={…} />`. */
export function ProcessOverview(props: Props) {
  return <AdoptProcessOverview {...props} />;
}
