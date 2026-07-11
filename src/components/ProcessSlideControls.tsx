import { ChevronLeft, ChevronRight } from 'lucide-react';
import CarouselPagination from './CarouselPagination';

const controlBtnClass =
  'flex h-8 w-8 items-center justify-center rounded-md text-ink/52 transition-colors duration-150 hover:bg-ink/[0.04] hover:text-ink/88 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25 focus-visible:ring-offset-1 focus-visible:ring-offset-[#F8F9FA] disabled:pointer-events-none disabled:opacity-28';

export type ProcessSlideControlsProps = {
  slideCount: number;
  activeSlideIndex: number;
  onSlideSelect: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  canGoPrev?: boolean;
  canGoNext?: boolean;
  reducedMotion?: boolean;
  layoutIdPrefix: string;
  className?: string;
  navGroupLabel?: string;
  prevLabel?: string;
  nextLabel?: string;
  paginationAriaLabel?: string;
};

export default function ProcessSlideControls({
  slideCount,
  activeSlideIndex,
  onSlideSelect,
  onPrev,
  onNext,
  canGoPrev = false,
  canGoNext = false,
  reducedMotion = false,
  layoutIdPrefix,
  className = '',
  navGroupLabel = 'Slide navigation',
  prevLabel = 'Previous slide',
  nextLabel = 'Next slide',
  paginationAriaLabel = 'Slides in this chapter',
}: ProcessSlideControlsProps) {
  const safeSlideCount = Math.max(1, slideCount);
  const clampedSlide = Math.max(0, Math.min(safeSlideCount - 1, activeSlideIndex));
  const currentPage = clampedSlide + 1;

  return (
    <div
      className={`process-story-slide-controls flex items-center justify-center gap-0.5 sm:gap-1 ${className}`.trim()}
      role="group"
      aria-label={navGroupLabel}
    >
      <button type="button" onClick={onPrev} disabled={!canGoPrev} aria-label={prevLabel} className={controlBtnClass}>
        <ChevronLeft className="h-4 w-4" strokeWidth={2.2} aria-hidden />
      </button>
      {safeSlideCount > 1 ? (
        <CarouselPagination
          count={safeSlideCount}
          activeIndex={clampedSlide}
          onSelect={onSlideSelect}
          reducedMotion={reducedMotion}
          compact
          variant="organic"
          layoutIdPrefix={layoutIdPrefix}
          ariaLabel={paginationAriaLabel}
          className="shrink-0"
        />
      ) : (
        <span className="sr-only" aria-live="polite">
          Turning point {currentPage} of {safeSlideCount}
        </span>
      )}
      <button type="button" onClick={onNext} disabled={!canGoNext} aria-label={nextLabel} className={controlBtnClass}>
        <ChevronRight className="h-4 w-4" strokeWidth={2.2} aria-hidden />
      </button>
    </div>
  );
}
