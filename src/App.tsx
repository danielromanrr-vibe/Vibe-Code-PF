import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronDown, ArrowUp } from 'lucide-react';
import Mandala from './components/Mandala';
import CustomCursor from './components/CustomCursor';
import Footer from './components/Footer';
import AdoptCaseStudyMedia from './components/AdoptCaseStudyMedia';
import ZoomInWindow from './components/ZoomInWindow';
import MandalaPageHeader from './components/MandalaPageHeader';
import AdoptSystemDiagram from './components/AdoptSystemDiagram';
import AdoptQuickScan from './components/AdoptQuickScan';
import SectionRhythmDivider from './components/SectionRhythmDivider';
import type { GalleryImage } from './components/EditorialGalleryModal';

const AMAZON_SELECTS_BASE = '/amazon-selects';
function amazonSelect(path: string, isHero?: boolean): GalleryImage {
  return { src: `${AMAZON_SELECTS_BASE}/${encodeURIComponent(path)}`, isHero };
}
const AMAZON_TOP_WINDOW_IMAGES: GalleryImage[] = [
  amazonSelect('Alexa-kids-hero.jpg', true),
  amazonSelect('Alexa-kids-gallery1.png'),
  amazonSelect('Alexa-kids-gallery2.png'),
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
function aiFoundation(path: string, isHero?: boolean): GalleryImage {
  return { src: `${AI_FOUNDATION_BASE}/${encodeURIComponent(path)}`, isHero };
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

const ADOPT_A_SCHOOL = {
  title: 'Adopt a School program',
  caseId: 'Case Study 01',
  cardTeaser:
    'Backpack Brigade has supported Seattle schools through food insecurity for 12+ years. We mapped a donation system that links businesses and donors to schools for steady—not one-off—support.',
  whatIsThis: 'A community donation system designed for Backpack Brigade, an organization combating food insecurity based in Seattle, WA.',
  whatWasShipped: 'A human-centered, design-driven community donation system for Backpack Brigade, designed and validated through service blueprints and high-fidelity prototypes.',
  scope: [
    'Led the service and product design of a multi-channel engagement system connecting donors, volunteers, and partner schools.',
    'Designed three coordinated interaction layers: physical touchpoints in community spaces, staff-supported activation through volunteers, and a mobile learning and donation flow accessed via QR codes.',
    'Delivered service blueprints, engagement frameworks, and high-fidelity prototypes to validate the concept and prepare the program for implementation.',
  ],
  impact: 'Translated 12+ years of operational knowledge into a scalable Adopt-a-School engagement system, unlocking a major recurring revenue stream for Backpack Brigade through structured donor, volunteer, and school participation.',
  exploreHref: '#',
};

/** Case study hero meta — impact lines (short bullets). */
const ADOPT_CASE_STUDY_IMPACT_META = [
  'Participation model that scales',
  'Physical, digital, community linked',
  'Business-hosted program moments',
  'Sustained support paths',
] as const;

const COVANTIS_BASE = '/covantis';
function covantisImage(path: string, isHero?: boolean): GalleryImage {
  return { src: `${COVANTIS_BASE}/${path}`, isHero };
}
const COVANTIS_GALLERY_IMAGES: GalleryImage[] = [
  covantisImage('Hero.png', true),
  covantisImage('grid1.png'),
  covantisImage('grid2.png'),
  covantisImage('grid3.png'),
  covantisImage('grid4.png'),
];

/** Thumbnail hero per Ajediam media row (order matches `media` indices). */
const AJEDIAM_HERO_IMAGES = [
  '/ajediam/hero-2.png', // rebranding
  '/ajediam/hero-4.png', // merged 1+2
  '/ajediam/hero-1.png', // get in touch
] as const;

const AJEDIAM_REBRANDING_IMAGES: GalleryImage[] = [{ src: '/ajediam/hero-2.png', isHero: true }];

const AJEDIAM_THIRD_WINDOW_IMAGES: GalleryImage[] = [
  { src: '/ajediam/hero-1.png', isHero: true },
  // "Absorb" the 4th media container by surfacing its hero image as the 2nd (first grid) item.
  { src: '/ajediam/hero-3.png' },
  { videoSrc: '/ajediam/comp-4.mp4' },
];

/** Former 2nd window images first, then former 1st window custom photos (second absorbs first). */
const AJEDIAM_MERGED_FIRST_SECOND_IMAGES: GalleryImage[] = [
  { src: '/ajediam/hero-4.png', isHero: true },
  { src: '/ajediam/gallery-2.png' },
  { src: '/ajediam/hero-custom-1.png' },
  { videoSrc: '/ajediam/homepage.mp4' },
];

const FEATURED_PROJECTS = [
  {
    id: 'amazon',
    title: 'Amazon',
    media: [
      {
        note: 'My contribution (Alexa+, 2025)',
        caption:
          'With art direction and cross-functional partners:\n• Stretch brand guidelines without losing recognition\n• Reuse simple UX patterns for speed\n• Ship and tune core UI (e.g. speech bubbles)',
      },
      {
        note: 'My contribution (DBS, 2024)',
        caption:
          '• Lifestyle imagery across traffic placements\n• AI-assisted workflows (Firefly + internal tools)\n• Repeatable variants without quality drift',
      },
      {
        note: 'My contribution (DBS, 2024)',
        caption:
          '• Roadmaps for high-visibility campaigns and new production workflows\n• Clear rationale for visual direction across teams',
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
  {
    id: 'ajediam',
    title: 'Ajediam',
    media: [
      { note: 'My contribution', caption: 'Wordmark and brand identity' },
      {
        note: 'My contribution',
        caption:
          'Creative direction for shoots and digital assets across interfaces.',
      },
      {
        note: 'My contribution',
        caption:
          '• Brand system applied across UIs\n• Prototypes for product pages and tools, tested with users',
      },
    ],
    role: null,
    scope: null,
    scopeTools: null,
    scopeHighlights: [
      '• Visual language, type, and brand frame for the company-wide rebrand',
      '• Design system spanning product, marketing, and the new site',
      '• Reusable UI patterns and interaction standards as the product grew',
    ],
    impact: [
      'Brand and product redesign: daily active users 150 → 400+ by 2024; retention +24.62%.',
      '• One framework for product, marketing, and web.',
      '• Faster cycles from shared foundations and patterns.',
    ],
    skills: null,
  },
];

function getFeaturedMediaItems(project: (typeof FEATURED_PROJECTS)[number]): { note: string; caption: string }[] {
  if ('media' in project && Array.isArray(project.media) && project.media.length > 0) {
    return project.media;
  }
  return [
    { note: 'What I owned in this visual', caption: 'My role and contribution in what you see here.' },
    { note: 'What I owned in this visual', caption: 'Another angle on my involvement in this project.' },
  ];
}

export default function App() {
  const [openAdoptPage, setOpenAdoptPage] = useState(false);
  const [adoptAccordionOpen, setAdoptAccordionOpen] = useState<number | null>(null);
  const [openFeaturedPopup, setOpenFeaturedPopup] = useState(false);
  const [openDesigningAiPage, setOpenDesigningAiPage] = useState(false);
  const [openTouchpointsPage, setOpenTouchpointsPage] = useState(false);
  const [selectedFeaturedIndex, setSelectedFeaturedIndex] = useState(0);

  useEffect(() => {
    if (openFeaturedPopup) setSelectedFeaturedIndex(0);
  }, [openFeaturedPopup]);

  useEffect(() => {
    if (openAdoptPage) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [openAdoptPage]);

  return (
    <div className="min-h-screen selection:bg-accent selection:text-white overflow-x-hidden bg-bg" style={{ backgroundColor: '#F8F9FA' }}>
      <CustomCursor />

      <main className="editorial-page home-page relative z-20">
      {/* Hero: mandala anchor first, then Mandala (so #mandala-home exists when Mandala mounts) */}
      <section className="relative h-[60vh] md:h-[70vh] flex flex-col border-b border-ink/20 bg-transparent" aria-label="Hero">
        <div id="mandala-home" className="absolute inset-0 -z-10" aria-hidden />
        <Mandala variant="heroIntegrated" />
        <header className="relative z-20 flex min-h-0 min-w-0 flex-1 items-center justify-center px-4 pb-10 pt-8 sm:px-6 sm:pb-12 md:px-12 md:pb-14 md:pt-10 pointer-events-none">
          <div className="editorial-container px-2 text-center sm:px-4 md:px-0">
            <div className="mx-auto flex max-w-full flex-col items-center gap-3 md:gap-4">
              <p className="home-eyebrow mb-0 max-w-full">
                Product | Ux | Systems designer
              </p>
              <h1 className="hero-title relative mx-auto max-w-full text-balance">
                Specialized in building with data, rapid prototyping & visual precision
              </h1>
            </div>
          </div>
        </header>
      </section>

      {/* Section 1: Highlights — case study + featured work */}
      <section className="border-b border-ink/20 bg-bg p-6 pt-10 md:px-12 md:pb-14 md:pt-14" style={{ backgroundColor: '#F8F9FA' }} aria-labelledby="highlights-heading">
        <div className="editorial-container">
        <h2 id="highlights-heading" className="mb-10 md:mb-12">
          Highlights
        </h2>

        <div className="space-y-8 md:space-y-10">
        {/* Case study — same card pattern as case study System flow (title + lede + shell) */}
        <article className="home-case-study-card">
          <div
            className="cursor-pointer"
            data-cursor="hand"
            onClick={() => setOpenAdoptPage(true)}
          >
            <header className="text-left">
              <h3 className="adopt-card-title mb-1.5">{ADOPT_A_SCHOOL.title}</h3>
              <p className="adopt-card-lede mb-0 max-w-prose">{ADOPT_A_SCHOOL.cardTeaser}</p>
            </header>
            <button
              type="button"
              data-cursor="hand"
              className="mt-5 text-link"
              onClick={(e) => { e.stopPropagation(); setOpenAdoptPage(true); }}
            >
              View case study
            </button>
          </div>
        </article>

        {/* Cross-functional work — View featured work → pop up */}
        <div className="home-highlight-card p-5 md:p-6">
          <div
            className="cursor-pointer"
            data-cursor="hand"
            onClick={() => setOpenFeaturedPopup(true)}
          >
            <div>
              <h3 className="home-highlight-title mb-3">Working with cross-functional teams</h3>
              <p className="home-body mb-0 max-w-xl">
                <span className="font-semibold text-ink">Amazon DBS:</span> piloted workflows in live environments—about 50% faster production.{' '}
                <span className="font-semibold text-ink">Alexa+:</span> extended the design system across 30+ pages with shared documentation.{' '}
                <span className="font-semibold text-ink">Covantis:</span> site redesign aligned to the product story—demo-to-adoption up ~20%.{' '}
                <span className="font-semibold text-ink">Ajediam:</span> founding design; daily users 50 → 400+, return rate up ~24% in a year.
              </p>
            </div>
            <button
              type="button"
              data-cursor="hand"
              className="mt-5 text-link"
              onClick={(e) => { e.stopPropagation(); setOpenFeaturedPopup(true); }}
            >
              View featured work
            </button>
          </div>
        </div>
        </div>
        </div>
      </section>

      {/* Featured work popup — chip/tab to alternate between 3 projects */}
      <AnimatePresence>
        {openFeaturedPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            onClick={() => setOpenFeaturedPopup(false)}
          >
            <div className="absolute inset-0 bg-ink/40" aria-hidden />
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="editorial-page relative flex min-h-0 w-full max-w-2xl max-h-[min(90vh,90dvh)] flex-col overflow-hidden rounded-lg border border-ink/12 bg-white shadow-[0_16px_48px_rgba(20,20,20,0.07)] sm:max-h-[90vh]"
              style={{ backgroundColor: '#FFFFFF' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                data-cursor="hand"
                onClick={() => setOpenFeaturedPopup(false)}
                className="absolute right-[max(0.25rem,env(safe-area-inset-right))] top-[max(0.25rem,env(safe-area-inset-top))] z-10 rounded-full p-3 text-ink/60 transition-colors hover:bg-ink/10 hover:text-ink md:p-4"
                aria-label="Close"
              >
                <X size={18} />
              </button>
              <div className="border-b border-ink/10 px-4 pb-5 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-12 sm:px-6 sm:pb-6 sm:pt-6">
                <h2 className="mb-5 pr-12 sm:mb-7">
                  Designing systems across teams and contexts
                </h2>
                <div className="mb-4 -mx-4 h-px bg-ink/10 sm:-mx-6" aria-hidden />
                <div
                  className="flex gap-1.5 overflow-x-auto overflow-y-visible py-0.5 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] sm:flex-wrap sm:overflow-visible [&::-webkit-scrollbar]:hidden"
                  role="tablist"
                  aria-label="Featured projects"
                >
                  {FEATURED_PROJECTS.map((project, index) => (
                    <button
                      key={project.id}
                      type="button"
                      role="tab"
                      data-cursor="hand"
                      aria-selected={selectedFeaturedIndex === index}
                      aria-controls={`featured-panel-${project.id}`}
                      id={`featured-tab-${project.id}`}
                      onClick={() => setSelectedFeaturedIndex(index)}
                      className={`shrink-0 rounded-md px-3 py-1.5 font-body text-[15px] font-medium leading-snug tracking-[var(--tracking-body)] transition-colors sm:px-3.5 sm:py-2 ${
                        selectedFeaturedIndex === index
                          ? 'border border-ink/18 bg-white text-ink shadow-[0_1px_0_rgba(20,20,20,0.04)]'
                          : 'border border-transparent bg-ink/[0.04] text-ink/75 hover:bg-ink/[0.07] hover:text-ink'
                      }`}
                    >
                      {project.title}
                    </button>
                  ))}
                </div>
              </div>
              <div className="modal-scroll min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-y-contain px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-7 [-webkit-overflow-scrolling:touch] sm:px-8 sm:pb-8 sm:pt-9">
                {FEATURED_PROJECTS.map((project, index) => (
                  <div
                    key={project.id}
                    id={`featured-panel-${project.id}`}
                    role="tabpanel"
                    aria-labelledby={`featured-tab-${project.id}`}
                    hidden={selectedFeaturedIndex !== index}
                    className={selectedFeaturedIndex !== index ? 'hidden' : ''}
                  >
                    {/* Body text first */}
                    <dl className="editorial-meta mb-10 max-w-xl space-y-7">
                      {'role' in project && project.role && (
                        <div>
                          <dt className="mb-2 scroll-mt-2 font-heading text-[length:var(--text-h3)] text-[var(--color-heading-h3)]">My role</dt>
                          <dd className="editorial-body mb-0">{project.role}</dd>
                        </div>
                      )}
                      {'scope' in project && project.scope && (
                        <div>
                          <dt className="mb-2 scroll-mt-2 font-heading text-[length:var(--text-h3)] text-[var(--color-heading-h3)]">Scope</dt>
                          <dd className="editorial-body mb-0 whitespace-pre-line">{project.scope}</dd>
                        </div>
                      )}
                      {(() => {
                        const scopeTools = (project as { scopeTools?: string | null }).scopeTools;
                        return scopeTools ? (
                          <div>
                            <dt className="mb-2 scroll-mt-2 font-heading text-[length:var(--text-h3)] text-[var(--color-heading-h3)]">Tools</dt>
                            <dd className="editorial-body mb-0">{scopeTools}</dd>
                          </div>
                        ) : null;
                      })()}
                      {'scopeHighlights' in project && project.scopeHighlights && project.scopeHighlights.length > 0 && (
                        <div>
                          <dt className="mb-2 scroll-mt-2 font-heading text-[length:var(--text-h3)] text-[var(--color-heading-h3)]">Scope</dt>
                          <dd className="editorial-body mb-0 space-y-2">
                            {project.scopeHighlights.map((item, i) => (
                              <p key={i} className="mb-0">{item}</p>
                            ))}
                          </dd>
                        </div>
                      )}
                      <div>
                        <dt className="mb-2 scroll-mt-2 font-heading text-[length:var(--text-h3)] text-[var(--color-heading-h3)]">Impact</dt>
                        <dd className="editorial-body mb-0">
                          {Array.isArray(project.impact) ? (
                            <p className="mb-0 whitespace-pre-line">
                              {project.impact.join('\n')}
                            </p>
                          ) : (
                            <p className="mb-0">{project.impact}</p>
                          )}
                        </dd>
                      </div>
                      {'skills' in project && project.skills && (
                        <div>
                          <dt className="mb-2 scroll-mt-2 font-heading text-[length:var(--text-h3)] text-[var(--color-heading-h3)]">Skills</dt>
                          <dd className="editorial-body mb-0 whitespace-pre-line">{project.skills}</dd>
                        </div>
                      )}
                    </dl>

                    {/* Media: Amazon = 3 ZoomInWindow blocks. Covantis = 1 ZoomInWindow (hero + grid). */}
                    <div className="space-y-9 border-t border-ink/10 pt-9">
                      {getFeaturedMediaItems(project).map((item, i) => {
                        const isAmazon = project.id === 'amazon';
                        const isCovantis = project.id === 'covantis';
                        const isAjediam = project.id === 'ajediam';
                        const isAmazonTopWindow = isAmazon && i === 0;
                        const isFirstWindow = isAmazon && i === 1;
                        const isAmazonGalleryWindow = isAmazon && i === 2;
                        const isAjediamRebranding = isAjediam && i === 0;
                        const isAjediamMergedFirstSecond = isAjediam && i === 1;
                        const isAjediamThirdWindow = isAjediam && i === 2;
                        const isCovantisWindow = isCovantis && i === 0;
                        const ajediamHeroSrc = isAjediam && i < AJEDIAM_HERO_IMAGES.length ? AJEDIAM_HERO_IMAGES[i] : null;
                        const heroImage = (arr: GalleryImage[]) =>
                          arr.find((img): img is { src: string; isHero?: boolean } => 'src' in img && !!img.isHero)?.src ?? arr.find((img): img is { src: string } => 'src' in img)?.src ?? null;
                        const amazonTopHeroSrc =
                          isAmazonTopWindow && AMAZON_TOP_WINDOW_IMAGES.length > 0 ? heroImage(AMAZON_TOP_WINDOW_IMAGES) : null;
                        const firstWindowHeroSrc = isFirstWindow && AMAZON_FIRST_CAROUSEL_IMAGES.length > 0 ? heroImage(AMAZON_FIRST_CAROUSEL_IMAGES) : null;
                        const amazonGalleryHeroSrc =
                          isAmazonGalleryWindow && AMAZON_GALLERY_IMAGES.length > 0 ? heroImage(AMAZON_GALLERY_IMAGES) : null;
                        const covantisHeroSrc = isCovantisWindow && COVANTIS_GALLERY_IMAGES.length > 0 ? heroImage(COVANTIS_GALLERY_IMAGES) : null;
                        const imageBlock = (
                          <div className="media-window-content bg-ink/5 flex items-center justify-center overflow-hidden">
                            {amazonTopHeroSrc ? (
                              <img
                                src={amazonTopHeroSrc}
                                alt=""
                                className="w-full h-full object-cover object-center"
                              />
                            ) : firstWindowHeroSrc ? (
                              <img
                                src={firstWindowHeroSrc}
                                alt=""
                                className="w-full h-full object-cover object-center"
                              />
                            ) : amazonGalleryHeroSrc ? (
                              <img
                                src={amazonGalleryHeroSrc}
                                alt=""
                                className="w-full h-full object-cover object-center"
                              />
                            ) : covantisHeroSrc ? (
                              <img
                                src={covantisHeroSrc}
                                alt=""
                                className="w-full h-full object-cover object-center"
                              />
                            ) : ajediamHeroSrc ? (
                              <img
                                src={ajediamHeroSrc}
                                alt=""
                                className="w-full h-full object-cover object-center"
                              />
                            ) : (
                              <span className="label text-ink/50 text-center px-4">Project visual placeholder</span>
                            )}
                          </div>
                        );
                        const captionBlock = (
                          <>
                            <span className="editorial-media-note mb-2 block">{item.note}</span>
                            <p className="editorial-body mb-0 whitespace-pre-line">
                              {item.caption}
                            </p>
                          </>
                        );
                        if (isAmazonTopWindow) {
                          return (
                            <ZoomInWindow
                              key={i}
                              galleryImages={AMAZON_TOP_WINDOW_IMAGES}
                              projectTitle="Amazon"
                              subtitle="My contribution (Alexa+, 2025)"
                              caption={captionBlock}
                            >
                              {imageBlock}
                            </ZoomInWindow>
                          );
                        }
                        if (isFirstWindow) {
                          return (
                            <ZoomInWindow
                              key={i}
                              galleryImages={AMAZON_FIRST_CAROUSEL_IMAGES}
                              projectTitle="Amazon"
                              subtitle="My contribution (DBS, 2024)"
                              caption={captionBlock}
                            >
                              {imageBlock}
                            </ZoomInWindow>
                          );
                        }
                        if (isAmazonGalleryWindow) {
                          return (
                            <ZoomInWindow
                              key={i}
                              galleryImages={AMAZON_GALLERY_IMAGES}
                              projectTitle="Amazon"
                              subtitle="My contribution (DBS, 2024)"
                              caption={captionBlock}
                            >
                              {imageBlock}
                            </ZoomInWindow>
                          );
                        }
                        if (isAjediamRebranding) {
                          return (
                            <ZoomInWindow
                              key={i}
                              galleryImages={AJEDIAM_REBRANDING_IMAGES}
                              projectTitle="Ajediam"
                              subtitle="My contribution"
                              caption={captionBlock}
                            >
                              {imageBlock}
                            </ZoomInWindow>
                          );
                        }
                        if (isAjediamMergedFirstSecond) {
                          return (
                            <ZoomInWindow
                              key={i}
                              galleryImages={AJEDIAM_MERGED_FIRST_SECOND_IMAGES}
                              heroFit="contain"
                              projectTitle="Ajediam"
                              subtitle="My contribution"
                              caption={captionBlock}
                            >
                              {imageBlock}
                            </ZoomInWindow>
                          );
                        }
                        if (isAjediamThirdWindow) {
                          return (
                            <ZoomInWindow
                              key={i}
                              galleryImages={AJEDIAM_THIRD_WINDOW_IMAGES}
                              heroFit="contain"
                              projectTitle="Ajediam"
                              subtitle="My contribution"
                              caption={captionBlock}
                            >
                              {imageBlock}
                            </ZoomInWindow>
                          );
                        }
                        if (isCovantisWindow) {
                          return (
                            <ZoomInWindow
                              key={i}
                              galleryImages={COVANTIS_GALLERY_IMAGES}
                              projectTitle="Covantis"
                              subtitle="My contribution"
                              caption={captionBlock}
                            >
                              {imageBlock}
                            </ZoomInWindow>
                          );
                        }
                        return (
                          <div key={i} className="w-full overflow-hidden rounded-md border border-ink/12">
                            {imageBlock}
                            <div className="border-t border-ink/10 bg-ink/[0.03] px-4 py-3">
                              {captionBlock}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Designing with AI — page view (gestalt: cards = title + image + caption per section) */}
      <AnimatePresence>
        {openDesigningAiPage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex flex-col bg-bg overflow-y-auto"
            style={{ backgroundColor: '#F8F9FA' }}
          >
            <MandalaPageHeader onBack={() => setOpenDesigningAiPage(false)} />

            {/* Main content — vertical flow, max-width for readability */}
            <main className="flex-1 px-5 py-10 pb-24 sm:px-8 md:px-12 md:py-12">
              <div className="editorial-container editorial-page">
                <section>
                  <h1 className="mb-5 leading-tight md:mb-6">From complexity to clarity with AI</h1>
                </section>

                <section className="mt-16 border-t border-ink/10 pt-12 md:mt-20 md:pt-14">
                  <h2 className="mb-4 md:mb-5">Rapid sensemaking at scale</h2>
                  <p className="editorial-body mb-0 max-w-xl">
                    AI clusters themes, maps relationships, and turns messy inputs into frameworks—fast enough to steer product and service design without losing the thread.
                  </p>
                </section>

                <SectionRhythmDivider />

                <section className="mt-2">
                  <h2 className="mb-4 md:mb-5">From concept to functional product</h2>
                  <div className="max-w-xl space-y-5">
                    <p className="editorial-body mb-0">
                      Figma craft plus multi-agent workflows run end to end: ideation, analysis, and high-fidelity
                      prototypes—stress-tested on real projects.
                    </p>
                    <p className="editorial-body mb-0">
                      Teams move from rough concepts to working prototypes sooner: alternate directions, early tests,
                      fewer sunk costs before commit.
                    </p>
                    <p className="editorial-body mb-0">
                      Interfaces and system behaviors get exercised early; assumptions surface before engineering locks
                      in.
                    </p>
                  </div>
                </section>

                <SectionRhythmDivider />

                <section className="mt-2">
                  <h2 className="mb-4 md:mb-5">Exploring futures before building them</h2>
                  <div className="max-w-xl space-y-5">
                    <p className="editorial-body mb-0">
                      Prototypes simulate how a product behaves in the field—scenarios, risks, and tradeoffs surface
                      before code.
                    </p>
                    <p className="editorial-body mb-0">
                      Leaders see the system in motion first; decisions land with less guesswork.
                    </p>
                  </div>
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
            className="fixed inset-0 z-[200] flex flex-col bg-bg overflow-y-auto overflow-x-hidden"
            style={{ backgroundColor: '#F8F9FA' }}
          >
            <MandalaPageHeader onBack={() => setOpenAdoptPage(false)} banner={null} />

            <main className="flex-1 px-5 py-8 pb-[400px] sm:px-8 md:px-12 md:py-12">
              <div className="editorial-container adopt-case-study">
                {/* 1. Hero + Prototype (system architecture + validation as h3) */}
                <section>
                  <header className="mb-9 md:mb-11">
                    <h1 className="leading-[1.02] mb-8 md:mb-10">
                      Adopt-a-School
                    </h1>
                    <section className="adopt-meta-card" aria-label="Project metadata">
                      <dl className="adopt-meta">
                        <div>
                          <dt className="scroll-mt-4">Role</dt>
                          <dd className="adopt-body mb-0 max-w-prose">Service design, product design, research</dd>
                        </div>
                        <div>
                          <dt className="scroll-mt-4">Client</dt>
                          <dd className="adopt-body mb-0 max-w-prose">Backpack Brigade</dd>
                        </div>
                        <div>
                          <dt className="scroll-mt-4">Context</dt>
                          <dd className="adopt-body mb-0 max-w-prose">
                            12+ years fighting food insecurity—businesses and donors tied to Seattle schools for steady
                            support, not one-off drops.
                          </dd>
                        </div>
                        <div>
                          <dt className="scroll-mt-4">Scope</dt>
                          <dd className="adopt-body mb-0 max-w-prose">
                            Activation object, mobile flow, service frame—one fundraising system.
                          </dd>
                        </div>
                        <div>
                          <dt className="scroll-mt-4">Impact</dt>
                          <dd className="adopt-body mb-0 max-w-prose">
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
                      Prototype
                    </h2>
                    <div className="mb-8 md:mb-10 w-full min-w-0 overflow-hidden rounded-md border border-ink/[0.06] bg-ink/[0.015]">
                      <div className="relative h-[clamp(280px,56vh,640px)] min-h-[260px] w-full max-h-[640px] overflow-hidden sm:min-h-[300px]">
                        <img
                          src="/adopt-a-school/ARTD-C02-Device-011.jpg"
                          alt="Adopt-a-School prototype — device in context."
                          className="absolute left-1/2 top-1/2 h-[112%] w-[112%] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover object-[50%_46%]"
                          loading="eager"
                          decoding="async"
                        />
                      </div>
                    </div>
                    <div className="mb-11 max-w-xl space-y-4 md:mb-12">
                      <p className="adopt-body">
                        Two lines: physical discovery and digital—conversion, activation, support.
                      </p>
                      <p className="adopt-body">
                        One service frame:{' '}
                        <em>volunteers want past the warehouse, but paths stay unclear</em>.
                      </p>
                      <p className="adopt-body">
                        30+ volunteer interviews, 12+ interface sessions, 10+ field hours on the object.
                      </p>
                    </div>
                    <div className="mb-11 w-full min-w-0 md:mb-14">
                      <AdoptQuickScan />
                    </div>

                    <div className="pt-6 md:pt-8">
                      <h3
                        id="adopt-section-system"
                        className="mb-3 scroll-mt-6 font-heading text-[length:var(--text-h3)] text-[var(--color-heading-h3)] md:mb-4"
                      >
                        System architecture
                      </h3>
                      <p className="adopt-body mb-4 max-w-prose md:mb-4">
                        Warehouse and business anchor the mission; discovery, digital, and support orbit as linked
                        states—cycles, not a top-down funnel.
                      </p>
                      <div className="relative isolate z-0 mt-1 mb-10 w-full min-w-0 md:mb-12">
                        <div className="w-full rounded-md border border-ink/[0.07] bg-[rgb(250,250,249)] p-1.5 shadow-[0_1px_0_rgba(20,20,20,0.04)] sm:p-2">
                          <div className="relative m-0 aspect-video w-full min-h-[480px] overflow-visible md:min-h-[520px]">
                            <AdoptSystemDiagram />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-ink/[0.08] pt-10 md:pt-12">
                      <h2
                        id="adopt-section-validation"
                        className="mb-5 scroll-mt-6 md:mb-6"
                      >
                        Validation
                      </h2>
                      <p className="adopt-body mb-8 max-w-xl">
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
                  <p className="adopt-body mb-8 max-w-xl">
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
                          data-cursor="hand"
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
                  <div className="mb-10 max-w-xl space-y-5 md:mb-12">
                    <p className="adopt-body">
                      The org grew organically for years—design had to fit how the team already works, not pretend a
                      greenfield rebuild.
                    </p>
                    <p className="adopt-body">
                      Strong systems often come from tight constraints. New pathways had to extend reach without
                      replacing operations.
                    </p>
                    <p className="adopt-body">
                      The product is not only screens—it is people, places, and repeatable behaviors wired together.
                    </p>
                  </div>

                  <h3 className="mb-4 font-heading md:mb-5">Future opportunities</h3>
                  <div className="mb-10 max-w-xl space-y-5 md:mb-12">
                    <p className="adopt-body">
                      Refined activation objects in community settings; clearer scan moments at first touch.
                    </p>
                    <p className="adopt-body">
                      Tiered sponsorship for businesses and recurring donors—structured without feeling transactional.
                    </p>
                    <p className="adopt-body">
                      Tighter loops between schools and supporters: stories, impact signals, food preference feedback.
                    </p>
                  </div>

                  <h3 id="adopt-section-impact" className="mb-4 scroll-mt-6 font-heading md:mb-5">
                    Real-world impact
                  </h3>
                  <div className="max-w-xl space-y-5">
                    <p className="adopt-body">
                      A decade of ops knowledge, folded into a participation framework—community and businesses support
                      schools through moments embedded in everyday places, not only the warehouse.
                    </p>
                    <p className="adopt-body">
                      Service and product design together: physical touchpoints, human activation, mobile flow—one
                      system.
                    </p>
                  </div>
                </section>

                <SectionRhythmDivider />

                <section>
                  <h2 className="mb-5 md:mb-6">Closing words</h2>
                  <div className="max-w-xl">
                    <p className="adopt-body">
                      Aim was a system communities could actually use to support kids in Seattle schools—not a
                      standalone interface exercise.
                    </p>
                  </div>
                </section>

                <div className="mt-12 md:mt-14">
                  <button
                    type="button"
                    data-cursor="hand"
                    aria-label="Back to top"
                    onClick={() =>
                      document.getElementById('adopt-case-study-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })
                    }
                    className="inline-flex items-center gap-2 text-link"
                  >
                    Back to top
                    <ArrowUp size={16} strokeWidth={2} aria-hidden />
                  </button>
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
            className="fixed inset-0 z-[200] flex flex-col bg-bg overflow-y-auto"
            style={{ backgroundColor: '#F8F9FA' }}
          >
            <MandalaPageHeader onBack={() => setOpenTouchpointsPage(false)} />

            <main className="flex-1 px-5 py-10 pb-24 sm:px-8 md:px-12 md:py-12">
              <div className="editorial-container editorial-page">
                <section>
                  <h1 className="mb-5 leading-tight md:mb-6">
                    Brand identity in
                    <br />
                    the real world
                  </h1>
                  <p className="editorial-body mb-0 max-w-xl">
                    How brand values become strategy, then products—human, legible, intentional.
                  </p>
                </section>

                <section className="mt-16 border-t border-ink/10 pt-12 md:mt-20 md:pt-14">
                  <h2 className="mb-4 md:mb-5">
                    Elevating the unboxing
                    <br />
                    experience of jewelry customers
                  </h2>
                  <p className="editorial-body mb-6 max-w-xl">
                    Care infographics and reward brochures in the box—unboxing delight up ~30%.
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
                  <p className="editorial-body mb-6 max-w-xl">
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
                  <p className="editorial-body mb-6 max-w-xl">
                    Contemporary Asian type, calligraphy, custom illustration, secondary face—built for launch and
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

      {/* Section: Designing with AI */}
      <section className="border-b border-ink/20 bg-bg p-6 pt-10 md:px-12 md:pb-14 md:pt-12" style={{ backgroundColor: '#F8F9FA' }} aria-labelledby="designing-ai-heading">
        <div className="editorial-container">
        <h2 id="designing-ai-heading" className="mb-3 md:mb-4">Designing with AI</h2>
        <p className="editorial-body mb-6 max-w-xl">
          AI in research, layout, and prototype loops—where it saves time without diluting judgment.
        </p>
        <button type="button" data-cursor="hand" className="text-link" onClick={() => setOpenDesigningAiPage(true)}>
          Learn more
        </button>
        </div>
      </section>

      {/* Section: Design Across Touchpoints */}
      <section className="border-b border-ink/20 bg-bg p-6 pt-10 md:px-12 md:pb-14 md:pt-12" style={{ backgroundColor: '#F8F9FA' }} aria-labelledby="touchpoints-heading">
        <div className="editorial-container">
        <h2 id="touchpoints-heading" className="mb-3 md:mb-4">
          Brand-driven product
          <br />
          strategy across touchpoints
        </h2>
        <p className="editorial-body mb-6 max-w-xl">
          Brand principles turned into systems—same voice across touchpoints, less drift, fewer one-off fixes.
        </p>
        <button type="button" data-cursor="hand" className="text-link" onClick={() => setOpenTouchpointsPage(true)}>
          View brand identity
        </button>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-bg p-6 pt-10 md:px-12 md:pb-14 md:pt-12" style={{ backgroundColor: '#F8F9FA' }} aria-labelledby="about-heading">
        <div className="editorial-container">
          <h2 id="about-heading" className="mb-4 md:mb-5">
            International perspective<br />
            shapes my design
          </h2>
          <div className="max-w-xl space-y-5">
            <p className="editorial-body mb-0">
              Latin American and European roots—context and tone read differently; design has to track both.
            </p>
            <p className="editorial-body mb-0">
              Fast adaptation, direct curiosity with people, open problems before solutions.
            </p>
            <p className="editorial-body mb-0">
              Off the clock: paint, draw, move, outdoors, time with my wife, cats, friends.
            </p>
          </div>
        </div>
      </section>

      <Footer id="site-footer" />
      </main>
    </div>
  );
}
