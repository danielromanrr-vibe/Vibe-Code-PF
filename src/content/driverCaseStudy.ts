import type { ProcessOverviewStep } from '../components/AdoptProcessOverview';
import type { ContextMetric, StrategicDecisionItem } from './adoptCaseStudy';

/** Case study title — matches homepage case study block (hero h1). */
export const DRIVER_CASE_STUDY_TITLE = 'Scaling coordination with real-time driver visibility';

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

export const DRIVER_PROCESS_OVERVIEW_LEDE =
  'Discovery, definition, prototyping, and validation—presented as a deck you can step through chapter by chapter.';

const MAP_VIDEO = '/adopt-a-school/school-adoption-map.mp4';
const MAP_POSTER = '/adopt-a-school/Hero33-case-study.png';
const IMG_PROFILE = '/adopt-a-school/key-interaction-qr-entry.png';
const IMG_FIELD = '/adopt-a-school/Hero3_.jpg';
const IMG_MAP_STILL = '/adopt-a-school/Hero-2338-discovery.png';
const IMG_SYNTHESIS = '/adopt-a-school/Post-it3_Humanize-shot_IMG_8754.jpg';
const IMG_COORDINATOR = '/adopt-a-school/Humanize-shot_IMG_9442.jpg';

/** Four-chapter process deck — driver coordination (English). */
export const DRIVER_PROCESS_STEPS: ProcessOverviewStep[] = [
  {
    id: 'research',
    label: 'Research',
    description:
      'Backpack Brigade needed to scale logistics, but coordination broke under complexity. Driver availability lived in texts, memory, and informal networks—not in a shared operational picture.',
    primaryEyebrow: 'Field discovery',
    primaryCaption:
      'Post-it synthesis from coordinator interviews—where fragmentation and invisible flexibility first surfaced.',
    primary: {
      type: 'img',
      src: IMG_SYNTHESIS,
      alt: 'Research synthesis from coordinator and driver interviews.',
    },
    supporting: [
      {
        media: {
          type: 'img',
          src: IMG_FIELD,
          alt: 'Operations floor where coordination decisions happen in real time.',
        },
        eyebrow: 'Operations context',
        caption: 'Every disruption became a manual search problem—who is free, nearby, and reliable?',
      },
      {
        media: {
          type: 'img',
          src: IMG_COORDINATOR,
          alt: 'Coordinator working through dispatch constraints on the floor.',
        },
        eyebrow: 'Coordinator lens',
        caption: 'Decisions relied on human memory; flexibility was a trait, not a system input.',
      },
    ],
  },
  {
    id: 'definition',
    label: 'Definition',
    description:
      'The design goal: transform driver flexibility from a human trait into a structured, operational resource dispatchers can read at a glance.',
    primaryEyebrow: 'Structured profiles',
    primaryCaption:
      'Driver context, availability signals, and dispatch entry—encoded so the team shares one language.',
    primary: {
      type: 'img',
      src: IMG_PROFILE,
      alt: 'Structured driver profile and dispatch entry view.',
    },
    supporting: [
      {
        media: {
          type: 'img',
          src: IMG_MAP_STILL,
          alt: 'Early map concept framing spatial coordination.',
        },
        eyebrow: 'Spatial model',
        caption: 'The map became the product frame—proximity and availability before assignment.',
      },
    ],
  },
  {
    id: 'rapid-prototyping',
    label: 'Prototyping',
    description:
      'A map-based layer surfaces nearby, available drivers in real time, enabling fast, informed decisions without leaving the coordination view.',
    primaryEyebrow: 'Map interface',
    primaryCaption: 'Live map prototype—nearby drivers, status, and context in one decision surface.',
    primary: {
      type: 'video',
      src: MAP_VIDEO,
      poster: MAP_POSTER,
      alt: 'Map interface showing nearby available drivers.',
    },
    supporting: [
      {
        media: {
          type: 'img',
          src: MAP_POSTER,
          alt: 'Map enrollment and driver visibility on device.',
        },
        eyebrow: 'Mobile handoff',
        caption: 'Enrollment and visibility stay tied to the same geographic logic coordinators use.',
      },
    ],
  },
  {
    id: 'validation',
    label: 'Validation',
    description:
      'Tested in real conditions: one coordinator, three scenarios, no script—decisions had to work when routes changed mid-shift.',
    primaryEyebrow: 'Field validation',
    primaryCaption:
      'Coordinator pilot—decisions made inside the interface, with interpretation and trust still in the loop.',
    primary: {
      type: 'img',
      src: IMG_COORDINATOR,
      alt: 'Coordinator validating the map-based workflow in the field.',
    },
    supporting: [
      {
        media: {
          type: 'img',
          src: IMG_SYNTHESIS,
          alt: 'Synthesis of what worked and what required clearer signals.',
        },
        eyebrow: 'What worked',
        caption: 'Decisions could be made inside the interface—faster than memory-based search.',
      },
      {
        media: {
          type: 'img',
          src: IMG_FIELD,
          alt: 'Field notes on gaps in trust and interpretation.',
        },
        eyebrow: 'What needed iteration',
        caption: 'Required interpretation at first; trust in live status was not immediate without clearer cues.',
      },
    ],
  },
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
