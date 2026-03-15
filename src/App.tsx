import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Github, Linkedin, Mail, Clock } from 'lucide-react';
import Mandala from './components/Mandala';
import CustomCursor from './components/CustomCursor';

export default function App() {
  const [time, setTime] = useState(new Date());

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
    <div className="min-h-screen selection:bg-accent selection:text-white overflow-x-hidden bg-bg" style={{ backgroundColor: '#E4E3E0' }}>
      <CustomCursor />
      <Mandala />

      <main className="relative z-20">
      {/* Hero Section — transparent so mandala shows through behind */}
      <section className="relative h-[60vh] md:h-[70vh] flex flex-col border-b border-ink/20 bg-transparent">
        <header className="relative z-20 p-6 md:p-12 flex justify-between items-start pointer-events-none">
          <div className="flex flex-col relative">
            <div className="relative inline-block">
              <div id="mandala-home" className="absolute inset-0 flex items-center justify-center -z-10" />
              <span className="mono-label mb-2 block">Portfolio v.2026</span>
              <h1 className="text-4xl md:text-6xl italic font-serif relative">Daniel Román</h1>
            </div>
          </div>

          <div className="flex flex-col items-end text-right">
            <div className="flex items-center gap-2 mono-label mb-1">
              <Clock size={12} />
              <span>Precision Time</span>
            </div>
            <span className="font-mono text-xl md:text-2xl tracking-tighter">
              {formatTime(time)}
            </span>
          </div>
        </header>

        <div className="mt-auto relative z-10 p-6 md:p-12 max-w-3xl">
          <h2 className="text-3xl md:text-5xl leading-[1.1] mb-6 text-ink/95">
            Product designer scaling real-world systems for impact
          </h2>
          <div className="flex gap-4">
            <a href="mailto:hello@danielromandesign.com" className="mono-label border border-ink/40 px-4 py-2 rounded-full hover:bg-ink hover:text-bg hover:opacity-100 transition-all duration-300">
              Get in touch
            </a>
          </div>
        </div>
      </section>

      {/* Highlights Bento Grid */}
      <section className="p-6 md:p-12 bg-bg">
        <div className="flex items-center gap-4 mb-12">
          <h3 className="text-2xl italic">Highlights</h3>
          <div className="h-[1px] flex-grow bg-ink/20" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            whileHover={{ y: -4 }}
            className="group relative bg-white border border-ink p-8 flex flex-col justify-between h-[300px] shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] hover:shadow-[12px_12px_0px_0px_rgba(20,20,20,1)] transition-all duration-300"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="mono-label">Case Study 01</span>
                <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h4 className="text-2xl font-serif mb-4">Adopt a School</h4>
              <p className="text-ink/85 leading-relaxed">
                Solo re-designed a Seattle NGO volunteer program for scale ($0 → $20k a yr.)
              </p>
            </div>
            <a href="#" className="text-sm font-mono underline underline-offset-4 hover:text-accent transition-colors">
              View case study
            </a>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="group relative bg-white border border-ink p-8 flex flex-col justify-between h-[300px] shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] hover:shadow-[12px_12px_0px_0px_rgba(20,20,20,1)] transition-all duration-300"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="mono-label">Case Study 02</span>
                <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h4 className="text-2xl font-serif mb-4">Atlas</h4>
              <p className="text-ink/85 leading-relaxed">
                Custom database to scale & transform b2b operation.
              </p>
            </div>
            <a href="#" className="text-sm font-mono underline underline-offset-4 hover:text-accent transition-colors">
              View case study
            </a>
          </motion.div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="p-6 md:p-12 border-y border-ink/20 bg-bg">
        <div className="max-w-4xl">
          <span className="mono-label mb-6 block">Professional Trajectory</span>
          <h3 className="text-3xl md:text-4xl mb-8 italic">Working with cross-functional teams</h3>
          <p className="text-xl md:text-2xl leading-relaxed text-ink/90">
            At <span className="text-ink font-medium">Amazon</span>, boosted production efficiency by 50% by testing and feedback new production workflows in real scenarios. At <span className="text-ink font-medium">DBS</span>, evolved design systems for bar-raising creative outcomes on 30+ pages for Alexa+. At <span className="text-ink font-medium">Covantis</span>, improved demo-to-adoption by 20% through web design; & at <span className="text-ink font-medium">Ajediam</span>, as foundation designer, led the startup from 50 to 400+ users with a 24% return rate increase in a year.
          </p>
          <div className="mt-12">
            <a href="#" className="inline-flex items-center gap-2 group">
              <span className="text-lg font-serif italic border-b border-ink/20 group-hover:border-ink transition-colors">View featured work</span>
              <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* Grid Sections */}
      <section className="grid grid-cols-1 md:grid-cols-2 border-b border-ink/20 bg-bg">
        <div className="p-6 md:p-12 border-b md:border-b-0 md:border-r border-ink/20">
          <span className="mono-label mb-4 block">Innovation</span>
          <h3 className="text-2xl font-serif mb-6">Designing with AI</h3>
          <p className="text-ink/85 mb-8 max-w-md">
            Learn more about how I integrate AI in different areas of my workflows for improved efficiency and outcomes across different applications.
          </p>
          <a href="#" className="text-sm font-mono underline underline-offset-4">Learn more</a>
        </div>
        <div className="p-6 md:p-12">
          <span className="mono-label mb-4 block">Scalability</span>
          <h3 className="text-2xl font-serif mb-6">Design Across Touchpoints</h3>
          <p className="text-ink/85 mb-8 max-w-md">
            I help brands clearly express their value across every customer interaction. Transforming insights and brand values into visual design systems, I ensure quality, consistency, and brand scalability.
          </p>
          <a href="#" className="text-sm font-mono underline underline-offset-4">Take a quick look</a>
        </div>
      </section>

      {/* About Section */}
      <section className="p-6 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-bg">
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
          <h3 className="text-4xl md:text-5xl font-serif italic mb-8 leading-tight">
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
            <h4 className="text-3xl font-serif italic">Daniel Román</h4>
            <div className="mono-label text-bg/50">
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
            <div className="mono-label text-[10px] text-bg/30">
              © 2026 Daniel Román. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
      </main>
    </div>
  );
}
