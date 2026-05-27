import { motion, useReducedMotion } from 'motion/react';
import { useCallback, useId, useMemo, useState, type RefObject } from 'react';
import AdoptCaseStudyParallax from './AdoptCaseStudyParallax';
import {
  ADOPT_VALIDATION_DIGITAL_IMAGES,
  ADOPT_VALIDATION_PHYSICAL_IMAGES,
} from './AdoptCaseStudyMedia';
import AdoptSystemDiagram from './AdoptSystemDiagram';
import { ADOPT_BEAT_PANELS, type AdoptBeatPanelDef } from './AdoptDetailHorizontalStory';
import type { EditorialOverlapBundle } from './AdoptEditorialOverlapGrid';
import ProcessOverviewDeck from './ProcessOverviewDeck';
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
  /** Floating caption on the image (homepage-style), without eyebrow prefix. */
  caption: string;
  ariaLabel: string;
};

export type ProcessStoryBeat = ProcessStoryTextBeat | ProcessStoryMediaBeat;

const IMG_ACTIVATION = '/adopt-a-school/Hero-44-case-study.png';
const IMG_PHYSICAL = '/adopt-a-school/Hero2_Humanize-shot_IMG_9442.jpg';
const IMG_MOBILE = '/adopt-a-school/Hero33-case-study.png';
const IMG_OPS = '/adopt-a-school/Hero3_.jpg';
const MAP_VIDEO = '/adopt-a-school/school-adoption-map.mp4';
const MAP_POSTER = '/adopt-a-school/Hero33-case-study.png';

const RESEARCH_LEDE =
  'Field-to-pledge constraints in one frame—where volunteers decide, how geography shapes intent, and what throughput forces into the system.';

const DEFINITION_LEDE =
  'Map-first enrollment and the system diagram kept discovery, conversion, and ops legible in one frame—the operational definition of what shipped.';

const RAPID_PROTO_DIGITAL_LEDE =
  'Digital activation and mobile handoff tested what reads before URLs—fidelity followed behavioral risk in device-native flows, not polish for its own sake.';

const RAPID_PROTO_PHYSICAL_LEDE =
  'Physical moments in the aisle tested what earns attention beside every other message—object legibility and handoff intent before any screen.';

/** Shared validation thesis — Process Overview chapter + full-case-study spreads. */
export const ADOPT_PROCESS_VALIDATION_LEDE =
  'In-field validation surfaced bottlenecks tied to warehouse-centered coordination. System recommendations focused on improving repeatability across donor engagement, pledge intake, and fulfillment workflows.';

const PROCESS_OVERVIEW_SECTION_LEDE =
  'Research, definition, prototyping, and validation—presented as a deck you can step through chapter by chapter.';


function mediaFromBeatVisual(panel: AdoptBeatPanelDef): ProcessOverviewMedia {
  const v = panel.visual;
  const alt = `${panel.eyebrow}: ${panel.caption}`;
  if (v === 'img-a') return { type: 'img', src: IMG_ACTIVATION, alt };
  if (v === 'img-p') return { type: 'img', src: IMG_PHYSICAL, alt };
  if (v === 'img-m') return { type: 'img', src: IMG_MOBILE, alt };
  if (v === 'img-o') return { type: 'img', src: IMG_OPS, alt };
  if (v === 'video')
    return {
      type: 'video',
      src: MAP_VIDEO,
      poster: MAP_POSTER,
      alt: `${panel.eyebrow}: ${panel.caption}`,
    };
  return { type: 'diagram' };
}

function buildPrototypingStep(
  track: PrototypeTrack,
  p: readonly AdoptBeatPanelDef[],
  physical: readonly string[],
): ProcessOverviewStep {
  if (track === 'physical') {
    return {
      id: PROTOTYPING_CHAPTER_ID,
      label: 'Prototyping',
      description: RAPID_PROTO_PHYSICAL_LEDE,
      primaryEyebrow: p[1].eyebrow,
      primaryCaption: p[1].caption,
      primary: mediaFromBeatVisual(p[1]),
      supporting: [
        {
          media: mediaFromBeatVisual(p[0]),
          eyebrow: p[0].eyebrow,
          caption: p[0].caption,
        },
        {
          media: {
            type: 'img',
            src: physical[1] ?? physical[0] ?? IMG_PHYSICAL,
            alt: 'Physical prototype validation in context.',
          },
          eyebrow: 'Physical prototype',
          caption: 'In-context observation with the activation object and program surfaces.',
        },
      ],
    };
  }

  return {
    id: PROTOTYPING_CHAPTER_ID,
    label: 'Prototyping',
    description: RAPID_PROTO_DIGITAL_LEDE,
    primaryEyebrow: p[0].eyebrow,
    primaryCaption: p[0].caption,
    primary: mediaFromBeatVisual(p[0]),
    supporting: [
      {
        media: mediaFromBeatVisual(p[2]),
        eyebrow: p[2].eyebrow,
        caption: p[2].caption,
      },
      {
        media: mediaFromBeatVisual(p[1]),
        eyebrow: 'Physical reference',
        caption: 'Shelf context informed digital handoff—same story, different surface.',
      },
    ],
  };
}

