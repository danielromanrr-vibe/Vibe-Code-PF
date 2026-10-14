import { useEffect, useRef, useState } from 'react';
import { LinkedinFilledIcon } from './icons/LinkedinFilledIcon';
import MandalaBanner from './MandalaBanner';
import { footerAvailability } from '../content/home';
import { footer } from '../content/site';

/** Wait this long after pointer enters before showing the banner (avoids accidental palette churn). */
const EUPHORIA_SHOW_DEBOUNCE_MS = 120;
/** Min time between palette regenerations when re-hovering quickly. */
const EUPHORIA_PALETTE_COOLDOWN_MS = 400;

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
 * Footer field — faint mandala banner behind the copy.
 * Hover (or keyboard focus) fades in a fuller colored banner with a fresh palette.
 */
export default function Footer({ className = '', id }: FooterProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [euphoriaVisible, setEuphoriaVisible] = useState(false);
  const [euphoriaPaletteKey, setEuphoriaPaletteKey] = useState(0);
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPaletteBumpRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (showTimerRef.current) clearTimeout(showTimerRef.current);
    };
  }, []);

  const cancelPendingShow = () => {
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
  };

  const scheduleReveal = () => {
    cancelPendingShow();
    showTimerRef.current = setTimeout(() => {
      showTimerRef.current = null;
      const now = Date.now();
      if (
        lastPaletteBumpRef.current === null ||
        now - lastPaletteBumpRef.current >= EUPHORIA_PALETTE_COOLDOWN_MS
      ) {
        lastPaletteBumpRef.current = now;
        setEuphoriaPaletteKey((k) => k + 1);
      }
      setEuphoriaVisible(true);
    }, EUPHORIA_SHOW_DEBOUNCE_MS);
  };

  const hideOverlay = () => {
    cancelPendingShow();
    setEuphoriaVisible(false);
  };

  return (
    <footer
      ref={rootRef}
      id={id}
      className={[
        'site-footer--floating relative flex min-h-[clamp(20rem,42vh,32rem)] shrink-0 flex-col justify-end overflow-hidden bg-transparent',
        euphoriaVisible ? 'is-hot' : '',
        'px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-32 sm:px-6 md:px-12 md:pb-10 md:pt-48',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onMouseEnter={scheduleReveal}
      onMouseLeave={hideOverlay}
      onFocusCapture={scheduleReveal}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) hideOverlay();
      }}
    >
      <div className="site-footer-field" aria-hidden>
        <div className="absolute inset-0 opacity-[0.2] [filter:grayscale(1)_saturate(0.34)]">
          <MandalaBanner
            fullBleed
            interactive
            paletteVersion={0}
            intensity={22}
            ecoMode
            className="h-full min-h-0 w-full min-w-0"
          />
        </div>
        <div
          className={`absolute inset-0 transition-opacity duration-300 ease-out ${
            euphoriaVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          <MandalaBanner
            fullBleed
            interactive
            paletteVersion={euphoriaPaletteKey}
            intensity={88}
            ecoMode
            suspendAnimation={!euphoriaVisible}
            className="h-full min-h-0 w-full min-w-0"
          />
        </div>
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
          <div className="flex flex-col items-start gap-3 md:items-end">
            <p className="site-footer-legal m-0 whitespace-nowrap text-navy-deep/65 md:text-right">
              {footer.legal}
            </p>
            {footerAvailability ? (
              <p className="site-footer-availability m-0 whitespace-nowrap text-navy-deep/65 md:text-right">
                {footerAvailability}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
