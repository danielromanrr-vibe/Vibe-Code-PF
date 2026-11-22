type VhenyBenchmarkProps = {
  headingId: string;
  eyebrow: string;
  title: string;
  body: readonly string[];
  visionTitle: string;
  visionBody: readonly string[];
};

export default function VhenyBenchmark({
  headingId,
  eyebrow,
  title,
  body,
  visionTitle,
  visionBody,
}: VhenyBenchmarkProps) {
  return (
    <div className="vheny-benchmark">
      <div className="vheny-benchmark__copy">
        <p className="adopt-meta-label vheny-subsection__eyebrow">{eyebrow}</p>
        <h3
          id={headingId}
          className={`adopt-alt-h3 m-0 scroll-mt-6 text-balance${title.includes('\n') ? ' whitespace-pre-line' : ''}`}
        >
          {title}
        </h3>
        {body.map((line) => (
          <p key={line} className="adopt-body mb-0 text-pretty text-ink/82">
            {line}
          </p>
        ))}
        {visionTitle ? <p className="adopt-body vheny-benchmark__vision mb-0">{visionTitle}</p> : null}
        {visionBody.map((line) => (
          <p key={line} className="adopt-body mb-0 text-pretty text-ink/82">
            {line}
          </p>
        ))}
      </div>
      <figure className="vheny-benchmark__frame">
        <img
          src="/vheny-diamonds/diamtrade/Vheny-diamonds-diamtrade3.jpg"
          alt="Two laptops showing the Diamtrade stock list and dashboard."
          loading="lazy"
          decoding="async"
        />
      </figure>
    </div>
  );
}
