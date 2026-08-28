import type { ReactNode } from 'react';
import TokenButton from './TokenButton';

export type HomeCaseStudyMeta = {
  category: string;
  discipline: string;
};

type HomeCaseStudyCopyProps = {
  headingId: string;
  meta: HomeCaseStudyMeta;
  heading: ReactNode;
  children: ReactNode;
  ctaLabel?: string;
  onCta: () => void;
  className?: string;
};

/**
 * Homepage case-study copy — kicker, title, lede, CTA as four proximity groups.
 */
export default function HomeCaseStudyCopy({
  headingId,
  meta,
  heading,
  children,
  ctaLabel = 'View case study',
  onCta,
  className = '',
}: HomeCaseStudyCopyProps) {
  return (
    <div className={['home-case-study-copy-shell', className].filter(Boolean).join(' ')}>
      <p className="home-case-study-kicker">
        <span className="home-case-study-eyebrow">{meta.category}</span>
        <span className="home-case-study-discipline">{meta.discipline}</span>
      </p>

      <h2 id={headingId} className="home-case-study-heading mb-0 max-w-[28ch] text-pretty text-ink/90">
        {heading}
      </h2>

      <div className="home-case-study-description">{children}</div>

      <TokenButton className="home-case-study-cta" onClick={onCta}>
        {ctaLabel}
      </TokenButton>
    </div>
  );
}
