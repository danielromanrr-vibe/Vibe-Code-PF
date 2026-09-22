/**
 * Adopt-a-School copy — edit adopt.md. This file only loads it.
 */

import source from './adopt.md?raw';
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
  fields: {
    scope: { label: contextFields[0]?.heading ?? '', body: contextFields[0]?.paras[0] ?? '' },
    role: { label: contextFields[1]?.heading ?? '', body: contextFields[1]?.paras[0] ?? '' },
    client: { label: contextFields[2]?.heading ?? '', body: contextFields[2]?.paras[0] ?? '' },
    insight: { label: contextFields[3]?.heading ?? '', body: contextFields[3]?.paras[0] ?? '' },
    impact: { label: contextFields[4]?.heading ?? '', body: contextFields[4]?.list ?? [] },
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

const insightsSection = sectionAt(page, 3);
export const keyInsights = {
  h2: insightsSection.heading,
  body: insightsSection.paras,
};

const strategicSection = sectionAt(page, 4);
export const strategic = {
  h2: strategicSection.heading,
  lede: strategicSection.paras[0] ?? '',
};

const systemSection = sectionAt(page, 5);
export const system = {
  h2: systemSection.heading,
  lede: systemSection.paras[0] ?? '',
};

const endToEndSection = sectionAt(page, 6);
export const endToEnd = {
  h2: endToEndSection.heading,
  body: endToEndSection.paras,
  clips: [
    { id: '1229018251', caption: 'Onboarding', title: 'USER FLOW 1' },
    { id: '1229018249', caption: 'Selection', title: 'USER-FLOWS-2' },
    { id: '1229018250', caption: 'Completion', title: 'user-flow-3' },
  ],
} as const;

const edgeCasesSection = sectionAt(page, 7);
export const edgeCases = {
  h2: edgeCasesSection.heading,
  body: edgeCasesSection.paras,
};

const uxCopySection = sectionAt(page, 8);
export const uxCopy = {
  h2: uxCopySection.heading,
  body: uxCopySection.paras,
};

const learningsSection = sectionAt(page, 9);
export const keyLearnings = {
  h2: learningsSection.heading,
  body: learningsSection.paras,
};

const outcomeSection = sectionAt(page, 10);
export const finalOutcome = {
  h2: outcomeSection.heading,
  body: outcomeSection.paras[0] ?? '',
};

const validationSection = sectionAt(page, 11);
export const validation = {
  h2: validationSection.heading,
  physical: {
    h3: validationSection.children[0]?.heading ?? '',
    body: validationSection.children[0]?.paras[0] ?? '',
  },
  digital: {
    h3: validationSection.children[1]?.heading ?? '',
    body: validationSection.children[1]?.paras[0] ?? '',
  },
};

const reflectionSection = sectionAt(page, 12);
export const reflection = {
  h2: reflectionSection.heading,
  body: reflectionSection.paras,
  future: {
    h3: reflectionSection.children[0]?.heading ?? '',
    body: reflectionSection.children[0]?.paras ?? [],
  },
  impact: {
    h3: reflectionSection.children[1]?.heading ?? '',
    body: reflectionSection.children[1]?.paras ?? [],
  },
};

const closingSection = sectionAt(page, 13);
export const closing = {
  h2: closingSection.heading,
  body: closingSection.paras[0] ?? '',
};
