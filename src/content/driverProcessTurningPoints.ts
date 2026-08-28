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

const IMG_PROFILE = '/adopt-a-school/key-interaction-qr-entry.png';
const IMG_FIELD = '/adopt-a-school/Hero3_.jpg';
const IMG_MAP_STILL = '/adopt-a-school/Hero-2338-discovery.png';
const IMG_SYNTHESIS = '/adopt-a-school/Post-it3_Humanize-shot_IMG_8754.jpg';
const IMG_COORDINATOR = '/adopt-a-school/Humanize-shot_IMG_9442.jpg';
const MAP_VIDEO = '/adopt-a-school/school-adoption-map.mp4';
const MAP_POSTER = '/adopt-a-school/Hero33-case-study.png';
const IMG_MAP_HERO = '/coordination-homepage.png';

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
      src: IMG_SYNTHESIS,
      alt: 'Research synthesis from coordinator and driver interviews.',
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
      src: IMG_MAP_STILL,
      alt: 'Early map concept framing spatial coordination.',
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
      src: IMG_PROFILE,
      alt: 'Structured driver profile and dispatch entry view.',
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
      type: 'video',
      src: MAP_VIDEO,
      poster: MAP_POSTER,
      alt: 'Map interface showing nearby available drivers.',
    },
    evidenceCaption: 'First map build—nearby drivers and status in one view.',
  },
  {
    id: 'driver-iteration1-02',
    index: 5,
    chapterId: 'rapid-prototyping',
    title: 'Floor reality checked the model',
    shift: 'Every disruption was still a search problem until proximity was actually usable.',
    body:
      'Operations-floor pressure exposed gaps between a plausible map and a signal coordinators would trust mid-shift.',
    systemChange: 'Field constraints push back on the first map model.',
    evidence: {
      type: 'img',
      src: IMG_FIELD,
      alt: 'Operations floor where coordination decisions happen in real time.',
    },
    evidenceCaption: 'Floor context—where dispatch decisions still had to land.',
  },
  {
    id: 'driver-iteration1-03',
    index: 6,
    chapterId: 'rapid-prototyping',
    title: 'Handoff across devices',
    shift: 'Enrollment and visibility had to stay on the same geographic logic.',
    body:
      'Mobile and desk views shared one proximity model so the handoff did not invent a second source of truth.',
    systemChange: 'Mobile and desk stay tied to the same spatial rules.',
    evidence: {
      type: 'img',
      src: MAP_POSTER,
      alt: 'Map enrollment and driver visibility on device.',
    },
    evidenceCaption: 'Device handoff—same geographic logic across surfaces.',
  },
  // ─── Iteration 2 ──────────────────────────────────────────────────────────
  {
    id: 'driver-iteration2-01',
    index: 7,
    chapterId: 'validation',
    title: 'Trust needed clearer cues',
    shift: 'Live status was not trusted immediately without legible state changes.',
    body:
      'Ambiguous signals slowed commitment. Iteration focused on conservative defaults and readable transitions so coordinators could verify before acting.',
    systemChange: 'Status and trust cues tighten before automation expands.',
    evidence: {
      type: 'img',
      src: IMG_MAP_HERO,
      alt: 'Driver coordination system — real-time map view.',
    },
    evidenceCaption: 'Refined map surface—clearer state for decisions under pressure.',
  },
  {
    id: 'driver-iteration2-02',
    index: 8,
    chapterId: 'validation',
    title: 'Judgment stays in the loop',
    shift: 'The system supports decisions; it does not replace the coordinator.',
    body:
      'Field pilots confirmed visibility must accelerate judgment—not remove the person who knows the route, the school, and the exception.',
    systemChange: 'Human discretion remains the final assignment authority.',
    evidence: {
      type: 'img',
      src: IMG_COORDINATOR,
      alt: 'Coordinator validating the map-based workflow in the field.',
    },
    evidenceCaption: 'Coordinator pilot—decisions inside the interface, judgment intact.',
  },
  {
    id: 'driver-iteration2-03',
    index: 9,
    chapterId: 'validation',
    title: 'What the second pass locked',
    shift: 'Search collapsed; edge cases needed explicit design so the UI did not over-promise.',
    body:
      'Nearby availability cut search time. Partial availability and multi-stop routes required clearer encoding so certainty matched operational reality.',
    systemChange: 'Operational edge cases are named instead of hidden.',
    evidence: {
      type: 'img',
      src: IMG_SYNTHESIS,
      alt: 'Synthesis of what worked and what required clearer signals.',
    },
    evidenceCaption: 'Second-pass synthesis—speed without false certainty.',
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
