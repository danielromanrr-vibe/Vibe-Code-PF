import { asides, hero, intro, type AboutAside } from '../../content/about';
import {
  ABOUT_INFLUENCE_CARDS,
  cardById,
  type AboutInfluenceCard,
  type AboutPracticeAction,
} from '../../content/aboutMandalaFacets';

export type AboutFolderFile = {
  id: string;
  label: string;
  kind: 'note' | 'list' | 'links' | 'alias' | 'image';
  lead?: string;
  body?: string;
  src?: string;
  alt?: string;
  items?: readonly string[];
  links?: readonly { label: string; action?: AboutPracticeAction }[];
  aliasId?: string;
};

export type AboutFolderRecord = {
  id: string;
  title: string;
  teaser: string;
};

function influenceFiles(card: AboutInfluenceCard): AboutFolderFile[] {
  return [
    {
      id: 'note',
      label: 'Note',
      kind: 'note',
      body: `${card.teaser} ${card.annotationLine}`,
    },
    { id: 'reflection', label: 'Reflection', kind: 'note', body: card.reflection },
    { id: 'shapes', label: 'How it shapes my work', kind: 'list', items: card.shapesWork },
    { id: 'shows', label: 'Where it shows up', kind: 'links', links: card.whereItShowsUp },
    ...card.relatedInfluences.map((rel) => ({
      id: `alias-${rel.id}`,
      label: cardById(rel.id)?.title ?? rel.label,
      kind: 'alias' as const,
      aliasId: rel.id,
      body: rel.description,
    })),
  ];
}

function asideFiles(aside: AboutAside): AboutFolderFile[] {
  if (aside.kind === 'title') {
    return [
      {
        id: 'note',
        label: aside.front.join(' '),
        kind: 'note',
        body: aside.items.join(' '),
      },
    ];
  }
  return aside.items.map((item, index) => ({
    id: `item-${index}`,
    label: item,
    kind: 'note' as const,
    body: item,
  }));
}

export const PROFILE_FOLDER_ID = 'daniel';

const profileFiles: AboutFolderFile[] = [
  {
    id: 'portrait',
    label: 'about-me.jpg',
    kind: 'image',
    src: '/about-me.jpg',
    alt: 'Daniel on a bridge overlook above the water.',
  },
  {
    id: 'intro',
    label: 'about-me.txt',
    kind: 'note',
    lead: hero.h1Lines.join(' '),
    body: intro.body,
  },
];

export const INFLUENCES_FOLDER_ID = 'influences';

const influenceFolderFiles: AboutFolderFile[] = ABOUT_INFLUENCE_CARDS.map((card) => ({
  id: `alias-${card.id}`,
  label: card.title,
  kind: 'alias' as const,
  aliasId: card.id,
}));

/** Influence folders live inside the Six influences folder. */
export function parentFolderId(folderId: string): string | null {
  return cardById(folderId) ? INFLUENCES_FOLDER_ID : null;
}

export function folderFiles(folderId: string): AboutFolderFile[] {
  if (folderId === PROFILE_FOLDER_ID) return profileFiles;
  if (folderId === INFLUENCES_FOLDER_ID) return influenceFolderFiles;
  const card = cardById(folderId);
  if (card) return influenceFiles(card);
  const aside = asides.find((item) => item.id === folderId);
  return aside ? asideFiles(aside) : [];
}

export function folderTitle(folderId: string): string {
  if (folderId === PROFILE_FOLDER_ID) return 'Origin story & cv';
  if (folderId === INFLUENCES_FOLDER_ID) return 'Six design influences';
  return cardById(folderId)?.title ?? asides.find((item) => item.id === folderId)?.front.join(' ') ?? folderId;
}

export const ABOUT_FOLDERS: readonly AboutFolderRecord[] = [
  ...ABOUT_INFLUENCE_CARDS.map((card) => ({
    id: card.id,
    title: card.title,
    teaser: card.teaser,
  })),
  ...asides.map((aside) => ({
    id: aside.id,
    title: aside.front.join(' '),
    teaser: aside.kind === 'title' ? aside.items.join(' ') : aside.items[0] ?? '',
  })),
];
