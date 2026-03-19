import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, X, ChevronDown } from 'lucide-react';
import Mandala from './components/Mandala';
import CustomCursor from './components/CustomCursor';
import Footer from './components/Footer';
import AdoptCaseStudyMedia from './components/AdoptCaseStudyMedia';
import ZoomInWindow from './components/ZoomInWindow';
import MandalaPageHeader from './components/MandalaPageHeader';
import type { GalleryImage } from './components/EditorialGalleryModal';

const AMAZON_SELECTS_BASE = '/amazon-selects';
function amazonSelect(path: string, isHero?: boolean): GalleryImage {
  return { src: `${AMAZON_SELECTS_BASE}/${encodeURIComponent(path)}`, isHero };
}
const AMAZON_GALLERY_IMAGES: GalleryImage[] = [
  amazonSelect('Hero_2.png', true),
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
  cardTeaser: 'A community donation system designed for Backpack Brigade, an organisation combatting food insecurity based in Seattle, Wa.',
  whatIsThis: 'A community donation system designed for Backpack Brigade, an organisation combatting food insecurity based in Seattle, Wa.',
  whatWasShipped: 'A human-centered design-driven community donation system for Backpack Brigade, designed and validated through service blueprints and high-fidelity prototypes.',
  scope: [
    'Led the service and product design of a multi-channel engagement system connecting donors, volunteers, and partner schools.',
    'Designed three coordinated interaction layers: physical touchpoints in community spaces, staff-supported activation through volunteers, and a mobile learning and donation flow accessed via QR codes.',
    'Delivered service blueprints, engagement frameworks, and high-fidelity prototypes to validate the concept and prepare the program for implementation.',
  ],
  impact: 'Translated 12+ years of operational knowledge into a scalable Adopt-a-School engagement system, unlocking a major recurring revenue stream for Backpack Brigade through structured donor, volunteer, and school participation.',
  exploreHref: '#',
};

const AMAZON_HERO_STATICS = ['/Hero_1.png', '/amazon-static-2.png'] as const;

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

const AJEDIAM_HERO_IMAGES = [
  '/ajediam/hero-2.png', // storefront
  '/ajediam/hero-4.png', // 2nd = window hero (same as hero below)
  '/ajediam/hero-1.png', // get in touch
  '/ajediam/hero-3.png', // Koh-i-Noor detail
] as const;

const AJEDIAM_SECOND_WINDOW_IMAGES: GalleryImage[] = [
  { src: '/ajediam/hero-4.png', isHero: true },
  { src: '/ajediam/gallery-2.png' },
  { placeholder: true },
];