function buildProcessSteps(
  editorial: EditorialOverlapBundle,
  prototypeTrack: PrototypeTrack = 'digital',
): ProcessOverviewStep[] {
  const p = ADOPT_BEAT_PANELS;
  const primaryAlt = editorial.primary.alt;

  const stackTopMedia: ProcessOverviewMedia =
    editorial.stackTop.videoSrc != null
      ? {
          type: 'video',
          src: editorial.stackTop.videoSrc,
          poster: editorial.stackTop.src,
          alt: editorial.stackTop.alt,
        }
      : { type: 'img', src: editorial.stackTop.src, alt: editorial.stackTop.alt };

  const physical = ADOPT_VALIDATION_PHYSICAL_IMAGES;
  const digital = ADOPT_VALIDATION_DIGITAL_IMAGES;

  return [
    {
      id: 'research',
      label: 'Research',
      description: RESEARCH_LEDE,
      primaryEyebrow: 'Field validation',
      primaryCaption: primaryAlt,
      primary: { type: 'img', src: editorial.primary.src, alt: primaryAlt },
      supporting: [
        {
          media: stackTopMedia,
          caption: editorial.stackTop.alt,
          eyebrow: 'Enrollment',
        },
        {
          media: { type: 'img', src: editorial.stackBottom.src, alt: editorial.stackBottom.alt },
          caption: editorial.stackBottom.alt,
          eyebrow: 'Operations',
        },
      ],
    },
    {
      id: 'definition',
      label: 'Definition',
      description: DEFINITION_LEDE,
      primaryEyebrow: p[3].eyebrow,
      primaryCaption: p[3].caption,
      primary: mediaFromBeatVisual(p[3]),
      supporting: [
        { media: mediaFromBeatVisual(p[4]), eyebrow: p[4].eyebrow, caption: p[4].caption },
        { media: mediaFromBeatVisual(p[5]), eyebrow: p[5].eyebrow, caption: p[5].caption },
      ],
    },
    buildPrototypingStep(prototypeTrack, p, physical),
    {
      id: 'validation',
      label: 'Validation',
      description: ADOPT_PROCESS_VALIDATION_LEDE,
      primaryEyebrow: 'Physical prototype',
      primaryCaption:
        'Activation object and program surfaces in context—where warehouse-centered handoffs surfaced during real runs.',
      primary: {
        type: 'img',
        src: physical[0] ?? IMG_PHYSICAL,
        alt: 'Physical prototype validation in context.',
      },
      supporting: [
        {
          media: {
            type: 'img',
            src: physical[1] ?? physical[0] ?? IMG_PHYSICAL,
            alt: 'Post-it synthesis from field sessions.',
          },
          eyebrow: 'Field synthesis',
          caption:
            'Observation patterns linked donor moments to ops constraints—what had to move upstream of the warehouse queue.',
        },
        {
          media: {
            type: 'img',
            src: digital[0] ?? IMG_MOBILE,
            alt: 'Digital prototype validation on device.',
          },
          eyebrow: 'Digital validation',
          caption:
            'Map and enrollment flows tested repeatability from first pledge through intake—before fulfillment routing.',
        },
        {
          media: {
            type: 'img',
            src: editorial.stackBottom.src,
            alt: editorial.stackBottom.alt,
          },
          eyebrow: 'System recommendations',
          caption:
            'Fulfillment and volunteer coordination encoded so donor engagement, pledge intake, and warehouse throughput stay in one repeatable path.',
        },
      ],
    },
  ];
}

