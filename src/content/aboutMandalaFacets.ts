/** Progressive disclosure — Level 1 label, Level 2 annotation, Level 3 reflection. */
export type AboutPracticeAction = 'adopt' | 'driver' | 'ai' | 'thinking';

export const DEFAULT_INFLUENCE_ID = 'places';

export type AboutPracticeLink = {
  label: string;
  action?: AboutPracticeAction;
};

export type AboutRelatedInfluence = {
  id: string;
  label: string;
  description: string;
};

export type AboutInfluenceCard = {
  id: string;
  nodeIndex: number;
  title: string;
  teaser: string;
  annotationLine: string;
  /** Level 3 — personal narrative (3–5 sentences). */
  reflection: string;
  /** Level 3 — thinking patterns, not project descriptions. */
  shapesWork: readonly string[];
  /** Level 3 — contextual breadcrumbs. */
  whereItShowsUp: readonly AboutPracticeLink[];
  relatedInfluences: readonly AboutRelatedInfluence[];
  spatialNote: string;
  artIndex: number;
};

export const ABOUT_INFLUENCE_CARDS: readonly AboutInfluenceCard[] = [
  {
    id: 'places',
    nodeIndex: 2,
    title: 'Places',
    teaser: 'Living across six countries taught me that behavior only makes sense in context.',
    annotationLine:
      'Each move meant re-learning what “clear” looks like before designing for a component.',
    reflection:
      'Moving between Costa Rica, Mexico, Europe, and Seattle meant learning that “normal” is local. I watched the same gesture read as warm in one place and abrupt in another. That taught me to look for the gap between what people say and what their environment expects. I still start there — context before interface.',
    shapesWork: [
      'Helps me question assumptions baked into a brief.',
      'Makes me listen for tone and pace before proposing structure.',
      'Keeps me comfortable when a problem domain is unfamiliar.',
    ],
    whereItShowsUp: [
      { label: 'Adopt-a-School', action: 'adopt' },
      { label: 'Driver Coordination', action: 'driver' },
      { label: 'Covantis', action: 'thinking' },
    ],
    relatedInfluences: [
      {
        id: 'people-community',
        label: 'Places shaped how I understand community',
        description: 'Context only becomes real when it shows up in how people live and work together.',
      },
      {
        id: 'systems',
        label: 'Environment shapes how systems behave',
        description: 'Each place taught me that the same interface can mean different things in different settings.',
      },
    ],
    spatialNote: 'Wide orbit — context arrives before clarity.',
    artIndex: 0,
  },
  {
    id: 'art-making',
    nodeIndex: 5,
    title: 'Art & Making',
    teaser: 'Painting trained my eye. Prototyping trained my hands.',
    annotationLine: 'Making things is still how I find out what I think.',
    reflection:
      'Watercolor and ink trained me to notice relationships before I could name them. I learned that composition is a kind of argument — what you leave out matters as much as what you include. Prototyping became the same habit in design: make something small, look at it honestly, revise. I trust what I can see and touch more than what I can only describe.',
    shapesWork: [
      'Pushes me to make ideas visible early.',
      'Trains my eye for hierarchy, rhythm, and tension.',
      'Biases me toward iteration over prolonged debate.',
    ],
    whereItShowsUp: [
      { label: 'Portfolio experiments' },
      { label: 'Visual systems work' },
      { label: 'Brand and product design projects', action: 'ai' },
    ],
    relatedInfluences: [
      {
        id: 'curiosity',
        label: 'Making gives questions physical form',
        description: 'I explore uncertainty by making something small before I claim to understand it.',
      },
      {
        id: 'systems',
        label: 'Visual patterns mirror systemic ones',
        description: 'Composition trains the same eye I use to see relationships in organizations.',
      },
    ],
    spatialNote: 'Warm hue — the eye and hand, closest to how I see.',
    artIndex: 1,
  },
  {
    id: 'learning-work',
    nodeIndex: 8,
    title: 'Learning Through Work',
    teaser: 'Every role exposed a different system to understand and improve.',
    annotationLine: 'I respect operations because I have stood inside them.',
    reflection:
      'Agency production, founding a product, nonprofit work, enterprise scale, a UPS shop floor — each taught me a different logic of how things actually run. I learned that strategy means little if the handoff fails. Standing inside operations changed how I hear constraints: they are not obstacles to design around, they are the design.',
    shapesWork: [
      'Connects strategy to what frontline teams can sustain.',
      'Helps me map handoffs before polishing surfaces.',
      'Keeps me skeptical of solutions that ignore operations.',
    ],
    whereItShowsUp: [
      { label: 'Driver Coordination', action: 'driver' },
      { label: 'Adopt-a-School', action: 'adopt' },
      { label: 'Alexa+ production work', action: 'ai' },
    ],
    relatedInfluences: [
      {
        id: 'systems',
        label: 'Work exposed the systems behind service',
        description: 'Every role revealed a different logic of how things actually run.',
      },
      {
        id: 'people-community',
        label: 'People keep systems grounded',
        description: 'Operations are lived by people — design has to track how life actually runs.',
      },
    ],
    spatialNote: 'Middle ring — each job another system in motion.',
    artIndex: 2,
  },
  {
    id: 'systems',
    nodeIndex: 11,
    title: 'Systems',
    teaser: 'I look for relationships before solutions.',
    annotationLine: 'Products are networks — people, policy, tooling, and timing.',
    reflection:
      'Service design education and years of mapping organizations taught me that products are rarely isolated screens. They are agreements between teams, tools, incentives, and time. I look for the pattern holding things together before I propose a change. Often the real lever is a relationship, not a feature.',
    shapesWork: [
      'Helps me see second-order effects before they surface.',
      'Encourages mapping before making.',
      'Makes me patient with problems that cross team boundaries.',
    ],
    whereItShowsUp: [
      { label: 'Driver Coordination', action: 'driver' },
      { label: 'Adopt-a-School', action: 'adopt' },
      { label: 'Ajediam', action: 'thinking' },
    ],
    relatedInfluences: [
      {
        id: 'curiosity',
        label: 'Curiosity feeds systems thinking',
        description: 'Staying with questions helps me see the structure behind messy situations.',
      },
      {
        id: 'learning-work',
        label: 'Systems show up inside every role',
        description: 'Each job was another chance to map how parts connect across teams and tools.',
      },
    ],
    spatialNote: 'Near the core — the pattern that holds the rest together.',
    artIndex: 3,
  },
  {
    id: 'curiosity',
    nodeIndex: 14,
    title: 'Curiosity',
    teaser: 'Questions tend to stay with me longer than answers.',
    annotationLine: 'Stay with the question until the real constraint surfaces.',
    reflection:
      'Research, field observation, and interviews trained a habit I still rely on: stay with the question even when a solution is already on the slide. The first answer is often a symptom. Curiosity is not endless wandering — it is disciplined patience until the real constraint shows itself.',
    shapesWork: [
      'Helps me notice hidden assumptions early.',
      'Pushes me to validate before committing.',
      'Encourages exploration before convergence.',
    ],
    whereItShowsUp: [
      { label: 'Beyond the Warehouse insight', action: 'thinking' },
      { label: 'Validation work', action: 'adopt' },
      { label: 'Research-heavy projects', action: 'driver' },
    ],
    relatedInfluences: [
      {
        id: 'systems',
        label: 'Curiosity feeds systems thinking',
        description: 'Staying with questions helps me see the structure behind messy situations.',
      },
      {
        id: 'art-making',
        label: 'Curiosity keeps making exploratory',
        description: 'Making gives my questions a physical form before I have a final answer.',
      },
    ],
    spatialNote: 'Drifting edge — inquiry that pulls me off the expected path.',
    artIndex: 4,
  },
  {
    id: 'people-community',
    nodeIndex: 16,
    title: 'People & Community',
    teaser: 'Most meaningful problems are solved with others, not for them.',
    annotationLine: 'Design has to track how life actually runs, not how we wish it did.',
    reflection:
      'Partners, frontline staff, friends, and family keep my work honest. The most durable solutions came from conversations where I was willing to be wrong. Design has to track how life actually runs — not how we wish it did, and not how a deck describes it.',
    shapesWork: [
      'Keeps discovery candid and grounded.',
      'Makes alignment a practice, not a presentation.',
      'Reminds me that dignity in an interface starts with dignity in the process.',
    ],
    whereItShowsUp: [
      { label: 'Adopt-a-School', action: 'adopt' },
      { label: 'Driver Coordination', action: 'driver' },
      { label: 'Thinking through design', action: 'thinking' },
    ],
    relatedInfluences: [
      {
        id: 'places',
        label: 'Places shaped how I understand community',
        description: 'People make context real — community is where environment meets daily life.',
      },
      {
        id: 'learning-work',
        label: 'Community lives inside every system',
        description: 'The most durable solutions came from conversations where I was willing to be wrong.',
      },
    ],
    spatialNote: 'Opposite pole — where work meets real life.',
    artIndex: 0,
  },
] as const;

export type InfluenceDepth = 'collapsed' | 'annotation' | 'reflection';

export function cardForSystemNode(nodeIndex: number): AboutInfluenceCard {
  const direct = ABOUT_INFLUENCE_CARDS.find((c) => c.nodeIndex === nodeIndex);
  if (direct) return direct;
  return ABOUT_INFLUENCE_CARDS[nodeIndex % ABOUT_INFLUENCE_CARDS.length];
}

export function cardById(id: string): AboutInfluenceCard | undefined {
  return ABOUT_INFLUENCE_CARDS.find((c) => c.id === id);
}

/** @deprecated Use AboutInfluenceCard */
export type AboutMandalaFacet = AboutInfluenceCard;

/** @deprecated Use ABOUT_INFLUENCE_CARDS */
export const ABOUT_MANDALA_FACETS = ABOUT_INFLUENCE_CARDS;

/** @deprecated Use cardForSystemNode */
export const facetForSystemNode = cardForSystemNode;

/** @deprecated Use cardById */
export const facetById = cardById;
