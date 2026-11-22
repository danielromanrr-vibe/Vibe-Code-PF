/**
 * Map-Aid coordination copy — edit driver.md. This file only loads it.
 *
 * ## index matches page scroll:
 *   0 facts · 1 story · 2 insights · 3 pipeline · 4 prototype
 *   5 process · 6 transformation · 7 closing
 *
 * Interactive Prototype (§4) contains the h3 Components of the system
 * and the three rows rendered under it.
 */

import source from './driver.md?raw';
import { parseCopyPage, sectionAt } from './loadCopy';

const page = parseCopyPage(source);

export const hero = {
  h1: page.h1,
  h1Lines: page.h1Lines,
  h3: page.subtitle,
  lede: '',
  body: page.intro,
  subheader: '',
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

function overviewCard(child: { headingLines: string[]; heading: string; paras: string[]; list: string[] }) {
  return {
    eyebrow: child.headingLines[0] ?? child.heading,
    body: child.paras.join('\n\n'),
    points: child.list,
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
  title: 'How routes get assigned today',
  lede: 'The weekly dispatch tool, recorded on the warehouse floor. Chapters jump to the friction.',
  videoId: '1234240563',
  videoTitle: "Hoyt's Tool — weekly dispatch workbook",
  chapters: [
    {
      at: 0,
      label: 'The weekly workbook, open on the warehouse floor',
      detail: 'The sheet that still runs the week, opened where the bags are packed.',
    },
    {
      at: 10,
      label: 'Juggling 90+ drivers on a static Sunday tab',
      detail: 'Ninety-plus names sit on one Sunday tab, and every change is typed by hand.',
    },
    {
      at: 20,
      label: 'Matching vehicle size to crate count by eye',
      detail: 'Which car can take the crates is decided by looking, with no capacity field to check.',
    },
    {
      at: 30,
      label: 'Placing the week on an available / confirmed board',
      detail: 'The week is sorted into who can drive and who is already confirmed.',
    },
    {
      at: 70,
      label: 'Driver rules that only exist as spreadsheet notes',
      detail: 'Who will say yes, and on which terms, lives only as notes in the sheet.',
    },
    {
      at: 90,
      label: 'Building the color-coded weekly report by hand',
      detail: 'Colors, schools, and counts are assembled by hand before a car can be loaded.',
    },
    {
      at: 210,
      label: 'The dock slip: bag colors, school, signature',
      detail: 'Bag colors, the school, and a signature leave the sheet and go to the loading bay.',
    },
  ],
} as const;

const insightsSection = sectionAt(page, 2);
export const systemInsights = {
  h2: insightsSection.heading,
  h2Lines: insightsSection.headingLines,
  lede: insightsSection.paras[0] ?? '',
  cards: insightsSection.children.map((child) => ({
    title: child.heading,
    body: child.paras[0] ?? '',
    quote: child.paras[1] ?? '',
  })),
};

const pipelineSection = sectionAt(page, 3);
const pipelineHandoff = pipelineSection.children.find((child) =>
  child.heading.toLowerCase().includes('handoff'),
);
const pipelineBody = pipelineSection.paras.slice(1);
export const pipeline = {
  h2: pipelineSection.heading,
  h2Lines: pipelineSection.headingLines,
  eyebrow: pipelineSection.paras[0] ?? '',
  intro: pipelineBody.length > 1 ? pipelineBody[0] ?? '' : '',
  close: pipelineBody.length > 1 ? pipelineBody[pipelineBody.length - 1] ?? '' : pipelineBody[0] ?? '',
  confirmLead: pipelineSection.list[0] ?? '',
  confirmPoints: pipelineSection.list.slice(1),
  stations: pipelineSection.children
    .filter((child) => child !== pipelineHandoff)
    .map((child) => ({
      label: child.heading,
      captions: child.paras,
    })),
};

const livePrototypeSection = sectionAt(page, 4);
const prototypeChildren = livePrototypeSection.children;
const componentsChild = prototypeChildren.find((child) => child.list.length === 0);
export const livePrototype = {
  h2: livePrototypeSection.heading,
  h2Lines: livePrototypeSection.headingLines,
  eyebrow: livePrototypeSection.paras[0] ?? '',
  componentsTitle: componentsChild?.heading ?? '',
  pillars: prototypeChildren
    .filter((child) => child.list.length > 0)
    .map((child) => ({
      title: child.heading,
      points: child.list,
    })),
};

const processSection = sectionAt(page, 5);
export const process = {
  h2: processSection.heading,
  h2Lines: processSection.headingLines,
  subheader: processSection.paras[0] ?? '',
  body: processSection.paras,
};

const transformationSection = sectionAt(page, 6);
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

const closingSection = sectionAt(page, 7);
export const closing = {
  h2: closingSection.heading,
  h2Lines: closingSection.headingLines,
  body: closingSection.paras,
};
