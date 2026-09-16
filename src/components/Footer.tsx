import { LinkedinFilledIcon } from './icons/LinkedinFilledIcon';

type FooterProps = {
  className?: string;
  id?: string;
};

/** Canonical site footer — floating, contact-first, no mandala. Same on every page. */
export function SiteFooter({ className = '' }: { className?: string }) {
  return (
    <Footer
      id="site-footer"
      className={['relative z-40', className].filter(Boolean).join(' ')}
    />
  );
}

export default function Footer({ className = '', id }: FooterProps) {
  return (
    <footer
      id={id}
      className={[
        'site-footer--floating relative shrink-0 overflow-hidden bg-transparent',
        'mt-[180px] min-h-[clamp(200px,26vh,320px)]',
        'px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 sm:px-6 md:px-12 md:pb-10',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="site-footer-content pointer-events-none relative z-20 isolate mx-auto flex w-full max-w-[1180px] flex-col gap-10 font-body md:flex-row md:items-end md:justify-between md:gap-12">
        <div className="flex min-w-0 flex-col gap-4 md:max-w-[min(100%,30rem)]">
          <div className="site-footer-copy flex min-w-0 flex-col">
            <div
              className="site-footer-group site-footer-group--title"
              role="group"
              aria-labelledby="footer-daniel-name"
            >
              <h3 id="footer-daniel-name" className="site-footer-name m-0 text-navy-deep">
                Daniel Román • Based in Seattle, WA
              </h3>
            </div>
            <div
              className="site-footer-group site-footer-group--contact site-footer-contact-panel"
              role="group"
              aria-label="Contact"
            >
              <a
                href="tel:+12067711518"
                className="site-footer-contact-row site-footer-action pointer-events-auto"
              >
                <span className="site-footer-contact-label">Tel</span>
                <span className="site-footer-contact-value">206.771.1518</span>
              </a>
              <a
                href="mailto:hello@danielroman.design"
                className="site-footer-contact-row site-footer-action pointer-events-auto"
              >
                <span className="site-footer-contact-label">Email</span>
                <span className="site-footer-contact-value">hello@danielroman.design</span>
              </a>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col items-start gap-5 md:w-auto md:items-end md:gap-6">
          <a
            href="https://www.linkedin.com/in/daniel-roman-design"
            target="_blank"
            rel="noopener noreferrer"
            className="site-footer-action site-footer-social-action pointer-events-auto text-navy-deep"
            aria-label="LinkedIn"
          >
            <LinkedinFilledIcon className="h-7 w-7 shrink-0" />
          </a>
          <p className="site-footer-legal m-0 text-navy-deep/65 md:text-right">
            © 2026 Daniel Román. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
