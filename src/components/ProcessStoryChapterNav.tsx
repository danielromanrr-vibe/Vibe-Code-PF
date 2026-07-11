import { useId, type KeyboardEvent } from 'react';
import EditorialTabNav, {
  EditorialTabUnderline,
  type EditorialTabItem,
  type EditorialTabRenderContext,
} from './EditorialTabNav';
import type { PrototypeTrack } from './AdoptProcessOverview';

export type ProcessStoryChapter = {
  id: string;
  label: string;
};

export type PrototypeTrackOption = {
  value: PrototypeTrack;
  label: string;
};

export type ProcessStoryChapterNavProps = {
  chapters: readonly ProcessStoryChapter[];
  activeIndex: number;
  onSelect: (index: number) => void;
  activeSlideIndex?: number;
  slideCount?: number;
  /** When true, sr-only copy uses "moment" instead of "slide". */
  momentFraming?: boolean;
  prototypingChapterId?: string;
  prototypeTrack?: PrototypeTrack;
  prototypeTrackOptions?: readonly PrototypeTrackOption[];
  onPrototypeTrackChange?: (track: PrototypeTrack) => void;
};

function shortTrackLabel(label: string): string {
  return label.replace(/\s+prototype$/i, '').trim();
}

function PrototypeTrackTabs({
  listId,
  options,
  activeTrack,
  onChange,
  onKeyDown,
  variant,
}: {
  listId: string;
  options: readonly PrototypeTrackOption[];
  activeTrack: PrototypeTrack;
  onChange: (track: PrototypeTrack) => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>, index: number) => void;
  variant: 'inline' | 'below';
}) {
  return (
    <div
      className={
        variant === 'inline'
          ? 'process-prototype-track-tabs process-prototype-track-tabs--inline'
          : 'process-prototype-track-tabs process-prototype-track-tabs--below'
      }
      role="presentation"
    >
      <div
        className="process-prototype-track-tabs__list"
        role="tablist"
        aria-label="Prototype type"
        id={listId}
      >
        {options.map((opt, i) => {
          const isActive = opt.value === activeTrack;
          return (
            <button
              key={opt.value}
              type="button"
              role="tab"
              id={`${listId}-${opt.value}`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              className={`process-prototype-track-tabs__tab${
                isActive ? ' process-prototype-track-tabs__tab--active' : ''
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onChange(opt.value);
              }}
              onKeyDown={(event) => onKeyDown(event, i)}
            >
              {shortTrackLabel(opt.label)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Process overview chapter tabs.
 * When Prototyping is active: Digital/Physical sit beside the title (inline on sm+),
 * and the strip peeks Research off the left so Definition ↔ Validation stay primary.
 */
export default function ProcessStoryChapterNav({
  chapters,
  activeIndex,
  onSelect,
  activeSlideIndex = 0,
  slideCount = 1,
  momentFraming = false,
  prototypingChapterId,
  prototypeTrack = 'digital',
  prototypeTrackOptions = [],
  onPrototypeTrackChange,
}: ProcessStoryChapterNavProps) {
  const baseId = useId();
  const trackListId = `${baseId}-prototype-track`;
  const active = chapters[activeIndex] ?? chapters[0];
  const safeSlideCount = Math.max(1, slideCount);
  const clampedSlide = Math.max(0, Math.min(safeSlideCount - 1, activeSlideIndex));
  const currentPage = clampedSlide + 1;

  const prototypingIndex = prototypingChapterId
    ? chapters.findIndex((c) => c.id === prototypingChapterId)
    : -1;
  const hasPrototypeTracks =
    prototypingIndex >= 0 &&
    prototypeTrackOptions.length > 0 &&
    onPrototypeTrackChange != null;
  const prototypingActive = hasPrototypeTracks && activeIndex === prototypingIndex;

  const activeTrackIndex = Math.max(
    0,
    prototypeTrackOptions.findIndex((opt) => opt.value === prototypeTrack),
  );

  const onTrackKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!onPrototypeTrackChange || prototypeTrackOptions.length === 0) return;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      const next = Math.min(prototypeTrackOptions.length - 1, index + 1);
      onPrototypeTrackChange(prototypeTrackOptions[next].value);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      const prev = Math.max(0, index - 1);
      onPrototypeTrackChange(prototypeTrackOptions[prev].value);
    } else if (event.key === 'Home') {
      event.preventDefault();
      onPrototypeTrackChange(prototypeTrackOptions[0].value);
    } else if (event.key === 'End') {
      event.preventDefault();
      onPrototypeTrackChange(prototypeTrackOptions[prototypeTrackOptions.length - 1].value);
    }
  };

  const tabs: readonly EditorialTabItem[] = chapters;
  const trackLiveLabel = shortTrackLabel(
    prototypeTrackOptions[activeTrackIndex]?.label ?? prototypeTrack,
  );

  const renderPrototypingTab = (ctx: EditorialTabRenderContext) => {
    if (!hasPrototypeTracks || ctx.tab.id !== prototypingChapterId) return null;

    const { isActive, isPast, num, tab } = ctx;
    const labelClass = isActive
      ? 'editorial-tab-nav__label--active'
      : isPast
        ? 'editorial-tab-nav__label--past'
        : 'editorial-tab-nav__label--idle';

    return (
      <div className="editorial-tab-nav__tab editorial-tab-nav__tab--prototype flex w-fit max-w-full flex-col items-center">
        <span className="process-prototype-chapter-cluster flex w-fit max-w-full flex-col items-center gap-2 sm:flex-row sm:items-end sm:gap-3">
          <span className="editorial-tab-nav__stack inline-flex w-fit max-w-full flex-col">
            <button
              type="button"
              id={`${ctx.baseId}-chapter-${tab.id}`}
              role="tab"
              aria-selected={isActive}
              aria-current={isActive ? 'step' : undefined}
              aria-controls={ctx.tabPanelId}
              aria-label={`Chapter ${num}: ${tab.label}${isActive ? ' (current)' : isPast ? ' (completed)' : ''}`}
              tabIndex={isActive ? 0 : -1}
              onClick={ctx.onSelect}
              onKeyDown={ctx.onKeyDown}
              className="min-w-0 text-center transition-colors hover:text-ink/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink/25"
            >
              <span className="editorial-tab-nav__label-row inline-flex items-baseline justify-center gap-2 whitespace-nowrap">
                <span className="editorial-tab-nav__index shrink-0" aria-hidden>
                  {num}
                </span>
                <span className={`editorial-tab-nav__label ${labelClass}`}>{tab.label}</span>
              </span>
            </button>
            <EditorialTabUnderline isActive={isActive} />
          </span>

              {isActive ? (
              <PrototypeTrackTabs
                listId={trackListId}
                options={prototypeTrackOptions}
                activeTrack={prototypeTrack}
                onChange={onPrototypeTrackChange}
                onKeyDown={onTrackKeyDown}
                variant="inline"
              />
            ) : null}
        </span>
      </div>
    );
  };

  return (
    <div
      className={[
        'process-story-nav-block',
        prototypingActive ? 'process-story-nav-block--prototyping' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <EditorialTabNav
        className="process-story-nav"
        tabs={tabs}
        activeIndex={activeIndex}
        onSelect={onSelect}
        ariaLabel="Chapters"
        tabPanelId="process-overview-deck-panel"
        showIndex={false}
        align="center"
        autoScroll={prototypingActive ? 'peek-previous' : 'none'}
        peekPreviousRatio={0.28}
        scrollLayoutKey={prototypingActive ? `proto-${prototypeTrack}` : `ch-${activeIndex}`}
        renderTab={hasPrototypeTracks ? renderPrototypingTab : undefined}
      />

      <p id={`${baseId}-chapter-live`} className="sr-only" aria-live="polite">
        {active?.label} chapter
        {prototypingActive ? `, ${trackLiveLabel} prototype` : ''},{' '}
        {momentFraming ? 'moment' : 'slide'} {currentPage} of {safeSlideCount}
      </p>
    </div>
  );
}
