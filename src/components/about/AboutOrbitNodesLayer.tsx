import { useCallback, type MutableRefObject, type RefObject } from 'react';
import type { MandalaSystemNodeLayout } from '../Mandala';
import { asides } from '../../content/about';
import {
  ABOUT_INFLUENCE_CARDS,
  type AboutInfluenceCard,
  type AboutPracticeAction,
  type InfluenceDepth,
} from '../../content/aboutMandalaFacets';
import AboutFolderBloom from './AboutFolderBloom';
import { folderFiles, folderTitle } from './aboutFolders';
import AboutInfluenceNode from './AboutInfluenceNode';
import { buildAnnotationOrigin } from './aboutAnnotationOrigin';
import { relatedIdsForCard } from './aboutRelationshipGraph';
import { layoutForCard } from './aboutOrbitNodeUtils';
import { labelPlacementForCard } from './aboutFieldLayout';
import MandalaInfluenceGlyph from './mandalaInfluenceGlyph';
import type { AboutFieldGeometry } from './useAboutFieldGeometry';

export type LockedFieldAnchor = {
  nodeX: number;
  nodeY: number;
  centerX: number;
  centerY: number;
};

type AboutOrbitNodesLayerProps = {
  geometry: AboutFieldGeometry;
  layoutsRef: RefObject<readonly MandalaSystemNodeLayout[]>;
  activeCardId: string | null;
  previewCardId: string | null;
  depth: InfluenceDepth;
  lockedAnchor: LockedFieldAnchor | null;
  visitedIds: ReadonlySet<string>;
  onNodeActivate: (card: AboutInfluenceCard, trigger: HTMLButtonElement) => void;
  onPreviewEnter: (cardId: string) => void;
  onPreviewLeave: (cardId: string) => void;
  onClose: () => void;
  onExplore: (cardId: string) => void;
  onStepBack: () => void;
  onRelated: (cardId: string) => void;
  onRelatedHover: (fromCardId: string, toCardId: string | null) => void;
  onPracticeClick?: (action: AboutPracticeAction) => void;
  openFolderId: string | null;
  openFileId: string | null;
  onOpenFile: (fileId: string) => void;
  onOpenAlias: (folderId: string) => void;
  onCloseFile: () => void;
  onAsideActivate: (asideId: string, trigger: HTMLButtonElement) => void;
  returnFocusRef: MutableRefObject<HTMLElement | null>;
};

export function getLockedAnchor(
  layouts: readonly MandalaSystemNodeLayout[],
  cardId: string,
): LockedFieldAnchor | null {
  const origin = buildAnnotationOrigin(layouts, cardId);
  if (!origin) return null;
  return {
    nodeX: origin.nodeX,
    nodeY: origin.nodeY,
    centerX: origin.centerX,
    centerY: origin.centerY,
  };
}

