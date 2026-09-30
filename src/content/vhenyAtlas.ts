export type AtlasVimeoClip = {
  id: string;
  title: string;
  showcase: string;
  paddingPct: string;
  autoplayMutedLoop?: boolean;
};

export type AtlasVideoSection = {
  id: string;
  heading: string;
  body: string;
  clips: readonly AtlasVimeoClip[];
};

export const ATLAS_PRODUCT = {
  title: 'Vheny Diamonds: Ops & Scale',
  eyebrow: 'SaaS',
  bannerSrc: '/vheny-diamonds/product-cover.jpg',
  bannerAlt: 'Atlas CRM — diamond stock and contact operating system.',
  lede: [
    'A multi-generational diamond trader whose relationship-driven ops had outgrown spreadsheets. The brief: redesign the internal system so senior traders’ knowledge stays usable for the next generation.',
    'Atlas was a custom OS—CRM, inventory, light accounting—built for how traders actually work. Prototype only, but a clear case for scalable UX in high-stakes workflows.',
  ] as const,
  role: 'Product designer / UX researcher',
  client: 'Vheny Diamonds',
  insight:
    'Reimagine the internal operating system of a multi-generational diamond company by replacing legacy spreadsheets and fragmented tools with a unified CRM that supports complex workflows, reduces errors, and enables future scale.',
  impact: [
    'An end-to-end prototype of Atlas CRM: a modular, logic-driven internal tool that maps contacts, inventory, memo creation, and payoff tracking into a scalable system. Validated by stakeholders and ready for development.',
  ],
  scope:
    '12-week project → user research, interaction design, system mapping, and a functional interactive prototype, collaborating with stakeholders',
  skills:
    'Figma, Creative Cloud, typography and layout, atomic design, story-telling, brand strategy, product design thinking, responsive design',
  metricsLabel: 'Vheny Diamonds Atlas — project metrics',
} as const;

export const ATLAS_SCOPE_ITEMS = [
  {
    id: 'stock',
    eyebrow: 'Stock management',
    body: 'Parcels and singles in one dual-mode sheet: bulk scan, profile detail, reveal, and a shared tokenized search grammar.',
    imageSrc: '/vheny-diamonds/product/adding-item.png',
  },
  {
    id: 'contacts',
    eyebrow: 'Contact management',
    body: 'Spreadsheet and profile for relationships—tickets, related stock, and bookkeeping live on the person, not in a side app.',
    imageSrc: '/vheny-diamonds/product/note-anatomy.png',
  },
  {
    id: 'queue',
    eyebrow: 'Queue & intake',
    body: 'A temporary workspace to draw from parcels, assemble singles, and check out as memo, lease, or sale.',
    imageSrc: '/vheny-diamonds/product/web-mockup.gif',
  },
] as const;

export type AtlasGrammarPayload = {
  label: string;
  body: string;
};

export type AtlasGrammarPattern = {
  id: 'slots' | 'reveal' | 'mode' | 'projection' | 'queue';
  title: string;
  subtitle: string;
  rule: string;
  benefit: string;
  payloads?: readonly AtlasGrammarPayload[];
};

