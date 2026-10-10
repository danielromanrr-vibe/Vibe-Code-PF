/**
 * Homepage copy — edit home.md. This file only loads it.
 */

import source from './home.md?raw';
import { parseCopyPage, sectionAt } from './loadCopy';

const page = parseCopyPage(source);
const [h1Name = '', h1RoleLead = '', h1RoleRest = '', h1Line2 = ''] = page.h1Lines;

export const hero = {
  h1: page.h1,
  h1Name,
  h1RoleLead,
  h1RoleRest,
  h1Line2,
  tags: (page.intro[0] ?? '')
    .split('\n')
    .map((tag) => tag.trim())
    .filter(Boolean),
  h2: page.intro[1] ?? '',
};

const CASE_STUDY_TOC = [
  { targetId: 'case-study-ngo-heading' },
  { targetId: 'case-study-driver-heading' },
  { targetId: 'vheny-heading' },
] as const;

function headingPair(headingLines: string[], fallback: string) {
  const title = headingLines[0] ?? fallback;
  const kicker = headingLines[1] ?? '';
  return { title, kicker };
}

const chapterSection = sectionAt(page, 0);
const caseStudiesMarker = headingPair(chapterSection.headingLines, chapterSection.heading);
export const caseStudiesChapter = {
  h2: caseStudiesMarker.title,
  kicker: caseStudiesMarker.kicker,
  toc: (chapterSection.paras[0] ?? '')
    .split('\n')
    .map((label, i) => ({
      targetId: CASE_STUDY_TOC[i]?.targetId ?? '',
      label,
    }))
    .filter((item) => item.label && item.targetId),
};

function caseStudy(index: number) {
  const block = sectionAt(page, index);
  const pair = headingPair(block.headingLines, block.heading);
  return {
    industry: block.paras[0] ?? '',
    discipline: block.paras[1] ?? '',
    h2: pair.title,
    subhead: pair.kicker,
    lede: block.paras[2] ?? '',
    cta: block.paras[3] ?? '',
  };
}

export const caseStudies = {
  adopt: caseStudy(1),
  driver: caseStudy(2),
  vheny: caseStudy(3),
};

const teamSection = sectionAt(page, 4);
const teamMarker = headingPair(teamSection.headingLines, teamSection.heading);
export const teamWork = {
  chapterH2: teamMarker.title,
  chapterKicker: teamMarker.kicker,
  industry: teamSection.paras[0] ?? '',
  discipline: '',
  h2: teamSection.paras[1] ?? '',
  lede: teamSection.paras[2] ?? '',
  cta: teamSection.paras[3] ?? '',
  captions: {
    amazon: teamSection.paras[4] ?? '',
    ajediam: teamSection.paras[5] ?? '',
    covantis: teamSection.paras[6] ?? '',
  },
};

const aboutSection = sectionAt(page, 5);
export const aboutMe = {
  chapterH2: aboutSection.heading,
  h2: aboutSection.paras[0] ?? '',
  body: aboutSection.paras[1] ?? '',
  cta: aboutSection.paras[2] ?? '',
};

const thinkingSection = sectionAt(page, 6);
export const thinking = {
  h2: thinkingSection.heading,
};

export type HomeThinkingNote = {
  id: string;
  title: string;
  example: string;
  linkLabel: string;
  linkHref: string;
};

const thinkingNoteIds = [
  'challenge-assumptions',
  'navigate-ambiguity',
  'connect-the-dots',
  'system-not-screen',
] as const;

export const thinkingNotes: HomeThinkingNote[] = thinkingSection.children.map((note, i) => ({
  id: thinkingNoteIds[i] ?? note.heading,
  title: note.heading,
  example: note.paras[0] ?? '',
  linkLabel: note.links[0]?.label ?? '',
  linkHref: note.links[0]?.href ?? '',
}));

const availabilitySection = sectionAt(page, 7);
export const footerAvailability = availabilitySection.paras[0] ?? '';
