import type {
  ProcessOverviewChapterId,
  ProcessOverviewContent,
  PrototypeTrack,
} from '../components/AdoptProcessOverview';
import type { ProcessChapterDef, ProcessTurningPoint } from './adoptProcessTurningPoints';
import { process as processCopy, prototypeDisplay } from './driver';

export const DRIVER_PROCESS_OVERVIEW_TITLE = 'Process overview';

/**
 * Map-aid chapters — same ProcessOverviewChapterId union as Adopt so shared chrome
 * (themes, fields, playground) stays intact. Labels are Map-aid specific.
 * Moment count: 3 discovery stills, 2 prototype films, then a validation photo and the shipped prototype.
 */
export const DRIVER_PROCESS_CHAPTERS: readonly ProcessChapterDef[] = [
  {
    id: 'definition',
    label: 'Discovery',
    thesis:
      'Deep access revealed driver coordination as a key area for improvement. Stakeholder interviews uncovered how flexibility shaped coordinators’ decisions when addressing delivery bottlenecks.',
  },
  {
    id: 'rapid-prototyping',
    label: 'Vibe-coded prototypes',
    thesis:
      'The first prototype explored how mapping could complement contact management, validating a spatially informed workflow. However, frequent tab switching kept contact management at the center.',
  },
  {
    id: 'validation',
    label: 'Validation-driven product pivot',
    thesis:
      'Our first validation with Hoyt challenged the assumption that automation would earn complete trust. He wanted to retain oversight, shifting the product from an automated database to a decision-support tool centered on the map.',
  },
] as const;

const PROCESS = '/map-aid/process';
const IMG_DEFINITION_1 = `${PROCESS}/definition-1.jpg`;
const IMG_DEFINITION_2 = `${PROCESS}/definition-2.jpg`;
const IMG_DEFINITION_3 = `${PROCESS}/definition-3.jpg`;
const IMG_HOYT_VALIDATION = `${PROCESS}/Hoyt-validation-photo.png`;

/** Streamed rather than bundled — same Adopt pattern as Embed-codes_readme. */
const VIMEO_ITERATION_1 = '1222165321';
const VIMEO_ITERATION_1_1 = '1222165322';

const DRIVER_TURNING_POINTS: readonly ProcessTurningPoint[] = [
  // ─── Definition ───────────────────────────────────────────────────────────
  {
    id: 'driver-definition-01',
    index: 1,
    chapterId: 'definition',
    title: 'Kickoff: Understanding operations',
    shift: 'Two coordinators and four drivers showed assignment as a private ritual, not a shared picture.',
    body:
      'Deep access revealed driver coordination as a key area for improvement. Stakeholder interviews uncovered how flexibility shaped coordinators’ decisions when addressing delivery bottlenecks.',
    systemChange: 'The brief moves from “find a driver” to “stop storing the operation in one coordinator.”',
    evidence: {
      type: 'img',
      src: IMG_DEFINITION_1,
      alt: 'Definition still — availability as an unstructured, invisible resource.',
    },
    evidenceCaption: 'Interview synthesis—Loyalist drivers and the Juggler coordinator.',
  },
  {
    id: 'driver-definition-03',
    index: 2,
    chapterId: 'definition',
    title: 'Tension between volunteers and coordinators',
    shift: 'Twelve years of organic coordination had to become profiles: status, preferences, flexibility.',
    body:
      'After analyzing stakeholder and volunteer feedback, we found that 12 years of organic refinement had created a seamless driver experience. Preserving it became a core product requirement.',
    systemChange: 'Profiles, a proximity map, and a working CMS become the coordination axis.',
    evidence: {
      type: 'img',
      src: IMG_DEFINITION_3,
      alt: 'Definition still — structured driver context in one operational language.',
    },
    evidenceCaption: 'Conceptual pillars—tokenize, spatial reasoning, daily CMS.',
  },
  {
    id: 'driver-definition-02',
    index: 3,
    chapterId: 'definition',
    title: 'From data to documentation and early AI prototypes',
    shift: 'Without each volunteer’s flexibility in a system, every change becomes a hunt.',
    body:
      'Research transcripts and field observations informed the product requirements, system architecture narrative, and system boundaries. These documents guided early static prototypes for stakeholder alignment.',
    systemChange: 'Flexibility is treated as a structural capacity—visible, distributed, and actionable.',
    evidence: {
      type: 'img',
      src: IMG_DEFINITION_2,
      alt: 'Definition still — map as the spatial decision surface.',
    },
    evidenceCaption: 'Key insight—flexibility as the central tension, not a side trait.',
  },
  // ─── Iteration 1 ──────────────────────────────────────────────────────────
  {
    id: 'driver-iteration1-01',
    index: 4,
    chapterId: 'rapid-prototyping',
    title: 'Building on alignment: the 1st interactive prototype',
    shift: 'A rough prototype and a stakeholder session with Hoyt and Nichelle locked the weekly job to design for.',
    body:
      'The first prototype explored how mapping could complement contact management, validating a spatially informed workflow. However, frequent tab switching kept contact management at the center.',
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
    title: 'Same idea, less cognitive load',
    shift: 'The next pass kept the geography and cut cognitive load so the architecture could be intentional.',
    body:
      'The second iteration retained the core user flows while reducing cognitive load. We simplified the interface to make key information easier to navigate and the experience less overwhelming.',
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
    title: 'Validating the prototype with coordinators',
    shift: 'Three scenarios with Hoyt: the weekly RSVP pulse, a route at risk, and a new volunteer.',
    body:
      'We tested three scenarios with Hoyt: initiating the weekly automated RSVP pulse, addressing a delivery route at risk of losing its driver, and adding a new volunteer to the roster.',
    systemChange: 'The validation session is the photo of Hoyt with the prototype.',
    evidence: {
      type: 'img',
      src: IMG_HOYT_VALIDATION,
      alt: 'Hoyt validating the Map-Aid prototype.',
    },
    evidenceCaption: 'Hoyt validating the prototype.',
  },
  {
    id: 'driver-validation-pivot',
    index: 7,
    chapterId: 'validation',
    title: 'The UX/UI pivot: Prototype iteration 3',
    shift: 'Hoyt wanted oversight, so the product moved from an automated database to a map-centered decision-support tool.',
    body:
      'Our first validation with Hoyt challenged the assumption that automation would earn complete trust. He wanted to retain oversight, shifting the product from an automated database to a decision-support tool centered on the map.',
    systemChange: 'The product pivots to a decision-support tool centered on the map.',
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
  lede: processCopy.body,
  chapters: DRIVER_PROCESS_CHAPTERS,
  turningPointsForChapter: driverTurningPointsForChapter,
  glance: [
    {
      label: 'Discovery',
      body: '30+ interviews and field observation showed that drivers had zero pain points—their routine had to stay untouched. The real bottleneck was operations: coordinators needed clear procedures that didn\'t rely on the founder\'s memory.',
    },
    {
      label: 'Vibe Coding',
      body: 'We turned research into product requirements and used AI to rapidly build early prototypes. Our initial assumption was that the main value lived in a contact system built around volunteer flexibility, availability, and capacity.',
    },
    {
      label: 'The Pivot',
      body: 'Testing those prototypes changed our direction. Coordinators didn\'t want full automation; they needed human-in-the-loop control. The final build paired the contact system with a spatial map to guide emergency coverage decisions.',
    },
  ],
  enablePrototypeTrackToggle: false,
  showTurnHint: false,
  chapterLayout: 'stack',
  chapterEyebrow: 'Process Deep Dive',
  glanceEyebrow: 'Process summary',
};
