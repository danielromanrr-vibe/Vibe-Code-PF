import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import HeroOrbitRing from './components/HeroOrbitRing';
import Footer from './components/Footer';
import AdoptValidationEditorialSection from './components/AdoptValidationEditorialSection';
import { ADOPT_VALIDATION_PHYSICAL_IMAGES, ADOPT_VALIDATION_DIGITAL_IMAGES } from './components/AdoptCaseStudyMedia';
import AdoptCaseStudyOverviewStage from './components/AdoptCaseStudyOverviewStage';
import AdoptCaseStudyParallax from './components/AdoptCaseStudyParallax';
import AdoptProcessOverview, { ADOPT_PROCESS_VALIDATION_LEDE } from './components/AdoptProcessOverview';
import AdoptSystemDesignOverview from './components/AdoptSystemDesignOverview';
import CaseStudyOverviewStage from './components/CaseStudyOverviewStage';
import DriverScopeRail from './components/DriverScopeRail';
import ProcessOverviewSection from './components/ProcessOverviewSection';
import EditorialTabNav from './components/EditorialTabNav';
import StrategicDecisionsSection from './components/StrategicDecisionsSection';
import ThinkingThroughDesignSection from './components/ThinkingThroughDesignSection';
import {
  ADOPT_STRATEGIC_DECISIONS_LEDE,
  ADOPT_STRATEGIC_ITEMS,
} from './content/adoptCaseStudy';
import {
  DRIVER_CASE_STUDY_IMPACT_SUMMARY_LINES,
  DRIVER_CASE_STUDY_LEDE,
  DRIVER_CASE_STUDY_TITLE,
  DRIVER_CONTEXT_METRICS,
  DRIVER_IMPACT_META,
  DRIVER_KEY_INSIGHT,
  DRIVER_OUTCOME_LEDE,
  DRIVER_PROCESS_OVERVIEW_LEDE,
  DRIVER_PROCESS_STEPS,
  DRIVER_STRATEGIC_DECISIONS_LEDE,
  DRIVER_STRATEGIC_ITEMS,
} from './content/driverCaseStudy';
import SectionRhythmDivider from './components/SectionRhythmDivider';
import TokenButton from './components/TokenButton';
import ProjectCarousel from './components/ProjectCarousel';
import AmbientMandalaTrail from './components/AmbientMandalaTrail';
import MandalaBanner from './components/MandalaBanner';
import HeroIntroStarPass from './components/HeroIntroStarPass';
import { heroIntroTiming } from './lib/heroIntroTiming';
import TopNavStrip from './components/TopNavStrip';
import NavBrandingMount from './components/euphoriaMandala/NavBrandingMount';
import { type GalleryImage } from './components/EditorialGalleryModal';

const HERO_PORTRAIT_MANDALA_ANCHOR_ID = 'mandala-anchor-hero-portrait';
const AMAZON_SELECTS_BASE = '/amazon-selects';
function amazonSelect(path: string, isHero?: boolean, caption?: string): GalleryImage {
  const o: { src: string; isHero?: boolean; caption?: string } = {
    src: `${AMAZON_SELECTS_BASE}/${encodeURIComponent(path)}`,
  };
  if (isHero === true) o.isHero = true;
  if (caption) o.caption = caption;
  return o;
}
const AMAZON_TOP_WINDOW_IMAGES: GalleryImage[] = [
  amazonSelect('Alexa-kids-hero.jpg', true, 'Alexa+ — campaign hero'),
  amazonSelect('Alexa-kids-gallery1.png', false, 'Product UI — gallery'),
  amazonSelect('Alexa-kids-gallery2.png', false, 'Lifestyle — context'),
];

const AMAZON_GALLERY_IMAGES: GalleryImage[] = [
  amazonSelect('Hero_2.jpg', true),
  { src: '/amazon-static-2.png' },
  amazonSelect('1605x500 Homepage-Tall-Hero-Mobile-1605x500.jpg'),
  amazonSelect('300x600 As_Di-Desktop-HalfPage-300x600.jpg.png'),
  amazonSelect('600x500 As_Di-Rectangle-600x500.jpg + 300x250 As-Di-Rectangle-300x250.jpg.jpg'),
  amazonSelect('1456x180 As_Di-Mobile-1456x180.jpg + 728x90 As_Di-Mobile-728x90.jpg.jpg'),
  amazonSelect('DBS-1055-AUCC-CA-EN-Baklava-Traffic Assets-Evergreen-As_Di-Mobile-WideBanner-1242x375.jpg'),
  amazonSelect('DBS-1055-AUCC-CA-EN-Baklava-Traffic Assets-Evergreen-Social-Facebook-1200x1200.png'),
  amazonSelect('DBS-1055-AUCC-CA-EN-Baklava-Traffic Assets-Evergreen-Social-SnapChat-1080x1920.png'),
  amazonSelect('DBS-1095-FTV-US-HARISSA_NBA_PROMO_MERCHHomepage-Tall-Hero-Mobile-1236x1080.jpg'),
  amazonSelect('DBS-1095-FTV-US-HARISSA_NBA_PROMO_MERCHHomepage-TallHero-1500x600.jpg'),
  amazonSelect('DBS1444-EVENTS-US-EN-C-5088-PBDDLU-Homepage-TallHero-3000x1200.jpg'),
];

const AI_FOUNDATION_BASE = '/ai-foundation';
function aiFoundation(path: string, isHero?: boolean, caption?: string): GalleryImage {
  const o: { src: string; isHero?: boolean; caption?: string } = {
    src: `${AI_FOUNDATION_BASE}/${encodeURIComponent(path)}`,
  };
  if (isHero === true) o.isHero = true;
  if (caption) o.caption = caption;
  return o;
}
const AMAZON_FIRST_CAROUSEL_IMAGES: GalleryImage[] = [
  aiFoundation('Hero1.jpg', true),
  aiFoundation('DBS-1134-AUCC-US-RHODES_MVT_SLATE-T1_2000X2000 Slates_ProdName-Slate-LEFT-Color2-2000X2000.jpg_.jpg'),
  aiFoundation('DBS-1134-AUCC-US-RHODES_MVT_SLATE-T1_V2_2000X2000 Slates_ProdName-Slate-LEFT-Color3-2000X2000.jpg_.jpg'),
  aiFoundation('DBS-1134-AUCC-US-RHODES_MVT_SLATE-T2_V2_2000X2000 Slates_ProdName-Slate-LEFT-Color3-2000X2000.jpg_.jpg'),
  aiFoundation('DBS-1134-AUCC-US-RHODES_MVT_SLATE-T4_V2_2000X2000 Slates_ProdName-Slate-LEFT-Color2-2000X2000.jpg_ copy.jpg'),
  aiFoundation('DBS-1154-AUCC-US-RHODES_EXPERIM_PILOT_KAEDIM-Homepage-Tall-Hero-Mobile-1236x1080_b_T1Homepage-Tall-Hero-Mobile-1236x1080_t2.jpg'),
  aiFoundation('DBS-1154-AUCC-US-RHODES_EXPERIM_PILOT_KAEDIM-Homepage-Tall-Hero-Mobile-1236x1080_b_T1Homepage-TallHero-1500x600_t2.jpg'),
  aiFoundation('DBS-1154-AUCC-US-RHODES_EXPERIM_PILOT_KAEDIM-Homepage-Tall-Hero-Mobile-1236x1080_t3.jpg'),
  aiFoundation('DBS-1154-AUCC-US-RHODES_EXPERIM_PILOT_KAEDIM-Homepage-TallHero-1500x600_t3.jpg'),
  aiFoundation('DBS-1893-no-props-1236x1080.png'),
  aiFoundation('DBS-1893-Tungsten-1236x1080.png'),
  aiFoundation('DBS-1893-Tungsten-3000x1200.png'),
  aiFoundation('DBS-1893-no-props-3000x1200.png'),
];

/** DBS tab: merged carousel + selects; each tile has a one-line caption in grid view. */
const AMAZON_DBS_CONSOLIDATED_IMAGES: GalleryImage[] = [
  { ...AMAZON_FIRST_CAROUSEL_IMAGES[0], caption: 'AI Foundation — hero' },
  { ...AMAZON_FIRST_CAROUSEL_IMAGES[2], caption: 'Rhodes slate — color exploration' },
  { ...AMAZON_FIRST_CAROUSEL_IMAGES[3], caption: 'Rhodes slate — variant T2' },
  { ...AMAZON_FIRST_CAROUSEL_IMAGES[4], caption: 'Rhodes slate — variant T4' },
  { src: (AMAZON_GALLERY_IMAGES[0] as { src: string }).src, caption: 'Traffic — tall hero (mobile)' },
  { ...(AMAZON_GALLERY_IMAGES[1] as { src: string }), caption: 'Static — product frame' },
  { src: (AMAZON_GALLERY_IMAGES[9] as { src: string }).src, caption: 'Campaign — NBA promo (mobile)' },
  { src: (AMAZON_GALLERY_IMAGES[10] as { src: string }).src, caption: 'Campaign — NBA promo (desktop)' },
];

/** Case study hero meta — impact lines (short bullets). */
const ADOPT_CASE_STUDY_IMPACT_META = [
  'Field-to-pledge path without warehouse bottleneck',
  'Object, mobile, and ops in one system',
] as const;

/** Case study title — outcome-oriented framing (hero h1). */
const ADOPT_CASE_STUDY_TITLE = 'Designing a scalable fundraising experience for Backpack Brigade';

/** Editorial thesis between hero title and Context & Intro card. */
const ADOPT_CASE_STUDY_IMPACT_SUMMARY_LINES = [
  'Adopt-a-School had to work as one coordinated system—not disconnected touchpoints with a warehouse at the center.',
  'Physical activation and donor engagement create the moment of commitment; digital enrollment, warehouse throughput, and volunteer coordination carry it into partnerships the nonprofit can repeat.',
  'Service and product design connected field presence, pledge capture, and operational clarity so scale did not collapse back into logistics bottlenecks.',
] as const;

/** Hero — subtitle line moved into Context lede (first sentence). */
const ADOPT_CASE_STUDY_LEDE =
  'Product & UX/UI design for Backpack Brigade. 12+ years on food insecurity—Seattle schools, businesses, and donors in steady partnership, not one-off drops.';

/** Key insight — hero meta (two lines at rail width). */
const ADOPT_BEYOND_WAREHOUSE_BODY =
  'Clear pathways extend help beyond the warehouse—structured participation from 150+ research touchpoints for Backpack Brigade.';

/** Validation — Physical prototype subsection lede. */
const ADOPT_VALIDATION_PHYSICAL_LEDE =
  'In-field observation and hands-on runs with the activation object and program surfaces.';

/** Validation — Digital prototype subsection lede. */
const ADOPT_VALIDATION_DIGITAL_LEDE =
  'Mobile map and enrollment validated on device with real participation scenarios.';

/** Inset editorial strip — primary + stacked pair (overlap on md+), matches reference hierarchy. */
const ADOPT_EDITORIAL_OVERLAP = {
  primary: {
    src: '/adopt-a-school/Hero2_Humanize-shot_IMG_9442.jpg',
    alt: 'Volunteer validating the program on-device where decisions actually happen—inventory floor, not slide deck.',
  },
  stackTop: {
    src: '/adopt-a-school/Hero33-case-study.png',
    videoSrc: '/adopt-a-school/school-adoption-map.mp4',
    alt: 'Enrollment map: compresses interest-to-pledge steps so the org captures intent before attention fades.',
  },
  stackBottom: {
    src: '/adopt-a-school/Hero3_.jpg',
    alt: 'Ops floor: where physical throughput and human coordination proved what the system had to encode.',
  },
} as const;

