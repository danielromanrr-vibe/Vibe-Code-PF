import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronDown, ArrowUp } from 'lucide-react';
import Mandala from './components/Mandala';
import CustomCursor from './components/CustomCursor';
import Footer from './components/Footer';
import AdoptCaseStudyMedia, { KeyInteractionParallaxMedia } from './components/AdoptCaseStudyMedia';
import ZoomInWindow from './components/ZoomInWindow';
import MandalaPageHeader from './components/MandalaPageHeader';
import AdoptSystemDiagram from './components/AdoptSystemDiagram';
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
    'Backpack Brigade is an NGO combating food insecurity for over 12 years. We designed a system that connects local businesses and donors with Seattle schools to sustain ongoing food support for students.',
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
          'Collaborated with art director and cross-functional team:\n• Extend brand guidelines while pushing the creative envelope\n• Apply simple, recognizable UX patterns for clarity and speed\n• Maintain and optimize core UI components (e.g., speech bubbles)',
      },
      {
        note: 'My contribution (DBS, 2024)',
        caption:
          '• Expanded lifestyle imagery use across traffic ad placements\n• Built AI-assisted workflows with Firefly and internal tools\n• Enabled scalable visual variation while preserving quality',
      },
      {
        note: 'My contribution (DBS, 2024)',
        caption:
          '• Defined agile roadmaps aligning stakeholders on high-visibility campaigns while scaling emerging production workflows.\n• Advocated for stronger visual direction through clear design rationale and cross-team dialogue.',
      },
    ],
    role: null,
    scope: 'Partnered cross-functionally with product managers, marketers, and engineers to align design direction with business goals, ensuring campaigns were scalable, impactful, and user-centered.',
    scopeTools: null,
    impact: [
      '• Boosted production efficiency by 50% at DBS by supporting the testing and rollout of Figma adoption under tight deadlines.',
      '• Delivered creatives across multiple digital formats by evolving templates and style guides for diverse product lines and high-visibility campaigns (Prime Day 2024, Big Deal Days).',
      '• Tested, validated, and piloted new production workflows as part of the AI Foundation team.',
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
          'Led the website redesign for look and feel and interaction techniques, and collaborated with copywriters to align design with SEO strategy.',
      },
    ],
    role: null,
    scope:
      '• Aligned stakeholders on a creative direction that reinforced the company’s tech-forward positioning\n• Extended the existing brand system to support the website redesign\n• Collaborated with peers to evolve the Figma design system and maintain consistency across the product',
    impact: [
      '• Evolved the platform’s design system and website UX architecture.',
      '• Improved demo-to-adoption conversion ~20% through clearer product storytelling.',
      '• SEO + UX saw organic traffic rise ~85% in 3 months after adopting improved usability and page experience.',
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
          'Established creative direction for product photoshoots and digital artifacts used across multiple user interfaces',
      },
      {
        note: 'My contribution',
        caption:
          '• Applied the new brand system across multiple user interfaces.\n• Designed and validated user experience prototypes for product pages and online tools',
      },
    ],
    role: null,
    scope: null,
    scopeTools: null,
    scopeHighlights: [
      '• Established the core design foundations, including visual language, typography system, and brand framework—as part of the company-wide rebrand',
      '• Built a scalable design system supporting consistent experiences across product interfaces, marketing surfaces, and the redesigned website',
      '• Defined reusable UI patterns and interaction standards to support product scalability',
    ],
    impact: [
      'Led a brand and product experience redesign that grew daily active users from 150 to 400+ by 2024 and improved average user retention by +24.62%',
      '• Introduced a shared design system that unified product, marketing, and web experiences under a single visual framework',
      '• Enabled faster design and development cycles through reusable design foundations and standardized UI patterns',
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
  const [openAdoptPopup, setOpenAdoptPopup] = useState(false);
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
    if (openAdoptPopup) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [openAdoptPopup]);

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

      <main className="relative z-20">
      {/* Hero: mandala anchor first, then Mandala (so #mandala-home exists when Mandala mounts) */}
      <section className="relative h-[60vh] md:h-[70vh] flex flex-col border-b border-ink/20 bg-transparent" aria-label="Hero">
        <div id="mandala-home" className="absolute inset-0 -z-10" aria-hidden />
        <Mandala variant="heroIntegrated" />
        <header className="relative z-20 flex min-h-0 min-w-0 flex-1 items-center justify-center p-4 sm:p-6 md:p-12 pointer-events-none">
          <div className="editorial-container px-2 text-center sm:px-4 md:px-0">
            <p className="label hero-header-kicker mb-1.5 block !opacity-100 text-ink">
              Visual product designer
            </p>
            <h1 className="hero-title relative mx-auto max-w-full text-balance">
              Building systems that scale real experiences
            </h1>
          </div>
        </header>
      </section>

      {/* Section 1: Highlights — h1 + Component 1 (case study) + Component 1.1 (featured work) */}
      <section className="p-6 md:p-12 bg-bg border-b border-ink/20" style={{ backgroundColor: '#F8F9FA' }} aria-labelledby="highlights-heading">
        <div className="editorial-container">
        <h2 id="highlights-heading" className="mb-12">
          Highlights
        </h2>

        {/* Component 1: Case study — View case study → pop up */}
        <div className="mb-16 w-full" data-cursor="hand">
          <motion.div
            whileHover={{ y: -4 }}
            className="group relative border border-ink rounded-xl !bg-card p-8 flex flex-col justify-between min-h-[280px] shadow-[0_2px_8px_rgba(20,20,20,0.06),0_4px_16px_rgba(20,20,20,0.05)] hover:shadow-[0_4px_12px_rgba(20,20,20,0.08),0_8px_24px_rgba(20,20,20,0.06)] transition-all duration-300 cursor-pointer"
            onClick={() => setOpenAdoptPopup(true)}
          >
            <div>
              <h3 className="mb-4 font-heading">{ADOPT_A_SCHOOL.title}</h3>
              <p className="text-ink/85 leading-relaxed max-w-2xl">
                {ADOPT_A_SCHOOL.cardTeaser}
              </p>
            </div>
            <button
              type="button"
              data-cursor="hand"
              className="mt-4 text-link"
              onClick={(e) => { e.stopPropagation(); setOpenAdoptPopup(true); }}
            >
              View case study
            </button>
          </motion.div>
        </div>

        {/* Component 1.1: Working with cross-functional teams — View featured work → pop up */}
        <div className="mb-16 w-full" data-cursor="hand">
          <motion.div
            whileHover={{ y: -4 }}
            className="group relative border border-ink rounded-xl !bg-card p-8 flex flex-col justify-between min-h-[280px] shadow-[0_2px_8px_rgba(20,20,20,0.06),0_4px_16px_rgba(20,20,20,0.05)] hover:shadow-[0_4px_12px_rgba(20,20,20,0.08),0_8px_24px_rgba(20,20,20,0.06)] transition-all duration-300 cursor-pointer"
            onClick={() => setOpenFeaturedPopup(true)}
          >
            <div>
              <h3 className="mb-4 font-heading">Working with cross-functional teams</h3>
              <p className="text-ink/85 leading-relaxed">
                At <span className="font-bold text-ink">Amazon DBS</span>, piloted new workflows in real-world environments, contributing to a 50% increase in production efficiency. At <span className="font-bold text-ink">Amazon Alexa+</span>, evolved the design system across 30+ pages while maintaining shared stakeholder documentation. At <span className="font-bold text-ink">Covantis</span>, increased demo-to-adoption by 20% through a website redesign aligned with the product&apos;s value proposition. At <span className="font-bold text-ink">Ajediam</span>, as founding designer, helped grow the startup from 50 to 400+ daily users, increasing return rate by 24% within a year.
              </p>
            </div>
            <button
              type="button"
              data-cursor="hand"
              className="mt-4 text-link"
              onClick={(e) => { e.stopPropagation(); setOpenFeaturedPopup(true); }}
            >
              View featured work
            </button>
          </motion.div>
        </div>
        </div>
      </section>

      {/* Adopt a School pop-up — content from Case study pop-up PDF */}
      <AnimatePresence>
        {openAdoptPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            onClick={() => setOpenAdoptPopup(false)}
          >
            <div className="absolute inset-0 bg-ink/40" aria-hidden />
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="relative w-full max-w-2xl bg-white border border-ink rounded-xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
              style={{ backgroundColor: '#FFFFFF' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                data-cursor="hand"
                onClick={() => setOpenAdoptPopup(false)}
                className="absolute top-0 right-0 z-10 p-3 md:p-4 rounded-full text-ink/60 hover:text-ink hover:bg-ink/10 transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
              <div className="p-8 pt-14 overflow-y-auto flex-1 min-h-0">
                <div className="min-w-0">
                  <dl className="space-y-6 text-ink/90">
                    <div>
                      <dt className="label mb-1">Adopt-a-School program</dt>
                      <dd className="leading-relaxed font-body text-[length:var(--text-body)]">A community donation system designed to help Backpack Brigade scale its Adopt-a-School program by structuring how donors, volunteers, and partner schools participate.</dd>
                    </div>
                    <div>
                      <dt className="label mb-1">Impact</dt>
                      <dd className="leading-relaxed font-body text-[length:var(--text-body)]">Designed a scalable engagement framework that translates 12+ years of operational knowledge into a repeatable program model, unlocking a major recurring revenue stream for the organization.</dd>
                    </div>
                    <div>
                      <dt className="label mb-1">Scope</dt>
                      <dd className="leading-relaxed font-body text-[length:var(--text-body)]">
                        Service and product design of a system that empowers Backpack Brigade volunteers to turn local businesses into hosts of the organization&apos;s mission through a physical installation and tailored digital tools that guide people through a participation funnel—from QR discovery to program learning and donation.
                      </dd>
                    </div>
                  </dl>
                  <button
                    type="button"
                    data-cursor="hand"
                    onClick={() => {
                      setOpenAdoptPopup(false);
                      setOpenAdoptPage(true);
                    }}
                    className="mt-6 text-link"
                  >
                    Explore the system
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              className="relative flex min-h-0 w-full max-w-2xl max-h-[min(90vh,90dvh)] flex-col overflow-hidden rounded-xl border border-ink bg-white shadow-xl sm:max-h-[90vh]"
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
              <div className="border-b border-ink/20 px-4 pb-4 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-12 sm:px-6 sm:pb-6 sm:pt-6">
                <div
                  className="flex gap-2 overflow-x-auto overflow-y-visible py-0.5 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] sm:flex-wrap sm:overflow-visible [&::-webkit-scrollbar]:hidden"
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
                      className={`shrink-0 rounded-lg px-3 py-2 !font-heading text-[length:var(--text-h3)] font-semibold leading-[1.3] tracking-[-0.01em] text-[var(--color-heading-h3)] transition-colors sm:px-4 ${
                        selectedFeaturedIndex === index
                          ? 'border border-ink bg-white'
                          : 'border border-transparent bg-ink/5 opacity-70 hover:opacity-100'
                      }`}
                    >
                      {project.title}
                    </button>
                  ))}
                </div>
              </div>
              <div className="min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-y-contain px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-6 [-webkit-overflow-scrolling:touch] sm:px-8 sm:pb-8 sm:pt-8">
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
                    <dl>
                      {'role' in project && project.role && (
                        <div className="mb-4">
                          <dt className="label text-ink/60 mb-1">My role</dt>
                          <dd className="text-ink/90 leading-relaxed font-body text-[length:var(--text-body)]">{project.role}</dd>
                        </div>
                      )}
                      {'scope' in project && project.scope && (
                        <div className="mb-6">
                          <dt className="label text-ink/60 mb-1">Scope</dt>
                          <dd className="whitespace-pre-line text-ink/90 leading-relaxed font-body text-[length:var(--text-body)]">{project.scope}</dd>
                        </div>
                      )}
                      {(() => {
                        const scopeTools = (project as { scopeTools?: string | null }).scopeTools;
                        return scopeTools ? (
                          <div className="mb-6">
                            <dt className="label text-ink/60 mb-1">Tools</dt>
                            <dd className="text-ink/90 leading-relaxed font-body text-[length:var(--text-body)]">{scopeTools}</dd>
                          </div>
                        ) : null;
                      })()}
                      {'scopeHighlights' in project && project.scopeHighlights && project.scopeHighlights.length > 0 && (
                        <div className="mb-6">
                          <dt className="label text-ink/60 mb-2">Scope</dt>
                          <dd className="text-ink/90 leading-relaxed space-y-2 font-body text-[length:var(--text-body)]">
                            {project.scopeHighlights.map((item, i) => (
                              <p key={i}>{item}</p>
                            ))}
                          </dd>
                        </div>
                      )}
                      <div className="mb-6">
                        <dt className="label text-ink/60 mb-2">Impact</dt>
                        <dd className="text-ink/90 font-body text-[length:var(--text-body)]">
                          {Array.isArray(project.impact) ? (
                            <p className="whitespace-pre-line leading-relaxed">
                              {project.impact.join('\n')}
                            </p>
                          ) : (
                            <p className="leading-relaxed">{project.impact}</p>
                          )}
                        </dd>
                      </div>
                      {'skills' in project && project.skills && (
                        <div className="mb-8">
                          <dt className="label text-ink/60 mb-1">Skills</dt>
                          <dd className="text-ink/90 leading-relaxed whitespace-pre-line font-body text-[length:var(--text-body)]">{project.skills}</dd>
                        </div>
                      )}
                    </dl>

                    {/* Media: Amazon = 3 ZoomInWindow blocks. Covantis = 1 ZoomInWindow (hero + grid). */}
                    <div className="space-y-8">
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
                            <span className="label mb-1 block text-ink/60">{item.note}</span>
                            <p className="whitespace-pre-line text-ink/85 leading-relaxed font-body text-[length:var(--text-body)]">
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
                          <div key={i} className="w-full rounded-lg overflow-hidden border border-ink/20">
                            {imageBlock}
                            <div className="border-t border-ink/20 bg-ink/5 px-4 py-3">
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
            <main className="flex-1 p-6 md:p-12 pb-24">
              <div className="editorial-container">
                <section>
                  <h1 className="mb-4 leading-tight">From complexity to clarity with AI</h1>
                </section>

                <section className="mt-24 md:mt-[7.5rem]">
                  <h2 className="mb-4">Rapid sensemaking at scale</h2>
                  <p className="text-ink/85 leading-relaxed">
                    AI helps me organize and synthesize complex information quickly. By clustering ideas, identifying recurring themes, and mapping relationships, I can turn raw inputs into structured frameworks that guide product and service design.
                  </p>
                </section>

                <SectionRhythmDivider />

                <section>
                  <h2 className="mb-4">From concept to functional product</h2>
                  <div className="space-y-4 text-ink/85 leading-relaxed">
                    <p>
                      Having had the opportunity to learn and stress-test AI workflows, I use my Figma superpowers and multi-agent AI-assisted design thinking throughout the entire process—from ideation to data analysis to high-fidelity, AI-based prototyping for digital products.
                    </p>
                    <p>
                      AI helps explore ideas quickly, generate alternative directions, and test concepts before committing resources. This allows teams to move from rough concepts to functional prototypes much faster.
                    </p>
                    <p>
                      By rapidly prototyping interactions, interfaces, and system behaviors, I can validate assumptions early and refine product direction through iteration.
                    </p>
                  </div>
                </section>

                <SectionRhythmDivider />

                <section>
                  <h2 className="mb-4">Exploring futures before building them</h2>
                  <div className="space-y-4 text-ink/85 leading-relaxed">
                    <p>
                      I design prototypes that simulate how a product or service might behave in real-world conditions. These prototypes allow teams to explore scenarios, identify risks, and evaluate opportunities before development begins.
                    </p>
                    <p>
                      This approach helps leaders make more confident decisions by seeing how a system might work before it is built.
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
            <MandalaPageHeader onBack={() => setOpenAdoptPage(false)} />

            <main className="flex-1 p-6 md:p-12 pb-[400px]">
              <div className="editorial-container">
                {/* 1. Hero */}
                <section>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 md:items-stretch">
                    <div className="min-w-0">
                      <h1 className="leading-tight mb-8 md:mb-10">
                        Adopt-a-School
                      </h1>
                      <dl className="space-y-5 text-ink/85">
                        <div>
                          <dt className="label mb-1 text-ink/60">Role</dt>
                          <dd className="leading-relaxed font-body text-[length:var(--text-body)]">Service Design, Product Design, and Research</dd>
                        </div>
                        <div>
                          <dt className="label mb-1 text-ink/60">Social impact org</dt>
                          <dd className="leading-relaxed font-body text-[length:var(--text-body)]">Backpack Brigade</dd>
                        </div>
                        <div>
                          <dt className="label mb-1 text-ink/60">Scope</dt>
                          <dd className="leading-relaxed font-body text-[length:var(--text-body)]">
                            Community fundraising system including physical activation object, mobile engagement flow, and service framework.
                          </dd>
                        </div>
                      </dl>
                    </div>
                    <div className="w-full min-h-0 max-md:aspect-video md:h-full">
                      <AdoptCaseStudyMedia
                        variant="tiltImage"
                        tiltImageSrc="/adopt-a-school/ARTD-C02-Device-011.jpg"
                        tiltImageImgClassName="h-full w-full min-h-[160px] md:min-h-0 object-cover object-center origin-center scale-[1.6875]"
                      />
                    </div>
                  </div>
                </section>

                <SectionRhythmDivider />

                {/* 2. Context */}
                <section>
                  <h2 className="mb-4">Context</h2>
                  <div className="space-y-4 text-ink/85 leading-relaxed mb-6 max-w-2xl">
                    <p>
                      Backpack Brigade is an NGO combating food insecurity for over 12 years. We designed a system that
                      connects local businesses and donors with Seattle schools to sustain ongoing food support for
                      students.
                    </p>
                  </div>
                  <h3 className="mb-4 font-heading">Design grounded in real community insight</h3>
                  <AdoptCaseStudyMedia variant="grid" />
                </section>

                <SectionRhythmDivider />

                {/* 3. Key insights */}
                <section>
                  <h2 className="mb-4">Key insights from research synthesis</h2>
                  <div className="space-y-4 text-ink/85 leading-relaxed">
                    <p>
                      Early interviews with stakeholders and volunteers revealed a clear insight: community members and local businesses wanted to contribute in ways that extended beyond the warehouse. Yet the organization lacked the structure, systems, and participation pathways needed to activate this potential beyond warehouse volunteering.
                    </p>
                  </div>
                </section>

                <SectionRhythmDivider />

                {/* 4. Strategic decisions */}
                <section>
                  <h2 className="mb-4">Strategic decisions</h2>
                  <p className="text-ink/85 leading-relaxed mb-6">
                    Designing a scalable social impact system required navigating organizational constraints, stakeholder values, and real-world behavior.
                  </p>
                  <div className="border border-ink/20 rounded-xl overflow-hidden divide-y divide-ink/20">
                    {[
                      {
                        title: 'Research access vs ethical organizational boundaries',
                        content: "Backpack Brigade's service formally ends when food leaves the warehouse, but research showed that some of the most meaningful friction emerged at the final stage: when food reaches schools, family social workers, and children. That part of the system was also the most sensitive. Direct access was limited, interviewing children was not appropriate, and family social workers sit outside Backpack Brigade's operational scope.\n\nRather than forcing access or delaying the project, I used proxy research methods: interviews with program managers, visual system mapping to identify where Backpack Brigade's presence disappeared, and role-playing sessions with leadership to simulate downstream pain points. This allowed the project to move forward responsibly while still surfacing a key insight: even without extending operations, Backpack Brigade could strengthen its presence at the end of the journey through better feedback loops, particularly around children's experience and food preferences.",
                      },
                      {
                        title: 'Revenue optimization vs founder philosophy',
                        content: "Research and prototyping suggested the system would perform better with clearer contribution logic at the moment of participation. The physical context and user behavior both indicated that donation specificity could significantly increase fundraising potential.\n\nHowever, the founder held a strong philosophy: participation should feel like joining a cause, not responding to a transactional prompt. Rather than overriding that perspective, I treated it as a real constraint. I validated the opportunity with the Director of Development and documented clearer contribution structures as a strategic recommendation. The decision was not just about product optimization, but about introducing change carefully inside a founder-led organization.",
                      },
                      {
                        title: 'Prototype fidelity vs delivery constraints',
                        content: "The prototyping phase required validating two very different layers simultaneously: a physical activation object and a full mobile engagement flow. Both were essential, but the timeline forced a prioritization decision.\n\nI focused fidelity where it would produce the clearest behavioral learning: the digital interaction flow and map-based participation logic. On the physical side, I accelerated development through rapid AI-assisted iteration and rough dimensional guidance for fabrication. This approach allowed the end-to-end system to be tested within the timeline while still producing a credible physical artifact. The trade-off was concentrating design precision where it would most improve the quality of validation.",
                      },
                      {
                        title: 'Artifact optimization vs system behavior',
                        content: "Testing the activation object revealed an important distinction. The object consistently attracted attention: people noticed it, touched it, and became curious. But scan behavior remained relatively low.\n\nThis raised a key question: continue refining the object, or reconsider the role it played in the system. The insight was that the artifact was succeeding as an ambient discovery trigger, not as the primary conversion mechanism. Conversion improved when staff lightly activated the moment of curiosity. This reframed the system: the object opens attention, while human interaction completes the loop.",
                      },
                    ].map((item, i) => (
                      <div key={i} className="bg-white">
                        <button
                          type="button"
                          data-cursor="hand"
                          onClick={() => setAdoptAccordionOpen(adoptAccordionOpen === i ? null : i)}
                          className="w-full flex justify-between items-center gap-4 p-6 text-left hover:bg-ink/5 transition-colors"
                          aria-expanded={adoptAccordionOpen === i}
                        >
                          <span className="pr-2 text-left font-body text-[length:var(--text-body)] leading-relaxed text-ink/85">
                            {item.title}
                          </span>
                          <ChevronDown
                            size={20}
                            className={`shrink-0 transition-transform text-ink/50 ${adoptAccordionOpen === i ? 'rotate-180' : ''}`}
                            aria-hidden
                          />
                        </button>
                        {adoptAccordionOpen === i && (
                          <div className="px-6 pt-4 pb-6 font-body text-[length:var(--text-body)] leading-relaxed text-ink/85 whitespace-pre-line">
                            {item.content}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                <SectionRhythmDivider />

                {/* 5. System architecture */}
                <section>
                  <h2 className="mb-4">System architecture</h2>
                  <p className="text-ink/85 leading-relaxed mb-6 max-w-prose">
                    The system connects physical discovery, human activation, and mobile participation through three coordinated layers.
                  </p>
                  {/* Full-bleed diagram — no extra vertical margin (rhythm = intro copy + SectionRhythmDivider only) */}
                  <div className="relative isolate z-0 m-0 block w-screen max-w-[100vw] left-1/2 -translate-x-1/2 overflow-x-hidden overflow-y-visible p-0">
                    <div className="relative m-0 aspect-video w-full min-h-[220px] overflow-visible">
                      <AdoptSystemDiagram />
                    </div>
                  </div>
                </section>

                <SectionRhythmDivider />

                {/* 6. Key interactions */}
                <section>
                  <h2 className="mb-4">Key interactions</h2>
                  <div className="flex flex-col">
                    <div className="pb-10">
                      <h3 className="mb-3 font-heading">QR Entry: Physical Discovery to System Participation</h3>
                      <div className="space-y-4 text-ink/85 leading-relaxed mb-4 max-w-2xl">
                        <p>
                          The Adopt-a-School experience begins with a physical discovery object placed in two environments:
                          participating businesses and the Backpack Brigade warehouse.
                        </p>
                        <p>
                          At businesses, the object introduces patrons to Backpack Brigade&apos;s mission. Scanning the QR
                          code opens a mobile page where users can donate. It also allows business-owner patrons to learn
                          about the program, explore nearby schools in need of support, and quickly join the network
                          through the website&apos;s onboarding interface.
                        </p>
                        <p>
                          At the warehouse, volunteers encounter the same object alongside informational posters.
                          Scanning the QR code leads them into the same mobile experience, where they can explore schools
                          and step into available volunteer routes.
                        </p>
                        <p>
                          A lightweight information page guides patrons, volunteers, and potential business partners
                          into the broader Adopt-a-School system.
                        </p>
                        <p>
                          The object acts as a shared gateway connecting awareness, donations, volunteer coordination,
                          and business participation through a single mobile entry point.
                        </p>
                      </div>
                      <KeyInteractionParallaxMedia
                        className="aspect-[4/3]"
                        innerClassName="rounded-lg border border-ink/20 bg-ink/5 overflow-hidden"
                      >
                        <img
                          src="/adopt-a-school/key-interaction-qr-entry.png?v=2"
                          alt="Person scanning the Adopt-a-School apple interaction object."
                          className="h-full w-full object-contain object-center"
                        />
                      </KeyInteractionParallaxMedia>
                    </div>
                    <div className="border-t border-ink/10 pt-10">
                      <h3 className="mb-5 font-heading">School adoption map</h3>
                      <div className="space-y-4 text-ink/85 leading-relaxed mb-4 max-w-2xl">
                        <p>
                          Within the Adopt-a-School experience, the map acts as the core exploration layer of the funnel.
                        </p>
                        <p>
                          After entering the experience through the discovery object and the information page, volunteers can
                          use the map to explore participating schools across the region. Each school marker reveals key
                          information about the program and the type of support needed, helping users quickly understand
                          where their help can have the greatest impact.
                        </p>
                        <p>
                          This interaction transforms the program&apos;s geographic footprint into a clear visual overview,
                          guiding users from initial curiosity toward meaningful participation.
                        </p>
                      </div>
                      <KeyInteractionParallaxMedia
                        hugContent
                        className="w-full"
                        innerClassName="overflow-hidden rounded-lg border border-ink/20 bg-black"
                      >
                        <video
                          className="block h-auto w-full max-w-full"
                          src="/adopt-a-school/school-adoption-map.mp4"
                          autoPlay
                          muted
                          loop
                          playsInline
                          aria-label="Screen recording of the school adoption map flow."
                        />
                      </KeyInteractionParallaxMedia>
                    </div>
                  </div>
                </section>

                <SectionRhythmDivider />

                <section>
                  <h2 className="mb-4">Reflection</h2>
                  <div className="space-y-4 text-ink/85 leading-relaxed mb-8 max-w-2xl">
                    <p>
                      Designing the Adopt-a-School system required balancing product opportunities with the realities of a nonprofit organization built through more than a decade of organic growth. Participation design in this context was shaped not only by user behavior, but also by operational boundaries and stakeholder philosophy.
                    </p>
                    <p>
                      One of the most valuable insights from the process was recognizing that effective systems often emerge from constraints. Rather than attempting to redesign Backpack Brigade&apos;s operations, the project focused on introducing participation pathways that could extend the organization&apos;s reach while remaining compatible with how the team already works.
                    </p>
                    <p>
                      The experience reinforced an important lesson: meaningful product systems are not only digital interfaces, but connections between people, environments, and behaviors that can scale responsibly.
                    </p>
                  </div>

                  <h3 className="mb-6 font-heading">Future opportunities</h3>
                  <div className="space-y-4 text-ink/85 leading-relaxed mb-8 max-w-2xl">
                    <p>
                      While the prototype validated the core participation model, several opportunities emerged to strengthen the system over time.
                    </p>
                    <p>
                      The discovery layer could evolve through more refined physical activation objects placed in community environments, improving curiosity and scan behavior at the moment of encounter. Participation pathways could also expand into tiered contribution models for businesses and recurring sponsors, allowing organizations to support schools in more structured ways.
                    </p>
                    <p>
                      Finally, deeper feedback loops between schools and supporters could strengthen the emotional connection within the system by sharing stories, impact updates, or food preferences from the communities being served.
                    </p>
                  </div>

                  <h3 className="mb-6 font-heading">Real-world impact</h3>
                  <div className="space-y-4 text-ink/85 leading-relaxed max-w-2xl">
                    <p>
                      By translating more than a decade of operational knowledge into a structured participation framework, the project outlines a pathway for Backpack Brigade to expand its impact beyond warehouse volunteering. The proposed system enables community members and local businesses to support schools through accessible participation moments embedded in everyday environments.
                    </p>
                    <p>
                      More broadly, the work demonstrates how service design and product design can work together to unlock latent potential within community organizations by aligning physical touchpoints, human activation, and mobile participation into a scalable community system.
                    </p>
                  </div>
                </section>

                <SectionRhythmDivider />

                <section>
                  <h2 className="mb-4">Closing words</h2>
                  <div className="space-y-4 text-ink/85 leading-relaxed max-w-2xl">
                    <p>
                      Ultimately, the goal of the project was not simply to design a new interface, but to create a system that allows communities to participate more easily in supporting the well-being of children across Seattle schools. The experience reinforced an important lesson: meaningful product systems are not only digital interfaces.
                    </p>
                  </div>
                </section>

                <div className="mt-10">
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

            <main className="flex-1 p-6 md:p-12 pb-24">
              <div className="editorial-container">
                <section>
                  <h1 className="mb-4 leading-tight">
                    Brand identity in
                    <br />
                    the real world
                  </h1>
                  <p className="text-ink/85 leading-relaxed max-w-2xl">
                    A walkthrough of how I translate brand values and visual identity into strategy, and into products that feel human, clear, and intentional.
                  </p>
                </section>

                <section className="mt-24 md:mt-[7.5rem]">
                  <h2 className="mb-4">
                    Elevating the unboxing
                    <br />
                    experience of jewelry customers
                  </h2>
                  <p className="text-ink/85 leading-relaxed mb-6">
                    By adding infographics for jewel care and brochures describing reward systems, we increased delight in the unboxing by 30%.
                  </p>
                  <div className="aspect-[4/3] bg-ink/5 border border-ink/20 rounded-lg overflow-hidden mb-4">
                    <img
                      src="/brand-identity-section1/MM_IndoorPoster_IP-D-031.jpg"
                      alt=""
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="aspect-[4/3] bg-ink/5 border border-ink/20 rounded-lg overflow-hidden mb-4">
                    <img
                      src="/brand-identity-section1/MM_Magazine_MZ-HTL-02.jpg"
                      alt=""
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <span className="label mt-2 block text-ink/60">Work for: Jewel care & unboxing</span>
                </section>

                <section className="mt-24 md:mt-[7.5rem]">
                  <h2 className="mb-4">
                    Designing a brand system
                    <br />
                    for a rap duo&apos;s merch
                  </h2>
                  <p className="text-ink/85 leading-relaxed mb-6">
                    We designed a logo to help this rap duo turn their name into wearable merch.
                  </p>
                  <div className="aspect-[4/3] bg-ink/5 border border-ink/20 rounded-lg overflow-hidden mb-4">
                    <img
                      src="/brand-identity-section2/MM_UrbanPoster_UP-SYDC-05.jpg"
                      alt=""
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="aspect-[4/3] bg-ink/5 border border-ink/20 rounded-lg overflow-hidden mb-4">
                    <img
                      src="/brand-identity-section2/Kamau-logo.png"
                      alt=""
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <span className="label mt-2 block text-ink/60">Work for: amau and the wolf</span>
                </section>

                <section className="mt-24 md:mt-[7.5rem]">
                  <h2 className="mb-4">
                    Researching visual languages for
                    <br />
                    distinctive and appropriate outcomes
                  </h2>
                  <p className="text-ink/85 leading-relaxed mb-6">
                    A brand system combining contemporary Asian typography, traditional calligraphy, custom illustrations, and a secondary typeface—designed for market launch and global expansion.
                  </p>
                  <div className="aspect-[4/3] bg-ink/5 border border-ink/20 rounded-lg overflow-hidden mb-4">
                    <img
                      src="/brand-identity-section3/spice-angel-jar.jpg"
                      alt=""
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <span className="label mt-2 block text-ink/60">Work for: Spice Angel</span>
                </section>
              </div>
            </main>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section: Designing with AI */}
      <section className="p-6 md:p-12 border-b border-ink/20 bg-bg" style={{ backgroundColor: '#F8F9FA' }} aria-labelledby="designing-ai-heading">
        <div className="editorial-container">
        <h2 id="designing-ai-heading" className="mb-4">Designing with AI</h2>
        <p className="text-ink/85 leading-relaxed max-w-2xl mb-6">
          Learn more about how I integrate AI across different areas of my workflows for improved efficiency and better outcomes.
        </p>
        <button type="button" data-cursor="hand" className="text-link" onClick={() => setOpenDesigningAiPage(true)}>
          Learn more
        </button>
        </div>
      </section>

      {/* Section: Design Across Touchpoints */}
      <section className="p-6 md:p-12 border-b border-ink/20 bg-bg" style={{ backgroundColor: '#F8F9FA' }} aria-labelledby="touchpoints-heading">
        <div className="editorial-container">
        <h2 id="touchpoints-heading" className="mb-4">
          Brand-driven product
          <br />
          strategy across touchpoints
        </h2>
        <p className="text-ink/85 leading-relaxed max-w-2xl mb-6">
          I help brands express their value consistently across customer interactions. By turning insights and brand principles into scalable visual design systems, I enable consistent, high-quality experiences.
        </p>
        <button type="button" data-cursor="hand" className="text-link" onClick={() => setOpenTouchpointsPage(true)}>
          View brand identity
        </button>
        </div>
      </section>

      {/* About Section */}
      <section className="p-6 md:p-12 bg-bg" style={{ backgroundColor: '#F8F9FA' }} aria-labelledby="about-heading">
        <div className="editorial-container">
          <h2 id="about-heading" className="mb-4">
            International perspective<br />
            shapes my design
          </h2>
          <div className="space-y-6 text-ink/90 leading-relaxed max-w-2xl">
            <p>
              Growing up across Latin American and European cultures shaped how I see the world and how I design.
            </p>
            <p>
              My journey has taught me to adapt quickly, and to approach people with empathy and curiosity, and to approach challenges or problems with openness.
            </p>
            <p>
              Outside of work, I paint, draw, exercise, spend time in nature, and hang out with my wife, our cats, and our friends.
            </p>
          </div>
        </div>
      </section>

      <Footer id="site-footer" />
      </main>
    </div>
  );
}
