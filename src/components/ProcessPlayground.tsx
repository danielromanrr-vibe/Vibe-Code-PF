import { type ReactNode, type RefObject } from 'react';
import { useReducedMotion } from 'motion/react';
import { useMaxWidth } from '../hooks/useMaxWidth';
import type { ProcessTurningPoint } from '../content/adoptProcessTurningPoints';
import type { ProcessOverviewChapterId, PrototypeTrack } from './AdoptProcessOverview';
import EditorialCardWheelStage from './EditorialCardWheel';
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
};

function TurningPointEvidenceCard({
  moment,
  chapterId,
  theme,
}: {
  moment: ProcessTurningPoint;
  chapterId: ProcessOverviewChapterId;
  theme: (typeof PROCESS_CHAPTER_THEMES)[ProcessOverviewChapterId];
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
          <EditorialCardBody>{moment.body}</EditorialCardBody>
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
}: ProcessPlaygroundProps) {
  const systemReduced = useReducedMotion();
  const reducedMotion = reducedMotionProp || (systemReduced ?? false);
  const isPhone = useMaxWidth(767);
  const theme = PROCESS_CHAPTER_THEMES[chapterId];
  const showTimeline = !isPhone;

  const renderCard = (moment: ProcessTurningPoint) => (
    <TurningPointEvidenceCard
      moment={moment}
      chapterId={chapterId}
      theme={theme}
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
      panelId="process-overview-deck-panel"
      canGoPrev={canGoPrev ?? false}
      canGoNext={canGoNext ?? false}
      onRequestPrev={onRequestPrevChapter}
      onRequestNext={onRequestNextChapter}
      pinnedHeader={pinnedHeader}
      titleIdPrefix="process-card-title"
      renderCard={renderCard}
    />
  );
}
