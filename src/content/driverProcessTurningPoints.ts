import type {
  ProcessOverviewChapterId,
  ProcessOverviewContent,
  PrototypeTrack,
} from '../components/AdoptProcessOverview';
import type { ProcessChapterDef, ProcessTurningPoint } from './adoptProcessTurningPoints';

export const DRIVER_PROCESS_OVERVIEW_TITLE = 'Process overview';

export const DRIVER_PROCESS_OVERVIEW_SUBTITLE = 'How the coordination layer took shape';

export const DRIVER_PROCESS_OVERVIEW_LEDE =
  'Definition through two design iterations—chaptered moments of how spatial awareness became an operational system.';

/**
 * Map-aid chapters — same ProcessOverviewChapterId union as Adopt so shared chrome
 * (themes, fields, playground) stays intact. Labels are Map-aid specific.
 * Moment count matches the source drop: 3 stills + 2 films + 1 film.
 */
export const DRIVER_PROCESS_CHAPTERS: readonly ProcessChapterDef[] = [
  {
    id: 'definition',
    label: 'Definition',
    thesis:
      'Interviews with two coordinators and four drivers made the load visible: flexibility lived in memory, and every route change became a search.',
  },
  {
    id: 'rapid-prototyping',
    label: 'Iteration 1',
    thesis:
      'Alignment with Hoyt and Nichelle, then a first map MVP—nearby availability as a resource in one daily interface.',
  },
  {
    id: 'validation',
    label: 'Iteration 2',
    thesis:
      'One unguided session, three real-week scenarios. The map held; trust and human-in-the-loop needed more than the first model assumed.',
  },
] as const;

const PROCESS = '/map-aid/process';
const IMG_DEFINITION_1 = `${PROCESS}/definition-1.jpg`;
const IMG_DEFINITION_2 = `${PROCESS}/definition-2.jpg`;
const IMG_DEFINITION_3 = `${PROCESS}/definition-3.jpg`;

/** Streamed rather than bundled — same Adopt pattern as Embed-codes_readme. */
const VIMEO_ITERATION_1 = '1222165321';
const VIMEO_ITERATION_1_1 = '1222165322';
const VIMEO_ITERATION_2 = '1222165320';

