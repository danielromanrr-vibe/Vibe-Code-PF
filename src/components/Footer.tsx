import { useEffect, useRef, useState } from 'react';
import MandalaBanner from './MandalaBanner';
import { LinkedinFilledIcon } from './icons/LinkedinFilledIcon';

/** Wait this long after pointer enters before showing overlay (avoids accidental palette churn). */
const EUPHORIA_SHOW_DEBOUNCE_MS = 120;
/** Min time between palette regenerations when re-hovering quickly. */
const EUPHORIA_PALETTE_COOLDOWN_MS = 400;

export default function Footer({ className = '', id }: { className?: string; id?: string }) {
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
      id={id}
      onPointerEnter={scheduleReveal}
      onPointerLeave={hideOverlay}
      className={`relative z-0 mt-[52px] shrink-0 overflow-hidden bg-ink md:mt-[104px] ${className}`.trim()}
    >
      {/* Euphoria mandala: full-bleed canvas; shown only while pointer is over the footer. */}
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

      <div
        className="pointer-events-none relative z-10 flex min-h-[156px] flex-col justify-end px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-8 sm:px-6 md:min-h-[247px] md:px-12 md:pb-8 md:pt-[104px] font-body text-white"
      >
        <div className="flex w-full min-w-0 flex-col items-start gap-5 md:flex-row md:items-end md:justify-between md:gap-8">
          <div className="flex min-w-0 flex-col gap-3">
            <h3
              id="footer-daniel-name"
              className="m-0 text-[length:var(--text-body)] font-semibold leading-relaxed text-white"
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
              className="pointer-events-auto text-[length:var(--text-small)] leading-relaxed"
            >
              (206) 771-1518
            </a>
            <a
              href="mailto:danielromarr@gmail.com"
              className="pointer-events-auto text-[length:var(--text-small)] leading-relaxed"
            >
              danielromarr@gmail.com
            </a>
          </div>
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
        </div>
      </div>
    </footer>
  );
}
