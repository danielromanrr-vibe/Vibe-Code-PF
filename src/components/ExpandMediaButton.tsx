import type { ButtonHTMLAttributes } from 'react';

/**
 * Circular + / − control for gallery / media affordances.
 * Frosted disk: readable on busy imagery; 44×44px touch target (WCAG).
 */
export const expandMediaControlButtonClassName =
  'shrink-0 flex h-11 w-11 items-center justify-center rounded-full border border-white/45 bg-white/88 text-xl font-heading font-semibold leading-none text-[color:var(--expand-media-icon)] shadow-[0_2px_14px_rgba(0,0,0,0.18)] backdrop-blur-sm transition-[background-color,box-shadow,border-color,color] hover:border-white/70 hover:bg-white hover:text-[color:var(--expand-media-icon-hover)] hover:shadow-[0_4px_22px_rgba(0,0,0,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--expand-media-icon)]/55 focus-visible:ring-offset-2 focus-visible:ring-offset-white/80';

export type ExpandMediaButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
  /** When true, shows − instead of +. */
  expanded?: boolean;
};

export default function ExpandMediaButton({
  expanded = false,
  className = '',
  children,
  ...props
}: ExpandMediaButtonProps) {
  return (
    <button
      type="button"
      data-cursor="hand"
      className={`${expandMediaControlButtonClassName} ${className}`.trim()}
      {...props}
    >
      {children ?? (expanded ? '−' : '+')}
    </button>
  );
}
