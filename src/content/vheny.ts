/**
 * Vheny Diamonds copy — edit vheny.md. This file only loads it.
 */

import source from './vheny.md?raw';
import { parseCopyPage, sectionAt } from './loadCopy';

const page = parseCopyPage(source);

export const landing = {
  kicker: page.intro[0] ?? '',
  h1: page.h1,
  body: page.intro[1] ?? '',
  captions: {
    branding: 'Branding',
    product: 'Product design',
  },
};

function field(section: ReturnType<typeof sectionAt>, label: string): string {
  const child = section.children.find((item) => item.heading.toLowerCase() === label.toLowerCase());
  return child?.paras.join(' ') ?? '';
}

function workPage(section: ReturnType<typeof sectionAt>) {
  const scope = section.children.find((item) => item.heading.toLowerCase() === 'scope');
  const context = section.children.find((item) => item.heading.toLowerCase().includes('context'));
  const startingPoint = section.children.find((item) => {
    const heading = item.heading.toLowerCase();
    return heading === 'past iterations' || heading.startsWith('starting point');
  });
  const personasIntro = section.children.find((item) => item.heading.toLowerCase() === 'user personas');
  const tension = section.children.find((item) => item.heading.toLowerCase().includes('design tension'));
  const benchmark = section.children.find((item) => item.heading.toLowerCase() === 'benchmark case: diamtrade');
  const legacy = section.children.find((item) => item.heading.toLowerCase() === 'legacy industry benchmarks');
  const vision = section.children.find((item) => item.heading.toLowerCase() === 'the atlas system vision');
  const personas = section.children.flatMap((item) => {
    const match = item.heading.match(/^(.+),\s*(\d+)\s*$/);
    const [role, behavior, requirement, feature] = item.paras;
    if (!match || !role || !behavior || !requirement || !feature) return [];
    return [{ name: match[1]!, age: match[2]!, role, behavior, requirement, feature }];
  });
  const meta = (['Role', 'Timeline', 'Client', 'Focus'] as const)
    .map((label) => ({ label, body: field(section, label) }))
    .filter((item) => item.body);
  return {
    h1: section.heading,
    lede: section.paras[0] ?? '',
    overview: {
      h2: 'Project Overview',
      meta,
      problem: field(section, 'The Problem'),
      solution: field(section, 'The Solution'),
      impact: field(section, 'Key Impact'),
    },
    scope: {
      h2: scope?.heading ?? 'Scope',
      body: scope?.paras ?? [],
    },
    context: {
      h2: context?.heading ?? 'Context & Intro',
      body: context?.paras ?? [],
    },
    startingPoint: {
      eyebrow: 'Starting point',
      h3: startingPoint?.heading ?? '',
      body: startingPoint?.paras ?? [],
    },
    personas: {
      eyebrow: 'Starting point',
      h3: personasIntro?.heading ?? '',
      body: personasIntro?.paras ?? [],
      people: personas,
    },
    tension: {
      h3: tension?.heading ?? '',
      body: tension?.paras ?? [],
    },
    benchmark: {
      eyebrow: 'Research',
      h3: benchmark?.heading ?? '',
      body: benchmark?.paras ?? [],
      legacy: {
        h4: legacy?.heading ?? '',
        items: legacy?.list ?? [],
      },
      vision: {
        h4: vision?.heading ?? '',
        items: vision?.list ?? [],
      },
    },
  };
}

export const product = workPage(sectionAt(page, 0));
export const branding = workPage(sectionAt(page, 1));
