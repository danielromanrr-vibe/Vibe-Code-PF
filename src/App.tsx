import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useTransform, useMotionValue, animate } from 'motion/react';
import { SiteFooter } from './components/Footer';
import AdoptCaseStudyParallax from './components/AdoptCaseStudyParallax';
import AdoptCaseStudySection from './components/AdoptCaseStudySection';
import AdoptProcessOverview from './components/AdoptProcessOverview';
import AdoptSystemDesignOverview, { AdoptEndToEndFlow } from './components/AdoptSystemDesignOverview';
import CaseStudyOpening from './components/CaseStudyOpening';
import StrategicDecisionsSection from './components/StrategicDecisionsSection';
import ThinkingThroughDesignSection from './components/ThinkingThroughDesignSection';
import { useHeroCopyParallax } from './components/useHeroCopyParallax';
import { DRIVER_PROCESS_OVERVIEW_CONTENT } from './content/driverProcessTurningPoints';
import SectionRhythmDivider from './components/SectionRhythmDivider';
import HomeCaseStudyCopy, { renderInlineBold } from './components/HomeCaseStudyCopy';
import { documentTitles } from './content/site';
import * as homeCopy from './content/home';
import * as adoptCopy from './content/adopt';
import * as driverCopy from './content/driver';
import * as aiCopy from './content/ai';
import HomeChapterLabel from './components/HomeChapterLabel';
import HomeVisualBento from './components/HomeVisualBento';
import VisualDesignLanding from './components/VisualDesignLanding';
import VisualWorkPage from './components/VisualWorkPage';
import VhenyWorkPage from './components/VhenyWorkPage';
import AmbientMandalaTrail from './components/AmbientMandalaTrail';
import CustomCursor from './components/CustomCursor';
import MandalaBanner from './components/MandalaBanner';
import HeroIntroStarPass from './components/HeroIntroStarPass';
import { heroIntroTiming, HERO_INTRO_EASE, heroSkyBackgroundImageAt, heroBannerAmbientOpacityAt, heroFieldRevealDurationS, heroFieldRevealEase, heroTypeIlluminateAt, heroBandPositionAt, heroBandAlphaAt, heroSweepPositionAt, heroSweepAlphaAt, heroTextLightVarAt, measureHeroPathSpan, type HeroPathSpan, type StarLightingFrame } from './lib/heroIntroTiming';
import { isHomeHeroIntroComplete, markHomeHeroIntroComplete, consumeHomeHeroIntroReplayRequest, peekHomeHeroIntroReplayRequest } from './lib/homeHeroIntro';
import { makeIntroBundle, makeIntroItem } from './lib/editorialRevealMotion';
import TopNavStrip from './components/TopNavStrip';
import PlayfulTitleField from './components/PlayfulTitleField';
import {
  DriverDispatchPipeline,
  DriverImpactTable,
  DriverLivePrototype,
  DriverPrototypeShowcase,
  DriverSystemInsights,
} from './components/DriverCaseStudySections';
import AboutPage from './pages/AboutPage';
import type { AboutPracticeAction } from './content/aboutMandalaFacets';
import { PRACTICE_STORAGE_KEY } from './components/about/AboutInfluenceSlabs';
import CvPage from './pages/CvPage';

/** Homepage Case studies chapter — Product nav target. */
const HOME_CASE_STUDIES_ID = 'home-chapter-case-studies';
const HOME_PRODUCT_SCROLL_KEY = 'home-scroll-case-studies';
import {
  VISUAL_WORK,
  VISUAL_WORK_PATH_PREFIX,
  visualWorkKindFromSlug,
  visualWorkPath,
  type VisualWorkKind,
} from './content/visualDesign';

const HOME_CASE_STUDIES = {
  adopt: {
    industry: homeCopy.caseStudies.adopt.industry,
    discipline: homeCopy.caseStudies.adopt.discipline,
    title: homeCopy.caseStudies.adopt.h2,
    subhead: homeCopy.caseStudies.adopt.subhead,
    lede: homeCopy.caseStudies.adopt.lede,
  },
  driver: {
    industry: homeCopy.caseStudies.driver.industry,
    discipline: homeCopy.caseStudies.driver.discipline,
    title: homeCopy.caseStudies.driver.h2,
    subhead: homeCopy.caseStudies.driver.subhead,
    lede: homeCopy.caseStudies.driver.lede,
  },
  ajediam: {
    industry: homeCopy.caseStudies.vheny.industry,
    discipline: homeCopy.caseStudies.vheny.discipline,
    title: homeCopy.caseStudies.vheny.h2,
    subhead: homeCopy.caseStudies.vheny.subhead,
    lede: homeCopy.caseStudies.vheny.lede,
  },
} as const;

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

/**
 * Every long-form view is addressable.
 *
 * The case studies render as full-page layers over the homepage rather than as separate trees, but
 * that is a rendering detail — the URL is the source of truth for which one is open, so each can be
 * linked, shared, bookmarked, reopened by the back button, and crawled.
 */
