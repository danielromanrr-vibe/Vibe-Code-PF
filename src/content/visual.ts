/**
 * Visual & Branding landing copy — edit visual.md. This file only loads it.
 */

import source from './visual.md?raw';
import { parseCopyPage } from './loadCopy';

const page = parseCopyPage(source);

export const hero = {
  h1Lines: page.h1Lines,
  h1: page.h1,
  subheader: page.intro[0] ?? '',
};

const GALLERY_ORDER = ['alexa', 'dbs', 'covantis', 'ajediam', 'kamau', 'spice'] as const;

export const gallery = page.sections.map((section, i) => ({
  id: GALLERY_ORDER[i] ?? section.heading,
  h2: section.heading,
}));
