import { useId, type ChangeEvent } from 'react';
import { ChevronDown } from 'lucide-react';
import EditorialTabNav, { EditorialTabUnderline, type EditorialTabItem } from './EditorialTabNav';
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
  prototypingChapterId?: string;
  prototypeTrack?: PrototypeTrack;
  prototypeTrackOptions?: readonly PrototypeTrackOption[];
  onPrototypeTrackChange?: (track: PrototypeTrack) => void;
};

/**
 * Process overview chapter tabs — editorial tab nav + optional prototype track select.
 */
export default function ProcessStoryChapterNav({
  chapters,
  activeIndex,
  onSelect,
  activeSlideIndex = 0,
  slideCount = 1,
  prototypingChapterId,
  prototypeTrack = 'digital',
  prototypeTrackOptions = [],
  onPrototypeTrackChange,
}: ProcessStoryChapterNavProps) {
  const baseId = useId();
  const selectId = `${baseId}-prototype-track`;
  const active = chapters[activeIndex] ?? chapters[0];
  const safeSlideCount = Math.max(1, slideCount);
  const clampedSlide = Math.max(0, Math.min(safeSlideCount - 1, activeSlideIndex));
  const currentPage = clampedSlide + 1;

  const prototypingIndex = prototypingChapterId
    ? chapters.findIndex((c) => c.id === prototypingChapterId)
    : -1;
  const hasPrototypeDropdown =
    prototypingIndex >= 0 && prototypeTrackOptions.length > 0 && onPrototypeTrackChange != null;

  const onPrototypeSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const track = event.target.value as PrototypeTrack;
    onPrototypeTrackChange?.(track);
  };

  const tabs: readonly EditorialTabItem[] = chapters;

  return (
    <>
      <EditorialTabNav
        className="process-story-nav"
        tabs={tabs}
        activeIndex={activeIndex}
        onSelect={onSelect}
        ariaLabel="Process story chapters"
        tabPanelId="process-overview-deck-panel"
        showIndex
        align="center"
        renderTab={
          hasPrototypeDropdown
            ? (ctx) => {
                if (ctx.tab.id !== prototypingChapterId) return null;

                const { isActive, isPast, num, tab } = ctx;
                const labelClass = isActive
                  ? 'editorial-tab-nav__label--active'
                  : isPast
                    ? 'editorial-tab-nav__label--past'
                    : 'editorial-tab-nav__label--idle';

                return (
                  <div className="editorial-tab-nav__tab editorial-tab-nav__tab--prototype flex w-fit max-w-full flex-col">
                    <span className="editorial-tab-nav__stack inline-flex w-fit max-w-full flex-col">
                      <span className="flex min-w-0 items-end justify-center gap-1 sm:gap-1.5">
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
                        {isActive ? (
                          <span className="relative flex shrink-0 items-center">
                            <label htmlFor={selectId} className="sr-only">
                              Prototype type
                            </label>
                            <select
                              id={selectId}
                              value={prototypeTrack}
                              onChange={onPrototypeSelect}
                              className="process-prototype-track-select max-w-[7.25rem] cursor-pointer appearance-none border-0 bg-transparent py-0 pl-0 pr-4 font-body text-[0.75rem] font-medium leading-none tracking-[0.02em] text-ink/52 outline-none focus-visible:ring-2 focus-visible:ring-ink/25 focus-visible:ring-offset-1 focus-visible:ring-offset-[#F8F9FA] sm:max-w-[8rem] sm:text-[0.8125rem]"
                              aria-label="Choose prototype type: digital or physical"
                            >
                              {prototypeTrackOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label.replace(' prototype', '')}
                                </option>
                              ))}
                            </select>
                            <ChevronDown
                              className="pointer-events-none absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 text-ink/36"
                              strokeWidth={2.2}
                              aria-hidden
                            />
                          </span>
                        ) : null}
                      </span>
                      <EditorialTabUnderline isActive={isActive} />
                    </span>
                  </div>
                );
              }
            : undefined
        }
      />

      <p id={`${baseId}-chapter-live`} className="sr-only" aria-live="polite">
        {active?.label}, slide {currentPage} of {safeSlideCount}
      </p>
    </>
  );
}
