import { useCallback, useEffect, useId, useMemo, useRef, useState, type RefObject } from 'react';
import { useMotionValue, useReducedMotion } from 'motion/react';
import { ChapterPreviewContext } from './chapterPreview';
import AdoptCaseStudyParallax from './AdoptCaseStudyParallax';
import { process as adoptProcessCopy } from '../content/adopt';
import {
  ADOPT_PROCESS_CHAPTERS,
  ADOPT_PROCESS_OVERVIEW_LEDE,
  ADOPT_PROCESS_OVERVIEW_TITLE,
  turningPointsForChapter,
  type ProcessChapterDef,
  type ProcessTurningPoint,
} from '../content/adoptProcessTurningPoints';
import type { EditorialOverlapBundle } from './AdoptEditorialOverlapGrid';
import ProcessPlayground from './ProcessPlayground';
import { ChapterPageOutline } from './EditorialCardWheel';

export type ProcessOverviewChapterId =
  | 'research'
  | 'definition'
  | 'rapid-prototyping'
  | 'validation';

export const PROTOTYPING_CHAPTER_ID: ProcessOverviewChapterId = 'rapid-prototyping';

export type PrototypeTrack = 'digital' | 'physical';

/** @deprecated Use ProcessOverviewChapterId */
export type ProcessOverviewTabId = ProcessOverviewChapterId;

export type ProcessOverviewMedia =
  | { type: 'img'; src: string; alt: string }
  | { type: 'video'; src: string; poster?: string; alt: string }
  /**
   * Vimeo-hosted cut. Two of the process films are hundreds of megabytes at source, too large to
   * serve from this repo, so they stream instead. `loop` mirrors the self-hosted cards, which play
   * silently on repeat; leave it off for a film that should be watched once, deliberately.
   */
  | { type: 'embed'; provider: 'vimeo'; videoId: string; title: string; loop?: boolean }
  | { type: 'diagram' }
  | { type: 'framework' };

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

/** Content pack — Adopt defaults; Map-aid (and others) pass a case-specific pack. */
export type ProcessOverviewContent = {
  title: string;
  subtitle: string;
  lede: string | readonly string[];
  chapters: readonly ProcessChapterDef[];
  turningPointsForChapter: (
    chapterId: ProcessOverviewChapterId,
    prototypeTrack: PrototypeTrack,
  ) => ProcessTurningPoint[];
  /** One line per phase, shown above the wheel so the process can be read without interacting. */
  glance?: readonly { label: string; body: string }[];
  /** When true, prototyping renders as two stacked bands (digital, then physical). */
  enablePrototypeTrackToggle?: boolean;
  /** “Scroll over the cards…” hint. Off on Adopt. */
  showTurnHint?: boolean;
  /** Adopt / Map-aid stack: H3 above a full-width card. `rail` keeps the left column. */
  chapterLayout?: 'rail' | 'stack';
};

export const ADOPT_OPEN_PROCESS_EVENT = 'adopt-open-process';

export function openAdoptProcessChapter(chapterId: ProcessOverviewChapterId, page: number) {
  window.dispatchEvent(
    new CustomEvent(ADOPT_OPEN_PROCESS_EVENT, { detail: { chapterId, page } }),
  );
}

const ADOPT_PROCESS_OVERVIEW_CONTENT: ProcessOverviewContent = {
  title: adoptProcessCopy.h2 || ADOPT_PROCESS_OVERVIEW_TITLE,
  subtitle: '',
  lede: adoptProcessCopy.body.length > 0 ? adoptProcessCopy.body : ADOPT_PROCESS_OVERVIEW_LEDE,
  chapters: ADOPT_PROCESS_CHAPTERS,
  turningPointsForChapter,
  glance: adoptProcessCopy.glance,
  enablePrototypeTrackToggle: true,
  showTurnHint: false,
  chapterLayout: 'stack',
};

type Props = {
  editorial: EditorialOverlapBundle;
  /** Case-study scroll root — parallax targets this container; omit on homepage previews. */
  scrollContainerRef?: RefObject<HTMLElement | null>;
  reducedMotion?: boolean;
  className?: string;
  /** Defaults to Adopt. Pass Map-aid (or other) content to reuse the same logic. */
  content?: ProcessOverviewContent;
};

