import type { ReactNode } from 'react';

/** Shared shell — matches ThinkingCardDeck evidence panel. */
export const editorialCardShellClass = [
  'relative flex w-full flex-col overflow-hidden rounded-2xl',
  'bg-[#FAF8F4] ring-1 ring-ink/[0.06]',
  'shadow-[0_1px_2px_rgba(12,21,40,0.04),0_6px_18px_rgba(12,21,40,0.06)]',
].join(' ');

export const editorialCardViewportClass = 'editorial-evidence-card__viewport';

export function EditorialCardGrid({
  children,
  layout = 'split',
}: {
  children: ReactNode;
  /** `split` = media | copy columns; `stack` = landscape media above copy. */
  layout?: 'split' | 'stack';
}) {
  if (layout === 'stack') {
    return <div className="editorial-card-grid editorial-card-grid--stack flex h-full min-h-0 flex-col">{children}</div>;
  }
  return (
    <div className="editorial-card-grid editorial-card-grid--split grid h-full min-h-0 grid-cols-1 sm:grid-cols-[minmax(200px,38%)_1fr]">
      {children}
    </div>
  );
}

export function EditorialCardVisual({
  eyebrow,
  eyebrowColor,
  background,
  children,
  edge = 'right',
}: {
  eyebrow?: string;
  eyebrowColor?: string;
  background?: string;
  children?: ReactNode;
  /** Hairline between media and copy. */
  edge?: 'right' | 'bottom' | 'none';
}) {
  return (
    <div
      className="editorial-card-visual relative h-full min-h-[12.5rem] w-full shrink-0 overflow-hidden sm:min-h-0"
      style={background ? { background } : undefined}
    >
      {children}
      {eyebrow ? (
        <span
          className="absolute left-5 top-5 font-eyebrow text-[length:var(--text-label)] font-normal uppercase tracking-[0.11em]"
          style={{ color: eyebrowColor }}
        >
          {eyebrow}
        </span>
      ) : null}
      {edge === 'right' ? (
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-ink/[0.06] to-transparent"
          aria-hidden
        />
      ) : null}
      {edge === 'bottom' ? (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-ink/[0.08] to-transparent"
          aria-hidden
        />
      ) : null}
    </div>
  );
}

export function EditorialCardContent({
  children,
  allowScroll = false,
  className = '',
}: {
  children: ReactNode;
  /** Process cards stay fixed; expanded thinking-deck panels may opt in. */
  allowScroll?: boolean;
  className?: string;
}) {
  return (
    <div
      className={[
        'flex min-h-0 flex-col justify-center px-7 py-6 sm:px-8 sm:py-7',
        allowScroll ? 'overflow-y-auto' : 'overflow-hidden',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}

export function EditorialSectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="editorial-section-label mb-2 font-eyebrow text-[length:var(--text-label)] font-normal uppercase tracking-[0.11em] text-ink/40">
      {children}
    </p>
  );
}

export function EditorialCardDivider() {
  return (
    <div className="editorial-card-divider my-7 h-px w-12 bg-gradient-to-r from-ink/14 to-transparent" aria-hidden />
  );
}

export function EditorialCardTitle({
  children,
  id,
}: {
  children: ReactNode;
  id?: string;
}) {
  return (
    <h2
      id={id}
      className="mb-3 mt-0 text-pretty font-body text-[length:var(--text-h3)] font-bold leading-[1.1] tracking-[-0.03em] text-ink text-balance"
    >
      {children}
    </h2>
  );
}

export function EditorialCardLead({ children }: { children: ReactNode }) {
  return (
    <p className="editorial-card-lede m-0 max-w-[42ch] text-pretty text-[length:var(--text-body)] leading-[1.48] text-ink/72">
      {children}
    </p>
  );
}

export function EditorialCardBody({ children }: { children: ReactNode }) {
  return (
    <p className="editorial-card-body m-0 max-w-[48ch] text-pretty text-[length:var(--text-body)] leading-[1.58] text-ink/62">
      {children}
    </p>
  );
}
