import type {
  ProcessOverviewChapterId,
  ProcessOverviewMedia,
  PrototypeTrack,
} from '../components/AdoptProcessOverview';

export type ProcessTurningPoint = {
  id: string;
  /** Global moment number 1–12 */
  index: number;
  chapterId: ProcessOverviewChapterId;
  title: string;
  /** One line — what changed in understanding */
  shift: string;
  body: string;
  /** One line — what changed in the system map at this moment */
  systemChange: string;
  evidence?: ProcessOverviewMedia;
  evidenceCaption?: string;
};

export type ProcessChapterDef = {
  id: ProcessOverviewChapterId;
  label: string;
  /** How understanding evolved in this chapter */
  thesis: string;
};

export const ADOPT_PROCESS_OVERVIEW_TITLE = 'Process overview';

export const ADOPT_PROCESS_OVERVIEW_SUBTITLE = 'How understanding evolved';

export const ADOPT_PROCESS_OVERVIEW_LEDE =
  'A chaptered account of how fieldwork, prototypes, and validation reshaped what the system had to solve.';

export const ADOPT_PROCESS_CHAPTERS: readonly ProcessChapterDef[] = [
  {
    id: 'research',
    label: 'Research',
    thesis:
      'Proximity to the work replaced assumptions with constraints I could not see from the brief alone.',
  },
  {
    id: 'definition',
    label: 'Definition',
    thesis:
      'The definition pass turned scattered signals into one operational frame—map, diagram, and throughput in the same story.',
  },
  {
    id: 'rapid-prototyping',
    label: 'Prototyping',
    thesis:
      'Prototypes were tests of judgment—what had to connect before fidelity, polish, or scope could earn their place.',
  },
] as const;

/** Kept for later editorial — no longer a Process Overview chapter. */
export const ADOPT_PROCESS_IMPLICATIONS_CHAPTER: ProcessChapterDef = {
  id: 'validation',
  label: 'Implications',
  thesis:
    'Implications were not a sign-off—they were where repeatability met the warehouse, the aisle, and the device.',
};

/** Legacy stills — still carrying the chapters that have no revised artwork yet. */
const IMG_ACTIVATION = '/adopt-a-school/Hero-44-case-study.png';
const IMG_PHYSICAL = '/adopt-a-school/Hero2_Humanize-shot_IMG_9442.jpg';
const IMG_MOBILE = '/adopt-a-school/Hero33-case-study.png';
const IMG_FIELD = '/adopt-a-school/Humanize-shot_IMG_9438.jpg';
const IMG_SYNTHESIS = '/adopt-a-school/Humanize-shot_IMG_9444.jpg';

/** Revised 16:9 process artwork, one file per chapter page. */
const PROCESS = '/adopt-a-school/process';
const IMG_RESEARCH_1 = `${PROCESS}/research-1.jpg`;
const IMG_DEFINITION_2 = `${PROCESS}/definition-2.jpg`;
const IMG_DEFINITION_3 = `${PROCESS}/definition-3.jpg`;
const IMG_DIGITAL_1 = `${PROCESS}/digital-1.jpg`;
const IMG_DIGITAL_3 = `${PROCESS}/digital-3.jpg`;
const VID_PHYSICAL_1 = `${PROCESS}/physical-1.mp4`;
const POSTER_PHYSICAL_1 = `${PROCESS}/physical-1-poster.jpg`;
const IMG_PHYSICAL_2 = `${PROCESS}/physical-2.jpg`;
const VID_PHYSICAL_3 = `${PROCESS}/physical-3.mp4`;

/** Streamed rather than bundled — the masters run well past what this repo should carry. */
const VIMEO_RESEARCH_2 = '1220659116';
const VIMEO_DEFINITION_1 = '1220641914';
const VIMEO_DIGITAL_2 = '1220642280';

