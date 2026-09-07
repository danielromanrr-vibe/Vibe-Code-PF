export type HomeCaseStudyMeta = {
  industry: string;
  discipline: string;
};

export type HomeCaseStudyCopyProps = HomeCaseStudyMeta & {
  headingId: string;
  title: string;
  lede: string;
  ctaLabel?: string;
  onCta: () => void;
  className?: string;
};

/**
 * Editorial intro: kicker · title · lede · text CTA.
 * Industry and discipline are values, not captions.
 */
export default function HomeCaseStudyCopy({
  headingId,
  industry,
  discipline,
  title,
  lede,
  ctaLabel = 'View case study',
  onCta,
  className = '',
}: HomeCaseStudyCopyProps) {
  return (
    <article className={['home-case-study-copy-shell', className].filter(Boolean).join(' ')}>
      <p className="home-case-study-kicker adopt-meta-label">
        {industry}
        <span className="home-case-study-kicker__sep" aria-hidden>
          {' '}
          ·{' '}
        </span>
        {discipline}
      </p>

      <h2 id={headingId} className="home-case-study-heading mb-0 text-pretty">
        {title}
      </h2>

      <p className="home-case-study-lede">{lede}</p>

      <button type="button" className="home-case-study-cta" onClick={onCta}>
        {ctaLabel}
        <span className="home-case-study-cta__arrow" aria-hidden>
          →
        </span>
      </button>
    </article>
  );
}
