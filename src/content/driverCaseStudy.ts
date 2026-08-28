import type { ContextMetric, StrategicDecisionItem } from './adoptCaseStudy';

/** Case study title — matches homepage case study block (hero h1). */
export const DRIVER_CASE_STUDY_TITLE = 'Map-aid: tailored logistics';

export const DRIVER_CASE_STUDY_SUBTITLE =
  'Route decisions relied on memory and hidden availability. I designed a map-based system that surfaces nearby drivers in real time, turning flexibility into a reliable coordination resource.';

export const DRIVER_IMPACT_SUMMARY_HEADING = 'Before and after Backpack Brigade';

/** Editorial thesis — Act 3 before/after block. */
export const DRIVER_CASE_STUDY_IMPACT_SUMMARY_LINES = [
  'Driver coordination had to work as one operational system—not texts, memory, and ad hoc calls stitched together at the warehouse door.',
  'Field discovery with coordinators and drivers defined what “available and nearby” had to mean; map visibility, structured profiles, and dispatch entry made that signal actionable in the moment.',
  'Service and product design connected spatial awareness, dispatch rhythm, and nonprofit scale so growth did not add coordination overhead the team could not sustain.',
] as const;

export const DRIVER_CASE_STUDY_LEDE =
  'Product and service design for Backpack Brigade’s driver coordination layer—making informal flexibility visible, structured, and actionable when dispatch decisions happen under pressure.';

export const DRIVER_KEY_INSIGHT =
  'Spatial awareness—who is nearby and available—is the core of coordination. Everything else supports that decision.';

export const DRIVER_IMPACT_META = [
  'Real-time visibility replaces memory-based dispatch',
  'Coordination scales without adding cognitive load',
] as const;

export const DRIVER_CONTEXT_METRICS: readonly ContextMetric[] = [
  { stat: '3', context: 'Field validation', label: 'Dispatch scenarios tested in real conditions' },
  { stat: '1', context: 'Coordinator pilot', label: 'Live coordination run without a script' },
  { stat: 'Live', context: 'Operational signal', label: 'Driver map visibility in production flow' },
  { stat: '4', context: 'Research through ship', label: 'Months from discovery to field pilot' },
];

export const DRIVER_STRATEGIC_DECISIONS_LEDE =
  'Nonprofit logistics, volunteer flexibility, and real-time pressure—tradeoffs held in the open, not collapsed into a feature list.';

export const DRIVER_STRATEGIC_ITEMS: readonly StrategicDecisionItem[] = [
  {
    id: 'judgment',
    label: 'Coordinator judgment',
    tension: 'Visibility × human discretion',
    title: 'Visibility vs coordinator judgment',
    pullQuote:
      'The system supports decisions; it does not replace the person who knows the route, the school, and the exception.',
    content:
      'Live driver status could automate assignments—but coordinators needed to keep judgment in the loop.\n\nThe system supports decisions; it does not replace the person who knows the route, the school, and the exception.',
  },
  {
    id: 'trust',
    label: 'Signal trust',
    tension: 'Automation × field trust',
    title: 'Automation vs trust',
    pullQuote:
      'Legible state changes and conservative defaults—coordinators verify before committing.',
    content:
      'Early concepts pushed toward auto-dispatch. Field tests showed trust built slowly when status signals were ambiguous.\n\nWe prioritized legible state changes and conservative defaults so coordinators could verify before committing.',
  },
  {
    id: 'map',
    label: 'Decision surface',
    tension: 'Map-first × profile depth',
    title: 'Map-first vs profile-first',
    pullQuote:
      'Spatial awareness—who is nearby and available—became the primary surface; profiles held supporting depth.',
    content:
      'Profiles held rich context; the map held the decision moment.\n\nSpatial awareness—who is nearby and available—became the primary surface, with profiles as supporting depth.',
  },
  {
    id: 'speed',
    label: 'Operational reality',
    tension: 'Speed × route complexity',
    title: 'Speed vs operational reality',
    pullQuote:
      'Surfacing nearby availability collapsed search time—without over-promising certainty on partial routes.',
    content:
      'Every disruption became a search problem under the old model.\n\nSurfacing nearby availability collapsed search time, but edge cases (partial availability, multi-stop routes) required explicit design so the UI did not over-promise certainty.',
  },
];

export const DRIVER_OUTCOME_LEDE =
  'By making driver flexibility visible and structured, coordination moves from a fragile, memory-dependent process toward a scalable decision system—without removing the coordinator from the loop.';
