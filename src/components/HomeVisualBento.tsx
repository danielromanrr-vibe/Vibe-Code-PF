import type { ReactNode } from 'react';
import { expandMediaControlButtonClassName } from './ExpandMediaButton';
import { teamWork } from '../content/home';
import { VISUAL_WORK, type VisualRoutedKind } from '../content/visualDesign';

type HomeVisualTileArea = 'amazon' | 'ajediam' | 'covantis';

type HomeVisualTileData = {
  kind: VisualRoutedKind;
  src: string;
  alt: string;
  area: HomeVisualTileArea;
  caption: string;
};

const TILES: readonly HomeVisualTileData[] = [
  {
    kind: 'dbs',
    src: '/home/teams/cover-covantis.jpg',
    alt: VISUAL_WORK.dbs.coverAlt,
    area: 'amazon',
    caption: teamWork.captions.amazon,
  },
  {
    kind: 'ajediam',
    src: '/visual-design/projects/ajediam/hero-intro-01.png',
    alt: VISUAL_WORK.ajediam.coverAlt,
    area: 'ajediam',
    caption: teamWork.captions.ajediam,
  },
  {
    kind: 'covantis',
    src: '/home/teams/cover-dbs.jpg',
    alt: VISUAL_WORK.covantis.coverAlt,
    area: 'covantis',
    caption: teamWork.captions.covantis,
  },
];

type HomeVisualBentoProps = {
  copy: ReactNode;
  onOpenWork: (kind: VisualRoutedKind) => void;
};

function HomeVisualTile({
  tile,
  onOpenWork,
}: {
  tile: HomeVisualTileData;
  onOpenWork: (kind: VisualRoutedKind) => void;
}) {
  const label = VISUAL_WORK[tile.kind].navLabel;
  return (
    <button
      type="button"
      className={`home-visual-bento__tile home-visual-bento__${tile.area}`}
      onClick={() => onOpenWork(tile.kind)}
      aria-label={tile.caption ? `View ${label}. ${tile.caption}` : `View ${label}`}
    >
      <img src={tile.src} alt="" className="home-visual-bento__img" />
      {tile.caption ? <span className="home-visual-bento__caption">{tile.caption}</span> : null}
      <span className={`home-visual-bento__plus ${expandMediaControlButtonClassName}`} aria-hidden>
        +
      </span>
    </button>
  );
}

export default function HomeVisualBento({ copy, onOpenWork }: HomeVisualBentoProps) {
  return (
    <div className="home-visual-bento">
      <div className="home-visual-bento__copy">{copy}</div>
      {TILES.map((tile) => (
        <HomeVisualTile key={tile.kind} tile={tile} onOpenWork={onOpenWork} />
      ))}
    </div>
  );
}