export const ATLAS_GRAMMAR = {
  eyebrow: '02 — System architecture & interaction grammar',
  title: 'Extracting the Interaction Engine',
  subhead:
    'How operational video analysis revealed a coherent, 4-region spatial shell built for speed, context retention, and constrained data entry.',
  context:
    'Rather than relying on fragmented views, Atlas operates on a single persistent workspace shell. By analyzing real operational workflows across inventory management, inquiry tickets, and deal closing, we mapped a system model anchored on master-detail retention, closed vocabulary data slots, and local state transitions.',
  decision: {
    title: 'One shell, learned once',
    body: 'Across Contacts and Stock, the list stays anchored and the right side projects whatever is linked to the selection. The same split is the layout for both modules. A full table or a parcel chart can cover it when the task needs the whole workspace.',
  },
  patternsIntro:
    'Hover a row and the diagram plays the sequence. It holds the result, then returns to the start.',
  patterns: [
    {
      id: 'slots',
      title: '01 — Closed-vocabulary slot sequences',
      subtitle: 'Search & inquiry ticket composition',
      rule: 'Lab, shape, carat, and color are never free text. Each value is written from the next closed slot, in order.',
      benefit: 'The query is assembled from valid tokens, so parametric search stays on one shared vocabulary.',
    },
    {
      id: 'reveal',
      title: '02 — Universal inline expansion',
      subtitle: 'Context-aware operations across Contacts & Stock',
      rule: 'The Eye expander is the same control in Contacts and Stock. It opens the work for that row inside the list.',
      benefit: 'The row opens in place, and the rest of the list stays put.',
      payloads: [
        { label: 'Contacts', body: 'Expands contact notes and the tag strip.' },
        { label: 'Parcels', body: 'Expands sieve rows, size splits, and queue actions.' },
        { label: 'Singles', body: 'Expands lab certificate detail and queue actions.' },
      ],
    },
    {
      id: 'mode',
      title: '03 — Task modes on a stable table',
      subtitle: 'In-place workflow execution',
      rule: 'The list stays locked. A workflow change renames the header, shifts its accent, and swaps the row verbs.',
      benefit: 'Browse, intake, and checkout are modes of the same table.',
      payloads: [
        { label: 'Browse', body: 'Standard list reading.' },
        { label: 'Adding to stock', body: 'Cell-level editing in the row, with a green header.' },
        { label: 'Checkout queue', body: 'Header reads “Add items to checkout queue.” Row verbs become Import and Export.' },
      ],
    },
    {
      id: 'projection',
      title: '04 — Linked context projections',
      subtitle: 'Cross-entity data binding',
      rule: 'Selecting a record locks the secondary panels to that record. Switching tabs changes the visible set, and the selection stays.',
      benefit: 'Cross-referencing happens while the list keeps its place.',
    },
    {
      id: 'queue',
      title: '05 — Multi-state queue pipeline',
      subtitle: 'Synchronized item staging & checkout',
      rule: 'Queueing writes the same fact in three places at once: the sieve row, the parent outgoing line, and the header count.',
      benefit: 'The path from the selected row to the checkout document stays visible.',
    },
  ] as const satisfies readonly AtlasGrammarPattern[],
};

export const ATLAS_VIDEO_SECTIONS: readonly AtlasVideoSection[] = [
  {
    id: 'stock',
    heading: 'Stock management — Parcels & Singles',
    body: 'One dual-mode sheet: spreadsheet for bulk scan, profile for deep detail. Shared tokens for search, intake, and queue — draw from a parcel, then check out as memo, lease, or sale.',
    clips: [
      {
        id: '1139168655',
        title: 'Parcel profile toggle',
        showcase: 'Parcel profile with quality and weight distribution.',
        paddingPct: '56.22',
        autoplayMutedLoop: true,
      },
      {
        id: '1139168638',
        title: 'Singles and parcels toggle',
        showcase: 'Singles vs parcels, and a single’s deeper profile search.',
        paddingPct: '56.22',
        autoplayMutedLoop: true,
      },
      {
        id: '1139168555',
        title: 'Reveal in spreadsheet',
        showcase: 'Reveal opens grading, market, and origin in the row.',
        paddingPct: '56.22',
      },
      {
        id: '1139168410',
        title: 'Add to queue',
        showcase: 'Draw quantity from a parcel into the queue.',
        paddingPct: '56.22',
      },
      {
        id: '1139168480',
        title: 'Checkout and intake modes',
        showcase: 'Checkout vs intake modes on the same sheet.',
        paddingPct: '56.22',
      },
      {
        id: '1139168455',
        title: 'Intake mode pair',
        showcase: 'Companion toggle for stock in vs stock out.',
        paddingPct: '56.22',
      },
      {
        id: '1139168348',
        title: 'Advanced search',
        showcase: 'Tokenized diamond qualities with keybindings for mastery.',
        paddingPct: '25.11',
      },
    ],
  },
  {
    id: 'contacts',
    heading: 'Contact management',
    body: 'Same dual mode for people: spreadsheet to scan, profile for tickets and related stock. Follow-up lives on the relationship.',
    clips: [
      {
        id: '1139168629',
        title: 'Contact spreadsheet and profile',
        showcase: 'Contact search: spreadsheet vs in-depth profile.',
        paddingPct: '56.22',
        autoplayMutedLoop: true,
      },
      {
        id: '1139168619',
        title: 'Related records',
        showcase: 'Related stock, bookkeeping, and documents on a contact.',
        paddingPct: '56.22',
      },
      {
        id: '1139168523',
        title: 'Expand row marks',
        showcase: 'Expand a row for buy/sell marks — match stock to people.',
        paddingPct: '56.22',
      },
      {
        id: '1139168494',
        title: 'Making a ticket',
        showcase: 'Ticket on a customer: buy or sell, and who owns it.',
        paddingPct: '56.22',
      },
    ],
  },
];
