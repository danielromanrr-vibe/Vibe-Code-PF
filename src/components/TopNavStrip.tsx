import { ArrowLeft } from 'lucide-react';

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
 */
export default function TopNavStrip({
  page,
  onHomeClick,
  onAboutClick,
  onCvClick,
  backLabel = 'Home',
  onBack,
  className = '',
}: TopNavStripProps) {
  const isHome = page === 'home';
  const goBack = onBack ?? onHomeClick;

  return (
    <div
      className={`fixed inset-x-0 top-0 z-[190] h-11 border-b border-ink/[0.06] bg-[rgba(248,249,250,0.82)] backdrop-blur-[2px] ${className}`.trim()}
    >
      <div className="mx-auto flex h-full w-full max-w-[1120px] items-center justify-between px-4 sm:px-6 md:px-8">
        <div className="flex min-w-0 items-center gap-0 truncate font-body text-[13px] leading-tight tracking-[var(--tracking-body)]">
          {!isHome ? (
            <>
              <button
                type="button"
                data-cursor="hand"
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
          <button
            type="button"
            data-cursor="hand"
            onClick={onHomeClick}
            className="min-w-0 truncate text-ink/78 transition-colors hover:text-ink focus-visible:outline-none focus-visible:underline"
            aria-label="Go to homepage"
          >
            Daniel Román
          </button>
          {!isHome ? (
            <>
              <span className="shrink-0 px-1 text-ink/35" aria-hidden>
                /
              </span>
              <span className="min-w-0 truncate text-ink/62">{PAGE_LABEL[page]}</span>
            </>
          ) : null}
        </div>

        <nav aria-label="Secondary">
          <ul className="flex items-center gap-4 text-[13px] leading-tight tracking-[var(--tracking-body)]">
            <li>
              <button
                type="button"
                data-cursor="hand"
                onClick={onAboutClick}
                className="font-body text-ink/62 transition-colors hover:text-ink focus-visible:outline-none focus-visible:underline"
              >
                About
              </button>
            </li>
            <li>
              <button
                type="button"
                data-cursor="hand"
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
