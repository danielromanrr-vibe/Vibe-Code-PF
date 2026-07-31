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
  {
    id: 'validation',
    label: 'Implications',
    thesis:
      'Implications were not a sign-off—they were where repeatability met the warehouse, the aisle, and the device.',
  },
] as const;

const IMG_ACTIVATION = '/adopt-a-school/Hero-44-case-study.png';
const IMG_PHYSICAL = '/adopt-a-school/Hero2_Humanize-shot_IMG_9442.jpg';
const IMG_MOBILE = '/adopt-a-school/Hero33-case-study.png';
const IMG_OPS = '/adopt-a-school/Hero3_.jpg';
const MAP_VIDEO = '/adopt-a-school/school-adoption-map.mp4';
const MAP_POSTER = '/adopt-a-school/Hero33-case-study.png';
const IMG_FIELD = '/adopt-a-school/Humanize-shot_IMG_9438.jpg';
const IMG_SYNTHESIS = '/adopt-a-school/Humanize-shot_IMG_9444.jpg';

const BASE_TURNING_POINTS: readonly ProcessTurningPoint[] = [
  // ─── Research ─────────────────────────────────────────────────────────────
  {
    id: 'research-01',
    index: 1,
    chapterId: 'research',
    title: 'Get close to the work',
    shift: 'I stopped interviewing the problem and started watching the pledge path in real environments.',
    body:
      'Volunteer decisions, retail adjacency, and school geography only became legible in the field—where curiosity either converted or evaporated before any URL.',
    systemChange: 'Field and donor nodes appear—scattered observations enter the map.',
    evidence: { type: 'img', src: IMG_ACTIVATION, alt: 'Activation object in a real-world context.' },
    evidenceCaption: 'Activation in context — curiosity starts where the object sits in the world.',
  },
  {
    id: 'research-02',
    index: 2,
    chapterId: 'research',
    title: 'Access revealed blind spots',
    shift: 'The warehouse was treated as the center of gravity—everything else routed through it.',
    body:
      'Observation and ops interviews surfaced a coordination pattern: participation spikes collapsed back into queue bottlenecks when intake was not structured upstream.',
    systemChange: 'Warehouse and aisle nodes surface—the gravity of ops becomes visible.',
    evidence: { type: 'img', src: IMG_OPS, alt: 'Operational throughput and coordination constraints.' },
    evidenceCaption: 'Throughput and coordination defined what the system had to encode.',
  },
  {
    id: 'research-03',
    index: 3,
    chapterId: 'research',
    title: 'The signal emerged',
    shift: 'Fragmented participation was the problem—not weak fundraising creative.',
    body:
      'Field touchpoints pointed the same direction: steady revenue required a repeatable path from discovery through pledge capture, not one-off campaign spikes.',
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
      'Stakeholders named fundraising; the system needed enrollment, geography, and handoff clarity so intent survived the gap between aisle and device.',
    systemChange: 'Map enrollment connects to the signal—geography enters the frame.',
    evidence: { type: 'video', src: MAP_VIDEO, poster: MAP_POSTER, alt: 'Map-first school selection flow.' },
    evidenceCaption: 'Map-first enrollment made geography legible before forms.',
  },
  {
    id: 'definition-05',
    index: 5,
    chapterId: 'definition',
    title: 'Scale created tension',
    shift: 'Every local moment had to survive translation into warehouse throughput.',
    body:
      'Discovery, conversion, and ops pulled in different directions until the same diagram could hold them—what to optimize first became a design decision, not a backlog sort.',
    systemChange: 'The system diagram links discovery, conversion, and ops in one field.',
    evidence: { type: 'diagram' },
    evidenceCaption: 'Discovery, conversion, and ops as one field—not a vertical funnel.',
  },
  {
    id: 'definition-06',
    index: 6,
    chapterId: 'definition',
    title: 'Beyond the warehouse',
    shift: 'Clear pathways had to extend help without adding coordinator memory.',
    body:
      'The operational definition became a layered service system: physical activation, digital enrollment, and volunteer coordination encoded as one repeatable path.',
    systemChange: 'Mission layer connects object, map, and enrollment—beyond the warehouse.',
    evidence: { type: 'img', src: IMG_MOBILE, alt: 'Mobile enrollment handoff from physical activation.' },
    evidenceCaption: 'From object to device without losing intent.',
  },
  // ─── Prototyping (evidence resolved per track) ────────────────────────────
  {
    id: 'prototyping-07',
    index: 7,
    chapterId: 'rapid-prototyping',
    title: "Individual ideas weren't enough",
    shift: 'Single-touch concepts failed the handoff test—object, map, and ops had to move together.',
    body:
      'Isolated screens or objects each looked viable until I traced the full pledge path; the gap between attention and commitment was where concepts broke.',
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
      'When a flow failed in context, I reopened the thread at the right layer: device-native enrollment, shelf-side object, or coordination rule—never all three at once.',
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
      'Each run clarified which relationships were load-bearing: discovery to pledge, pledge to intake, intake to fulfillment—until the system diagram matched what we could defend in the field.',
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
        'Screen-first concepts looked complete until the aisle handoff was missing—attention and intent diverged before the first tap.',
      evidence: { type: 'img', src: IMG_MOBILE, alt: 'Mobile enrollment prototype on device.' },
      evidenceCaption: 'Map-first enrollment shortened the path from curiosity to pledge.',
    },
    'prototyping-08': {
      shift: 'Device-native flows had to be tested where attention was already split.',
      body:
        'Mobile prototypes stressed readability under distraction—short paths, map legibility, and capture before attention dropped.',
      evidence: { type: 'video', src: MAP_VIDEO, poster: MAP_POSTER, alt: 'Map-based school adoption video.' },
      evidenceCaption: 'Geography made the pledge legible before forms.',
    },
    'prototyping-09': {
      shift: 'Digital threads only held when tied back to physical discovery.',
      body:
        'The emerging system paired shelf-side activation with map enrollment—two surfaces, one service story.',
      evidence: { type: 'diagram' },
      evidenceCaption: 'Digital engagement as a transformation state on the same orbit.',
    },
  },
  physical: {
    'prototyping-07': {
      shift: 'Object-first tests revealed shelf-side competition I could not see in wireframes.',
      body:
        'Physical prototypes earned or lost attention beside every other message—legibility and handoff intent had to land before any screen.',
      evidence: { type: 'img', src: IMG_PHYSICAL, alt: 'Physical prototype in the aisle.' },
      evidenceCaption: 'Earn attention in the aisle, beside every other message.',
    },
    'prototyping-08': {
      shift: 'The object had to carry the program story without a coordinator present.',
      body:
        'In-context runs tested whether the activation object could hand off intent reliably—same story, different surface than digital enrollment.',
      evidence: { type: 'img', src: IMG_ACTIVATION, alt: 'Activation object as on-ramp.' },
      evidenceCaption: 'Readable activation before URLs—object as on-ramp.',
    },
    'prototyping-09': {
      shift: 'Physical and digital had to be designed as one handoff, not two deliverables.',
      body:
        'The system argument crystallized: object earns the moment, device captures the pledge, ops carries it forward—one path, three surfaces.',
      evidence: { type: 'img', src: IMG_PHYSICAL, alt: 'Physical validation in context.' },
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
  return ADOPT_PROCESS_CHAPTERS.find((c) => c.id === chapterId) ?? ADOPT_PROCESS_CHAPTERS[0];
}
