import type { MandalaSpriteId } from '../lib/mandalaSprite';
import { MANDALA_SPRITE_IDS } from '../lib/mandalaSprite';
import { intro, rooms } from './about';

export type AboutStoryRoom = {
  spriteId: MandalaSpriteId;
  id: string;
  kicker: string;
  title: string;
  paragraphs: readonly string[];
  aside: string;
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
  id: intro.id,
  title: intro.h2,
  body: intro.body,
};

export const ABOUT_HERO_ROOMS: readonly AboutStoryRoom[] = rooms.map((room) => ({
  spriteId: room.spriteId,
  id: room.id,
  kicker: room.kicker,
  title: room.h2,
  paragraphs: room.body,
  aside: room.aside,
}));

export const ABOUT_STORY_ROOMS = ABOUT_HERO_ROOMS;

export function storyRoomBySprite(id: MandalaSpriteId): AboutStoryRoom | undefined {
  return ABOUT_HERO_ROOMS.find((room) => room.spriteId === id) ?? ABOUT_HERO_ROOMS[0];
}

export function nextAboutStoryRoom(current: MandalaSpriteId): AboutStoryRoom {
  const i = MANDALA_SPRITE_IDS.indexOf(current);
  const nextId = MANDALA_SPRITE_IDS[(i + 1) % MANDALA_SPRITE_IDS.length] ?? 'euphoria';
  return storyRoomBySprite(nextId) ?? {
    spriteId: nextId,
    id: intro.id,
    kicker: '',
    title: intro.h2,
    paragraphs: [intro.body],
    aside: '',
  };
}
