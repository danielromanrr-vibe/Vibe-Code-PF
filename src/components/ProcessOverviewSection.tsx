import { useReducedMotion } from 'motion/react';
import { useCallback, useId, useMemo, useState, type RefObject } from 'react';
import AdoptCaseStudyParallax from './AdoptCaseStudyParallax';
import type { ProcessOverviewStep } from './AdoptProcessOverview';
import { PROTOTYPING_CHAPTER_ID, type PrototypeTrack } from './AdoptProcessOverview';
import ProcessOverviewDeck from './ProcessOverviewDeck';
import ProcessStoryChapterNav from './ProcessStoryChapterNav';
import { ProcessSlideMediaFill } from './processOverviewMedia';
import {
  beatsForChapter,
  buildPresentationSlides,
  buildStoryBeats,
} from './processOverviewStory';

const PROTOTYPE_TRACK_OPTIONS = [
  { value: 'digital' as const, label: 'Digital prototype' },
  { value: 'physical' as const, label: 'Physical prototype' },
];

export type ProcessOverviewSectionProps = {
  sectionId?: string;
  sectionLede: string;
  steps: ProcessOverviewStep[];
  scrollContainerRef?: RefObject<HTMLElement | null>;
  reducedMotion?: boolean;
  /** Enable digital/physical toggle on the prototyping chapter (Adopt only). */
  enablePrototypeTrackToggle?: boolean;
};

