import { TOUCHPOINTS_CONTEXT_METRICS, TOUCHPOINTS_SCOPE_ITEMS } from './touchpointsCaseStudy';

export const VHENY_LANDING_TITLE = 'Vheny Diamonds';

export const VHENY_LANDING_BODY =
  'Founding design inside a jewelry organization with a wide brief: brand language and product had to scale as one system, not two parallel tracks.';

export type VhenyWorkKind = 'product' | 'branding';

export const VHENY_COVERS = {
  branding: {
    src: '/vheny-diamonds/branding-cover.png',
    alt: 'Vheny Diamonds branding cover',
  },
  product: {
    src: '/vheny-diamonds/product-cover.jpg',
    alt: 'Vheny Diamonds product cover',
  },
} as const;

export type VhenyMediaItem = {
  type: 'image' | 'video';
  src: string;
  alt: string;
  scope: string;
};

export const VHENY_MINI: Record<VhenyWorkKind, readonly VhenyMediaItem[]> = {
  branding: [
    { type: 'video', src: '/vheny-diamonds/branding/homepage.mp4', alt: 'Vheny Diamonds marketing site in motion.', scope: 'Marketing site' },
    { type: 'image', src: '/vheny-diamonds/branding/magazine.jpg', alt: 'Editorial magazine spread.', scope: 'Editorial' },
    { type: 'image', src: '/vheny-diamonds/branding/poster.jpg', alt: 'Indoor brand poster.', scope: 'Environment' },
    { type: 'image', src: '/vheny-diamonds/branding/hero-1.png', alt: 'Brand still from the identity system.', scope: 'Identity' },
    { type: 'video', src: '/vheny-diamonds/branding/comp.mp4', alt: 'Brand film composition.', scope: 'Brand film' },
  ],
  product: [
    { type: 'image', src: '/vheny-diamonds/product/adding-item.png', alt: 'Designing the add-an-item flow.', scope: 'Stock management' },
    { type: 'video', src: '/vheny-diamonds/product/gems-buying.mov', alt: 'Gem buying product sequence.', scope: 'Contact management' },
    { type: 'video', src: '/vheny-diamonds/product/parcels.mp4', alt: 'Parcel and internal transaction flow.', scope: 'Internal stock transactions' },
    { type: 'image', src: '/vheny-diamonds/product/note-anatomy.png', alt: 'Note anatomy in the product UI.', scope: 'Ticket making' },
    { type: 'image', src: '/vheny-diamonds/product/web-mockup.gif', alt: 'Web experience presentation mockup.', scope: 'Communications' },
  ],
};

export const VHENY_WORK = {
  product: {
    title: 'Vheny Diamonds: Ops & Scale',
    bannerSrc: '/vheny-diamonds/product-cover.jpg',
    bannerAlt: 'Atlas CRM — diamond stock and contact operating system.',
    lede: 'Reusable UI patterns and interaction standards so the product could grow without fragmenting the purchase story.',
    role: 'Product designer / UX researcher',
    client: 'Vheny Diamonds',
    insight:
      'The product only scaled when interface patterns shared a language with the brand — not a separate UI kit.',
    impact: [
      'Daily active use 150 → 400+ by 2024; retention +24.62%.',
      'One framework for product, marketing, and web.',
    ],
    scopeIds: ['product', 'web'] as const,
    metricsLabel: 'Vheny Diamonds Atlas — project metrics',
  },
  branding: {
    title: 'Vheny Diamonds: Branding',
    bannerSrc: '/vheny-diamonds/magazine.jpg',
    bannerAlt: 'Vheny Diamonds editorial magazine spread.',
    lede: 'Visual language, type, and brand frame for a company-wide rebrand — one recognizable system as the business scaled.',
    role: 'Founding designer — brand identity',
    client: 'Vheny Diamonds',
    insight:
      'Brand, product, and web had to move as a single system. Separate refreshes split the purchase story.',
    impact: [
      'Shared foundations shortened cycles across marketing and product.',
      'Identity, interface patterns, and the site told the same discovery story.',
    ],
    scopeIds: ['brand'] as const,
    metricsLabel: 'Vheny Diamonds branding — project metrics',
  },
} as const;

export const VHENY_METRICS = TOUCHPOINTS_CONTEXT_METRICS;

export function vhenyScopeItems(kind: VhenyWorkKind) {
  const ids = new Set<string>(VHENY_WORK[kind].scopeIds);
  return TOUCHPOINTS_SCOPE_ITEMS.filter((item) => ids.has(item.id));
}
