import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Github, Linkedin, Mail, Clock, X } from 'lucide-react';
import Mandala from './components/Mandala';
import CustomCursor from './components/CustomCursor';

const ADOPT_A_SCHOOL = {
  title: 'Adopt a School program',
  caseId: 'Case Study 01',
  cardTeaser: 'A community donation system designed for Backpack Brigade, an organisation combatting food insecurity based in Seattle, Wa.',
  whatIsThis: 'A community donation system designed for Backpack Brigade, an organisation combatting food insecurity based in Seattle, Wa.',
  whatWasShipped: 'A human-centered design-driven community donation system for Backpack Brigade, designed and validated through service blueprints and high-fidelity prototypes.',
  scope: 'Three interaction layers — Physical (Beacon kit), Human (Ambassadors activating the network), Digital (QR-based learning and donation flow).',
  moreDetail: 'Turn everyday businesses into visible nodes of community support connected to a specific nearby school.',
  exploreHref: '#',
};

export default function App() {
  const [time, setTime] = useState(new Date());
  const [openAdoptPopup, setOpenAdoptPopup] = useState(false);
  const [openFeaturedPopup, setOpenFeaturedPopup] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="min-h-screen selection:bg-accent selection:text-white overflow-x-hidden bg-bg" style={{ backgroundColor: '#F3F3F3' }}>
      <CustomCursor />
      <Mandala />

      <main className="relative z-20">
      {/* Hero: mandala + Daniel Román + subheader */}
      <section className="relative h-[60vh] md:h-[70vh] flex flex-col border-b border-ink/20 bg-transparent" aria-label="Hero">
        <div id="mandala-home" className="absolute inset-0 -z-10" aria-hidden />
        <header className="relative z-20 p-6 md:p-12 flex justify-between items-start pointer-events-none">
          <div className="flex flex-col relative">
            <div className="relative inline-block">
              <span className="label mb-2 block">Portfolio v.2026</span>
              <h1 className="text-4xl md:text-6xl font-sans font-medium relative">Daniel Román</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 label">
            <Clock size={12} />
            <span>{formatTime(time)}</span>
          </div>
        </header>
        <div className="mt-auto relative z-10 p-6 md:p-12 max-w-3xl">
          <p className="text-xl md:text-3xl font-sans text-ink/95 leading-tight">
            Product designer scaling real-world systems for impact
          </p>
          <a href="mailto:hello@danielromandesign.com" className="label inline-block mt-6 border border-ink/40 px-4 py-2 rounded-full hover:bg-ink hover:text-bg hover:opacity-100 transition-all duration-300">
            Get in touch
          </a>
        </div>
      </section>

      {/* Section 1: Highlights — h1 + Component 1 (case study) + Component 1.1 (featured work) */}
      <section className="p-6 md:p-12 bg-bg border-b border-ink/20" style={{ backgroundColor: '#F3F3F3' }} aria-labelledby="highlights-heading">
        <h1 id="highlights-heading" className="text-3xl md:text-4xl font-sans font-medium mb-12">
          Highlights
        </h1>

        {/* Component 1: Case study — View case study → pop up */}
        <div className="max-w-4xl mb-16">
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
              className="text-sm font-sans underline underline-offset-4 hover:text-accent transition-colors text-left mt-4"
              onClick={(e) => { e.stopPropagation(); setOpenAdoptPopup(true); }}
            >
              View case study
            </button>
          </motion.div>
        </div>

        {/* Component 1.1: Working with cross-functional teams — View featured work → pop up */}
        <div className="max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-sans font-medium mb-6">Working with cross-functional teams</h2>
          <p className="text-lg md:text-xl leading-relaxed text-ink/90 mb-8">
            At <span className="text-ink font-medium">Amazon</span>, boosted production efficiency by 50% by testing and feedback new production workflows in real scenarios. At <span className="text-ink font-medium">DBS</span>, evolved design systems for bar-raising creative outcomes on 30+ pages for Alexa+. At <span className="text-ink font-medium">Covantis</span>, improved demo-to-adoption by 20% through web design; & at <span className="text-ink font-medium">Ajediam</span>, as foundation designer, led the startup from 50 to 400+ users with a 24% return rate increase in a year.
          </p>
          <button
            type="button"
            onClick={() => setOpenFeaturedPopup(true)}
            className="inline-flex items-center gap-2 group text-left"
          >
            <span className="text-lg font-sans font-medium border-b border-ink/20 group-hover:border-ink transition-colors">View featured work</span>
            <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
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
              <div className="w-full h-48 bg-[#A8C5E8] shrink-0" />
              <div className="p-8 overflow-y-auto flex-1">
                <div className="flex justify-between items-start gap-4">
                  <div className="min-w-0 flex-1">
                    <span className="label block mb-2">{ADOPT_A_SCHOOL.caseId}</span>
                    <h4 className="text-2xl font-sans font-medium mb-6">{ADOPT_A_SCHOOL.title}</h4>
                    <dl className="space-y-6 font-sans text-ink/90">
                      <div>
                        <dt className="label mb-1">What is this</dt>
                        <dd className="leading-relaxed">{ADOPT_A_SCHOOL.whatIsThis}</dd>
                      </div>
                      <div>
                        <dt className="label mb-1">What was shipped</dt>
                        <dd className="leading-relaxed">{ADOPT_A_SCHOOL.whatWasShipped}</dd>
                      </div>
                      <div>
                        <dt className="label mb-1">Scope</dt>
                        <dd className="leading-relaxed">{ADOPT_A_SCHOOL.scope}</dd>
                      </div>
                      <div>
                        <dt className="label mb-1">More detail</dt>
                        <dd className="leading-relaxed">{ADOPT_A_SCHOOL.moreDetail}</dd>
                      </div>
                    </dl>
                    <a
                      href={ADOPT_A_SCHOOL.exploreHref}
                      className="inline-flex items-center gap-2 mt-6 text-sm font-sans font-medium underline underline-offset-4 hover:text-accent transition-colors"
                    >
                      Explore the system
                      <ArrowUpRight size={16} />
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpenAdoptPopup(false)}
                    className="p-2 hover:bg-ink/10 transition-colors rounded shrink-0"
                    aria-label="Close"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Featured work popup — lorem ipsum placeholder */}
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
              <div className="p-8 overflow-y-auto">
                <div className="flex justify-between items-start gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-2xl font-sans font-medium mb-6">Featured work</h3>
                    <p className="text-ink/90 leading-relaxed font-sans mb-4">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <p className="text-ink/90 leading-relaxed font-sans">
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpenFeaturedPopup(false)}
                    className="p-2 hover:bg-ink/10 transition-colors rounded shrink-0"
                    aria-label="Close"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid Sections */}
      <section className="grid grid-cols-1 md:grid-cols-2 border-b border-ink/20 bg-bg" style={{ backgroundColor: '#F3F3F3' }}>
        <div className="p-6 md:p-12 border-b md:border-b-0 md:border-r border-ink/20">
          <span className="label mb-4 block">Innovation</span>
          <h3 className="text-2xl font-sans font-medium mb-6">Designing with AI</h3>
          <p className="text-ink/85 mb-8 max-w-md">
            Learn more about how I integrate AI in different areas of my workflows for improved efficiency and outcomes across different applications.
          </p>
          <a href="#" className="text-sm font-sans underline underline-offset-4">Learn more</a>
        </div>
        <div className="p-6 md:p-12">
          <span className="label mb-4 block">Scalability</span>
          <h3 className="text-2xl font-sans font-medium mb-6">Design Across Touchpoints</h3>
          <p className="text-ink/85 mb-8 max-w-md">
            I help brands clearly express their value across every customer interaction. Transforming insights and brand values into visual design systems, I ensure quality, consistency, and brand scalability.
          </p>
          <a href="#" className="text-sm font-sans underline underline-offset-4">Take a quick look</a>
        </div>
      </section>

      {/* About Section */}
      <section className="p-6 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-bg" style={{ backgroundColor: '#F3F3F3' }}>
        <div className="relative aspect-[4/5] max-w-md mx-auto lg:mx-0">
          <div className="absolute inset-0 border border-ink translate-x-4 translate-y-4 -z-10" />
          <img
            src="https://picsum.photos/seed/daniel/800/1000"
            alt="Daniel Román"
            className="w-full h-full object-cover border border-ink grayscale hover:grayscale-0 transition-all duration-700"
            referrerPolicy="no-referrer"
          />
        </div>
        <div>
          <h3 className="text-4xl md:text-5xl font-sans font-medium mb-8 leading-tight">
            International perspective shapes my design
          </h3>
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

      {/* Footer */}
      <footer className="p-6 md:p-12 bg-ink text-bg">
        <div className="flex flex-col md:flex-row justify-between items-end gap-12">
          <div className="flex flex-col gap-4">
            <h4 className="text-3xl font-sans font-medium">Daniel Román</h4>
            <div className="label text-bg/50">
              Product Designer<br />
              Based in Seattle, WA
            </div>
            <a href="mailto:hello@danielromandesign.com" className="text-lg border-b border-bg/20 hover:border-bg transition-colors">
              hello@danielromandesign.com
            </a>
          </div>

          <div className="flex flex-col items-end gap-6">
            <div className="flex gap-6">
              <a href="#" className="hover:text-accent transition-colors" aria-label="LinkedIn"><Linkedin size={24} /></a>
              <a href="#" className="hover:text-accent transition-colors" aria-label="GitHub"><Github size={24} /></a>
              <a href="#" className="hover:text-accent transition-colors" aria-label="Email"><Mail size={24} /></a>
            </div>
            <div className="label text-[10px] text-bg/30">
              © 2026 Daniel Román. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
      </main>
    </div>
  );
}
