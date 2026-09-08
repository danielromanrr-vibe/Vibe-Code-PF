import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionTemplate, useMotionValue, animate } from 'motion/react';
import HeroOrbitRing from './components/HeroOrbitRing';
import { SiteFooter } from './components/Footer';
import AdoptValidationEditorialSection from './components/AdoptValidationEditorialSection';
import { ADOPT_VALIDATION_PHYSICAL_IMAGES, ADOPT_VALIDATION_DIGITAL_IMAGES } from './components/AdoptCaseStudyMedia';
import AdoptCaseStudyOverviewStage from './components/AdoptCaseStudyOverviewStage';
import AdoptCaseStudyParallax from './components/AdoptCaseStudyParallax';
import AdoptCaseStudySection from './components/AdoptCaseStudySection';
import AdoptCaseStudyActSeparator from './components/AdoptCaseStudyActSeparator';
import AdoptProcessOverview, { ADOPT_PROCESS_VALIDATION_LEDE } from './components/AdoptProcessOverview';
import AdoptSystemDesignOverview, { AdoptEndToEndFlow } from './components/AdoptSystemDesignOverview';
import CaseStudyOverviewStage from './components/CaseStudyOverviewStage';
import DriverScopeRail from './components/DriverScopeRail';
import TouchpointsScopeRail from './components/TouchpointsScopeRail';
import EditorialTabNav from './components/EditorialTabNav';
import StrategicDecisionsSection from './components/StrategicDecisionsSection';
import ThinkingThroughDesignSection from './components/ThinkingThroughDesignSection';
import {
  ADOPT_KEY_INSIGHTS_IMPLICATIONS_HEADING,
  ADOPT_KEY_INSIGHTS_IMPLICATIONS_PARAGRAPHS,
  ADOPT_STRATEGIC_DECISIONS_LEDE,
  ADOPT_STRATEGIC_ITEMS,
} from './content/adoptCaseStudy';
import {
  DRIVER_CASE_STUDY_IMPACT_SUMMARY_LINES,
  DRIVER_CASE_STUDY_LEDE,
  DRIVER_CASE_STUDY_SUBTITLE,
  DRIVER_CASE_STUDY_TITLE,
  DRIVER_CONTEXT_METRICS,
  DRIVER_IMPACT_META,
  DRIVER_IMPACT_SUMMARY_HEADING,
  DRIVER_KEY_INSIGHT,
} from './content/driverCaseStudy';
import { DRIVER_PROCESS_OVERVIEW_CONTENT } from './content/driverProcessTurningPoints';
import {
  TOUCHPOINTS_CASE_STUDY_LEDE,
  TOUCHPOINTS_CONTEXT_METRICS,
} from './content/touchpointsCaseStudy';
import SectionRhythmDivider from './components/SectionRhythmDivider';
import TokenButton from './components/TokenButton';
import HomeCaseStudyCopy, { type HomeCaseStudyMeta } from './components/HomeCaseStudyCopy';
import HomePartneringTicker from './components/HomePartneringTicker';
import ProjectCarousel from './components/ProjectCarousel';
import AmbientMandalaTrail from './components/AmbientMandalaTrail';
import MandalaBanner from './components/MandalaBanner';
import HeroIntroStarPass from './components/HeroIntroStarPass';
import { heroIntroTiming, HERO_INTRO_EASE, heroSkyBackgroundImageAt, heroBannerAmbientOpacityAt, heroFieldRevealDurationS, heroFieldRevealEase, heroTypeIlluminateAt, heroPortraitPresenceAt, heroPortraitFilterAt, heroBandPositionAt, heroBandAlphaAt, heroSweepPositionAt, heroSweepAlphaAt, heroTextLightVarAt, measureHeroPathSpan, type HeroPathSpan, type StarLightingFrame } from './lib/heroIntroTiming';
import { isHomeHeroIntroComplete, markHomeHeroIntroComplete, consumeHomeHeroIntroReplayRequest, peekHomeHeroIntroReplayRequest } from './lib/homeHeroIntro';
import { makeIntroBundle, makeIntroItem } from './lib/editorialRevealMotion';
import TopNavStrip from './components/TopNavStrip';
import NavBrandingMount from './components/euphoriaMandala/NavBrandingMount';
import AboutPage from './pages/AboutPage';
import type { AboutPracticeAction } from './content/aboutMandalaFacets';
import { PRACTICE_STORAGE_KEY } from './components/about/AboutInfluenceSlabs';
import CvPage from './pages/CvPage';
import { type GalleryImage } from './components/EditorialGalleryModal';
const HERO_PORTRAIT_MANDALA_ANCHOR_ID = 'mandala-anchor-hero-portrait';

/** Case study hero meta — impact lines (short bullets). */
const ADOPT_CASE_STUDY_IMPACT_META = [
  'Field-to-pledge path without warehouse bottleneck',
  'Object, mobile, and ops in one system',
] as const;

/** Case study title — outcome-oriented framing (hero h1). */
const ADOPT_CASE_STUDY_TITLE = 'Designing a scalable fundraising experience for Backpack Brigade';

/** Case study hero — Manrope subheader below title (sentence case). */
const ADOPT_CASE_STUDY_SUBTITLE =
  'Transforming an unstructured volunteer participation pathway into avenues for revenue and discovery.';

/** Homepage case-study copy — kicker, named work, lede, door. */
const HOME_CASE_STUDIES = {
  adopt: {
    industry: 'Nonprofit',
    discipline: 'Product + service design',
    title: 'The Adopt a School program',
    lede:
      'Designed a participation path for a Seattle food program, turning aisle curiosity into enrollment the organization can run again.',
  },
  driver: {
    industry: 'Logistics',
    discipline: 'Product + service design',
    title: 'Map-aid: tailored logistics',
    lede:
      'Designed how a food-rescue team assigns routes when plans break, turning informal driver flexibility into a picture the whole team can use.',
  },
  ajediam: {
    industry: 'Jewelry',
    discipline: 'Brand + product',
    title: 'Ajediam',
    lede:
      'Gave Ajediam one visual and product language as it scaled, so every surface told the same purchase story.',
  },
} as const satisfies Record<
  string,
  HomeCaseStudyMeta & {
    title: string;
    lede: string;
  }
>;

/** Impact summary — own case-study act after Context & Intro. */
const ADOPT_IMPACT_SUMMARY_HEADING = 'Before and after Adopt a School';

/** Editorial thesis between hero title and Context & Intro card. */
const ADOPT_CASE_STUDY_IMPACT_SUMMARY_LINES = [
  'Adopt-a-School had to work as one coordinated system—not disconnected touchpoints with a warehouse at the center.',
  'Physical activation and donor engagement create the moment of commitment; digital enrollment, warehouse throughput, and volunteer coordination carry it into partnerships the nonprofit can repeat.',
  'Service and product design connected field presence, pledge capture, and operational clarity so scale did not collapse back into logistics bottlenecks.',
] as const;

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

/** Ajediam / touchpoints — three-act case study (hero · context · before/after). */
const TOUCHPOINTS_CASE_STUDY_TITLE = 'System-led product strategy across touchpoints';

const TOUCHPOINTS_CASE_STUDY_SUBTITLE =
  'Founding design for Ajediam: brand identity, product UI, and web as one framework as the business scaled from early product to daily use.';

const TOUCHPOINTS_IMPACT_SUMMARY_HEADING = 'Before and after Ajediam';

const TOUCHPOINTS_CASE_STUDY_IMPACT_SUMMARY_LINES = [
  'Ajediam needed brand, product, and web to scale together—not three parallel refreshes with different visual languages.',
  'One framework tied identity, interface patterns, and the marketing site so every surface reinforced the same purchase and discovery story.',
  'Shared foundations shortened cycles, raised daily active use from 150 to 400+, and lifted retention 24.62% by 2024.',
] as const;

const TOUCHPOINTS_KEY_INSIGHT_BODY =
  'Growth only held when brand strategy, product UI, and web experience moved as a single system—not disconnected deliverables.';

/** Ajediam — legacy narrative blocks (other brand-identity sections). */
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

/**
 * Cross-functional work galleries.
 *
 * Every frame here is a pre-composed 16:9 lifestyle shot — the screen is already sized and placed
 * inside the artwork with intended air around it. So the carousel shows them centered at native
 * scale. The old per-slot focal offsets and 1.3–1.6 zooms existed to rescue raw screenshots; they
 * would now fight framing that was already resolved upstream.
 */
const FEATURED_GALLERIES: Record<
  (typeof FEATURED_PROJECTS)[number]['id'],
  GalleryImage[]
