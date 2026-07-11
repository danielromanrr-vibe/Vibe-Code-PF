import { useId, type ReactNode, type RefObject } from 'react';
import type { ProcessTurningPoint } from '../content/adoptProcessTurningPoints';
import type { ProcessOverviewChapterId, PrototypeTrack } from './AdoptProcessOverview';
import ProcessPlayground from './ProcessPlayground';

export type ProcessInvestigationViewportProps = {
  chapterKey: string;
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
  className?: string;
  pinnedHeader?: ReactNode;
};

/** Thin wrapper — stacked turning-point deck. */
export default function ProcessInvestigationViewport(props: ProcessInvestigationViewportProps) {
  const baseId = useId();
  const { chapterKey, ...storyProps } = props;

  return (
    <ProcessPlayground
      {...storyProps}
      chapterKey={chapterKey}
      layoutIdPrefix={`${baseId}-story`}
    />
  );
}
