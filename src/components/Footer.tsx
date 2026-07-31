import { useEffect, useRef, useState } from 'react';
import MandalaBanner from './MandalaBanner';
import { LinkedinFilledIcon } from './icons/LinkedinFilledIcon';

/** Wait this long after pointer enters before showing overlay (avoids accidental palette churn). */
const EUPHORIA_SHOW_DEBOUNCE_MS = 120;
/** Min time between palette regenerations when re-hovering quickly. */
const EUPHORIA_PALETTE_COOLDOWN_MS = 400;

type FooterVariant = 'bookend' | 'floating';

type FooterProps = {
  className?: string;
  id?: string;
  /** `floating` — no background, navy copy + banner-style mandala on hover; `bookend` — dark navy strip */
  variant?: FooterVariant;
};

/** Canonical site footer — floating mandala footer on every page. */
export function SiteFooter({ className = '' }: { className?: string }) {
  return (
    <Footer
      id="site-footer"
      variant="floating"
      className={['relative z-40', className].filter(Boolean).join(' ')}
    />
  );
}

export default function Footer({ className = '', id, variant = 'bookend' }: FooterProps) {
  const isFloating = variant === 'floating';
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

  const inkClass = isFloating ? 'text-navy-deep' : 'text-white';

  return (
    <footer
      id={id}
      onPointerEnter={scheduleReveal}
      onPointerLeave={hideOverlay}
      className={[
        'relative shrink-0 overflow-hidden',
        isFloating
          ? 'site-footer--floating mt-[180px] min-h-[clamp(200px,26vh,320px)] bg-transparent px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 sm:px-6 md:px-12 md:pb-10'
          : 'border-t border-white/[0.08] bg-navy-deep mt-[52px] md:mt-[104px]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={isFloating ? undefined : { backgroundColor: 'var(--color-navy-deep, #0c1528)' }}
    >
      {isFloating ? (
        <div
          className="site-footer-mandala-layer absolute inset-0 z-0 h-full min-h-[clamp(160px,22vh,100%)] w-full touch-none select-none pointer-events-none"
          style={{
            maskImage:
              'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.45) 18%, rgba(0,0,0,1) 42%, rgba(0,0,0,1) 72%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.45) 18%, rgba(0,0,0,1) 42%, rgba(0,0,0,1) 72%, rgba(0,0,0,0) 100%)',
          }}
          aria-hidden
        >
          <div className="absolute inset-0 opacity-[0.2] [filter:grayscale(1)_saturate(0.34)]" aria-hidden>
            <MandalaBanner
              fullBleed
              interactive
              paletteVersion={0}
              intensity={22}
              ecoMode
              className="h-full min-h-[clamp(140px,20vh,100%)] w-full min-w-0"
            />
          </div>
          <div
            className={`absolute inset-0 transition-opacity duration-300 ease-out ${
              euphoriaVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
            aria-hidden
          >
            <MandalaBanner
              fullBleed
              interactive
              paletteVersion={euphoriaPaletteKey}
              intensity={88}
              ecoMode
              suspendAnimation={!euphoriaVisible}
              className="h-full min-h-[clamp(140px,20vh,100%)] w-full min-w-0"
            />
          </div>
        </div>
      ) : (
        <div
          className={`site-footer-mandala-layer absolute inset-0 z-0 min-h-[clamp(130px,21vh,100%)] w-full touch-none select-none pointer-events-none transition-opacity duration-300 ease-out ${
            euphoriaVisible ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden
        >
          <MandalaBanner
            fullBleed
            interactive
            onDarkBackground
            paletteVersion={euphoriaPaletteKey}
            className="h-full min-h-[clamp(117px,18vh,100%)] w-full min-w-0"
          />
        </div>
      )}

      <div
        className={[
          'site-footer-content relative z-20 isolate font-body',
          isFloating
            ? 'pointer-events-none mx-auto flex w-full max-w-[1180px] flex-col gap-10 md:flex-row md:items-end md:justify-between md:gap-12'
            : 'pointer-events-none flex min-h-[156px] flex-col justify-end px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-8 sm:px-6 md:min-h-[247px] md:px-12 md:pb-8 md:pt-[104px]',
        ].join(' ')}
      >
        <div
          className={
            isFloating
              ? 'flex min-w-0 flex-col gap-4 md:max-w-[min(100%,30rem)]'
              : 'flex w-full min-w-0 flex-col items-start gap-5 md:flex-row md:items-end md:justify-between md:gap-8'
          }
        >
          <div className="site-footer-copy flex min-w-0 flex-col">
            <div className="site-footer-group site-footer-group--title" role="group" aria-labelledby="footer-daniel-name">
              <h3 id="footer-daniel-name" className={`site-footer-name m-0 ${inkClass}`}>
                Daniel Román
              </h3>
            </div>
            <div className="site-footer-group site-footer-group--subtitle" role="group" aria-label="Role and location">
              <p className={`site-footer-role m-0 ${inkClass}`}>
                Product Designer
                <span className="site-footer-role-sep" aria-hidden>
                  {' '}
                  ·{' '}
                </span>
                Seattle, WA
              </p>
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
                href="mailto:danielromarr@gmail.com"
                className="site-footer-contact-row site-footer-action pointer-events-auto"
              >
                <span className="site-footer-contact-label">Email</span>
                <span className="site-footer-contact-value">danielromarr@gmail.com</span>
              </a>
            </div>
          </div>

          {!isFloating ? (
            <div className="flex w-full flex-col items-end gap-4 sm:w-auto">
              <div className="flex flex-wrap items-center justify-end gap-4">
                <a
                  href="https://www.linkedin.com/in/daniel-roman-design"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-footer-action site-footer-social-action pointer-events-auto"
                  aria-label="LinkedIn"
                >
                  <LinkedinFilledIcon className="h-6 w-6 shrink-0" />
                </a>
              </div>
              <p className="site-footer-legal m-0 text-right text-white">
                © 2026 Daniel Román. All rights reserved.
              </p>
            </div>
          ) : null}
        </div>

        {isFloating ? (
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
        ) : null}
      </div>
    </footer>
  );
}
