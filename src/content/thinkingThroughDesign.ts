import { aboutMe, thinking, thinkingCards } from './home';

export type ThinkingRefAction =
  | { type: 'open-adopt' }
  | { type: 'open-driver' }
  | { type: 'open-ai' }
  | { type: 'open-touchpoints' };

export type ThinkingLedeSegment =
  | { kind: 'text'; value: string }
  | { kind: 'ref'; label: string; action: ThinkingRefAction }
  | { kind: 'emphasis'; value: string };

export type ThinkingFragment = {
  id: string;
  title: string;
  body: readonly ThinkingLedeSegment[];
};

export const THINKING_THROUGH_DESIGN_LEDE =
  'Notes on how products, organizations, and field operations actually connect—pulled from nonprofit service work, coordination systems, brand/product practice, and AI-assisted research.';

export const THINKING_SECTION_HEADING = thinking.h2;

export const THINKING_SECTION_INTRO = thinking.body;

/** Homepage About me — bio before the thinking cards. */
export const ABOUT_HOME_CHAPTER_H2 = aboutMe.chapterH2;

export const ABOUT_HOME_BIO_HEADING = aboutMe.h2;

export const ABOUT_HOME_BIO_BODY = aboutMe.body;

export const ABOUT_HOME_BIO_CTA = aboutMe.cta;

// ─── Fan card data ────────────────────────────────────────────────────────────

export const CARD_PRACTICE_CTA = 'See it in practice →';

export type ThinkingMoment = {
  label: string;
  href: string;
};

export type ThinkingNavigateHandlers = {
  onOpenAdopt?: () => void;
  /** Opens Adopt overlay with the full case study expanded (validation deep links). */
  onOpenAdoptFull?: () => void;
  onOpenDriver?: () => void;
  onOpenAi?: () => void;
  onOpenTouchpoints?: () => void;
  onOpenVhenyProduct?: () => void;
  onOpenVhenyBranding?: () => void;
  onOpenVisual?: () => void;
};

const NAV_SCROLL_OFFSET = 48;

const ADOPT_FULL_STUDY_HASHES = new Set([
  '#adopt-section-validation',
  '#adopt-validation-physical',
  '#adopt-validation-digital',
]);

function resolveScrollRootId(path: string): string | null {
  if (path.includes('adopt-a-school')) return 'adopt-case-study-scroll';
  if (path.includes('driver-coordination')) return 'driver-case-study-scroll';
  if (path.includes('designing-with-ai')) return 'designing-ai-scroll';
  if (path.includes('vheny-diamonds/product-design')) return 'vheny-product-scroll';
  if (path.includes('vheny-diamonds/branding')) return 'vheny-branding-scroll';
  if (path.includes('visual-design/') && path !== '/work/visual-design') return 'visual-work-scroll';
  if (path.includes('visual-design')) return 'visual-design-scroll';
  if (path.includes('vheny-diamonds') || path.includes('ajediam')) return 'vheny-product-scroll';
  return null;
}

function scrollToHash(hash: string, rootId: string | null) {
  const target = document.querySelector(hash) as HTMLElement | null;
  if (!target) return false;

  const root = rootId ? document.getElementById(rootId) : null;
  if (root) {
    const rootRect = root.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const top = root.scrollTop + (targetRect.top - rootRect.top) - NAV_SCROLL_OFFSET;
    root.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  } else {
    const top = window.scrollY + target.getBoundingClientRect().top - NAV_SCROLL_OFFSET;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }
  return true;
}

/** Opens the matching case-study overlay and scrolls to a section anchor when present. */
export function navigateThinkingMomentHref(
  href: string,
  handlers: ThinkingNavigateHandlers,
) {
  const hashIndex = href.indexOf('#');
  const path = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const hash = hashIndex >= 0 ? href.slice(hashIndex) : '';

  if (path.includes('adopt-a-school')) {
    if (hash && ADOPT_FULL_STUDY_HASHES.has(hash)) {
      handlers.onOpenAdoptFull?.() ?? handlers.onOpenAdopt?.();
    } else {
      handlers.onOpenAdopt?.();
    }
    return;
  } else if (path.includes('driver-coordination')) {
    handlers.onOpenDriver?.();
  } else if (path.includes('designing-with-ai')) {
    handlers.onOpenAi?.();
  } else if (path.includes('vheny-diamonds/product-design')) {
    handlers.onOpenVhenyProduct?.() ?? handlers.onOpenTouchpoints?.();
  } else if (path.includes('vheny-diamonds/branding')) {
    handlers.onOpenVhenyBranding?.() ?? handlers.onOpenTouchpoints?.();
  } else if (path.includes('visual-design')) {
    handlers.onOpenVisual?.();
  } else if (path.includes('vheny-diamonds') || path.includes('ajediam')) {
    handlers.onOpenVhenyProduct?.() ?? handlers.onOpenTouchpoints?.();
  }

  if (!hash) return;

  const rootId = resolveScrollRootId(path);
  const needsRetry = hash && ADOPT_FULL_STUDY_HASHES.has(hash);

  const attemptScroll = (delayMs: number) => {
    window.setTimeout(() => {
      const scrolled = scrollToHash(hash, rootId);
      if (needsRetry && !scrolled) {
        window.setTimeout(() => scrollToHash(hash, rootId), 420);
      }
    }, delayMs);
  };

  attemptScroll(rootId ? 520 : 320);
}

