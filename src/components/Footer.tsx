import { Linkedin, Github, Mail } from 'lucide-react';

export default function Footer({ className = '' }: { className?: string }) {
  return (
    <footer className={`p-6 md:p-12 bg-ink text-bg ${className}`.trim()}>
      <div className="flex flex-col md:flex-row justify-between items-end gap-12">
        <div className="flex flex-col gap-4">
          <h4 className="text-3xl font-sans font-medium">Daniel Román</h4>
          <div className="label text-bg/50">
            Product Designer<br />
            Based in Seattle, WA
          </div>
          <a href="mailto:hello@danielromandesign.com" data-cursor="hand" className="text-lg border-b border-bg/20 hover:border-bg transition-colors">
            hello@danielromandesign.com
          </a>
        </div>
        <div className="flex flex-col items-end gap-6">
          <div className="flex gap-6">
            <a href="#" data-cursor="hand" className="hover:text-accent transition-colors" aria-label="LinkedIn"><Linkedin size={24} /></a>
            <a href="#" data-cursor="hand" className="hover:text-accent transition-colors" aria-label="GitHub"><Github size={24} /></a>
            <a href="#" data-cursor="hand" className="hover:text-accent transition-colors" aria-label="Email"><Mail size={24} /></a>
          </div>
          <div className="label text-[10px] text-bg/30">
            © 2026 Daniel Román. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
