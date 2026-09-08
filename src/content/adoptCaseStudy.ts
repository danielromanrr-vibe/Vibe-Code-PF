export const ADOPT_KEY_INSIGHTS_IMPLICATIONS_HEADING = 'Key Insights & Implications';

export const ADOPT_KEY_INSIGHTS_IMPLICATIONS_PARAGRAPHS = [
  'In-field validation surfaced bottlenecks tied to warehouse-centered coordination. System recommendations focused on improving repeatability across donor engagement, pledge intake, and fulfillment workflows.',
  'Physical and digital surfaces have to be treated as a system from the start, not retrofitted. The conversion bottleneck is always one step further than the obvious friction point.',
] as const;

export const ADOPT_STRATEGIC_DECISIONS_LEDE =
  'Nonprofit scale, stakeholder values, and real behavior—tradeoffs held in the open, not smoothed into a single narrative.';

export type StrategicDecisionItem = {
  id: string;
  /** Small strategic label — editorial metadata above the tension title. */
  label: string;
  /** Short tension shorthand, e.g. "Access × ethics". */
  tension: string;
  title: string;
  pullQuote: string;
  content: string;
};

export const ADOPT_STRATEGIC_ITEMS: readonly StrategicDecisionItem[] = [
  {
    id: 'ethics',
    label: 'Ethical boundary',
    tension: 'Research access × organizational limits',
    title: 'Research access vs ethical organizational boundaries',
    pullQuote:
      'Proxy work instead: program managers, maps where presence fades, leadership role-plays—feedback on kids’ experience without widening operations.',
    content:
      "Friction concentrated where food meets schools and families—the most sensitive zone. Direct access wasn't viable; kids off-limits; social workers out of scope.\n\nProxy work instead: program managers, maps where Backpack Brigade's presence fades, leadership role-plays. Same timeline, clearer end-of-chain feedback—kids' experience and food preferences—without widening operations.",
  },
  {
    id: 'revenue',
    label: 'Participation ethic',
    tension: 'Revenue signal × founder philosophy',
    title: 'Revenue optimization vs founder philosophy',
    pullQuote:
      'Participation had to feel like joining a cause—not completing a transaction. That constraint stayed non-negotiable.',
    content:
      'Tighter contribution prompts tested stronger. The founder wanted participation to feel like joining a cause, not completing a transaction—that stayed a hard constraint.\n\nChecked the revenue case with Development; documented tiered contribution as a phased recommendation, not a forced rollout.',
  },
  {
    id: 'fidelity',
    label: 'Delivery constraint',
    tension: 'Prototype fidelity × timeline',
    title: 'Prototype fidelity vs delivery constraints',
    pullQuote:
      'Behavioral learning drove where fidelity went: digital flow and map logic first; physical iteration only as much as validation required.',
    content:
      'Physical object and full mobile flow both had to ship; time forced a split.\n\nBehavioral learning drove where fidelity went: digital flow and map logic first. Physical side: fast iteration, AI-assisted passes, loose fabrication specs—enough to test end-to-end without polishing the object past what validation needed.',
  },
  {
    id: 'artifact',
    label: 'System behavior',
    tension: 'Artifact attention × conversion',
    title: 'Artifact optimization vs system behavior',
    pullQuote:
      'The object opens attention; staff narration and enrollment surfaces close the loop.',
    content:
      'People noticed the object—touched it, lingered— but scans stayed low.\n\nQuestion became role, not polish: it works as ambient discovery, not the main converter. When staff named what people were looking at, conversion moved. Object opens attention; people close the loop.',
  },
];

export type ContextMetric = {
  stat: string;
  label: string;
  /** Evidence-oriented descriptor above the label. */
  context?: string;
};

export const ADOPT_CONTEXT_METRICS: readonly ContextMetric[] = [
  { stat: '35+', label: 'Volunteer & partner behaviors documented' },
  { stat: '150+', label: 'Field observations mapped into service constraints' },
  { stat: '2', label: 'Prototype families tested in the field' },
  { stat: '4', label: 'Months from research to operational pilot' },
];