function ProcessChapterBand({
  chapter,
  chapterIndex,
  flipped,
  nudge,
  prototypeTrack,
  resolveTurningPoints,
  reduceMotion,
  scrollContainerRef,
  onTurned,
  layoutIdPrefix,
  layout,
  acceptProcessOpen,
}: {
  chapter: ProcessChapterDef;
  chapterIndex: number;
  flipped: boolean;
  nudge: boolean;
  prototypeTrack: PrototypeTrack;
  resolveTurningPoints: ProcessOverviewContent['turningPointsForChapter'];
  reduceMotion: boolean;
  scrollContainerRef?: RefObject<HTMLElement | null>;
  onTurned: () => void;
  layoutIdPrefix: string;
  layout: 'rail' | 'stack';
  acceptProcessOpen: boolean;
}) {
  const bandRef = useRef<HTMLElement>(null);
  const [page, setPage] = useState(0);
  const moments = useMemo(
    () => resolveTurningPoints(chapter.id, prototypeTrack),
    [chapter.id, prototypeTrack, resolveTurningPoints],
  );
  const momentCount = moments.length;
  const activeIndex = Math.max(0, Math.min(page, Math.max(0, momentCount - 1)));
  const number = String(chapterIndex + 1).padStart(2, '0');

  const onPage = useCallback(
    (index: number) => {
      setPage(index);
      onTurned();
    },
    [onTurned],
  );

  useEffect(() => {
    if (!acceptProcessOpen) return;
    const onOpen = (event: Event) => {
      const detail = (event as CustomEvent<{ chapterId?: string; page?: number }>).detail;
      if (!detail || detail.chapterId !== chapter.id || typeof detail.page !== 'number') return;
      const index = Math.max(0, Math.min(detail.page - 1, Math.max(0, momentCount - 1)));
      setPage(index);
      onTurned();
      const node = bandRef.current;
      const scroller = scrollContainerRef?.current;
      if (!node || !scroller) return;
      const top =
        node.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop;
      scroller.scrollTo({ top: Math.max(0, top - 16), behavior: reduceMotion ? 'auto' : 'smooth' });
    };
    window.addEventListener(ADOPT_OPEN_PROCESS_EVENT, onOpen);
    return () => window.removeEventListener(ADOPT_OPEN_PROCESS_EVENT, onOpen);
  }, [acceptProcessOpen, chapter.id, momentCount, onTurned, reduceMotion, scrollContainerRef]);

  const isStack = layout === 'stack';

  return (
    <section
      ref={bandRef}
      className={[
        'process-chapter-band process-overview-deck',
        isStack ? 'process-chapter-band--stack' : '',
        !isStack && flipped ? 'process-chapter-band--flip' : '',
        nudge ? 'process-overview-deck--nudge' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-labelledby={`${layoutIdPrefix}-heading`}
    >
      {isStack ? (
        <h3 id={`${layoutIdPrefix}-heading`} className="process-book__title process-chapter-band__title">
          {number} {chapter.label}
        </h3>
      ) : null}
      <ProcessPlayground
        chapterId={chapter.id}
        chapterLabel={chapter.label}
        moments={moments}
        activeIndex={activeIndex}
        prototypeTrack={prototypeTrack}
        onActiveIndexChange={onPage}
        ariaLabel={`${chapter.label} chapter`}
        reducedMotion={reduceMotion}
        scrollContainerRef={scrollContainerRef}
        canGoPrev={activeIndex > 0}
        canGoNext={activeIndex < momentCount - 1}
        hasNextChapter={false}
        hasPrevChapter={false}
        layoutIdPrefix={layoutIdPrefix}
        className="w-full md:max-w-none"
        chapterNumber={chapterIndex + 1}
        showTimeline={!isStack}
        showPagination
        showCardTitle={isStack}
        stageMaxWidthClass={isStack ? 'max-w-none' : undefined}
        panelId={`${layoutIdPrefix}-panel`}
        titleIdPrefix={`${layoutIdPrefix}-card`}
        renderRail={
          isStack
            ? undefined
            : (rail) => (
                <div className="process-chapter-band__copy">
                  <h3 id={`${layoutIdPrefix}-heading`} className="process-book__title process-chapter-band__title">
                    {number} {chapter.label}
                  </h3>
                  {chapter.thesis ? (
                    <p className="adopt-body process-chapter-band__body">{chapter.thesis}</p>
                  ) : null}
                  <ChapterPageOutline
                    progress={rail.progress}
                    moments={moments}
                    momentCount={rail.momentCount}
                    onSelectMoment={rail.onSelectMoment}
                    indexPrefix={`${chapterIndex + 1}.`}
                    className="process-chapter-band__outline"
                  />
                </div>
              )
        }
      />
      <p className="sr-only" aria-live="polite">
        {chapter.label}. Page {activeIndex + 1} of {momentCount}: {moments[activeIndex]?.title ?? ''}.
      </p>
    </section>
  );
}

export default function AdoptProcessOverview({
  editorial: _editorial,
  scrollContainerRef,
  reducedMotion: reducedMotionProp,
  className = '',
  content = ADOPT_PROCESS_OVERVIEW_CONTENT,
}: Props) {
  const baseId = useId();
  const [hasTurnedPage, setHasTurnedPage] = useState(false);
  const [nudge, setNudge] = useState(false);
  const deckRef = useRef<HTMLDivElement>(null);

  const systemReducedMotion = useReducedMotion();
  const reduceMotion = reducedMotionProp ?? systemReducedMotion ?? false;
  const headingId = `${baseId}-process-overview-heading`;

  const chapters = content.chapters;
  const acceptProcessOpen = content === ADOPT_PROCESS_OVERVIEW_CONTENT;
  const enablePrototypeTrackToggle = content.enablePrototypeTrackToggle ?? false;
  const chapterLayout = content.chapterLayout ?? 'rail';
  const resolveTurningPoints = content.turningPointsForChapter;

  useEffect(() => {
    if (reduceMotion) return;
    const el = deckRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setNudge(true);
        io.disconnect();
      },
      { root: scrollContainerRef?.current ?? null, threshold: 0.45 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduceMotion, scrollContainerRef]);

  const onTurned = useCallback(() => setHasTurnedPage(true), []);

  const chapterPreview = useMotionValue(0);

  const showTurnHint = content.showTurnHint ?? true;
  const ledeParagraphs = (Array.isArray(content.lede) ? content.lede : [content.lede]).filter(Boolean);
  const ledeClass = [
    'adopt-body process-overview-intro__lede mb-0 text-pretty text-ink/82',
    ledeParagraphs.length > 1 ? 'max-w-[62ch] text-left' : 'max-w-[44ch]',
  ].join(' ');

  // Said once, until the first page turn: scrolling over the cards turns pages, not the page.
  const howToTurn = (
    <p
      className={`process-overview-intro__hint${hasTurnedPage ? ' process-overview-intro__hint--done' : ''}`}
      aria-hidden={hasTurnedPage || undefined}
    >
      <span className="hidden md:inline">Scroll over the cards to turn pages</span>
      <span className="md:hidden">Swipe the cards to turn pages</span>
    </p>
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
          className="process-overview-intro min-w-0 w-full text-left"
        >
          <h2
            id={headingId}
            className="adopt-context-heading text-balance"
          >
            {content.title}
          </h2>
          {content.subtitle ? (
            <p className="process-overview-intro__subtitle mb-0 max-w-[36ch] text-pretty">
              {content.subtitle}
            </p>
          ) : null}
          {ledeParagraphs.map((paragraph) => (
            <p key={paragraph} className={ledeClass}>
              {paragraph}
            </p>
          ))}
          {showTurnHint ? howToTurn : null}
        </AdoptCaseStudyParallax>
      ) : (
        <div className="process-overview-intro min-w-0 w-full text-left">
          <h2
            id={headingId}
            className="adopt-context-heading text-balance"
          >
            {content.title}
          </h2>
          {content.subtitle ? (
            <p className="process-overview-intro__subtitle mb-0 max-w-[36ch] text-pretty">
              {content.subtitle}
            </p>
          ) : null}
          {ledeParagraphs.map((paragraph) => (
            <p key={paragraph} className={ledeClass}>
              {paragraph}
            </p>
          ))}
          {showTurnHint ? howToTurn : null}
        </div>
      )}

      {(content.glance ?? []).length > 0 ? (
        <ol className="process-glance" aria-label="Process at a glance">
          {(content.glance ?? []).map((item) => (
            <li key={item.label}>
              <p className="adopt-meta-label adopt-meta-label--bold">{item.label}</p>
              <p className="adopt-body adopt-overview__card-copy mb-0 text-pretty">{item.body}</p>
            </li>
          ))}
        </ol>
      ) : null}

      <div ref={deckRef} className="process-chapter-bands">
        <ChapterPreviewContext.Provider value={chapterPreview}>
          {chapters.flatMap((chapter, index) => {
            if (enablePrototypeTrackToggle && chapter.id === PROTOTYPING_CHAPTER_ID) {
              return (
                [
                  { track: 'digital' as const, label: 'Prototyping digital' },
                  { track: 'physical' as const, label: 'Prototyping physical' },
                ] as const
              ).map((band, bandIndex) => (
                <ProcessChapterBand
                  key={`${chapter.id}-${band.track}`}
                  chapter={{ ...chapter, label: band.label }}
                  chapterIndex={index + bandIndex}
                  flipped={false}
                  nudge={false}
                  prototypeTrack={band.track}
                  resolveTurningPoints={resolveTurningPoints}
                  reduceMotion={reduceMotion}
                  scrollContainerRef={scrollContainerRef}
                  onTurned={onTurned}
                  layoutIdPrefix={`${baseId}-chapter-${chapter.id}-${band.track}`}
                  layout={chapterLayout}
                  acceptProcessOpen={acceptProcessOpen}
                />
              ));
            }

            return (
              <ProcessChapterBand
                key={chapter.id}
                chapter={chapter}
                chapterIndex={index}
                flipped={index % 2 === 1}
                nudge={nudge && index === 0}
                prototypeTrack="digital"
                resolveTurningPoints={resolveTurningPoints}
                reduceMotion={reduceMotion}
                scrollContainerRef={scrollContainerRef}
                onTurned={onTurned}
                layoutIdPrefix={`${baseId}-chapter-${chapter.id}`}
                layout={chapterLayout}
                acceptProcessOpen={acceptProcessOpen}
              />
            );
          })}
        </ChapterPreviewContext.Provider>
      </div>
    </div>
  );
}

/** Re-export for CRAFT-style usage: `<ProcessOverview editorial={…} />`. */
export function ProcessOverview(props: Props) {
  return <AdoptProcessOverview {...props} />;
}
