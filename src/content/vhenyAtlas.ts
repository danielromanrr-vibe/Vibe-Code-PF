const FILM_16_9 = 16 / 9;

export type AtlasWorkflowClip = {
  id: string;
  title: string;
  ratio: number;
  src?: string;
};

export type AtlasWorkflowCategory = {
  id: string;
  title: string;
  description: string;
  clips: readonly AtlasWorkflowClip[];
};

export const ATLAS_WORKFLOWS = {
  eyebrow: '03 — Live system workflows',
  title: 'The System in Motion',
  subhead:
    'Checkout and add to stock, language constraints, reveal, and toggles, across the live stock and contact flows.',
  categories: [
    {
      id: 'checkout',
      title: 'Checkout and add to stock',
      description:
        'A quantity moves from a parcel into the queue, and the header switches that sheet between checkout and add to stock.',
      clips: [
        { id: '1139168410', title: 'Add to queue', ratio: FILM_16_9 },
        { id: '1139168480', title: 'Checkout', ratio: FILM_16_9 },
        { id: '1139168455', title: 'Add to stock', ratio: FILM_16_9 },
      ],
    },
    {
      id: 'language',
      title: 'Language constraints',
      description: 'Search and tickets are built from the same closed qualities, with a key on each one.',
      clips: [
        { id: '1139168494', title: 'Making a ticket', ratio: FILM_16_9 },
        {
          id: 'search-funcs',
          title: 'Search functions',
          ratio: FILM_16_9,
          src: '/vheny-diamonds/product/search-funcs.mp4',
        },
      ],
    },
    {
      id: 'reveal',
      title: 'Reveal',
      description:
        'Reveal opens the detail in the row, and the same kind of opening shows who a contact trades with.',
      clips: [
        { id: '1139168555', title: 'Reveal in stock', ratio: FILM_16_9 },
        { id: '1139168523', title: 'Contact row', ratio: FILM_16_9 },
      ],
    },
    {
      id: 'toggles',
      title: 'Toggles',
      description:
        'One toggle switches the sheet and the profile in Stock, including the parcel chart, and Contacts uses that same switch.',
      clips: [
        { id: '1139168638', title: 'Stock categories', ratio: FILM_16_9 },
        { id: '1139168655', title: 'Parcel profile', ratio: FILM_16_9 },
        { id: '1139168629', title: 'Contacts', ratio: FILM_16_9 },
        { id: '1139168619', title: 'Related records', ratio: FILM_16_9 },
      ],
    },
  ] as const satisfies readonly AtlasWorkflowCategory[],
};

export type AtlasImpactPoint = {
  label: string;
  body: string;
};

export type AtlasImpactPillar = {
  id: string;
  title: string;
  points: readonly AtlasImpactPoint[];
};

export type AtlasImpactTradeoff = {
  label: string;
  body: string;
};

export type AtlasImpactRow = {
  metric: string;
  legacy: string;
  atlas: string;
};

export const ATLAS_IMPACT = {
  title: 'Impact, Trade-offs & System Scalability',
  subtitle: 'Evaluating system outcomes, design trade-offs, and enterprise scalability.',
  pillars: [
    {
      id: 'stock',
      title: 'Stock Tracking & XE Exchange Rates',
      points: [
        {
          label: 'Constrained Input Blocks',
          body: 'Replaced unstructured Excel notes and free-form text with constrained building blocks to reduce manual logging errors.',
        },
        {
          label: 'Live XE Integration',
          body: 'Added automatic XE spot mid-market rate fetches accompanied by direct URL and timestamp verification.',
        },
      ],
    },
    {
      id: 'payments',
      title: 'Payment Attribution & Payoff Allocations',
      points: [
        {
          label: 'Direct Item Attribution',
          body: 'Linked payments directly to specific diamond inventory IDs (singles, parcels, and Memo-In stock) to eliminate floating balance ambiguity.',
        },
        {
          label: 'Payoff Toggles',
          body: 'Implemented single and batch payoff toggles supporting either automated oldest-first allocation or manual line-item selection.',
        },
      ],
    },
    {
      id: 'audit',
      title: 'Audit Logging & System Scalability',
      points: [
        {
          label: 'Item-Level Change Logs',
          body: 'Built granular change logs capturing timestamps, modified fields, and user/system IDs across multi-currency accounts.',
        },
        {
          label: 'System Foundation',
          body: 'Structured five core interaction primitives into a modular component framework that supports future enterprise SaaS development.',
        },
      ],
    },
  ] as const satisfies readonly AtlasImpactPillar[],
  tradeoffsHeading: 'Realized Trade-offs',
  tradeoffs: [
    {
      label: 'High Information Density vs. Visual Whitespace',
      body: 'Chose high-density data views tailored to active diamond traders over airy, simplified UI layouts. This increased initial onboarding friction for new users but maximized split-second operational speed for daily traders.',
    },
    {
      label: 'Constrained Building Blocks vs. Free-Form Speed',
      body: 'Replacing instant free-form notes with structured input fields added a brief data-entry constraint. However, this step was essential to eliminate unlinked floating balances and enforce data integrity across accounts.',
    },
    {
      label: 'Automated vs. Manual Payoff Allocation',
      body: 'Defaulting to automated oldest-first clearing sped up routine balance reconciliation, but required building an explicit manual override toggle for complex multi-party deals.',
    },
  ] as const satisfies readonly AtlasImpactTradeoff[],
  comparisonHeading: 'Operational Comparison',
  metricLabel: 'Workflow Area',
  legacyLabel: 'Legacy Process',
  atlasLabel: 'Atlas Architecture',
  rows: [
    {
      metric: 'Exchange Rates',
      legacy: 'Manual XE screenshots & text notes',
      atlas: 'Automated XE spot mid-market rate fetches with URL proof',
    },
    {
      metric: 'Payment Allocations',
      legacy: 'Unlinked floating balance entries',
      atlas: 'Single & batch item-level payoff allocation',
    },
    {
      metric: 'Stock Visibility',
      legacy: 'Fragmented spreadsheets & personal notes',
      atlas: 'Unified tracking for Internal, Memo-In, and Virtual Stock',
    },
  ] as const satisfies readonly AtlasImpactRow[],
  reflectionHeading: 'Reflection',
  reflection:
    'Embedding within daily diamond trading revealed that enterprise tools fail when they attempt to hide operational complexity under artificial simplicity. Rather than forcing a rigid corporate accounting model onto high-velocity traders, the system retains density while enforcing data integrity through five core interaction primitives.',
};

export const ATLAS_PRODUCT = {
  title: 'Atlas - The Architecture of a High-Density Diamond Trading Platform',
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
      rule: 'Each quality is chosen from the next closed slot, and every option carries a key. The choices lock into one subject line for that diamond.',
      benefit: 'The ticket describes one stone from valid tokens, so the string stays inside the vocabulary.',
    },
    {
      id: 'reveal',
      title: '02 — Universal inline expansion',
      subtitle: 'Context-aware operations across Contacts & Stock',
      rule: 'The Eye expander is the same control in Contacts and Stock. It opens the work for that row inside the list.',
      benefit: 'The row opens in place, and the rest of the list stays put.',
    },
    {
      id: 'mode',
      title: '03 — Task modes on a stable table',
      subtitle: 'Stock categories on one sheet',
      rule: 'The top of the sheet chooses the stock category. Diamond singles is the resting view. Diamond parcels, Lab singles, and Lab parcels sit beside it. The row underneath is the same closed vocabulary: Lab, shape, carat, clarity, color, and fluorescence.',
      benefit: 'Changing category keeps the trader on the same table.',
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