const BASE_TURNING_POINTS: readonly ProcessTurningPoint[] = [
  // ─── Research ─────────────────────────────────────────────────────────────
  {
    id: 'research-01',
    index: 1,
    chapterId: 'research',
    title: 'Get close to the work',
    shift: 'I stopped interviewing the problem and started watching the pledge path in real environments.',
    body:
      'Volunteer decisions and school geography only became legible in the field—where curiosity converted or evaporated before any URL.',
    systemChange: 'Field and donor nodes appear—scattered observations enter the map.',
    evidence: {
      type: 'img',
      src: IMG_RESEARCH_1,
      alt: 'Mural on the Backpack Brigade warehouse wall showing volunteers passing crates of food.',
    },
    evidenceCaption: 'Getting close to the work — inside the warehouse where the program runs.',
  },
  {
    id: 'research-02',
    index: 2,
    chapterId: 'research',
    title: 'Access revealed blind spots',
    shift: 'The warehouse was treated as the center of gravity—everything else routed through it.',
    body:
      'Ops interviews surfaced a pattern: participation spikes collapsed into queue bottlenecks when intake was not structured upstream.',
    systemChange: 'Warehouse and aisle nodes surface—the gravity of ops becomes visible.',
    evidence: {
      type: 'embed',
      provider: 'vimeo',
      videoId: VIMEO_RESEARCH_2,
      title: 'Adopt-a-School — research walkthrough',
    },
    evidenceCaption: 'Throughput and coordination defined what the system had to encode.',
  },
  {
    id: 'research-03',
    index: 3,
    chapterId: 'research',
    title: 'The signal emerged',
    shift: 'Fragmented participation was the problem—not weak fundraising creative.',
    body:
      'Field touchpoints pointed one way: steady revenue needed a repeatable path from discovery to pledge—not one-off campaign spikes.',
    systemChange: 'A signal node forms—field observations start pointing the same direction.',
    evidence: { type: 'img', src: IMG_FIELD, alt: 'Field research session in context.' },
    evidenceCaption: 'Repeated field touchpoints surfaced the same constraint pattern.',
  },
  // ─── Definition ───────────────────────────────────────────────────────────
  {
    id: 'definition-04',
    index: 4,
    chapterId: 'definition',
    title: "The obvious problem wasn't the real problem",
    shift: 'I reframed the brief from campaigns to structured participation.',
    body:
      'Stakeholders named fundraising; the system needed enrollment, geography, and handoff clarity between aisle and device.',
    systemChange: 'Map enrollment connects to the signal—geography enters the frame.',
    evidence: {
      type: 'embed',
      provider: 'vimeo',
      videoId: VIMEO_DEFINITION_1,
      title: 'Adopt-a-School — defining the participation model',
    },
    evidenceCaption: 'Map-first enrollment made geography legible before forms.',
  },
  {
    id: 'definition-05',
    index: 5,
    chapterId: 'definition',
    title: 'Scale created tension',
    shift: 'Every local moment had to survive translation into warehouse throughput.',
    body:
      'Discovery, conversion, and ops pulled apart until one diagram held them—what to optimize first became a design call.',
    systemChange: 'The system diagram links discovery, conversion, and ops in one field.',
    evidence: {
      type: 'img',
      src: IMG_DEFINITION_2,
      alt: 'Storyboard of the ambassador journey — sign-up, toolkit, in-store activation, and donation.',
    },
    evidenceCaption: 'Storyboarding the ambassador path end to end, from sign-up to donation.',
  },
  {
    id: 'definition-06',
    index: 6,
    chapterId: 'definition',
    title: 'Beyond the warehouse',
    shift: 'Clear pathways had to extend help without adding coordinator memory.',
    body:
      'The definition became a layered system: activation, digital enrollment, and volunteer coordination as one repeatable path.',
    systemChange: 'Mission layer connects object, map, and enrollment—beyond the warehouse.',
    evidence: {
      type: 'img',
      src: IMG_DEFINITION_3,
      alt: 'Affinity wall of sticky notes covering activation placement, tiers, and partner collateral.',
    },
    evidenceCaption: 'Sorting placement, tiers, and partner collateral into one repeatable path.',
  },
  // ─── Prototyping (evidence resolved per track) ────────────────────────────
  {
    id: 'prototyping-07',
    index: 7,
    chapterId: 'rapid-prototyping',
    title: "Individual ideas weren't enough",
    shift: 'Single-touch concepts failed the handoff test—object, map, and ops had to move together.',
    body:
      'Screens and objects each looked viable until I traced the full pledge path—attention and commitment was where concepts broke.',
    systemChange: 'Object and digital paths link—single-touch ideas fail the handoff test.',
    evidence: { type: 'img', src: IMG_ACTIVATION, alt: 'Physical activation object.' },
    evidenceCaption: 'Object legibility in the aisle—readable before any URL.',
  },
  {
    id: 'prototyping-08',
    index: 8,
    chapterId: 'rapid-prototyping',
    title: 'The process had to reopen',
    shift: 'Fidelity followed behavioral risk—not polish for its own sake.',
    body:
      'When a flow failed in context, I reopened at the right layer: enrollment, shelf-side object, or coordination rule—not all three at once.',
    systemChange: 'Candidate paths branch—alternatives explored before committing.',
    evidence: { type: 'img', src: IMG_MOBILE, alt: 'Mobile enrollment prototype.' },
    evidenceCaption: 'Digital handoff tested what reads before URLs.',
  },
  {
    id: 'prototyping-09',
    index: 9,
    chapterId: 'rapid-prototyping',
    title: 'A system began to emerge',
    shift: 'Prototypes became arguments about connection—not deliverables to approve.',
    body:
      'Each run clarified load-bearing links: discovery to pledge, pledge to intake, intake to fulfillment—until the diagram held in the field.',
    systemChange: 'Framework node emerges—load-bearing relationships solidify.',
    evidence: { type: 'diagram' },
    evidenceCaption: 'System relationships as the argument prototypes were testing.',
  },
  // ─── Validation ───────────────────────────────────────────────────────────
  {
    id: 'validation-10',
    index: 10,
    chapterId: 'validation',
    title: 'Assumptions met reality',
    shift: 'In-field runs replaced slide confidence with observed friction.',
    body:
      'Physical activation and digital enrollment were exercised together—where donors actually paused, where coordinators lost thread, and where warehouse routing reasserted itself.',
    systemChange: 'Ops enters the map—assumptions meet field reality.',
    evidence: { type: 'img', src: IMG_PHYSICAL, alt: 'Physical prototype validation in context.' },
    evidenceCaption: 'Activation object and program surfaces in real runs.',
  },
  {
    id: 'validation-11',
    index: 11,
    chapterId: 'validation',
    title: 'Weak spots surfaced',
    shift: 'Bottlenecks clustered around warehouse-centered handoffs—not UI polish.',
    body:
      'Synthesis linked donor moments to ops constraints: what had to move upstream of the queue, and which steps could not depend on who remembered whom.',
    systemChange: 'Weak warehouse-centered paths fade—bottlenecks become explicit.',
    evidence: { type: 'img', src: IMG_SYNTHESIS, alt: 'Field synthesis from validation sessions.' },
    evidenceCaption: 'Observation patterns tied donor moments to ops constraints.',
  },
  {
    id: 'validation-12',
    index: 12,
    chapterId: 'validation',
    title: 'A path forward remained',
    shift: 'Repeatability became the success metric—not feature count.',
    body:
      'Recommendations focused on encoding donor engagement, pledge intake, and fulfillment into one path Backpack Brigade could run again—without collapsing back into logistics firefighting.',
    systemChange: 'Repeatable path remains—mission, ops, and enrollment align.',
    evidence: { type: 'img', src: IMG_MOBILE, alt: 'Digital validation on device.' },
    evidenceCaption: 'Map and enrollment flows tested repeatability through intake.',
  },
];

