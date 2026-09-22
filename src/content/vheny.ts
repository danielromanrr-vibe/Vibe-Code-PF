/**
 * Vheny Diamonds copy — edit vheny.md. This file only loads it.
 */

import source from './vheny.md?raw';
import { parseCopyPage, sectionAt } from './loadCopy';

const page = parseCopyPage(source);
const captionSection = sectionAt(page, 0);

export const landing = {
  kicker: page.intro[0] ?? '',
  h1: page.h1,
  body: page.intro[1] ?? '',
  captions: {
    branding: captionSection.children[0]?.heading ?? '',
    product: captionSection.children[1]?.heading ?? '',
  },
};

const productSection = sectionAt(page, 1);
export const product = {
  h1: productSection.heading,
  contextH2: productSection.paras[0] ?? '',
};

const brandingSection = sectionAt(page, 2);
export const branding = {
  h1: brandingSection.heading,
  contextH2: brandingSection.paras[0] ?? '',
};