const FEATURED_PROJECTS = [
  {
    id: 'amazon',
    title: 'Amazon',
    media: [
      { title: 'What I owned in this visual', caption: 'My role and contribution in what you see here.' },
      { title: 'What I owned in this visual', caption: 'Another angle on my involvement in this project.' },
      { title: 'Selected project visuals', caption: 'Gallery of campaign creatives and formats.' },
    ],
    role: null,
    scope: 'Partnered cross-functionally with product managers, marketers, and engineers to align design direction with business goals, ensuring campaigns were scalable, impactful, and user-centered.',
    scopeTools: 'Figma, Creative Cloud, Adobe Firefly, Design system / workflow development, stakeholder management.',
    impact: [
      'Boosted production efficiency by 50% at DBS by contributing to the testing and feedback recollection of DBS adoption of Figma for better outcomes in real scenarios under tight deadlines.',
      'Designed and delivered creatives in multiple digital formats for high-visibility campaigns (Prime Day 2024, Big Deal Days), ensuring consistency across the board.',
      'Validation and user testing of new tools developed as part of the Automation and AI initiatives using the optimised use of images from product photoshoots.',
    ],
    skills: null,
  },
  {
    id: 'covantis',
    title: 'Covantis',
    media: [
      { title: 'Product suite & platform', caption: 'Website redesign, design system evolution, and key product interfaces.' },
    ],
    role: 'UX/UI designer',
    scope: null,
    scopeHighlights: [
      'I aligned stakeholders on a creative direction that reinforced the company’s tech-forward value proposition by extending the existing brand system for the website redesign.',
      'Following this, I collaborated with peers to evolve their Figma design system to respond to the first part of my work.',
      'Developed interaction techniques that strengthen user experience.',
    ],
    impact: [
      '75% improvement in core UX metrics (e.g. usability, task completion, satisfaction).',
      'SEO + UX saw organic traffic rise ~85% in 3 months after adopting improved usability and page experience.',
      'By integrating visual storytelling and brand cohesion into the product experience, I helped reinforce trust in the platform and supported faster adoption across some of the world’s largest agricultural companies, improving demo-to-adoption conversion rates by ~20% through clearer navigation and storytelling in the platform’s web presence.',
    ],
    skills: 'Figma, Design system maintenance and evolution, rapid on-boarding, stakeholder management, user experience, clearly articulating objective design choices to stakeholders to positively impact project outcomes.',
  },
  {
    id: 'ajediam',
    title: 'Ajediam',
    media: [
      { title: 'AJEDIAM storefront', caption: 'Hero: building facade and new wordmark sign in Antwerp.' },
      { title: 'The Koh-i-Noor Diamond (detail)', caption: 'Hero: close-up tactile diamond study and material texture.' },
      { title: 'Get in touch with our experts', caption: 'Hero: website and responsive views — Antwerp experts, CTAs, world map.' },
      { title: 'The Koh-i-Noor Diamond', caption: 'Hero: article page with diamond info and imagery.' },
    ],
    role: null,
    scope: null,
    scopeTools: null,
    scopeHighlights: [
      'Directed company-wide rebranding, defining visual language, typography, and brand strategy.',
      'Designed and implemented a scalable design system, enabling consistent experiences across product interfaces, marketing artifacts, and the rebranded website.',
    ],
    impact: [
      '✨ Led a comprehensive brand and product experience redesign that increased daily active users from 150 to 400+ by 2024 and improved average user retention by +24.62%.',
    ],
    skills: 'Product & Systems: Design systems, product design strategy, responsive design\nCraft: Typography, layout, visual storytelling\nTools: Figma, Adobe Creative Cloud',
  },
];

