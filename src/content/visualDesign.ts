export const VISUAL_LANDING_TITLE = 'Visual & UX/UI design';

export const VISUAL_LANDING_BODY =
  'Cross-functional work spanning product, campaign, and brand surfaces — including Amazon Alexa+, Amazon DBS, and Covantis (Deluxe, ABCD agri-tech).';

export const VISUAL_HOME_INDUSTRY = 'Branding • UX/UI • Visual design';

export const VISUAL_HOME_DISCIPLINE = '';

export const VISUAL_HOME_TITLE = 'Visual & UX/UI design';

export const VISUAL_HOME_BODY_ITEMS = [
  'Working in high-stakes environments, collaborating with stakeholders across different stages of the product lifecycle.',
  'Work spanning agri-tech — **Covantis**, a conglomerate born from Bunge, Cargill, and Louis Dreyfus Company (LDC) — and **Amazon**.',
  'Freelance design across different industries.',
] as const;

export type VisualWorkKind = 'alexa' | 'dbs' | 'covantis' | 'kamau' | 'spice' | 'ajediam';

/** Plate index label in the media viewer — not project scope. */
export type VisualMediaItem = {
  src: string;
  alt: string;
  label: string;
};

/**
 * Project brief — one set per work, independent of media plates.
 * Grid hover teases Role / Scope / Impact; modal rail shows all three.
 */
export type VisualWorkBody = {
  id: VisualWorkKind;
  title: string;
  coverSrc: string;
  coverAlt: string;
  role: string;
  scope: string;
  impact: string;
  media: readonly VisualMediaItem[];
  hrefRoute?: 'vhenyBranding';
};

export const VISUAL_WORK: Record<VisualWorkKind, VisualWorkBody> = {
  alexa: {
    id: 'alexa',
    title: 'Amazon Alexa+',
    coverSrc: '/visual-design/minigrid/alexa.jpg',
    coverAlt: 'Alexa+ feature page',
    role: 'Visual & UX/UI design on feature, conversation, and device surfaces.',
    scope:
      'Designed feature pages, conversational UI patterns, and companion device treatments that had to read as one Alexa+ system.',
    impact:
      'A coherent visual language across marketing pages, conversational UI, and device touchpoints — scannable for recruiters, rigorous for product partners.',
    media: [
      { src: '/home/teams/alexa-1.jpg', alt: 'Alexa+ for Kids — feature page', label: 'Feature page' },
      { src: '/home/teams/alexa-2.jpg', alt: 'Alexa+ — conversational UI patterns', label: 'Conversational UI' },
      { src: '/home/teams/alexa-3.jpg', alt: 'Alexa+ — device and companion surfaces', label: 'Device surfaces' },
    ],
  },
  dbs: {
    id: 'dbs',
    title: 'Amazon DBS',
    coverSrc: '/visual-design/minigrid/dbs.jpg',
    coverAlt: 'Amazon DBS storefront placements',
    role: 'Visual design for storefront and campaign placements at DBS.',
    scope:
      'Partnered with PMs, marketing, and engineering on storefront placements, traffic variants, and seasonal rollouts under tight production timelines.',
    impact:
      'Faster campaign production with templates and style guides that held quality across formats — including Prime Day and Big Deal Days.',
    media: [
      {
        src: '/home/teams/dbs-1.jpg',
        alt: 'Amazon storefront — desktop and mobile deal placements',
        label: 'Storefront placements',
      },
      {
        src: '/home/teams/dbs-2.jpg',
        alt: 'Campaign creative — traffic placement variants',
        label: 'Traffic variants',
      },
      {
        src: '/home/teams/dbs-3.jpg',
        alt: 'Seasonal campaign — cross-format rollout',
        label: 'Seasonal rollout',
      },
    ],
  },
  covantis: {
    id: 'covantis',
    title: 'Covantis',
    coverSrc: '/visual-design/minigrid/covantis.jpg',
    coverAlt: 'Covantis product landing',
    role: 'Brand and product visual design for Covantis (Deluxe / ABCD).',
    scope:
      'Built product landing and platform narrative surfaces so brand, site, and product story could read as one agri-tech system.',
    impact:
      'A clearer public face for a complex B2B platform — one visual system instead of fragmented campaign and product languages.',
    media: [
      { src: '/home/teams/covantis-1.jpg', alt: 'circleOut — product landing', label: 'Product landing' },
      { src: '/home/teams/covantis-2.jpg', alt: 'Covantis — platform narrative', label: 'Platform narrative' },
    ],
  },
  kamau: {
    id: 'kamau',
    title: 'Kamau',
    coverSrc: '/visual-design/minigrid/kamau.png',
    coverAlt: 'Kamau identity mark',
    role: 'Brand identity — mark and urban applications.',
    scope: 'Designed the identity mark and urban poster treatments for a singular, high-contrast brand presence.',
    impact: 'A mark with poster-scale clarity — readable at distance, distinctive at close range.',
    media: [
      { src: '/visual-design/minigrid/kamau.png', alt: 'Kamau identity mark', label: 'Identity mark' },
    ],
  },
  spice: {
    id: 'spice',
    title: 'Spice Angel',
    coverSrc: '/visual-design/minigrid/spice-angel.jpg',
    coverAlt: 'Spice Angel packaging',
    role: 'Packaging and brand photography.',
    scope: 'Designed product packaging and still photography so the object and the image system stayed in register.',
    impact: 'Shelf-ready packaging with photographic consistency across the line.',
    media: [
      { src: '/visual-design/minigrid/spice-angel.jpg', alt: 'Spice Angel packaging', label: 'Packaging' },
    ],
  },
  ajediam: {
    id: 'ajediam',
    title: 'Ajediam',
    coverSrc: '/visual-design/minigrid/ajediam.png',
    coverAlt: 'Ajediam / Vheny Diamonds branding',
    role: 'Founding designer — brand identity for Ajediam / Vheny Diamonds.',
    scope: 'Identity, editorial, and brand film — the system from mark through motion.',
    impact: 'A complete brand foundation that carries from print and digital into product storytelling.',
    media: [],
    hrefRoute: 'vhenyBranding',
  },
};

