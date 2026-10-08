import { type ReactNode, type RefObject } from 'react';
import { useReducedMotion } from 'motion/react';
import { useMaxWidth } from '../hooks/useMaxWidth';
import type { ProcessTurningPoint } from '../content/adoptProcessTurningPoints';
import type { ProcessOverviewChapterId, PrototypeTrack } from './AdoptProcessOverview';
import EditorialCardWheelStage, { type EditorialWheelRailContext } from './EditorialCardWheel';
import { EDITORIAL_STAGE_MIN_HEIGHT } from './editorialCardWheelMotion';
import { ProcessSlideMediaFill } from './processOverviewMedia';
import { ProcessChapterArt, PROCESS_CHAPTER_THEMES } from './processChapterArt';
import {
  EditorialCardBody,
  EditorialCardContent,
  EditorialCardGrid,
  EditorialCardVisual,
} from './EditorialEvidenceCard';

type ProcessPlaygroundProps = {
  chapterKey?: string;
  chapterId: ProcessOverviewChapterId;
  chapterLabel: string;
  moments: readonly ProcessTurningPoint[];
  activeIndex: number;
  prototypeTrack?: PrototypeTrack;
  onActiveIndexChange: (index: number) => void;
  ariaLabel: string;
  reducedMotion?: boolean;
  scrollContainerRef?: RefObject<HTMLElement | null>;
  onRequestNextChapter?: () => void;
  onRequestPrevChapter?: () => void;
  hasNextChapter?: boolean;
  hasPrevChapter?: boolean;
  onNextChapter?: () => void;
  onPrevChapter?: () => void;
  canGoPrev?: boolean;
  canGoNext?: boolean;
  layoutIdPrefix: string;
  className?: string;
  pinnedHeader?: ReactNode;
  /** 1-based; prefixes page numbers as 1.1, 1.2… */
  chapterNumber?: number;
  /** Desktop left column; receives the stack's progress and page controls. */
  renderRail?: (ctx: EditorialWheelRailContext) => ReactNode;
  /** When set, overrides the phone hide so each chapter can keep its own column. */
  showTimeline?: boolean;
  showPagination?: boolean;
  /** Put 1.1 + moment title on the card (Adopt stack layout). */
  showCardTitle?: boolean;
  stageMaxWidthClass?: string;
  panelId?: string;
  titleIdPrefix?: string;
};

function TurningPointEvidenceCard({
  moment,
  chapterId,
  theme,
  pageLabel,
  titleId,
}: {
  moment: ProcessTurningPoint;
  chapterId: ProcessOverviewChapterId;
  theme: (typeof PROCESS_CHAPTER_THEMES)[ProcessOverviewChapterId];
  pageLabel?: string;
  titleId?: string;
}) {
  const visualContent = moment.evidence ? (
    <ProcessSlideMediaFill media={moment.evidence} />
  ) : (
    <ProcessChapterArt theme={theme} chapterId={chapterId} />
  );

  return (
    <div className="process-turning-point-card h-full min-h-0 overflow-hidden">
      <EditorialCardGrid layout="stack">
        <EditorialCardVisual edge="none">
          <div className="process-turning-point-media">
            <div className="process-turning-point-media__frame">{visualContent}</div>
          </div>
        </EditorialCardVisual>

        <EditorialCardContent className="process-turning-point-card__copy">
          <div className="process-turning-point-card__copy-stack">
            {pageLabel ? (
              <p id={titleId} className="process-turning-point-card__title">
                {pageLabel}
              </p>
            ) : null}
            <EditorialCardBody>{moment.body}</EditorialCardBody>
          </div>
        </EditorialCardContent>
      </EditorialCardGrid>
    </div>
  );
}

export default function ProcessPlayground({
  reducedMotion: reducedMotionProp = false,
  chapterId,
  chapterLabel,
  moments,
  activeIndex,
  onActiveIndexChange,
  ariaLabel,
  onRequestNextChapter,
  onRequestPrevChapter,
  hasNextChapter,
  hasPrevChapter,
  onNextChapter,
  onPrevChapter,
  canGoPrev,
  canGoNext,
  layoutIdPrefix,
  className = '',
  pinnedHeader,
  chapterNumber,
  renderRail,
  showTimeline: showTimelineProp,
  showPagination = false,
  showCardTitle = false,
  stageMaxWidthClass,
  panelId = 'process-overview-deck-panel',
  titleIdPrefix = 'process-card-title',
}: ProcessPlaygroundProps) {
  const systemReduced = useReducedMotion();
  const reducedMotion = reducedMotionProp || (systemReduced ?? false);
  const isPhone = useMaxWidth(767);
  const theme = PROCESS_CHAPTER_THEMES[chapterId];
  const showTimeline = showTimelineProp ?? !isPhone;
  const indexPrefix = chapterNumber ? `${chapterNumber}.` : '';

  const renderCard = (moment: ProcessTurningPoint, index: number, titleId: string) => (
    <TurningPointEvidenceCard
      moment={moment}
      chapterId={chapterId}
      theme={theme}
      titleId={titleId}
      pageLabel={
        showCardTitle
          ? `${indexPrefix}${index + 1} ${moment.title}`
          : undefined
      }
    />
  );

  // Page scroll is never mapped to the deck, so chapter changes can't move the page.
  return (
    <EditorialCardWheelStage
      wheelScrub={!isPhone}
      hasNextChapter={hasNextChapter}
      hasPrevChapter={hasPrevChapter}
      onNextChapter={onNextChapter}
      onPrevChapter={onPrevChapter}
      moments={moments}
      activeIndex={activeIndex}
      onActiveIndexChange={onActiveIndexChange}
      ariaLabel={ariaLabel}
      railLabel={`Chapter outline — ${chapterLabel}`}
      reducedMotion={reducedMotion}
      showTimeline={showTimeline}
      layoutIdPrefix={layoutIdPrefix}
      className={className}
      stageMinHeight={EDITORIAL_STAGE_MIN_HEIGHT}
      stageMaxWidthClass={stageMaxWidthClass}
      panelId={panelId}
      canGoPrev={canGoPrev ?? false}
      canGoNext={canGoNext ?? false}
      onRequestPrev={onRequestPrevChapter}
      onRequestNext={onRequestNextChapter}
      titleIdPrefix={titleIdPrefix}
      renderCard={renderCard}
      indexPrefix={indexPrefix}
      renderRail={renderRail}
      swipe={isPhone}
      showPagination={showPagination}
      pinnedHeader={isPhone ? pinnedHeader : undefined}
      peekRimPx={28}
      stackDepth={1}
      peekAdvances
      cardZone
    />
  );
}
