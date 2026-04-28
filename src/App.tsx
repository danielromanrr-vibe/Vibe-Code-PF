import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import { ChevronDown, ArrowUp } from 'lucide-react';
import Footer from './components/Footer';
import AdoptCaseStudyMedia from './components/AdoptCaseStudyMedia';
import AdoptQuickScan from './components/AdoptQuickScan';
import SectionRhythmDivider from './components/SectionRhythmDivider';
import TokenButton from './components/TokenButton';
import ExpandMediaButton from './components/ExpandMediaButton';
import AmbientMandalaTrail from './components/AmbientMandalaTrail';
import MandalaBanner from './components/MandalaBanner';
import TopNavStrip from './components/TopNavStrip';
import NavBrandingMount from './components/euphoriaMandala/NavBrandingMount';
import EditorialGalleryModal, { type GalleryImage } from './components/EditorialGalleryModal';

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
  amazonSelect('Alexa-kids-hero.jpg', true, 'Alexa+ hero — campaign'),
  amazonSelect('Alexa-kids-gallery1.png', false, 'Gallery — product UI'),
  amazonSelect('Alexa-kids-gallery2.png', false, 'Gallery — lifestyle context'),
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
  'Participation model that scales',
  'Physical, digital, community linked',
  'Business-hosted program moments',
  'Sustained support paths',
] as const;

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
    // Use captioned campaign selects to keep context attached to each visual.
    return [
      AMAZON_DBS_CONSOLIDATED_IMAGES[4],
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
  const [adoptAccordionOpen, setAdoptAccordionOpen] = useState<number | null>(null);
  const [openDesigningAiPage, setOpenDesigningAiPage] = useState(false);
  const [openTouchpointsPage, setOpenTouchpointsPage] = useState(false);
  const [openDriverPage, setOpenDriverPage] = useState(false);
  const [openAboutPage, setOpenAboutPage] = useState(false);
  const [openCvPage, setOpenCvPage] = useState(false);
  const [selectedFeaturedIndex, setSelectedFeaturedIndex] = useState(0);
  const [openFeaturedGallery, setOpenFeaturedGallery] = useState(false);
  const [hoveredHeroCard, setHoveredHeroCard] = useState<number | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const heroStackRef = useRef<HTMLDivElement | null>(null);
  const [heroPortraitRevealed, setHeroPortraitRevealed] = useState(false);
  const [heroPortraitSessionStamp, setHeroPortraitSessionStamp] = useState(0);
  const [heroBannerLens, setHeroBannerLens] = useState<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });
  const lastMouseMoveAtRef = useRef(0);
  const featuredProject = FEATURED_PROJECTS[selectedFeaturedIndex];
  const featuredGallery = getFeaturedGallery(featuredProject.id).filter(hasImageSrc);
  const featuredHeroImage = featuredGallery[0];

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

  const { scrollYProgress: heroStackProgress } = useScroll({
    target: heroStackRef,
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
      <AmbientMandalaTrail className="z-[25]" />

      <main className="editorial-page home-page relative z-20 pt-11">
      {!isFullPageOverlayOpen && (
        <TopNavStrip
          page="home"
          mandalaAnchorId="mandala-nav-home"
          onHomeClick={handleHomeNavClick}
          onAboutClick={handleAboutNavClick}
          onCvClick={handleCvNavClick}
        />
      )}
      <section
        className="relative mb-0 flex min-h-[calc(100dvh-6rem)] flex-col bg-bg text-ink md:min-h-[calc(100dvh-7rem)]"
        aria-label="Hero"
        style={{ backgroundColor: '#F8F9FA' }}
      >
        <div
          className="relative z-0 h-[clamp(216px,34vh,420px)] w-full overflow-hidden"
          style={{
            maskImage:
              'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 72%, rgba(0,0,0,0.36) 95%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 72%, rgba(0,0,0,0.36) 95%, rgba(0,0,0,0) 100%)',
          }}
          onMouseMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            setHeroBannerLens({
              x: Math.max(0, Math.min(rect.width, event.clientX - rect.left)),
              y: Math.max(0, Math.min(rect.height, event.clientY - rect.top)),
              active: true,
            });
          }}
          onMouseLeave={() => setHeroBannerLens((prev) => ({ ...prev, active: false }))}
          aria-hidden
        >
          <div className="absolute inset-0 opacity-[0.26] [filter:grayscale(1)_saturate(0.18)]" aria-hidden>
            <MandalaBanner
              fullBleed
              interactive
              onDarkBackground
              paletteVersion={0}
              intensity={16}
              className="h-full min-h-[clamp(117px,18vh,100%)] w-full max-w-none min-w-0"
            />
          </div>
          <div
            className={`pointer-events-none absolute inset-0 transition-opacity duration-200 ${
              heroBannerLens.active ? 'opacity-[0.92]' : 'opacity-0'
            }`}
            style={{
              maskImage: `radial-gradient(circle 250px at ${heroBannerLens.x}px ${heroBannerLens.y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.64) 64%, rgba(0,0,0,0) 100%)`,
              WebkitMaskImage: `radial-gradient(circle 250px at ${heroBannerLens.x}px ${heroBannerLens.y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.64) 64%, rgba(0,0,0,0) 100%)`,
            }}
            aria-hidden
          >
            <MandalaBanner
              fullBleed
              interactive
              onDarkBackground
              paletteVersion={0}
              intensity={82}
              className="h-full min-h-[clamp(117px,18vh,100%)] w-full max-w-none min-w-0"
            />
          </div>
        </div>
        <div className="relative z-10 -mt-[clamp(60px,7vh,102px)] flex flex-1 flex-col justify-center px-4 pb-14 pt-[clamp(8px,1.2vh,16px)] sm:px-6 sm:pb-16 md:px-12 md:pb-20 lg:pb-24">
          <div className="mx-auto w-full max-w-[min(52rem,92vw)] text-left">
            <div className="hero-inline-intro mx-auto flex max-w-full items-start gap-[0.35rem] sm:gap-[0.42rem] flex-col">
              <div className="hero-inline-intro-row mb-0 flex flex-wrap items-end gap-x-[0.18em] gap-y-px font-bold tracking-[-0.052em]">
                <h1 className="hero-inline-h1 mb-0 mt-0 inline-block align-bottom text-ink">
                  Hi, I'm Daniel
                </h1>
                <button
                  type="button"
                  className="relative mx-[0.06em] mb-[0.06em] inline-block h-[1.22em] w-[1.22em] shrink-0 cursor-default border-0 bg-transparent p-0 align-bottom focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
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
                      'hero-inline-portrait-img pointer-events-none absolute inset-0 z-[1] h-full w-full rounded-full border-0 bg-transparent object-cover shadow-none outline-none ring-0',
                      'transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-opacity motion-reduce:duration-150 motion-reduce:transform-none',
                      heroPortraitRevealed
                        ? 'pointer-events-none scale-[0.96] opacity-0'
                        : 'scale-100 opacity-100',
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
                </button>
              </div>
              <h2 className="hero-inline-h2 mb-0 mt-0 block max-w-[min(46ch,100%)] text-balance font-semibold tracking-[-0.036em] text-ink/85">
                — a product designer helping complex operations scale through a systems thinking, data driven approach.
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* Case study 1: NGO participation system */}
      <motion.section
        className="border-t border-ink/15 bg-bg px-4 pb-12 pt-12 sm:px-6 md:px-12 md:pb-14 md:pt-14"
        style={{ backgroundColor: '#F8F9FA' }}
        aria-labelledby="case-study-ngo-heading"
        variants={revealSection}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.18 }}
      >
        <div className="mx-auto w-full max-w-[1180px]">
          <div className="mx-auto grid w-full grid-cols-1 items-start gap-6 md:grid-cols-12 md:gap-8 md:items-start">
            <div className="order-1 md:col-span-6">
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
            <div className="order-2 md:col-span-6 md:flex md:justify-end">
              <motion.div variants={revealItem} className="mx-auto w-[99%] max-w-[760px] overflow-hidden rounded-lg border border-ink/12 bg-white md:mx-0 md:w-[156%] md:max-w-[1120px]">
                <div className="aspect-[16/10] md:aspect-[13/10] w-full overflow-hidden">
                  <img
                    src="/homepage-hero.png"
                    alt="Donation flow interface showing contribution slider and call to action"
                    className="h-full w-full object-cover"
                    style={{ objectPosition: '52% 48%', transform: 'scale(1.46)' }}
                    loading="eager"
                    decoding="async"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Case study 2: coordination system + image stack */}
      <motion.section
        className="border-b border-ink/20 bg-bg px-4 pb-10 pt-8 sm:px-6 md:px-12 md:pb-12 md:pt-10"
        style={{ backgroundColor: '#F8F9FA' }}
        aria-label="Driver coordination case study and field imagery"
        variants={revealSection}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.18 }}
      >
        <div className="mx-auto w-full max-w-[1180px]">
        <motion.div variants={revealItem} className="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-center md:gap-6">
          <div className="order-2 md:order-1 md:col-span-7">
            <motion.div variants={revealItem} ref={heroStackRef} className="pointer-events-auto relative h-[240px] w-full md:h-[360px]">
              {[
                {
                  src: '/adopt-a-school/Hero3_.jpg',
                  alt: 'Community touchpoint showing the system in a real-world setting',
                  frameClass: 'left-[3%] top-[7%] h-[78%] w-[64%]',
                  imageScale: 1.1,
                  imagePosition: '52% 42%',
                  baseZ: 40,
                },
                {
                  src: '/adopt-a-school/Hero2_Humanize-shot_IMG_9442.jpg',
                  alt: 'On-site system interaction detail',
                  frameClass: 'left-[69%] top-[14%] h-[48%] w-[20%]',
                  imageScale: 1.12,
                  imagePosition: '52% 30%',
                  baseZ: 20,
                },
                {
                  src: '/adopt-a-school/Hero1_Humanize-shot_IMG_9441.jpg',
                  alt: 'People and environment connected through the participation system',
                  frameClass: 'left-[56%] top-[63%] h-[26%] w-[30%]',
                  imageScale: 1.1,
                  imagePosition: '56% 34%',
                  baseZ: 10,
                },
              ].map((card, index) => {
                const isHovered = hoveredHeroCard === index;
                const hasHover = hoveredHeroCard !== null;
                const wrapperScale = prefersReducedMotion ? 1 : isHovered ? 1.03 : hasHover ? 0.98 : 1;
                const opacity = hasHover && !isHovered ? 0.86 : 1;
                const zIndex = isHovered ? 50 : card.baseZ;

                return (
                  <motion.article
                    key={card.src}
                    className={`absolute overflow-hidden rounded-lg border border-ink/12 bg-white ${card.frameClass}`}
                    style={{
                      zIndex,
                      opacity,
                      scale: wrapperScale,
                      y: prefersReducedMotion ? 0 : heroCardParallaxSmooth[index],
                    transition: 'opacity 150ms ease-out',
                    }}
                    transition={{ duration: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
                    onMouseEnter={() => setHoveredHeroCard(index)}
                    onMouseLeave={() => setHoveredHeroCard(null)}
                  >
                    <img
                      src={card.src}
                      alt={card.alt}
                      className="h-full w-full object-cover"
                      style={{ objectPosition: card.imagePosition, transform: `scale(${card.imageScale})` }}
                      loading="eager"
                      decoding="async"
                    />
                  </motion.article>
                );
              })}
            </motion.div>
          </div>

          <motion.div variants={revealItem} className="order-1 md:order-2 md:col-span-5">
            <div
              className="cursor-pointer"
              onClick={() => setOpenDriverPage(true)}
            >
              <div>
                <h2 className="mb-2 max-w-[20ch] leading-[1.06] text-ink/92">Scaling coordination with real-time driver visibility</h2>
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

      {/* Section: Selected Visual Work */}
      <motion.section
        className="border-b border-ink/20 bg-bg px-4 pb-10 pt-5 sm:px-6 md:px-12 md:pb-12 md:pt-6"
        style={{ backgroundColor: '#F8F9FA' }}
        aria-labelledby="selected-visual-work-heading"
        variants={revealSection}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.18 }}
      >
        <div className="mx-auto w-full min-w-0 max-w-[1180px]">
          <motion.h2 variants={revealItem} id="selected-visual-work-heading" className="mb-1.5 text-[clamp(1.8rem,3.5vw,2.6rem)] leading-[1.02]">
            Selected work featuring visual
            <br />
            craft in cross-functional teams
          </motion.h2>

          <motion.div
            variants={revealItem}
            className="mb-4 -ml-0.5 flex gap-2 overflow-x-auto overflow-y-visible py-1 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] md:mb-5 [&::-webkit-scrollbar]:hidden"
            role="tablist"
            aria-label="Selected visual work projects"
          >
            {FEATURED_PROJECTS.map((project, index) => (
              <button
                key={project.id}
                type="button"
                role="tab"
                aria-selected={selectedFeaturedIndex === index}
                aria-controls={`selected-visual-panel-${project.id}`}
                id={`selected-visual-tab-${project.id}`}
                onClick={() => setSelectedFeaturedIndex(index)}
                className={`shrink-0 rounded-full border px-3 py-1.5 font-body text-body font-medium leading-snug tracking-[0.005em] transition-colors duration-150 sm:px-3.5 sm:py-1.5 ${
                  selectedFeaturedIndex === index
                    ? 'border-ink/28 bg-ink/[0.06] text-ink'
                    : 'border-ink/12 bg-transparent text-ink/58 hover:border-ink/24 hover:bg-ink/[0.03] hover:text-ink/80'
                }`}
              >
                {project.title}
              </button>
            ))}
          </motion.div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={featuredProject.id}
              id={`selected-visual-panel-${featuredProject.id}`}
              role="tabpanel"
              aria-labelledby={`selected-visual-tab-${featuredProject.id}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.34, ease: [0.2, 0.8, 0.2, 1] }}
              className="space-y-2.5 md:space-y-3"
            >
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }} className="overflow-hidden rounded-lg border border-ink/12 bg-white md:-mr-6">
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <motion.img
                    src={featuredHeroImage?.src ?? '/Hero_1.png'}
                    alt={`${featuredProject.title} featured visual`}
                    className="h-full w-full object-cover"
                    style={{
                      objectPosition: getFeaturedObjectPosition(featuredProject.id, 0, 'hero'),
                      transform: `scale(${getFeaturedCropScale(featuredProject.id, 0, 'hero')})`,
                    }}
                    loading="eager"
                    decoding="async"
                  />
                  <ExpandMediaButton
                    className="absolute bottom-[max(0.75rem,env(safe-area-inset-bottom))] right-[max(0.75rem,env(safe-area-inset-right))] z-20 sm:bottom-4 sm:right-4"
                    aria-label={`Expand ${featuredProject.title} gallery`}
                    onClick={() => setOpenFeaturedGallery(true)}
                  />
                </div>
                {featuredHeroImage?.caption && (
                  <p className="caption mb-0 border-t border-ink/10 px-3 py-2 text-ink/60 md:px-4">
                    {featuredHeroImage.caption}
                  </p>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>

          <EditorialGalleryModal
            open={openFeaturedGallery}
            onClose={() => setOpenFeaturedGallery(false)}
            projectTitle={featuredProject.title}
            images={featuredGallery}
          />
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
            id="adopt-case-study-scroll"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex flex-col bg-bg overflow-y-auto overflow-x-hidden pt-11"
            style={{ backgroundColor: '#F8F9FA' }}
          >
            <TopNavStrip
              page="adopt"
              mandalaAnchorId="mandala-nav-adopt"
              onHomeClick={handleHomeNavClick}
              onAboutClick={handleAboutNavClick}
              onCvClick={handleCvNavClick}
            />

            <main className="flex-1 pb-[200px]">
              <div className="relative w-full overflow-hidden border-b border-ink/[0.06] bg-ink/[0.015]">
                <div className="relative h-[clamp(220px,min(56vh,640px),640px)] min-h-[200px] w-full overflow-hidden sm:min-h-[260px]">
                  <img
                    src="/adopt-a-school/ARTD-C02-Device-011.jpg"
                    alt="Adopt-a-School hero banner."
                    className="h-full w-full object-cover object-[50%_46%]"
                    loading="eager"
                    decoding="async"
                  />
                </div>
              </div>
              <div className="editorial-container adopt-case-study px-5 pt-8 sm:px-8 md:px-12 md:pt-12 md:pb-6">
                {/* 1. Hero + Prototype (system architecture + validation as h3) */}
                <section>
                  <header className="mb-9 md:mb-11">
                    <h1 className="leading-[1.02] mb-8 md:mb-10">
                      Adopt-a-School
                    </h1>
                    <section aria-label="Project metadata">
                      <dl className="adopt-meta">
                        <div>
                          <dt className="scroll-mt-4">Role</dt>
                          <dd className="adopt-body mb-0 max-w-measure">Service design, product design, research</dd>
                        </div>
                        <div>
                          <dt className="scroll-mt-4">Client</dt>
                          <dd className="adopt-body mb-0 max-w-measure">Backpack Brigade</dd>
                        </div>
                        <div>
                          <dt className="scroll-mt-4">Context</dt>
                          <dd className="adopt-body mb-0 max-w-measure">
                            12+ years fighting food insecurity—businesses and donors tied to Seattle schools for steady
                            support, not one-off drops.
                          </dd>
                        </div>
                        <div>
                          <dt className="scroll-mt-4">Scope</dt>
                          <dd className="adopt-body mb-0 max-w-measure">
                            Activation object, mobile flow, service frame—one fundraising system.
                          </dd>
                        </div>
                        <div>
                          <dt className="scroll-mt-4">Impact</dt>
                          <dd className="adopt-body mb-0 max-w-measure">
                            <ul className="list-none space-y-1.5 pl-0">
                              {ADOPT_CASE_STUDY_IMPACT_META.map((line) => (
                                <li key={line} className="flex gap-2">
                                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink/18" aria-hidden />
                                  <span>{line}</span>
                                </li>
                              ))}
                            </ul>
                          </dd>
                        </div>
                      </dl>
                    </section>
                  </header>

                  <div className="mt-14 border-t border-ink/[0.08] pt-11 md:mt-[4.5rem] md:pt-14">
                    <h2 id="adopt-section-prototype" className="mb-5 scroll-mt-6 md:mb-7">
                      Prototype overview
                    </h2>
                    <div className="mb-11 w-full min-w-0 md:mb-14">
                      <AdoptQuickScan />
                    </div>

                    <div className="border-t border-ink/[0.08] pt-10 md:pt-12">
                      <h2
                        id="adopt-section-validation"
                        className="mb-5 scroll-mt-6 md:mb-6"
                      >
                        Validation
                      </h2>
                      <p className="adopt-body mb-8 max-w-measure">
                        Field interviews and observation—no slide-only hypotheses.
                      </p>
                      <AdoptCaseStudyMedia variant="grid" gridCompactNine />
                    </div>
                  </div>
                </section>

                <SectionRhythmDivider />

                {/* 2. Strategic decisions */}
                <section className="mt-2">
                  <h2 className="mb-5 md:mb-6">Strategic decisions</h2>
                  <p className="adopt-body mb-8 max-w-measure">
                    Nonprofit scale, stakeholder values, and how people actually behave—designed together, not in
                    isolation.
                  </p>
                  <div className="divide-y divide-ink/[0.08] overflow-hidden rounded-md border border-ink/[0.08] bg-white/[0.92]">
                    {[
                      {
                        title: 'Research access vs ethical organizational boundaries',
                        content:
                          "Friction concentrated where food meets schools and families—the most sensitive zone. Direct access wasn't viable; kids off-limits; social workers out of scope.\n\nProxy work instead: program managers, maps where Backpack Brigade's presence fades, leadership role-plays. Same timeline, clearer end-of-chain feedback—kids' experience and food preferences—without widening operations.",
                      },
                      {
                        title: 'Revenue optimization vs founder philosophy',
                        content:
                          'Tighter contribution prompts tested stronger. The founder wanted participation to feel like joining a cause, not completing a transaction—that stayed a hard constraint.\n\nChecked the revenue case with Development; documented tiered contribution as a phased recommendation, not a forced rollout.',
                      },
                      {
                        title: 'Prototype fidelity vs delivery constraints',
                        content:
                          'Physical object and full mobile flow both had to ship; time forced a split.\n\nBehavioral learning drove where fidelity went: digital flow and map logic first. Physical side: fast iteration, AI-assisted passes, loose fabrication specs—enough to test end-to-end without polishing the object past what validation needed.',
                      },
                      {
                        title: 'Artifact optimization vs system behavior',
                        content:
                          'People noticed the object—touched it, lingered— but scans stayed low.\n\nQuestion became role, not polish: it works as ambient discovery, not the main converter. When staff named what people were looking at, conversion moved. Object opens attention; people close the loop.',
                      },
                    ].map((item, i) => (
                      <div key={i}>
                        <button
                          type="button"
                          onClick={() => setAdoptAccordionOpen(adoptAccordionOpen === i ? null : i)}
                          className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-ink/[0.03] md:px-5 md:py-4"
                          aria-expanded={adoptAccordionOpen === i}
                        >
                          <span className="adopt-card-title block pr-2 text-left">{item.title}</span>
                          <ChevronDown
                            size={18}
                            strokeWidth={1.75}
                            className={`shrink-0 text-ink/40 transition-transform ${adoptAccordionOpen === i ? 'rotate-180' : ''}`}
                            aria-hidden
                          />
                        </button>
                        {adoptAccordionOpen === i && (
                          <div className="adopt-body border-t border-ink/[0.06] px-4 pb-5 pt-4 whitespace-pre-line md:px-5">
                            {item.content}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                <SectionRhythmDivider />

                <section>
                  <h2 className="mb-5 md:mb-6">Reflection</h2>
                  <p className="adopt-body mb-10 max-w-measure md:mb-12">
                    The org grew organically for years—design had to fit how the team already works, not pretend a
                    greenfield rebuild.
                    <br />
                    <br />
                    Strong systems often come from tight constraints. New pathways had to extend reach without replacing
                    operations.
                    <br />
                    <br />
                    The product is not only screens—it is people, places, and repeatable behaviors wired together.
                  </p>

                  <h3 className="mb-4 font-heading md:mb-5">Future opportunities</h3>
                  <p className="adopt-body mb-10 max-w-measure md:mb-12">
                    Refined activation objects in community settings; clearer scan moments at first touch.
                    <br />
                    <br />
                    Tiered sponsorship for businesses and recurring donors—structured without feeling transactional.
                    <br />
                    <br />
                    Tighter loops between schools and supporters: stories, impact signals, food preference feedback.
                  </p>

                  <h3 id="adopt-section-impact" className="mb-4 scroll-mt-6 font-heading md:mb-5">
                    Real-world impact
                  </h3>
                  <p className="adopt-body mb-0 max-w-measure">
                    A decade of ops knowledge, folded into a participation framework—community and businesses support
                    schools through moments embedded in everyday places, not only the warehouse.
                    <br />
                    <br />
                    Service and product design together: physical touchpoints, human activation, mobile flow—one system.
                  </p>
                </section>

                <SectionRhythmDivider />

                <section>
                  <h2 className="mb-5 md:mb-6">Closing words</h2>
                  <div className="max-w-measure">
                    <p className="adopt-body">
                      Aim was a system communities could actually use to support kids in Seattle schools—not a
                      standalone interface exercise.
                    </p>
                  </div>
                </section>

                <div className="mt-6 md:mt-7">
                  <TokenButton
                    aria-label="Back to top"
                    onClick={() =>
                      document.getElementById('adopt-case-study-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })
                    }
                    className="gap-2"
                  >
                    Back to top
                    <ArrowUp size={16} strokeWidth={2} aria-hidden />
                  </TokenButton>
                </div>
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
                              <ul className="list-none space-y-1.5 pl-0">
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
                              <ul className="list-none space-y-1.5 pl-0">
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
              <div className="editorial-container editorial-page">
                <section>
                  <header className="mb-9 md:mb-11">
                    <h1 className="leading-[1.02] mb-4 md:mb-6">
                      Making driver flexibility a scalable coordination system
                    </h1>
                    <p className="adopt-body mb-3 max-w-measure">
                      Designing a map-based decision layer for real-time logistics at Backpack Brigade
                    </p>
                    <p className="adopt-body mb-0 max-w-measure">
                      Coordination relied on memory and invisible driver availability. I designed a system that makes flexibility visible, structured, and actionable-enabling real-time decision-making under pressure.
                    </p>
                  </header>
                  <div className="mb-10 w-full overflow-hidden rounded-lg border border-ink/12 bg-white">
                    <div className="aspect-[16/10] w-full overflow-hidden">
                      <video
                        className="h-full w-full object-cover object-center"
                        src="/adopt-a-school/school-adoption-map.mp4"
                        muted
                        loop
                        autoPlay
                        playsInline
                        controls
                        preload="metadata"
                      />
                    </div>
                  </div>
                </section>

                <section className="mt-12 border-t border-ink/10 pt-10 md:mt-16 md:pt-12">
                  <h2 className="mb-4">Context</h2>
                  <p className="adopt-body mb-0 max-w-measure">
                    Backpack Brigade aims to scale its operations, but coordination breaks under complexity. Information is fragmented, and key decisions rely on human memory.
                  </p>
                </section>

                <section className="mt-12 border-t border-ink/10 pt-10 md:mt-16 md:pt-12">
                  <h2 className="mb-4">Why the system couldn&apos;t scale</h2>
                  <ul className="list-none space-y-2 pl-0 adopt-body max-w-measure">
                    <li className="flex gap-2"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink/25" aria-hidden />Flexibility was invisible</li>
                    <li className="flex gap-2"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink/25" aria-hidden />Decisions relied on memory</li>
                    <li className="flex gap-2"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink/25" aria-hidden />Every disruption became a manual search problem</li>
                  </ul>
                </section>

                <section className="mt-12 border-t border-ink/10 pt-10 md:mt-16 md:pt-12">
                  <h2 className="mb-4">Making flexibility a system capability</h2>
                  <p className="adopt-body mb-6 max-w-measure">
                    I transformed driver flexibility from a human trait into a structured, operational resource.
                  </p>
                  <div className="w-full max-w-2xl overflow-hidden rounded-lg border border-ink/12 bg-white">
                    <div className="aspect-[5/3] overflow-hidden">
                      <img
                        src="/adopt-a-school/key-interaction-qr-entry.png"
                        alt="Structured driver profile and dispatch entry view"
                        className="h-full w-full object-cover object-center"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                </section>

                <section className="mt-12 border-t border-ink/10 pt-10 md:mt-16 md:pt-12">
                  <h2 className="mb-4">A map-based decision layer</h2>
                  <p className="adopt-body mb-6 max-w-measure">
                    The system surfaces nearby, available drivers in real time, enabling fast, informed decisions.
                  </p>
                  <div className="w-full overflow-hidden rounded-lg border border-ink/12 bg-white">
                    <div className="aspect-[16/10] w-full overflow-hidden">
                      <img
                        src="/adopt-a-school/Hero-2338-discovery.png"
                        alt="Map interface showing nearby available drivers"
                        className="h-full w-full object-cover object-center"
                        loading="eager"
                        decoding="async"
                      />
                    </div>
                  </div>
                </section>

                <section className="mt-12 border-t border-ink/10 pt-10 md:mt-16 md:pt-12">
                  <h2 className="mb-4">Tested in real conditions</h2>
                  <ul className="list-none space-y-2 pl-0 adopt-body max-w-measure">
                    <li className="flex gap-2"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink/25" aria-hidden />1 coordinator</li>
                    <li className="flex gap-2"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink/25" aria-hidden />3 real scenarios</li>
                    <li className="flex gap-2"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink/25" aria-hidden />No guidance</li>
                  </ul>
                  <div className="mt-8 grid gap-6 md:grid-cols-2">
                    <article className="rounded-lg border border-ink/12 bg-white p-4 md:p-5">
                      <h3 className="mb-2">What worked</h3>
                      <p className="adopt-body mb-0">Decisions could be made inside the interface</p>
                    </article>
                    <article className="rounded-lg border border-ink/12 bg-white p-4 md:p-5">
                      <h3 className="mb-2">What didn&apos;t</h3>
                      <ul className="list-none space-y-1.5 pl-0 adopt-body mb-0">
                        <li className="flex gap-2"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink/25" aria-hidden />Required interpretation</li>
                        <li className="flex gap-2"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink/25" aria-hidden />Trust was not immediate</li>
                      </ul>
                    </article>
                  </div>
                </section>

                <section className="mt-12 border-t border-ink/10 pt-10 md:mt-16 md:pt-12">
                  <h2 className="mb-4">From automation to decision support</h2>
                  <p className="adopt-body mb-0 max-w-measure">
                    The system doesn&apos;t replace the coordinator-it supports their judgment.
                  </p>
                </section>

                <section className="mt-12 border-t border-ink/10 pt-10 md:mt-16 md:pt-12">
                  <h2 className="mb-4">The map is the product</h2>
                  <p className="adopt-body mb-0 max-w-measure">
                    Spatial awareness-who is nearby and available-is the core of coordination. Everything else supports this.
                  </p>
                </section>

                <section className="mt-12 border-t border-ink/10 pt-10 md:mt-16 md:pt-12">
                  <h2 className="mb-6">Before / After</h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    <article className="rounded-lg border border-ink/12 bg-white p-4 md:p-5">
                      <h3 className="mb-3">Before</h3>
                      <ul className="list-none space-y-1.5 pl-0 adopt-body mb-0">
                        <li className="flex gap-2"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink/25" aria-hidden />Fragmented information</li>
                        <li className="flex gap-2"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink/25" aria-hidden />Reactive decisions</li>
                        <li className="flex gap-2"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink/25" aria-hidden />High cognitive load</li>
                      </ul>
                    </article>
                    <article className="rounded-lg border border-ink/12 bg-white p-4 md:p-5">
                      <h3 className="mb-3">After</h3>
                      <ul className="list-none space-y-1.5 pl-0 adopt-body mb-0">
                        <li className="flex gap-2"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink/25" aria-hidden />Real-time visibility</li>
                        <li className="flex gap-2"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink/25" aria-hidden />Nearby drivers surfaced</li>
                        <li className="flex gap-2"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink/25" aria-hidden />Faster decisions</li>
                      </ul>
                    </article>
                  </div>
                </section>

                <section className="mt-12 border-t border-ink/10 pt-10 md:mt-16 md:pt-12">
                  <h2 className="mb-4">What this changes</h2>
                  <p className="adopt-body mb-0 max-w-measure">
                    By making driver flexibility visible and structured, the system transforms coordination from a fragile, human-dependent process into a scalable decision system.
                  </p>
                </section>
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

      {/* Section: Design Across Touchpoints */}
      <section className="border-b border-ink/20 bg-bg px-4 pb-10 pt-6 sm:px-6 md:px-12 md:pb-12 md:pt-7" style={{ backgroundColor: '#F8F9FA' }} aria-labelledby="touchpoints-heading">
        <div className="mx-auto w-full min-w-0 max-w-[1180px]">
        <h2 id="touchpoints-heading" className="mb-2 text-[clamp(1.8rem,3.5vw,2.6rem)] leading-[1.02]">
          System-led product
          <br />
          strategy across touchpoints
        </h2>
        <p className="caption mb-5 max-w-[42ch] text-ink/55">
          One system strategy across touchpoints - clearer decisions, less drift, and fewer one-off fixes.
        </p>
        <TokenButton onClick={() => setOpenTouchpointsPage(true)}>View brand identity</TokenButton>
        </div>
      </section>

      <Footer id="site-footer" />
      </main>
    </div>
  );
}
