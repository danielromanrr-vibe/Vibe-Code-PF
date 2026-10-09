/**
 * Map-Aid coordination copy — edit driver.md. This file only loads it.
 *
 * ## index matches page scroll:
 *   0 facts · 1 story · 2 insights · 3 pipeline · 4 prototype
 *   5 process · 6 lifecycle · 7 transformation · 8 closing
 */

import source from './driver.md?raw';
import { parseCopyPage, sectionAt } from './loadCopy';

const page = parseCopyPage(source);

export const hero = {
  h1: page.h1,
  h1Lines: page.h1Lines,
  lede: page.intro[0] ?? '',
  body: page.intro.slice(1),
  subheader: page.intro[0] ?? '',
};

/** Shipped prototype display — featured in the middle of the case study, not the banner. */
export const prototypeDisplay = {
  id: '1230321952',
  title: 'Prototype-2-display',
  caption: 'Shipped Map-Aid prototype',
} as const;

/** Card rows are written as `Label: body` so the markdown still reads as prose. */
function labelled(line: string): { label: string; body: string } {
  const split = line.indexOf(':');
  if (split === -1) return { label: '', body: line };
  return { label: line.slice(0, split).trim(), body: line.slice(split + 1).trim() };
}

function overviewCard(child: { headingLines: string[]; heading: string; paras: string[] }) {
  return {
    eyebrow: child.headingLines[0] ?? child.heading,
    body: child.paras.join('\n\n'),
  };
}

const factsSection = sectionAt(page, 0);
const storySection = sectionAt(page, 1);

export const overview = {
  facts: {
    cards: factsSection.children.map(overviewCard),
  },
  story: {
    h3: storySection.heading,
    cards: storySection.children.map(overviewCard),
  },
};

/**
 * Annotated walkthrough of Hoyt’s warehouse workbook.
 * Lives here (not in driver.md) so a new ## does not shift later slots.
 */
export const hoytToolTour = {
  eyebrow: 'Before Map-Aid',
  title: 'Hoyt walks through the current workbook',
  lede: 'The weekly dispatch tool, recorded on the warehouse floor. Chapters jump to the friction.',
  videoId: '1234240563',
  videoTitle: "Hoyt's Tool — weekly dispatch workbook",
  chapters: [
    { at: 0, label: 'The weekly workbook, open on the warehouse floor' },
    { at: 10, label: 'Juggling 90+ drivers on a static Sunday tab' },
    { at: 20, label: 'Matching vehicle size to crate count by eye' },
    { at: 30, label: 'Placing the week on an available / confirmed board' },
    { at: 70, label: 'Driver rules that only exist as spreadsheet notes' },
    { at: 90, label: 'Building the color-coded weekly report by hand' },
    { at: 210, label: 'The dock slip: bag colors, school, signature' },
  ],
} as const;

const insightsSection = sectionAt(page, 2);
export const systemInsights = {
  h2: insightsSection.heading,
  h2Lines: insightsSection.headingLines,
  cards: insightsSection.children.map((child) => ({
    title: child.heading,
    eyebrow: child.paras[0] ?? '',
    body: child.paras[1] ?? '',
    quote: child.paras[2] ?? '',
  })),
};

const pipelineSection = sectionAt(page, 3);
const pipelineHandoff = pipelineSection.children.find((child) =>
  child.heading.toLowerCase().includes('handoff'),
);
export const pipeline = {
  h2: pipelineSection.heading,
  h2Lines: pipelineSection.headingLines,
  lede: pipelineSection.paras[0] ?? '',
  handoff: pipelineHandoff?.paras[0] ?? '',
  stations: pipelineSection.children
    .filter((child) => child !== pipelineHandoff)
    .map((child) => ({
      label: child.heading,
      title: child.paras[0] ?? '',
      window: child.paras[1] ?? '',
      body: child.paras[2] ?? child.paras.slice(1).join(' '),
    })),
};

const livePrototypeSection = sectionAt(page, 4);
export const livePrototype = {
  h2: livePrototypeSection.heading,
  h2Lines: livePrototypeSection.headingLines,
  lede: livePrototypeSection.paras[0] ?? '',
  openLabel: livePrototypeSection.paras[1] ?? 'Open full screen',
};

const processSection = sectionAt(page, 5);
export const process = {
  h2: processSection.heading,
  h2Lines: processSection.headingLines,
  subheader: processSection.paras[0] ?? '',
  body: processSection.paras,
};

const showcaseSection = sectionAt(page, 6);
export const showcase = {
  h2: showcaseSection.heading,
  h2Lines: showcaseSection.headingLines,
  lede: showcaseSection.paras[0] ?? '',
  phases: showcaseSection.children.map((child) => ({
    phase: child.headingLines[0] ?? child.heading,
    title: child.headingLines[1] ?? child.heading,
    body: child.paras,
    tokens: child.list,
  })),
};

const transformationSection = sectionAt(page, 7);
export const transformation = {
  h2: transformationSection.heading,
  h2Lines: transformationSection.headingLines,
  lede: transformationSection.paras[0] ?? '',
  rows: transformationSection.children.map((child) => {
    const find = (prefix: string) =>
      child.list.find((line) => line.toLowerCase().startsWith(prefix));
    const before = find('before');
    const after = find('after');
    return {
      dimension: child.heading,
      before: before ? labelled(before).body : '',
      after: after ? labelled(after).body : '',
    };
  }),
};

const closingSection = sectionAt(page, 8);
export const closing = {
  h2: closingSection.heading,
  h2Lines: closingSection.headingLines,
  body: closingSection.paras,
};
