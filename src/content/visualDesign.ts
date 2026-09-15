export const VISUAL_LANDING_TITLE_LINES = [
  'Before moving pixels around,',
  'I ask the right questions.',
] as const;

export const VISUAL_LANDING_TITLE = VISUAL_LANDING_TITLE_LINES.join(' ');

/** Kept for homepage teaser / meta that still reference a longer description. */
export const VISUAL_LANDING_BODY =
  'Cross-functional work spanning product, campaign, and brand surfaces — including Amazon Alexa+, Amazon DBS, and Covantis (Deluxe, ABCD agri-tech).';

export const VISUAL_HOME_INDUSTRY = 'Branding • UX/UI • Visual design';

export const VISUAL_HOME_DISCIPLINE = '';

export const VISUAL_HOME_TITLE = 'Visual Ux & Brand design';

export const VISUAL_LANDING_SUBHEADER =
  'Turning context, constraints, and ideas into visual identities and systems that are built to scale.';

export const VISUAL_HOME_BODY_ITEMS = [
  'Working in high-stakes environments, collaborating with stakeholders across different stages of the product lifecycle.',
  'Work spanning agri-tech — **Covantis**, a conglomerate born from Bunge, Cargill, and Louis Dreyfus Company (LDC) — and **Amazon**.',
  'Freelance design across different industries.',
] as const;

export type VisualWorkKind = 'alexa' | 'dbs' | 'covantis' | 'kamau' | 'spice' | 'ajediam';

/** Projects with their own `/work/visual-design/:slug` URL. */
export const VISUAL_ROUTED_KINDS = [
  'alexa',
  'dbs',
  'covantis',
  'ajediam',
  'kamau',
  'spice',
] as const satisfies readonly VisualWorkKind[];

export type VisualRoutedKind = (typeof VISUAL_ROUTED_KINDS)[number];

export type VisualMediaItem = {
  src: string;
  alt: string;
  label: string;
};

/** Adobe Portfolio–style tree row (asymmetric image pairs). */
export type VisualMediaRow = {
  /** Flex ratios left→right; e.g. [13, 4] or [4, 13]. */
  flex: readonly number[];
  items: readonly VisualMediaItem[];
};

export type VisualCaptionedMedia = {
  caption: string;
  media?: VisualMediaItem;
};

/** Vimeo embed for visual narrative sections (e.g. Ajediam short-form). */
export type VisualVimeoEmbed = {
  id: string;
  title: string;
  /** Optional privacy hash from the share embed (`?h=`). */
  hash?: string;
};

/** Nested beat under a visual H2 (e.g. Events under Homepage ads). */
export type VisualWorkSubsection = {
  heading?: string;
  body?: string;
  media?: readonly VisualMediaItem[];
  mediaLayout?: 'stack' | 'grid' | 'rows';
  mediaRows?: readonly VisualMediaRow[];
  /**
   * Horizontal image carousel — same shell as cross-functional / Vimeo embeds
   * (`ProjectCarousel` featuredFixed).
   */
  carousel?: readonly VisualMediaItem[];
  /** Nested groups (e.g. Custom backgrounds → For Amazon partners). */
  subsections?: readonly VisualWorkSubsection[];
};

export type VisualWorkSection = {
  heading: string;
  body?: string;
  media?: readonly VisualMediaItem[];
  /** Stack (default), equal grid, or asymmetric Portfolio-style rows. */
  mediaLayout?: 'stack' | 'grid' | 'rows';
  mediaRows?: readonly VisualMediaRow[];
  /** Caption + image blocks under the lead media (e.g. palette labels). */
  captionedMedia?: readonly VisualCaptionedMedia[];
  /** Optional Vimeo players rendered after images. */
  embeds?: readonly VisualVimeoEmbed[];
  /** Optional image carousel (ProjectCarousel), e.g. AI before/after scroll groups. */
  carousel?: readonly VisualMediaItem[];
  /** Optional H3 beats under this section. */
  subsections?: readonly VisualWorkSubsection[];
};

/** Single-column Context & Intro — mirrors live portfolio + case-study meta rhythm. */
export type VisualContextIntro = {
  role: string;
  impactHighlights: readonly string[];
  scopeItems: readonly string[];
  skills: string;
};

export type VisualWorkBody = {
  id: VisualWorkKind;
  /** URL segment under `/work/visual-design/`. */
  slug: string;
  /** Nav breadcrumb current crumb. */
  navLabel: string;
  title: string;
  /** Optional two-line H1 on the work page. */
  titleLines?: readonly [string, string];
  coverSrc: string;
  coverAlt: string;
  /** Optional top-of-page banner (case-study style). */
  bannerSrc?: string;
  bannerAlt?: string;
  /** Hover + mosaic text tile — joined with • */
  tags: readonly string[];
  client: string;
  /** Page-opening Context & Intro (My role / Impact / Scope / Skills). */
  intro: VisualContextIntro;
  /** Kept for teaser / grid hover summaries. */
  role: string;
  scope: string;
  impact: string;
  skills: string;
  /** Optional lead gallery after Context & Intro (from live-site hero stills). */
  gallery?: readonly VisualMediaItem[];
  sections: readonly VisualWorkSection[];
  media: readonly VisualMediaItem[];
  /** Index of the text tile in the project mosaic (0-based). */
  mosaicTextIndex?: number;
};

export type VisualMosaicCell =
  | { type: 'text'; title: string; tags: readonly string[] }
  | { type: 'image'; src: string; alt: string; label: string };