const PROTOTYPING_EVIDENCE: Record<
  PrototypeTrack,
  Record<string, Pick<ProcessTurningPoint, 'evidence' | 'evidenceCaption' | 'body' | 'shift'>>
> = {
  digital: {
    'prototyping-07': {
      shift: 'Digital-only flows failed when object context was removed from the test.',
      body:
        'Screen-first concepts looked complete until the aisle handoff was missing—intent diverged before the first tap.',
      evidence: {
        type: 'img',
        src: IMG_DIGITAL_1,
        alt: 'Hand-drawn wireframes on tablet mapping the adoption steps and interactive map.',
      },
      evidenceCaption: 'Map-first enrollment shortened the path from curiosity to pledge.',
    },
    'prototyping-08': {
      shift: 'Device-native flows had to be tested where attention was already split.',
      body:
        'Mobile prototypes stressed readability under distraction—short paths, map legibility, and capture before attention dropped.',
      evidence: {
        type: 'embed',
        provider: 'vimeo',
        videoId: VIMEO_DIGITAL_2,
        title: 'Adopt-a-School — digital prototype walkthrough',
      },
      evidenceCaption: 'Geography made the pledge legible before forms.',
    },
    'prototyping-09': {
      shift: 'Digital threads only held when tied back to physical discovery.',
      body:
        'The emerging system paired shelf-side activation with map enrollment—two surfaces, one service story.',
      evidence: {
        type: 'img',
        src: IMG_DIGITAL_3,
        alt: 'Volunteers testing the enrollment flow on their own phones in the warehouse.',
      },
      evidenceCaption: 'Tested on volunteers’ own phones, in the room where the work happens.',
    },
  },
  physical: {
    'prototyping-07': {
      shift: 'Object-first tests revealed shelf-side competition I could not see in wireframes.',
      body:
        'Physical prototypes earned or lost attention beside every other message—legibility had to land before any screen.',
      evidence: {
        type: 'video',
        src: VID_PHYSICAL_1,
        poster: POSTER_PHYSICAL_1,
        alt: 'Physical activation object being handled in context.',
      },
      evidenceCaption: 'Earn attention in the aisle, beside every other message.',
    },
    'prototyping-08': {
      shift: 'The object had to carry the program story without a coordinator present.',
      body:
        'In-context runs tested whether the object could hand off intent reliably—same story, different surface than enrollment.',
      evidence: {
        type: 'img',
        src: IMG_PHYSICAL_2,
        alt: 'Printed apple activation object with a scannable leaf tag, placed on café counters.',
      },
      evidenceCaption: 'Readable activation before URLs—object as on-ramp.',
    },
    'prototyping-09': {
      shift: 'Physical and digital had to be designed as one handoff, not two deliverables.',
      body:
        'Object earns the moment, device captures the pledge, ops carries it forward—one path, three surfaces.',
      evidence: {
        type: 'video',
        src: VID_PHYSICAL_3,
        alt: 'Activation object and program surfaces observed together in a live run.',
      },
      evidenceCaption: 'In-context observation with activation object and program surfaces.',
    },
  },
};

export function turningPointsForChapter(
  chapterId: ProcessOverviewChapterId,
  prototypeTrack: PrototypeTrack = 'digital',
): ProcessTurningPoint[] {
  return BASE_TURNING_POINTS.filter((p) => p.chapterId === chapterId).map((point) => {
    if (chapterId !== 'rapid-prototyping') return point;
    const override = PROTOTYPING_EVIDENCE[prototypeTrack][point.id];
    return override ? { ...point, ...override } : point;
  });
}

export function chapterDefForId(chapterId: ProcessOverviewChapterId): ProcessChapterDef {
  return (
    ADOPT_PROCESS_CHAPTERS.find((c) => c.id === chapterId) ??
    (chapterId === ADOPT_PROCESS_IMPLICATIONS_CHAPTER.id
      ? ADOPT_PROCESS_IMPLICATIONS_CHAPTER
      : ADOPT_PROCESS_CHAPTERS[0])
  );
}