export default function ProcessOverviewSection({
  sectionId = 'process-overview',
  sectionLede,
  steps,
  scrollContainerRef,
  reducedMotion: reducedMotionProp,
  enablePrototypeTrackToggle = false,
}: ProcessOverviewSectionProps) {
  const baseId = useId();
  const [prototypeTrack, setPrototypeTrack] = useState<PrototypeTrack>('digital');

  const resolvedSteps = steps;

  const prototypingChapterIndex = useMemo(
    () => resolvedSteps.findIndex((s) => s.id === PROTOTYPING_CHAPTER_ID),
    [resolvedSteps],
  );
  const storyBeats = useMemo(() => buildStoryBeats(resolvedSteps), [resolvedSteps]);
  const chapters = useMemo(
    () => resolvedSteps.map((s) => ({ id: s.id, label: s.label })),
    [resolvedSteps],
  );

  const chapterDecks = useMemo(
    () =>
      resolvedSteps.map((step) =>
        buildPresentationSlides(beatsForChapter(storyBeats, step.id)),
      ),
    [resolvedSteps, storyBeats],
  );

  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const systemReducedMotion = useReducedMotion();
  const reduceMotion = reducedMotionProp ?? systemReducedMotion ?? false;
  const headingId = `${baseId}-process-overview-heading`;

  const activeChapter = resolvedSteps[activeChapterIndex] ?? resolvedSteps[0];
  const deck = chapterDecks[activeChapterIndex] ?? [];
  const effectiveDeck = useMemo(() => {
    if (deck.length > 0) return deck;
    return [
      {
        id: `${activeChapter.id}-intro`,
        text: { heading: activeChapter.label, body: activeChapter.description },
        media: {
          media: activeChapter.primary,
          caption: activeChapter.primaryCaption,
          ariaLabel: activeChapter.primaryEyebrow
            ? `${activeChapter.primaryEyebrow}: ${activeChapter.primaryCaption}`
            : activeChapter.primaryCaption,
        },
        mediaFirst: false,
      },
    ];
  }, [activeChapter, deck]);

  const slideCount = effectiveDeck.length;
  const clampedSlideIndex = Math.min(activeSlideIndex, Math.max(0, slideCount - 1));

  const goToChapter = useCallback(
    (chapterIdx: number) => {
      const next = Math.max(0, Math.min(resolvedSteps.length - 1, chapterIdx));
      setActiveChapterIndex(next);
      setActiveSlideIndex(0);
    },
    [resolvedSteps.length],
  );

  const goNext = useCallback(() => {
    if (clampedSlideIndex < slideCount - 1) {
      setActiveSlideIndex(clampedSlideIndex + 1);
      return;
    }
    if (activeChapterIndex < resolvedSteps.length - 1) {
      setActiveChapterIndex(activeChapterIndex + 1);
      setActiveSlideIndex(0);
    }
  }, [activeChapterIndex, clampedSlideIndex, slideCount, resolvedSteps.length]);

  const goPrev = useCallback(() => {
    if (clampedSlideIndex > 0) {
      setActiveSlideIndex(clampedSlideIndex - 1);
      return;
    }
    if (activeChapterIndex > 0) {
      const prevChapter = activeChapterIndex - 1;
      const prevDeck = chapterDecks[prevChapter] ?? [];
      const prevCount = prevDeck.length > 0 ? prevDeck.length : 1;
      setActiveChapterIndex(prevChapter);
      setActiveSlideIndex(Math.max(0, prevCount - 1));
    }
  }, [activeChapterIndex, chapterDecks, clampedSlideIndex]);

  const setSlideIndex = useCallback((index: number) => {
    setActiveSlideIndex(index);
  }, []);

  const canGoPrev = clampedSlideIndex > 0 || activeChapterIndex > 0;
  const canGoNext =
    clampedSlideIndex < slideCount - 1 || activeChapterIndex < resolvedSteps.length - 1;

  const onPrototypeTrackChange = useCallback(
    (track: PrototypeTrack) => {
      setPrototypeTrack(track);
      setActiveSlideIndex(0);
      if (prototypingChapterIndex >= 0 && activeChapterIndex !== prototypingChapterIndex) {
        setActiveChapterIndex(prototypingChapterIndex);
      }
    },
    [activeChapterIndex, prototypingChapterIndex],
  );

  const deckChapterKey =
    enablePrototypeTrackToggle && activeChapter.id === PROTOTYPING_CHAPTER_ID
      ? `${activeChapter.id}-${prototypeTrack}`
      : activeChapter.id;

  const showPrototypeToggle =
    enablePrototypeTrackToggle && prototypingChapterIndex >= 0;

  const introBlock = (
    <>
      <h2
        id={headingId}
        className="adopt-context-heading mx-auto mb-2 max-w-[28ch] text-balance md:mb-2.5"
      >
        Process overview
      </h2>
      <p className="adopt-body mx-auto mb-0 max-w-[44ch] text-pretty text-ink/82">{sectionLede}</p>
    </>
  );

  return (
    <section
      id={sectionId}
      className="adopt-process-overview adopt-case-study-section min-w-0 scroll-mt-6 pb-0"
      aria-labelledby={headingId}
    >
      {scrollContainerRef ? (
        <AdoptCaseStudyParallax
          scrollContainerRef={scrollContainerRef}
          reducedMotion={reduceMotion}
          variant="body"
          className="process-overview-intro mx-auto mb-10 min-w-0 max-w-2xl text-center md:mb-12"
        >
          {introBlock}
        </AdoptCaseStudyParallax>
      ) : (
        <div className="process-overview-intro mx-auto mb-10 min-w-0 max-w-2xl text-center md:mb-12">
          {introBlock}
        </div>
      )}

      <div className="process-overview-sticky-boundary min-w-0">
        <div className="process-overview-nav-sticky sticky top-[var(--site-header-height,0px)] z-40 -mx-px bg-[#F8F9FA]/92 pb-3 backdrop-blur-md md:pb-4">
          <ProcessStoryChapterNav
            chapters={chapters}
            activeIndex={activeChapterIndex}
            onSelect={goToChapter}
            activeSlideIndex={clampedSlideIndex}
            slideCount={slideCount}
            prototypingChapterId={showPrototypeToggle ? PROTOTYPING_CHAPTER_ID : undefined}
            prototypeTrack={prototypeTrack}
            prototypeTrackOptions={showPrototypeToggle ? PROTOTYPE_TRACK_OPTIONS : []}
            onPrototypeTrackChange={showPrototypeToggle ? onPrototypeTrackChange : undefined}
          />
        </div>
      </div>

      {scrollContainerRef ? (
        <AdoptCaseStudyParallax
          scrollContainerRef={scrollContainerRef}
          reducedMotion={reduceMotion}
          variant="body"
          className="process-overview-deck-shell relative mt-6 w-full min-w-0 md:mt-8"
        >
          <ProcessOverviewDeck
            key={deckChapterKey}
            chapterKey={deckChapterKey}
            slides={effectiveDeck}
            activeIndex={clampedSlideIndex}
            onActiveIndexChange={setSlideIndex}
            ariaLabel={`${activeChapter.label} — process story slides`}
            reducedMotion={reduceMotion}
            onRequestNextChapter={goNext}
            onRequestPrevChapter={goPrev}
            canGoPrev={canGoPrev}
            canGoNext={canGoNext}
            renderMedia={(slide, index) =>
              slide.media ? (
                <ProcessSlideMediaFill
                  media={slide.media.media}
                  priority={activeChapterIndex === 0 && index === 0}
                />
              ) : null
            }
            className="w-full md:max-w-none"
          />
        </AdoptCaseStudyParallax>
      ) : (
        <div className="process-overview-deck-shell relative mt-6 w-full min-w-0 md:mt-8">
          <ProcessOverviewDeck
            key={deckChapterKey}
            chapterKey={deckChapterKey}
            slides={effectiveDeck}
            activeIndex={clampedSlideIndex}
            onActiveIndexChange={setSlideIndex}
            ariaLabel={`${activeChapter.label} — process story slides`}
            reducedMotion={reduceMotion}
            onRequestNextChapter={goNext}
            onRequestPrevChapter={goPrev}
            canGoPrev={canGoPrev}
            canGoNext={canGoNext}
            renderMedia={(slide, index) =>
              slide.media ? (
                <ProcessSlideMediaFill
                  media={slide.media.media}
                  priority={activeChapterIndex === 0 && index === 0}
                />
              ) : null
            }
            className="w-full md:max-w-none"
          />
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        Viewing chapter {activeChapterIndex + 1} of {resolvedSteps.length}: {activeChapter.label}. Slide{' '}
        {clampedSlideIndex + 1} of {slideCount}.
      </p>
    </section>
  );
}
