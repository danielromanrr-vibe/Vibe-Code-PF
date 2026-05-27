/**
 * Validation — premium editorial case-study spreads (Physical + Digital).
 * Desktop: 12-column grid, asymmetric overlap; subsection titles only inside caption cards.
 */

const imgBase =
  'h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.01]';
const figPrimary =
  'group relative overflow-hidden rounded-[32px] bg-ink/[0.03] shadow-[0_8px_32px_-14px_rgba(20,20,20,0.07),0_2px_10px_-4px_rgba(20,20,20,0.04)] ring-1 ring-ink/[0.06] md:rounded-[34px]';
const figSupport =
  'group relative overflow-hidden rounded-[28px] bg-ink/[0.03] shadow-[0_6px_24px_-12px_rgba(20,20,20,0.06)] ring-1 ring-ink/[0.05] md:rounded-[30px]';

const captionShell =
  'rounded-[32px] border border-ink/[0.09] bg-[#fdfcfa] shadow-[0_12px_44px_-16px_rgba(20,20,20,0.09),0_4px_14px_-6px_rgba(20,20,20,0.05)] px-11 py-11 md:rounded-[34px] md:px-14 md:py-14';

const captionTitleClass =
  'mb-4 font-heading text-[clamp(2.25rem,3.4vw,3rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-[var(--color-heading-h3)] md:mb-5';
const captionBodyClass =
  'mb-0 max-w-[48ch] font-body text-[clamp(1.375rem,1.65vw,1.75rem)] font-normal leading-[1.45] text-ink/[0.82]';

type BundleProps = {
  title: string;
  titleId: string;
  description: string;
  sources: readonly string[];
};

/** Physical — hero landscape top-right; evidence lower-left; caption overlaps hero base → right */
function PhysicalBundle({ title, titleId, description, sources }: BundleProps) {
  const [a, b, c] = sources.slice(0, 3);

  return (
    <article className="relative min-w-0" aria-labelledby={titleId}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-x-4 md:gap-y-0">
        {/* Hero + integrated caption — mobile first in DOM order */}
        <div className="relative z-10 order-1 md:col-span-8 md:col-start-5 md:row-start-1">
          <figure className={`${figPrimary} aspect-[5/3] w-full md:aspect-[16/10]`}>
            <img src={a} alt="" className={imgBase} loading="eager" decoding="async" />
          </figure>
          <div
            className={`relative z-30 mx-auto mt-6 w-[min(100%,94%)] md:absolute md:bottom-0 md:right-0 md:mx-0 md:mt-0 md:w-[min(100%,68%)] md:max-w-[440px] md:translate-y-[16%] ${captionShell}`}
          >
            <h3 id={titleId} className={captionTitleClass}>
              {title}
            </h3>
            <p className={captionBodyClass}>{description}</p>
          </div>
        </div>

        {/* Supporting evidence — lower-left column */}
        <div className="relative z-20 order-3 flex flex-row gap-3 px-1 md:order-none md:col-span-4 md:col-start-1 md:row-start-1 md:flex-col md:justify-end md:gap-0 md:self-end md:px-0 md:pb-[8%] md:pt-[22%]">
          <figure className={`${figSupport} aspect-[3/5] w-[48%] max-w-[220px] md:w-[92%] md:max-w-[280px]`}>
            <img src={b} alt="" className={imgBase} loading="lazy" decoding="async" />
          </figure>
          <figure
            className={`${figSupport} -mt-2 aspect-[5/3] w-[52%] md:-mt-7 md:ml-[8%] md:w-[78%] md:max-w-[220px]`}
          >
            <img src={c} alt="" className={imgBase} loading="lazy" decoding="async" />
          </figure>
        </div>
      </div>
    </article>
  );
}