export const VISUAL_WORK: Record<VisualWorkKind, VisualWorkBody> = {

  alexa: {
    id: 'alexa',
    slug: 'amazon-alexa',
    navLabel: 'Amazon Alexa+',
    title: 'Amazon Alexa+',
    coverSrc: '/visual-design/covers/alexa-plus-cover.jpg',
    coverAlt: 'Amazon Alexa+ — feature page hero',
    tags: ['Feature pages', 'conversational UI', 'device surfaces', 'system design'],
    client: 'Amazon — Alexa teams (contract through BeyondSoft)',
    intro: {
      role: 'Visual / production designer',
      impactHighlights: [
        'Kept marketing pages, conversational UI, and device touchpoints reading as one Alexa+ system.',
        'Shipped under Amazon production timelines without breaking established Alexa visual language.',
      ],
      scopeItems: [
        'Feature pages (including Alexa+ for Kids) that had to feel native to Alexa.',
        'Conversational UI patterns shared across marketing and product surfaces.',
        'Companion device treatments aligned with the same Alexa+ story.',
      ],
      skills: 'Figma, Creative Cloud, Adobe Firefly, design-system thinking, stakeholder management',
    },
    role: 'Visual / production designer',
    scope:
      'Feature pages, conversational UI patterns, and companion device treatments within the Alexa+ system.',
    impact:
      'Marketing, conversational, and device surfaces that read as one Alexa+ system under production timelines.',
    skills: 'Figma, Creative Cloud, Adobe Firefly, design-system thinking, stakeholder management',
    gallery: [
      { src: '/home/teams/alexa-1.jpg', alt: 'Alexa+ for Kids — feature page', label: 'Feature page' },
      { src: '/home/teams/alexa-2.jpg', alt: 'Alexa+ — conversational UI patterns', label: 'Conversational UI' },
      { src: '/home/teams/alexa-3.jpg', alt: 'Alexa+ — device and companion surfaces', label: 'Device surfaces' },
    ],
    sections: [],
    media: [
      { src: '/home/teams/alexa-1.jpg', alt: 'Alexa+ for Kids — feature page', label: 'Feature page' },
      { src: '/home/teams/alexa-2.jpg', alt: 'Alexa+ — conversational UI patterns', label: 'Conversational UI' },
      { src: '/home/teams/alexa-3.jpg', alt: 'Alexa+ — device and companion surfaces', label: 'Device surfaces' },
      { src: '/visual-design/covers/alexa-plus-cover.jpg', alt: 'Alexa+ cover still', label: 'Cover' },
    ],
    mosaicTextIndex: 0,
  },
  dbs: {
    id: 'dbs',
    slug: 'amazon-dbs',
    navLabel: 'Amazon DBS',
    title: 'Production & Visual design for Amazon Devices',
    titleLines: ['Production & Visual design', 'for Amazon Devices'],
    coverSrc: '/visual-design/covers/amazon-dbs-cover.jpg',
    coverAlt: 'Production design for Amazon Devices — homepage creative',
    bannerSrc: '/visual-design/projects/dbs/hero-banner.png',
    bannerAlt:
      'Amazon Devices production design — storefront and campaign placements across desktop and mobile.',
    tags: ['Composition', 'Firefly image optimization', 'web ads', 'traffic ads'],
    client: 'Amazon — contract through BeyondSoft agency',
    intro: {
      role: 'Production designer',
      impactHighlights: [
        'Created digital assets for Prime Day 2024 and Big Deal Days, ensuring consistent design across placements and integrations that supported record-breaking results ($12.9B sales, 375M+ items sold)',
        'Improved visuals with lifestyle imagery AI Firefly optimisation and scalable systems thinking, contributing to conversion lifts of up to 20% during events with 3–5× traffic spikes',
        'Tested and provided support for the implementation of a new production workflow transition from Photoshop to Figma. This new workflow is at least 50% faster',
      ],
      scopeItems: [
        'Delivered high-volume, pixel-perfect assets on tight timelines.',
        'Partnered seamlessly with PMs, art directors, and engineers.',
        'Upheld a rigorous QA bar from composition through Firefly optimisation and final delivery.',
      ],
      skills: 'Figma, Creative Cloud, Adobe Firefly, Design system / workflow development, stakeholder management',
    },
    role: 'Production designer',
    scope: 'Delivered high-volume, pixel-perfect assets on tight timelines. Partnered seamlessly with PMs, art directors, and engineers. Upheld a rigorous QA bar from composition through Firefly optimisation and final delivery.',
    impact: 'Prime Day / Big Deal Days assets supporting record results; Firefly optimisation and a production workflow at least 50% faster.',
    skills: 'Figma, Creative Cloud, Adobe Firefly, Design system / workflow development, stakeholder management',
    sections: [
      {
        heading: 'Homepage & offsite marketing ads',
        subsections: [
          {
            heading: 'Events',
            body: 'Notoriously tight deadlines. In this case, the last 3 examples feature bespoke render compositions that were done compositing render files. In the first example, the only design input was the copy.',
            mediaLayout: 'rows',
            mediaRows: [
              {
                flex: [1],
                items: [
                  {
                    src: '/visual-design/projects/dbs/events-hero-wide.jpg',
                    alt: 'Prime Big Deal Days tall hero — desktop',
                    label: 'Desktop tall hero',
                  },
                ],
              },
              {
                flex: [1, 1, 1],
                items: [
                  {
                    src: '/visual-design/projects/dbs/events-mobile-smart-home.jpg',
                    alt: 'Prime Big Deal Days mobile hero — smart home deals',
                    label: 'Smart home',
                  },
                  {
                    src: '/visual-design/projects/dbs/events-hero-mobile.jpg',
                    alt: 'Prime Big Deal Days mobile hero — early device deals',
                    label: 'Device deals',
                  },
                  {
                    src: '/visual-design/projects/dbs/events-mobile-kindle.jpg',
                    alt: 'Prime Big Deal Days mobile hero — Kindle and Luna',
                    label: 'Kindle',
                  },
                ],
              },
            ],
          },
          {
            heading: 'Product launches',
            mediaLayout: 'rows',
            mediaRows: [
              {
                flex: [1],
                items: [
                  {
                    src: '/visual-design/projects/dbs/launches-wide-banner.jpg',
                    alt: 'Echo Spot launch — wide mobile banner',
                    label: 'Wide banner',
                  },
                ],
              },
              {
                flex: [1, 1, 0.5625],
                items: [
                  {
                    src: '/visual-design/projects/dbs/launches-square.jpg',
                    alt: 'Echo Spot launch — square traffic placement',
                    label: 'Square traffic',
                  },
                  {
                    src: '/visual-design/projects/dbs/launches-facebook.png',
                    alt: 'Echo Spot launch — Facebook social',
                    label: 'Facebook',
                  },
                  {
                    src: '/visual-design/projects/dbs/launches-snapchat.png',
                    alt: 'Echo Spot launch — Snapchat social',
                    label: 'Snapchat',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        heading: 'Custom backgrounds',
        subsections: [
          {
            heading: 'For Amazon partners',
            body: 'A rough version for this background was handed over for production. Had to be edited manually to optimize accessibility and the concept.',
            mediaLayout: 'rows',
            mediaRows: [
              {
                flex: [1],
                items: [
                  {
                    src: '/visual-design/projects/dbs/backgrounds-process-01.jpg',
                    alt: 'Game Pass partner campaign on the Amazon homepage',
                    label: 'Homepage',
                  },
                ],
              },
              {
                flex: [1.145, 0.625],
                items: [
                  {
                    src: '/visual-design/projects/dbs/backgrounds-process-02.png',
                    alt: 'Game Pass partner campaign — landscape hero',
                    label: 'Landscape',
                  },
                  {
                    src: '/visual-design/projects/dbs/backgrounds-process-03.jpg',
                    alt: 'Game Pass partner campaign — portrait placement',
                    label: 'Portrait',
                  },
                ],
              },
            ],
          },
          {
            heading: 'For high visibility events',
            mediaLayout: 'rows',
            mediaRows: [
              {
                flex: [1],
                items: [
                  {
                    src: '/visual-design/projects/dbs/backgrounds-desktop.jpg',
                    alt: 'NBA Fire TV promo — desktop tall hero',
                    label: 'Desktop hero',
                  },
                ],
              },
              {
                flex: [1],
                items: [
                  {
                    src: '/visual-design/projects/dbs/backgrounds-mobile.jpg',
                    alt: 'NBA Fire TV promo — mobile tall hero',
                    label: 'Mobile hero',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        heading: 'Localization',
        mediaLayout: 'grid',
        media: [
          {
            src: '/visual-design/projects/dbs/locale-fr.jpg',
            alt: 'Prime Big Deal Days mobile hero — French Canada',
            label: 'FR',
          },
          {
            src: '/visual-design/projects/dbs/locale-es.jpg',
            alt: 'Prime Big Deal Days mobile hero — Spanish US',
            label: 'ES',
          },
        ],
      },
      {
        heading: "Creatives done as part of Amazon's AI foundation project",
        body: "These creatives feature new, custom made device UI's and the use of Adobe Firefly to optimise lifestyle imagery for different web ad formats",
        media: [
          {
            src: '/visual-design/projects/dbs/ai-section-hero.jpg',
            alt: "Creatives done as part of Amazon's AI foundation project",
            label: 'AI Foundation',
          },
        ],
        subsections: [
          {
            heading: 'Using gen Ai to optimise lifestyle imagery',
            carousel: [
              {
                src: '/visual-design/projects/dbs/ai-scroll1-with-props.jpg',
                alt: 'AI Foundation desktop hero — lifestyle with props',
                label: 'Desktop — with props',
              },
              {
                src: '/visual-design/projects/dbs/ai-scroll1-no-props.jpg',
                alt: 'AI Foundation desktop hero — lifestyle without props',
                label: 'Desktop — no props',
              },
              {
                src: '/visual-design/projects/dbs/ai-scroll2-with-props.jpg',
                alt: 'AI Foundation mobile hero — lifestyle with props',
                label: 'Mobile — with props',
              },
              {
                src: '/visual-design/projects/dbs/ai-scroll2-no-props.jpg',
                alt: 'AI Foundation mobile hero — lifestyle without props',
                label: 'Mobile — no props',
              },
            ],
          },
          {
            heading: 'Custom UI + gen ai imagery for A&B testing',
            mediaLayout: 'grid',
            media: [
              {
                src: '/visual-design/projects/dbs/ai-slate-hypnos-t1.jpg',
                alt: 'Echo Show 5 slate — Hypnos treatment T1',
                label: 'Hypnos T1',
              },
              {
                src: '/visual-design/projects/dbs/ai-slate-hypnos-t3.jpg',
                alt: 'Echo Show 5 slate — Hypnos treatment T3',
                label: 'Hypnos T3',
              },
              {
                src: '/visual-design/projects/dbs/ai-slate-rhodes-t1.jpg',
                alt: 'Echo Show 5 slate — Rhodes treatment T1',
                label: 'Rhodes T1',
              },
              {
                src: '/visual-design/projects/dbs/ai-slate-rhodes-t4.jpg',
                alt: 'Echo Show 5 slate — Rhodes treatment T4',
                label: 'Rhodes T4',
              },
            ],
          },
        ],
      },
      {
        heading: 'Customized templates for ads with messaging over-arching multiple ideas',
        body: 'Some of the assets done needed new UI, now in use.',
        mediaLayout: 'rows',
        mediaRows: [
          {
            flex: [1],
            items: [
              {
                src: '/visual-design/projects/dbs/templates-tall-hero.jpg',
                alt: 'Customized tall hero mobile template',
                label: 'Tall hero',
              },
            ],
          },
          {
            flex: [0.5, 1.2],
            items: [
              {
                src: '/visual-design/projects/dbs/templates-halfpage.png',
                alt: 'Customized half-page desktop ad template',
                label: 'Half-page',
              },
              {
                src: '/visual-design/projects/dbs/templates-rectangle.jpg',
                alt: 'Customized rectangle ad template family',
                label: 'Rectangle',
              },
            ],
          },
          {
            flex: [1],
            items: [
              {
                src: '/visual-design/projects/dbs/templates-wide-mobile.jpg',
                alt: 'Customized wide mobile banner template',
                label: 'Wide mobile',
              },
            ],
          },
        ],
      },
      {
        heading: 'Detail page production',
        body: 'This special edition tablet detail page required custom render compositions and detail page construction against tight deadlines',
        media: [
          {
            src: '/visual-design/projects/dbs/detail-collage.png',
            alt: 'Detail page production',
            label: 'Detail page production',
          },
        ],
      },
    ],
    media: [
      { src: '/visual-design/projects/dbs/events-hero-wide.jpg', alt: 'Event homepage hero', label: 'Event homepage hero' },
      { src: '/visual-design/projects/dbs/launches-square.jpg', alt: 'Product launch traffic', label: 'Product launch traffic' },
      { src: '/visual-design/projects/dbs/ai-section-hero.jpg', alt: 'AI Foundation hero', label: 'AI Foundation hero' },
      { src: '/visual-design/projects/dbs/detail-collage.png', alt: 'Detail page collage', label: 'Detail page collage' },
    ],
    mosaicTextIndex: 1,
  },
  covantis: {
    id: 'covantis',
    slug: 'covantis',
    navLabel: 'Covantis',
    title: 'Website for Covantis.io',
    coverSrc: '/visual-design/covers/covantis-cover.jpg',
    coverAlt: 'Website for Covantis.io',
    tags: ['Web design', 'art direction', 'ux/ui'],
    client: 'Covantis.io — modern technology for the agri-commodity industry',
    intro: {
      role: 'UX/UI designer',
      impactHighlights: [
        '75% improvement in core UX metrics (e.g. usability, task completion, satisfaction)',
        'SEO + UX saw organic traffic rise ~85% in 3 months after adopting improved usability and page experience',
        'Reduced onboarding time for new enterprise clients by 20–30% with clearer navigation and support flows.',
        'Increased demo-to-adoption conversion by 15–25% through improved website messaging and UX clarity',
      ],
      scopeItems: [
        'I aligned stakeholders on a creative direction that reinforced the company’s tech-forward value proposition by extending the existing brand system for the website redesign.',
        'Following this, I collaborated with peers to evolve their Figma design system to respond to the first part of my work.',
        'Developed interaction techniques that strengthen user experience',
      ],
      skills: 'Figma, Design system maintenance and evolution, rapid on-boarding, stakeholder management, user experience, clearly articulating objective design choices to stakeholders to positively impact project outcomes',
    },
    role: 'UX/UI designer',
    scope: 'I aligned stakeholders on a creative direction that reinforced the company’s tech-forward value proposition by extending the existing brand system for the website redesign. Following this, I collaborated with peers to evolve their Figma design system to respond to the first part of my work. Developed interaction techniques that strengthen user experience',
    impact: '75% improvement in core UX metrics (e.g. usability, task completion, satisfaction) SEO + UX saw organic traffic rise ~85% in 3 months after adopting improved usability and page experience',
    skills: 'Figma, Design system maintenance and evolution, rapid on-boarding, stakeholder management, user experience, clearly articulating objective design choices to stakeholders to positively impact project outcomes',
    gallery: [
      { src: '/visual-design/projects/covantis/hero-intro-01.png', alt: 'Project still', label: 'Project still' },
      { src: '/visual-design/projects/covantis/hero-intro-02.png', alt: 'Project still', label: 'Project still' },
    ],
    sections: [
      {
        heading: 'Digital color palette',
        body: 'The palette increases legibility & flexibility for the design of UI components. Tints are meant for secondary or background elements.',
        media: [
          {
            src: '/visual-design/projects/covantis/digital-color-palette-01.png',
            alt: 'Digital color palette',
            label: 'Digital color palette',
          },
        ],
        captionedMedia: [
          {
            caption: 'Primary digital palette',
            media: {
              src: '/visual-design/projects/covantis/primary-digital-palette-01.png',
              alt: 'Primary digital palette',
              label: 'Primary digital palette',
            },
          },
          {
            caption: 'Secondary palette (tints)',
          },
        ],
      },
      {
        heading: 'Typography',
        body: 'The primary typeface is Poppins.',
        media: [
          {
            src: '/visual-design/projects/covantis/typography-01.png',
            alt: 'Typography',
            label: 'Typography',
          },
        ],
      },
      {
        heading: 'User interface and screens',
        body: 'Examples of visual interfaces and solutions for communicating the right information.',
        mediaLayout: 'rows',
        mediaRows: [
          {
            flex: [13, 4],
            items: [
              {
                src: '/visual-design/projects/covantis/user-interface-and-screens-01.png',
                alt: 'Covantis UI — desktop screens',
                label: 'Desktop screens',
              },
              {
                src: '/visual-design/projects/covantis/user-interface-and-screens-02.gif',
                alt: 'Covantis UI — mobile detail',
                label: 'Mobile detail',
              },
            ],
          },
          {
            flex: [4, 13],
            items: [
              {
                src: '/visual-design/projects/covantis/user-interface-and-screens-03.png',
                alt: 'Covantis UI — mobile frame',
                label: 'Mobile frame',
              },
              {
                src: '/visual-design/projects/covantis/user-interface-and-screens-04.gif',
                alt: 'Covantis UI — product flow',
                label: 'Product flow',
              },
            ],
          },
          {
            flex: [4, 13],
            items: [
              {
                src: '/visual-design/projects/covantis/user-interface-and-screens-05.gif',
                alt: 'Covantis UI — mobile interaction',
                label: 'Mobile interaction',
              },
              {
                src: '/visual-design/projects/covantis/user-interface-and-screens-06.png',
                alt: 'Covantis UI — desktop composition',
                label: 'Desktop composition',
              },
            ],
          },
        ],
      },
    ],
    media: [
      { src: '/visual-design/projects/covantis/hero-intro-01.png', alt: 'Project still', label: 'Project still' },
      { src: '/visual-design/projects/covantis/hero-intro-02.png', alt: 'Project still', label: 'Project still' },
      { src: '/visual-design/projects/covantis/digital-color-palette-01.png', alt: 'Digital color palette', label: 'Digital color palette' },
      { src: '/visual-design/projects/covantis/primary-digital-palette-01.png', alt: 'Primary digital palette', label: 'Primary digital palette' },
      { src: '/visual-design/projects/covantis/typography-01.png', alt: 'Typography', label: 'Typography' },
      { src: '/visual-design/projects/covantis/user-interface-and-screens-01.png', alt: 'User interface and screens', label: 'User interface and screens' },
      { src: '/visual-design/projects/covantis/user-interface-and-screens-02.gif', alt: 'User interface and screens', label: 'User interface and screens' },
      { src: '/visual-design/projects/covantis/user-interface-and-screens-03.png', alt: 'User interface and screens', label: 'User interface and screens' },
    ],
    mosaicTextIndex: 1,
  },
  kamau: {
    id: 'kamau',
    slug: 'kamau',
    navLabel: 'Kamau',
    title: 'Visual Identity for Kamau & The Wolf',
    coverSrc: '/visual-design/projects/kamau/cover.png',
    coverAlt: 'Visual Identity for Kamau & The Wolf',
    tags: ['Logomark', 'Wordmark', 'Branding'],
    client: 'Kamau & The Wolf — hip hop duo from Geneva, Switzerland',
    intro: {
      role: 'Brand identity designer',
      impactHighlights: [
        'The hip hop duo was invited to a radio talk show, where their brand was complimented. Meaning there was heavy impact in awareness and engagement with core audience',
        'With this brand, Kamau&thewolf could expect an increase in follower growth after shows / merch drops and increase in revenue from their concerts and events.',
      ],
      scopeItems: [
        'Bringing together stakeholders to constantly check on the development of the wordmark, logomark and visualisation of how this brand would look',
      ],
      skills: 'Adobe Illustrator, Photoshop and InDesign, manual sketching',
    },
    role: 'Brand identity designer',
    scope: 'Bringing together stakeholders to constantly check on the development of the wordmark, logomark and visualisation of how this brand would look',
    impact: 'The hip hop duo was invited to a radio talk show, where their brand was complimented. Meaning there was heavy impact in awareness and engagement with core audience With this brand, Kamau&thewolf could expect an increase ',
    skills: 'Adobe Illustrator, Photoshop and InDesign, manual sketching',
    gallery: [
      { src: '/visual-design/projects/kamau/hero-intro-01.png', alt: 'Project still', label: 'Project still' },
      { src: '/visual-design/projects/kamau/hero-intro-02.png', alt: 'Project still', label: 'Project still' },
      { src: '/visual-design/projects/kamau/hero-intro-03.png', alt: 'Project still', label: 'Project still' },
    ],
    sections: [
      {
        heading: 'Ideation and inspiration',
        body: 'The concept blends Princess Mononoke with Ralph Lauren—drawing on Kamau and the wolf as symbolic anchors to create a visual world that feels whimsical yet grounded, echoing the tone of their music.',
        media: [
          { src: '/visual-design/projects/kamau/ideation-and-inspiration-01.png', alt: 'Ideation and inspiration', label: 'Ideation and inspiration' },
        ],
      },
      {
        heading: 'Color Palette',
        body: 'Earthy tones connect the duo to their African inspiration',
        media: [
          { src: '/visual-design/projects/kamau/color-palette-01.png', alt: 'Color Palette', label: 'Color Palette' },
          { src: '/visual-design/projects/kamau/primary-colors-01.png', alt: 'Primary colors', label: 'Primary colors' },
        ],
      },
      {
        heading: 'Typography: font pairing',
        body: 'Appropriate choices to address the contemporary and fantastical brand values.',
        media: [
          { src: '/visual-design/projects/kamau/typography-font-pairing-01.png', alt: 'Typography: font pairing', label: 'Typography: font pairing' },
        ],
      },
      {
        heading: 'Wordmark and logomark',
        body: 'In the wordmark, the use of the Adobe Caslon Pro ampersand speaks to the core values of the rap duo. The logomark is a result of the driving inspiration for the project. That is, a logo that would work well on clothes and lockups.',
        media: [
          { src: '/visual-design/projects/kamau/wordmark-and-logomark-01.png', alt: 'Wordmark and logomark', label: 'Wordmark and logomark' },
        ],
      },
    ],
    media: [
      { src: '/visual-design/projects/kamau/hero-intro-01.png', alt: 'Project still', label: 'Project still' },
      { src: '/visual-design/projects/kamau/hero-intro-02.png', alt: 'Project still', label: 'Project still' },
      { src: '/visual-design/projects/kamau/hero-intro-03.png', alt: 'Project still', label: 'Project still' },
      { src: '/visual-design/projects/kamau/ideation-and-inspiration-01.png', alt: 'Ideation and inspiration', label: 'Ideation and inspiration' },
      { src: '/visual-design/projects/kamau/color-palette-01.png', alt: 'Color Palette', label: 'Color Palette' },
      { src: '/visual-design/projects/kamau/primary-colors-01.png', alt: 'Primary colors', label: 'Primary colors' },
      { src: '/visual-design/projects/kamau/typography-font-pairing-01.png', alt: 'Typography: font pairing', label: 'Typography: font pairing' },
      { src: '/visual-design/projects/kamau/wordmark-and-logomark-01.png', alt: 'Wordmark and logomark', label: 'Wordmark and logomark' },
    ],
    mosaicTextIndex: 1,
  },
  spice: {
    id: 'spice',
    slug: 'spice-angel',
    navLabel: 'Spice Angel',
    title: 'Visual Identity for Spice Angel',
    coverSrc: '/visual-design/projects/spice/cover.png',
    coverAlt: 'Visual Identity for Spice Angel',
    tags: ['Rebranding', 'Editorial design', 'Packaging design'],
    client: 'Spice Angel — an Asian food product company',
    intro: {
      role: 'Graphic brand designer',
      impactHighlights: [
        'Thanks to this project, Spice Angel was able to formalize their product and join popular distributors in Geneva, Switzerland',
      ],
      scopeItems: [
        'Research to inform design decisions surrounding the wordmark',
        'thinking of a scalable system that involved the use of illustration and image treatments to construct a brand world that Spice Angel could draw from for products, content creation and design artefacts',
        'Design execution of packaging and editorial material using the established brand world',
      ],
      skills: 'Photoshop, InDesign, Illustrator, Adobe Fresco for illustration',
    },
    role: 'Graphic brand designer',
    scope: 'Research to inform design decisions surrounding the wordmark thinking of a scalable system that involved the use of illustration and image treatments to construct a brand world that Spice Angel could draw from for products, content creation and design artefacts Design execution of packaging and editorial material using the established brand world',
    impact: 'Thanks to this project, Spice Angel was able to formalize their product and join popular distributors in Geneva, Switzerland',
    skills: 'Photoshop, InDesign, Illustrator, Adobe Fresco for illustration',
    gallery: [
      { src: '/visual-design/projects/spice/hero-intro-01.png', alt: 'Project still', label: 'Project still' },
      { src: '/visual-design/projects/spice/hero-intro-02.png', alt: 'Project still', label: 'Project still' },
      { src: '/visual-design/projects/spice/hero-intro-03.png', alt: 'Project still', label: 'Project still' },
    ],
    sections: [
      {
        heading: 'Ideation and inspiration',
        body: 'Sourcing from multiple traditional and contemporary asian typographic styles to source visual elements that reinforce & communicate Spice Angel\'s spirit',
        media: [
          { src: '/visual-design/projects/spice/ideation-and-inspiration-01.png', alt: 'Ideation and inspiration', label: 'Ideation and inspiration' },
        ],
      },
      {
        heading: 'Color palette',
        body: 'Bright colors are used to make the packaging stand out in the market.',
        media: [
          { src: '/visual-design/projects/spice/color-palette-01.png', alt: 'Color palette', label: 'Color palette' },
        ],
      },
      {
        heading: 'Brand elements: Treated images and custom made illustration',
        body: 'Illustrations are accompanied by grainy/de-saturated, prime ingredients images. These are used in packaging and print material to support the brand world.',
        media: [
          { src: '/visual-design/projects/spice/brand-elements-treated-images-and-custom-made-illustration-01.png', alt: 'Brand elements: Treated images and custom made illustration', label: 'Brand elements: Treated images and custom made illustration' },
        ],
        mediaLayout: 'rows',
        mediaRows: [
          {
            flex: [1, 1],
            items: [
              {
                src: '/visual-design/projects/spice/brand-elements-veggies-01.gif',
                alt: 'Spice Angel treated-ingredient animation — gif maker veggies 1',
                label: 'Gif maker veggies 1',
              },
              {
                src: '/visual-design/projects/spice/brand-elements-veggies-02.gif',
                alt: 'Spice Angel treated-ingredient animation — gif maker veggies 2',
                label: 'Gif maker veggies 2',
              },
            ],
          },
        ],
      },
      {
        heading: 'Typography: font pairing',
        body: 'The script font is used to provide a craftsy, warm, french boulangerie feeling. The sans serif provides legibility and structure. Both aim to support and complement the wordmark in print.',
        media: [
          { src: '/visual-design/projects/spice/typography-font-pairing-01.png', alt: 'Typography: font pairing', label: 'Typography: font pairing' },
        ],
      },
      {
        heading: 'Typography: wordmark',
        body: 'Custom made, visual cues from contemporary Vietnamese typography & brush strokes of classical Korean calligraphy techniques',
        media: [
          { src: '/visual-design/projects/spice/typography-wordmark-01.png', alt: 'Typography: wordmark', label: 'Typography: wordmark' },
        ],
      },
    ],
    media: [
      { src: '/visual-design/projects/spice/hero-intro-01.png', alt: 'Project still', label: 'Project still' },
      { src: '/visual-design/projects/spice/hero-intro-02.png', alt: 'Project still', label: 'Project still' },
      { src: '/visual-design/projects/spice/hero-intro-03.png', alt: 'Project still', label: 'Project still' },
      { src: '/visual-design/projects/spice/ideation-and-inspiration-01.png', alt: 'Ideation and inspiration', label: 'Ideation and inspiration' },
      { src: '/visual-design/projects/spice/color-palette-01.png', alt: 'Color palette', label: 'Color palette' },
      { src: '/visual-design/projects/spice/brand-elements-treated-images-and-custom-made-illustration-01.png', alt: 'Brand elements: Treated images and custom made illustration', label: 'Brand elements: Treated images and custom made illustration' },
      { src: '/visual-design/projects/spice/typography-font-pairing-01.png', alt: 'Typography: font pairing', label: 'Typography: font pairing' },
      { src: '/visual-design/projects/spice/typography-wordmark-01.png', alt: 'Typography: wordmark', label: 'Typography: wordmark' },
    ],
    mosaicTextIndex: 1,
  },
  ajediam: {
    id: 'ajediam',
    slug: 'ajediam',
    navLabel: 'Ajediam',
    title: 'Visual Identity & Website for Ajediam.com',
    coverSrc: '/visual-design/minigrid/ajediam.png',
    coverAlt: 'Visual Identity & Website for Ajediam.com',
    tags: ['Rebranding', 'design systems', 'ux/ui', 'design strategy'],
    client: 'Ajediam.com — boutique jewelry & diamond retailer',
    intro: {
      role: 'Visual UX / brand designer',
      impactHighlights: [
        'Increased user engagement through a refreshed user experience, which boosted daily users from 150 to 400+ by 2024 and +24.62% average user retention.',
      ],
      scopeItems: [
        '1) company rebranding',
        '2) design system creation, design of branded artefacts — implementing in cohesive user experiences across tools and layouts of the rebranded website',
      ],
      skills:
        'Figma, Creative Cloud, typography and layout, atomic design, story-telling, brand strategy, product design thinking, responsive design',
    },
    role: 'Visual UX / brand designer',
    scope:
      'Company rebranding; design system creation and branded artefacts; cohesive UX across tools and layouts of the rebranded website.',
    impact:
      'Increased user engagement through a refreshed user experience — daily users from 150 to 400+ by 2024 and +24.62% average user retention.',
    skills:
      'Figma, Creative Cloud, typography and layout, atomic design, story-telling, brand strategy, product design thinking, responsive design',
    gallery: [
      {
        src: '/visual-design/projects/ajediam/hero-intro-02.png',
        alt: 'Ajediam rebrand — identity still',
        label: 'Identity',
      },
    ],
    sections: [
      {
        heading: 'Ideation and Inspiration / Symbols of Flemish excellence',
        body:
          "Ajediam's re-branding was started by identifying core values—legacy, trust, and establishment—and connecting them to the city's diamond trading heritage through typography and visual cues, bringing the rebrand's spirit to life.",
        media: [
          {
            src: '/visual-design/projects/ajediam/ideation-symbols-01.png',
            alt: 'Symbols of Flemish excellence — inspiration board',
            label: 'Symbols of Flemish excellence',
          },
        ],
      },
      {
        heading: 'Color palette',
        body:
          "A benchmark study showed that these colors would both differentiate us in the Antwerp diamond industry and reinforce the brand's established identity.",
        media: [
          {
            src: '/visual-design/projects/ajediam/color-palette-01.png',
            alt: 'Ajediam color palette',
            label: 'Color palette',
          },
        ],
        captionedMedia: [
          {
            caption: 'Primary colors',
            media: {
              src: '/visual-design/projects/ajediam/primary-colors-01.png',
              alt: 'Ajediam primary colors',
              label: 'Primary colors',
            },
          },
          {
            caption: 'Secondary colors',
          },
        ],
      },
      {
        heading: 'Typography: font pairing',
        body:
          'Typefaces with Belgian roots form a flexible design system to produce editorial quality, diamond educational material and other articles.',
        media: [
          {
            src: '/visual-design/projects/ajediam/typography-font-pairing-01.png',
            alt: 'Ajediam typography font pairing',
            label: 'Font pairing',
          },
        ],
      },
      {
        heading: 'Typography: Wordmark',
        body:
          'Guyot typography, a modern reinterpretation of Plantin with a ligature to enhance rhythm and render an identifiable word-mark.',
        media: [
          {
            src: '/visual-design/projects/ajediam/typography-wordmark-01.png',
            alt: 'Ajediam wordmark construction',
            label: 'Wordmark',
          },
          {
            src: '/visual-design/projects/ajediam/wordmark-01.png',
            alt: 'Ajediam wordmark in application',
            label: 'Wordmark application',
          },
        ],
      },
      {
        heading: 'Setting creative direction: Photography',
        body:
          'We established a distinct product photography and image style to be used throughout our multiple touch-points.',
        media: [
          {
            src: '/visual-design/projects/ajediam/photography-direction-01.png',
            alt: 'Ajediam photography direction',
            label: 'Photography direction',
          },
        ],
      },
      {
        heading: 'Editorial design',
        body:
          'Magazine and environmental applications that extend the same typographic and photographic language into print and space — proof the system holds outside the browser.',
        media: [
          {
            src: '/visual-design/projects/ajediam/editorial-magazine-01.jpg',
            alt: 'Ajediam editorial magazine — MM Magazine MZ-HTL-02',
            label: 'Magazine',
          },
          {
            src: '/visual-design/projects/ajediam/editorial-poster-01.jpg',
            alt: 'Ajediam indoor brand poster — MM IndoorPoster IP-D-031',
            label: 'Indoor poster',
          },
        ],
      },
      {
        heading: 'Content creation\nfor marketing funnel',
        body:
          'The Famous Diamonds Series is the established creative direction for short-form educational videos. These pieces were built as a prototype for a creative team I oversaw to follow and extend.',
        embeds: [
          { id: '1226791350', hash: '616b9d021d', title: 'The Sancy diamond' },
          { id: '1226791351', title: 'The Orlov diamond' },
          { id: '1226791352', hash: '565cfaa52a', title: 'The Eureka diamond' },
        ],
      },
      {
        heading: 'Design system: UI components',
        body:
          'These are examples of user interfaces and visual treatments, where we can appreciate the rebranding applied to the UI.',
        media: [
          {
            src: '/visual-design/projects/ajediam/hero-intro-03.png',
            alt: 'Ajediam rebrand — digital surface',
            label: 'Digital surface',
          },
          {
            src: '/visual-design/projects/ajediam/hero-intro-04.png',
            alt: 'Ajediam rebrand — product storytelling',
            label: 'Product storytelling',
          },
        ],
        mediaLayout: 'rows',
        mediaRows: [
          {
            flex: [13, 4],
            items: [
              {
                src: '/visual-design/projects/ajediam/ui-components-01.png',
                alt: 'Ajediam UI — desktop components',
                label: 'Desktop components',
              },
              {
                src: '/visual-design/projects/ajediam/ui-components-02.gif',
                alt: 'Ajediam UI — interaction detail',
                label: 'Interaction detail',
              },
            ],
          },
          {
            flex: [4, 13],
            items: [
              {
                src: '/visual-design/projects/ajediam/ui-components-04.png',
                alt: 'Ajediam UI — mobile frame',
                label: 'Mobile frame',
              },
              {
                src: '/visual-design/projects/ajediam/ui-components-05.gif',
                alt: 'Ajediam UI — product flow',
                label: 'Product flow',
              },
            ],
          },
          {
            flex: [13, 4],
            items: [
              {
                src: '/visual-design/projects/ajediam/ui-components-06.png',
                alt: 'Ajediam UI — desktop composition',
                label: 'Desktop composition',
              },
              {
                src: '/visual-design/projects/ajediam/ui-components-07.gif',
                alt: 'Ajediam UI — mobile interaction',
                label: 'Mobile interaction',
              },
            ],
          },
        ],
      },
      {
        heading: 'Design system: atomic design elements',
        body:
          "The small pieces that conform the system used to build new pages and revamp older ones in Ajediam's refreshed website.",
        media: [
          {
            src: '/visual-design/projects/ajediam/atomic-design-01.png',
            alt: 'Ajediam atomic design elements',
            label: 'Atomic design elements',
          },
        ],
      },
    ],
    media: [
      { src: '/visual-design/projects/ajediam/hero-intro-02.png', alt: 'Ajediam brand overview', label: 'Overview' },
      { src: '/visual-design/projects/ajediam/wordmark-01.png', alt: 'Ajediam wordmark', label: 'Wordmark' },
      { src: '/visual-design/projects/ajediam/editorial-magazine-01.jpg', alt: 'Ajediam magazine', label: 'Editorial' },
      { src: '/visual-design/projects/ajediam/ui-components-01.png', alt: 'Ajediam UI', label: 'UI' },
      { src: '/visual-design/projects/ajediam/editorial-poster-01.jpg', alt: 'Ajediam poster', label: 'Environment' },
    ],
    mosaicTextIndex: 1,
  },

};

export const VISUAL_WORK_PATH_PREFIX = '/work/visual-design';

export function visualWorkPath(kind: VisualRoutedKind | VisualWorkKind): string {
  return `${VISUAL_WORK_PATH_PREFIX}/${VISUAL_WORK[kind].slug}`;
}

export function visualWorkKindFromSlug(slug: string | undefined): VisualRoutedKind | null {
  if (!slug) return null;
  const match = VISUAL_ROUTED_KINDS.find((id) => VISUAL_WORK[id].slug === slug);
  return match ?? null;
}

/** Flat 3-up gallery order — tech lead trio, then branding trio. */
export const VISUAL_LANDING_GRID = (['alexa', 'dbs', 'covantis', 'ajediam', 'kamau', 'spice'] as const).map(
  (id) => VISUAL_WORK[id],
);

/** Build a 3×2 mosaic: one text tile + image tiles (pads from cover if needed). */
export function visualMosaicCells(work: VisualWorkBody): VisualMosaicCell[] {
  const textIndex = Math.min(5, Math.max(0, work.mosaicTextIndex ?? 1));
  const images = [...work.media];
  while (images.length < 5) {
    images.push({
      src: work.coverSrc,
      alt: work.coverAlt,
      label: 'Cover',
    });
  }
  const cells: VisualMosaicCell[] = [];
  let imageCursor = 0;
  for (let i = 0; i < 6; i += 1) {
    if (i === textIndex) {
      cells.push({ type: 'text', title: work.title, tags: work.tags });
    } else {
      const item = images[imageCursor]!;
      imageCursor += 1;
      cells.push({ type: 'image', src: item.src, alt: item.alt, label: item.label });
    }
  }
  return cells;
}

export function visualTagsLabel(tags: readonly string[]): string {
  return tags.join(' • ');
}

export const VISUAL_HOME_TEASER_SLIDES = [
  { image: '/home/teams/alexa-1.jpg', alt: 'Alexa+ for Kids — feature page', caption: 'Amazon Alexa+' },
  { image: '/home/teams/alexa-2.jpg', alt: 'Alexa+ — conversational UI patterns', caption: 'Conversational UI' },
  { image: '/home/teams/alexa-3.jpg', alt: 'Alexa+ — device and companion surfaces', caption: 'Device surfaces' },
  { image: '/home/teams/dbs-1.jpg', alt: 'Amazon storefront — desktop and mobile deal placements', caption: 'Amazon DBS' },
  { image: '/home/teams/dbs-2.jpg', alt: 'Campaign creative — traffic placement variants', caption: 'Traffic variants' },
  { image: '/home/teams/dbs-3.jpg', alt: 'Seasonal campaign — cross-format rollout', caption: 'Seasonal rollout' },
  { image: '/home/teams/covantis-1.jpg', alt: 'circleOut — product landing', caption: 'Covantis' },
  { image: '/home/teams/covantis-2.jpg', alt: 'Covantis — platform narrative', caption: 'Platform narrative' },
] as const;
