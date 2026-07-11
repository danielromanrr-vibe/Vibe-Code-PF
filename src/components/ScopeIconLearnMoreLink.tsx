import type { ReactNode } from 'react';

type ScopeIconLearnMoreLinkProps = {
  href: string;
  label: string;
  /** Short CTA — visible at all times for clarity and accessibility. */
  cta?: string;
  children: ReactNode;
  className?: string;
};

/**
 * Scope rail icon + always-visible “Read more” link.
 * No overlay-on-icon pattern — link sits below the mark with proper contrast.
 */
export default function ScopeIconLearnMoreLink({
  href,
  label,
  cta = 'Read more',
  children,
  className = '',
}: ScopeIconLearnMoreLinkProps) {
  return (
    <a
      href={href}
      className={['scope-icon-learn-more', className].filter(Boolean).join(' ')}
      aria-label={`${label} — ${cta}`}
    >
      <span className="scope-icon-learn-more__mark" aria-hidden="true">
        {children}
      </span>
      <span className="scope-icon-learn-more__cta">{cta}</span>
    </a>
  );
}
