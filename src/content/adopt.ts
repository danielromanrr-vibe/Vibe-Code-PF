/**
 * Adopt-a-School copy — edit adopt.md. This file only loads it.
 *
 * ## index in adopt.md (not the on-page order — App.tsx reorders these):
 *   0 project overview · 1 context · 2 before/after · 3 pivotal moments
 *   4 process (+ glance + chapters/pages + key insights) · 5 system
 *   6 end-to-end · 7 ux copy · 8 outcomes · 9 final outcome
 *   10 validation · 11 reflection · 12 closing
 */

import source from './adopt.md?raw';
import { parseCopyPage, sectionAt, type CopyChunk } from './loadCopy';

type ProcessOverviewChapterId = 'research' | 'definition' | 'rapid-prototyping' | 'validation';
type PrototypeTrack = 'digital' | 'physical';

const page = parseCopyPage(source);

export const hero = {
  h1: page.h1,
  subtitle: page.subtitle,
  lede: page.intro[0] ?? '',
};

export type AdoptContextField = {
  label: string;
  body: string;
  items: string[];
};

function contextField(chunk: CopyChunk | undefined): AdoptContextField {
  return {
    label: chunk?.heading ?? '',
    body: chunk?.paras[0] ?? '',
    items: chunk?.list ?? [],
  };
}

const overviewSection = sectionAt(page, 0);

function overviewField(label: string): string {
  const field = overviewSection.children.find((child) => child.heading.toLowerCase() === label.toLowerCase());
  return field?.paras[0] ?? '';
}

export const overview = {
  h2: overviewSection.heading,
  role: overviewField('Role'),
  timeline: overviewField('Timeline'),
  focus: overviewField('Focus'),
  problem: overviewField('The Problem'),
  solution: overviewField('The Solution'),
  impact: overviewField('Key Impact'),
};

const contextSection = sectionAt(page, 1);
export const context = {
  h2: contextSection.heading,
  fields: contextSection.children.map((child) => contextField(child)),
};

const scopeField = context.fields.find((field) => field.label.toLowerCase() === 'scope');
export const scope = {
  h2: scopeField?.label ?? '',
  items: scopeField?.items ?? [],
};

const beforeSection = sectionAt(page, 2);
export const beforeAfter = {
  h2: beforeSection.heading,
  subhead: beforeSection.paras[0] ?? '',
  body: beforeSection.paras.slice(1),
};

export type AdoptAccordionItem = {
  id: string;
  title: string;
  content: string;
};

const strategicSection = sectionAt(page, 3);
const ambient = strategicSection.children[0];
const navigating = strategicSection.children[1];
const accordionChildren = strategicSection.children.slice(2);

export const strategic = {
  h2: strategicSection.heading,
  h2Lines: strategicSection.headingLines,
  ambient: {
    heading: ambient?.heading ?? '',
    body: ambient?.paras ?? [],
  },
  navigating: {
    heading: navigating?.heading ?? '',
    lede: navigating?.paras[0] ?? '',
    items: accordionChildren.map((child, index): AdoptAccordionItem => ({
      id: `adopt-tradeoff-${index + 1}`,
      title: child.heading,
      content: child.paras.join('\n\n'),
    })),
  },
};

/** Accordion rows — sourced from adopt.md under Navigating ambiguity. */
export const ADOPT_STRATEGIC_ITEMS = strategic.navigating.items;

const CHAPTER_IDS: ProcessOverviewChapterId[] = ['research', 'definition', 'rapid-prototyping'];

export type AdoptProcessPageCopy = {
  chapter: number;
  page: number;
  title: string;
  track?: PrototypeTrack;
  shift: string;
  body: string;
};

export type AdoptProcessChapterCopy = {
  id: ProcessOverviewChapterId;
  number: number;
  label: string;
  thesis: string;
  pages: AdoptProcessPageCopy[];
};

const processSection = sectionAt(page, 4);

const CHAPTER_RE = /^Chapter\s+(\d+)\s+·\s+(.+)$/i;
const PAGE_RE = /^(\d+)\.(\d+)\s+(.+?)(?:\s+·\s+(Digital|Physical))?$/i;

function parseProcessFromChildren(children: CopyChunk[]): {
  chapters: AdoptProcessChapterCopy[];
  insights: { heading: string; body: string[] } | null;
  glance: { label: string; body: string }[];
} {
  const chapters: AdoptProcessChapterCopy[] = [];
  const glance: { label: string; body: string }[] = [];
  let insights: { heading: string; body: string[] } | null = null;
  let current: AdoptProcessChapterCopy | null = null;

  for (const child of children) {
    const glanceMatch = child.heading.match(/^At a glance\s+·\s+(.+)$/i);
    if (glanceMatch && !current) {
      glance.push({ label: glanceMatch[1]!.trim(), body: child.paras[0] ?? '' });
      continue;
    }
    const chapterMatch = child.heading.match(CHAPTER_RE);
    if (chapterMatch) {
      const number = Number(chapterMatch[1]);
      const label = chapterMatch[2]!.trim();
      current = {
        id: CHAPTER_IDS[number - 1] ?? 'research',
        number,
        label,
        thesis: child.paras[0] ?? '',
        pages: [],
      };
      chapters.push(current);
      continue;
    }

    const pageMatch = child.heading.match(PAGE_RE);
    if (pageMatch && current) {
      const trackRaw = pageMatch[4]?.toLowerCase();
      const track: PrototypeTrack | undefined =
        trackRaw === 'digital' || trackRaw === 'physical' ? trackRaw : undefined;
      current.pages.push({
        chapter: Number(pageMatch[1]),
        page: Number(pageMatch[2]),
        title: pageMatch[3]!.trim(),
        track,
        shift: child.paras[0] ?? '',
        body: child.paras.slice(1).join('\n\n') || (child.paras[0] ?? ''),
      });
      continue;
    }

    if (/key insights/i.test(child.heading)) {
      insights = { heading: child.heading, body: child.paras };
    }
  }

  return { chapters, insights, glance };
}

const parsedProcess = parseProcessFromChildren(processSection.children);

export const process = {
  h2: processSection.heading,
  body: processSection.paras,
  glance: parsedProcess.glance,
  chapters: parsedProcess.chapters,
};

export const keyInsights = {
  heading: parsedProcess.insights?.heading ?? '',
  body: parsedProcess.insights?.body ?? [],
};

const systemSection = sectionAt(page, 5);
export const system = {
  h2: systemSection.heading,
  lede: systemSection.paras[0] ?? '',
  body: systemSection.paras.slice(1),
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

const uxCopySection = sectionAt(page, 7);
export const uxCopy = {
  h2: uxCopySection.heading,
  subhead: uxCopySection.paras[0] ?? '',
  body: uxCopySection.paras.slice(1),
};

const learningsSection = sectionAt(page, 8);
export const keyLearnings = {
  h2: learningsSection.heading,
  body: learningsSection.paras,
  items: learningsSection.list,
};

const outcomeSection = sectionAt(page, 9);
export const finalOutcome = {
  h2: outcomeSection.heading,
  body: outcomeSection.paras[0] ?? '',
};

const validationSection = sectionAt(page, 10);
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

const reflectionSection = sectionAt(page, 11);
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

const closingSection = sectionAt(page, 12);
export const closing = {
  h2: closingSection.heading,
  body: closingSection.paras[0] ?? '',
};
