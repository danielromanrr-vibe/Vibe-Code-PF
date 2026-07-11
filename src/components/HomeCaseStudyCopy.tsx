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
 * Homepage case-study copy — stage shell, slab meta rail, headline, body, CTA.
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
      <aside className="home-case-study-meta-rail min-w-0" aria-label="Project metadata">
        <dl className="adopt-meta mb-0">
          <div>
            <dt className="adopt-meta-label">{meta.category}</dt>
            <dd className="adopt-body mb-0 text-ink/65">{meta.discipline}</dd>
          </div>
        </dl>
      </aside>

      <h2 id={headingId} className="home-case-study-heading mb-0 max-w-[28ch] text-pretty leading-[1.08] text-ink/90">
        {heading}
      </h2>

      <div className="home-case-study-description flex flex-col gap-3">{children}</div>

      <TokenButton className="home-case-study-cta mt-1" onClick={onCta}>
        {ctaLabel}
      </TokenButton>
    </div>
  );
}
