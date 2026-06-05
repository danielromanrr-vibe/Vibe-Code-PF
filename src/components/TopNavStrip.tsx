import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import NavBrandingMount from './euphoriaMandala/NavBrandingMount';
import { useIdentityClusterReveal } from './useIdentityClusterReveal';

export type TopNavPage = 'home' | 'adopt' | 'ai' | 'brand' | 'about' | 'cv';

export type TopNavSurface = 'default' | 'media' | 'hero';

const PAGE_LABEL: Record<Exclude<TopNavPage, 'home'>, string> = {
  adopt: 'Adopt-a-School',
  ai: 'Designing with AI',
  brand: 'Brand Identity',
  about: 'About',
  cv: 'CV',
};

type TopNavStripProps = {
  page: TopNavPage;
  onHomeClick: () => void;
  onAboutClick: () => void;
  onCvClick: () => void;
  /** Stable unique id for the nav mandala anchor (multiple strips can mount at once). */
  mandalaAnchorId?: string;
  /** Previous page label shown next to the back arrow (both are highlighted as one control). */
  backLabel?: string;
  /** Defaults to `onHomeClick`. Pass `() => navigate(-1)` when using URL routes and history back is desired. */
  onBack?: () => void;
  className?: string;
  /** `hero` / `media` = light type over dark or photographic backgrounds; `default` = legible on page gray. */
  surface?: TopNavSurface;
};

const SHELL_TRANSITION =
  'transition-[background-color,border-color,box-shadow] duration-200 ease-out motion-reduce:transition-none';

const backControlDefault =
  'inline-flex max-w-[min(100%,11rem)] shrink-0 items-center gap-1 rounded px-1 py-0.5 -ml-1 font-medium text-ink/88 transition-colors hover:bg-ink/[0.06] hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(248,249,250,0.94)]';

const backControlMedia =
  'inline-flex max-w-[min(100%,11rem)] shrink-0 items-center gap-1 rounded px-1 py-0.5 -ml-1 font-medium text-white/92 transition-colors [text-shadow:0_1px_3px_rgba(0,0,0,0.28)] hover:bg-white/12 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent';

const SHELL_CLASS: Record<TopNavSurface, string> = {
  hero:
    'border-b border-white/10 bg-[#0c1528]/22 backdrop-blur-sm supports-[backdrop-filter]:bg-[#0c1528]/18',
  media:
    'border-b border-white/20 bg-[#0c1528]/28 backdrop-blur-md supports-[backdrop-filter]:bg-[#0c1528]/22 shadow-[0_1px_0_rgba(255,255,255,0.06)_inset]',
  default:
    'border-b border-ink/[0.08] bg-[rgba(248,249,250,0.94)] backdrop-blur-[8px] shadow-[0_1px_0_rgba(12,21,40,0.04)]',
};

/**
 * Quiet wayfinding + identity strip.
 * Editorial, compact — glass only on hero/media; default is always legible on light page gray.
 *
 * **Identity slot:** default = “Daniel Román” only; hover/focus = mandala replaces the name in the same box
 * (no horizontal push). Canvas still clips to `#anchorId`; activation breaks out to the full viewport.
 */
