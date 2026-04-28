import { ArrowLeft } from 'lucide-react';
import NavBrandingMount from './euphoriaMandala/NavBrandingMount';
import { useIdentityClusterReveal } from './useIdentityClusterReveal';

export type TopNavPage = 'home' | 'adopt' | 'ai' | 'brand' | 'about' | 'cv';

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
};

const backControlClassName =
  'inline-flex max-w-[min(100%,11rem)] shrink-0 items-center gap-1 rounded px-1 py-0.5 -ml-1 font-medium text-ink transition-colors hover:bg-ink/[0.06] hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(248,249,250,0.82)]';

/**
 * Quiet wayfinding + identity strip.
 * Editorial, compact, and intentionally low-contrast.
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
}: TopNavStripProps) {
  const isHome = page === 'home';
  const goBack = onBack ?? onHomeClick;
  const {
    identityRevealed: navMandalaRevealed,
    mandalaSessionStamp,
    nameButtonHandlers,
    identitySlotPointerHandlers,
  } = useIdentityClusterReveal();
  /** Sub-pages: no hover/focus mandala — keeps the portaled canvas from eating events near wayfinding. */
  const identityRevealed = isHome && navMandalaRevealed;

  return (
    <div
      className={`fixed inset-x-0 top-0 z-[190] h-11 overflow-visible border-b border-ink/[0.06] bg-[rgba(248,249,250,0.82)] backdrop-blur-[2px] ${className}`.trim()}
    >
      <div className="mx-auto flex h-full w-full max-w-[1120px] items-center justify-between px-4 sm:px-6 md:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-0 overflow-visible font-body text-[13px] leading-tight tracking-[var(--tracking-body)]">
          {!isHome ? (
            <>
              <button
                type="button"
                onClick={goBack}
                className={backControlClassName}
                aria-label={`Back to ${backLabel}`}
              >
                <ArrowLeft className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden />
                <span className="min-w-0 truncate">{backLabel}</span>
              </button>
              <span className="shrink-0 px-1 text-ink/35" aria-hidden>
                /
              </span>
            </>
          ) : null}
          <div className="relative z-[1] flex min-w-0 flex-1 items-center gap-0 overflow-visible">
            <div
              className="relative -mx-1 inline-flex min-h-9 shrink-0 items-center px-1"
              {...(isHome ? identitySlotPointerHandlers : {})}
            >
              <button
                type="button"
                onClick={onHomeClick}
                {...(isHome ? nameButtonHandlers : {})}
                className={`relative z-[1] min-w-0 max-w-[min(100vw,18rem)] truncate rounded px-0.5 text-left text-ink/78 transition-[opacity,transform,color] duration-200 ease-out hover:text-ink focus-visible:outline-none focus-visible:underline motion-reduce:transition-[opacity,color] motion-reduce:duration-150 motion-reduce:transform-none ${
                  identityRevealed
                    ? 'pointer-events-none opacity-0 scale-[0.992]'
                    : 'opacity-100 scale-100'
                }`}
                aria-label={
                  isHome
                    ? 'Go to homepage — hover this name or focus here to reveal the Euphoria mandala'
                    : 'Go to homepage'
                }
              >
                Daniel Román
              </button>
              {isHome ? (
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
                <span className="shrink-0 px-1 text-ink/35" aria-hidden>
                  /
                </span>
                <span className="min-w-0 truncate text-ink/62">{PAGE_LABEL[page]}</span>
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
                className="font-body text-ink/62 transition-colors hover:text-ink focus-visible:outline-none focus-visible:underline"
              >
                About
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={onCvClick}
                className="font-body text-ink/62 transition-colors hover:text-ink focus-visible:outline-none focus-visible:underline"
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