const PAGE_ROUTES = {
  home: '/homepage',
  about: '/about',
  cv: '/cv',
  adopt: '/work/adopt-a-school',
  driver: '/work/driver-coordination',
  vhenyProduct: '/vheny-diamonds/product-design',
  vhenyBranding: '/vheny-diamonds/branding',
  visual: '/work/visual-design',
  ai: '/thinking/designing-with-ai',
} as const;

const HOME_PATH_ALIASES = new Set(['/', '/home', '/homepage']);

type PageRouteKey = keyof typeof PAGE_ROUTES;

const DOCUMENT_TITLES: Record<PageRouteKey, string> = documentTitles;

const ROUTE_KEY_BY_PATH = new Map<string, PageRouteKey>(
  (Object.entries(PAGE_ROUTES) as [PageRouteKey, string][]).map(([key, path]) => [path, key]),
);

function HeroLockupWords({ text }: { text: string }) {
  return text.split(/\s+/).map((word, i) => (
    <span key={`${word}-${i}`} className="hero-inline-word">
      {word}
    </span>
  ));
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  /** Unknown paths fall back to home rather than rendering a blank tree. */
  const isLegacyProductPath = location.pathname === '/vheny-diamonds';
  const visualWorkSlug = location.pathname.startsWith(`${VISUAL_WORK_PATH_PREFIX}/`)
    ? location.pathname.slice(VISUAL_WORK_PATH_PREFIX.length + 1).replace(/\/$/, '')
    : undefined;
  const visualWorkKind = visualWorkKindFromSlug(visualWorkSlug);
  const routeKey = visualWorkKind
    ? 'visual'
    : isLegacyProductPath
      ? 'vhenyProduct'
      : HOME_PATH_ALIASES.has(location.pathname)
        ? 'home'
        : ROUTE_KEY_BY_PATH.get(location.pathname) ?? 'home';

  const openAdoptPage = routeKey === 'adopt';
  const openDriverPage = routeKey === 'driver';
  const openVhenyProduct = routeKey === 'vhenyProduct';
  const openVhenyBranding = routeKey === 'vhenyBranding';
  const openVisualPage = routeKey === 'visual' && !visualWorkKind;
  const openVisualWork = Boolean(visualWorkKind);
  const openDesigningAiPage = routeKey === 'ai';
  const isHomeRoute = routeKey === 'home';

  const goToRoute = useCallback(
    (key: PageRouteKey) => {
      if (location.pathname !== PAGE_ROUTES[key]) navigate(PAGE_ROUTES[key]);
    },
    [location.pathname, navigate],
  );

  const backToVisualLanding = useCallback(() => {
    navigate(PAGE_ROUTES.visual);
  }, [navigate]);

  const openVisualWorkPage = useCallback(
    (kind: VisualWorkKind) => {
      const path = visualWorkPath(kind);
      if (location.pathname !== path) navigate(path);
    },
    [location.pathname, navigate],
  );

  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '/home') {
      navigate(
        { pathname: PAGE_ROUTES.home, search: location.search, hash: location.hash },
        { replace: true },
      );
      return;
    }
    if (location.pathname === '/vheny-diamonds') {
      navigate(PAGE_ROUTES.vhenyProduct, { replace: true });
      return;
    }
    if (location.pathname === '/work/ajediam' || location.pathname === '/ajediam') {
      navigate(visualWorkPath('ajediam'), { replace: true });
      return;
    }
    if (visualWorkSlug && !visualWorkKind) {
      navigate(PAGE_ROUTES.visual, { replace: true });
      return;
    }
    const knownPath =
      HOME_PATH_ALIASES.has(location.pathname) ||
      ROUTE_KEY_BY_PATH.has(location.pathname) ||
      Boolean(visualWorkKind);
    if (!knownPath) {
      navigate(PAGE_ROUTES.home, { replace: true });
    }
  }, [location.hash, location.pathname, location.search, navigate, visualWorkKind, visualWorkSlug]);

  useEffect(() => {
    if (visualWorkKind) {
      document.title = `${VISUAL_WORK[visualWorkKind].navLabel} — Daniel Román`;
      return;
    }
    document.title = DOCUMENT_TITLES[routeKey];
  }, [routeKey, visualWorkKind]);

  const [adoptHeroMotionKey, setAdoptHeroMotionKey] = useState(0);
  const [adoptCaseStudyNavSurface, setAdoptCaseStudyNavSurface] = useState<'default' | 'media'>('media');
  const adoptCaseStudyScrollRef = useRef<HTMLDivElement>(null);
  const adoptCaseStudyHeroRef = useRef<HTMLDivElement>(null);
  const [adoptAccordionOpen, setAdoptAccordionOpen] = useState<number | null>(null);
  const [driverCaseStudyNavSurface, setDriverCaseStudyNavSurface] = useState<'default' | 'media'>('media');
  const [driverHeroMotionKey, setDriverHeroMotionKey] = useState(0);
  const [homeNavSurface, setHomeNavSurface] = useState<'hero' | 'default'>('hero');
  const [, setHomeNavIdentityRevealed] = useState(false);
  const driverCaseStudyScrollRef = useRef<HTMLDivElement>(null);
  const driverCaseStudyHeroRef = useRef<HTMLDivElement>(null);
  const [heroIntroSeen, setHeroIntroSeen] = useState(
    () => !peekHomeHeroIntroReplayRequest() && isHomeHeroIntroComplete(),
  );
  const [heroIntroReplayKey, setHeroIntroReplayKey] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const homePageSurfaceRef = useRef<HTMLDivElement | null>(null);
  const heroIntroRef = useRef<HTMLDivElement | null>(null);
  const heroH1RowRef = useRef<HTMLDivElement | null>(null);
  const heroNameRef = useRef<HTMLDivElement | null>(null);
  const heroLightAnchorsMeasuredRef = useRef(false);
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
  const { typeStyle: heroCopyTypeStyle, subStyle: heroCopySubStyle } =
    useHeroCopyParallax(heroSectionRef, Boolean(isHomeRoute && heroIntroSeen && !prefersReducedMotion));
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
    'hero-inline-h1 relative z-10 mb-0 mt-0 inline-block align-middle font-medium',
    heroLightmapActive ? 'hero-inline-lightmap hero-inline-lightmap--name' : '',
  ]
    .filter(Boolean)
    .join(' ');
  const heroLine1RestClassName = [
    'hero-inline-h1 relative z-10 mb-0 mt-0 inline-block align-middle font-medium',
    heroLightmapActive ? 'hero-inline-lightmap hero-inline-lightmap--role' : '',
  ]
    .filter(Boolean)
    .join(' ');
  const heroLine2ClassName = [
    'hero-inline-h1 relative z-10 mb-0 mt-0 block w-full font-medium',
    heroLightmapActive ? 'hero-inline-lightmap hero-inline-lightmap--role' : '',
  ]
    .filter(Boolean)
    .join(' ');
  const heroSubClassName = [
    'hero-inline-h2 editorial-hero-subheader mx-auto mb-0 block w-full text-center font-normal text-pretty',
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

  const handleHomeNavClick = () => {
    goToRoute('home');
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  };

  const handleAboutNavClick = () => goToRoute('about');
  const handleVisualBrandingNavClick = () => goToRoute('visual');

  const [caseStudiesMarkerHighlight, setCaseStudiesMarkerHighlight] = useState(false);
  const [caseStudiesTocOpen, setCaseStudiesTocOpen] = useState(false);
  const caseStudiesTocTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const highlightCaseStudiesMarker = useCallback(() => {
    setCaseStudiesMarkerHighlight(true);
    window.setTimeout(() => setCaseStudiesMarkerHighlight(false), 2800);
  }, []);

  const scrollToHomeCaseStudies = useCallback(() => {
    setCaseStudiesTocOpen(true);
    if (caseStudiesTocTimerRef.current) clearTimeout(caseStudiesTocTimerRef.current);
    caseStudiesTocTimerRef.current = setTimeout(() => {
      setCaseStudiesTocOpen(false);
      caseStudiesTocTimerRef.current = null;
    }, 5000);
    document
      .getElementById(HOME_CASE_STUDIES_ID)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    highlightCaseStudiesMarker();
  }, [highlightCaseStudiesMarker]);

  useEffect(() => {
    return () => {
      if (caseStudiesTocTimerRef.current) clearTimeout(caseStudiesTocTimerRef.current);
    };
  }, []);

  const handleProductNavClick = useCallback(() => {
    if (!isHomeRoute) {
      sessionStorage.setItem(HOME_PRODUCT_SCROLL_KEY, '1');
      navigate(PAGE_ROUTES.home);
      return;
    }
    requestAnimationFrame(scrollToHomeCaseStudies);
  }, [isHomeRoute, navigate, scrollToHomeCaseStudies]);

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

  useEffect(() => {
    if (!isHomeRoute) return;
    if (!sessionStorage.getItem(HOME_PRODUCT_SCROLL_KEY)) return;
    sessionStorage.removeItem(HOME_PRODUCT_SCROLL_KEY);
    requestAnimationFrame(scrollToHomeCaseStudies);
  }, [isHomeRoute, scrollToHomeCaseStudies]);

  /** Case-study overlays mount their own TopNavStrip; keep home strip out to avoid duplicate nav layers. */
  const isFullPageOverlayOpen =
    openDesigningAiPage ||
    openAdoptPage ||
    openVhenyProduct ||
    openVhenyBranding ||
    openVisualPage ||
    openVisualWork ||
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
    if (openVisualPage || openVisualWork) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [openVisualPage, openVisualWork]);

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
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    return () => {
      if (heroLensRafRef.current) {
        cancelAnimationFrame(heroLensRafRef.current);
        heroLensRafRef.current = 0;
      }
    };
  }, []);

  /** Nav flips to paper when the covering sheet reaches the strip — not scroll-progress springs. */
  useEffect(() => {
    if (!isHomeRoute) {
      setHomeNavSurface('hero');
      return;
    }
    const sheet = homePageSurfaceRef.current;
    if (!sheet) return;

    const navHeight = () =>
      document.querySelector<HTMLElement>('.top-nav-strip')?.getBoundingClientRect().height ?? 52;

    const sync = () => {
      setHomeNavSurface(sheet.getBoundingClientRect().top <= navHeight() ? 'default' : 'hero');
    };

    sync();
    window.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    const observer = new IntersectionObserver(sync);
    observer.observe(sheet);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [isHomeRoute]);

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
        onVisualBrandingClick={handleVisualBrandingNavClick}
        onProductClick={handleProductNavClick}
        onPracticeClick={openPracticeFromAbout}
      />
    );
  }

  if (routeKey === 'cv') {
    return (
      <CvPage
        onHomeClick={handleHomeNavClick}
        onAboutClick={handleAboutNavClick}
        onVisualBrandingClick={handleVisualBrandingNavClick}
        onProductClick={handleProductNavClick}
      />
    );
  }

  return (
    <div className="min-h-screen selection:bg-accent selection:text-white overflow-x-clip bg-bg" style={{ backgroundColor: '#F8F9FA' }}>
      {/* Above fixed overlays (z-200); below scroll trails (z-9996+). */}
      <AmbientMandalaTrail className="z-[9995]" />
      <CustomCursor mode="scroll" />

      <main className="editorial-page home-page relative z-20 pt-0">
      {!isFullPageOverlayOpen && (
        <TopNavStrip
          page="home"
          surface={homeNavSurface}
          mandalaAnchorId="mandala-nav-home"
          onHomeClick={handleHomeNavClick}
          onAboutClick={handleAboutNavClick}
          onVisualBrandingClick={handleVisualBrandingNavClick}
          onProductClick={handleProductNavClick}
          onIdentityRevealedChange={setHomeNavIdentityRevealed}
        />
      )}
      <section
        ref={heroSectionRef}
        className="home-hero mb-0 flex flex-col pt-11"
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
        <div className="pointer-events-none relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6 md:px-12">
          <div className="mx-auto flex w-full max-w-[min(92rem,96vw)] flex-col items-center text-center">
            <div
              ref={heroIntroRef}
              className="hero-inline-intro mx-auto flex w-auto max-w-full shrink-0 flex-col items-center gap-0"
            >
              {homeCopy.hero.tags.length > 0 ? (
                <motion.ul className="hero-inline-tags" style={heroCopySubStyle}>
                  {homeCopy.hero.tags.map((tag) => (
                    <li key={tag} className="hero-inline-tag adopt-meta-label">
                      {tag}
                    </li>
                  ))}
                </motion.ul>
              ) : null}
              <div
                ref={heroH1RowRef}
                className="hero-inline-display relative mb-0 w-full min-w-0 overflow-visible text-center"
              >
                <h1 className="sr-only">
                  {homeCopy.hero.h1}
                </h1>

                <div
                  ref={heroNameRef}
                  className="hero-inline-display__line1 relative z-10 mb-0 flex flex-wrap items-center justify-center gap-x-[0.34em] gap-y-0 md:flex-nowrap"
                >
                  <motion.span
                    className={heroNameClassName}
                    style={
                      heroLightmapActive
                        ? {
                            ['--hero-text-light' as string]: heroNameLightVar,
                            ['--hero-light-x' as string]: heroNameBandX,
                            ['--hero-band-alpha' as string]: heroNameBandAlpha,
                            ...heroCopyTypeStyle,
                          }
                        : heroCopyTypeStyle
                    }
                  >
                    <HeroLockupWords text={homeCopy.hero.h1Name} />
                  </motion.span>
                  <motion.span
                    className={heroNameClassName}
                    style={
                      heroLightmapActive
                        ? {
                            ['--hero-text-light' as string]: heroNameLightVar,
                            ['--hero-light-x' as string]: heroNameBandX,
                            ['--hero-band-alpha' as string]: heroNameBandAlpha,
                            ...heroCopyTypeStyle,
                          }
                        : heroCopyTypeStyle
                    }
                  >
                    <HeroLockupWords text={homeCopy.hero.h1RoleLead} />
                  </motion.span>
                  <motion.span
                    className={heroLine1RestClassName}
                    style={
                      heroLightmapActive
                        ? {
                            ['--hero-text-light' as string]: heroRoleLightVar,
                            ['--hero-light-x' as string]: heroRoleBandX,
                            ['--hero-band-alpha' as string]: heroRoleBandAlpha,
                            ...heroCopyTypeStyle,
                          }
                        : heroCopyTypeStyle
                    }
                  >
                    <HeroLockupWords text={homeCopy.hero.h1RoleRest} />
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
                          ...heroCopyTypeStyle,
                        }
                      : heroCopyTypeStyle
                  }
                >
                  <HeroLockupWords text={homeCopy.hero.h1Line2} />
                </motion.span>
              </div>
              <motion.div className="hero-inline-after" style={heroCopySubStyle}>
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
                  {homeCopy.hero.h2}
                </motion.h2>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <div ref={homePageSurfaceRef} className="home-page-surface">
      <div className="home-page-surface-round">
      <div className="home-case-study-well" role="region" aria-labelledby="home-chapter-case-studies">
      <div className="home-chapter-band px-4 sm:px-6 md:px-12">
        <HomeChapterLabel
          id="home-chapter-case-studies"
          field="studies"
          kicker={homeCopy.caseStudiesChapter.kicker}
          highlighted={caseStudiesMarkerHighlight}
          tocOpen={caseStudiesTocOpen}
          toc={[...homeCopy.caseStudiesChapter.toc]}
        >
          {homeCopy.caseStudiesChapter.h2}
        </HomeChapterLabel>
      </div>
      {/* Case study 1: NGO participation system */}
      <motion.section
        className="home-case-study-entry overflow-x-clip px-4 sm:px-6 md:overflow-x-visible md:px-12"
        aria-labelledby="case-study-ngo-heading"
        variants={revealSection}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.18 }}
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

      {/* Case study 3: Vheny Diamonds product (Atlas) */}
      <motion.section
        className="home-case-study-entry px-4 sm:px-6 md:px-12"
        aria-labelledby="vheny-heading"
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
                  onClick={() => goToRoute('vhenyProduct')}
                  aria-label={`View case study: ${HOME_CASE_STUDIES.ajediam.title}`}
                >
                  <img
                    src="/home/case-study-vheny.jpg"
                    alt="MacBook on a desk showing the diamond inventory screen"
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </button>
              </motion.div>
            </div>

            <motion.div variants={revealItem} className="home-case-study-split__copy order-1 md:order-2 md:col-span-5">
              <HomeCaseStudyCopy
                headingId="vheny-heading"
                {...HOME_CASE_STUDIES.ajediam}
                onCta={() => goToRoute('vhenyProduct')}
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
      </div>

      {/*
        Full-page layers are portalled to <body> so fixed positioning and z-index resolve
        against the viewport, not the homepage stacking context.
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
              onVisualBrandingClick={handleVisualBrandingNavClick}
              onProductClick={handleProductNavClick}
            />

            {/* Main content — vertical flow, max-width for readability */}
            <main className="flex-1 px-5 py-10 pb-24 sm:px-8 md:px-12 md:py-12">
              <div className="editorial-container editorial-page">
                <section>
                  <h1 className="mb-5 leading-tight md:mb-6">{aiCopy.hero.h1}</h1>
                </section>

                {aiCopy.sections.map((section, index) => (
                  <section
                    key={section.h2}
                    className={index === 0 ? 'mt-16 border-t border-ink/10 pt-12 md:mt-20 md:pt-14' : 'mt-2'}
                  >
                    {index > 0 ? <SectionRhythmDivider /> : null}
                    <h2
                      id={section.h2 === 'From concept to functional product' ? 'ai-cross-functional' : undefined}
                      className="mb-4 md:mb-5"
                    >
                      {section.h2}
                    </h2>
                    <p className="editorial-body mb-0 max-w-measure">
                      {typeof section.body === 'string'
                        ? section.body
                        : section.body.map((paragraph, i) => (
                            <span key={paragraph}>
                              {i > 0 ? (
                                <>
                                  <br />
                                  <br />
                                </>
                              ) : null}
                              {paragraph}
                            </span>
                          ))}
                    </p>
                  </section>
                ))}
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
              onVisualBrandingClick={handleVisualBrandingNavClick}
              onProductClick={handleProductNavClick}
              surface={adoptCaseStudyNavSurface}
            />

            <main className="flex-1 pb-[max(4.5rem,env(safe-area-inset-bottom))] md:pb-[8rem]">
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

                    <motion.div variants={makeIntroItem(prefersReducedMotion)}>
                      <PlayfulTitleField
                        title={adoptCopy.hero.h1}
                        headingId="adopt-case-study-heading"
                        className="mb-0 scroll-mt-6 text-left"
                        reducedMotion={prefersReducedMotion}
                      />
                    </motion.div>
                    <motion.p
                      className="adopt-case-study-hero-lede adopt-body m-0 text-pretty font-bold"
                      variants={makeIntroItem(prefersReducedMotion)}
                    >
                      {adoptCopy.hero.lede}
                    </motion.p>
                    <motion.div
                      id="adopt-section-overview"
                      className="adopt-overview"
                      variants={makeIntroItem(prefersReducedMotion)}
                    >
                      <div
                        className="adopt-overview__block"
                        id="adopt-section-context"
                        aria-label="Role, context, scope, and impact"
                      >
                        <div className="adopt-overview__cards adopt-overview__cards--facts">
                          {adoptCopy.overview.facts.cards.map((card) => (
                            <article key={card.eyebrow}>
                              <p className="adopt-meta-label adopt-meta-label--bold">{card.eyebrow}</p>
                              {card.body.split('\n\n').map((paragraph) => (
                                <p key={paragraph} className="adopt-body adopt-overview__card-copy mb-0 whitespace-pre-line text-pretty">
                                  {paragraph}
                                </p>
                              ))}
                            </article>
                          ))}
                        </div>
                      </div>
                      <div className="adopt-overview__block">
                        <h3 id="adopt-section-story" className="adopt-context-heading scroll-mt-6">
                          {adoptCopy.overview.story.h3}
                        </h3>
                        <div className="adopt-overview__cards adopt-overview__cards--story">
                          {adoptCopy.overview.story.cards.map((card) => (
                            <article key={card.eyebrow}>
                              <p className="adopt-meta-label adopt-meta-label--bold">{card.eyebrow}</p>
                              {card.body.split('\n\n').map((paragraph) => (
                                <p key={paragraph} className="adopt-body adopt-overview__card-copy mb-0 whitespace-pre-line text-pretty">
                                  {paragraph}
                                </p>
                              ))}
                            </article>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </motion.section>

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
                    </div>
                  </AdoptCaseStudySection>

                  <AdoptCaseStudySection
                    act="end-to-end-flow"
                    id="adopt-section-end-to-end-flow"
                    scrollContainerRef={adoptCaseStudyScrollRef}
                    reducedMotion={prefersReducedMotion}
                    parallax={false}
                    aria-labelledby="adopt-end-to-end-flow-heading"
                  >
                    <AdoptEndToEndFlow reducedMotion={prefersReducedMotion} />
                  </AdoptCaseStudySection>

                  <AdoptCaseStudySection
                    act="impact"
                    id="adopt-section-impact"
                    scrollContainerRef={adoptCaseStudyScrollRef}
                    reducedMotion={prefersReducedMotion}
                    parallax="lead"
                    aria-labelledby="adopt-impact-summary-label"
                  >
                    <div className="adopt-impact-summary-block">
                      <div className="adopt-impact-summary-grid grid grid-cols-1 items-center md:grid-cols-2">
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
                          <p className="adopt-meta-label adopt-meta-label--bold" id="adopt-impact-summary-label">
                            {adoptCopy.strategic.guardrails.eyebrow}
                          </p>
                          <h3 className="adopt-context-heading text-balance">
                            {adoptCopy.strategic.guardrails.heading}
                          </h3>
                          <div className="adopt-impact-summary-lede text-pretty">
                            {adoptCopy.strategic.guardrails.body.map((line) => (
                              <p key={line} className="adopt-impact-summary-line mb-0">
                                {renderInlineBold(line)}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </AdoptCaseStudySection>

                  <AdoptCaseStudySection
                    act="strategic"
                    id="adopt-section-strategic-decisions"
                    scrollContainerRef={adoptCaseStudyScrollRef}
                    reducedMotion={prefersReducedMotion}
                    parallax="body"
                    className="adopt-strategic-decisions md:scroll-mt-8"
                    aria-labelledby="adopt-edge-cases-heading"
                  >
                    <div className="adopt-strategic-layout">
                      <div className="adopt-strategic-layout__copy">
                        <div id="adopt-section-edge-cases" className="adopt-ambient-discovery scroll-mt-6">
                          <p className="adopt-meta-label adopt-meta-label--bold">
                            {adoptCopy.strategic.ambient.eyebrow}
                          </p>
                          <h3 id="adopt-edge-cases-heading" className="adopt-context-heading text-balance">
                            {adoptCopy.strategic.ambient.heading}
                          </h3>
                          {adoptCopy.strategic.ambient.body.map((paragraph) => (
                            <p
                              key={paragraph}
                              className="adopt-body mb-0 text-pretty text-ink/82"
                            >
                              {renderInlineBold(paragraph)}
                            </p>
                          ))}
                        </div>
                      </div>
                      <div className="adopt-strategic-layout__questions">
                        <h3 className="adopt-context-heading adopt-strategic-layout__questions-title text-balance">
                          Real world constraints & design
                        </h3>
                        <StrategicDecisionsSection
                          showHeader={false}
                          items={adoptCopy.ADOPT_STRATEGIC_ITEMS}
                          openIndex={adoptAccordionOpen}
                          onToggle={(i) => setAdoptAccordionOpen(adoptAccordionOpen === i ? null : i)}
                        />
                      </div>
                    </div>
                  </AdoptCaseStudySection>

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

                  <AdoptCaseStudySection
                    act="key-insight"
                    id="adopt-section-key-insight"
                    scrollContainerRef={adoptCaseStudyScrollRef}
                    reducedMotion={prefersReducedMotion}
                    parallax="lead"
                    showSeparator={false}
                    className="adopt-case-study-act--continued"
                    aria-labelledby="adopt-key-insights-implications-heading"
                  >
                    <div className="adopt-impact-summary-block">
                      <div className="adopt-impact-summary-grid grid grid-cols-1 items-center md:grid-cols-2">
                        <div className="flex items-center justify-center md:justify-start">
                          <img
                            src="/adopt-a-school/system-design-physical-digital.png"
                            alt="Physical activation object beside the digital enrollment flow — the same participation path, two surfaces."
                            className="h-auto w-full max-w-[340px] rounded-2xl object-contain md:max-w-none"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                        <div className="adopt-impact-summary min-w-0 text-left">
                          <h3
                            id="adopt-key-insights-implications-heading"
                            className="adopt-context-heading text-balance"
                          >
                            {adoptCopy.keyInsights.heading}
                          </h3>
                          <div className="adopt-impact-summary-lede text-pretty">
                            {adoptCopy.keyInsights.body.map((paragraph) => (
                              <p key={paragraph} className="adopt-impact-summary-line mb-0">
                                {paragraph}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </AdoptCaseStudySection>

                  <AdoptCaseStudySection
                    act="conclusion"
                    id="adopt-section-conclusion"
                    scrollContainerRef={adoptCaseStudyScrollRef}
                    reducedMotion={prefersReducedMotion}
                    parallax="body"
                    className="adopt-conclusion"
                    aria-labelledby="adopt-conclusion-heading"
                  >
                    <div className="adopt-conclusion__card">
                      <div className="adopt-conclusion__block">
                        <h2 id="adopt-conclusion-heading" className="adopt-context-heading">
                          {adoptCopy.keyLearnings.h2}
                        </h2>
                        <ul className="adopt-conclusion__list">
                          {adoptCopy.keyLearnings.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                        {adoptCopy.finalOutcome.body ? (
                          <p className="adopt-body mb-0 text-pretty text-ink/82">{adoptCopy.finalOutcome.body}</p>
                        ) : null}
                      </div>
                      <div className="adopt-conclusion__block">
                        <h3 id="adopt-reflection-heading" className="adopt-context-heading">
                          {adoptCopy.reflection.h2}
                        </h3>
                        {adoptCopy.reflection.body.map((paragraph) => (
                          <p key={paragraph} className="adopt-body mb-0 text-pretty text-ink/82">
                            {paragraph}
                          </p>
                        ))}
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

      {/* Visual design landing + per-project URLs + Vheny product / branding */}
      <AnimatePresence>
        {openVisualPage && (
          <VisualDesignLanding
              onHomeClick={handleHomeNavClick}
              onAboutClick={handleAboutNavClick}
            onVisualBrandingClick={handleVisualBrandingNavClick}
            onProductClick={handleProductNavClick}
            onOpenWork={openVisualWorkPage}
            reducedMotion={prefersReducedMotion}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {openVisualWork && visualWorkKind ? (
          <VisualWorkPage
            kind={visualWorkKind}
            reducedMotion={prefersReducedMotion}
            onHomeClick={handleHomeNavClick}
            onAboutClick={handleAboutNavClick}
            onVisualBrandingClick={handleVisualBrandingNavClick}
            onProductClick={handleProductNavClick}
            onBackToVisual={backToVisualLanding}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {openVhenyProduct && (
          <VhenyWorkPage
            kind="product"
            reducedMotion={prefersReducedMotion}
            onHomeClick={handleHomeNavClick}
            onAboutClick={handleAboutNavClick}
            onVisualBrandingClick={handleVisualBrandingNavClick}
            onProductClick={handleProductNavClick}
            backLabel="Home"
            onBack={handleHomeNavClick}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {openVhenyBranding && (
          <VhenyWorkPage
            kind="branding"
            reducedMotion={prefersReducedMotion}
            onHomeClick={handleHomeNavClick}
            onAboutClick={handleAboutNavClick}
            onVisualBrandingClick={handleVisualBrandingNavClick}
            onProductClick={handleProductNavClick}
            backLabel="Visual design"
            onBack={backToVisualLanding}
          />
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
              onVisualBrandingClick={handleVisualBrandingNavClick}
              onProductClick={handleProductNavClick}
              surface={driverCaseStudyNavSurface}
            />

            <main className="flex-1 pb-[max(4.5rem,env(safe-area-inset-bottom))] md:pb-[8rem]">
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

                    <motion.div variants={makeIntroItem(prefersReducedMotion)}>
                      <PlayfulTitleField
                        title={driverCopy.hero.h1}
                        headingId="driver-case-study-heading"
                        lines={driverCopy.hero.h1Lines}
                        className="mb-0 scroll-mt-6 text-left"
                        reducedMotion={prefersReducedMotion}
                      />
                    </motion.div>
                    <motion.p
                      className="adopt-case-study-hero-lede adopt-body m-0 text-pretty"
                      variants={makeIntroItem(prefersReducedMotion)}
                    >
                      {driverCopy.hero.subheader}
                    </motion.p>
                    <motion.div
                      id="driver-section-overview"
                      variants={makeIntroItem(prefersReducedMotion)}
                    >
                      <CaseStudyOpening
                        copy={driverCopy.overview}
                        factsId="driver-section-context"
                        storyId="driver-section-story"
                      />
                    </motion.div>
                  </motion.section>

                  {/* Act 4 — Key system insights */}
                  <AdoptCaseStudySection
                    act="key-learnings"
                    id="driver-section-system-insights"
                    scrollContainerRef={driverCaseStudyScrollRef}
                    reducedMotion={prefersReducedMotion}
                    parallax="body"
                    className="adopt-key-learnings"
                    aria-labelledby="driver-system-insights-heading"
                  >
                    <DriverSystemInsights headingId="driver-system-insights-heading" />
                  </AdoptCaseStudySection>

                  {/* Act 5 — Two-station dispatch pipeline */}
                  <AdoptCaseStudySection
                    act="end-to-end-flow"
                    id="driver-section-pipeline"
                    scrollContainerRef={driverCaseStudyScrollRef}
                    reducedMotion={prefersReducedMotion}
                    parallax="body"
                    aria-labelledby="driver-pipeline-heading"
                  >
                    <DriverDispatchPipeline
                      headingId="driver-pipeline-heading"
                      reducedMotion={prefersReducedMotion}
                    />
                  </AdoptCaseStudySection>

                  {/* Act 5.5 — Live working prototype */}
                  <AdoptCaseStudySection
                    act="end-to-end-flow"
                    id="driver-section-live-prototype"
                    scrollContainerRef={driverCaseStudyScrollRef}
                    reducedMotion={prefersReducedMotion}
                    parallax="body"
                    aria-labelledby="driver-live-prototype-heading"
                  >
                    <DriverLivePrototype headingId="driver-live-prototype-heading" />
                  </AdoptCaseStudySection>

                  {/* Act 6 — Process overview */}
                  <AdoptCaseStudySection
                    act="process"
                    id="driver-process-overview"
                    scrollContainerRef={driverCaseStudyScrollRef}
                    reducedMotion={prefersReducedMotion}
                    parallax={false}
                  >
                    <div id="driver-section-strategic-decisions" className="scroll-mt-6">
                    <AdoptProcessOverview
                      editorial={ADOPT_EDITORIAL_OVERLAP}
                      scrollContainerRef={driverCaseStudyScrollRef}
                      reducedMotion={prefersReducedMotion}
                      content={DRIVER_PROCESS_OVERVIEW_CONTENT}
                    />
                    </div>
                  </AdoptCaseStudySection>

                  {/* Act 7 — Prototype showcase */}
                  <AdoptCaseStudySection
                    act="end-to-end-flow"
                    id="driver-section-prototype-showcase"
                    scrollContainerRef={driverCaseStudyScrollRef}
                    reducedMotion={prefersReducedMotion}
                    parallax="body"
                    aria-labelledby="driver-showcase-heading"
                  >
                    <DriverPrototypeShowcase
                      headingId="driver-showcase-heading"
                      reducedMotion={prefersReducedMotion}
                    />
                  </AdoptCaseStudySection>

                  {/* Act 8 — Before vs after */}
                  <AdoptCaseStudySection
                    act="impact"
                    id="driver-section-impact"
                    scrollContainerRef={driverCaseStudyScrollRef}
                    reducedMotion={prefersReducedMotion}
                    parallax="body"
                    aria-labelledby="driver-impact-summary-label"
                  >
                    <DriverImpactTable headingId="driver-impact-summary-label" />
                  </AdoptCaseStudySection>

                  {/* Act 9 — Closing reflection */}
                  <AdoptCaseStudySection
                    act="final-outcome"
                    id="driver-section-where-we-are"
                    scrollContainerRef={driverCaseStudyScrollRef}
                    reducedMotion={prefersReducedMotion}
                    parallax="body"
                    className="adopt-final-outcome"
                    aria-labelledby="driver-closing-heading"
                  >
                    <div className="adopt-prose">
                      <h2
                        id="driver-closing-heading"
                        className="adopt-context-heading mb-0 scroll-mt-6 text-balance"
                      >
                        {driverCopy.closing.h2}
                      </h2>
                      {driverCopy.closing.body.map((paragraph) => (
                        <p key={paragraph} className="adopt-body mb-0 text-pretty text-ink/82">
                          {paragraph}
                        </p>
                      ))}
                    </div>
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
        className="home-featured-section overflow-x-clip border-b border-ink/20 bg-bg px-4 pb-16 pt-0 sm:px-6 md:overflow-x-visible md:px-12 md:pb-20 md:pt-0"
        style={{ backgroundColor: '#F8F9FA' }}
        aria-labelledby="selected-visual-work-heading"
        variants={revealSection}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.18 }}
      >
        <div className="home-featured-section-shell mx-auto w-full min-w-0 max-w-[1180px]">
          <div className="home-chapter-band">
            <HomeChapterLabel
              id="home-chapter-team-work"
              field="team"
              kicker={homeCopy.teamWork.chapterKicker}
            >
              {homeCopy.teamWork.chapterH2}
            </HomeChapterLabel>
            </div>
          <HomeVisualBento
            onOpenWork={openVisualWorkPage}
            copy={
              <HomeCaseStudyCopy
                headingId="selected-visual-work-heading"
                industry={homeCopy.teamWork.industry}
                discipline={homeCopy.teamWork.discipline}
                title={homeCopy.teamWork.h2}
                className="home-case-study-copy-shell--visual"
                lede={homeCopy.teamWork.lede}
                ctaLabel={homeCopy.teamWork.cta}
                onCta={() => goToRoute('visual')}
              />
            }
          />
        </div>
      </motion.section>
      </div>

      {/* Thinking Through Design — fan card section, visually anchored to footer */}
          <ThinkingThroughDesignSection
        onAboutClick={handleAboutNavClick}
        onOpenAdopt={() => goToRoute('adopt')}
        onOpenDriver={() => goToRoute('driver')}
        onOpenAi={() => goToRoute('ai')}
        onOpenTouchpoints={() => goToRoute('vhenyProduct')}
        onOpenVhenyProduct={() => goToRoute('vhenyProduct')}
        onOpenVhenyBranding={() => goToRoute('vhenyBranding')}
        onOpenVisual={() => goToRoute('visual')}
          />

      {/* Footer lives on the paper sheet so the homepage surface continues unbroken. */}
      <SiteFooter />
        </div>

      </main>
    </div>
  );
}
