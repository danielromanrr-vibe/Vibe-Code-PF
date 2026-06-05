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

export const THINKING_SECTION_HEADING = 'The thinking behind the work';

export const THINKING_SECTION_INTRO =
  'The projects above show what I built. These cards explore some of the ideas, decisions, and patterns that continue to shape how I approach design.';

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
  if (path.includes('ajediam')) return 'touchpoints-scroll';
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
  } else if (path.includes('driver-coordination')) {
    handlers.onOpenDriver?.();
  } else if (path.includes('designing-with-ai')) {
    handlers.onOpenAi?.();
  } else if (path.includes('ajediam')) {
    handlers.onOpenTouchpoints?.();
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

export type ThinkingCard = {
  id: string;
  eyebrow: string;
  title: string;
  statement: string;
  reflection: string;
  supportingMoments: readonly ThinkingMoment[];
  artIndex: number;
  rotate: number;
  yOffset: number;
  zIndex: number;
};

export const THINKING_CARDS: readonly ThinkingCard[] = [
  {
    id: 'challenge-assumptions',
    eyebrow: '01',
    title: 'Challenge assumptions',
    statement: 'The first problem presented is rarely the real one.',
    reflection:
      'I treat the first brief as a hypothesis, not a diagnosis. Some of the most valuable opportunities emerge when the original framing is challenged.',
    supportingMoments: [
      {
        label: 'Reframing fundraising as participation',
        href: '/adopt-a-school#adopt-key-insight',
      },
      {
        label: 'Looking beyond scheduling in driver coordination',
        href: '/driver-coordination#driver-key-insight',
      },
      {
        label: 'Challenging assumptions through field observation',
        href: '/adopt-a-school#adopt-process-overview',
      },
    ],
    artIndex: 0,
    rotate: -18,
    yOffset: 24,
    zIndex: 6,
  },
  {
    id: 'navigate-ambiguity',
    eyebrow: '02',
    title: 'Navigate ambiguity',
    statement: 'Progress often comes from creating clarity before creating solutions.',
    reflection:
      'When goals, constraints, or requirements are unclear, I focus on making sense of the situation before committing to a direction.',
    supportingMoments: [
      {
        label: 'Defining opportunities before designing solutions',
        href: '/adopt-a-school#adopt-key-insight',
      },
      {
        label: 'Working through uncertainty with stakeholders',
        href: '/driver-coordination#driver-section-strategic-decisions',
      },
      {
        label: 'Using prototypes to create alignment',
        href: '/adopt-a-school#adopt-section-validation',
      },
    ],
    artIndex: 2,
    rotate: -9,
    yOffset: 10,
    zIndex: 3,
  },
  {
    id: 'embrace-trade-offs',
    eyebrow: '03',
    title: 'Embrace trade-offs',
    statement: 'Every design decision creates constraints somewhere else.',
    reflection:
      'Good design is rarely about finding perfect solutions. It is about understanding competing needs and making deliberate choices.',
    supportingMoments: [
      {
        label: 'Balancing user needs and organizational goals',
        href: '/driver-coordination#driver-section-strategic-decisions',
      },
      {
        label: 'Prioritizing opportunities under constraints',
        href: '/adopt-a-school#adopt-key-insight',
      },
      {
        label: 'Making scope decisions that shaped outcomes',
        href: '/adopt-a-school#adopt-section-validation',
      },
    ],
    artIndex: 3,
    rotate: 0,
    yOffset: 0,
    zIndex: 1,
  },
  {
    id: 'connect-the-dots',
    eyebrow: '04',
    title: 'Connect the dots',
    statement:
      'Opportunities emerge when seemingly unrelated signals start pointing in the same direction.',
    reflection:
      'Research, operations, business goals, stakeholder feedback, and user behavior rarely align neatly. Finding meaningful patterns is often where the work begins.',
    supportingMoments: [
      {
        label: 'Turning fragmented observations into strategy',
        href: '/adopt-a-school#adopt-key-insight',
      },
      {
        label: 'Connecting people, processes, and technology',
        href: '/adopt-a-school#adopt-section-context',
      },
      {
        label: 'Synthesizing multiple perspectives into one direction',
        href: '/driver-coordination#driver-section-strategic-decisions',
      },
    ],
    artIndex: 1,
    rotate: 9,
    yOffset: 10,
    zIndex: 3,
  },
  {
    id: 'system-not-screen',
    eyebrow: '05',
    title: 'Design the system, not the screen',
    statement: 'Most organizational challenges live between interfaces.',
    reflection:
      'Products rarely exist in isolation. Understanding the surrounding service, workflow, and ecosystem often reveals the biggest opportunities.',
    supportingMoments: [
      {
        label: 'Connecting inventory, content, and workflows',
        href: '/ajediam#ajediam-product',
      },
      {
        label: 'Designing beyond individual touchpoints',
        href: '/designing-with-ai#ai-cross-functional',
      },
      {
        label: 'Mapping relationships across people and systems',
        href: '/designing-with-ai',
      },
    ],
    artIndex: 4,
    rotate: 18,
    yOffset: 24,
    zIndex: 6,
  },
];

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
