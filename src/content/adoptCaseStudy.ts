export const ADOPT_KEY_INSIGHTS_IMPLICATIONS_HEADING = 'Key Insights';

export const ADOPT_KEY_INSIGHTS_IMPLICATIONS_PARAGRAPHS = [
  'In-field validation surfaced bottlenecks tied to warehouse-centered coordination. System recommendations focused on improving repeatability across donor engagement, pledge intake, and fulfillment workflows.',
  'Physical and digital surfaces have to be treated as a system from the start, not retrofitted. The conversion bottleneck is always one step further than the obvious friction point.',
] as const;

export const ADOPT_STRATEGIC_DECISIONS_LEDE =
  'Nonprofit scale, stakeholder values, and real behavior—tradeoffs held in the open, not smoothed into a single narrative.';

export type StrategicDecisionItem = {
  id: string;
  title: string;
  content: string;
  /** @deprecated Accordion no longer shows eyebrows; kept for driver compatibility. */
  label?: string;
  tension?: string;
  pullQuote?: string;
};

/** Prefer adopt.md — kept as empty fallback if the markdown section is missing. */
export const ADOPT_STRATEGIC_ITEMS: readonly StrategicDecisionItem[] = [];

export type ContextMetric = {
  stat: string;
  label: string;
  /** Evidence-oriented descriptor above the label. */
  context?: string;
};

export const ADOPT_CONTEXT_METRICS: readonly ContextMetric[] = [
  { stat: '35+', label: 'Volunteer & partner behaviors documented' },
  { stat: '150+', label: 'Field observations mapped into service constraints' },
];
