import type { ReactNode } from 'react';

type ScopeIconLearnMoreLinkProps = {
  href: string;
  label: string;
  /** Short CTA — shown on hover / focus (always visible on touch). */
  cta?: string;
  children: ReactNode;
  className?: string;
};

/**
 * Scope rail icon + “Read more” link.
 * CTA appears on hover/focus; stays visible on touch devices.
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
