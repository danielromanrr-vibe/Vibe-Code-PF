import type { ButtonHTMLAttributes } from 'react';
import { mediaFrostIconTextClassName, mediaFrostShellClassName } from './mediaFrostShell';

/**
 * Circular + / − control for gallery / media affordances.
 * Frosted disk: readable on busy imagery; 44×44px touch target (WCAG).
 */
export const expandMediaControlButtonClassName =
  `flex h-11 w-11 items-center justify-center rounded-full ${mediaFrostShellClassName} text-xl font-heading font-semibold leading-none ${mediaFrostIconTextClassName}`.trim();

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
      <span className="relative z-10 flex h-full min-h-0 w-full min-w-0 items-center justify-center">
        {children ?? (expanded ? '−' : '+')}
      </span>
    </button>
  );
}
