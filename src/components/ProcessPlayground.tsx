import { type ReactNode, type RefObject } from 'react';
import { useReducedMotion } from 'motion/react';
import { useMaxWidth } from '../hooks/useMaxWidth';
import type { ProcessTurningPoint } from '../content/adoptProcessTurningPoints';
import type { ProcessOverviewChapterId, PrototypeTrack } from './AdoptProcessOverview';
import EditorialCardWheelStage, { EditorialCardScrollDeck } from './EditorialCardWheel';
import { EDITORIAL_STAGE_MIN_HEIGHT } from './editorialCardWheelMotion';
import { ProcessSlideMediaFill } from './processOverviewMedia';
import { ProcessChapterArt, PROCESS_CHAPTER_THEMES } from './processChapterArt';
import {
  EditorialCardBody,
  EditorialCardContent,
  EditorialCardGrid,
  EditorialCardTitle,
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
  titleId,
}: {
  moment: ProcessTurningPoint;
  chapterId: ProcessOverviewChapterId;
  theme: (typeof PROCESS_CHAPTER_THEMES)[ProcessOverviewChapterId];
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
          <EditorialCardTitle id={titleId}>{moment.title}</EditorialCardTitle>
          <EditorialCardBody>{moment.body}</EditorialCardBody>
        </EditorialCardContent>
      </EditorialCardGrid>
    </div>
  );
}

export default function ProcessPlayground({
  scrollContainerRef,
  reducedMotion: reducedMotionProp = false,
  chapterKey,
  chapterId,
  chapterLabel,
  moments,
  activeIndex,
  onActiveIndexChange,
  ariaLabel,
  onRequestNextChapter,
  onRequestPrevChapter,
  canGoPrev,
  canGoNext,
  layoutIdPrefix,
  className = '',
  pinnedHeader,
}: ProcessPlaygroundProps) {
  const systemReduced = useReducedMotion();
  const reducedMotion = reducedMotionProp || (systemReduced ?? false);
  const isPhone = useMaxWidth(767);
  const useScrollDeck = scrollContainerRef != null && !reducedMotion && moments.length > 1;
  const theme = PROCESS_CHAPTER_THEMES[chapterId];
  const showTimeline = !isPhone;

  const renderCard = (moment: ProcessTurningPoint, _i: number, titleId: string) => (
    <TurningPointEvidenceCard
      moment={moment}
      chapterId={chapterId}
      theme={theme}
      titleId={titleId}
    />
  );

  if (useScrollDeck && scrollContainerRef) {
    return (
      <EditorialCardScrollDeck
        moments={moments}
        scrollContainerRef={scrollContainerRef}
        activeIndex={activeIndex}
        onActiveIndexChange={onActiveIndexChange}
        ariaLabel={ariaLabel}
        reducedMotion={reducedMotion}
        showTimeline={showTimeline}
        showPagination
        scrollVhPerStep={isPhone ? 28 : 56}
        railLabel={`Chapter outline — ${chapterLabel}`}
        deckKey={chapterKey}
        pinnedHeader={pinnedHeader}
        className={className}
        panelId="process-overview-deck-panel"
        titleIdPrefix="process-card-title"
        canGoPrev={canGoPrev ?? false}
        canGoNext={canGoNext ?? false}
        onRequestPrev={onRequestPrevChapter}
        onRequestNext={onRequestNextChapter}
        layoutIdPrefix={layoutIdPrefix}
        renderCard={renderCard}
      />
    );
  }

  return (
    <EditorialCardWheelStage
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
