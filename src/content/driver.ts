/**
 * Driver coordination copy — edit driver.md. This file only loads it.
 */

import source from './driver.md?raw';
import { parseCopyPage, sectionAt } from './loadCopy';

const page = parseCopyPage(source);

export const hero = {
  h1: page.h1,
  subheader: page.intro[0] ?? '',
};

const contextSection = sectionAt(page, 0);
const contextFields = contextSection.children;
export const context = {
  h2: contextSection.heading,
  lede: contextSection.paras[0] ?? '',
  fields: {
    role: { label: contextFields[0]?.heading ?? '', body: contextFields[0]?.paras[0] ?? '' },
    client: { label: contextFields[1]?.heading ?? '', body: contextFields[1]?.paras[0] ?? '' },
    insight: { label: contextFields[2]?.heading ?? '', body: contextFields[2]?.paras[0] ?? '' },
    impact: { label: contextFields[3]?.heading ?? '', body: contextFields[3]?.list ?? [] },
  },
};

const beforeSection = sectionAt(page, 1);
export const beforeAfter = {
  h2: beforeSection.heading,
  body: beforeSection.paras,
};

const processSection = sectionAt(page, 2);
export const process = {
  h2: processSection.heading,
  subheader: processSection.paras[0] ?? '',
};

const notesSection = sectionAt(page, 3);
export const validationNotes = {
  h2: notesSection.heading,
  body: notesSection.paras,
  quotes: notesSection.children.map((item) => ({
    h3: item.heading,
    body: item.paras[0] ?? '',
  })),
};

const mapSection = sectionAt(page, 4);
export const mapIsTheProduct = {
  h2: mapSection.heading,
  body: mapSection.paras,
};

const whereSection = sectionAt(page, 5);
export const whereWeAre = {
  h2: whereSection.heading,
  body: whereSection.paras,
};
