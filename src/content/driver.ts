/**
 * Map-Aid coordination copy — edit driver.md. This file only loads it.
 */

import source from './driver.md?raw';
import { parseCopyPage, sectionAt } from './loadCopy';

const page = parseCopyPage(source);

export const hero = {
  h1: page.h1,
  h1Lines: page.h1Lines,
  lede: page.intro[0] ?? '',
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
    body: child.paras[0] ?? '',
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

const insightsSection = sectionAt(page, 2);
const coordinatorQuotes = insightsSection.children.find((child) =>
  child.heading.toLowerCase().includes('coordinator said'),
);

export const systemInsights = {
  h2: insightsSection.heading,
  h2Lines: insightsSection.headingLines,
  cards: insightsSection.children
    .filter((child) => child !== coordinatorQuotes)
    .map((child) => ({
      h3: child.heading,
      h3Lines: child.headingLines,
      rows: child.list.map(labelled),
    })),
  quotes: {
    h3: coordinatorQuotes?.heading ?? '',
    items: (coordinatorQuotes?.list ?? []).map(labelled),
  },
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
