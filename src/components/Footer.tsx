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
          className="absolute inset-0 z-0 h-full min-h-[clamp(160px,22vh,100%)] w-full touch-none select-none"
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
          className={`absolute inset-0 z-[1] min-h-[clamp(130px,21vh,100%)] w-full touch-none select-none transition-opacity duration-300 ease-out ${
            euphoriaVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
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
          'relative z-10 font-body',
          isFloating
            ? 'pointer-events-none mx-auto flex w-full max-w-[1180px] flex-col gap-10 md:flex-row md:items-end md:justify-between md:gap-12'
            : 'pointer-events-none flex min-h-[156px] flex-col justify-end px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-8 sm:px-6 md:min-h-[247px] md:px-12 md:pb-8 md:pt-[104px]',
        ].join(' ')}
      >
        <div
          className={
            isFloating
              ? 'flex min-w-0 flex-col gap-4 md:max-w-[min(100%,22rem)]'
              : 'flex w-full min-w-0 flex-col items-start gap-5 md:flex-row md:items-end md:justify-between md:gap-8'
          }
        >
          <div
            className={
              isFloating
                ? 'site-footer-copy-block pointer-events-auto relative -mx-3 w-fit max-w-full rounded-2xl px-3 py-2 sm:-mx-4 sm:px-4'
                : `flex min-w-0 flex-col ${isFloating ? 'gap-2.5' : 'gap-3'}`
            }
          >
            <div className={`relative z-[1] flex min-w-0 flex-col ${isFloating ? 'gap-2.5' : 'gap-3'}`}>
              <h3
                id="footer-daniel-name"
                className={[
                  'site-footer-copy-text m-0 text-[length:var(--text-body)] font-semibold leading-relaxed transition-colors duration-300',
                  inkClass,
                ].join(' ')}
              >
                Daniel Román
              </h3>
              <div
                className={[
                  'site-footer-copy-text site-footer-copy-muted text-[length:var(--text-small)] leading-relaxed transition-colors duration-300',
                  inkClass,
                  isFloating ? 'opacity-80' : '',
                ].join(' ')}
              >
                Product Designer
                <br />
                Based in Seattle, WA
              </div>
              <a
                href="tel:+12067711518"
                className={[
                  'site-footer-copy-link pointer-events-auto text-[length:var(--text-small)] leading-relaxed transition-[color,opacity] duration-300 hover:opacity-70',
                  inkClass,
                ].join(' ')}
              >
                (206) 771-1518
              </a>
              <a
                href="mailto:danielromarr@gmail.com"
                className={[
                  'site-footer-copy-link pointer-events-auto text-[length:var(--text-small)] leading-relaxed transition-[color,opacity] duration-300 hover:opacity-70',
                  inkClass,
                ].join(' ')}
              >
                danielromarr@gmail.com
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
                  className="pointer-events-auto transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  aria-label="LinkedIn"
                >
                  <LinkedinFilledIcon className="h-6 w-6 shrink-0" />
                </a>
              </div>
              <div className="text-right text-[length:var(--text-small)] leading-relaxed text-white">
                © 2026 Daniel Román. All rights reserved.
              </div>
            </div>
          ) : null}
        </div>

        {isFloating ? (
          <div className="flex w-full flex-col items-start gap-5 md:w-auto md:items-end md:gap-6">
            <a
              href="https://www.linkedin.com/in/daniel-roman-design"
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto text-navy-deep transition-opacity hover:opacity-65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-deep/40"
              aria-label="LinkedIn"
            >
              <LinkedinFilledIcon className="h-7 w-7 shrink-0" />
            </a>
            <p className="m-0 text-[length:var(--text-small)] leading-relaxed text-navy-deep/70 md:text-right">
              © 2026 Daniel Román. All rights reserved.
            </p>
          </div>
        ) : null}
      </div>
    </footer>
  );
}
