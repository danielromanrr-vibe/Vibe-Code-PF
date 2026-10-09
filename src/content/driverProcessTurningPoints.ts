import type {
  ProcessOverviewChapterId,
  ProcessOverviewContent,
  PrototypeTrack,
} from '../components/AdoptProcessOverview';
import type { ProcessChapterDef, ProcessTurningPoint } from './adoptProcessTurningPoints';
import { process as processCopy, prototypeDisplay } from './driver';

export const DRIVER_PROCESS_OVERVIEW_TITLE = 'Process overview';

export const DRIVER_PROCESS_OVERVIEW_SUBTITLE = 'Rapid prototyping in the field';

export const DRIVER_PROCESS_OVERVIEW_LEDE =
  'Three stages, run in the warehouse rather than in a design tool: audit the founder-to-coordinator gap, build working prototypes in hours, then stress-test them during live packing sessions.';

/**
 * Map-aid chapters — same ProcessOverviewChapterId union as Adopt so shared chrome
 * (themes, fields, playground) stays intact. Labels are Map-aid specific.
 * Moment count: 3 stills, 2 films, then one warehouse-test film.
 */
export const DRIVER_PROCESS_CHAPTERS: readonly ProcessChapterDef[] = [
  {
    id: 'definition',
    label: 'Discovery',
    thesis:
      'Loyalist drivers wanted a routine. Juggler coordinators — Sam Hoyt and Duncan Rowe — spent 15–20 hours a week placing 40+ routes from spreadsheets and memory. The audit covered loading slips, interviews, and King County routes.',
  },
  {
    id: 'rapid-prototyping',
    label: 'Vibe code',
    thesis:
      'Vibe-coded in Next.js and Tailwind, from dense tables toward a proximity map. The build carried three pillars: profiles, spatial allocation, and a CMS for the week’s work. The first tables overloaded the reading.',
  },
  {
    id: 'validation',
    label: 'Warehouse test',
    thesis:
      'Unguided and non-assisted, with Sam Hoyt on a laptop during live packing. Three scenarios: Monday launch, the Wednesday risk horizon, and onboarding a new driver.',
  },
] as const;

const PROCESS = '/map-aid/process';
const IMG_DEFINITION_1 = `${PROCESS}/definition-1.jpg`;
const IMG_DEFINITION_2 = `${PROCESS}/definition-2.jpg`;
const IMG_DEFINITION_3 = `${PROCESS}/definition-3.jpg`;

/** Streamed rather than bundled — same Adopt pattern as Embed-codes_readme. */
const VIMEO_ITERATION_1 = '1222165321';
const VIMEO_ITERATION_1_1 = '1222165322';

const DRIVER_TURNING_POINTS: readonly ProcessTurningPoint[] = [
  // ─── Definition ───────────────────────────────────────────────────────────
  {
    id: 'driver-definition-01',
    index: 1,
    chapterId: 'definition',
    title: 'The week lived in one head',
    shift: 'Two coordinators and four drivers showed assignment as a private ritual, not a shared picture.',
    body:
      'Round-two interviews (28 Jan–2 Feb) plus a warehouse visit mapped how routes get assigned and how changes get handled. Loyalist drivers wanted a routine and the flexibility to keep it, and did not see the friction that created. The Juggler was the coordinator: Sam Hoyt and Duncan Rowe spent 15–20 hours a week placing 40+ routes from spreadsheets and from memory.',
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
      'Coordination depends on drivers willing to take any route. That capacity was not documented, and the Loyalist did not experience its absence as a problem. When something broke, there were no reliable tools—only what the Juggler remembered. Decisions without live data, and too much knowledge locked in one mind.',
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
      'Three pillars framed the product. Tokenization: 12 years of organic knowledge — availability, preferences, and who would say yes — written as profiles. Spatial reasoning: allocation read from proximity, not from a static table. A CMS in the mold of Jira or Asana, so dispatch could run as structured work rather than a lookup.',
    systemChange: 'Profiles, a proximity map, and a working CMS become the coordination axis.',
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
      'The first tables stacked status, capacity, and routes until the screen itself was the load. The next pass kept the geography and cut that density, so a coordinator could read the situation without translating it. Desk and device stayed on the same spatial rules.',
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
    id: 'driver-iteration2-shipped',
    index: 6,
    chapterId: 'validation',
    title: 'Shipped Map-Aid prototype',
    shift: 'The frame on the laptop was the prototype itself.',
    body: 'The shipped Map-Aid prototype, in the 16:9 that used to open this case study.',
    systemChange: 'The film of the shipped surface leads the warehouse chapter.',
    evidence: {
      type: 'embed',
      provider: 'vimeo',
      videoId: prototypeDisplay.id,
      title: prototypeDisplay.title,
    },
    evidenceCaption: prototypeDisplay.caption,
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
  title: processCopy.h2 || DRIVER_PROCESS_OVERVIEW_TITLE,
  subtitle: '',
  lede: processCopy.body.length > 0 ? processCopy.body : [DRIVER_PROCESS_OVERVIEW_SUBTITLE, DRIVER_PROCESS_OVERVIEW_LEDE],
  chapters: DRIVER_PROCESS_CHAPTERS,
  turningPointsForChapter: driverTurningPointsForChapter,
  glance: DRIVER_PROCESS_CHAPTERS.map((chapter) => ({
    label: chapter.label,
    body: chapter.thesis,
  })),
  enablePrototypeTrackToggle: false,
  showTurnHint: false,
  chapterLayout: 'stack',
};
