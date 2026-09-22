/**
 * Homepage copy — edit home.md. This file only loads it.
 */

import source from './home.md?raw';
import { parseCopyPage, parseInlineLinks, sectionAt, type RichTextPart } from './loadCopy';

const page = parseCopyPage(source);
const [h1Name = '', h1RoleLead = '', h1RoleRest = '', h1Line2 = ''] = page.h1Lines;

export const hero = {
  h1: page.h1,
  h1Name,
  h1RoleLead,
  h1RoleRest,
  h1Line2,
  h2: page.intro[0] ?? '',
};

const CASE_STUDY_TOC = [
  { targetId: 'case-study-ngo-heading' },
  { targetId: 'case-study-driver-heading' },
  { targetId: 'vheny-heading' },
] as const;

const chapterSection = sectionAt(page, 0);
export const caseStudiesChapter = {
  h2: chapterSection.heading,
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
  return {
    industry: block.paras[0] ?? '',
    discipline: block.paras[1] ?? '',
    h2: block.heading,
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
export const teamWork = {
  chapterH2: teamSection.heading,
  industry: teamSection.paras[0] ?? '',
  discipline: '',
  h2: teamSection.paras[1] ?? '',
  lede: teamSection.paras[2] ?? '',
  cta: teamSection.paras[3] ?? '',
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
  body: thinkingSection.paras[0] ?? '',
};

export type HomeThinkingEvidence = RichTextPart[];

export type HomeThinkingCardCopy = {
  id: string;
  eyebrow: string;
  title: string;
  statement: string;
  evidence: HomeThinkingEvidence[];
};

const thinkingCardIds = [
  'challenge-assumptions',
  'navigate-ambiguity',
  'connect-the-dots',
  'system-not-screen',
] as const;

export const thinkingCards: HomeThinkingCardCopy[] = thinkingSection.children.map((card, i) => ({
  id: thinkingCardIds[i] ?? card.heading,
  eyebrow: card.paras[0] ?? '',
  title: card.heading,
  statement: card.paras[1] ?? '',
  evidence: card.paras.slice(2).map(parseInlineLinks),
}));