export const VISUAL_LANDING_GRID = (['alexa', 'dbs', 'covantis', 'kamau', 'spice', 'ajediam'] as const).map(
  (id) => VISUAL_WORK[id],
);

export type VisualLandingCompose = 'lead' | 'support';

export type VisualLandingSection = {
  id: 'tech' | 'branding';
  labelId: string;
  /** Matches homepage `HomeChapterLabel` field drawings. */
  field: 'team' | 'about';
  title: string;
  items: readonly {
    work: VisualWorkBody;
    compose: VisualLandingCompose;
  }[];
};

/** Same lead + pair rhythm in both sections; Ajediam is the branding opener. */
export const VISUAL_LANDING_SECTIONS: readonly VisualLandingSection[] = [
  {
    id: 'tech',
    labelId: 'visual-chapter-tech',
    field: 'team',
    title: 'Cross-functional teams in tech',
    items: [
      { work: VISUAL_WORK.alexa, compose: 'lead' },
      { work: VISUAL_WORK.dbs, compose: 'support' },
      { work: VISUAL_WORK.covantis, compose: 'support' },
    ],
  },
  {
    id: 'branding',
    labelId: 'visual-chapter-branding',
    field: 'about',
    title: 'Branding focused solo work',
    items: [
      { work: VISUAL_WORK.ajediam, compose: 'lead' },
      { work: VISUAL_WORK.kamau, compose: 'support' },
      { work: VISUAL_WORK.spice, compose: 'support' },
    ],
  },
];

export const VISUAL_HOME_TEASER_SLIDES = [
  { image: '/home/teams/alexa-1.jpg', alt: 'Alexa+ for Kids — feature page', caption: 'Amazon Alexa+' },
  { image: '/home/teams/alexa-2.jpg', alt: 'Alexa+ — conversational UI patterns', caption: 'Conversational UI' },
  { image: '/home/teams/alexa-3.jpg', alt: 'Alexa+ — device and companion surfaces', caption: 'Device surfaces' },
  { image: '/home/teams/dbs-1.jpg', alt: 'Amazon storefront — desktop and mobile deal placements', caption: 'Amazon DBS' },
  { image: '/home/teams/dbs-2.jpg', alt: 'Campaign creative — traffic placement variants', caption: 'Traffic variants' },
  { image: '/home/teams/dbs-3.jpg', alt: 'Seasonal campaign — cross-format rollout', caption: 'Seasonal rollout' },
  { image: '/home/teams/covantis-1.jpg', alt: 'circleOut — product landing', caption: 'Covantis' },
  { image: '/home/teams/covantis-2.jpg', alt: 'Covantis — platform narrative', caption: 'Platform narrative' },
] as const;