function buildStoryBeats(steps: ProcessOverviewStep[]): ProcessStoryBeat[] {
  const beats: ProcessStoryBeat[] = [];

  for (const step of steps) {
    beats.push({
      kind: 'text',
      chapterId: step.id,
      heading: step.label,
      body: step.description,
    });
    beats.push({
      kind: 'media',
      chapterId: step.id,
      media: step.primary,
      caption: step.primaryCaption,
      ariaLabel: step.primaryEyebrow ? `${step.primaryEyebrow}: ${step.primaryCaption}` : step.primaryCaption,
    });
    beats.push({
      kind: 'text',
      chapterId: step.id,
      heading: step.primaryEyebrow ?? step.label,
      body: step.primaryCaption,
    });

    for (const s of step.supporting) {
      beats.push({
        kind: 'media',
        chapterId: step.id,
        media: s.media,
        caption: s.caption,
        ariaLabel: s.eyebrow ? `${s.eyebrow}: ${s.caption}` : s.caption,
      });
      beats.push({
        kind: 'text',
        chapterId: step.id,
        heading: s.eyebrow ?? step.label,
        body: s.caption,
      });
    }
  }

  return beats;
}

function beatsForChapter(
  beats: ProcessStoryBeat[],
  chapterId: ProcessOverviewChapterId,
): ProcessStoryBeat[] {
  return beats.filter((b) => b.chapterId === chapterId);
}

export type ProcessPresentationSlide = {
  id: string;
  text: { heading: string; body: string };
  media?: { media: ProcessOverviewMedia; ariaLabel: string; caption: string };
  /** On md+, place media column before text when true. */
  mediaFirst: boolean;
};

/** Pair text + media beats into editorial slides (presentation deck per chapter). */
function buildPresentationSlides(chapterBeats: ProcessStoryBeat[]): ProcessPresentationSlide[] {
  const slides: ProcessPresentationSlide[] = [];
  let i = 0;
  let mediaFirst = false;

  while (i < chapterBeats.length) {
    const a = chapterBeats[i];
    const b = chapterBeats[i + 1];

    if (a?.kind === 'text' && b?.kind === 'media') {
      slides.push({
        id: `${a.chapterId}-pair-${i}`,
        text: { heading: a.heading, body: a.body },
        media: { media: b.media, ariaLabel: b.ariaLabel, caption: b.caption },
        mediaFirst,
      });
      mediaFirst = !mediaFirst;
      i += 2;
      continue;
    }

    if (a?.kind === 'text') {
      slides.push({
        id: `${a.chapterId}-text-${i}`,
        text: { heading: a.heading, body: a.body },
        mediaFirst,
      });
      i += 1;
      continue;
    }

    if (a?.kind === 'media') {
      slides.push({
        id: `${a.chapterId}-media-${i}`,
        text: { heading: '', body: a.ariaLabel },
        media: { media: a.media, ariaLabel: a.ariaLabel, caption: a.caption },
        mediaFirst: true,
      });
      i += 1;
      continue;
    }

    i += 1;
  }

  return slides;
}

function SlideMediaFill({
  media,
  priority,
}: {
  media: ProcessOverviewMedia;
  priority?: boolean;
}) {
  if (media.type === 'diagram') {
    return (
      <motion.div
        layout
        className="absolute inset-0 min-h-0 overflow-hidden bg-[rgb(250,250,249)] p-1 md:p-2"
      >
        <AdoptSystemDiagram compact />
      </motion.div>
    );
  }
  if (media.type === 'video') {
    return (
      <video
        className="absolute inset-0 h-full w-full object-cover object-center"
        src={media.src}
        poster={media.poster}
        autoPlay
        muted
        loop
        playsInline
        aria-label={media.alt}
      />
    );
  }
  return (
    <img
      src={media.src}
      alt={media.alt}
      className="absolute inset-0 h-full w-full object-cover object-center"
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
    />
  );
}

type Props = {
  editorial: EditorialOverlapBundle;
  /** Case-study scroll root — parallax targets this container; omit on homepage previews. */
  scrollContainerRef?: RefObject<HTMLElement | null>;
  reducedMotion?: boolean;
};

