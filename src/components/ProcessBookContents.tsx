import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import {
  CHAPTER_PREVIEW_MAX,
  ChapterPageOutline,
  type EditorialWheelMoment,
  type EditorialWheelRailContext,
} from './EditorialCardWheel';
import { useChapterPreview } from './chapterPreview';
import { PrototypeTrackTabs, type PrototypeTrackOption } from './ProcessStoryChapterNav';
import type { PrototypeTrack } from './AdoptProcessOverview';

type ChapterState = 'active' | 'past' | 'upcoming';

const FOLD_EASE = [0.22, 0.82, 0.24, 1] as const;

function ChapterHead({
  number,
  label,
  pageCount,
  state,
  lean,
  onSelect,
}: {
  number: string;
  label: string;
  pageCount: number;
  state: ChapterState;
  /** 1 = the chapter a forward pull lands on, -1 = a backward pull, 0 = neither. */
  lean: -1 | 0 | 1;
  onSelect: () => void;
}) {
  const preview = useChapterPreview();
  const idle = useMotionValue(0);
  const pagesLabel = `${pageCount} ${pageCount === 1 ? 'page' : 'pages'}`;
  const pull = useTransform(preview ?? idle, (v) =>
    lean === 0 ? 0 : Math.max(0, Math.min(1, (lean * v) / CHAPTER_PREVIEW_MAX)),
  );
  const x = useTransform(pull, (p) => p * 4);

  return (
    <h3 className="process-book__title">
      <motion.button
        type="button"
        className="process-book__head"
        // --lean brightens a closed title toward full ink as the pull reaches it.
        style={{ x, '--lean': pull } as never}
        onClick={onSelect}
        aria-current={state === 'active' ? 'step' : undefined}
        aria-label={`Chapter ${number}: ${label}, ${pagesLabel}${
          state === 'active' ? ' (current)' : state === 'past' ? ' (read)' : ''
        }`}
      >
        {number} {label}
      </motion.button>
    </h3>
  );
}

export type ProcessBookContentsProps = {
  chapters: readonly { id: string; label: string }[];
  activeChapterIndex: number;
  pagesByChapter: readonly (readonly EditorialWheelMoment[])[];
  onSelectChapter: (index: number) => void;
  rail: EditorialWheelRailContext;
  reducedMotion?: boolean;
  prototypingChapterId?: string;
  prototypeTrack?: PrototypeTrack;
  prototypeTrackOptions?: readonly PrototypeTrackOption[];
  onPrototypeTrackChange?: (track: PrototypeTrack) => void;
};

/**
 * Desktop table of contents for the process deck: every chapter stays listed, only the
 * current one opens to its pages, and the pages light up with the card stack's progress.
 */