export default function TopNavStrip({
  page,
  onHomeClick,
  onAboutClick,
  onCvClick,
  mandalaAnchorId = 'mandala-nav',
  backLabel = 'Home',
  onBack,
  className = '',
  surface = 'default',
}: TopNavStripProps) {
  const isHome = page === 'home';
  const goBack = onBack ?? onHomeClick;
  const [coarsePointerNav, setCoarsePointerNav] = useState(false);
  const [forceSolidNav, setForceSolidNav] = useState(false);
  const {
    identityRevealed: navMandalaRevealed,
    mandalaSessionStamp,
    nameButtonHandlers,
    identitySlotPointerHandlers,
  } = useIdentityClusterReveal();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const coarseMq = window.matchMedia('(pointer: coarse)');
    const syncCoarse = () => setCoarsePointerNav(coarseMq.matches);
    syncCoarse();
    coarseMq.addEventListener('change', syncCoarse);
    return () => coarseMq.removeEventListener('change', syncCoarse);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const contrastMq = window.matchMedia('(prefers-contrast: more)');
    const transparencyMq = window.matchMedia('(prefers-reduced-transparency: reduce)');
    const syncA11y = () => setForceSolidNav(contrastMq.matches || transparencyMq.matches);
    syncA11y();
    contrastMq.addEventListener('change', syncA11y);
    transparencyMq.addEventListener('change', syncA11y);
    return () => {
      contrastMq.removeEventListener('change', syncA11y);
      transparencyMq.removeEventListener('change', syncA11y);
    };
  }, []);

  const resolvedSurface: TopNavSurface = forceSolidNav ? 'default' : surface;
  const onMedia = resolvedSurface === 'media';
  const onHero = resolvedSurface === 'hero';
  const onLightNav = onMedia || onHero;

  /** Sub-pages: no hover/focus mandala. Mobile/coarse: keep default identity as name. */
  const canRevealIdentity = isHome && !coarsePointerNav;
  const identityRevealed = canRevealIdentity && navMandalaRevealed;

  const shellClass = `${SHELL_CLASS[resolvedSurface]} ${SHELL_TRANSITION}`;

  const lightNavTextShadow = onLightNav ? '[text-shadow:0_1px_3px_rgba(0,0,0,0.28)]' : '';

  return (
    <div
      data-surface={resolvedSurface}
      className={`top-nav-strip fixed inset-x-0 top-0 z-[190] h-11 overflow-visible ${shellClass} ${className}`.trim()}
    >
      <div className="mx-auto flex h-full w-full max-w-[1120px] items-center justify-between px-4 sm:px-6 md:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-0 overflow-visible font-body text-[13px] leading-tight tracking-[var(--tracking-body)]">
          {!isHome ? (
            <>
              <button
                type="button"
                onClick={goBack}
                className={onLightNav ? backControlMedia : backControlDefault}
                aria-label={`Back to ${backLabel}`}
              >
                <ArrowLeft className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden />
                <span className="min-w-0 truncate">{backLabel}</span>
              </button>
              <span className={`shrink-0 px-1 ${onLightNav ? 'text-white/50' : 'text-ink/40'}`} aria-hidden>
                /
              </span>
            </>
          ) : null}
          <div className="relative z-[1] flex min-w-0 flex-1 items-center gap-0 overflow-visible">
            <div
              className="relative -mx-1 inline-flex min-h-9 shrink-0 items-center px-1"
              {...(canRevealIdentity ? identitySlotPointerHandlers : {})}
            >
              <button
                type="button"
                onClick={onHomeClick}
                {...(canRevealIdentity ? nameButtonHandlers : {})}
                className={`relative z-[1] min-w-0 max-w-[min(100vw,18rem)] truncate rounded px-0.5 text-left transition-[opacity,transform,color] duration-200 ease-out focus-visible:outline-none focus-visible:underline motion-reduce:transition-[opacity,color] motion-reduce:duration-150 motion-reduce:transform-none ${
                  onLightNav
                    ? `text-white hover:text-white ${lightNavTextShadow}`
                    : 'text-ink/88 hover:text-ink'
                } ${
                  identityRevealed
                    ? 'pointer-events-none opacity-0 scale-[0.992]'
                    : 'opacity-100 scale-100'
                }`}
                aria-label={
                  canRevealIdentity
                    ? 'Go to homepage — hover this name or focus here to reveal the Euphoria mandala'
                    : 'Go to homepage'
                }
              >
                Daniel Román
              </button>
              {canRevealIdentity ? (
                <div
                  className={`absolute inset-0 z-[2] flex origin-center items-center justify-center transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-opacity motion-reduce:duration-150 motion-reduce:transform-none ${
                    identityRevealed
                      ? 'pointer-events-auto opacity-100 scale-100'
                      : 'pointer-events-none opacity-0 scale-[0.96]'
                  }`}
                  aria-hidden={!identityRevealed}
                >
                  <div className="h-9 w-9 shrink-0">
                    <NavBrandingMount
                      key={`${mandalaAnchorId}-${mandalaSessionStamp}`}
                      anchorId={mandalaAnchorId}
                      identityRevealed={identityRevealed}
                    />
                  </div>
                </div>
              ) : null}
            </div>
            {!isHome ? (
              <div className="ml-3 flex min-w-0 items-center">
                <span className={`shrink-0 px-1 ${onLightNav ? 'text-white/50' : 'text-ink/40'}`} aria-hidden>
                  /
                </span>
                <span
                  className={`min-w-0 truncate ${onLightNav ? `text-white/90 ${lightNavTextShadow}` : 'text-ink/80'}`}
                >
                  {PAGE_LABEL[page]}
                </span>
              </div>
            ) : null}
          </div>
        </div>

        <nav aria-label="Secondary">
          <ul className="flex items-center gap-4 text-[13px] leading-tight tracking-[var(--tracking-body)]">
            <li>
              <button
                type="button"
                onClick={onAboutClick}
                className={`font-body transition-colors focus-visible:outline-none focus-visible:underline ${
                  onLightNav
                    ? `text-white/85 hover:text-white ${lightNavTextShadow}`
                    : 'text-ink/78 hover:text-ink'
                }`}
              >
                About
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={onCvClick}
                className={`font-body transition-colors focus-visible:outline-none focus-visible:underline ${
                  onLightNav
                    ? `text-white/85 hover:text-white ${lightNavTextShadow}`
                    : 'text-ink/78 hover:text-ink'
                }`}
              >
                CV
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