/** Digital — taller hero left; satellites tuck along bottom edge; caption lower-right on hero */
function DigitalBundle({ title, titleId, description, sources }: BundleProps) {
  const [a, b, c] = sources.slice(0, 3);

  return (
    <article
      className="relative min-w-0 overflow-visible md:min-h-[min(560px,70vh)]"
      aria-labelledby={titleId}
    >
      <div className="relative z-10 mx-auto max-w-[440px] overflow-visible md:mx-0 md:max-w-[min(520px,56vw)]">
        <figure className={`${figPrimary} aspect-[4/5] w-full`}>
          <img src={a} alt="" className={imgBase} loading="eager" decoding="async" />
        </figure>
        {/* Caption hugged to the right edge of the hero, then shifted outward so it clears the subject */}
        <div
          className={`relative z-40 mx-auto mt-6 w-[min(100%,94%)] md:absolute md:bottom-[8%] md:right-0 md:mx-0 md:mt-0 md:w-[min(100%,48%)] md:min-w-[280px] md:max-w-[340px] md:translate-x-[min(10vw,120px)] ${captionShell}`}
        >
          <h3 id={titleId} className={captionTitleClass}>
            {title}
          </h3>
          <p className={captionBodyClass}>{description}</p>
        </div>
      </div>

      <div className="relative z-20 mt-6 flex flex-row justify-between gap-3 px-1 md:mt-0 md:block md:px-0">
        <figure
          className={`${figSupport} aspect-[5/3] w-[56%] md:absolute md:bottom-[6%] md:left-[38%] md:z-20 md:mt-0 md:w-[min(32%,360px)]`}
        >
          <img src={b} alt="" className={imgBase} loading="lazy" decoding="async" />
        </figure>
        <figure
          className={`${figSupport} aspect-[3/4] w-[40%] md:absolute md:bottom-[4%] md:right-0 md:z-15 md:mt-0 md:w-[min(24%,260px)]`}
        >
          <img src={c} alt="" className={imgBase} loading="lazy" decoding="async" />
        </figure>
      </div>
    </article>
  );
}

export default function AdoptValidationEditorialSection({
  sectionHeadingId = 'adopt-section-validation',
  sectionLede,
  physicalImages,
  digitalImages,
  physicalTitle,
  physicalTitleId,
  physicalDescription,
  digitalTitle,
  digitalTitleId,
  digitalDescription,
}: {
  sectionHeadingId?: string;
  /** Bridges Process Overview validation chapter and these deep-dive spreads. */
  sectionLede?: string;
  physicalImages: readonly string[];
  digitalImages: readonly string[];
  physicalTitle: string;
  physicalTitleId: string;
  physicalDescription: string;
  digitalTitle: string;
  digitalTitleId: string;
  digitalDescription: string;
}) {
  return (
    <section
      className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-[#F8F9FA] py-14 md:py-20 lg:py-24"
      aria-labelledby={sectionHeadingId}
    >
      <div className="mx-auto max-w-[1180px] px-6 sm:px-8 md:px-10">
        <header className="mx-auto mb-12 max-w-[42rem] text-center md:mb-14 lg:mb-16">
          <h2
            id={sectionHeadingId}
            className="mb-4 font-heading text-[length:var(--text-h2)] font-semibold leading-[var(--leading-h2)] tracking-[-0.052em] text-[var(--color-heading-h2)] md:mb-5"
          >
            Validation
          </h2>
          {sectionLede ? (
            <p className="adopt-impact-summary-lede mx-auto mb-0 text-pretty">{sectionLede}</p>
          ) : null}
        </header>

        <div className="flex flex-col gap-16 md:gap-[4.5rem] lg:gap-24">
          <PhysicalBundle
            title={physicalTitle}
            titleId={physicalTitleId}
            description={physicalDescription}
            sources={physicalImages}
          />
          <DigitalBundle
            title={digitalTitle}
            titleId={digitalTitleId}
            description={digitalDescription}
            sources={digitalImages}
          />
        </div>
      </div>
    </section>
  );
}
