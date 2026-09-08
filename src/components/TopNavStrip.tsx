import { useEffect, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavContrastRescue } from '../lib/navContrastGuard';
import NavBrandingMount from './euphoriaMandala/NavBrandingMount';
import { useIdentityClusterReveal } from './useIdentityClusterReveal';

export type TopNavPage = 'home' | 'adopt' | 'ai' | 'driver' | 'touchpoints' | 'about' | 'cv';

export type TopNavSurface = 'default' | 'media' | 'hero';

/** Short breadcrumb names — one per destination, so the strip never labels the wrong project. */
const PAGE_LABEL: Record<Exclude<TopNavPage, 'home'>, string> = {
  adopt: 'Adopt-a-School',
  ai: 'Designing with AI',
  driver: 'Driver coordination',
  touchpoints: 'Ajediam',
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

const NAV_DESTINATIONS = [
  { key: 'about', label: 'About' },
  { key: 'cv', label: 'CV' },
] as const satisfies ReadonlyArray<{ key: Exclude<TopNavPage, 'home'>; label: string }>;

const SHELL_TRANSITION =
  'transition-[background-color,border-color,box-shadow] duration-200 ease-out motion-reduce:transition-none';

const backControlDefault =
  'inline-flex max-w-[min(100%,11rem)] shrink-0 items-center gap-1 rounded px-1 py-0.5 -ml-1 font-medium text-ink/88 transition-colors hover:bg-ink/[0.06] hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(248,249,250,0.94)]';

const backControlMedia =
  'inline-flex max-w-[min(100%,11rem)] shrink-0 items-center gap-1 rounded px-1 py-0.5 -ml-1 font-medium text-white transition-colors hover:bg-white/12 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent';

/**
 * One bar, three tints — the silhouette never changes.
 *
 * Every surface is the same 2.75rem blurred strip closed by a hairline, so the nav reads as a
 * single object across the homepage, the case studies and the sub-pages. Only the tint moves,
 * and it moves because of what sits underneath.
 *
 * `hero` rides the navy homepage hero, which is dark enough on its own to carry white type.
 * `media` rides case-study artwork that can be near-white (an iPad mockup on paper, a laptop
 * photo with pale browser chrome), so its tint cannot depend on the image: 62% navy is
 * calibrated against a pure white backdrop, the worst case, where white type still measures
 * ~6.2:1. The tint stays inside the bar — no gradient bleeding down over the artwork.
 */
const SHELL_CLASS: Record<TopNavSurface, string> = {
  hero: 'border-b border-white/10 backdrop-blur-md',
  media: 'border-b border-white/12 bg-[rgba(6,12,24,0.62)] backdrop-blur-md',
  default:
    'border-b border-ink/[0.08] bg-[rgba(248,249,250,0.94)] backdrop-blur-[8px] shadow-[0_1px_0_rgba(12,21,40,0.04)]',
};

/**
 * Quiet wayfinding + identity strip.
 * Editorial, compact — glass only on hero/media; default is always legible on light page gray.
 *
 * **Identity slot:** default = tilted “D” mark only; hover/focus = mandala replaces the mark in the same box
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
  const stripRef = useRef<HTMLDivElement>(null);
  const contrastRescue = useNavContrastRescue(stripRef, surface);
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

  const resolvedSurface: TopNavSurface = forceSolidNav || contrastRescue ? 'default' : surface;
  const onMedia = resolvedSurface === 'media';
  const onHero = resolvedSurface === 'hero';
  const onLightNav = onMedia || onHero;

  /** Sub-pages: no hover/focus mandala. Mobile/coarse: keep default identity as name. */
  const canRevealIdentity = isHome && !coarsePointerNav;
  const identityRevealed = canRevealIdentity && navMandalaRevealed;

  const shellClass = `${SHELL_CLASS[resolvedSurface]} ${SHELL_TRANSITION}`;

  return (
    <div
      ref={stripRef}
      data-surface={resolvedSurface}
      data-nav-contrast={forceSolidNav || contrastRescue ? 'rescue' : 'ok'}
      className={`top-nav-strip fixed inset-x-0 top-0 z-[190] overflow-visible ${shellClass} ${className}`.trim()}
    >
      <div className="relative z-[1] mx-auto flex h-full w-full max-w-[1120px] items-center justify-between px-4 sm:px-6 md:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-0 overflow-visible font-body text-[length:var(--text-body)] leading-tight tracking-[var(--tracking-body)]">
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
              <span className={`shrink-0 px-1 ${onLightNav ? 'text-white/70' : 'text-ink/45'}`} aria-hidden>
                /
              </span>
            </>
          ) : null}
          <div className="relative z-[1] flex min-w-0 flex-1 items-center gap-0 overflow-visible">
            <div className="flex min-w-0 items-center gap-2.5">
            <div
              className="relative -mx-1 inline-flex min-h-9 shrink-0 items-center px-1"
              {...(canRevealIdentity ? identitySlotPointerHandlers : {})}
            >
              <button
                type="button"
                onClick={onHomeClick}
                {...(canRevealIdentity ? nameButtonHandlers : {})}
                className={`relative z-[1] min-w-0 max-w-[min(100vw,18rem)] truncate rounded px-0.5 text-left transition-[opacity,transform,color] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 motion-reduce:transition-[opacity,color] motion-reduce:duration-150 motion-reduce:transform-none ${
                  onLightNav
                    ? 'text-white hover:text-white focus-visible:ring-white/70 focus-visible:ring-offset-transparent'
                    : 'text-ink/88 hover:text-ink focus-visible:ring-ink/30 focus-visible:ring-offset-[rgba(248,249,250,0.94)]'
                } ${
                  identityRevealed
                    ? 'pointer-events-none opacity-0 scale-[0.992]'
                    : 'opacity-100 scale-100'
                }`}
                aria-label={
                  canRevealIdentity
                    ? 'Daniel Román — go to homepage. Hover or focus here to reveal the Euphoria mandala'
                    : 'Daniel Román — go to homepage'
                }
              >
                <span className="top-nav-identity-mark" aria-hidden>
                  D
                </span>
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
            {isHome && onHero ? (
              <span className="top-nav-identity-role top-nav-identity-role--hero shrink-0 text-white">
                Product designer
              </span>
            ) : null}
            </div>
            {!isHome ? (
              <div className="ml-3 flex min-w-0 items-center">
                <span className={`shrink-0 px-1 ${onLightNav ? 'text-white/70' : 'text-ink/45'}`} aria-hidden>
                  /
                </span>
                <span
                  aria-current="page"
                  className={`min-w-0 truncate ${onLightNav ? 'text-white' : 'text-ink/88'}`}
                >
                  {PAGE_LABEL[page]}
                </span>
              </div>
            ) : null}
          </div>
        </div>

        <nav aria-label="Primary">
          <ul className="flex items-center gap-1 text-[length:var(--text-body)] leading-tight tracking-[var(--tracking-body)]">
            {NAV_DESTINATIONS.map(({ key, label }) => {
              const isCurrent = page === key;
              return (
                <li key={key}>
                  <button
                    type="button"
                    onClick={key === 'about' ? onAboutClick : onCvClick}
                    aria-current={isCurrent ? 'page' : undefined}
                    className={`font-body relative inline-flex min-h-9 items-center rounded px-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
                      onLightNav
                        ? 'text-white hover:text-white focus-visible:ring-white/70 focus-visible:ring-offset-transparent'
                        : `hover:text-ink focus-visible:ring-ink/30 focus-visible:ring-offset-[rgba(248,249,250,0.94)] ${
                            isCurrent ? 'text-ink' : 'text-ink/78'
                          }`
                    }`}
                  >
                    {label}
                    {/* Current page is marked by weight-free means: a rule under the label. */}
                    <span
                      aria-hidden
                      className={`pointer-events-none absolute -bottom-0.5 left-2 right-2 h-px ${
                        isCurrent ? (onLightNav ? 'bg-white/70' : 'bg-ink/45') : 'bg-transparent'
                      }`}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
