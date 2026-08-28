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
      'Driver flexibility had to become a structured operational resource—not a trait coordinators kept in memory.',
  },
  {
    id: 'rapid-prototyping',
    label: 'Iteration 1',
    thesis:
      'A first map-based layer made nearby availability visible so dispatch decisions could happen in one view.',
  },
  {
    id: 'validation',
    label: 'Iteration 2',
    thesis:
      'Field pressure refined trust cues and kept coordinator judgment in the loop under real dispatch conditions.',
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
    title: 'Flexibility was invisible',
    shift: 'Availability lived in texts and memory—not in a shared operational picture.',
    body:
      'Coordinators could not see who was nearby and free when routes broke. Flexibility was a human trait, not a system input.',
    systemChange: 'The brief reframes from “find a driver” to “make flexibility legible.”',
    evidence: {
      type: 'img',
      src: IMG_DEFINITION_1,
      alt: 'Definition still — availability as an unstructured, invisible resource.',
    },
    evidenceCaption: 'Interview synthesis—where fragmentation and invisible flexibility first surfaced.',
  },
  {
    id: 'driver-definition-02',
    index: 2,
    chapterId: 'definition',
    title: 'Spatial awareness is the decision',
    shift: 'Who is nearby and available became the primary question—everything else supports it.',
    body:
      'Profiles, status, and dispatch entry only mattered if they served the moment of assignment under pressure.',
    systemChange: 'Proximity and availability enter the product frame before assignment.',
    evidence: {
      type: 'img',
      src: IMG_DEFINITION_2,
      alt: 'Definition still — map as the spatial decision surface.',
    },
    evidenceCaption: 'Early spatial model—map as the decision surface.',
  },
  {
    id: 'driver-definition-03',
    index: 3,
    chapterId: 'definition',
    title: 'One shared language',
    shift: 'Driver context had to be structured so the team could share one operational vocabulary.',
    body:
      'Availability signals, profile depth, and dispatch entry were encoded as one readable resource—not informal knowledge.',
    systemChange: 'Structured profiles connect to the coordination loop.',
    evidence: {
      type: 'img',
      src: IMG_DEFINITION_3,
      alt: 'Definition still — structured driver context in one operational language.',
    },
    evidenceCaption: 'Profile and dispatch entry—one language for the team.',
  },
  // ─── Iteration 1 ──────────────────────────────────────────────────────────
  {
    id: 'driver-iteration1-01',
    index: 4,
    chapterId: 'rapid-prototyping',
    title: 'Map-first prototype',
    shift: 'Nearby drivers had to surface in real time without leaving the coordination view.',
    body:
      'The first build put spatial awareness on screen: status, context, and proximity in one decision surface.',
    systemChange: 'Live map becomes the primary coordination surface.',
    evidence: {
      type: 'embed',
      provider: 'vimeo',
      videoId: VIMEO_ITERATION_1,
      title: 'Map-aid — iteration 1',
    },
    evidenceCaption: 'First map build—nearby drivers and status in one view.',
  },
  {
    id: 'driver-iteration1-02',
    index: 5,
    chapterId: 'rapid-prototyping',
    title: 'Floor reality checked the model',
    shift: 'Every disruption was still a search problem until proximity was actually usable across desk and device.',
    body:
      'Operations-floor pressure exposed gaps between a plausible map and a signal coordinators would trust mid-shift. Mobile and desk views had to share one proximity model so the handoff did not invent a second source of truth.',
    systemChange: 'Field constraints push back; mobile and desk stay tied to the same spatial rules.',
    evidence: {
      type: 'embed',
      provider: 'vimeo',
      videoId: VIMEO_ITERATION_1_1,
      title: 'Map-aid — iteration 1.1',
    },
    evidenceCaption: 'Floor context and device handoff—same geographic logic across surfaces.',
  },
  // ─── Iteration 2 ──────────────────────────────────────────────────────────
  {
    id: 'driver-iteration2-01',
    index: 6,
    chapterId: 'validation',
    title: 'Judgment stays in the loop',
    shift: 'The second pass tightened trust cues without replacing the coordinator.',
    body:
      'Live status was not trusted immediately without legible state changes. Field pilots confirmed visibility must accelerate judgment—not remove the person who knows the route, the school, and the exception. Nearby availability cut search time; partial availability and multi-stop routes needed explicit encoding so the UI did not over-promise certainty.',
    systemChange: 'Trust cues tighten; human discretion remains the final assignment authority.',
    evidence: {
      type: 'embed',
      provider: 'vimeo',
      videoId: VIMEO_ITERATION_2,
      title: 'Map-aid — iteration 2',
    },
    evidenceCaption: 'Second-pass map—clearer state, coordinator judgment intact.',
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
