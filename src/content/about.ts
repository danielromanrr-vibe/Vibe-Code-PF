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

const introSection = sectionAt(page, 0);
export const intro = {
  id: 'about-intro',
  h2: introSection.heading,
  body: introSection.paras[0] ?? '',
};

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