export default function AdoptProcessOverview({
  editorial,
  scrollContainerRef,
  reducedMotion: reducedMotionProp,
}: Props) {
  const baseId = useId();

  const [prototypeTrack, setPrototypeTrack] = useState<PrototypeTrack>('digital');

  const steps = useMemo(
    () => buildProcessSteps(editorial, prototypeTrack),
    [editorial, prototypeTrack],
  );

  const prototypingChapterIndex = useMemo(
    () => steps.findIndex((s) => s.id === PROTOTYPING_CHAPTER_ID),
    [steps],
  );
  const storyBeats = useMemo(() => buildStoryBeats(steps), [steps]);
  const chapters = useMemo(
    () => steps.map((s) => ({ id: s.id, label: s.label })),
    [steps],
  );

  const chapterDecks = useMemo(
    () =>
      steps.map((step) =>
        buildPresentationSlides(beatsForChapter(storyBeats, step.id)),
      ),
    [steps, storyBeats],
  );

  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const systemReducedMotion = useReducedMotion();
  const reduceMotion = reducedMotionProp ?? systemReducedMotion ?? false;
  const headingId = `${baseId}-process-overview-heading`;

  const activeChapter = steps[activeChapterIndex] ?? steps[0];
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
    ] satisfies ProcessPresentationSlide[];
  }, [activeChapter, deck]);

  const slideCount = effectiveDeck.length;
  const clampedSlideIndex = Math.min(activeSlideIndex, Math.max(0, slideCount - 1));

  const goToChapter = useCallback((chapterIdx: number) => {
    const next = Math.max(0, Math.min(steps.length - 1, chapterIdx));
    setActiveChapterIndex(next);
    setActiveSlideIndex(0);
  }, [steps.length]);

  const goNext = useCallback(() => {
    if (clampedSlideIndex < slideCount - 1) {
      setActiveSlideIndex(clampedSlideIndex + 1);
      return;
    }
    if (activeChapterIndex < steps.length - 1) {
      setActiveChapterIndex(activeChapterIndex + 1);
      setActiveSlideIndex(0);
    }
  }, [activeChapterIndex, clampedSlideIndex, slideCount, steps.length]);

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
    clampedSlideIndex < slideCount - 1 || activeChapterIndex < steps.length - 1;

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
    activeChapter.id === PROTOTYPING_CHAPTER_ID
      ? `${activeChapter.id}-${prototypeTrack}`
      : activeChapter.id;

  return (
    <section
      id="adopt-process-overview"
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
          <h2
            id={headingId}
            className="adopt-context-heading mx-auto mb-2 max-w-[28ch] text-balance md:mb-2.5"
          >
            Process overview
          </h2>
          <p className="adopt-body mx-auto mb-0 max-w-[44ch] text-pretty text-ink/82">
            {PROCESS_OVERVIEW_SECTION_LEDE}
          </p>
        </AdoptCaseStudyParallax>
      ) : (
        <div className="process-overview-intro mx-auto mb-10 min-w-0 max-w-2xl text-center md:mb-12">
          <h2
            id={headingId}
            className="adopt-context-heading mx-auto mb-2 max-w-[28ch] text-balance md:mb-2.5"
          >
            Process overview
          </h2>
          <p className="adopt-body mx-auto mb-0 max-w-[44ch] text-pretty text-ink/82">
            {PROCESS_OVERVIEW_SECTION_LEDE}
          </p>
        </div>
      )}

      {/* Sticky ends when this boundary meets the deck — not at section bottom. */}
      <div className="process-overview-sticky-boundary min-w-0">
        <div className="process-overview-nav-sticky sticky top-[var(--site-header-height,0px)] z-40 -mx-px bg-[#F8F9FA]/92 pb-3 backdrop-blur-md md:pb-4">
          <ProcessStoryChapterNav
            chapters={chapters}
            activeIndex={activeChapterIndex}
            onSelect={goToChapter}
            activeSlideIndex={clampedSlideIndex}
            slideCount={slideCount}
            prototypingChapterId={PROTOTYPING_CHAPTER_ID}
            prototypeTrack={prototypeTrack}
            prototypeTrackOptions={PROTOTYPE_TRACK_OPTIONS}
            onPrototypeTrackChange={onPrototypeTrackChange}
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
                <SlideMediaFill
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
          reducedMotion={reduceMotion ?? false}
          onRequestNextChapter={goNext}
          onRequestPrevChapter={goPrev}
          canGoPrev={canGoPrev}
          canGoNext={canGoNext}
          renderMedia={(slide, index) =>
            slide.media ? (
              <SlideMediaFill
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
        Viewing chapter {activeChapterIndex + 1} of {steps.length}: {activeChapter.label}. Slide{' '}
        {clampedSlideIndex + 1} of {slideCount}.
      </p>
    </section>
  );
}

/** Re-export for CRAFT-style usage: `<ProcessOverview editorial={…} />`. */
export function ProcessOverview(props: Props) {
  return <AdoptProcessOverview {...props} />;
}
