import { LinkedinFilledIcon } from './icons/LinkedinFilledIcon';

export default function Footer({ className = '', id }: { className?: string; id?: string }) {
  return (
    <footer
      id={id}
      className={`relative z-0 mt-[80px] flex min-h-[240px] shrink-0 flex-col justify-end overflow-visible bg-ink px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-12 sm:px-6 md:mt-[160px] md:min-h-[380px] md:px-12 md:pb-12 md:pt-[160px] font-body text-white ${className}`.trim()}
    >
      <div className="flex w-full min-w-0 flex-col items-start gap-8 md:flex-row md:items-end md:justify-between md:gap-12">
        <div className="flex min-w-0 flex-col gap-4">
          <h3
            id="footer-daniel-name"
            className="m-0 !text-[18px] !font-semibold !leading-relaxed !text-white"
          >
            Daniel Román
          </h3>
          <div className="text-[length:var(--text-small)] leading-relaxed text-white">
            Product Designer
            <br />
            Based in Seattle, WA
          </div>
          <a
            href="tel:+12067711518"
            data-cursor="hand"
            className="text-[length:var(--text-small)] leading-relaxed"
          >
            (206) 771-1518
          </a>
          <a
            href="mailto:danielromarr@gmail.com"
            data-cursor="hand"
            className="text-[length:var(--text-small)] leading-relaxed"
          >
            danielromarr@gmail.com
          </a>
        </div>
        <div className="flex w-full flex-col items-end gap-6 sm:w-auto">
          <div className="flex flex-wrap items-center justify-end gap-6">
            <a
              href="https://www.linkedin.com/in/daniel-roman-design"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hand"
              className="transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              aria-label="LinkedIn"
            >
              <LinkedinFilledIcon className="h-6 w-6 shrink-0" />
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