const DRIVER_TURNING_POINTS: readonly ProcessTurningPoint[] = [
  // ─── Definition ───────────────────────────────────────────────────────────
  {
    id: 'driver-definition-01',
    index: 1,
    chapterId: 'definition',
    title: 'The week lived in one head',
    shift: 'Two coordinators and four drivers showed assignment as a private ritual, not a shared picture.',
    body:
      'Round-two interviews (28 Jan–2 Feb) plus a warehouse visit mapped how routes get assigned and how changes get handled. Drivers valued flexibility and comfort; coordinators ran a weekly flow they could partly automate—and still faced the complexity alone. Hoyt’s loop: tentatively place a volunteer, then repeat it forty times.',
    systemChange: 'The brief moves from “find a driver” to “stop storing the operation in one coordinator.”',
    evidence: {
      type: 'img',
      src: IMG_DEFINITION_1,
      alt: 'Definition still — availability as an unstructured, invisible resource.',
    },
    evidenceCaption: 'Interview synthesis—Loyalist drivers and the Juggler coordinator.',
  },
  {
    id: 'driver-definition-02',
    index: 2,
    chapterId: 'definition',
    title: 'Flexibility is the crisis',
    shift: 'Without each volunteer’s flexibility in a system, every change becomes a hunt.',
    body:
      'Coordination depends on drivers willing to take any route. That capacity was not documented. When something broke, there were no reliable tools—only what Hoyt remembered. The current model does not scale: decisions without live data, and too much knowledge locked in one mind.',
    systemChange: 'Flexibility is treated as a structural capacity—visible, distributed, and actionable.',
    evidence: {
      type: 'img',
      src: IMG_DEFINITION_2,
      alt: 'Definition still — map as the spatial decision surface.',
    },
    evidenceCaption: 'Key insight—flexibility as the central tension, not a side trait.',
  },
  {
    id: 'driver-definition-03',
    index: 3,
    chapterId: 'definition',
    title: 'Tokenize the driver',
    shift: 'Twelve years of organic coordination had to become profiles: status, preferences, flexibility.',
    body:
      'Three pillars framed the product. Tokenize: drivers as structured records. Spatial reasoning: those records as resources on a surface built to cut delivery-coordination friction. A daily CMS, closer to a working tool than a dashboard, so the knowledge that lived with the founder could sit in a system.',
    systemChange: 'Structured profiles and a map-first interface become the coordination axis.',
    evidence: {
      type: 'img',
      src: IMG_DEFINITION_3,
      alt: 'Definition still — structured driver context in one operational language.',
    },
    evidenceCaption: 'Conceptual pillars—tokenize, spatial reasoning, daily CMS.',
  },
  // ─── Iteration 1 ──────────────────────────────────────────────────────────
  {
    id: 'driver-iteration1-01',
    index: 4,
    chapterId: 'rapid-prototyping',
    title: 'Align, then build the MVP',
    shift: 'A rough prototype and a stakeholder session with Hoyt and Nichelle locked the weekly job to design for.',
    body:
      'Ideal-state interviews became a transcript, then an artifact, then a working draft. Three short ideation passes defined the MVP: core flows, interface structure, and system architecture—so nearby availability could sit in one daily view.',
    systemChange: 'Live map becomes the primary coordination surface.',
    evidence: {
      type: 'embed',
      provider: 'vimeo',
      videoId: VIMEO_ITERATION_1,
      title: 'Map-aid — iteration 1',
    },
    evidenceCaption: 'First map MVP—nearby drivers and status in one view.',
  },
  {
    id: 'driver-iteration1-02',
    index: 5,
    chapterId: 'rapid-prototyping',
    title: 'Same idea, less load',
    shift: 'The next pass kept the geography and cut cognitive load so the architecture could be intentional.',
    body:
      'Adjustments did not change the thesis. They clarified the structure so a coordinator could read the situation without translating it. Desk and device stayed on the same spatial rules.',
    systemChange: 'Architecture tightens; mobile and desk share one geographic model.',
    evidence: {
      type: 'embed',
      provider: 'vimeo',
      videoId: VIMEO_ITERATION_1_1,
      title: 'Map-aid — iteration 1.1',
    },
    evidenceCaption: 'Second prototype pass—clearer architecture, same proximity logic.',
  },
  // ─── Iteration 2 ──────────────────────────────────────────────────────────
  {
    id: 'driver-iteration2-01',
    index: 6,
    chapterId: 'validation',
    title: 'One coordinator, three unguided days',
    shift: 'The test was whether Hoyt could run a real week—Monday start, Wednesday risk, new-driver onboarding—without a guide.',
    body:
      'We did not score business outcomes. We watched whether the interface supported real decisions. Ambiguity showed up: which school an action applied to, what “add-on capacity” meant, sliders that did not show their effect. Nothing broke. Not everything was obvious. Hoyt still wanted to verify, call, and keep the decision.',
    systemChange: 'Human-in-the-loop stays larger than the first model assumed; the next test is trust.',
    evidence: {
      type: 'embed',
      provider: 'vimeo',
      videoId: VIMEO_ITERATION_2,
      title: 'Map-aid — iteration 2',
    },
    evidenceCaption: 'Unguided validation—usable flow, trust still earned in the moment.',
  },
];

export function driverTurningPointsForChapter(
  chapterId: ProcessOverviewChapterId,
  _prototypeTrack: PrototypeTrack = 'digital',
): ProcessTurningPoint[] {
  return DRIVER_TURNING_POINTS.filter((p) => p.chapterId === chapterId);
}

/** Same AdoptProcessOverview logic — Map-aid content pack (no digital/physical toggle). */
export const DRIVER_PROCESS_OVERVIEW_CONTENT: ProcessOverviewContent = {
  title: DRIVER_PROCESS_OVERVIEW_TITLE,
  subtitle: DRIVER_PROCESS_OVERVIEW_SUBTITLE,
  lede: DRIVER_PROCESS_OVERVIEW_LEDE,
  chapters: DRIVER_PROCESS_CHAPTERS,
  turningPointsForChapter: driverTurningPointsForChapter,
  enablePrototypeTrackToggle: false,
};