function getFeaturedMediaItems(project: (typeof FEATURED_PROJECTS)[number]): { title: string; caption: string }[] {
  if ('media' in project && Array.isArray(project.media) && project.media.length > 0) {
    return project.media;
  }
  return [
    { title: 'What I owned in this visual', caption: 'My role and contribution in what you see here.' },
    { title: 'What I owned in this visual', caption: 'Another angle on my involvement in this project.' },
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
    <div className="min-h-screen selection:bg-accent selection:text-white overflow-x-hidden bg-bg" style={{ backgroundColor: '#FAFAFA' }}>
      <CustomCursor />

      <main className="relative z-20">
      {/* Hero: mandala anchor first, then Mandala (so #mandala-home exists when Mandala mounts) */}
      <section className="relative h-[60vh] md:h-[70vh] flex flex-col border-b border-ink/20 bg-transparent" aria-label="Hero">
        <div id="mandala-home" className="absolute inset-0 -z-10" aria-hidden />
        <Mandala />
        <header className="relative z-20 flex-1 flex items-center justify-center p-6 md:p-12 pointer-events-none">
          <div className="max-w-xl text-center">
            <h1 className="text-4xl md:text-6xl font-sans font-medium relative" style={{ letterSpacing: '-0.015em' }}>
              Product designer scaling real-world systems for impact
            </h1>
          </div>
        </header>
      </section>

      {/* Section 1: Highlights — h1 + Component 1 (case study) + Component 1.1 (featured work) */}
      <section className="p-6 md:p-12 bg-bg border-b border-ink/20" style={{ backgroundColor: '#FAFAFA' }} aria-labelledby="highlights-heading">
        <h1 id="highlights-heading" className="text-3xl md:text-4xl font-sans font-medium mb-12">
          Highlights
        </h1>

        {/* Component 1: Case study — View case study → pop up */}
        <div className="max-w-4xl mb-16" data-cursor="hand">
          <motion.div
            whileHover={{ y: -4 }}
            className="group relative bg-white border border-ink rounded-xl p-8 flex flex-col justify-between min-h-[280px] shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] hover:shadow-[12px_12px_0px_0px_rgba(20,20,20,1)] transition-all duration-300 cursor-pointer"
            style={{ backgroundColor: '#FFFFFF' }}
            onClick={() => setOpenAdoptPopup(true)}
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="label">Case study</span>
                <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h2 className="text-2xl font-sans font-medium mb-4">{ADOPT_A_SCHOOL.title}</h2>
              <p className="text-ink/85 leading-relaxed font-sans">
                {ADOPT_A_SCHOOL.cardTeaser}
              </p>
            </div>
            <button
              type="button"
              data-cursor="hand"
              className="text-sm font-sans underline underline-offset-4 hover:text-accent transition-colors text-left mt-4"
              onClick={(e) => { e.stopPropagation(); setOpenAdoptPopup(true); }}
            >
              View case study
            </button>
          </motion.div>
        </div>

        {/* Component 1.1: Working with cross-functional teams — View featured work → pop up */}
        <div className="max-w-4xl mb-16" data-cursor="hand">
          <motion.div
            whileHover={{ y: -4 }}
            className="group relative bg-white border border-ink rounded-xl p-8 flex flex-col justify-between min-h-[280px] shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] hover:shadow-[12px_12px_0px_0px_rgba(20,20,20,1)] transition-all duration-300 cursor-pointer"
            style={{ backgroundColor: '#FFFFFF' }}
            onClick={() => setOpenFeaturedPopup(true)}
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="label">Featured work</span>
                <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h2 className="text-2xl font-sans font-medium mb-4">Working with cross-functional teams</h2>
              <p className="text-ink/85 leading-relaxed font-sans">
                At <span className="text-ink font-medium">Amazon</span>, boosted production efficiency by 50% by testing and feedback new production workflows in real scenarios. At <span className="text-ink font-medium">DBS</span>, evolved design systems for bar-raising creative outcomes on 30+ pages for Alexa+. At <span className="text-ink font-medium">Covantis</span>, improved demo-to-adoption by 20% through web design; & at <span className="text-ink font-medium">Ajediam</span>, as foundation designer, led the startup from 50 to 400+ users with a 24% return rate increase in a year.
              </p>
            </div>
            <button
              type="button"
              data-cursor="hand"
              className="text-sm font-sans underline underline-offset-4 hover:text-accent transition-colors text-left mt-4"
              onClick={(e) => { e.stopPropagation(); setOpenFeaturedPopup(true); }}
            >
              View featured work
            </button>
          </motion.div>
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
              <div className="shrink-0 pl-8 pr-12 pt-4">
                <span className="label block mb-2">Service design</span>
                <h1 className="text-2xl font-sans font-medium mb-4">Adopt-a-School</h1>
              </div>
              <div className="shrink-0">
                <AdoptCaseStudyMedia tall />
              </div>
              <div className="p-8 overflow-y-auto flex-1 min-h-0">
                <div className="min-w-0">
                  <dl className="space-y-6 font-sans text-ink/90">
                    <div>
                      <dt className="label mb-1">What is this</dt>
                      <dd className="leading-relaxed">A community donation system designed to help Backpack Brigade scale its Adopt-a-School program by structuring how donors, volunteers, and partner schools participate.</dd>
                    </div>
                    <div>
                      <dt className="label mb-1">Impact</dt>
                      <dd className="leading-relaxed">Designed a scalable engagement framework that translates 12+ years of operational knowledge into a repeatable program model, unlocking a major recurring revenue stream for the organization.</dd>
                    </div>
                    <div>
                      <dt className="label mb-1">Scope</dt>
                      <dd className="leading-relaxed">
                        Service and product design of a three-layer engagement system connecting:
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>physical discovery in community spaces</li>
                          <li>volunteer-supported activation</li>
                          <li>QR-based learning and donation flows</li>
                        </ul>
                      </dd>
                    </div>
                    <div>
                      <dt className="label mb-1">Skills</dt>
                      <dd className="leading-relaxed">Service design · systems thinking · stakeholder alignment · product design · prototyping · field testing</dd>
                    </div>
                  </dl>
                  <button
                    type="button"
                    data-cursor="hand"
                    onClick={() => {
                      setOpenAdoptPopup(false);
                      setOpenAdoptPage(true);
                    }}
                    className="inline-flex items-center gap-2 mt-6 text-sm font-sans font-medium underline underline-offset-4 hover:text-accent transition-colors text-left"
                  >
                    Explore the system
                    <ArrowUpRight size={16} />
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
              className="relative w-full max-w-2xl bg-white border border-ink rounded-xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
              style={{ backgroundColor: '#FFFFFF' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-ink/20 flex justify-between items-center">
                <div className="flex gap-2" role="tablist" aria-label="Featured projects">
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
                      className={`px-4 py-2 rounded-lg text-sm font-sans font-medium transition-colors ${
                        selectedFeaturedIndex === index
                          ? 'bg-white border border-ink text-ink'
                          : 'bg-ink/5 text-ink/70 border border-transparent hover:bg-ink/10'
                      }`}
                    >
                      {project.title}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  data-cursor="hand"
                  onClick={() => setOpenFeaturedPopup(false)}
                  className="p-1 rounded-full text-ink/60 hover:text-ink hover:bg-ink/10 transition-colors shrink-0"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="p-8 overflow-y-auto flex-1 min-h-0">
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
                    {'role' in project && project.role && (
                      <p className="label text-ink/60 mb-4">My role — {project.role}</p>
                    )}
                    {'scope' in project && project.scope && (
                      <div className="mb-6">
                        <dt className="label text-ink/60 mb-1">Scope</dt>
                        <dd className="font-sans text-ink/90 leading-relaxed">{project.scope}</dd>
                      </div>
                    )}
                    {'scopeTools' in project && project.scopeTools && (
                      <div className="mb-6">
                        <dt className="label text-ink/60 mb-1">Tools</dt>
                        <dd className="font-sans text-ink/90 leading-relaxed">{project.scopeTools}</dd>
                      </div>
                    )}
                    {'scopeHighlights' in project && project.scopeHighlights && project.scopeHighlights.length > 0 && (
                      <div className="mb-6">
                        <dt className="label text-ink/60 mb-2">Scope</dt>
                        <dd className="font-sans text-ink/90 leading-relaxed space-y-2">
                          {project.scopeHighlights.map((item, i) => (
                            <p key={i}>{item}</p>
                          ))}
                        </dd>
                      </div>
                    )}
                    <div className="mb-6">
                      <dt className="label text-ink/60 mb-2">Impact</dt>
                      <dd className="font-sans text-ink/90 leading-relaxed space-y-2">
                        {Array.isArray(project.impact)
                          ? project.impact.map((item, i) => <p key={i}>{item}</p>)
                          : <p>{project.impact}</p>}
                      </dd>
                    </div>
                    {'skills' in project && project.skills && (
                      <div className="mb-8">
                        <dt className="label text-ink/60 mb-1">Skills</dt>
                        <dd className="font-sans text-ink/90 leading-relaxed whitespace-pre-line">{project.skills}</dd>
                      </div>
                    )}

                    {/* Media: Amazon = 3 blocks (2 ZoomInWindow + 1 static). Covantis = 1 ZoomInWindow (hero + grid). */}
                    <div className="space-y-8">
                      {getFeaturedMediaItems(project).map((item, i) => {
                        const isAmazon = project.id === 'amazon';
                        const isCovantis = project.id === 'covantis';
                        const isAjediam = project.id === 'ajediam';
                        const isFirstWindow = isAmazon && i === 0;
                        const isThirdWindow = isAmazon && i === 2;
                        const isAjediamSecondWindow = isAjediam && i === 1;
                        const isCovantisWindow = isCovantis && i === 0;
                        const staticHeroSrc = isAmazon && i === 1 ? AMAZON_HERO_STATICS[1] : null;
                        const ajediamHeroSrc = isAjediam && i < AJEDIAM_HERO_IMAGES.length ? AJEDIAM_HERO_IMAGES[i] : null;
                        const heroImage = (arr: GalleryImage[]) =>
                          arr.find((img): img is { src: string; isHero?: boolean } => 'src' in img && !!img.isHero)?.src ?? arr.find((img): img is { src: string } => 'src' in img)?.src ?? null;
                        const firstWindowHeroSrc = isFirstWindow && AMAZON_FIRST_CAROUSEL_IMAGES.length > 0 ? heroImage(AMAZON_FIRST_CAROUSEL_IMAGES) : null;
                        const thirdWindowHeroSrc = isThirdWindow && AMAZON_GALLERY_IMAGES.length > 0 ? heroImage(AMAZON_GALLERY_IMAGES) : null;
                        const covantisHeroSrc = isCovantisWindow && COVANTIS_GALLERY_IMAGES.length > 0 ? heroImage(COVANTIS_GALLERY_IMAGES) : null;
                        const imageBlock = (
                          <div className="media-window-content bg-ink/5 flex items-center justify-center overflow-hidden">
                            {staticHeroSrc ? (
                              <img
                                src={staticHeroSrc}
                                alt=""
                                className="w-full h-full object-cover object-center"
                              />
                            ) : firstWindowHeroSrc ? (
                              <img
                                src={firstWindowHeroSrc}
                                alt=""
                                className="w-full h-full object-cover object-center"
                              />
                            ) : thirdWindowHeroSrc ? (
                              <img
                                src={thirdWindowHeroSrc}
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
                            <p className="label text-ink/60 mb-1">{item.title}</p>
                            <p className="text-ink/85 text-sm leading-relaxed">{item.caption}</p>
                          </>
                        );
                        if (isFirstWindow) {
                          return (
                            <ZoomInWindow
                              key={i}
                              galleryImages={AMAZON_FIRST_CAROUSEL_IMAGES}
                              projectTitle="Amazon"
                              subtitle="What I owned in this visual"
                              caption={captionBlock}
                            >
                              {imageBlock}
                            </ZoomInWindow>
                          );
                        }
                        if (isThirdWindow) {
                          return (
                            <ZoomInWindow
                              key={i}
                              galleryImages={AMAZON_GALLERY_IMAGES}
                              projectTitle="Amazon"
                              subtitle="Selected project visuals"
                              caption={captionBlock}
                            >
                              {imageBlock}
                            </ZoomInWindow>
                          );
                        }
                        if (isAjediamSecondWindow) {
                          return (
                            <ZoomInWindow
                              key={i}
                              galleryImages={AJEDIAM_SECOND_WINDOW_IMAGES}
                              projectTitle="Ajediam"
                              subtitle="The Koh-i-Noor Diamond (detail)"
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
                              subtitle="Product suite & platform"
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
            style={{ backgroundColor: '#FAFAFA' }}
          >
            <MandalaPageHeader onBack={() => setOpenDesigningAiPage(false)} />

            {/* Main content — vertical flow, max-width for readability */}
            <main className="flex-1 p-6 md:p-12 pb-24">
              <div className="max-w-3xl mx-auto">
                {/* Intro block */}
                <div className="mb-[120px]">
                  <h1 className="text-3xl md:text-4xl font-sans font-medium mb-4 leading-tight">
                    From complexity to clarity with AI
                  </h1>
                  <p className="text-ink/85 text-lg leading-relaxed max-w-2xl">
                    A walkthrough of how I brand values, image and translate it into strategy; into products that feel human, clear, and intentional.
                  </p>
                </div>

                {/* Sections — vector path separation (no cards) */}
                <div>
                  <div className="mb-10">
                    <h2 className="text-xl md:text-2xl font-sans font-medium mb-4">Rapid sensemaking at scale</h2>
                    <p className="text-ink/85 leading-relaxed mb-6">
                      I use AI to rapidly synthesize raw, unstructured inputs into clear system logic and opportunity maps.
                    </p>
                    <div className="aspect-[4/3] bg-ink/5 border border-ink/20 rounded-lg flex items-center justify-center mb-4">
                      <span className="label text-ink/40">Image: Backpack Brigade — service ecosystem</span>
                    </div>
                    <p className="label mb-1">Work for: Backpack Brigade</p>
                    <p className="text-ink/80 text-sm leading-relaxed">
                      From raw data points to a structured system describing a service ecosystem framework
                    </p>
                  </div>
                  <hr className="border-0 border-t border-ink/10 my-10" aria-hidden />
                  <div className="mb-10">
                    <h2 className="text-xl md:text-2xl font-sans font-medium mb-4">From concept to functional product</h2>
                    <p className="text-ink/85 leading-relaxed mb-4">
                      Reducing time between idea and reality. I use AI to prototype, code, and test ideas quickly, validating direction before committing resources.
                    </p>
                    <ul className="space-y-2 text-ink/85 text-sm leading-relaxed list-none mb-6">
                      <li>Overcome</li>
                      <li>Physical backpack brigade object</li>
                      <li>Rapid, iterative prototyping and storyboarding for alignment</li>
                      <li>Exploring futures before building them.</li>
                    </ul>
                    <div className="aspect-[4/3] bg-ink/5 border border-ink/20 rounded-lg flex items-center justify-center mb-4">
                      <span className="label text-ink/40">Image: Prototyping & storyboards</span>
                    </div>
                    <p className="text-ink/85 leading-relaxed mb-2">
                      I design prototypes that simulate how a service or system will behave, allowing leaders to test logic, spot risks, and choose confidently.
                    </p>
                    <p className="text-ink/80 text-sm leading-relaxed">Rough concept → Service experience storyboard for veterinary: Bestforcats</p>
                    <p className="text-ink/80 text-sm leading-relaxed">Single email → journey map → Service experience storyboard</p>
                  </div>
                  <hr className="border-0 border-t border-ink/10 my-10" aria-hidden />
                  <div className="mb-10">
                    <h2 className="text-xl md:text-2xl font-sans font-medium mb-4">Prompting for visual consistency and storytelling</h2>
                    <p className="text-ink/85 leading-relaxed mb-6">
                      I use AI to generate images, using the adequate techniques for best outcomes
                    </p>
                    <div className="aspect-[4/3] bg-ink/5 border border-ink/20 rounded-lg flex items-center justify-center mb-4">
                      <span className="label text-ink/40">Image: Visual consistency & character iterations</span>
                    </div>
                    <p className="text-ink/80 text-sm leading-relaxed">
                      Visualization of image iterations for character development of personal projects.
                    </p>
                  </div>
                </div>
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex flex-col bg-bg overflow-y-auto"
            style={{ backgroundColor: '#FAFAFA' }}
          >
            <MandalaPageHeader onBack={() => setOpenAdoptPage(false)} />

            <main className="flex-1 p-6 md:p-12 pb-24">
              <div className="max-w-3xl mx-auto">
                {/* 1. Hero */}
                <div className="mb-[120px]">
                  <h1 className="text-3xl md:text-4xl font-sans font-medium leading-tight mb-12">
                    Adopt-a-School
                  </h1>
                  <div className="mb-16 space-y-5 text-ink/85">
                      <div>
                        <p className="label mb-1 text-ink/60">Role</p>
                        <p className="leading-relaxed">Service Design · Product Design</p>
                      </div>
                      <div>
                        <p className="label mb-1 text-ink/60">Organization</p>
                        <p className="leading-relaxed">Backpack Brigade</p>
                      </div>
                      <div>
                        <p className="label mb-1 text-ink/60">Scope</p>
                        <p className="leading-relaxed">Community fundraising system including physical activation object, mobile engagement flow, and service framework.</p>
                      </div>
                  </div>
                  <p className="text-ink/85 text-lg leading-relaxed max-w-2xl mb-4">
                    Designing a community activation system that enables local businesses and volunteers to help feed more children.
                  </p>
                  <p className="text-ink/80 leading-relaxed max-w-2xl mb-8">
                    Transforming 12+ years of operational knowledge into a scalable engagement system connecting donors, volunteers, and schools.
                  </p>
                  <div className="aspect-[16/9] bg-ink/10 border border-ink/20 rounded-xl flex items-center justify-center">
                    <span className="label text-ink/50">Hero Image Placeholder</span>
                  </div>
                </div>

                {/* Opportunity */}
                <section className="mb-[120px]">
                  <h2 className="text-xl md:text-2xl font-sans font-medium mb-4">Opportunity</h2>
                  <div className="space-y-4 text-ink/85 leading-relaxed">
                    <p>
                      Backpack Brigade has spent over a decade distributing food to children experiencing food insecurity across Seattle schools.
                    </p>
                    <p>
                      While the organization had strong logistics and volunteer participation, it lacked a scalable system for community members to activate support beyond the warehouse.
                    </p>
                    <p>
                      Research revealed that volunteers and local businesses wanted to help more — but there was no clear structure connecting them to schools in need.
                    </p>
                    <p>
                      This project explores how community spaces, volunteers, and simple digital tools could work together to unlock that participation.
                    </p>
                  </div>
                </section>

                {/* 4. Strategic Decisions — accordion */}
                <section className="mb-[120px]">
                  <h2 className="text-xl md:text-2xl font-sans font-medium mb-4">Strategic Decisions</h2>
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
                          className="w-full flex justify-between items-center gap-4 p-6 text-left font-sans font-medium hover:bg-ink/5 transition-colors"
                          aria-expanded={adoptAccordionOpen === i}
                        >
                          <span>{item.title}</span>
                          <ChevronDown size={20} className={`shrink-0 transition-transform ${adoptAccordionOpen === i ? 'rotate-180' : ''}`} />
                        </button>
                        {adoptAccordionOpen === i && (
                          <div className="px-6 pt-4 pb-6 text-ink/85 leading-relaxed whitespace-pre-line">
                            {item.content}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                {/* 2. System Architecture */}
                <section className="mb-[120px]">
                  <h2 className="text-xl md:text-2xl font-sans font-medium mb-4">System Architecture</h2>
                  <p className="text-ink/85 leading-relaxed mb-4">
                    The system connects community discovery, human activation, and mobile participation through three coordinated interaction layers.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-ink/85 leading-relaxed mb-6">
                    <li>Physical discovery object placed in community spaces</li>
                    <li>Human activation through volunteers and local staff</li>
                    <li>Mobile engagement flow accessed through QR scanning</li>
                  </ul>
                  <div className="aspect-video bg-ink/10 border border-ink/20 rounded-xl flex items-center justify-center">
                    <span className="label text-ink/50">System Diagram Placeholder</span>
                  </div>
                </section>

                {/* 3. Key Interactions */}
                <section className="mb-[120px]">
                  <h2 className="text-xl md:text-2xl font-sans font-medium mb-6">Key Interactions</h2>
                  <div>
                    <div className="mb-10">
                      <h3 className="text-lg font-sans font-medium mb-2">QR Entry</h3>
                      <p className="text-ink/85 leading-relaxed mb-4">
                        Scanning the Apple opens a lightweight mobile flow introducing the Adopt-a-School program.
                      </p>
                      <div className="aspect-[4/3] bg-ink/5 border border-ink/20 rounded-lg flex items-center justify-center">
                        <span className="label text-ink/40">Interaction Image Placeholder</span>
                      </div>
                    </div>
                    <hr className="border-0 border-t border-ink/10 my-10" aria-hidden />
                    <div className="mb-10">
                      <h3 className="text-lg font-sans font-medium mb-2">School Adoption Map</h3>
                      <p className="text-ink/85 leading-relaxed mb-4">
                        Users explore nearby schools and choose one to support through community donations.
                      </p>
                      <div className="aspect-[4/3] bg-ink/5 border border-ink/20 rounded-lg flex items-center justify-center">
                        <span className="label text-ink/40">Interaction Image Placeholder</span>
                      </div>
                    </div>
                    <hr className="border-0 border-t border-ink/10 my-10" aria-hidden />
                    <div className="mb-10">
                      <h3 className="text-lg font-sans font-medium mb-2">School Detail Interaction</h3>
                      <p className="text-ink/85 leading-relaxed mb-4">
                        School profiles make local impact visible and help supporters connect with the community they are helping.
                      </p>
                      <div className="aspect-[4/3] bg-ink/5 border border-ink/20 rounded-lg flex items-center justify-center">
                        <span className="label text-ink/40">Interaction Image Placeholder</span>
                      </div>
                    </div>
                  </div>
                </section>
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
            style={{ backgroundColor: '#FAFAFA' }}
          >
            <MandalaPageHeader onBack={() => setOpenTouchpointsPage(false)} />

            <main className="flex-1 p-6 md:p-12 pb-24">
              <div className="max-w-3xl mx-auto">
                <div className="mb-[120px]">
                  <h1 className="text-3xl md:text-4xl font-sans font-medium mb-4 leading-tight">
                    Brand identity in the real world
                  </h1>
                  <p className="text-ink/85 text-lg leading-relaxed max-w-2xl">
                    A walkthrough of how I brand values, image and translate it into strategy; into products that feel human, clear, and intentional.
                  </p>
                </div>

                <div>
                  <div className="mb-10">
                    <h2 className="text-xl md:text-2xl font-sans font-medium mb-4">Elevating the unboxing experience of jewelry</h2>
                    <p className="text-ink/85 leading-relaxed mb-6">
                      By adding infographics for jewel care and brochures describing reward systems we increased delight in the unboxing by 30%.
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
                    <p className="label mb-1">Work for: Jewel care & unboxing</p>
                  </div>
                  <hr className="border-0 border-t border-ink/10 my-10" aria-hidden />
                  <div className="mb-10">
                    <h2 className="text-xl md:text-2xl font-sans font-medium mb-4">Creating a brand world to scale a rap duo&apos;s potential for profit</h2>
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
                    <p className="label mb-1">Work for: amau and the wolf</p>
                  </div>
                  <hr className="border-0 border-t border-ink/10 my-10" aria-hidden />
                  <div className="mb-10">
                    <h2 className="text-xl md:text-2xl font-sans font-medium mb-4">Diving deep into visual research for distinctive and appropriate results</h2>
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
                    <p className="label mb-1">Work for: Spice Angel</p>
                  </div>
                </div>
              </div>
            </main>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section: Designing with AI */}
      <section className="p-6 md:p-12 border-b border-ink/20 bg-bg" style={{ backgroundColor: '#FAFAFA' }} aria-labelledby="designing-ai-heading">
        <span className="label mb-3 block">Innovation</span>
        <h2 id="designing-ai-heading" className="text-3xl md:text-4xl font-sans font-medium mb-4">Designing with AI</h2>
        <p className="text-ink/85 text-lg leading-relaxed max-w-2xl mb-6">
          Learn more about how I integrate AI in different areas of my workflows for improved efficiency and outcomes across different applications.
        </p>
        <button type="button" data-cursor="hand" className="text-sm font-sans underline underline-offset-4 hover:text-accent transition-colors text-left" onClick={() => setOpenDesigningAiPage(true)}>Learn more</button>
      </section>

      {/* Section: Design Across Touchpoints */}
      <section className="p-6 md:p-12 border-b border-ink/20 bg-bg" style={{ backgroundColor: '#FAFAFA' }} aria-labelledby="touchpoints-heading">
        <span className="label mb-3 block">Scalability</span>
        <h2 id="touchpoints-heading" className="text-3xl md:text-4xl font-sans font-medium mb-4">Design Across Touchpoints</h2>
        <p className="text-ink/85 text-lg leading-relaxed max-w-2xl mb-6">
          I help brands clearly express their value across every customer interaction. Transforming insights and brand values into visual design systems, I ensure quality, consistency, and brand scalability.
        </p>
        <button type="button" data-cursor="hand" className="text-sm font-sans underline underline-offset-4 hover:text-accent transition-colors text-left" onClick={() => setOpenTouchpointsPage(true)}>Take a quick look</button>
      </section>

      {/* About Section */}
      <section className="p-6 md:p-12 bg-bg" style={{ backgroundColor: '#FAFAFA' }} aria-labelledby="about-heading">
        <div className="max-w-2xl">
          <h2 id="about-heading" className="text-3xl md:text-4xl font-sans font-medium mb-4">
            International perspective<br />
            shapes my design
          </h2>
          <div className="space-y-6 text-lg text-ink/90 leading-relaxed">
            <p>
              Growing up across cultures after leaving Costa Rica to Mexico then Europe in my early teens shaped how I see the world and how I design.
            </p>
            <p>
              It taught me to adapt quickly, and approach problems with empathy and curiosity. This mixes well with my creative nature and what I call a divergent thinking "mental-structure", chip or default setting.
            </p>
            <p>
              Outside of work, I paint, draw, exercise, spend time in nature, and hang out with my wife, our cats, and our friends.
            </p>
          </div>
        </div>
      </section>

      <Footer />
      </main>
    </div>
  );
}
