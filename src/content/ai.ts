/**
 * Designing with AI copy — edit ai.md. This file only loads it.
 */

import source from './ai.md?raw';
import { parseCopyPage } from './loadCopy';

const page = parseCopyPage(source);

export const hero = {
  h1: page.h1,
};

export const sections = page.sections.map((section) => ({
  h2: section.heading,
  body: section.paras.length <= 1 ? (section.paras[0] ?? '') : section.paras,
}));