/** Key insight — editorial turning point between process and strategy. */
const ADOPT_KEY_INSIGHT_LINES = [
  { text: 'People noticed the object.', mod: '' },
  { text: 'Very few people scanned it.', mod: 'muted' },
  { text: "Awareness wasn't the problem.", mod: '' },
  { text: 'Converting curiosity into participation was.', mod: 'punch' },
] as const;

const ADOPT_KEY_LEARNINGS_ITEMS = [
  {
    tag: 'What worked',
    body: 'Proxy methods gave behavioral signal without violating ethical limits. Field presence gave the system something real to encode. Tight fidelity decisions kept the timeline—behavioral learning drove where polish went, not convention.',
  },
  {
    tag: "What didn't",
    body: "Scan conversion on the physical artifact was lower than expected. The object earned attention but couldn't close participation alone—staff narration was the missing activation layer.",
  },
  {
    tag: 'Design implications',
    body: 'Physical and digital surfaces have to be treated as a system from the start, not retrofitted. The conversion bottleneck is always one step further than the obvious friction point.',
  },
] as const;

const ADOPT_FINAL_OUTCOME_BODY =
  'The program shipped with a clearer participation model: enrollment surfaces aligned to how people decide, ops constraints encoded early, and discovery moments that earned attention before the ask. The outcome is a system the org can run—not a one-off redesign deck.';

/** Ajediam — brand identity case study (full narrative on Brand identity page, not in Featured work modal). */
const AJEDIAM_CASE_STUDY = {
  title: 'Ajediam',
  role: 'Founding designer - brand identity, product, and web',
  client: 'Ajediam',
  context:
    'B2C jewelry; company-wide rebrand while scaling product, marketing, and the site.',
  scopeHighlights: [
    '• Visual language, type, and brand frame for the company-wide rebrand',
    '• Design system spanning product, marketing, and the new site',
    '• Reusable UI patterns and interaction standards as the product grew',
  ],
  impact: [
    'Brand and product redesign: daily active users 150 -> 400+ by 2024; retention +24.62%.',
    '• One framework for product, marketing, and web.',
    '• Faster cycles from shared foundations and patterns.',
  ],
} as const;

function stripLeadBullet(line: string) {
  return line.replace(/^\s*[•]\s*/, '').trim();
}

function toMetaLines(value: string | readonly string[]) {
  const source: string[] = typeof value === 'string' ? value.split('\n') : Array.from(value);
  return source
    .map((line: string) => stripLeadBullet(line))
    .map((line: string) => line.trim())
    .filter(Boolean);
}

const COVANTIS_BASE = '/covantis';
function covantisImage(path: string, isHero?: boolean, caption?: string): GalleryImage {
  const o: { src: string; isHero?: boolean; caption?: string } = {
    src: `${COVANTIS_BASE}/${path}`,
  };
  if (isHero === true) o.isHero = true;
  if (caption) o.caption = caption;
  return o;
}
const COVANTIS_GALLERY_IMAGES: GalleryImage[] = [
  covantisImage('Hero.png', true, 'Site — hero'),
  covantisImage('grid1.png', false, 'Product — narrative'),
  covantisImage('grid2.png', false, 'Capabilities — grid'),
  covantisImage('grid3.png', false, 'Social proof — tile'),
];

const FEATURED_PROJECTS = [
  {
    id: 'amazon-dbs',
    title: 'Amazon DBS',
    media: [
      {
        note: 'My contribution (DBS, 2024)',
        caption:
          '• Lifestyle imagery across traffic placements\n• AI-assisted workflows (Firefly + internal tools)\n• Repeatable variants without quality drift',
      },
    ],
    role: null,
    scope:
      'Worked with PMs, marketing, and engineering so campaign design stayed scalable, on-brief, and centered on how people use the products.',
    scopeTools: null,
    impact: [
      '• ~50% faster production at DBS while helping roll out Figma on tight timelines.',
      '• Templates and style guides across formats and lines—Prime Day 2024, Big Deal Days, and similar.',
      '• Piloted new production workflows on the AI Foundation team.',
    ],
    skills: null,
  },
  {
    id: 'amazon-alexa',
    title: 'Amazon Alexa+',
    media: [
      {
        note: 'My contribution (Amazon Alexa+, 2025)',
        caption:
          'With art direction and cross-functional partners:\n• Stretch brand guidelines without losing recognition\n• Reuse simple UX patterns for speed\n• Ship and tune core UI (e.g. speech bubbles)',
      },
    ],
    role: null,
    scope:
      'Worked with PMs, marketing, and engineering so campaign design stayed scalable, on-brief, and centered on how people use the products.',
    scopeTools: null,
    impact: [
      '• ~50% faster production at DBS while helping roll out Figma on tight timelines.',
      '• Templates and style guides across formats and lines—Prime Day 2024, Big Deal Days, and similar.',
      '• Piloted new production workflows on the AI Foundation team.',
    ],
    skills: null,
  },
  {
    id: 'covantis',
    title: 'Covantis',
    media: [
      {
        note: 'My contribution',
        caption:
          'Site redesign: visual system, interaction patterns, and copy alignment with SEO.',
      },
    ],
    role: null,
    scope:
      '• One creative direction for a tech-forward read\n• Brand system extended for the new site\n• Figma system evolved with the team for product consistency',
    impact: [
      '• Design system and site architecture tightened end to end.',
      '• Demo-to-adoption up ~20% with clearer product story.',
      '• Organic traffic up ~85% in three months after usability and page-experience fixes.',
    ],
    skills: null,
  },
];

function getFeaturedGallery(projectId: (typeof FEATURED_PROJECTS)[number]['id']): GalleryImage[] {
  if (projectId === 'amazon-alexa') {
    // Keep mockups, but crop so UI dominates.
    return [
      AMAZON_TOP_WINDOW_IMAGES[0],
      AMAZON_TOP_WINDOW_IMAGES[1],
      AMAZON_TOP_WINDOW_IMAGES[2],
    ];
  }

  if (projectId === 'amazon-dbs') {
    return [
      { src: '/amazon-selects/dbs-homepage.png', isHero: true, caption: 'Amazon DBS — homepage' },
      AMAZON_DBS_CONSOLIDATED_IMAGES[6],
      AMAZON_DBS_CONSOLIDATED_IMAGES[7],
      AMAZON_DBS_CONSOLIDATED_IMAGES[1],
    ];
  }

  // Enterprise product surfaces: hero first, then strongest workflow grids.
  return [
    COVANTIS_GALLERY_IMAGES[0],
    COVANTIS_GALLERY_IMAGES[2],
    COVANTIS_GALLERY_IMAGES[1],
    COVANTIS_GALLERY_IMAGES[3],
  ];
}

function hasImageSrc(image: GalleryImage): image is { src: string; isHero?: boolean; caption?: string } {
  return 'src' in image;
}

function getFeaturedObjectPosition(
  projectId: (typeof FEATURED_PROJECTS)[number]['id'],
  slot: number,
  variant: 'hero' | 'support',
) {
  if (projectId === 'amazon-alexa') {
    if (variant === 'hero') return '50% 30%';
    return slot === 0 ? '50% 36%' : slot === 1 ? '54% 34%' : '50% 42%';
  }

  if (projectId === 'amazon-dbs') {
    if (variant === 'hero') return '50% 28%';
    return slot === 0 ? '52% 30%' : slot === 1 ? '50% 34%' : '50% 38%';
  }

  // covantis
  if (variant === 'hero') return '50% 32%';
  return slot === 0 ? '50% 34%' : slot === 1 ? '50% 36%' : '50% 42%';
}

function getFeaturedCropScale(
  projectId: (typeof FEATURED_PROJECTS)[number]['id'],
  slot: number,
  variant: 'hero' | 'support',
) {
  if (projectId === 'amazon-alexa') return variant === 'hero' ? 1.54 : slot === 0 ? 1.42 : 1.36;
  if (projectId === 'amazon-dbs') return variant === 'hero' ? 1.62 : slot === 0 ? 1.46 : 1.4;
  return variant === 'hero' ? 1.46 : slot === 0 ? 1.36 : 1.3;
}