export type ThinkingEvidencePart = {
  text: string;
  href?: string;
};

export type ThinkingCard = {
  id: string;
  eyebrow: string;
  title: string;
  statement: string;
  evidence: readonly (readonly ThinkingEvidencePart[])[];
  artIndex: number;
  rotate: number;
  yOffset: number;
  zIndex: number;
};

const THINKING_CARD_LAYOUT: Record<string, Pick<ThinkingCard, 'artIndex' | 'rotate' | 'yOffset' | 'zIndex'>> = {
  'challenge-assumptions': { artIndex: 0, rotate: -14, yOffset: 20, zIndex: 5 },
  'navigate-ambiguity': { artIndex: 2, rotate: -5, yOffset: 8, zIndex: 3 },
  'connect-the-dots': { artIndex: 1, rotate: 5, yOffset: 8, zIndex: 3 },
  'system-not-screen': { artIndex: 4, rotate: 14, yOffset: 20, zIndex: 5 },
};

export const THINKING_CARDS: readonly ThinkingCard[] = thinkingCards.map((card) => ({
  id: card.id,
  eyebrow: card.eyebrow,
  title: card.title,
  statement: card.statement,
  evidence: card.evidence,
  ...(THINKING_CARD_LAYOUT[card.id] ?? { artIndex: 0, rotate: 0, yOffset: 0, zIndex: 1 }),
}));

// ─── Essay fragments (existing) ───────────────────────────────────────────────

export const THINKING_THROUGH_DESIGN_FRAGMENTS: readonly ThinkingFragment[] = [
  {
    id: 'ambiguity',
    title: 'Navigating ambiguity through structure',
    body: [
      { kind: 'text', value: 'When the problem is fuzzy, I map ' },
      { kind: 'ref', label: 'constraints', action: { type: 'open-adopt' } },
      { kind: 'text', value: ' and flows first—then a ' },
      { kind: 'ref', label: 'system view', action: { type: 'open-adopt' } },
      { kind: 'text', value: ' teams can use ' },
      { kind: 'emphasis', value: 'without hiding tradeoffs' },
      { kind: 'text', value: '.' },
    ],
  },
  {
    id: 'beyond-screens',
    title: 'Designing beyond screens',
    body: [
      { kind: 'text', value: 'Screens are one layer. Also: ' },
      { kind: 'ref', label: 'field objects', action: { type: 'open-adopt' } },
      { kind: 'text', value: ', ' },
      { kind: 'ref', label: 'map enrollment', action: { type: 'open-adopt' } },
      { kind: 'text', value: ', and ' },
      { kind: 'ref', label: 'live coordination', action: { type: 'open-driver' } },
      { kind: 'text', value: ' across the ' },
      { kind: 'emphasis', value: 'same service story' },
      { kind: 'text', value: '.' },
    ],
  },
  {
    id: 'ownership',
    title: 'Ownership means more than deliverables',
    body: [
      { kind: 'text', value: 'I align stakeholders, sequence priorities, and keep ' },
      { kind: 'ref', label: 'decisions legible', action: { type: 'open-adopt' } },
      { kind: 'text', value: '—not just ship ' },
      { kind: 'ref', label: 'interface files', action: { type: 'open-driver' } },
      { kind: 'text', value: ' at the end. ' },
      { kind: 'emphasis', value: 'Rationale stays traceable' },
      { kind: 'text', value: ' across functions.' },
    ],
  },
  {
    id: 'ai',
    title: 'Designing alongside AI',
    body: [
      { kind: 'text', value: 'AI speeds synthesis. ' },
      { kind: 'ref', label: 'Judgment', action: { type: 'open-ai' } },
      { kind: 'text', value: ' still owns ' },
      { kind: 'emphasis', value: 'ethics, framing' },
      { kind: 'text', value: ', and what the org should not automate.' },
    ],
  },
];
