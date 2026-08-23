import type { ContextMetric } from './adoptCaseStudy';

export const TOUCHPOINTS_CASE_STUDY_LEDE =
  'B2C jewelry; founding design for brand identity, product UI, and web as one framework during a company-wide rebrand and product scale-up.';

export const TOUCHPOINTS_CONTEXT_METRICS: readonly ContextMetric[] = [
  { stat: '400+', context: 'Daily active use', label: 'Up from ~150 after brand and product redesign' },
  { stat: '+24.62%', context: 'Retention', label: 'Average user retention lift by 2024' },
  { stat: '3', context: 'Unified surfaces', label: 'Brand, product UI, and web on one framework' },
  { stat: '1', context: 'Design system', label: 'Shared foundations across marketing and product' },
];

export const TOUCHPOINTS_SCOPE_ITEMS = [
  {
    id: 'brand',
    eyebrow: 'Brand identity',
    body: 'Visual language, type, and brand frame for the company-wide rebrand—one recognizable system as Ajediam scaled.',
    imageSrc: '/ajediam/hero-custom-1.png',
  },
  {
    id: 'product',
    eyebrow: 'Product UI',
    body: 'Reusable UI patterns and interaction standards so the product could grow without fragmenting experience.',
    imageSrc: '/ajediam/hero-2.png',
  },
  {
    id: 'web',
    eyebrow: 'Web experience',
    body: 'Marketing site and editorial surfaces aligned with product story—discovery and purchase as one narrative.',
    imageSrc: '/ajediam/homepage-branding.png',
  },
] as const;
