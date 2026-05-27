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
