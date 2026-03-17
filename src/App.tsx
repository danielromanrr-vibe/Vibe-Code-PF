import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, ArrowLeft, X, ChevronDown } from 'lucide-react';
import Mandala from './components/Mandala';
import CustomCursor from './components/CustomCursor';
import Footer from './components/Footer';
import AdoptCaseStudyMedia from './components/AdoptCaseStudyMedia';

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

const FEATURED_PROJECTS = [
  {
    id: 'amazon',
    title: 'Amazon',
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
              <div className="relative shrink-0">
                <AdoptCaseStudyMedia />
                <button
                  type="button"
                  data-cursor="hand"
                  onClick={() => setOpenAdoptPopup(false)}
                  className="absolute top-3 right-3 z-10 p-2 bg-white/90 hover:bg-white border border-ink/20 transition-colors rounded-full shadow-sm"
                  aria-label="Close"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-8 overflow-y-auto flex-1">
                <div className="min-w-0">
                  <span className="label block mb-2">Service design</span>
                  <h4 className="text-2xl font-sans font-medium mb-4">Adopt-a-School</h4>
                  <p className="text-ink/85 leading-relaxed mb-6">
                    Designing a community activation system that enables local businesses and volunteers to help feed more children.
                  </p>
                  <dl className="space-y-6 font-sans text-ink/90">
                    <div>
                      <dt className="label mb-1">System Design</dt>
                      <dd className="leading-relaxed">Designed a multi-channel engagement system connecting donors, volunteers, and schools through coordinated physical, human, and digital touchpoints.</dd>
                    </div>
                    <div>
                      <dt className="label mb-1">Impact</dt>
                      <dd className="leading-relaxed">Translated 12+ years of operational knowledge into a scalable community fundraising system, unlocking a recurring revenue stream for Backpack Brigade.</dd>
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
                  className="p-2 hover:bg-ink/10 transition-colors rounded shrink-0"
                  aria-label="Close"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-8 overflow-y-auto flex-1">
                {FEATURED_PROJECTS.map((project, index) => (
                  <div
                    key={project.id}
                    id={`featured-panel-${project.id}`}
                    role="tabpanel"
                    aria-labelledby={`featured-tab-${project.id}`}
                    hidden={selectedFeaturedIndex !== index}
                    className={selectedFeaturedIndex !== index ? 'hidden' : ''}
                  >
                    <div className="w-full h-48 bg-ink/5 rounded-lg border border-ink/20 flex items-center justify-center mb-6">
                      <span className="label text-ink/50">Project visual placeholder</span>
                    </div>
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
                      <div>
                        <dt className="label text-ink/60 mb-1">Skills</dt>
                        <dd className="font-sans text-ink/90 leading-relaxed whitespace-pre-line">{project.skills}</dd>
                      </div>
                    )}
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
            {/* Page header — minimal, like a doc nav */}
            <header className="shrink-0 flex justify-between items-center p-6 md:p-12 border-b border-ink/20" style={{ backgroundColor: '#FAFAFA' }}>
              <button type="button" data-cursor="hand" onClick={() => setOpenDesigningAiPage(false)} className="label hover:opacity-100 transition-opacity flex items-center gap-2" aria-label="Back">
                <ArrowLeft size={14} />
                Back
              </button>
              <span className="label">Innovation</span>
            </header>

            {/* Main content — vertical flow, max-width for readability */}
            <main className="flex-1 p-6 md:p-12 pb-24">
              <div className="max-w-3xl mx-auto">
                {/* Intro block — proximity: title + subtitle grouped */}
                <div className="mb-16">
                  <h1 className="text-3xl md:text-4xl font-sans font-medium mb-4 leading-tight">
                    From complexity to clarity with AI
                  </h1>
                  <p className="text-ink/85 text-lg leading-relaxed max-w-2xl">
                    A walkthrough of how I brand values, image and translate it into strategy; into products that feel human, clear, and intentional.
                  </p>
                </div>

                {/* Section cards — similarity: same card structure; proximity: title + body + image + caption */}
                <div className="space-y-12">
                  {/* Card 1: Rapid sensemaking */}
                  <article className="bg-white border border-ink rounded-xl p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(20,20,20,1)]">
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
                  </article>

                  {/* Card 2: From concept to functional product */}
                  <article className="bg-white border border-ink rounded-xl p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(20,20,20,1)]">
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
                  </article>

                  {/* Card 3: Prompting for visual consistency */}
                  <article className="bg-white border border-ink rounded-xl p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(20,20,20,1)]">
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
                  </article>
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
            <header className="shrink-0 flex justify-between items-center p-6 md:p-12 border-b border-ink/20" style={{ backgroundColor: '#FAFAFA' }}>
              <button type="button" data-cursor="hand" onClick={() => setOpenAdoptPage(false)} className="label hover:opacity-100 transition-opacity flex items-center gap-2" aria-label="Back">
                <ArrowLeft size={14} />
                Back
              </button>
              <span className="label">Case study</span>
            </header>

            <main className="flex-1 p-6 md:p-12 pb-24">
              <div className="max-w-3xl mx-auto">
                {/* 1. Hero */}
                <div className="mb-16">
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
                <section className="mb-16">
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

                {/* 2. System Architecture */}
                <section className="mb-16">
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
                <section className="mb-16">
                  <h2 className="text-xl md:text-2xl font-sans font-medium mb-6">Key Interactions</h2>
                  <div className="space-y-8">
                    <article className="bg-white border border-ink rounded-xl p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(20,20,20,1)]">
                      <h3 className="text-lg font-sans font-medium mb-2">QR Entry</h3>
                      <p className="text-ink/85 leading-relaxed mb-4">
                        Scanning the Apple opens a lightweight mobile flow introducing the Adopt-a-School program.
                      </p>
                      <div className="aspect-[4/3] bg-ink/5 border border-ink/20 rounded-lg flex items-center justify-center">
                        <span className="label text-ink/40">Interaction Image Placeholder</span>
                      </div>
                    </article>
                    <article className="bg-white border border-ink rounded-xl p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(20,20,20,1)]">
                      <h3 className="text-lg font-sans font-medium mb-2">School Adoption Map</h3>
                      <p className="text-ink/85 leading-relaxed mb-4">
                        Users explore nearby schools and choose one to support through community donations.
                      </p>
                      <div className="aspect-[4/3] bg-ink/5 border border-ink/20 rounded-lg flex items-center justify-center">
                        <span className="label text-ink/40">Interaction Image Placeholder</span>
                      </div>
                    </article>
                    <article className="bg-white border border-ink rounded-xl p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(20,20,20,1)]">
                      <h3 className="text-lg font-sans font-medium mb-2">School Detail Interaction</h3>
                      <p className="text-ink/85 leading-relaxed mb-4">
                        School profiles make local impact visible and help supporters connect with the community they are helping.
                      </p>
                      <div className="aspect-[4/3] bg-ink/5 border border-ink/20 rounded-lg flex items-center justify-center">
                        <span className="label text-ink/40">Interaction Image Placeholder</span>
                      </div>
                    </article>
                  </div>
                </section>

                {/* 4. Strategic Decisions — accordion */}
                <section className="mb-16">
                  <h2 className="text-xl md:text-2xl font-sans font-medium mb-4">Strategic Decisions</h2>
                  <p className="text-ink/85 leading-relaxed mb-6">
                    Designing a scalable social impact system required navigating organizational constraints, stakeholder values, and real-world behavior.
                  </p>
                  <div className="border border-ink/20 rounded-xl overflow-hidden divide-y divide-ink/20">
                    {[
                      {
                        title: 'Research access vs ethical organizational boundaries',
                        content: "Backpack Brigade's service technically ends when food leaves their warehouse, making the final stage of distribution difficult to access for research.\n\nRather than delaying the project waiting for interviews with family social workers, proxy interviews with program managers and role-playing sessions with leadership were used to simulate downstream experiences.",
                      },
                      {
                        title: 'Inventing a program vs evolving institutional DNA',
                        content: "Research revealed a little-known initiative where a volunteer had independently mobilized three schools.\n\nInstead of inventing an entirely new program, the project evolved this concept into a structured Adopt-a-School system supported by physical activation objects and digital participation.",
                      },
                      {
                        title: 'Revenue optimization vs founder philosophy',
                        content: "The founder intentionally avoided direct donation prompts, believing participation should feel like an honor rather than a transaction.\n\nResearch suggested clearer contribution structures could improve fundraising potential. The recommendation was validated with the Director of Development and documented as part of the final strategy.",
                      },
                      {
                        title: 'Prototype fidelity vs delivery constraints',
                        content: "The prototype required validating both a physical object and a full digital engagement flow within a limited three-week window.\n\nInteraction fidelity was prioritized for the digital prototype while rapid AI-assisted iteration enabled efficient physical prototyping.",
                      },
                      {
                        title: 'Artifact optimization vs system behavior',
                        content: "Testing revealed strong curiosity around the activation object but limited scanning behavior.\n\nThe insight reframed the object as a discovery trigger rather than the conversion mechanism. Staff interaction was introduced to activate the moment when users notice the object.",
                      },
                      {
                        title: 'Operational improvement vs scalable growth',
                        content: "Research surfaced operational pain points in food distribution logistics, but solving those would only yield incremental improvements.\n\nThe project instead focused on enabling volunteers to activate support beyond the existing distribution footprint.",
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
            <header className="shrink-0 flex justify-between items-center p-6 md:p-12 border-b border-ink/20" style={{ backgroundColor: '#FAFAFA' }}>
              <button type="button" data-cursor="hand" onClick={() => setOpenTouchpointsPage(false)} className="label hover:opacity-100 transition-opacity flex items-center gap-2" aria-label="Back">
                <ArrowLeft size={14} />
                Back
              </button>
              <span className="label">Scalability</span>
            </header>

            <main className="flex-1 p-6 md:p-12 pb-24">
              <div className="max-w-3xl mx-auto">
                <div className="mb-16">
                  <h1 className="text-3xl md:text-4xl font-sans font-medium mb-4 leading-tight">
                    Brand identity in the real world
                  </h1>
                  <p className="text-ink/85 text-lg leading-relaxed max-w-2xl">
                    A walkthrough of how I brand values, image and translate it into strategy; into products that feel human, clear, and intentional.
                  </p>
                </div>

                <div className="space-y-12">
                  <article className="bg-white border border-ink rounded-xl p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(20,20,20,1)]">
                    <h2 className="text-xl md:text-2xl font-sans font-medium mb-4">Elevating the unboxing experience of jewelry</h2>
                    <p className="text-ink/85 leading-relaxed mb-6">
                      By adding infographics for jewel care and brochures describing reward systems we increased delight in the unboxing by 30%.
                    </p>
                    <div className="aspect-[4/3] bg-ink/5 border border-ink/20 rounded-lg flex items-center justify-center mb-4">
                      <span className="label text-ink/40">Image: Jewel care & unboxing</span>
                    </div>
                    <p className="label mb-1">Work for: Backpack Brigade</p>
                  </article>

                  <article className="bg-white border border-ink rounded-xl p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(20,20,20,1)]">
                    <h2 className="text-xl md:text-2xl font-sans font-medium mb-4">Creating a brand world to scale a rap duo&apos;s potential for profit</h2>
                    <p className="text-ink/85 leading-relaxed mb-6">
                      We designed a logo to help this rap duo turn their name into wearable merch.
                    </p>
                    <div className="aspect-[4/3] bg-ink/5 border border-ink/20 rounded-lg flex items-center justify-center mb-4">
                      <span className="label text-ink/40">Image: amau and the wolf — brand / merch</span>
                    </div>
                    <p className="label mb-1">Work for: amau and the wolf</p>
                  </article>

                  <article className="bg-white border border-ink rounded-xl p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(20,20,20,1)]">
                    <h2 className="text-xl md:text-2xl font-sans font-medium mb-4">Diving deep into visual research for distinctive and appropriate results</h2>
                    <p className="text-ink/85 leading-relaxed mb-6">
                      A brand system combining contemporary Asian typography, traditional calligraphy, custom illustrations, and a secondary typeface—designed for market launch and global expansion.
                    </p>
                    <div className="aspect-[4/3] bg-ink/5 border border-ink/20 rounded-lg flex items-center justify-center mb-4">
                      <span className="label text-ink/40">Image: Spice Angel — brand system</span>
                    </div>
                    <p className="label mb-1">Work for: Spice Angel</p>
                  </article>

                  <article className="bg-white border border-ink rounded-xl p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(20,20,20,1)]">
                    <h2 className="text-xl md:text-2xl font-sans font-medium mb-4">Single email → journey map → Service experience storyboard</h2>
                    <div className="aspect-[4/3] bg-ink/5 border border-ink/20 rounded-lg flex items-center justify-center mb-4">
                      <span className="label text-ink/40">Image: Service experience storyboard</span>
                    </div>
                  </article>
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
      <section className="p-6 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-bg" style={{ backgroundColor: '#FAFAFA' }} aria-labelledby="about-heading">
        <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden">
          <div className="absolute inset-0 border border-ink translate-x-4 translate-y-4 -z-10 rounded-xl" />
          <img
            src="https://picsum.photos/seed/daniel/800/1000"
            alt="Daniel Román"
            className="w-full h-full object-cover border border-ink rounded-xl grayscale hover:grayscale-0 transition-all duration-700"
            referrerPolicy="no-referrer"
          />
        </div>
        <div>
          <h2 id="about-heading" className="text-3xl md:text-4xl font-sans font-medium mb-4">
            International perspective shapes my design
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
