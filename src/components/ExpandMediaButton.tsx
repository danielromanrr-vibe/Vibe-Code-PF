import type { ButtonHTMLAttributes } from 'react';
import { btnInvertedFillClassName } from './TokenButton';

/**
 * Circular + / − control for gallery / media affordances.
 * Brand blue disk on light surfaces; 44×44px touch target (WCAG).
 */
export const expandMediaControlButtonClassName =
  `flex h-11 w-11 items-center justify-center rounded-full text-xl font-heading font-semibold leading-none text-white transition-[border-color,box-shadow,background-color,transform] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--expand-media-icon)] focus-visible:ring-offset-2 focus-visible:ring-offset-bg active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100 ${btnInvertedFillClassName}`.trim();

/** Dark glass disk + white glyphs — controls on photography / video. */
export const expandMediaControlOnDarkButtonClassName =
  'flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-gradient-to-br from-black/50 via-black/40 to-black/32 text-xl font-heading font-semibold leading-none text-[color:var(--expand-media-icon)] shadow-[0_4px_28px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-xl backdrop-saturate-150 [text-shadow:0_1px_3px_rgba(0,0,0,0.55)] [--expand-media-icon:#ffffff] [--expand-media-icon-hover:#f5f5f4] transition-[box-shadow,border-color,background-image,transform] hover:border-white/48 hover:from-black/58 hover:via-black/46 hover:to-black/38 hover:shadow-[0_6px_32px_rgba(0,0,0,0.48),inset_0_1px_0_rgba(255,255,255,0.18)] active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/55 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent';

export type ExpandMediaButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
  /** When true, shows − instead of +. */
  expanded?: boolean;
  /** `darkMedia`: white +/− on dark frosted glass for busy imagery. */
  tone?: 'light' | 'darkMedia';
};

export default function ExpandMediaButton({
  expanded = false,
  tone = 'light',
  className = '',
  children,
  ...props
}: ExpandMediaButtonProps) {
  const base =
    tone === 'darkMedia' ? expandMediaControlOnDarkButtonClassName : expandMediaControlButtonClassName;
  return (
    <button
      type="button"
      className={`${base} ${className}`.trim()}
      {...props}
    >
      <span className="relative z-10 flex h-full min-h-0 w-full min-w-0 items-center justify-center">
        {children ?? (expanded ? '−' : '+')}
      </span>
    </button>
  );
}