export default function ProcessBookContents({
  chapters,
  activeChapterIndex,
  pagesByChapter,
  onSelectChapter,
  rail,
  reducedMotion = false,
  prototypingChapterId,
  prototypeTrack = 'digital',
  prototypeTrackOptions = [],
  onPrototypeTrackChange,
}: ProcessBookContentsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const [overflow, setOverflow] = useState({ top: false, bottom: false });
  const [railFill, setRailFill] = useState(0);

  const measureOverflow = () => {
    const el = scrollRef.current;
    if (!el) return;
    const top = el.scrollTop > 1;
    const bottom = el.scrollTop + el.clientHeight < el.scrollHeight - 1;
    setOverflow((prev) => (prev.top === top && prev.bottom === bottom ? prev : { top, bottom }));
  };

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(measureOverflow);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    measureOverflow();
    return () => ro.disconnect();
  }, []);

  // Only when the list is taller than the card: keep the current page in view.
  // Scrolls this list alone, never the page.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || el.scrollHeight <= el.clientHeight + 1) return;
    const frame = window.setTimeout(() => {
      const nodes = el.querySelectorAll<HTMLElement>(
        '.process-book__chapter--active .process-chapter-outline__node',
      );
      const node = nodes[rail.activeIndex] ?? el.querySelector<HTMLElement>('.process-book__chapter--active');
      if (!node) return;
      const nodeTop = node.getBoundingClientRect().top - el.getBoundingClientRect().top + el.scrollTop;
      const target = Math.max(0, Math.min(el.scrollHeight - el.clientHeight, nodeTop - el.clientHeight * 0.35));
      el.scrollTo({ top: target, behavior: reducedMotion ? 'auto' : 'smooth' });
    }, reducedMotion ? 0 : 320);
    return () => window.clearTimeout(frame);
  }, [activeChapterIndex, rail.activeIndex, reducedMotion]);

  // The rail darkens from the first chapter down to the current page.
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const markers = list.querySelectorAll<HTMLElement>(
        '.process-book__chapter--active .process-chapter-outline__entry > div',
      );
      const target =
        markers[rail.activeIndex] ?? list.querySelector<HTMLElement>('.process-book__chapter--active .process-book__head');
      if (!target) return;
      const start = parseFloat(getComputedStyle(list, '::before').top) || 0;
      setRailFill(Math.max(0, target.getBoundingClientRect().top - list.getBoundingClientRect().top - start));
    };
    measure();
    // Re-measure once the chapter rows have settled into their new positions.
    const settled = window.setTimeout(measure, reducedMotion ? 0 : 380);
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => {
      window.clearTimeout(settled);
      ro.disconnect();
    };
  }, [activeChapterIndex, rail.activeIndex, reducedMotion]);

  const onTrackKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!onPrototypeTrackChange || prototypeTrackOptions.length === 0) return;
    const last = prototypeTrackOptions.length - 1;
    const to =
      event.key === 'ArrowRight' || event.key === 'ArrowDown'
        ? Math.min(last, index + 1)
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
          ? Math.max(0, index - 1)
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : -1;
    if (to < 0) return;
    event.preventDefault();
    event.stopPropagation();
    onPrototypeTrackChange(prototypeTrackOptions[to].value);
  };

  const settle = reducedMotion ? { duration: 0 } : { duration: 0.34, ease: FOLD_EASE };

  return (
    <nav className="process-book" aria-label="Process chapters">
      <div
        ref={scrollRef}
        className={[
          'process-book__scroll',
          overflow.top ? 'process-book__scroll--fade-top' : '',
          overflow.bottom ? 'process-book__scroll--fade-bottom' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onScroll={measureOverflow}
      >
        <span className="process-book__rail-fill" style={{ height: railFill }} aria-hidden />
        <ol ref={listRef} className="process-book__chapters">
          {chapters.map((chapter, i) => {
            const state: ChapterState =
              i === activeChapterIndex ? 'active' : i < activeChapterIndex ? 'past' : 'upcoming';
            const number = String(i + 1).padStart(2, '0');
            const pages = pagesByChapter[i] ?? [];
            const showTrack =
              state === 'active' &&
              chapter.id === prototypingChapterId &&
              prototypeTrackOptions.length > 0 &&
              onPrototypeTrackChange != null;
            return (
              <motion.li
                key={chapter.id}
                layout="position"
                transition={settle}
                className={`process-book__chapter process-book__chapter--${state}`}
              >
                <ChapterHead
                  number={number}
                  label={chapter.label}
                  pageCount={pages.length}
                  state={state}
                  lean={i === activeChapterIndex + 1 ? 1 : i === activeChapterIndex - 1 ? -1 : 0}
                  onSelect={() => onSelectChapter(i)}
                />
                {state === 'active' ? (
                  <motion.div
                    key={`pages-${chapter.id}`}
                    className="process-book__pages"
                    initial={reducedMotion ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={settle}
                  >
                    {showTrack ? (
                      <div className="process-book__track">
                        <PrototypeTrackTabs
                          listId={`process-book-track-${chapter.id}`}
                          options={prototypeTrackOptions}
                          activeTrack={prototypeTrack}
                          onChange={onPrototypeTrackChange}
                          onKeyDown={onTrackKeyDown}
                          variant="below"
                        />
                      </div>
                    ) : null}
                    <ChapterPageOutline
                      progress={rail.progress}
                      moments={pages}
                      momentCount={rail.momentCount}
                      onSelectMoment={rail.onSelectMoment}
                      indexPrefix={`${i + 1}.`}
                      markerOnly
                    />
                  </motion.div>
                ) : null}
              </motion.li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
