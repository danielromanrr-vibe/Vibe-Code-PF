import { useRef, type ReactNode } from 'react';
import TextLinkLabelWords from './TextLinkLabelWords';
import { useTextLinkArrowFollow } from './useTextLinkArrowFollow';

export type HomeCaseStudyMeta = {
  industry: string;
  discipline: string;
};

export type HomeCaseStudyCopyProps = HomeCaseStudyMeta & {
  headingId: string;
  title: string;
  /** H3 line under the title. Hairline follows when set. */
  subhead?: string;
  lede: ReactNode;
  ctaLabel?: string;
  onCta: () => void;
  className?: string;
};

function kickerSlabs(...values: string[]) {
  return values
    .flatMap((value) => value.split(/\n|•/))
    .map((token) => token.trim())
    .filter(Boolean);
}

export function renderInlineBold(lede: ReactNode) {
  if (typeof lede !== 'string' || !lede.includes('**')) return lede;
  return lede.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    const bold = part.match(/^\*\*([^*]+)\*\*$/);
    if (bold) return <strong key={index}>{bold[1]}</strong>;
    return part;
  });
}

/**
 * Editorial intro: kicker · title · lede · text CTA.
 * Industry and discipline are values, not captions.
 */
export default function HomeCaseStudyCopy({
  headingId,
  industry,
  discipline,
  title,
  subhead,
  lede,
  ctaLabel = 'View case study',
  onCta,
  className = '',
}: HomeCaseStudyCopyProps) {
  const ctaRef = useRef<HTMLButtonElement>(null);
  useTextLinkArrowFollow(ctaRef);

  return (
    <article className={['home-case-study-copy-shell', className].filter(Boolean).join(' ')}>
      <p className="home-case-study-kicker adopt-meta-label">
        {kickerSlabs(industry, discipline).map((token) => (
          <span key={token} className="home-case-study-kicker__slab">
            {token}
          </span>
        ))}
      </p>

      <h2
        id={headingId}
        className={[
          'home-case-study-heading mb-0',
          title.includes('\n') ? 'home-case-study-heading--multiline whitespace-pre-line' : 'text-pretty',
        ].join(' ')}
      >
        {title}
      </h2>

      {subhead ? (
        <>
          <h3 className="home-case-study-subhead">{subhead}</h3>
          <hr className="home-case-study-rule" />
        </>
      ) : null}

      <p className="home-case-study-lede">{renderInlineBold(lede)}</p>

      <button ref={ctaRef} type="button" className="home-case-study-cta text-link-tilt" onClick={onCta}>
        <TextLinkLabelWords label={ctaLabel} />
        <span className="home-case-study-cta__arrow" aria-hidden>
          →
        </span>
      </button>
    </article>
  );
}
