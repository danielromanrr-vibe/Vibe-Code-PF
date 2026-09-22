/**
 * Site-wide copy — chrome that repeats on every page.
 * Edit site.md. This file only loads it.
 */

import source from './site.md?raw';
import { parseCopyPage } from './loadCopy';

const page = parseCopyPage(source);
const [navLines = [], tickerLines = [], footerLines = [], contextLines = []] = page.groups;

export const documentTitles = {
  home: 'Daniel Román — Product Designer',
  about: 'About — Daniel Román',
  cv: 'CV — Daniel Román',
  adopt: 'Adopt-a-School — Daniel Román',
  driver: 'Driver coordination — Daniel Román',
  vhenyProduct: 'Vheny Diamonds · Ops & Scale — Daniel Román',
  vhenyBranding: 'Vheny Diamonds · Branding — Daniel Román',
  visual: 'Visual design — Daniel Román',
  ai: 'Designing with AI — Daniel Román',
};

export const nav = {
  product: navLines[0] ?? '',
  visualBranding: navLines[1] ?? '',
  about: navLines[2] ?? '',
};

export const ticker = tickerLines;

const footerTel = footerLines[1] ?? '';
const footerEmail = footerLines[2] ?? '';

export const footer = {
  h3: footerLines[0] ?? '',
  telLabel: footerTel.split(/\s+/)[0] ?? 'Tel',
  tel: footerTel.replace(/^Tel\s+/, ''),
  telHref: 'tel:+12067711518',
  emailLabel: footerEmail.split(/\s+/)[0] ?? 'Email',
  email: footerEmail.replace(/^Email\s+/, ''),
  emailHref: 'mailto:hello@danielroman.design',
  linkedinHref: 'https://www.linkedin.com/in/daniel-roman-design',
  linkedinLabel: footerLines[3] ?? 'LinkedIn',
  legal: footerLines[4] ?? '',
};

/** Shared case-study / visual-work section title (always an H2). */
export const contextIntroH2 = contextLines[0] ?? 'Context & Intro';
