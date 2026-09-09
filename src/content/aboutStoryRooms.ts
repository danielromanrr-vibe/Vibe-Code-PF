import type { MandalaSpriteId } from '../lib/mandalaSprite';

export const ABOUT_FUN_FACTS = [
  'I’ve lived in six countries.',
  'I still paint in watercolor and ink.',
  'A UPS shop floor is on the résumé.',
  'I founded a product before I designed for one.',
  'Questions stay with me longer than answers.',
  'The best work happens with other people.',
] as const;

export type AboutStoryRoom = {
  spriteId: MandalaSpriteId;
  id: string;
  kicker: string;
  title: string;
  paragraphs: readonly string[];
  funFacts?: readonly string[];
  aside: string;
  /** Optional text link at the end of the room (Design principles → Thinking through design). */
  cta?: {
    label: string;
    action: 'thinking';
  };
};

export type AboutPageChapter = {
  spriteId: MandalaSpriteId;
  id: string;
  title: string;
  body: string;
};

export const ABOUT_PRINCIPLES: AboutPageChapter = {
  spriteId: 'euphoria',
  id: 'design-principles',
  title: 'Design principles',
  body: 'I start with context before interface. Composition is an argument: what you leave out matters as much as what you include. Constraints are not obstacles — they are the design.',
};

/** Right-column scroll: Paloma, Memphis, Clockwise, Euphoria, then Design principles. */
export const ABOUT_HERO_ROOMS: readonly AboutStoryRoom[] = [
  {
    spriteId: 'paloma',
    id: 'origin',
    kicker: 'Origin',
    title: 'Fun facts',
    paragraphs: [],
    funFacts: ABOUT_FUN_FACTS,
    aside: '',
  },
  {
    spriteId: 'memphis',
    id: 'taste',
    kicker: 'Taste',
    title: 'What the eye keeps',
    paragraphs: [
      'Mock copy for Memphis — the collage. Painting, ink, and small prototypes taught me that composition is an argument: what you leave out matters as much as what you include.',
      'This room should feel like objects on a table, not a path. One piece at a time. Graphic, already in color.',
    ],
    aside: 'The habit is still the same: make something small, look at it honestly, revise.',
  },
  {
    spriteId: 'clockwise',
    id: 'method',
    kicker: 'Method',
    title: 'How the work actually moves',
    paragraphs: [
      'Mock copy for Clockwise — sequence. Agency floors, a shop floor, nonprofit operations: each job had a direction, and the work only held if the handoff did.',
      'Arcs complete as you stay. This is the chaptered room: first the role, then the system underneath it.',
    ],
    aside: 'Strategy means little if the handoff fails. Constraints are the design.',
  },
  {
    spriteId: 'euphoria',
    id: 'practice',
    kicker: 'Practice',
    title: 'What I make now',
    paragraphs: [
      'Mock copy for Euphoria — the living field. Curiosity is not wandering; it is staying with a question until the real constraint shows. The projects sit around this room, not inside a list.',
      'This is where the letter opens back into the work. The toy is the same mark you already know from the rest of the site.',
    ],
    aside: 'Exits: Adopt-a-School, Driver Coordination, thinking through design.',
  },
  {
    spriteId: 'euphoria',
    id: ABOUT_PRINCIPLES.id,
    kicker: 'Principles',
    title: ABOUT_PRINCIPLES.title,
    paragraphs: [ABOUT_PRINCIPLES.body],
    aside: '',
    cta: {
      label: 'Thinking through design',
      action: 'thinking',
    },
  },
];

export const ABOUT_STORY_ROOMS = ABOUT_HERO_ROOMS;

export function storyRoomBySprite(id: MandalaSpriteId): AboutStoryRoom | undefined {
  return ABOUT_HERO_ROOMS.find((room) => room.spriteId === id);
}

export function nextAboutStoryRoom(current: MandalaSpriteId): AboutStoryRoom {
  const unique = ABOUT_HERO_ROOMS.filter(
    (room, index, all) => all.findIndex((entry) => entry.spriteId === room.spriteId) === index,
  );
  const i = unique.findIndex((room) => room.spriteId === current);
  return unique[(i + 1) % unique.length]!;
}