export default function App() {
  const [openAdoptPage, setOpenAdoptPage] = useState(false);
  const [adoptCaseStudyNavSurface, setAdoptCaseStudyNavSurface] = useState<'default' | 'media'>('media');
  const adoptCaseStudyScrollRef = useRef<HTMLDivElement>(null);
  const adoptCaseStudyHeroRef = useRef<HTMLDivElement>(null);
  const [adoptFullCaseStudyOpen, setAdoptFullCaseStudyOpen] = useState(false);
  const [adoptAccordionOpen, setAdoptAccordionOpen] = useState<number | null>(null);
  const [openDesigningAiPage, setOpenDesigningAiPage] = useState(false);
  const [openTouchpointsPage, setOpenTouchpointsPage] = useState(false);
  const [openDriverPage, setOpenDriverPage] = useState(false);
  const [driverCaseStudyNavSurface, setDriverCaseStudyNavSurface] = useState<'default' | 'media'>('media');
  const driverCaseStudyScrollRef = useRef<HTMLDivElement>(null);
  const driverCaseStudyHeroRef = useRef<HTMLDivElement>(null);
  const [driverAccordionOpen, setDriverAccordionOpen] = useState<number | null>(null);
  const [openAboutPage, setOpenAboutPage] = useState(false);
  const [openCvPage, setOpenCvPage] = useState(false);
  const [selectedFeaturedIndex, setSelectedFeaturedIndex] = useState(0);
  const featuredLeftColumnRef = useRef<HTMLDivElement>(null);
  const featuredScopeSlabRef = useRef<HTMLDivElement>(null);
  const featuredImpactSlabRef = useRef<HTMLDivElement>(null);
  const [featuredMediaFrameHeight, setFeaturedMediaFrameHeight] = useState<number | undefined>(undefined);
  const [featuredMediaTopOffset, setFeaturedMediaTopOffset] = useState<number>(0);
  const featuredTabDirRef = useRef<1 | -1>(1);
  const selectFeaturedProject = useCallback(
    (index: number) => {
      if (index === selectedFeaturedIndex) return;
      featuredTabDirRef.current = index > selectedFeaturedIndex ? 1 : -1;
      setSelectedFeaturedIndex(index);
    },
    [selectedFeaturedIndex],
  );
  const [hoveredHeroCard, setHoveredHeroCard] = useState<number | null>(null);
  const [heroStarPassKey, setHeroStarPassKey] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const heroIntroRef = useRef<HTMLDivElement | null>(null);
  const heroH1RowRef = useRef<HTMLDivElement | null>(null);
  const [heroSubtextWidth, setHeroSubtextWidth] = useState<number | undefined>(undefined);
  const [heroPortraitRevealed, setHeroPortraitRevealed] = useState(false);
  const [heroPortraitSessionStamp, setHeroPortraitSessionStamp] = useState(0);
  const [heroBannerLens, setHeroBannerLens] = useState<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });
  const [heroBannerVisible, setHeroBannerVisible] = useState(false);
  const [heroBannerPaletteKey, setHeroBannerPaletteKey] = useState(0);
  const lastMouseMoveAtRef = useRef(0);
  const heroBannerRef = useRef<HTMLDivElement | null>(null);
  const heroBannerVisibleRef = useRef(heroBannerVisible);
  heroBannerVisibleRef.current = heroBannerVisible;
  const heroLensRafRef = useRef(0);
  const heroLensPendingRef = useRef<{
    clientX: number;
    clientY: number;
    bannerRect: DOMRect;
    insideBannerY: boolean;
  } | null>(null);
  const featuredProject = FEATURED_PROJECTS[selectedFeaturedIndex];
  const featuredCarouselSlides = useMemo(
    () =>
      getFeaturedGallery(featuredProject.id)
        .filter(hasImageSrc)
        .slice(0, 3)
        .map((image, index) => {
          const isDbsHero = featuredProject.id === 'amazon-dbs' && index === 0;
          return {
            image: image.src,
            alt: `${featuredProject.title} gallery visual ${index + 1}`,
            caption: image.caption ?? `${featuredProject.title} visual ${index + 1}`,
            objectPosition: isDbsHero ? '50% 50%' : getFeaturedObjectPosition(
              featuredProject.id,
              index,
              index === 0 ? 'hero' : 'support',
            ),
            imageScale: isDbsHero ? undefined : getFeaturedCropScale(featuredProject.id, index, index === 0 ? 'hero' : 'support'),
            objectFit: isDbsHero ? ('contain' as const) : ('cover' as const),
          };
        }),
    [featuredProject.id, featuredProject.title],
  );
  const featuredScopeLines = toMetaLines(featuredProject.scope);
  const featuredImpactLines = toMetaLines(featuredProject.impact);

  useEffect(() => {
    const node = featuredLeftColumnRef.current;
    if (!node) return;

    const grid = node.closest('.home-featured-work-grid');

    const syncHeight = () => {
      const leftRect = node.getBoundingClientRect();
      const leftHeight = Math.round(leftRect.height);
      const scopeEl = featuredScopeSlabRef.current;
      const impactEl = featuredImpactSlabRef.current;
      const topOffset = scopeEl
        ? Math.round(scopeEl.getBoundingClientRect().top - leftRect.top)
        : 0;
      const bottomOffset = impactEl
        ? Math.round(leftRect.bottom - impactEl.getBoundingClientRect().bottom)
        : 0;
      const viewportHeight = leftHeight - topOffset - bottomOffset;
      if (viewportHeight > 0) {
        setFeaturedMediaFrameHeight((prev) => (prev === viewportHeight ? prev : viewportHeight));
        setFeaturedMediaTopOffset((prev) => (prev === topOffset ? prev : topOffset));
      }
    };

    syncHeight();
    const raf = requestAnimationFrame(syncHeight);
    const observer = new ResizeObserver(() => syncHeight());
    observer.observe(node);
    if (grid) observer.observe(grid);
    const scopeNode = featuredScopeSlabRef.current;
    const impactNode = featuredImpactSlabRef.current;
    if (scopeNode) observer.observe(scopeNode);
    if (impactNode) observer.observe(impactNode);
    window.addEventListener('resize', syncHeight);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('resize', syncHeight);
    };
  }, [selectedFeaturedIndex, featuredScopeLines.length, featuredImpactLines.length]);

  /** Selected visual work — directional slide on tab change (slabs + image as one scroll-group read). */
  const fwDir = featuredTabDirRef.current;
  const fwEase = [0.25, 0.85, 0.25, 1] as const;
  const fwReduced = prefersReducedMotion;
  const fwSlabShift = fwReduced ? 0 : 12;
  const fwImgShift = fwReduced ? 0 : 16;
  const featuredWorkScopeMotion = fwReduced
    ? {
        initial: { opacity: 0.28, y: 6 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0 },
        transition: { duration: 0.18, ease: fwEase, delay: 0 },
      }
    : {
        initial: { opacity: 0.2, x: fwDir * fwSlabShift },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0 },
        transition: { duration: 0.2, ease: fwEase, delay: 0 },
      };
  const featuredWorkImpactMotion = fwReduced
    ? {
        initial: { opacity: 0.28, y: 6 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0 },
        transition: { duration: 0.18, ease: fwEase, delay: 0 },
      }
    : {
        initial: { opacity: 0.2, x: fwDir * fwSlabShift },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0 },
        transition: { duration: 0.2, ease: fwEase, delay: 0.02 },
      };
  const featuredWorkImageMotion = fwReduced
    ? {
        initial: { opacity: 0.36, y: 6 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0.2 },
        transition: { duration: 0.22, ease: fwEase, delay: 0 },
      }
    : {
        initial: { opacity: 0.34, x: fwDir * fwImgShift },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0.2 },
        transition: { duration: 0.24, ease: fwEase, delay: 0.01 },
      };

  const closePageViews = () => {
    setOpenAdoptPage(false);
    setOpenDesigningAiPage(false);
    setOpenTouchpointsPage(false);
    setOpenDriverPage(false);
    setOpenAboutPage(false);
    setOpenCvPage(false);
  };

  const handleHomeNavClick = () => {
    closePageViews();
    setHeroStarPassKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAboutNavClick = () => {
    closePageViews();
    setOpenAboutPage(true);
  };

  const handleCvNavClick = () => {
    closePageViews();
    setOpenCvPage(true);
  };

  /** Full-page overlays mount their own TopNavStrip + mandala; keep home strip out to avoid two portaled canvases. */
  const isFullPageOverlayOpen =
    openDesigningAiPage ||
    openAdoptPage ||
    openTouchpointsPage ||
    openDriverPage ||
    openAboutPage ||
    openCvPage;

  useEffect(() => {
    if (openAdoptPage) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [openAdoptPage]);

  useEffect(() => {
    if (openDriverPage) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [openDriverPage]);

  useEffect(() => {
    if (!openDriverPage) {
      setDriverCaseStudyNavSurface('media');
      setDriverAccordionOpen(null);
      return;
    }
    const scrollEl = document.getElementById('driver-case-study-scroll');
    const heroEl = driverCaseStudyHeroRef.current;
    if (!scrollEl || !heroEl) return;

    const navThresholdPx = 52;
    const sync = () => {
      const { bottom } = heroEl.getBoundingClientRect();
      setDriverCaseStudyNavSurface(bottom > navThresholdPx ? 'media' : 'default');
    };

    sync();
    scrollEl.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    return () => {
      scrollEl.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [openDriverPage]);

  useEffect(() => {
    if (!openAdoptPage) {
      setAdoptCaseStudyNavSurface('media');
      setAdoptFullCaseStudyOpen(false);
      setAdoptAccordionOpen(null);
      return;
    }
    const scrollEl = document.getElementById('adopt-case-study-scroll');
    const heroEl = adoptCaseStudyHeroRef.current;
    if (!scrollEl || !heroEl) return;

    const navThresholdPx = 52;
    const sync = () => {
      const { bottom } = heroEl.getBoundingClientRect();
      setAdoptCaseStudyNavSurface(bottom > navThresholdPx ? 'media' : 'default');
    };

    sync();
    scrollEl.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    return () => {
      scrollEl.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [openAdoptPage]);

  useEffect(() => {
    if (!adoptFullCaseStudyOpen) {
      setAdoptAccordionOpen(null);
    }
  }, [adoptFullCaseStudyOpen]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onMouseMove = () => {
      lastMouseMoveAtRef.current = performance.now();
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  useEffect(() => {
    if (!heroPortraitRevealed || typeof window === 'undefined') return;
    const close = () => setHeroPortraitRevealed(false);
    window.addEventListener('scroll', close, { passive: true });
    window.addEventListener('wheel', close, { passive: true });
    window.addEventListener('touchstart', close, { passive: true });
    return () => {
      window.removeEventListener('scroll', close);
      window.removeEventListener('wheel', close);
      window.removeEventListener('touchstart', close);
    };
  }, [heroPortraitRevealed]);

  useEffect(() => {
    const node = heroH1RowRef.current;
    if (!node) return;
    const sync = () => setHeroSubtextWidth(Math.round(node.getBoundingClientRect().width * 1.1));
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(node);
    window.addEventListener('resize', sync);
    return () => { ro.disconnect(); window.removeEventListener('resize', sync); };
  }, []);

  useEffect(() => {
    return () => {
      if (heroLensRafRef.current) {
        cancelAnimationFrame(heroLensRafRef.current);
        heroLensRafRef.current = 0;
      }
    };
  }, []);

  const { scrollYProgress: heroStackProgress } = useScroll({
    target: heroIntroRef,
    offset: ['start end', 'end start'],
  });
  const heroCardParallax = [
    useTransform(heroStackProgress, [0, 1], [0, -12]),
    useTransform(heroStackProgress, [0, 1], [0, -8]),
    useTransform(heroStackProgress, [0, 1], [0, -6]),
  ];
  const heroCardParallaxSmooth = heroCardParallax.map((value) =>
    useSpring(value, { stiffness: 70, damping: 22, mass: 0.4 }),
  );
  const { scrollYProgress: heroIntroProgress } = useScroll({
    target: heroIntroRef,
    offset: ['start end', 'end start'],
  });
  const heroIntroParallax = useSpring(
    useTransform(heroIntroProgress, [0, 1], prefersReducedMotion ? [0, 0] : [8, -10]),
    { stiffness: 88, damping: 26, mass: 0.34 },
  );
  const heroIntroBodyParallax = useSpring(
    useTransform(heroIntroProgress, [0, 1], prefersReducedMotion ? [0, 0] : [5, -7]),
    { stiffness: 82, damping: 24, mass: 0.36 },
  );

  const heroIntroBundle = prefersReducedMotion
    ? {
        hidden: { opacity: 1 },
        show: { opacity: 1 },
      }
    : {
        hidden: { opacity: 0, y: 20, filter: 'blur(3px)' },
        show: {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          transition: {
            duration: heroIntroTiming.bundleDurationS,
            ease: [0.16, 0.84, 0.22, 1],
            staggerChildren: heroIntroTiming.staggerChildrenS,
            when: 'beforeChildren',
          },
        },
      };

  const heroIntroItem = prefersReducedMotion
    ? {
        hidden: { opacity: 1, y: 0 },
        show: { opacity: 1, y: 0 },
      }
    : {
        hidden: { opacity: 0, y: 14 },
        show: {
          opacity: 1,
          y: 0,
          transition: {
            duration: heroIntroTiming.itemDurationS,
            ease: [0.2, 0.8, 0.2, 1],
          },
        },
      };

  const revealSection = prefersReducedMotion
    ? {
        hidden: { opacity: 1, y: 0 },
        show: { opacity: 1, y: 0 },
      }
    : {
        hidden: { opacity: 0, y: 28, scale: 0.985 },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.54,
            ease: [0.2, 0.8, 0.2, 1],
            staggerChildren: 0.1,
            when: 'beforeChildren',
          },
        },
      };

  const revealItem = prefersReducedMotion
    ? {
        hidden: { opacity: 1, y: 0 },
        show: { opacity: 1, y: 0 },
      }
    : {
        hidden: { opacity: 0, y: 20, scale: 0.99 },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.46,
            ease: [0.2, 0.8, 0.2, 1],
          },
        },
      };

  return (
    <div className="min-h-screen selection:bg-accent selection:text-white overflow-x-hidden bg-bg" style={{ backgroundColor: '#F8F9FA' }}>
      <AmbientMandalaTrail className="z-[10]" />

      <main className="editorial-page home-page relative z-20 pt-0">
      {!isFullPageOverlayOpen && (
        <TopNavStrip
          page="home"
          surface="hero"
          mandalaAnchorId="mandala-nav-home"
          onHomeClick={handleHomeNavClick}
          onAboutClick={handleAboutNavClick}
          onCvClick={handleCvNavClick}
        />
      )}
      <section
        className="home-hero relative -mt-11 mb-14 flex min-h-[calc(100dvh-3.25rem)] flex-col pt-11 sm:mb-16 md:mb-20 md:min-h-[calc(100dvh-3.5rem)]"
        aria-label="Hero"
        onPointerEnter={() => {
          setHeroBannerVisible(true);
            // New reveal session => remap palette immediately.
            setHeroBannerPaletteKey((k) => k + 1);
        }}
        onPointerLeave={() => {
          setHeroBannerVisible(false);
          setHeroBannerLens((prev) => (prev.active ? { ...prev, active: false } : prev));
        }}
        onMouseMove={(event) => {
          if (!heroBannerVisibleRef.current) return;
          const bannerRect = heroBannerRef.current?.getBoundingClientRect();
          if (!bannerRect) return;

          const insideBannerY =
            event.clientY >= bannerRect.top && event.clientY <= bannerRect.bottom;
          heroLensPendingRef.current = {
            clientX: event.clientX,
            clientY: event.clientY,
            bannerRect,
            insideBannerY,
          };

          if (heroLensRafRef.current) return;
          heroLensRafRef.current = requestAnimationFrame(() => {
            heroLensRafRef.current = 0;
            if (!heroBannerVisibleRef.current) return;
            const pending = heroLensPendingRef.current;
            if (!pending) return;
            if (!pending.insideBannerY) {
              setHeroBannerLens((prev) => (prev.active ? { ...prev, active: false } : prev));
              return;
            }
            const { bannerRect: br, clientX, clientY } = pending;
            setHeroBannerLens({
              x: Math.max(0, Math.min(br.width, clientX - br.left)),
              y: Math.max(0, Math.min(br.height, clientY - br.top)),
              active: true,
            });
          });
        }}
      >
        <div
          ref={heroBannerRef}
          className="absolute inset-x-0 top-0 z-0 h-[clamp(248px,38vh,480px)] w-full overflow-hidden"
          style={{
            maskImage:
              'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 72%, rgba(0,0,0,0.36) 95%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 72%, rgba(0,0,0,0.36) 95%, rgba(0,0,0,0) 100%)',
          }}
          aria-hidden
        >
          <div className="absolute inset-0 opacity-[0.26] [filter:grayscale(1)_saturate(0.38)]" aria-hidden>
            <MandalaBanner
              fullBleed
              interactive
              onDarkBackground
              paletteVersion={0}
              intensity={22}
              ecoMode
              className="h-full min-h-[clamp(132px,20vh,100%)] w-full max-w-none min-w-0"
            />
          </div>
          <div
            className={`absolute inset-0 transition-opacity duration-200 ${
              heroBannerVisible && heroBannerLens.active
                ? 'pointer-events-auto opacity-100'
                : 'pointer-events-none opacity-0'
            }`}
            style={{
              maskImage: `radial-gradient(circle 205px at ${heroBannerLens.x}px ${heroBannerLens.y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.78) 58%, rgba(0,0,0,0) 100%)`,
              WebkitMaskImage: `radial-gradient(circle 205px at ${heroBannerLens.x}px ${heroBannerLens.y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.78) 58%, rgba(0,0,0,0) 100%)`,
            }}
            aria-hidden
          >
            <MandalaBanner
              fullBleed
              interactive
              onDarkBackground
              paletteVersion={heroBannerPaletteKey}
              intensity={94}
              ecoMode
              suspendAnimation={!(heroBannerVisible && heroBannerLens.active)}
              className="h-full min-h-[clamp(132px,20vh,100%)] w-full max-w-none min-w-0"
            />
          </div>
        </div>
        <div className="pointer-events-none relative z-10 flex min-h-[calc(100dvh-6rem)] flex-1 flex-col items-center px-4 pb-14 pt-[clamp(152px,24vh,242px)] sm:px-6 sm:pb-16 sm:pt-[clamp(164px,25vh,258px)] md:min-h-[calc(100dvh-7rem)] md:px-12 md:pb-20 md:pt-[clamp(176px,26vh,272px)] lg:pb-24 lg:pt-[clamp(184px,27vh,288px)]">
          <div className="mx-auto flex w-full max-w-[min(72rem,96vw)] flex-col items-center text-center">
            <motion.div
              ref={heroIntroRef}
              className="hero-inline-intro mx-auto flex w-auto max-w-full shrink-0 flex-col items-center gap-[0.28rem] sm:gap-[0.36rem]"
              variants={heroIntroBundle}
              initial="hidden"
              animate="show"
              style={{ y: heroIntroParallax }}
            >
              <motion.div
                ref={heroH1RowRef}
                variants={heroIntroItem}
                className="hero-inline-intro-row relative mb-0 flex flex-wrap items-center justify-center gap-x-[0.18em] gap-y-px overflow-visible font-bold tracking-[-0.082em] md:flex-nowrap"
              >
                <motion.h1 variants={heroIntroItem} className="hero-inline-h1 relative z-10 mb-0 mt-0 inline-block align-middle" style={{ fontFamily: "'Manrope', sans-serif", letterSpacing: '-0.082em', fontWeight: 600 }}>
                  I'm Daniel
                </motion.h1>
                {/* Portrait wrapper — orbit ring lives here as a sibling of the button */}
                <div className="relative mx-[0.36em] mb-[0.06em] inline-block h-[1.134em] w-[1.134em] shrink-0 align-bottom" style={{ zIndex: 20 }}>
                  <motion.button
                    variants={heroIntroItem}
                    type="button"
                    className="pointer-events-auto relative inline-block h-full w-full overflow-hidden rounded-full border-0 bg-transparent p-0 cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c1528]"
                    aria-label="Daniel portrait — hover to reveal the Euphoria mandala"
                    onMouseEnter={() => {
                      if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
                        return;
                      }
                      const now = performance.now();
                      // Ignore scroll-induced synthetic enter (element moving under a stationary cursor).
                      if (now - lastMouseMoveAtRef.current > 140) return;
                      setHeroPortraitRevealed(true);
                      setHeroPortraitSessionStamp((n) => n + 1);
                    }}
                    onMouseLeave={() => setHeroPortraitRevealed(false)}
                  >
                    <img
                      src="/hero-inline-portrait.png"
                      alt=""
                      width={112}
                      height={112}
                      loading="eager"
                      decoding="async"
                      aria-hidden
                      className={[
                        'hero-inline-portrait-img pointer-events-none absolute z-[1] border-0 bg-transparent object-cover shadow-none outline-none ring-0',
                        'transition-opacity duration-200 ease-out',
                        heroPortraitRevealed ? 'pointer-events-none opacity-0' : 'opacity-100',
                      ].join(' ')}
                    />
                    {heroPortraitRevealed ? (
                      <div
                        className="absolute inset-0 z-[2] flex items-center justify-center transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-opacity motion-reduce:duration-150 motion-reduce:transform-none pointer-events-auto scale-100 opacity-100"
                        aria-hidden={false}
                      >
                        <NavBrandingMount
                          key={`${HERO_PORTRAIT_MANDALA_ANCHOR_ID}-${heroPortraitSessionStamp}`}
                          anchorId={HERO_PORTRAIT_MANDALA_ANCHOR_ID}
                          identityRevealed
                          enforceNavMinTouchTarget={false}
                          className="relative !z-[3] flex !h-full !w-full min-h-0 min-w-0 shrink-0 bg-transparent"
                        />
                      </div>
                    ) : null}
                  </motion.button>

                  {/* Orbit ring — sibling of button, above everything */}
                  <HeroOrbitRing />
                </div>
                <motion.span
                  variants={heroIntroItem}
                  className="hero-inline-h1 relative z-10 mb-0 mt-0 inline-block align-middle"
                  style={{ fontFamily: "'Manrope', sans-serif", letterSpacing: '-0.082em', fontWeight: 600, fontSize: '1em' }}
                  aria-hidden
                >
                  Product Designer
                </motion.span>
                <HeroIntroStarPass key={heroStarPassKey} />
              </motion.div>
              <motion.h2
                variants={heroIntroItem}
                className="hero-inline-h2 mx-auto mb-0 mt-0 block w-full max-w-[min(46ch,94vw)] text-center font-medium tracking-[-0.036em] text-balance"
                style={{
                  y: heroIntroBodyParallax,
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: 'clamp(22px, 2.8vw, 36px)',
                }}
              >
                Designing products that help organizations
                <br />
                grow, work smarter, and better serve people.
              </motion.h2>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Case study 1: NGO participation system */}
      <motion.section
        className="overflow-x-clip border-b border-ink/20 bg-bg px-4 pb-12 pt-12 sm:px-6 md:overflow-x-visible md:px-12 md:pb-14 md:pt-14"
        style={{ backgroundColor: '#F8F9FA' }}
        aria-labelledby="case-study-ngo-heading"
        variants={revealSection}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.18 }}
      >
        <div className="mx-auto w-full max-w-[1180px]">
          <div className="home-case-study-split mx-auto grid w-full grid-cols-1 items-start gap-6 md:grid-cols-12 md:gap-8">
            <div className="home-case-study-split__copy order-1 md:order-2 md:col-span-6">
              <motion.div variants={revealItem} className="mx-auto flex max-w-[36rem] flex-col items-start gap-4 text-left md:mx-0 md:gap-5">
                <h2 id="case-study-ngo-heading" className="mb-0 max-w-[28ch] leading-[1.08] text-ink/90">
                  Turning fragmented participation into steady revenue.
                </h2>
                <p className="home-body mb-0 max-w-[54ch] leading-[1.26] text-ink/80">
                  Solo designed and built a product system for a Seattle-based NGO that turned fragmented
                  participation into a structured, repeatable revenue model.
                </p>
                <TokenButton className="mt-1 pointer-events-auto" onClick={() => setOpenAdoptPage(true)}>
                  View case study
                </TokenButton>
              </motion.div>
            </div>
            <div className="home-case-study-split__media order-2 md:order-1 md:col-span-6">
              <motion.div
                variants={revealItem}
                className="home-featured-media-viewport w-full overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_40px_-18px_rgba(12,21,40,0.12)]"
              >
                <img
                  src="/aas-homepage.png"
                  alt="Adopt-a-School homepage — map-based school selection interface"
                  className="h-full w-full object-cover object-top"
                  loading="eager"
                  decoding="async"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Case study 2: coordination system + image stack */}
      <motion.section
        className="border-b border-ink/20 bg-bg px-4 pb-12 pt-12 sm:px-6 md:px-12 md:pb-14 md:pt-14"
        style={{ backgroundColor: '#F8F9FA' }}
        aria-labelledby="case-study-driver-heading"
        variants={revealSection}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.18 }}
      >
        <div className="mx-auto w-full max-w-[1180px]">
          <motion.div
            variants={revealItem}
            className="home-case-study-split grid grid-cols-1 items-start gap-6 md:grid-cols-12 md:gap-8"
          >
            <div className="home-case-study-split__media order-2 md:order-2 md:col-span-6">
              <motion.div
                variants={revealItem}
                className="pointer-events-auto home-featured-media-viewport w-full overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_40px_-18px_rgba(12,21,40,0.12)]"
              >
                <img
                  src="/coordination-homepage.png"
                  alt="Driver coordination system — real-time map view"
                  className="h-full w-full object-cover object-top"
                  loading="eager"
                  decoding="async"
                />
              </motion.div>
            </div>

          <motion.div variants={revealItem} className="home-case-study-split__copy order-1 md:order-1 md:col-span-6">
            <div
              className="cursor-pointer"
              onClick={() => setOpenDriverPage(true)}
            >
              <div>
                <h2 id="case-study-driver-heading" className="mb-2 max-w-[20ch] leading-[1.06] text-ink/92">
                  Scaling coordination with real-time driver visibility
                </h2>
                <p className="home-body mb-4 max-w-measure text-ink/78">
                  Route decisions relied on memory and hidden availability. I designed a map-based system that surfaces
                  nearby drivers in real time, turning flexibility into a reliable coordination resource.
                </p>
                <p className="home-body mb-0 max-w-measure font-medium text-ink/82">
                  {'\u2192'} Reduced reliance on coordinator memory and enabled real-time decisions
                </p>
              </div>
              <TokenButton
                className="mt-4"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDriverPage(true);
                }}
              >
                View case study
              </TokenButton>
            </div>
          </motion.div>
        </motion.div>
        </div>
      </motion.section>

      {/* Case study 3: Ajediam brand identity */}
      <motion.section
        className="border-b border-ink/20 bg-bg px-4 pb-12 pt-12 sm:px-6 md:px-12 md:pb-14 md:pt-14"
        style={{ backgroundColor: '#F8F9FA' }}
        aria-labelledby="touchpoints-heading"
        variants={revealSection}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.18 }}
      >
        <div className="mx-auto w-full max-w-[1180px]">
          <motion.div
            variants={revealItem}
            className="home-case-study-split grid grid-cols-1 items-start gap-6 md:grid-cols-12 md:gap-8"
          >
            <div className="home-case-study-split__media order-2 md:order-1 md:col-span-6 md:flex md:min-w-0 md:justify-start">
              <motion.div
                variants={revealItem}
                className="mx-auto w-full overflow-hidden rounded-lg border border-ink/12 bg-white md:mx-0 md:w-[156%] md:max-w-[1120px] md:origin-left"
              >
                <div className="w-full overflow-hidden">
                  <img
                    src="/ajediam/homepage-branding.png"
                    alt="Ajediam editorial article on iPad — Koh-i-Noor diamond brand and web experience"
                    className="w-full h-auto block"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </motion.div>
            </div>

            <motion.div variants={revealItem} className="home-case-study-split__copy order-1 md:order-2 md:col-span-6">
              <h2 id="touchpoints-heading" className="mb-2 max-w-[20ch] leading-[1.06] text-ink/92">
                System-led product
                <br />
                strategy across touchpoints
              </h2>
              <p className="home-body mb-4 max-w-measure text-ink/78">
                Founding design for Ajediam: brand identity, product UI, and web as one framework as the business
                scaled from early product to daily use.
              </p>
              <p className="home-body mb-0 max-w-measure font-medium text-ink/82">
                {'\u2192'} Brand and product redesign: daily active users 150 to 400+; retention +24.62%
              </p>
              <TokenButton className="mt-4" onClick={() => setOpenTouchpointsPage(true)}>
                View brand identity
              </TokenButton>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Designing with AI — page view (gestalt: cards = title + image + caption per section) */}
      <AnimatePresence>
        {openDesigningAiPage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex flex-col bg-bg overflow-y-auto pt-11"
            style={{ backgroundColor: '#F8F9FA' }}
          >
            <TopNavStrip
              page="ai"
              mandalaAnchorId="mandala-nav-ai"
              onHomeClick={handleHomeNavClick}
              onAboutClick={handleAboutNavClick}
              onCvClick={handleCvNavClick}
            />

            {/* Main content — vertical flow, max-width for readability */}
            <main className="flex-1 px-5 py-10 pb-24 sm:px-8 md:px-12 md:py-12">
              <div className="editorial-container editorial-page">
                <section>
                  <h1 className="mb-5 leading-tight md:mb-6">From complexity to clarity with AI</h1>
                </section>

                <section className="mt-16 border-t border-ink/10 pt-12 md:mt-20 md:pt-14">
                  <h2 className="mb-4 md:mb-5">Rapid sensemaking at scale</h2>
                  <p className="editorial-body mb-0 max-w-measure">
                    AI clusters themes, maps relationships, and turns messy inputs into frameworks—fast enough to steer product and service design without losing the thread.
                  </p>
                </section>

                <SectionRhythmDivider />

                <section className="mt-2">
                  <h2 className="mb-4 md:mb-5">From concept to functional product</h2>
                  <p className="editorial-body mb-0 max-w-measure">
                    Figma craft plus multi-agent workflows run end to end: ideation, analysis, and high-fidelity
                    prototypes—stress-tested on real projects.
                    <br />
                    <br />
                    Teams move from rough concepts to working prototypes sooner: alternate directions, early tests,
                    fewer sunk costs before commit.
                    <br />
                    <br />
                    Interfaces and system behaviors get exercised early; assumptions surface before engineering locks in.
                  </p>
                </section>

                <SectionRhythmDivider />

                <section className="mt-2">
                  <h2 className="mb-4 md:mb-5">Exploring futures before building them</h2>
                  <p className="editorial-body mb-0 max-w-measure">
                    Prototypes simulate how a product behaves in the field—scenarios, risks, and tradeoffs surface
                    before code.
                    <br />
                    <br />
                    Leaders see the system in motion first; decisions land with less guesswork.
                  </p>
                </section>
              </div>
            </main>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Adopt a School — full page (case study) */}
      <AnimatePresence>
        {openAdoptPage && (
          <motion.div
            ref={adoptCaseStudyScrollRef}
            id="adopt-case-study-scroll"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex flex-col bg-bg overflow-y-auto overflow-x-hidden"
            style={{ backgroundColor: '#F8F9FA' }}
          >
            <TopNavStrip
              page="adopt"
              mandalaAnchorId="mandala-nav-adopt"
              onHomeClick={handleHomeNavClick}
              onAboutClick={handleAboutNavClick}
              onCvClick={handleCvNavClick}
              surface={adoptCaseStudyNavSurface}
            />

            <main className="flex-1 pb-[200px]">
              <div className="adopt-case-study mx-auto w-full min-w-0 max-w-[min(100%,1180px)] px-5 pb-[3rem] pt-8 sm:px-7 md:px-12 md:pb-[3.5rem] md:pt-10 lg:px-14 lg:pt-12">
                <AdoptCaseStudyParallax
                  as="section"
                  scrollContainerRef={adoptCaseStudyScrollRef}
                  reducedMotion={prefersReducedMotion}
                  variant="lead"
                  className="adopt-case-study-section adopt-case-study-section--hero-title"
                >
                  {/* Contained hero image */}
                  <div
                    ref={adoptCaseStudyHeroRef}
                    className="mb-8 w-full overflow-hidden rounded-2xl border border-ink/[0.09] shadow-[0_4px_32px_-8px_rgba(12,21,40,0.13)] md:mb-10"
                    style={{ aspectRatio: '16/7' }}
                  >
                    <img
                      src="/adopt-a-school/ARTD-C02-Device-011.jpg"
                      alt="Adopt-a-School — product overview."
                      className="h-full w-full object-cover object-[56%_40%] md:object-[52%_38%]"
                      loading="eager"
                      decoding="async"
                    />
                  </div>

                  {/* h1 */}
                  <h1 className="mb-8 scroll-mt-6 text-balance text-center md:mb-10">{ADOPT_CASE_STUDY_TITLE}</h1>

                  {/* 2-col: phone image left, impact summary right */}
                  <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
                    {/* Left: phone UI crop */}
                    <div className="flex items-center justify-center md:justify-start">
                      <img
                        src="/adopt-a-school/ui-crop-hero.png"
                        alt="Adopt-a-School — pledge amount step on mobile."
                        className="h-auto w-full max-w-[340px] rounded-2xl object-contain md:max-w-none"
                        loading="eager"
                        decoding="async"
                      />
                    </div>
                    {/* Right: impact summary */}
                    <div className="min-w-0">
                      <h3 id="adopt-impact-summary-label" className="adopt-context-heading mb-3 md:mb-4">
                        Impact summary
                      </h3>
                      <div className="adopt-impact-summary-lede text-pretty">
                        {ADOPT_CASE_STUDY_IMPACT_SUMMARY_LINES.map((line) => (
                          <p key={line} className="adopt-impact-summary-line mb-0">
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </AdoptCaseStudyParallax>

                <div className="flex flex-col">
                <AdoptCaseStudyParallax
                  as="section"
                  scrollContainerRef={adoptCaseStudyScrollRef}
                  reducedMotion={prefersReducedMotion}
                  variant="body"
                  className="adopt-case-study-section adopt-case-study-section--context min-w-0 scroll-mt-0"
                >
                  <AdoptCaseStudyOverviewStage
                    contextColumn={
                      <>
                        <h2 id="adopt-section-context" className="adopt-context-heading mb-1.5 scroll-mt-6 md:mb-2">
                          Context &amp; Intro
                        </h2>
                        <aside className="adopt-meta-rail mt-5 md:mt-6" aria-label="Project metadata">
                          <dl className="adopt-meta">
                            <div>
                              <dt className="adopt-meta-label scroll-mt-4">Scope</dt>
                              <dd className="adopt-body mb-0 max-w-measure text-ink/65">Discovery object, map-first digital enrollment, and a layered service system—designed end-to-end.</dd>
                            </div>
                            <div>
                              <dt className="adopt-meta-label scroll-mt-4">Role</dt>
                              <dd className="adopt-body mb-0 max-w-measure">Service design, product design, research</dd>
                            </div>
                            <div>
                              <dt className="adopt-meta-label scroll-mt-4">Client</dt>
                              <dd className="adopt-body mb-0 max-w-measure">Backpack Brigade</dd>
                            </div>
                            <div>
                              <dt id="adopt-key-insight" className="adopt-meta-label scroll-mt-4">
                                Key insight
                              </dt>
                              <dd className="adopt-body adopt-key-insight-lede mb-0 leading-[1.45] text-[var(--color-text-body-muted)] line-clamp-2">
                                {ADOPT_BEYOND_WAREHOUSE_BODY}
                              </dd>
                            </div>
                            <div>
                              <dt className="adopt-meta-label scroll-mt-4">Impact</dt>
                              <dd className="adopt-body mb-0 max-w-measure">
                                {ADOPT_CASE_STUDY_IMPACT_META.map((line) => (
                                  <p key={line}>{line}</p>
                                ))}
                              </dd>
                            </div>
                          </dl>
                        </aside>
                      </>
                    }
                  />
                </AdoptCaseStudyParallax>

                <AdoptProcessOverview
                  editorial={ADOPT_EDITORIAL_OVERLAP}
                  scrollContainerRef={adoptCaseStudyScrollRef}
                  reducedMotion={prefersReducedMotion}
                />

                {/* Key Insight — narrative turning point */}
                <AdoptCaseStudyParallax
                  as="section"
                  scrollContainerRef={adoptCaseStudyScrollRef}
                  reducedMotion={prefersReducedMotion}
                  variant="body"
                  className="adopt-case-study-section adopt-case-study-section--key-insight scroll-mt-6"
                  aria-label="Key insight"
                >
                  <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-8 md:py-12">
                    <p className="adopt-meta-label mb-8 tracking-widest uppercase text-center text-ink/45 md:mb-10">Key insight</p>
                    <div className="adopt-key-insight-statement">
                      {ADOPT_KEY_INSIGHT_LINES.map(({ text, mod }) => (
                        <p
                          key={text}
                          className={`insight-line${mod ? ` insight-line--${mod}` : ''}`}
                        >
                          {text}
                        </p>
                      ))}
                    </div>
                  </div>
                </AdoptCaseStudyParallax>

                <AdoptCaseStudyParallax
                  as="section"
                  scrollContainerRef={adoptCaseStudyScrollRef}
                  reducedMotion={prefersReducedMotion}
                  variant="body"
                  className="adopt-strategic-decisions adopt-case-study-section scroll-mt-6 md:scroll-mt-8"
                >
                  <StrategicDecisionsSection
                    lede={ADOPT_STRATEGIC_DECISIONS_LEDE}
                    items={ADOPT_STRATEGIC_ITEMS}
                    openIndex={adoptAccordionOpen}
                    onToggle={(i) => setAdoptAccordionOpen(adoptAccordionOpen === i ? null : i)}
                  />
                </AdoptCaseStudyParallax>

                <AdoptCaseStudyParallax
                  as="section"
                  scrollContainerRef={adoptCaseStudyScrollRef}
                  reducedMotion={prefersReducedMotion}
                  variant="body"
                  id="adopt-section-system-diagram"
                  className="adopt-system-diagram-block adopt-case-study-section min-w-0 scroll-mt-6"
                  aria-labelledby="adopt-page-system-diagram-heading"
                >
                  <div className="mx-auto w-full min-w-0 max-w-[min(100%,1180px)]">
                    <AdoptSystemDesignOverview />
                  </div>
                </AdoptCaseStudyParallax>

                <AdoptCaseStudyParallax
                  as="section"
                  scrollContainerRef={adoptCaseStudyScrollRef}
                  reducedMotion={prefersReducedMotion}
                  variant="body"
                  id="adopt-section-key-learnings"
                  className="adopt-key-learnings adopt-case-study-section adopt-case-study-section--key-learnings scroll-mt-6"
                  aria-labelledby="adopt-key-learnings-heading"
                >
                  <div className="mx-auto w-full max-w-4xl">
                    <h2 id="adopt-key-learnings-heading" className="adopt-context-heading mb-8 text-center md:mb-10">
                      Key learnings &amp; implications
                    </h2>
                    <div className="adopt-key-learnings-grid">
                      {ADOPT_KEY_LEARNINGS_ITEMS.map(({ tag, body }) => (
                        <div key={tag} className="flex flex-col gap-2">
                          <p className="adopt-meta-label text-ink/55">{tag}</p>
                          <p className="adopt-body mb-0 leading-[1.5] text-ink/72">{body}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </AdoptCaseStudyParallax>

                <AdoptCaseStudyParallax
                  as="section"
                  scrollContainerRef={adoptCaseStudyScrollRef}
                  reducedMotion={prefersReducedMotion}
                  variant="body"
                  id="adopt-section-final-outcome"
                  className="adopt-final-outcome adopt-case-study-section scroll-mt-6"
                  aria-labelledby="adopt-final-outcome-heading"
                >
                  <div className="mx-auto flex max-w-2xl flex-col items-center">
                    <h2 id="adopt-final-outcome-heading" className="adopt-context-heading mb-1.5 text-center md:mb-2">
                      Final outcome
                    </h2>
                    <p className="adopt-body mb-0 max-w-measure text-pretty text-left text-ink/82">{ADOPT_FINAL_OUTCOME_BODY}</p>
                  </div>
                </AdoptCaseStudyParallax>

                <div className="adopt-case-study-cta flex flex-col items-center border-t border-ink/[0.08] pt-12 md:pt-14">
                  <TokenButton
                    aria-expanded={adoptFullCaseStudyOpen}
                    aria-controls="adopt-full-case-study"
                    id="adopt-full-case-study-toggle"
                    className="adopt-case-study-cta-button min-h-[3.25rem] min-w-[min(100%,18rem)] px-9 text-[length:var(--text-body)] md:min-w-[19.5rem]"
                    onClick={() => setAdoptFullCaseStudyOpen((open) => !open)}
                  >
                    {adoptFullCaseStudyOpen ? 'Show summary only' : 'Full case study'}
                  </TokenButton>
                </div>
                </div>

                {adoptFullCaseStudyOpen ? (
                  <div id="adopt-full-case-study">
                    <div className="my-14 w-full border-t border-ink/10 md:my-20" aria-hidden />

                    <AdoptCaseStudyParallax
                      scrollContainerRef={adoptCaseStudyScrollRef}
                      reducedMotion={prefersReducedMotion}
                      variant="body"
                      className="mt-0 scroll-mt-6 md:mt-0"
                    >
                      <AdoptValidationEditorialSection
                        sectionHeadingId="adopt-section-validation"
                        sectionLede={ADOPT_PROCESS_VALIDATION_LEDE}
                        physicalImages={ADOPT_VALIDATION_PHYSICAL_IMAGES}
                        digitalImages={ADOPT_VALIDATION_DIGITAL_IMAGES}
                        physicalTitle="Physical prototype"
                        physicalTitleId="adopt-validation-physical"
                        physicalDescription={ADOPT_VALIDATION_PHYSICAL_LEDE}
                        digitalTitle="Digital prototype"
                        digitalTitleId="adopt-validation-digital"
                        digitalDescription={ADOPT_VALIDATION_DIGITAL_LEDE}
                      />
                    </AdoptCaseStudyParallax>

                    <div className="my-14 w-full border-t border-ink/10 md:my-20" aria-hidden />

                    <AdoptCaseStudyParallax
                      as="section"
                      scrollContainerRef={adoptCaseStudyScrollRef}
                      reducedMotion={prefersReducedMotion}
                      variant="body"
                    >
                      <h2 className="mb-2 md:mb-2.5">Reflection</h2>
                      <p className="adopt-body mb-8 max-w-measure md:mb-10">
                        The org grew organically for years—design had to fit how the team already works, not pretend a
                        greenfield rebuild.
                        <br />
                        <br />
                        Strong systems often come from tight constraints. New pathways had to extend reach without
                        replacing operations.
                        <br />
                        <br />
                        The product is not only screens—it is people, places, and repeatable behaviors wired together.
                      </p>

                      <h3 className="adopt-alt-h3 mb-1.5 md:mb-2">Future opportunities</h3>
                      <p className="adopt-body mb-8 max-w-measure md:mb-10">
                        Refined activation objects in community settings; clearer scan moments at first touch.
                        <br />
                        <br />
                        Tiered sponsorship for businesses and recurring donors—structured without feeling transactional.
                        <br />
                        <br />
                        Tighter loops between schools and supporters: stories, impact signals, food preference feedback.
                      </p>

                      <h3 id="adopt-section-impact" className="adopt-alt-h3 mb-1.5 scroll-mt-6 md:mb-2">
                        Real-world impact
                      </h3>
                      <p className="adopt-body mb-0 max-w-measure">
                        A decade of ops knowledge, folded into a participation framework—community and businesses support
                        schools through moments embedded in everyday places, not only the warehouse.
                        <br />
                        <br />
                        Service and product design together: physical touchpoints, human activation, mobile flow—one
                        system.
                      </p>
                    </AdoptCaseStudyParallax>

                    <div
                      className="my-14 flex min-h-[80px] w-full items-center md:my-20 md:min-h-[80px]"
                      aria-hidden
                    >
                      <div className="w-full border-t border-ink/10" />
                    </div>

                    <AdoptCaseStudyParallax
                      as="section"
                      scrollContainerRef={adoptCaseStudyScrollRef}
                      reducedMotion={prefersReducedMotion}
                      variant="body"
                    >
                      <h2 className="mb-2 md:mb-2.5">Closing words</h2>
                      <div className="max-w-measure">
                        <p className="adopt-body">
                          Aim was a system communities could actually use to support kids in Seattle schools—not a
                          standalone interface exercise.
                        </p>
                      </div>
                    </AdoptCaseStudyParallax>
                  </div>
                ) : null}
              </div>
            </main>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Design Across Touchpoints — page view (same template as Designing with AI) */}
      <AnimatePresence>
        {openTouchpointsPage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex flex-col bg-bg overflow-y-auto pt-11"
            style={{ backgroundColor: '#F8F9FA' }}
          >
            <TopNavStrip
              page="brand"
              mandalaAnchorId="mandala-nav-brand"
              onHomeClick={handleHomeNavClick}
              onAboutClick={handleAboutNavClick}
              onCvClick={handleCvNavClick}
            />

            <main className="flex-1 px-5 py-8 pb-24 sm:px-8 md:px-12 md:py-12">
              <div className="editorial-container adopt-case-study editorial-page">
                <section>
                  <header className="mb-9 md:mb-11">
                    <h1 className="leading-[1.02] mb-6 md:mb-8">
                      Brand identity in
                      <br />
                      the real world
                    </h1>
                    <p className="adopt-body mb-0 max-w-measure">
                      How brand values become strategy, then products-human, legible, intentional.
                    </p>
                  </header>

                  <div className="mt-14 border-t border-ink/[0.08] pt-11 md:mt-[4.5rem] md:pt-14">
                    <header className="mb-9 md:mb-11">
                      <h2 className="leading-[1.02] mb-8 md:mb-10">{AJEDIAM_CASE_STUDY.title}</h2>
                      <section aria-label="Ajediam project metadata">
                        <dl className="adopt-meta">
                          <div>
                            <dt className="scroll-mt-4">Role</dt>
                            <dd className="adopt-body mb-0 max-w-measure">{AJEDIAM_CASE_STUDY.role}</dd>
                          </div>
                          <div>
                            <dt className="scroll-mt-4">Client</dt>
                            <dd className="adopt-body mb-0 max-w-measure">{AJEDIAM_CASE_STUDY.client}</dd>
                          </div>
                          <div>
                            <dt className="scroll-mt-4">Context</dt>
                            <dd className="adopt-body mb-0 max-w-measure">{AJEDIAM_CASE_STUDY.context}</dd>
                          </div>
                          <div>
                            <dt className="scroll-mt-4">Scope</dt>
                            <dd className="adopt-body mb-0 max-w-measure">
                              <ul className="list-none space-y-2.5 pl-0">
                                {AJEDIAM_CASE_STUDY.scopeHighlights.map((line) => (
                                  <li key={line} className="flex gap-2">
                                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink/18" aria-hidden />
                                    <span>{stripLeadBullet(line)}</span>
                                  </li>
                                ))}
                              </ul>
                            </dd>
                          </div>
                          <div>
                            <dt className="scroll-mt-4">Impact</dt>
                            <dd className="adopt-body mb-0 max-w-measure">
                              <ul className="list-none space-y-2.5 pl-0">
                                <li className="flex gap-2">
                                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink/18" aria-hidden />
                                  <span>{AJEDIAM_CASE_STUDY.impact[0]}</span>
                                </li>
                                {AJEDIAM_CASE_STUDY.impact.slice(1).map((line) => (
                                  <li key={line} className="flex gap-2">
                                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink/18" aria-hidden />
                                    <span>{stripLeadBullet(line)}</span>
                                  </li>
                                ))}
                              </ul>
                            </dd>
                          </div>
                        </dl>
                      </section>
                    </header>

                    <h3 id="ajediam-rebrand" className="mb-3 scroll-mt-6 md:mb-4">
                      Rebrand - wordmark & identity
                    </h3>
                    <div className="mb-8 md:mb-10 w-full min-w-0 overflow-hidden rounded-md border border-ink/[0.06] bg-ink/[0.015]">
                      <div className="relative h-[clamp(220px,48vh,560px)] min-h-[200px] w-full max-h-[560px] overflow-hidden sm:min-h-[260px]">
                        <img
                          src="/ajediam/hero-2.png"
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover object-center"
                          loading="eager"
                          decoding="async"
                        />
                      </div>
                    </div>

                    <h3 id="ajediam-product" className="mb-3 scroll-mt-6 md:mb-4">
                      Product, site, and photography
                    </h3>
                    <p className="adopt-body mb-6 max-w-measure">
                      Case study hero, gallery stills, custom photography, and homepage motion-one thread from interface
                      to campaign surfaces.
                    </p>
                    <div className="mb-8 w-full min-w-0 overflow-hidden rounded-md border border-ink/[0.06] bg-ink/[0.03]">
                      <div className="flex min-h-[280px] w-full items-center justify-center p-3 md:min-h-[360px] md:p-4">
                        <img
                          src="/ajediam/hero-4.png"
                          alt=""
                          className="max-h-[min(520px,70vh)] max-w-full object-contain object-center"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    </div>
                    <div className="mb-4 aspect-[4/3] overflow-hidden rounded-md border border-ink/[0.06] bg-ink/[0.015]">
                      <img
                        src="/ajediam/gallery-2.png"
                        alt=""
                        className="h-full w-full object-cover object-center"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="mb-4 aspect-[4/3] overflow-hidden rounded-md border border-ink/[0.06] bg-ink/[0.015]">
                      <img
                        src="/ajediam/hero-custom-1.png"
                        alt=""
                        className="h-full w-full object-cover object-center"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="mb-10 w-full min-w-0 overflow-hidden rounded-md border border-ink/[0.06] bg-ink/[0.015]">
                      <div className="aspect-video w-full overflow-hidden">
                        <video
                          className="h-full w-full object-cover object-center"
                          src="/ajediam/homepage.mp4"
                          muted
                          loop
                          playsInline
                          controls
                          preload="metadata"
                        />
                      </div>
                      <p className="caption mb-0 px-3 py-2 md:px-4">Homepage - motion walkthrough</p>
                    </div>

                    <h3 id="ajediam-campaign" className="mb-3 scroll-mt-6 md:mb-4">
                      Campaign & motion
                    </h3>
                    <div className="mb-4 aspect-[4/3] overflow-hidden rounded-md border border-ink/[0.06] bg-ink/[0.015]">
                      <img
                        src="/ajediam/hero-1.png"
                        alt=""
                        className="h-full w-full object-cover object-center"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="mb-4 aspect-[4/3] overflow-hidden rounded-md border border-ink/[0.06] bg-ink/[0.015]">
                      <img
                        src="/ajediam/hero-3.png"
                        alt=""
                        className="h-full w-full object-cover object-center"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="mb-0 w-full min-w-0 overflow-hidden rounded-md border border-ink/[0.06] bg-ink/[0.015]">
                      <div className="aspect-video w-full overflow-hidden">
                        <video
                          className="h-full w-full object-cover object-center"
                          src="/ajediam/comp-4.mp4"
                          muted
                          loop
                          playsInline
                          controls
                          preload="metadata"
                        />
                      </div>
                      <p className="caption mb-0 px-3 py-2 md:px-4">Motion - composited story</p>
                    </div>
                  </div>
                </section>

                <SectionRhythmDivider />

                <section className="mt-2">
                  <h2 className="mb-4 md:mb-5">
                    Elevating the unboxing
                    <br />
                    experience of jewelry customers
                  </h2>
                  <p className="editorial-body mb-6 max-w-measure">
                    Care infographics and reward brochures in the box-unboxing delight up ~30%.
                  </p>
                  <div className="mb-4 aspect-[4/3] overflow-hidden rounded-md border border-ink/12 bg-ink/[0.03]">
                    <img
                      src="/brand-identity-section1/MM_IndoorPoster_IP-D-031.jpg"
                      alt=""
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="mb-2 aspect-[4/3] overflow-hidden rounded-md border border-ink/12 bg-ink/[0.03]">
                    <img
                      src="/brand-identity-section1/MM_Magazine_MZ-HTL-02.jpg"
                      alt=""
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <span className="editorial-folio mt-1 block">Work for: Jewel care & unboxing</span>
                </section>

                <section className="mt-16 border-t border-ink/10 pt-12 md:mt-20 md:pt-14">
                  <h2 className="mb-4 md:mb-5">
                    Designing a brand system
                    <br />
                    for a rap duo&apos;s merch
                  </h2>
                  <p className="editorial-body mb-6 max-w-measure">
                    Logo and lockups so the duo&apos;s name reads as wearable merch, not generic type.
                  </p>
                  <div className="mb-4 aspect-[4/3] overflow-hidden rounded-md border border-ink/12 bg-ink/[0.03]">
                    <img
                      src="/brand-identity-section2/MM_UrbanPoster_UP-SYDC-05.jpg"
                      alt=""
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="mb-2 aspect-[4/3] overflow-hidden rounded-md border border-ink/12 bg-ink/[0.03]">
                    <img
                      src="/brand-identity-section2/Kamau-logo.png"
                      alt=""
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <span className="editorial-folio mt-1 block">Work for: Kamau and the Wolf</span>
                </section>

                <section className="mt-16 border-t border-ink/10 pt-12 md:mt-20 md:pt-14">
                  <h2 className="mb-4 md:mb-5">
                    Researching visual languages for
                    <br />
                    distinctive and appropriate outcomes
                  </h2>
                  <p className="editorial-body mb-6 max-w-measure">
                    Contemporary Asian type, calligraphy, custom illustration, secondary face-built for launch and
                    expansion.
                  </p>
                  <div className="mb-2 aspect-[4/3] overflow-hidden rounded-md border border-ink/12 bg-ink/[0.03]">
                    <img
                      src="/brand-identity-section3/spice-angel-jar.jpg"
                      alt=""
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <span className="editorial-folio mt-1 block">Work for: Spice Angel</span>
                </section>
              </div>
            </main>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Driver Coordination case study — full page */}
      <AnimatePresence>
        {openDriverPage && (
          <motion.div
            ref={driverCaseStudyScrollRef}
            id="driver-case-study-scroll"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex flex-col bg-bg overflow-y-auto overflow-x-hidden"
            style={{ backgroundColor: '#F8F9FA' }}
          >
            <TopNavStrip
              page="brand"
              mandalaAnchorId="mandala-nav-brand"
              onHomeClick={handleHomeNavClick}
              onAboutClick={handleAboutNavClick}
              onCvClick={handleCvNavClick}
              surface={driverCaseStudyNavSurface}
            />

            <main className="flex-1 pb-[200px]">
              <AdoptCaseStudyParallax
                scrollContainerRef={driverCaseStudyScrollRef}
                reducedMotion={prefersReducedMotion}
                variant="body"
                className="relative mb-0 w-full"
              >
                <div ref={driverCaseStudyHeroRef} className="relative w-full overflow-hidden bg-ink/[0.04]">
                  <div className="relative h-[clamp(228px,55vh,60vh)] min-h-[160px] w-full overflow-hidden sm:min-h-[188px] md:min-h-[296px]">
                    <video
                      className="h-full w-full scale-[1.04] object-cover object-center"
                      src="/adopt-a-school/school-adoption-map.mp4"
                      poster="/adopt-a-school/Hero33-case-study.png"
                      autoPlay
                      muted
                      loop
                      playsInline
                      aria-label="Map interface showing nearby available drivers."
                    />
                    <div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/20 via-ink/[0.07] to-ink/[0.42]"
                      aria-hidden
                    />
                  </div>
                </div>
              </AdoptCaseStudyParallax>

              <div className="adopt-case-study mx-auto w-full min-w-0 max-w-[min(100%,1180px)] px-5 pb-[3rem] pt-10 sm:px-7 md:px-12 md:pb-[3.5rem] md:pt-12 lg:px-14 lg:pt-16">
                <AdoptCaseStudyParallax
                  as="section"
                  scrollContainerRef={driverCaseStudyScrollRef}
                  reducedMotion={prefersReducedMotion}
                  variant="lead"
                  className="adopt-case-study-section adopt-case-study-section--hero-title"
                >
                  <div className="adopt-hero-header mx-auto min-w-0 max-w-3xl text-center">
                    <header className="min-w-0">
                      <h1 className="mb-0 scroll-mt-6 text-balance">{DRIVER_CASE_STUDY_TITLE}</h1>
                    </header>
                  </div>
                </AdoptCaseStudyParallax>

                <AdoptCaseStudyParallax
                  as="section"
                  scrollContainerRef={driverCaseStudyScrollRef}
                  reducedMotion={prefersReducedMotion}
                  variant="lead"
                  className="adopt-case-study-section adopt-case-study-section--impact-summary"
                  aria-labelledby="driver-impact-summary-label"
                >
                  <div className="adopt-impact-summary mx-auto min-w-0 max-w-[42rem] text-left">
                    <p id="driver-impact-summary-label" className="adopt-meta-label mb-4 md:mb-5">
                      Impact summary
                    </p>
                    <div className="adopt-impact-summary-lede text-pretty text-left">
                      {DRIVER_CASE_STUDY_IMPACT_SUMMARY_LINES.map((line) => (
                        <p key={line} className="adopt-impact-summary-line mb-0">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </AdoptCaseStudyParallax>

                <div className="flex flex-col">
                  <AdoptCaseStudyParallax
                    as="section"
                    scrollContainerRef={driverCaseStudyScrollRef}
                    reducedMotion={prefersReducedMotion}
                    variant="body"
                    className="adopt-case-study-section adopt-case-study-section--context min-w-0 scroll-mt-0"
                  >
                    <CaseStudyOverviewStage
                      contextColumn={
                        <>
                          <h2 id="driver-section-context" className="adopt-context-heading mb-1.5 scroll-mt-6 md:mb-2">
                            Context &amp; Intro
                          </h2>
                          <p className="adopt-intro-lede adopt-context-copy mb-0 text-pretty">{DRIVER_CASE_STUDY_LEDE}</p>
                          <aside className="adopt-meta-rail mt-7 md:mt-8" aria-label="Project metadata">
                            <dl className="adopt-meta">
                              <div>
                                <dt className="adopt-meta-label scroll-mt-4">Role</dt>
                                <dd className="adopt-body mb-0 max-w-measure">Product design, service design, research</dd>
                              </div>
                              <div>
                                <dt className="adopt-meta-label scroll-mt-4">Client</dt>
                                <dd className="adopt-body mb-0 max-w-measure">Backpack Brigade</dd>
                              </div>
                              <div>
                                <dt id="driver-key-insight" className="adopt-meta-label scroll-mt-4">
                                  Key insight
                                </dt>
                                <dd className="adopt-body adopt-key-insight-lede mb-0 leading-[1.45] text-[var(--color-text-body-muted)] line-clamp-2">
                                  {DRIVER_KEY_INSIGHT}
                                </dd>
                              </div>
                              <div>
                                <dt className="adopt-meta-label scroll-mt-4">Impact</dt>
                                <dd className="adopt-body mb-0 max-w-measure">
                                  {DRIVER_IMPACT_META.map((line) => (
                                    <p key={line}>{line}</p>
                                  ))}
                                </dd>
                              </div>
                            </dl>
                          </aside>
                        </>
                      }
                      scopeContent={<DriverScopeRail />}
                      metrics={DRIVER_CONTEXT_METRICS}
                      metricsAriaLabel="Driver coordination — project metrics"
                    />
                  </AdoptCaseStudyParallax>

                  <ProcessOverviewSection
                    sectionId="driver-process-overview"
                    sectionLede={DRIVER_PROCESS_OVERVIEW_LEDE}
                    steps={DRIVER_PROCESS_STEPS}
                    scrollContainerRef={driverCaseStudyScrollRef}
                    reducedMotion={prefersReducedMotion}
                  />

                  <AdoptCaseStudyParallax
                    as="section"
                    scrollContainerRef={driverCaseStudyScrollRef}
                    reducedMotion={prefersReducedMotion}
                    variant="body"
                    className="adopt-strategic-decisions adopt-case-study-section scroll-mt-6 md:scroll-mt-8"
                  >
                    <StrategicDecisionsSection
                      lede={DRIVER_STRATEGIC_DECISIONS_LEDE}
                      items={DRIVER_STRATEGIC_ITEMS}
                      openIndex={driverAccordionOpen}
                      onToggle={(i) => setDriverAccordionOpen(driverAccordionOpen === i ? null : i)}
                    />
                  </AdoptCaseStudyParallax>

                  <AdoptCaseStudyParallax
                    as="section"
                    scrollContainerRef={driverCaseStudyScrollRef}
                    reducedMotion={prefersReducedMotion}
                    variant="body"
                    id="driver-section-final-outcome"
                    className="adopt-final-outcome adopt-case-study-section scroll-mt-6"
                    aria-labelledby="driver-final-outcome-heading"
                  >
                    <div className="mx-auto flex max-w-2xl flex-col items-center">
                      <h2 id="driver-final-outcome-heading" className="adopt-context-heading mb-1.5 text-center md:mb-2">
                        Final outcome
                      </h2>
                      <p className="adopt-body mb-0 max-w-measure text-pretty text-left text-ink/82">{DRIVER_OUTCOME_LEDE}</p>
                    </div>
                  </AdoptCaseStudyParallax>
                </div>
              </div>
            </main>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>

      {/* About — full page */}
      <AnimatePresence>
        {openAboutPage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex flex-col bg-bg overflow-y-auto pt-11"
            style={{ backgroundColor: '#F8F9FA' }}
          >
            <TopNavStrip
              page="about"
              mandalaAnchorId="mandala-nav-about"
              onHomeClick={handleHomeNavClick}
              onAboutClick={handleAboutNavClick}
              onCvClick={handleCvNavClick}
            />
            <main className="flex-1 px-5 py-8 pb-24 sm:px-8 md:px-12 md:py-12">
              <div className="editorial-container editorial-page">
                <section className="bg-bg" style={{ backgroundColor: '#F8F9FA' }} aria-labelledby="about-page-heading">
                  <h1 id="about-page-heading" className="mb-4 md:mb-5">
                    International perspective
                    <br />
                    shapes my design
                  </h1>
                  <p className="editorial-body mb-0 max-w-measure">
                    Latin American and European roots-context and tone read differently; design has to track both. Fast
                    adaptation, direct curiosity with people, open problems before solutions. Off the clock: paint, draw,
                    move, outdoors, time with my wife, cats, friends.
                  </p>
                </section>
              </div>
            </main>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>

      {/* CV — full page */}
      <AnimatePresence>
        {openCvPage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex flex-col bg-bg overflow-y-auto pt-11"
            style={{ backgroundColor: '#F8F9FA' }}
          >
            <TopNavStrip
              page="cv"
              mandalaAnchorId="mandala-nav-cv"
              onHomeClick={handleHomeNavClick}
              onAboutClick={handleAboutNavClick}
              onCvClick={handleCvNavClick}
            />
            <main className="flex-1 px-5 py-8 pb-24 sm:px-8 md:px-12 md:py-12">
              <div className="editorial-container editorial-page">
                <section className="bg-bg" style={{ backgroundColor: '#F8F9FA' }} aria-labelledby="cv-heading">
                  <h1 id="cv-heading" className="mb-4 md:mb-5">Daniel Roman - CV</h1>
                  <p className="editorial-body mb-4 max-w-measure">
                    Full CV is available on request. For current work history, project scope, and case study outcomes,
                    please use the portfolio pages.
                  </p>
                  <p className="editorial-body mb-0 max-w-measure">
                    Contact: <a href="mailto:danielromanrr@gmail.com">danielromanrr@gmail.com</a>
                  </p>
                </section>
              </div>
            </main>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section: Selected Visual Work */}
      <motion.section
        className="overflow-x-clip border-b border-ink/20 bg-bg px-4 pb-10 pt-5 sm:px-6 md:overflow-x-visible md:px-12 md:pb-12 md:pt-6"
        style={{ backgroundColor: '#F8F9FA' }}
        aria-labelledby="selected-visual-work-heading"
        variants={revealSection}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.18 }}
      >
        <div className="home-featured-section-shell mx-auto w-full min-w-0 max-w-[1180px]">
          <div className="space-y-7 md:space-y-10">
            <div className="w-full min-w-0">
              <h2 id="selected-visual-work-heading" className="mb-3 max-w-[28ch] text-[clamp(1.8rem,3.5vw,2.6rem)] leading-[1.02]">
                Designing with
                <br className="hidden md:block" />
                Cross-functional teams
              </h2>
              <p className="home-body mb-0 max-w-[56ch] leading-[1.3] text-ink/72">
                A focused set of product, brand, and service moments shaped with engineering,
                strategy, and stakeholder partners across different scales of complexity.
              </p>
            </div>

            <div className="home-featured-work-grid grid grid-cols-1 items-start gap-6 overflow-x-clip md:grid-cols-2 md:items-start md:gap-8">
              <div
                ref={featuredLeftColumnRef}
                className="home-featured-left-column order-1 flex min-h-0 min-w-0 flex-col gap-5 md:order-none"
              >
                <EditorialTabNav
                  className="home-featured-work-tabs w-full min-w-0 max-w-full"
                  tabs={FEATURED_PROJECTS.map((p) => ({ id: p.id, label: p.title }))}
                  activeIndex={selectedFeaturedIndex}
                  onSelect={selectFeaturedProject}
                  ariaLabel="Selected visual work projects"
                  tabPanelId="selected-visual-work-panel"
                  tabIdPrefix="selected-visual-tab"
                  align="start"
                />

                <div
                  id="selected-visual-work-panel"
                  role="tabpanel"
                  aria-labelledby={`selected-visual-tab-${featuredProject.id}`}
                  className="home-featured-scope-impact-panel min-h-0 min-w-0 space-y-5"
                >
                  <section className="space-y-2">
                    <p className="home-featured-scope-impact-eyebrow">Scope</p>
                    <div ref={featuredScopeSlabRef}>
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={`scope-${featuredProject.id}`}
                        initial={featuredWorkScopeMotion.initial}
                        animate={featuredWorkScopeMotion.animate}
                        exit={featuredWorkScopeMotion.exit}
                        transition={featuredWorkScopeMotion.transition}
                        className="h-[10.05rem] transform-gpu will-change-transform overflow-y-auto rounded-2xl border border-ink/10 bg-ink/[0.04] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] modal-scroll md:h-[10.75rem]"
                      >
                        <ul className="mb-0 list-none space-y-1.5 pl-0 pr-1">
                          {featuredScopeLines.map((line) => (
                            <li
                              key={line}
                              className="flex gap-2 font-body text-[0.94rem] leading-[1.34] tracking-[var(--tracking-body)] text-ink/74"
                            >
                              <span className="mt-[0.48rem] h-1 w-1 shrink-0 rounded-full bg-ink/22" aria-hidden />
                              <span>{line}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    </AnimatePresence>
                    </div>
                  </section>

                  <section className="space-y-2">
                    <p className="home-featured-scope-impact-eyebrow">Impact</p>
                    <div ref={featuredImpactSlabRef}>
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={`impact-${featuredProject.id}`}
                        initial={featuredWorkImpactMotion.initial}
                        animate={featuredWorkImpactMotion.animate}
                        exit={featuredWorkImpactMotion.exit}
                        transition={featuredWorkImpactMotion.transition}
                        className="h-[10.05rem] transform-gpu will-change-transform overflow-y-auto rounded-2xl border border-ink/10 bg-ink/[0.04] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] modal-scroll md:h-[10.75rem]"
                      >
                        <ul className="mb-0 list-none space-y-1.5 pl-0 pr-1">
                          {featuredImpactLines.map((line) => (
                            <li
                              key={line}
                              className="flex gap-2 font-body text-[0.94rem] leading-[1.34] tracking-[var(--tracking-body)] text-ink/74"
                            >
                              <span className="mt-[0.48rem] h-1 w-1 shrink-0 rounded-full bg-ink/22" aria-hidden />
                              <span>{line}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    </AnimatePresence>
                    </div>
                  </section>
                </div>
              </div>

              <div
                className="home-featured-media-column featured-work-carousel-bleed order-2 flex min-h-0 min-w-0 flex-col md:order-none"
                style={{
                  ...(featuredMediaFrameHeight != null
                    ? { ['--featured-viewport-h' as string]: `${featuredMediaFrameHeight}px` }
                    : {}),
                  ['--featured-media-top-offset' as string]: featuredMediaTopOffset > 0
                    ? `${featuredMediaTopOffset}px`
                    : '0px',
                } as React.CSSProperties}
              >
                <motion.div
                  key={featuredProject.id}
                  initial={featuredWorkImageMotion.initial}
                  animate={featuredWorkImageMotion.animate}
                  transition={featuredWorkImageMotion.transition}
                  className="flex min-h-0 min-w-0 w-full flex-1 flex-col transform-gpu will-change-transform md:max-w-none"
                >
                  <ProjectCarousel
                    projectKey={featuredProject.id}
                    slides={featuredCarouselSlides}
                    ariaLabel={`${featuredProject.title} image gallery`}
                    reducedMotion={prefersReducedMotion}
                    bleedEdge="trailing"
                    layout="featuredFixed"
                    className="min-h-0 min-w-0 w-full md:max-w-none"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Thinking Through Design — fan card section, visually anchored to footer */}
      <ThinkingThroughDesignSection
        onOpenAdopt={() => setOpenAdoptPage(true)}
        onOpenDriver={() => setOpenDriverPage(true)}
        onOpenAi={() => setOpenDesigningAiPage(true)}
        onOpenTouchpoints={() => setOpenTouchpointsPage(true)}
      />

      </main>

      <Footer id="site-footer" variant="floating" className="relative z-40" />
    </div>
  );
}
