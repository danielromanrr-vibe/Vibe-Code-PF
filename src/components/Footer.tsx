import { Linkedin, Github, Mail } from 'lucide-react';

export default function Footer({ className = '' }: { className?: string }) {
  return (
    <footer
      className={`mt-24 flex min-h-[280px] flex-col justify-end bg-ink px-4 pb-6 pt-12 sm:px-6 md:mt-[160px] md:min-h-[420px] md:px-12 md:pb-12 md:pt-[160px] font-body text-white ${className}`.trim()}
    >
      <div className="flex w-full min-w-0 flex-col items-start gap-8 md:flex-row md:items-end md:justify-between md:gap-12">
        <div className="flex min-w-0 flex-col gap-4">
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
            className="break-words border-b border-white/40 text-[length:var(--text-body)] leading-relaxed text-white transition-colors hover:border-white"
          >
            hello@danielromandesign.com
          </a>
        </div>
        <div className="flex w-full flex-col items-end gap-6 sm:w-auto">
          <div className="flex gap-6">
            <a
              href="https://www.linkedin.com/in/daniel-roman-design"
              target="_blank"
              rel="noopener noreferrer"
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
          <div className="text-right text-[length:var(--text-small)] leading-relaxed text-white">
            © 2026 Daniel Román. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