> = {
  'amazon-dbs': [
    { src: '/home/teams/dbs-1.jpg', isHero: true, caption: 'Amazon storefront — desktop and mobile deal placements' },
    { src: '/home/teams/dbs-2.jpg', caption: 'Campaign creative — traffic placement variants' },
    { src: '/home/teams/dbs-3.jpg', caption: 'Seasonal campaign — cross-format rollout' },
  ],
  'amazon-alexa': [
    { src: '/home/teams/alexa-1.jpg', isHero: true, caption: 'Alexa+ for Kids — feature page' },
    { src: '/home/teams/alexa-2.jpg', caption: 'Alexa+ — conversational UI patterns' },
    { src: '/home/teams/alexa-3.jpg', caption: 'Alexa+ — device and companion surfaces' },
  ],
  covantis: [
    { src: '/home/teams/covantis-1.jpg', isHero: true, caption: 'circleOut — product landing' },
    { src: '/home/teams/covantis-2.jpg', caption: 'Covantis — platform narrative' },
  ],
};

function getFeaturedGallery(projectId: (typeof FEATURED_PROJECTS)[number]['id']): GalleryImage[] {
  return FEATURED_GALLERIES[projectId] ?? [];
}

function hasImageSrc(image: GalleryImage): image is { src: string; isHero?: boolean; caption?: string } {
  return 'src' in image;
}

/**
 * Every long-form view is addressable.
 *
 * The case studies render as full-page layers over the homepage rather than as separate trees, but
 * that is a rendering detail — the URL is the source of truth for which one is open, so each can be
 * linked, shared, bookmarked, reopened by the back button, and crawled.
 */
const PAGE_ROUTES = {
  home: '/',
  about: '/about',
  cv: '/cv',
  adopt: '/work/adopt-a-school',
  driver: '/work/driver-coordination',
  touchpoints: '/work/ajediam',
  ai: '/thinking/designing-with-ai',
} as const;

type PageRouteKey = keyof typeof PAGE_ROUTES;

const DOCUMENT_TITLES: Record<PageRouteKey, string> = {
  home: 'Daniel Román — Product Designer',
  about: 'About — Daniel Román',
  cv: 'CV — Daniel Román',
  adopt: 'Adopt-a-School — Daniel Román',
  driver: 'Driver coordination — Daniel Román',
  touchpoints: 'Ajediam — Daniel Román',
  ai: 'Designing with AI — Daniel Román',
};

