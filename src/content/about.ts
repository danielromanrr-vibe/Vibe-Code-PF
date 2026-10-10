/**
 * About copy — edit about.md. This file only loads it.
 */

import source from './about.md?raw';
import { parseCopyPage, sectionAt } from './loadCopy';

const page = parseCopyPage(source);

export const hero = {
  h1: page.h1,
  h1Lines: page.h1Lines,
};

export const intro = {
  id: 'about-intro',
  h2: '',
  body: page.intro[0] ?? '',
};

const asideSection = sectionAt(page, 0);

export type AboutAside = {
  id: string;
  front: string[];
  items: string[];
  kind: 'title' | 'list';
};

const asideIds = ['explorer', 'strengths', 'likes', 'principles'] as const;

export const asides: AboutAside[] = asideSection.children.slice(0, asideIds.length).map((child, index) => ({
  id: asideIds[index] ?? `aside-${index}`,
  front: child.headingLines.filter(Boolean),
  items: child.list.length > 0 ? child.list : child.paras.filter(Boolean),
  kind: child.list.length > 0 ? 'list' : 'title',
}));

/** @deprecated Scroll rooms are gone; kept so older adapters still compile. */
export const rooms = [
  {
    id: intro.id,
    spriteId: 'euphoria' as const,
    kicker: '',
    h2: intro.h2,
    body: [intro.body],
    aside: '',
  },
];

export const principles = {
  h2: intro.h2,
  body: intro.body,
};
