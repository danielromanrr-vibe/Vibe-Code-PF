import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { LinkedinFilledIcon } from './icons/LinkedinFilledIcon';
import FooterConstellation from './FooterConstellation';
import FooterSkyTrail from './FooterSkyTrail';
import { footer } from '../content/site';

type FooterProps = {
  className?: string;
  id?: string;
};

/** Canonical site footer — floating, contact-first. Same on every page. */
export function SiteFooter({ className = '' }: { className?: string }) {
  return (
    <Footer
      id="site-footer"
      className={['relative z-40', className].filter(Boolean).join(' ')}
    />
  );
}

/**
 * Footer field — sparse editorial sky, not a second hero mandala.
 * Atmosphere is a quiet constellation; pointer leaves celebration-ink trails.
 */
export default function Footer({ className = '', id }: FooterProps) {
  const rootRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [gathered, setGathered] = useState(false);
  const [hot, setHot] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (reduceMotion) {
      setGathered(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setGathered(Boolean(entry?.isIntersecting)),
      { threshold: 0.2, rootMargin: '0px 0px -4% 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduceMotion]);

  const heatOn = () => setHot(true);
  const heatOff = () => setHot(false);

  return (
    <footer
      ref={rootRef}
      id={id}
      className={[
        'site-footer--floating relative flex min-h-[clamp(220px,32vh,380px)] shrink-0 flex-col justify-end overflow-hidden bg-transparent',
        gathered ? 'is-gathered' : '',
        hot ? 'is-hot' : '',
        'px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-10 sm:px-6 md:px-12 md:pb-10 md:pt-14',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onMouseEnter={heatOn}
      onMouseLeave={heatOff}
      onFocusCapture={heatOn}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) heatOff();
      }}
    >
      <div className="site-footer-field" aria-hidden>
        <FooterSkyTrail live={gathered} hot={hot} />
        <FooterConstellation />
      </div>
      <div className="site-footer-content pointer-events-none relative z-20 isolate mx-auto flex w-full max-w-[1180px] flex-col gap-10 font-body md:flex-row md:items-end md:justify-between md:gap-12">
        <div className="flex min-w-0 flex-col gap-4 md:max-w-[min(100%,30rem)]">
          <div className="site-footer-copy flex min-w-0 flex-col">
            <div
              className="site-footer-group site-footer-group--title"
              role="group"
              aria-labelledby="footer-daniel-name"
            >
              <h3 id="footer-daniel-name" className="site-footer-name m-0 text-navy-deep">
                {footer.h3}
              </h3>
            </div>
            <div
              className="site-footer-group site-footer-group--contact site-footer-contact-panel"
              role="group"
              aria-label="Contact"
            >
              <a
                href={footer.telHref}
                className="site-footer-contact-row site-footer-action pointer-events-auto"
              >
                <span className="site-footer-contact-label">{footer.telLabel}</span>
                <span className="site-footer-contact-value">{footer.tel}</span>
              </a>
              <a
                href={footer.emailHref}
                className="site-footer-contact-row site-footer-action pointer-events-auto"
              >
                <span className="site-footer-contact-label">{footer.emailLabel}</span>
                <span className="site-footer-contact-value">{footer.email}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col items-start gap-5 md:w-auto md:items-end md:gap-6">
          <a
            href={footer.linkedinHref}
            target="_blank"
            rel="noopener noreferrer"
            className="site-footer-action site-footer-social-action pointer-events-auto text-navy-deep"
            aria-label={footer.linkedinLabel}
          >
            <LinkedinFilledIcon className="h-7 w-7 shrink-0" />
          </a>
          <p className="site-footer-legal m-0 text-navy-deep/65 md:text-right">
            {footer.legal}
          </p>
        </div>
      </div>
    </footer>
  );
}