const ROUTE_KEY_BY_PATH = new Map<string, PageRouteKey>(
  (Object.entries(PAGE_ROUTES) as [PageRouteKey, string][]).map(([key, path]) => [path, key]),
);

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  /** Unknown paths fall back to home rather than rendering a blank tree. */
  const routeKey = ROUTE_KEY_BY_PATH.get(location.pathname) ?? 'home';

  const openAdoptPage = routeKey === 'adopt';
  const openDriverPage = routeKey === 'driver';
  const openTouchpointsPage = routeKey === 'touchpoints';
  const openDesigningAiPage = routeKey === 'ai';
  const isHomeRoute = routeKey === 'home';

  const goToRoute = useCallback(
    (key: PageRouteKey) => {
      if (location.pathname !== PAGE_ROUTES[key]) navigate(PAGE_ROUTES[key]);
    },
    [location.pathname, navigate],
  );

  useEffect(() => {
    document.title = DOCUMENT_TITLES[routeKey];
  }, [routeKey]);

  const [adoptHeroMotionKey, setAdoptHeroMotionKey] = useState(0);
  const [adoptCaseStudyNavSurface, setAdoptCaseStudyNavSurface] = useState<'default' | 'media'>('media');
  const adoptCaseStudyScrollRef = useRef<HTMLDivElement>(null);
  const adoptCaseStudyHeroRef = useRef<HTMLDivElement>(null);
  const [adoptFullCaseStudyOpen, setAdoptFullCaseStudyOpen] = useState(false);
  const [adoptAccordionOpen, setAdoptAccordionOpen] = useState<number | null>(null);
  const [touchpointsHeroMotionKey, setTouchpointsHeroMotionKey] = useState(0);
  const [touchpointsCaseStudyNavSurface, setTouchpointsCaseStudyNavSurface] = useState<'default' | 'media'>('media');
  const touchpointsCaseStudyScrollRef = useRef<HTMLDivElement>(null);
  const touchpointsCaseStudyHeroRef = useRef<HTMLDivElement>(null);
  const [driverCaseStudyNavSurface, setDriverCaseStudyNavSurface] = useState<'default' | 'media'>('media');
  const [driverHeroMotionKey, setDriverHeroMotionKey] = useState(0);
  const [homeNavSurface, setHomeNavSurface] = useState<'hero' | 'default'>('hero');
  const driverCaseStudyScrollRef = useRef<HTMLDivElement>(null);
  const driverCaseStudyHeroRef = useRef<HTMLDivElement>(null);
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
  const [heroIntroSeen, setHeroIntroSeen] = useState(
    () => !peekHomeHeroIntroReplayRequest() && isHomeHeroIntroComplete(),
  );
  const [heroIntroReplayKey, setHeroIntroReplayKey] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const heroIntroRef = useRef<HTMLDivElement | null>(null);
  const heroH1RowRef = useRef<HTMLDivElement | null>(null);
  const heroNameRef = useRef<HTMLDivElement | null>(null);
  const heroLightAnchorsMeasuredRef = useRef(false);
  const [heroPortraitRevealed, setHeroPortraitRevealed] = useState(false);
  const [heroPortraitSessionStamp, setHeroPortraitSessionStamp] = useState(0);
  const [heroBannerLens, setHeroBannerLens] = useState<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });
  const [heroBannerVisible, setHeroBannerVisible] = useState(false);
  const [heroMandalaUnlocked, setHeroMandalaUnlocked] = useState(
    () => !peekHomeHeroIntroReplayRequest() && isHomeHeroIntroComplete(),
  );
  const [heroFieldLive, setHeroFieldLive] = useState(
    () => !peekHomeHeroIntroReplayRequest() && isHomeHeroIntroComplete(),
  );
  const [heroBannerPaletteKey, setHeroBannerPaletteKey] = useState(0);
  const lastMouseMoveAtRef = useRef(0);
  const heroBannerRef = useRef<HTMLDivElement | null>(null);
  const heroBannerVisibleRef = useRef(heroBannerVisible);
  heroBannerVisibleRef.current = heroBannerVisible;
  const heroMandalaUnlockedRef = useRef(heroMandalaUnlocked);
  heroMandalaUnlockedRef.current = heroMandalaUnlocked;
  const heroLensRafRef = useRef(0);
  const heroLensPendingRef = useRef<{
    clientX: number;
    clientY: number;
    bannerRect: DOMRect;
    insideBannerY: boolean;
  } | null>(null);
  const heroIntroInitiallyComplete =
    !peekHomeHeroIntroReplayRequest() && isHomeHeroIntroComplete();
  /** Clock 1 — star path: name traveling front + portrait proximity. */
  const heroStarProgress = useMotionValue(heroIntroInitiallyComplete ? 1 : 0);
  const heroStarEnvelope = useMotionValue(0);
  const heroPortraitAnchor = useMotionValue(0.46);
  /** Clock 2 — type illuminate: role + subhead (+ portrait settle). Never drives sky/field. */
  const heroTypeIlluminateProgress = useMotionValue(heroIntroInitiallyComplete ? 1 : 0);
  /** Clock 3 — post-pass field: sky colour-map + banner opacity. */
  const heroNightFieldProgress = useMotionValue(heroIntroInitiallyComplete ? 1 : 0);
  const heroNightFieldGenRef = useRef(0);
  const heroNightFieldRafRef = useRef(0);
  const heroNightFieldDoneRef = useRef(heroIntroInitiallyComplete);
  const heroNightFieldStartedRef = useRef(heroIntroInitiallyComplete);
  const heroStarPassDoneRef = useRef(heroIntroInitiallyComplete);
  const heroTypeIlluminateStartedRef = useRef(heroIntroInitiallyComplete);
  /** Name edges in star-path units — measured once for the traveling front. */
  const heroLightSpansRef = useRef<{ name: HeroPathSpan }>({
    name: { start: 0.04, end: 0.4, center: 0.22 },
  });
  const skipHeroIntro = prefersReducedMotion || heroIntroSeen;
  const heroSkyBackgroundImage = useTransform(heroNightFieldProgress, (p) =>
    heroSkyBackgroundImageAt(Math.min(1, Math.max(0, p))),
  );
  const heroBannerAmbientOpacity = useTransform(heroNightFieldProgress, (p) =>
    heroBannerAmbientOpacityAt(Math.min(1, Math.max(0, p))),
  );
  const heroSecondaryLight = useTransform(heroTypeIlluminateProgress, heroTypeIlluminateAt);
  /**
   * Light map is transient — retired once the intro settles so resting type is flat white.
   * While active, copy is always present: light drives colour, never existence.
   */
  const heroLightmapActive = !skipHeroIntro;
  const heroNameClassName = [
    'hero-inline-h1 font-eyebrow relative z-10 mb-0 mt-0 inline-block align-middle font-normal',
    heroLightmapActive ? 'hero-inline-lightmap hero-inline-lightmap--name' : '',
  ]
    .filter(Boolean)
    .join(' ');
  const heroLine2ClassName = [
    'hero-inline-h1 font-eyebrow relative z-10 mb-0 mt-0 block w-full font-normal',
    heroLightmapActive ? 'hero-inline-lightmap hero-inline-lightmap--role' : '',
  ]
    .filter(Boolean)
    .join(' ');
  const heroSubClassName = [
    'hero-inline-h2 editorial-hero-subheader mx-auto mb-0 block w-full text-center font-medium text-pretty',
    heroLightmapActive ? 'hero-inline-lightmap hero-inline-lightmap--sub' : '',
  ]
    .filter(Boolean)
    .join(' ');
  /** Name: traveling front only — no illuminate fill. */
  const heroNameLightVar = '0';
  const heroRoleLightVar = useTransform(heroSecondaryLight, heroTextLightVarAt);
  const heroSubLightVar = useTransform(heroSecondaryLight, heroTextLightVarAt);
  const heroNameBandX = useTransform(heroStarProgress, (starP) =>
    heroBandPositionAt(starP, heroLightSpansRef.current.name),
  );
  /** Role + subhead: illuminate sweep — not star x. */
  const heroRoleBandX = useTransform(heroSecondaryLight, heroSweepPositionAt);
  const heroSubBandX = useTransform(heroSecondaryLight, heroSweepPositionAt);
  const heroNameBandAlpha = useTransform(heroStarEnvelope, (env) => heroBandAlphaAt(env, 0));
  const heroRoleBandAlpha = useTransform(heroSecondaryLight, heroSweepAlphaAt);
  const heroSubBandAlpha = useTransform(heroSecondaryLight, heroSweepAlphaAt);
  /** Portrait — shadow → colour on the same cadence as type; not sky/field. */
  const heroPortraitPresence = useTransform(
    [heroStarProgress, heroTypeIlluminateProgress, heroPortraitAnchor],
    ([starP, illum, anchor]) =>
      heroPortraitPresenceAt(starP as number, anchor as number, illum as number),
  );
  const heroPortraitFilter = useTransform(
    [heroStarProgress, heroTypeIlluminateProgress, heroPortraitAnchor],
    ([starP, illum, anchor]) =>
      heroPortraitFilterAt(starP as number, anchor as number, illum as number),
  );

  const handleStarFrame = useCallback(
    (frame: StarLightingFrame) => {
      heroStarProgress.set(frame.pathProgress);
      heroStarEnvelope.set(frame.envelope);
      heroPortraitAnchor.set(frame.portraitProgress);

      if (heroLightAnchorsMeasuredRef.current || !heroH1RowRef.current) return;
      const field = heroH1RowRef.current.querySelector('[data-hero-star-field]');
      if (!(field instanceof HTMLElement)) return;
      if (heroNameRef.current) {
        heroLightSpansRef.current.name = measureHeroPathSpan(field, heroNameRef.current);
      }
      heroLightAnchorsMeasuredRef.current = true;
    },
    [heroStarProgress, heroStarEnvelope, heroPortraitAnchor],
  );

  const tryUnlockHeroMandala = useCallback(() => {
    if (heroStarPassDoneRef.current) {
      setHeroMandalaUnlocked(true);
    }
  }, []);

  const resetHomeHeroIntroForReplay = useCallback(() => {
    heroNightFieldGenRef.current += 1;
    cancelAnimationFrame(heroNightFieldRafRef.current);
    heroNightFieldDoneRef.current = false;
    heroNightFieldStartedRef.current = false;
    heroStarPassDoneRef.current = false;
    heroTypeIlluminateStartedRef.current = false;
    heroTypeIlluminateProgress.set(0);
    heroNightFieldProgress.set(0);
    heroStarProgress.set(0);
    heroStarEnvelope.set(0);
    heroPortraitAnchor.set(0.46);
    heroLightAnchorsMeasuredRef.current = false;
    setHeroMandalaUnlocked(false);
    setHeroFieldLive(false);
    setHeroBannerVisible(false);
    setHeroPortraitRevealed(false);
    setHeroIntroSeen(false);
    setHeroIntroReplayKey((k) => k + 1);
  }, [heroTypeIlluminateProgress, heroNightFieldProgress, heroStarProgress, heroStarEnvelope, heroPortraitAnchor]);

  const settleHomeHeroIntro = useCallback(() => {
    heroNightFieldGenRef.current += 1;
    cancelAnimationFrame(heroNightFieldRafRef.current);
    heroNightFieldDoneRef.current = true;
    heroNightFieldStartedRef.current = true;
    heroStarPassDoneRef.current = true;
    heroTypeIlluminateStartedRef.current = true;
    heroTypeIlluminateProgress.set(1);
    heroNightFieldProgress.set(1);
    heroStarProgress.set(1);
    heroStarEnvelope.set(0);
    heroPortraitAnchor.set(0.46);
    setHeroMandalaUnlocked(true);
    setHeroFieldLive(true);
    setHeroIntroSeen(true);
  }, [heroTypeIlluminateProgress, heroNightFieldProgress, heroStarProgress, heroStarEnvelope, heroPortraitAnchor]);

  useEffect(() => {
    if (!isHomeRoute) return;

    if (consumeHomeHeroIntroReplayRequest()) {
      resetHomeHeroIntroForReplay();
      return;
    }

    if (prefersReducedMotion || isHomeHeroIntroComplete()) {
      settleHomeHeroIntro();
    }
  }, [isHomeRoute, prefersReducedMotion, settleHomeHeroIntro, resetHomeHeroIntroForReplay]);

  const handleHeroPortraitIlluminate = useCallback(() => {
    if (skipHeroIntro || heroTypeIlluminateStartedRef.current) return;
    heroTypeIlluminateStartedRef.current = true;
    animate(heroTypeIlluminateProgress, 1, {
      duration: heroIntroTiming.typeIlluminateDurationMs / 1000,
      ease: [...HERO_INTRO_EASE],
    });
  }, [skipHeroIntro, heroTypeIlluminateProgress]);

  const handleHeroStarPassComplete = useCallback(() => {
    if (prefersReducedMotion) return;
    markHomeHeroIntroComplete();
    heroStarPassDoneRef.current = true;
    setHeroIntroSeen(true);
    heroStarProgress.set(1);
    heroStarEnvelope.set(0);
    if (!heroTypeIlluminateStartedRef.current) {
      heroTypeIlluminateStartedRef.current = true;
      heroTypeIlluminateProgress.set(1);
    }
    setHeroFieldLive(true);
    tryUnlockHeroMandala();
  }, [prefersReducedMotion, heroStarProgress, heroStarEnvelope, heroTypeIlluminateProgress, tryUnlockHeroMandala]);

  useEffect(() => {
    if (!heroFieldLive) return;
    if (heroNightFieldProgress.get() >= 0.999) {
      heroNightFieldStartedRef.current = true;
      heroNightFieldDoneRef.current = true;
      tryUnlockHeroMandala();
      return;
    }
    const gen = heroNightFieldGenRef.current;
    heroNightFieldStartedRef.current = true;
    const from = heroNightFieldProgress.get();
    const durationMs = heroFieldRevealDurationS() * 1000;
    const t0 = performance.now();
    const step = (now: number) => {
      if (heroNightFieldGenRef.current !== gen) return;
      const eased = heroFieldRevealEase((now - t0) / durationMs);
      heroNightFieldProgress.set(from + (1 - from) * eased);
      /* Interactive lens as soon as the field is readable — don't wait for fade end. */
      if (eased >= 0.28) tryUnlockHeroMandala();
      if (eased < 1) {
        heroNightFieldRafRef.current = requestAnimationFrame(step);
        return;
      }
      heroNightFieldProgress.set(1);
      heroNightFieldDoneRef.current = true;
      tryUnlockHeroMandala();
    };
    heroNightFieldRafRef.current = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(heroNightFieldRafRef.current);
      if (heroNightFieldGenRef.current === gen && heroNightFieldProgress.get() < 0.999) {
        heroNightFieldStartedRef.current = false;
      }
    };
  }, [heroFieldLive, heroNightFieldProgress, tryUnlockHeroMandala]);

  const featuredProject = FEATURED_PROJECTS[selectedFeaturedIndex];
  const featuredCarouselSlides = useMemo(
    () =>
      getFeaturedGallery(featuredProject.id)
        .filter(hasImageSrc)
        .slice(0, 3)
        .map((image, index) => ({
          image: image.src,
          alt: image.caption
            ? `${featuredProject.title} — ${image.caption}`
            : `${featuredProject.title} gallery visual ${index + 1}`,
          caption: image.caption ?? `${featuredProject.title} visual ${index + 1}`,
          objectPosition: '50% 50%',
          objectFit: 'cover' as const,
        })),
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

  const handleHomeNavClick = () => {
    goToRoute('home');
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  };

  const handleAboutNavClick = () => goToRoute('about');
  const handleCvNavClick = () => goToRoute('cv');

  const openPracticeFromAbout = useCallback(
    (action: AboutPracticeAction) => {
      /** Only the in-page anchor needs a handoff; the case studies are now plain destinations. */
      if (action !== 'thinking') {
        goToRoute(action);
        return;
      }
      if (!isHomeRoute) {
        sessionStorage.setItem(PRACTICE_STORAGE_KEY, action);
        navigate(PAGE_ROUTES.home);
        return;
      }
      requestAnimationFrame(() => {
        document.getElementById('thinking-cards-heading')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    },
    [goToRoute, isHomeRoute, navigate],
  );

  useEffect(() => {
    if (!isHomeRoute) return;
    if (!sessionStorage.getItem(PRACTICE_STORAGE_KEY)) return;
    sessionStorage.removeItem(PRACTICE_STORAGE_KEY);
    requestAnimationFrame(() => {
      document.getElementById('thinking-cards-heading')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [isHomeRoute]);

  /** Case-study overlays mount their own TopNavStrip; keep home strip out to avoid duplicate nav layers. */
  const isFullPageOverlayOpen =
    openDesigningAiPage ||
    openAdoptPage ||
    openTouchpointsPage ||
    openDriverPage;

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
    if (openTouchpointsPage) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [openTouchpointsPage]);

  useEffect(() => {
    if (!openTouchpointsPage) {
      setTouchpointsCaseStudyNavSurface('media');
      return;
    }
    setTouchpointsHeroMotionKey((k) => k + 1);
    const scrollEl = touchpointsCaseStudyScrollRef.current;
    const resetScroll = () => {
      if (scrollEl) scrollEl.scrollTop = 0;
    };
    resetScroll();
    requestAnimationFrame(() => {
      resetScroll();
      requestAnimationFrame(resetScroll);
    });
    const heroEl = touchpointsCaseStudyHeroRef.current;
    if (!scrollEl || !heroEl) return;

    const navThresholdPx = 52;
    const sync = () => {
      const { bottom } = heroEl.getBoundingClientRect();
      setTouchpointsCaseStudyNavSurface(bottom > navThresholdPx ? 'media' : 'default');
    };

    sync();
    scrollEl.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    return () => {
      scrollEl.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [openTouchpointsPage]);

  useEffect(() => {
    if (!openDriverPage) {
      setDriverCaseStudyNavSurface('media');
      return;
    }
    setDriverHeroMotionKey((k) => k + 1);
    const scrollEl = driverCaseStudyScrollRef.current;
    const resetScroll = () => {
      if (scrollEl) scrollEl.scrollTop = 0;
    };
    resetScroll();
    requestAnimationFrame(() => {
      resetScroll();
      requestAnimationFrame(resetScroll);
    });
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
    setAdoptHeroMotionKey((k) => k + 1);
    const scrollEl = adoptCaseStudyScrollRef.current;
    const resetScroll = () => {
      if (scrollEl) scrollEl.scrollTop = 0;
    };
    resetScroll();
    requestAnimationFrame(() => {
      resetScroll();
      requestAnimationFrame(resetScroll);
    });
    const scrollElForNav = document.getElementById('adopt-case-study-scroll');
    const heroEl = adoptCaseStudyHeroRef.current;
    if (!scrollElForNav || !heroEl) return;

    const navThresholdPx = 52;
    const sync = () => {
      const { bottom } = heroEl.getBoundingClientRect();
      setAdoptCaseStudyNavSurface(bottom > navThresholdPx ? 'media' : 'default');
    };

    sync();
    scrollElForNav.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    return () => {
      scrollElForNav.removeEventListener('scroll', sync);
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
    return () => {
      if (heroLensRafRef.current) {
        cancelAnimationFrame(heroLensRafRef.current);
        heroLensRafRef.current = 0;
      }
    };
  }, []);

  /** First scroll — white sheet glides over the navy hero (subtle overlay depth). */
  const { scrollYProgress: heroSheetReveal } = useScroll({
    target: heroSectionRef,
    offset: ['start start', 'end start'],
  });
  /** White sheet — single mover on outer margin (inner content rides with the slab). */
  const homeSurfaceLift = useSpring(
    useTransform(heroSheetReveal, [0, 0.14, 0.32], prefersReducedMotion ? [0, 0, 0] : [0, -52, -76]),
    { stiffness: 50, damping: 26, mass: 0.55 },
  );
  /** margin-top parallax — avoid transform on sheet (deck modal is portaled to body). */
  const homeSurfaceMarginTop = useMotionTemplate`calc(clamp(-2rem, -5vh, -3.5rem) + ${homeSurfaceLift}px)`;
  /** Opacity only — no separate y; sheet drag carries case-study content. */
  const homeRoundOpacity = useSpring(
    useTransform(heroSheetReveal, [0, 0.1, 0.24], prefersReducedMotion ? [1, 1, 1] : [0, 0.35, 1]),
    { stiffness: 52, damping: 28, mass: 0.5 },
  );

  const [caseStudiesUnlocked, setCaseStudiesUnlocked] = useState(false);
  useEffect(() => {
    if (prefersReducedMotion) {
      setCaseStudiesUnlocked(true);
      setHomeNavSurface('default');
      return;
    }
    const heroEl = heroSectionRef.current;
    if (!heroEl) return;

    const navThresholdPx = 52;
    const syncHomeChrome = (progress: number) => {
      const { bottom } = heroEl.getBoundingClientRect();
      const heroBehindNav = bottom > navThresholdPx;
      const sheetStillOverHero = progress < 0.28;
      setHomeNavSurface(heroBehindNav && sheetStillOverHero ? 'hero' : 'default');
      if (progress > 0.08) setCaseStudiesUnlocked(true);
    };

    const sync = () => syncHomeChrome(heroSheetReveal.get());
    sync();
    window.addEventListener('resize', sync);
    const unsubscribe = heroSheetReveal.on('change', sync);
    return () => {
      unsubscribe();
      window.removeEventListener('resize', sync);
    };
  }, [heroSheetReveal, prefersReducedMotion]);

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

  if (routeKey === 'about') {
    return (
      <AboutPage
        onHomeClick={handleHomeNavClick}
        onAboutClick={handleAboutNavClick}
        onCvClick={handleCvNavClick}
        onPracticeClick={openPracticeFromAbout}
      />
    );
  }

  if (routeKey === 'cv') {
    return (
      <CvPage
        onHomeClick={handleHomeNavClick}
        onAboutClick={handleAboutNavClick}
        onCvClick={handleCvNavClick}
      />
    );
  }

  return (
    <div className="min-h-screen selection:bg-accent selection:text-white overflow-x-hidden bg-bg" style={{ backgroundColor: '#F8F9FA' }}>
      <AmbientMandalaTrail className="z-[10]" />

      <main className="editorial-page home-page relative z-20 pt-0">
      {!isFullPageOverlayOpen && (
        <TopNavStrip
          page="home"
          surface={homeNavSurface}
          mandalaAnchorId="mandala-nav-home"
          onHomeClick={handleHomeNavClick}
          onAboutClick={handleAboutNavClick}
          onCvClick={handleCvNavClick}
        />
      )}
      <section
        ref={heroSectionRef}
        className="home-hero relative -mt-11 mb-0 flex min-h-[calc(108dvh-3.25rem)] flex-col pt-11 md:min-h-[calc(110dvh-3.5rem)]"
        aria-label="Hero"
        onPointerEnter={() => {
          if (!heroMandalaUnlockedRef.current) return;
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
        <motion.div
          className="hero-sky-reveal-layer pointer-events-none absolute inset-0 z-0"
          initial={false}
          style={{ backgroundImage: heroSkyBackgroundImage }}
          aria-hidden
        />
        <div
          ref={heroBannerRef}
          className="absolute inset-x-0 top-0 z-[2] h-[clamp(248px,38vh,480px)] w-full overflow-hidden"
          style={{
            maskImage:
              'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 72%, rgba(0,0,0,0.36) 95%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 72%, rgba(0,0,0,0.36) 95%, rgba(0,0,0,0) 100%)',
          }}
          aria-hidden
        >
          <motion.div
            className="absolute inset-0"
            initial={false}
            style={{ opacity: heroBannerAmbientOpacity }}
            aria-hidden
          >
            <MandalaBanner
              fullBleed
              interactive={heroMandalaUnlocked}
              onDarkBackground
              paletteVersion={0}
              intensity={22}
              ecoMode
              revealProgress={heroNightFieldProgress}
              className="h-full min-h-[clamp(132px,20vh,100%)] w-full max-w-none min-w-0"
            />
          </motion.div>
          {heroMandalaUnlocked ? (
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
          ) : null}
        </div>
        <div
          className="pointer-events-none relative z-10 flex min-h-[calc(104dvh-6rem)] flex-1 flex-col items-center px-4 pb-14 pt-[clamp(152px,24vh,242px)] sm:px-6 sm:pb-16 sm:pt-[clamp(164px,25vh,258px)] md:min-h-[calc(106dvh-7rem)] md:px-12 md:pb-20 md:pt-[clamp(176px,26vh,272px)] lg:pb-24 lg:pt-[clamp(184px,27vh,288px)]"
        >
          <div className="mx-auto flex w-full max-w-[min(72rem,96vw)] flex-col items-center text-center">
            <div
              ref={heroIntroRef}
              className="hero-inline-intro mx-auto flex w-auto max-w-full shrink-0 flex-col items-center gap-0"
            >
              <div
                ref={heroH1RowRef}
                className="hero-inline-display relative mb-0 w-full min-w-0 overflow-visible text-center"
              >
                <h1 className="sr-only">
                  Daniel designs beyond screens, for business impact.
                </h1>

                <div
                  ref={heroNameRef}
                  className="hero-inline-display__line1 relative z-10 mb-0 flex flex-nowrap items-center justify-center gap-x-[0.08em] gap-y-0"
                >
                  <motion.span
                    className={heroNameClassName}
                    style={
                      heroLightmapActive
                        ? {
                            ['--hero-text-light' as string]: heroNameLightVar,
                            ['--hero-light-x' as string]: heroNameBandX,
                            ['--hero-band-alpha' as string]: heroNameBandAlpha,
                          }
                        : undefined
                    }
                  >
                    Daniel
                  </motion.span>
                  {/* Portrait wrapper — orbit ring lives here as a sibling of the button */}
                  <div
                    data-hero-portrait
                    className="hero-inline-portrait relative mx-[0.22em] inline-block shrink-0 self-center"
                    style={{ zIndex: 20 }}
                  >
                    <motion.button
                      type="button"
                      className="pointer-events-auto relative inline-block h-full w-full overflow-hidden rounded-full border-0 bg-transparent p-0 cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c1528]"
                      style={
                        prefersReducedMotion
                          ? undefined
                          : { pointerEvents: skipHeroIntro || heroMandalaUnlocked ? 'auto' : 'none' }
                      }
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
                      <motion.img
                        src="/hero-inline-portrait.png"
                        alt=""
                        width={112}
                        height={112}
                        loading="eager"
                        decoding="async"
                        aria-hidden
                        className="hero-inline-portrait-img pointer-events-none absolute z-[1] border-0 bg-transparent object-cover shadow-none outline-none ring-0 hero-inline-portrait-img--intro"
                        style={
                          prefersReducedMotion || skipHeroIntro
                            ? { opacity: heroPortraitRevealed ? 0 : 1 }
                            : {
                                opacity: heroPortraitRevealed ? 0 : heroPortraitPresence,
                                filter: heroPortraitRevealed ? undefined : heroPortraitFilter,
                              }
                        }
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

                    <div className="pointer-events-none absolute inset-0" aria-hidden>
                      <HeroOrbitRing />
                    </div>
                  </div>
                  <motion.span
                    className={heroNameClassName}
                    style={
                      heroLightmapActive
                        ? {
                            ['--hero-text-light' as string]: heroNameLightVar,
                            ['--hero-light-x' as string]: heroNameBandX,
                            ['--hero-band-alpha' as string]: heroNameBandAlpha,
                          }
                        : undefined
                    }
                  >
                    designs
                  </motion.span>
                  {/* The homepage stays mounted under case-study routes; don't burn the intro behind an overlay. */}
                  {!skipHeroIntro && isHomeRoute ? (
                    <HeroIntroStarPass
                      key={heroIntroReplayKey}
                      onStarFrame={handleStarFrame}
                      onPortraitIlluminate={handleHeroPortraitIlluminate}
                      onPassComplete={handleHeroStarPassComplete}
                    />
                  ) : null}
                </div>

                <motion.span
                  className={`${heroLine2ClassName} hero-inline-display__line2`}
                  style={
                    heroLightmapActive
                      ? {
                          ['--hero-text-light' as string]: heroRoleLightVar,
                          ['--hero-light-x' as string]: heroRoleBandX,
                          ['--hero-band-alpha' as string]: heroRoleBandAlpha,
                        }
                      : undefined
                  }
                >
                  beyond screens,
                </motion.span>
                <motion.span
                  className={`${heroLine2ClassName} hero-inline-display__line3`}
                  style={
                    heroLightmapActive
                      ? {
                          ['--hero-text-light' as string]: heroRoleLightVar,
                          ['--hero-light-x' as string]: heroRoleBandX,
                          ['--hero-band-alpha' as string]: heroRoleBandAlpha,
                        }
                      : undefined
                  }
                >
                  for business impact.
                </motion.span>
              </div>
              <div>
                <motion.h2
                  className={heroSubClassName}
                  style={
                    heroLightmapActive
                      ? {
                          ['--hero-text-light' as string]: heroSubLightVar,
                          ['--hero-light-x' as string]: heroSubBandX,
                          ['--hero-band-alpha' as string]: heroSubBandAlpha,
                        }
                      : undefined
                  }
                >
                  Informed by research insights. Grounded in business realities &amp; systems thinking. Brought to life with a craftsman&apos;s touch.
                </motion.h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      <motion.div className="home-page-surface" style={{ marginTop: homeSurfaceMarginTop }}>
      <motion.div
        className={[
          'home-page-surface-round',
          caseStudiesUnlocked ? '' : 'pointer-events-none',
        ].join(' ')}
        style={{ opacity: homeRoundOpacity }}
      >
      <HomePartneringTicker />
      <div className="home-case-study-well">
      {/* Case study 1: NGO participation system — reveals after first hero scroll */}
      <motion.section
        className="home-case-study-entry overflow-x-clip px-4 sm:px-6 md:overflow-x-visible md:px-12"
        aria-labelledby="case-study-ngo-heading"
        variants={revealSection}
        initial="hidden"
        animate={caseStudiesUnlocked ? 'show' : 'hidden'}
      >
        <div className="mx-auto w-full max-w-[1180px]">
          <div className="home-case-study-split home-case-study-split--caption-end mx-auto grid w-full grid-cols-1 gap-6 md:grid-cols-12 md:gap-y-8">
            <div className="home-case-study-split__copy order-1 md:order-2 md:col-span-5">
              <motion.div variants={revealItem}>
                <HomeCaseStudyCopy
                  headingId="case-study-ngo-heading"
                  {...HOME_CASE_STUDIES.adopt}
                  onCta={() => goToRoute('adopt')}
                />
              </motion.div>
            </div>
            <div className="home-case-study-split__media order-2 md:order-1 md:col-span-7">
              <motion.div variants={revealItem}>
                <button
                  type="button"
                  className="home-case-study-media-frame"
                  onClick={() => goToRoute('adopt')}
                  aria-label={`View case study: ${HOME_CASE_STUDIES.adopt.title}`}
                >
                  <img
                    src="/home/case-study-adopt.jpg"
                    alt="Adopt-a-School on a laptop — map-based school selection with a four-step pledge flow"
                    className="h-full w-full object-cover"
                    loading="eager"
                    decoding="async"
                  />
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Case study 2: coordination system + image stack */}
      <motion.section
        className="home-case-study-entry px-4 sm:px-6 md:px-12"
        aria-labelledby="case-study-driver-heading"
        variants={revealSection}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.18 }}
      >
        <div className="mx-auto w-full max-w-[1180px]">
          <motion.div
            variants={revealItem}
            className="home-case-study-split home-case-study-split--caption-start grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-y-8"
          >
            <div className="home-case-study-split__media order-2 md:order-2 md:col-span-7">
              <motion.div variants={revealItem}>
                <button
                  type="button"
                  className="home-case-study-media-frame"
                  onClick={() => goToRoute('driver')}
                  aria-label={`View case study: ${HOME_CASE_STUDIES.driver.title}`}
                >
                  <img
                    src="/home/case-study-driver.jpg"
                    alt="Driver coordination system on a laptop — real-time map of driver availability across Seattle"
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </button>
              </motion.div>
            </div>

          <motion.div variants={revealItem} className="home-case-study-split__copy order-1 md:order-1 md:col-span-5">
            <HomeCaseStudyCopy
              headingId="case-study-driver-heading"
              {...HOME_CASE_STUDIES.driver}
              onCta={() => goToRoute('driver')}
            />
          </motion.div>
        </motion.div>
        </div>
      </motion.section>

      {/* Case study 3: Ajediam brand identity */}
      <motion.section
        className="home-case-study-entry px-4 sm:px-6 md:px-12"
        aria-labelledby="touchpoints-heading"
        variants={revealSection}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.18 }}
      >
        <div className="mx-auto w-full max-w-[1180px]">
          <motion.div
            variants={revealItem}
            className="home-case-study-split home-case-study-split--caption-end grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-y-8"
          >
            <div className="home-case-study-split__media order-2 md:order-1 md:col-span-7">
              <motion.div variants={revealItem}>
                <button
                  type="button"
                  className="home-case-study-media-frame"
                  onClick={() => goToRoute('touchpoints')}
                  aria-label={`View case study: ${HOME_CASE_STUDIES.ajediam.title}`}
                >
                  <img
                    src="/home/case-study-ajediam.jpg"
                    alt="Ajediam editorial article on iPad — the Koh-i-Noor diamond feature and its brand typography"
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </button>
              </motion.div>
            </div>

            <motion.div variants={revealItem} className="home-case-study-split__copy order-1 md:order-2 md:col-span-5">
              <HomeCaseStudyCopy
                headingId="touchpoints-heading"
                {...HOME_CASE_STUDIES.ajediam}
                onCta={() => goToRoute('touchpoints')}
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
      </div>

      {/*
        Full-page layers are portalled to <body>.

        In the document they sit inside `.home-page-surface-round`, the sheet whose opacity is
        driven by homepage scroll — so left in place they inherit whatever the sheet happens to be
        at (near zero when a case-study URL is opened cold, since the homepage behind is unscrolled)
        and are muted by its `pointer-events: none`. Portalling makes their fixed positioning and
        z-index resolve against the viewport, independent of how the homepage is scrolled.
      */}
      {createPortal(
        <>
      {/* Designing with AI — page view (gestalt: cards = title + image + caption per section) */}
      <AnimatePresence>
        {openDesigningAiPage && (
          <motion.div
            id="designing-ai-scroll"
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
                  <h2 id="ai-cross-functional" className="mb-4 scroll-mt-6 md:mb-5">
                    From concept to functional product
                  </h2>
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
            <SiteFooter />
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
            className="fixed inset-0 z-[200] flex flex-col bg-bg overflow-y-auto overflow-x-hidden overscroll-y-contain"
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
              <div className="adopt-case-study mx-auto w-full min-w-0 max-w-[min(100%,1180px)] px-5 pb-[3rem] pt-[calc(var(--site-header-height,2.75rem)+1.75rem)] sm:px-7 md:px-12 md:pb-[3.5rem] md:pt-[calc(var(--site-header-height,2.75rem)+2.25rem)] lg:px-14 lg:pt-[calc(var(--site-header-height,2.75rem)+2.75rem)]">
                <div className="adopt-case-study-acts">
                  {/* Act 1 — Hero */}
                  <motion.section
                    key={adoptHeroMotionKey}
                    className="adopt-case-study-act adopt-case-study-act--hero min-w-0 scroll-mt-6"
                    initial="hidden"
                    animate="show"
                    variants={makeIntroBundle(prefersReducedMotion)}
                  >
                    <motion.div variants={makeIntroItem(prefersReducedMotion)}>
                      <AdoptCaseStudyParallax
                        scrollContainerRef={adoptCaseStudyScrollRef}
                        reducedMotion={prefersReducedMotion}
                        variant="lead"
                        className="adopt-case-study-act__parallax"
                      >
                        <div
                          ref={adoptCaseStudyHeroRef}
                          className="adopt-case-study-hero-media w-full overflow-hidden rounded-2xl border border-ink/[0.09] shadow-[0_4px_32px_-8px_rgba(12,21,40,0.13)]"
                          style={{ aspectRatio: '16/9' }}
                        >
                          <img
                            src="/adopt-a-school/hero-banner.jpg"
                            alt="Adopt-a-School running on a laptop and phone — school selection map and pledge flow."
                            className="h-full w-full object-cover object-center"
                            loading="eager"
                            decoding="async"
                          />
                        </div>
                      </AdoptCaseStudyParallax>
                    </motion.div>

                    <motion.h1
                      className="mb-0 scroll-mt-6 text-balance text-center"
                      variants={makeIntroItem(prefersReducedMotion)}
                    >
                      {ADOPT_CASE_STUDY_TITLE}
                    </motion.h1>
                    <motion.p
                      className="adopt-case-study-hero-subheader editorial-hero-subheader m-0 text-pretty text-center"
                      variants={makeIntroItem(prefersReducedMotion)}
                    >
                      {ADOPT_CASE_STUDY_SUBTITLE}
                    </motion.p>
                  </motion.section>

                  {/* Act 2 — Context & Intro */}
                  <AdoptCaseStudySection
                    act="context"
                    scrollContainerRef={adoptCaseStudyScrollRef}
                    reducedMotion={prefersReducedMotion}
                    parallax="lead"
                  >
                    <AdoptCaseStudyOverviewStage
                      scrollContainerRef={adoptCaseStudyScrollRef}
                      reducedMotion={prefersReducedMotion}
                      contextColumn={
                        <>
                          <h2 id="adopt-section-context" className="adopt-context-heading scroll-mt-6">
                            Context &amp; Intro
                          </h2>
                          <aside className="adopt-meta-rail" aria-label="Project metadata">
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
                  </AdoptCaseStudySection>

                  {/* Act 3 — Before and after */}
                  <AdoptCaseStudySection
                    act="impact"
                    id="adopt-section-impact"
                    scrollContainerRef={adoptCaseStudyScrollRef}
                    reducedMotion={prefersReducedMotion}
                    parallax="lead"
                    aria-labelledby="adopt-impact-summary-label"
                  >
                    <div className="adopt-impact-summary-block">
                      <div className="adopt-impact-summary-grid grid grid-cols-1 items-start md:grid-cols-2">
                        <div className="flex items-center justify-center md:justify-start">
                          <img
                            src="/adopt-a-school/hero-pledge-square.jpg"
                            alt="Adopt-a-School — pledge amount step on mobile, with a slider for choosing a donation."
                            className="h-auto w-full max-w-[340px] rounded-2xl object-contain md:max-w-none"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                        <div className="adopt-impact-summary min-w-0 text-left">
                          <h2 id="adopt-impact-summary-label" className="adopt-context-heading">
                            {ADOPT_IMPACT_SUMMARY_HEADING}
                          </h2>
                          <div className="adopt-impact-summary-lede text-pretty">
                            {ADOPT_CASE_STUDY_IMPACT_SUMMARY_LINES.map((line) => (
                              <p key={line} className="adopt-impact-summary-line mb-0">
                                {line}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </AdoptCaseStudySection>

                  {/* Act 4 — Process overview */}
                  <AdoptCaseStudySection
                    act="process"
                    id="adopt-process-overview"
                    scrollContainerRef={adoptCaseStudyScrollRef}
                    reducedMotion={prefersReducedMotion}
                    parallax={false}
                  >
                    <AdoptProcessOverview
                      editorial={ADOPT_EDITORIAL_OVERLAP}
                      scrollContainerRef={adoptCaseStudyScrollRef}
                      reducedMotion={prefersReducedMotion}
                    />
                  </AdoptCaseStudySection>

                  {/* Act 5 — Key insights & implications */}
                  <AdoptCaseStudySection
                    act="key-insight"
                    id="adopt-section-key-insight"
                    scrollContainerRef={adoptCaseStudyScrollRef}
                    reducedMotion={prefersReducedMotion}
                    parallax="body"
                    aria-labelledby="adopt-key-insights-implications-heading"
                  >
                    <div className="mx-auto flex w-full min-w-0 max-w-2xl flex-col items-center gap-4 text-center md:gap-5">
                      <h2
                        id="adopt-key-insights-implications-heading"
                        className="adopt-context-heading mx-auto mb-0 max-w-[28ch] scroll-mt-6 text-balance"
                      >
                        {ADOPT_KEY_INSIGHTS_IMPLICATIONS_HEADING}
                      </h2>
                      <div className="flex w-full min-w-0 flex-col gap-4 md:gap-5">
                        {ADOPT_KEY_INSIGHTS_IMPLICATIONS_PARAGRAPHS.map((paragraph) => (
                          <p
                            key={paragraph}
                            className="adopt-body mx-auto mb-0 max-w-[44ch] text-pretty text-ink/82"
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  </AdoptCaseStudySection>

                  {/* Act 6 — Navigating ambiguity & designing strategically */}
                  <AdoptCaseStudySection
                    act="strategic"
                    id="adopt-section-strategic-decisions"
                    scrollContainerRef={adoptCaseStudyScrollRef}
                    reducedMotion={prefersReducedMotion}
                    parallax="body"
                    className="adopt-strategic-decisions md:scroll-mt-8"
                  >
                    <StrategicDecisionsSection
                      lede={ADOPT_STRATEGIC_DECISIONS_LEDE}
                      items={ADOPT_STRATEGIC_ITEMS}
                      openIndex={adoptAccordionOpen}
                      onToggle={(i) => setAdoptAccordionOpen(adoptAccordionOpen === i ? null : i)}
                    />
                  </AdoptCaseStudySection>

                  {/* Act 7 — System design overview + End-to-end flow */}
                  <AdoptCaseStudySection
                    act="system-design"
                    id="adopt-section-system-diagram"
                    scrollContainerRef={adoptCaseStudyScrollRef}
                    reducedMotion={prefersReducedMotion}
                    parallax="body"
                    className="adopt-system-diagram-block"
                    aria-labelledby="adopt-page-system-diagram-heading"
                  >
                    <div className="mx-auto flex w-full min-w-0 max-w-[min(100%,1180px)] flex-col">
                      <AdoptSystemDesignOverview />
                      <AdoptCaseStudyActSeparator />
                      <section
                        id="adopt-section-end-to-end-flow"
                        className="adopt-case-study-act adopt-case-study-act--end-to-end-flow min-w-0"
                        aria-labelledby="adopt-end-to-end-flow-heading"
                      >
                        <AdoptEndToEndFlow />
                      </section>
                    </div>
                  </AdoptCaseStudySection>

                  {/* Act 8 — Key learnings & implications */}
                  <AdoptCaseStudySection
                    act="key-learnings"
                    id="adopt-section-key-learnings"
                    scrollContainerRef={adoptCaseStudyScrollRef}
                    reducedMotion={prefersReducedMotion}
                    parallax="body"
                    className="adopt-key-learnings"
                    aria-labelledby="adopt-key-learnings-heading"
                  >
                    <div className="mx-auto w-full max-w-4xl">
                      <h2 id="adopt-key-learnings-heading" className="adopt-key-learnings__heading adopt-context-heading text-center">
                        Key learnings &amp; implications
                      </h2>
                      <div className="adopt-key-learnings-grid">
                        {ADOPT_KEY_LEARNINGS_ITEMS.map(({ tag, body }) => (
                          <div key={tag}>
                            <p className="adopt-meta-label text-ink/55">{tag}</p>
                            <p className="adopt-body mb-0 leading-[1.5] text-ink/72">{body}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </AdoptCaseStudySection>

                  {/* Act 9 — Final outcome */}
                  <AdoptCaseStudySection
                    act="final-outcome"
                    id="adopt-section-final-outcome"
                    scrollContainerRef={adoptCaseStudyScrollRef}
                    reducedMotion={prefersReducedMotion}
                    parallax="body"
                    className="adopt-final-outcome"
                    aria-labelledby="adopt-final-outcome-heading"
                  >
                    <div className="mx-auto flex max-w-2xl flex-col items-center">
                      <h2 id="adopt-final-outcome-heading" className="adopt-context-heading text-center">
                        Final outcome
                      </h2>
                      <p className="adopt-body mb-0 max-w-measure text-pretty text-left text-ink/82">{ADOPT_FINAL_OUTCOME_BODY}</p>
                    </div>
                  </AdoptCaseStudySection>

                  <div className="adopt-case-study-cta flex flex-col items-center border-t border-ink/[0.08]">
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
            <SiteFooter />
          </motion.div>
        )}
      </AnimatePresence>

      {/* System-led product strategy across touchpoints — three-act case study */}
      <AnimatePresence>
        {openTouchpointsPage && (
          <motion.div
            ref={touchpointsCaseStudyScrollRef}
            id="touchpoints-scroll"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex flex-col bg-bg overflow-y-auto overflow-x-hidden overscroll-y-contain"
            style={{ backgroundColor: '#F8F9FA' }}
          >
            <TopNavStrip
              page="touchpoints"
              mandalaAnchorId="mandala-nav-touchpoints"
              onHomeClick={handleHomeNavClick}
              onAboutClick={handleAboutNavClick}
              onCvClick={handleCvNavClick}
              surface={touchpointsCaseStudyNavSurface}
            />

            <main className="flex-1 pb-[200px]">
              <div className="adopt-case-study mx-auto w-full min-w-0 max-w-[min(100%,1180px)] px-5 pb-[3rem] pt-[calc(var(--site-header-height,2.75rem)+1.75rem)] sm:px-7 md:px-12 md:pb-[3.5rem] md:pt-[calc(var(--site-header-height,2.75rem)+2.25rem)] lg:px-14 lg:pt-[calc(var(--site-header-height,2.75rem)+2.75rem)]">
                <div className="adopt-case-study-acts">
                  {/* Act 1 — Hero */}
                  <motion.section
                    key={touchpointsHeroMotionKey}
                    className="adopt-case-study-act adopt-case-study-act--hero min-w-0 scroll-mt-6"
                    initial="hidden"
                    animate="show"
                    variants={makeIntroBundle(prefersReducedMotion)}
                  >
                    <motion.div variants={makeIntroItem(prefersReducedMotion)}>
                      <AdoptCaseStudyParallax
                        scrollContainerRef={touchpointsCaseStudyScrollRef}
                        reducedMotion={prefersReducedMotion}
                        variant="lead"
                        className="adopt-case-study-act__parallax"
                      >
                        <div
                          ref={touchpointsCaseStudyHeroRef}
                          className="adopt-case-study-hero-media w-full overflow-hidden rounded-2xl border border-ink/[0.09] shadow-[0_4px_32px_-8px_rgba(12,21,40,0.13)]"
                          style={{ aspectRatio: '16/7' }}
                        >
                          <img
                            src="/ajediam/homepage-branding.png"
                            alt="Ajediam — editorial article on iPad, brand and web experience."
                            className="h-full w-full object-cover object-center"
                            loading="eager"
                            decoding="async"
                          />
                        </div>
                      </AdoptCaseStudyParallax>
                    </motion.div>

                    <motion.h1
                      className="mb-0 scroll-mt-6 text-balance text-center"
                      variants={makeIntroItem(prefersReducedMotion)}
                    >
                      {TOUCHPOINTS_CASE_STUDY_TITLE}
                    </motion.h1>
                    <motion.p
                      className="adopt-case-study-hero-subheader editorial-hero-subheader m-0 text-pretty text-center"
                      variants={makeIntroItem(prefersReducedMotion)}
                    >
                      {TOUCHPOINTS_CASE_STUDY_SUBTITLE}
                    </motion.p>
                  </motion.section>

                  {/* Act 2 — Context & Intro */}
                  <AdoptCaseStudySection
                    act="context"
                    scrollContainerRef={touchpointsCaseStudyScrollRef}
                    reducedMotion={prefersReducedMotion}
                    parallax="lead"
                  >
                    <CaseStudyOverviewStage
                      contextColumn={
                        <>
                          <h2 id="touchpoints-section-context" className="adopt-context-heading mb-1.5 scroll-mt-6 md:mb-2">
                            Context &amp; Intro
                          </h2>
                          <p className="adopt-intro-lede adopt-context-copy mb-0 text-pretty">
                            {TOUCHPOINTS_CASE_STUDY_LEDE}
                          </p>
                          <aside className="adopt-meta-rail mt-7 md:mt-8" aria-label="Project metadata">
                            <dl className="adopt-meta">
                              <div>
                                <dt className="adopt-meta-label scroll-mt-4">Role</dt>
                                <dd className="adopt-body mb-0 max-w-measure">{AJEDIAM_CASE_STUDY.role}</dd>
                              </div>
                              <div>
                                <dt className="adopt-meta-label scroll-mt-4">Client</dt>
                                <dd className="adopt-body mb-0 max-w-measure">{AJEDIAM_CASE_STUDY.client}</dd>
                              </div>
                              <div>
                                <dt id="touchpoints-key-insight" className="adopt-meta-label scroll-mt-4">
                                  Key insight
                                </dt>
                                <dd className="adopt-body adopt-key-insight-lede mb-0 leading-[1.45] text-[var(--color-text-body-muted)] line-clamp-2">
                                  {TOUCHPOINTS_KEY_INSIGHT_BODY}
                                </dd>
                              </div>
                              <div>
                                <dt className="adopt-meta-label scroll-mt-4">Impact</dt>
                                <dd className="adopt-body mb-0 max-w-measure">
                                  {AJEDIAM_CASE_STUDY.impact.map((line) => (
                                    <p key={line}>{stripLeadBullet(line)}</p>
                                  ))}
                                </dd>
                              </div>
                            </dl>
                          </aside>
                        </>
                      }
                      scopeContent={<TouchpointsScopeRail />}
                      metrics={TOUCHPOINTS_CONTEXT_METRICS}
                      metricsAriaLabel="Ajediam touchpoints — project metrics"
                    />
                  </AdoptCaseStudySection>

                  {/* Act 3 — Before and after */}
                  <AdoptCaseStudySection
                    act="impact"
                    id="touchpoints-section-impact"
                    scrollContainerRef={touchpointsCaseStudyScrollRef}
                    reducedMotion={prefersReducedMotion}
                    parallax="lead"
                    aria-labelledby="touchpoints-impact-summary-label"
                  >
                    <div className="adopt-impact-summary-block">
                      <div className="adopt-impact-summary-grid grid grid-cols-1 items-start md:grid-cols-2">
                        <div className="flex items-center justify-center md:justify-start">
                          <img
                            src="/ajediam/hero-4.png"
                            alt="Ajediam — product, site, and brand surfaces as one framework."
                            className="h-auto w-full max-w-[340px] rounded-2xl object-contain md:max-w-none"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                        <div className="adopt-impact-summary min-w-0 text-left">
                          <h2 id="touchpoints-impact-summary-label" className="adopt-context-heading">
                            {TOUCHPOINTS_IMPACT_SUMMARY_HEADING}
                          </h2>
                          <div className="adopt-impact-summary-lede text-pretty">
                            {TOUCHPOINTS_CASE_STUDY_IMPACT_SUMMARY_LINES.map((line) => (
                              <p key={line} className="adopt-impact-summary-line mb-0">
                                {line}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </AdoptCaseStudySection>
                </div>
              </div>
            </main>
            <SiteFooter />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scaling coordination — three-act case study */}
      <AnimatePresence>
        {openDriverPage && (
          <motion.div
            ref={driverCaseStudyScrollRef}
            id="driver-case-study-scroll"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex flex-col bg-bg overflow-y-auto overflow-x-hidden overscroll-y-contain"
            style={{ backgroundColor: '#F8F9FA' }}
          >
            <TopNavStrip
              page="driver"
              mandalaAnchorId="mandala-nav-driver"
              onHomeClick={handleHomeNavClick}
              onAboutClick={handleAboutNavClick}
              onCvClick={handleCvNavClick}
              surface={driverCaseStudyNavSurface}
            />

            <main className="flex-1 pb-[200px]">
              <div className="adopt-case-study mx-auto w-full min-w-0 max-w-[min(100%,1180px)] px-5 pb-[3rem] pt-[calc(var(--site-header-height,2.75rem)+1.75rem)] sm:px-7 md:px-12 md:pb-[3.5rem] md:pt-[calc(var(--site-header-height,2.75rem)+2.25rem)] lg:px-14 lg:pt-[calc(var(--site-header-height,2.75rem)+2.75rem)]">
                <div className="adopt-case-study-acts">
                  {/* Act 1 — Hero */}
                  <motion.section
                    key={driverHeroMotionKey}
                    className="adopt-case-study-act adopt-case-study-act--hero min-w-0 scroll-mt-6"
                    initial="hidden"
                    animate="show"
                    variants={makeIntroBundle(prefersReducedMotion)}
                  >
                    <motion.div variants={makeIntroItem(prefersReducedMotion)}>
                      <AdoptCaseStudyParallax
                        scrollContainerRef={driverCaseStudyScrollRef}
                        reducedMotion={prefersReducedMotion}
                        variant="lead"
                        className="adopt-case-study-act__parallax"
                      >
                        <div
                          ref={driverCaseStudyHeroRef}
                          className="adopt-case-study-hero-media w-full overflow-hidden rounded-2xl border border-ink/[0.09] shadow-[0_4px_32px_-8px_rgba(12,21,40,0.13)]"
                          style={{ aspectRatio: '16/9' }}
                        >
                          <img
                            src="/map-aid/hero-banner.jpg"
                            alt="Map-aid — real-time driver coordination map."
                            className="h-full w-full object-cover object-center"
                            loading="eager"
                            decoding="async"
                          />
                        </div>
                      </AdoptCaseStudyParallax>
                    </motion.div>

                    <motion.h1
                      className="mb-0 scroll-mt-6 text-balance text-center"
                      variants={makeIntroItem(prefersReducedMotion)}
                    >
                      {DRIVER_CASE_STUDY_TITLE}
                    </motion.h1>
                    <motion.p
                      className="adopt-case-study-hero-subheader editorial-hero-subheader m-0 text-pretty text-center"
                      variants={makeIntroItem(prefersReducedMotion)}
                    >
                      {DRIVER_CASE_STUDY_SUBTITLE}
                    </motion.p>
                  </motion.section>

                  {/* Act 2 — Context & Intro */}
                  <AdoptCaseStudySection
                    act="context"
                    scrollContainerRef={driverCaseStudyScrollRef}
                    reducedMotion={prefersReducedMotion}
                    parallax="lead"
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
                  </AdoptCaseStudySection>

                  {/* Act 3 — Before and after */}
                  <AdoptCaseStudySection
                    act="impact"
                    id="driver-section-impact"
                    scrollContainerRef={driverCaseStudyScrollRef}
                    reducedMotion={prefersReducedMotion}
                    parallax="lead"
                    aria-labelledby="driver-impact-summary-label"
                  >
                    <div className="adopt-impact-summary-block">
                      <div className="adopt-impact-summary-grid grid grid-cols-1 items-start md:grid-cols-2">
                        <div className="flex items-center justify-center md:justify-start">
                          <div className="aspect-square w-full max-w-[340px] overflow-hidden rounded-2xl md:max-w-none">
                            <img
                              src="/coordination-homepage.png"
                              alt="Placeholder — Map-aid before-and-after square still to come."
                              className="h-full w-full object-cover"
                              loading="lazy"
                              decoding="async"
                            />
                          </div>
                        </div>
                        <div className="adopt-impact-summary min-w-0 text-left">
                          <h2 id="driver-impact-summary-label" className="adopt-context-heading">
                            {DRIVER_IMPACT_SUMMARY_HEADING}
                          </h2>
                          <div className="adopt-impact-summary-lede text-pretty">
                            {DRIVER_CASE_STUDY_IMPACT_SUMMARY_LINES.map((line) => (
                              <p key={line} className="adopt-impact-summary-line mb-0">
                                {line}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </AdoptCaseStudySection>

                  {/* Act 4 — Process overview */}
                  <AdoptCaseStudySection
                    act="process"
                    id="driver-process-overview"
                    scrollContainerRef={driverCaseStudyScrollRef}
                    reducedMotion={prefersReducedMotion}
                    parallax={false}
                  >
                    <AdoptProcessOverview
                      editorial={ADOPT_EDITORIAL_OVERLAP}
                      scrollContainerRef={driverCaseStudyScrollRef}
                      reducedMotion={prefersReducedMotion}
                      content={DRIVER_PROCESS_OVERVIEW_CONTENT}
                    />
                  </AdoptCaseStudySection>
                </div>
              </div>
            </main>
            <SiteFooter />
          </motion.div>
        )}
      </AnimatePresence>
        </>,
        document.body,
      )}

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
              <p className="home-body mb-0 mt-3 max-w-[56ch] leading-[1.3] text-ink/72">
                Partnering across the product lifecycle. From high-fidelity visual craft to end-to-end product delivery.
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
                        className="home-page-slab h-[10.05rem] transform-gpu will-change-transform overflow-y-auto border border-ink/10 bg-ink/[0.04] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] modal-scroll md:h-[10.75rem]"
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
                        className="home-page-slab h-[10.05rem] transform-gpu will-change-transform overflow-y-auto border border-ink/10 bg-ink/[0.04] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] modal-scroll md:h-[10.75rem]"
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
      </motion.div>

      {/* Thinking Through Design — fan card section, visually anchored to footer */}
      <ThinkingThroughDesignSection
        onOpenAdopt={() => goToRoute('adopt')}
        onOpenAdoptFull={() => {
          setAdoptFullCaseStudyOpen(true);
          goToRoute('adopt');
        }}
        onOpenDriver={() => goToRoute('driver')}
        onOpenAi={() => goToRoute('ai')}
        onOpenTouchpoints={() => goToRoute('touchpoints')}
      />
      </motion.div>

      </main>

      <SiteFooter />
    </div>
  );
}