export default function AboutOrbitNodesLayer({
  geometry,
  layoutsRef,
  activeCardId,
  previewCardId,
  depth,
  lockedAnchor,
  visitedIds,
  onNodeActivate,
  onPreviewEnter,
  onPreviewLeave,
  onClose,
  onExplore,
  onStepBack,
  onRelated,
  onRelatedHover,
  onPracticeClick,
  openFolderId,
  openFileId,
  onOpenFile,
  onOpenAlias,
  onCloseFile,
  onAsideActivate,
  returnFocusRef,
}: AboutOrbitNodesLayerProps) {
  const { anchorRect, positions, centerX, centerY } = geometry;

  const inView =
    anchorRect &&
    anchorRect.bottom > 0 &&
    anchorRect.top < window.innerHeight &&
    anchorRect.width > 0;

  const focusCardId = activeCardId ?? (depth === 'collapsed' ? previewCardId : null);
  const focusRelatedIds = focusCardId ? relatedIdsForCard(focusCardId) : null;
  const isFieldEngaged = depth !== 'collapsed' && Boolean(activeCardId);

  const handleNodeActivate = useCallback(
    (card: AboutInfluenceCard, trigger: HTMLButtonElement) => {
      returnFocusRef.current = trigger;
      onNodeActivate(card, trigger);
    },
    [onNodeActivate, returnFocusRef],
  );

  const layouts = layoutsRef.current ?? [];

  return (
    <div className="about-orbit-nodes-layer pointer-events-none fixed inset-0 z-[18]">
      {ABOUT_INFLUENCE_CARDS.map((card) => {
        const layout = layoutForCard(layouts, card);
        const isActive = activeCardId === card.id;
        const cardDepth: InfluenceDepth = isActive ? depth : 'collapsed';
        const isPreviewed = previewCardId === card.id && !isFieldEngaged;
        const isRelated = Boolean(focusRelatedIds?.has(card.id) && card.id !== focusCardId);
        const isDimmed = Boolean(
          focusCardId && card.id !== focusCardId && !focusRelatedIds?.has(card.id),
        );
        const isVisited = visitedIds.has(card.id);

        if (!inView) return null;

        const livePos = positions.get(card.id);
        if (!livePos) return null;

        const nodeX = isActive && lockedAnchor ? lockedAnchor.nodeX : livePos.x;
        const nodeY = isActive && lockedAnchor ? lockedAnchor.nodeY : livePos.y;
        const nodeCenterX = isActive && lockedAnchor ? lockedAnchor.centerX : centerX;
        const nodeCenterY = isActive && lockedAnchor ? lockedAnchor.centerY : centerY;
        const kind = layout?.kind ?? ((card.nodeIndex % 3) as 0 | 1 | 2);
        const nodeRgb = layout?.rgb ?? ([61, 78, 216] as const);
        const isActiveLandmark = isActive && depth !== 'collapsed';

        return (
          <AboutInfluenceNode
            key={card.id}
            card={card}
            kind={kind}
            visualSize={layout?.r ?? 8}
            rgb={nodeRgb}
            labelPlacement={labelPlacementForCard(card.id)}
            nodeX={nodeX}
            nodeY={nodeY}
            centerX={nodeCenterX}
            centerY={nodeCenterY}
            depth={cardDepth}
            isActive={isActiveLandmark}
            isDimmed={isDimmed}
            isRelated={isRelated}
            isPreviewed={isPreviewed}
            isVisited={isVisited}
            onPreviewEnter={() => onPreviewEnter(card.id)}
            onPreviewLeave={() => onPreviewLeave(card.id)}
            onNodeActivate={handleNodeActivate}
            onClose={onClose}
            onExplore={onExplore}
            onStepBack={onStepBack}
            onRelated={onRelated}
            onRelatedHover={
              isActive && depth === 'reflection'
                ? (relId) => onRelatedHover(card.id, relId)
                : undefined
            }
            onPracticeClick={onPracticeClick}
          />
        );
      })}
      {inView
        ? asides.map((aside, index) => {
            const pos = positions.get(aside.id);
            if (!pos) return null;
            const title = aside.front.join(' ');
            const dimmed = Boolean(focusCardId && focusCardId !== aside.id);
            return (
              <div
                key={aside.id}
                data-about-aside-node={aside.id}
                className="about-aside-node pointer-events-none absolute left-0 top-0"
                style={{
                  left: pos.x,
                  top: pos.y,
                  transform: 'translate(-50%, -50%)',
                  zIndex: openFolderId === aside.id ? 24 : 4,
                  opacity: dimmed ? 0.32 : 1,
                }}
              >
                <button
                  type="button"
                  className="about-aside-node__hit pointer-events-auto"
                  aria-label={`${title}${aside.items[0] ? `: ${aside.items[0]}` : ''}`}
                  aria-expanded={openFolderId === aside.id}
                  onClick={(event) => onAsideActivate(aside.id, event.currentTarget)}
                >
                  <MandalaInfluenceGlyph
                    kind={1}
                    nodeIndex={20 + index}
                    rgb={[61, 78, 216]}
                    size={40}
                    presence={openFolderId === aside.id ? 'active' : 'rest'}
                  />
                </button>
                <span className="about-aside-node__label">{title}</span>
              </div>
            );
          })
        : null}
      {inView && openFolderId ? (
        <AboutFolderBloom
          title={folderTitle(openFolderId)}
          files={folderFiles(openFolderId)}
          originX={positions.get(openFolderId)?.x ?? centerX}
          originY={positions.get(openFolderId)?.y ?? centerY}
          centerX={centerX}
          centerY={centerY}
          openFileId={openFileId}
          onOpenFile={onOpenFile}
          onOpenAlias={onOpenAlias}
          onCloseFile={onCloseFile}
          onPracticeClick={onPracticeClick}
        />
      ) : null}
    </div>
  );
}
