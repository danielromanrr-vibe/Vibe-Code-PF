import { Linkedin, Github, Mail } from 'lucide-react';

export default function Footer({ className = '' }: { className?: string }) {
  return (
    <footer
      className={`mt-12 md:mt-24 p-6 md:p-12 bg-ink font-body text-white ${className}`.trim()}
    >
      <div className="flex flex-col md:flex-row justify-between items-end gap-12">
        <div className="flex flex-col gap-4">
          <p className="m-0 text-[length:var(--text-body)] leading-relaxed text-white">
            Daniel Román
          </p>
          <div className="text-[length:var(--text-small)] leading-relaxed text-white/90">
            Product Designer
            <br />
            Based in Seattle, WA
          </div>
          <a
            href="mailto:hello@danielromandesign.com"
            data-cursor="hand"
            className="border-b border-white/40 text-[length:var(--text-body)] leading-relaxed text-white transition-colors hover:border-white"
          >
            hello@danielromandesign.com
          </a>
        </div>
        <div className="flex flex-col items-end gap-6">
          <div className="flex gap-6">
            <a
              href="#"
              data-cursor="hand"
              className="text-white transition-colors hover:text-white/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              aria-label="LinkedIn"
            >
              <Linkedin size={24} strokeWidth={1.75} />
            </a>
            <a
              href="#"
              data-cursor="hand"
              className="text-white transition-colors hover:text-white/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              aria-label="GitHub"
            >
              <Github size={24} strokeWidth={1.75} />
            </a>
            <a
              href="#"
              data-cursor="hand"
              className="text-white transition-colors hover:text-white/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              aria-label="Email"
            >
              <Mail size={24} strokeWidth={1.75} />
            </a>
          </div>
          <div className="text-center text-[length:var(--text-small)] leading-relaxed text-white md:text-right">
            © 2026 Daniel Román. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
