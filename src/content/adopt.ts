/**
 * Adopt-a-School copy — edit adopt.md. This file only loads it.
 *
 * ## index matches page scroll:
 *   0 facts · 1 story · 2 system · 3 service + insights
 *   4 process · 5 outcomes · 6 final · 7 validation
 *   8 reflection · 9 closing
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

export type AdoptOverviewCard = {
  eyebrow: string;
  body: string;
  points: string[];
};

function overviewCard(child: CopyChunk): AdoptOverviewCard {
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

export type AdoptConstraintSection = {
  heading: string;
  body: string[];
};

export type AdoptConstraintLearnMore = {
  chapterId: 'definition';
  page: number;
};

export type AdoptConstraintCard = {
  id: string;
  title: string;
  supporting: string;
  sections: AdoptConstraintSection[];
  learnMore: AdoptConstraintLearnMore | null;
};

function constraintCard(child: CopyChunk, index: number): AdoptConstraintCard {
  const sections: AdoptConstraintSection[] = [];
  let current: AdoptConstraintSection | null = null;
  for (const para of child.paras.slice(1)) {
    const label = para.match(/^\*\*([^*]+)\*\*$/);
    if (label) {
      current = { heading: label[1]!.trim(), body: [] };
      sections.push(current);
      continue;
    }
    if (!current) continue;
    current.body.push(para);
  }
  const link = child.links.find((item) => item.href.startsWith('process:'));
  const parts = link?.href.split(':') ?? [];
  const page = Number(parts[2]);
  const learnMore: AdoptConstraintLearnMore | null =
    parts[1] === 'definition' && Number.isFinite(page)
      ? { chapterId: 'definition', page }
      : null;
  return {
    id: `adopt-constraint-${index + 1}`,
    title: child.heading,
    supporting: child.paras[0] ?? '',
    sections,
    learnMore,
  };
}

const systemSection = sectionAt(page, 2);
const systemWinsHeading = systemSection.children[0];
const systemWinsCards = systemSection.children.slice(1);
export const system = {
  h2: systemSection.heading,
  h2Lines: systemSection.headingLines,
  lede: systemSection.paras[0] ?? '',
  body: systemSection.paras.slice(1),
  wins: {
    h3: systemWinsHeading?.heading ?? 'Everyone wins with Adopt a School',
    cards: systemWinsCards.map((child) => ({
      eyebrow: child.headingLines[0] ?? child.heading,
      points: child.list.length > 0 ? child.list : child.paras.filter(Boolean),
    })),
  },
};

const endToEndSection = sectionAt(page, 3);
const endToEndPhysical = endToEndSection.children.find((child) =>
  child.heading.toLowerCase().includes('physical gateway'),
);
const endToEndDigital = endToEndSection.children.find((child) =>
  child.heading.toLowerCase().includes('digital experience'),
);
const insightChildren = endToEndSection.children.filter((child) =>
  child.headingLines[0]?.toLowerCase() === 'key insight',
);
const guardrails = insightChildren[0];
const signupHeading = endToEndSection.children.find((child) =>
  child.headingLines[0]?.toLowerCase().startsWith('what happens when you sign up'),
);
const volunteerPath = endToEndSection.children.find(
  (child) => child.headingLines[0]?.toLowerCase() === 'volunteer',
);
const businessPath = endToEndSection.children.find(
  (child) => child.headingLines[0]?.toLowerCase() === 'business',
);
const accordionChildren = endToEndSection.children.filter(
  (child) =>
    child !== endToEndPhysical &&
    child !== endToEndDigital &&
    child !== guardrails &&
    child !== signupHeading &&
    child !== volunteerPath &&
    child !== businessPath,
);

function insightBlock(child: CopyChunk | undefined) {
  return {
    eyebrow: child?.headingLines[0] ?? 'Key insight',
    heading: child?.headingLines[1] ?? child?.heading ?? '',
    body: child?.paras ?? [],
  };
}

export const endToEnd = {
  h2: endToEndSection.heading,
  h2Lines: endToEndSection.headingLines,
  body: endToEndSection.paras,
  physical: {
    h3: endToEndPhysical?.heading ?? 'The physical gateway',
    h3Lines: endToEndPhysical?.headingLines ?? ['The physical gateway'],
    body: endToEndPhysical?.paras ?? [],
    photo: {
      src: '/adopt-a-school/components-physical-apple.jpg',
      alt: '3D-printed Backpack Brigade apple on a café counter — SCAN ME leaf with a QR code to feed hungry kids.',
    },
  },
  digital: {
    h3: endToEndDigital?.heading ?? 'The digital experience',
    h3Lines: endToEndDigital?.headingLines ?? ['The digital experience'],
    body: endToEndDigital?.paras ?? [],
  },
  mockup: {
    src: '/adopt-a-school/screens---mobile-mockup.jpg',
    alt: 'Adopt-a-School mobile screens — onboarding, school map, and pledge flow across three phones.',
  },
  clips: [
    { id: '1230040054', caption: 'Onboarding', title: 'case-study-mobile2' },
    { id: '1230040055', caption: 'Select and support a school', title: 'case-study-mobile' },
    { id: '1230040053', caption: 'Pledge amount and checkout', title: 'case-study-mobile3' },
  ],
  desktopClip: {
    id: '1230040051',
    caption: 'Desktop map use',
    title: 'case-study-desktop',
  },
  signup: {
    h3: signupHeading?.heading ?? '',
    close: signupHeading?.paras[0] ?? '',
    rows: [
      { label: 'Volunteer', steps: volunteerPath?.list ?? [] },
      { label: 'Business', steps: businessPath?.list ?? [] },
    ],
  },
} as const;

export const strategic = {
  guardrails: insightBlock(guardrails),
  heading: 'Real world constraints & design',
  constraints: accordionChildren.map(constraintCard),
};

/** @deprecated Accordion replaced by the constraint bento. */
export const ADOPT_STRATEGIC_ITEMS = strategic.constraints.map((card) => ({
  id: card.id,
  title: card.title,
  content: [card.supporting, ...card.sections.flatMap((section) => [section.heading, ...section.body])]
    .filter(Boolean)
    .join('\n\n'),
}));

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

const learningsSection = sectionAt(page, 5);
export const keyLearnings = {
  h2: learningsSection.heading,
  lede: learningsSection.paras[0] ?? '',
  items: learningsSection.list,
  rows: learningsSection.children.map((child) => {
    const find = (prefix: string) =>
      child.list.find((line) => line.toLowerCase().startsWith(prefix));
    const before = find('before');
    const after = find('after');
    const split = (line: string | undefined) => {
      if (!line) return '';
      const at = line.indexOf(':');
      return at === -1 ? line : line.slice(at + 1).trim();
    };
    return {
      dimension: child.heading,
      before: split(before),
      after: split(after),
    };
  }),
};

const outcomeSection = sectionAt(page, 6);
export const finalOutcome = {
  h2: outcomeSection.heading,
  body: outcomeSection.paras[0] ?? '',
  impact: {
    h3: outcomeSection.children[0]?.heading ?? '',
    body: outcomeSection.children[0]?.paras ?? [],
  },
};

const validationSection = sectionAt(page, 7);
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

const reflectionSection = sectionAt(page, 8);
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

const closingSection = sectionAt(page, 9);
export const closing = {
  h2: closingSection.heading,
  body: closingSection.paras[0] ?? '',
};
