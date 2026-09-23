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

function contextField(label: string): string {
  const field = contextSection.children.find((child) => child.heading.toLowerCase() === label.toLowerCase());
  return field?.paras.join(' ') ?? '';
}

export const context = {
  h2: contextSection.heading,
  role: contextField('Role'),
  timeline: contextField('Timeline'),
  focus: contextField('Focus'),
  problem: contextField('The Problem'),
  solution: contextField('The Solution'),
  impact: contextField('Key Impact'),
};

const scopeSection = sectionAt(page, 1);
export const scope = {
  h2: scopeSection.heading,
  items: scopeSection.list,
};

const beforeSection = sectionAt(page, 2);
export const beforeAfter = {
  h2: beforeSection.heading,
  body: beforeSection.paras,
};

const processSection = sectionAt(page, 3);
export const process = {
  h2: processSection.heading,
  subheader: processSection.paras[0] ?? '',
};

const notesSection = sectionAt(page, 4);
export const validationNotes = {
  h2: notesSection.heading,
  body: notesSection.paras,
  quotes: notesSection.children.map((item) => ({
    h3: item.heading,
    body: item.paras[0] ?? '',
  })),
};

const mapSection = sectionAt(page, 5);
export const mapIsTheProduct = {
  h2: mapSection.heading,
  body: mapSection.paras,
};

const whereSection = sectionAt(page, 6);
export const whereWeAre = {
  h2: whereSection.heading,
  body: whereSection.paras,
};
