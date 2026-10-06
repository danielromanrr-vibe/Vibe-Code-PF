type VhenyBenchmarkColumn = {
  h4: string;
  items: readonly string[];
};

type VhenyBenchmarkProps = {
  headingId: string;
  eyebrow: string;
  title: string;
  body: readonly string[];
  legacy: VhenyBenchmarkColumn;
  vision: VhenyBenchmarkColumn;
};

function aside(title: string, items: readonly string[]) {
  if (items.length === 0) return '';
  const sentences = items.map((item) => (item.endsWith('.') ? item : `${item}.`));
  return `${title}. ${sentences.join(' ')}`;
}

export default function VhenyBenchmark({
  headingId,
  eyebrow,
  title,
  body,
  legacy,
  vision,
}: VhenyBenchmarkProps) {
  const paragraphs = [body[0] ?? '', aside(legacy.h4, legacy.items), aside(vision.h4, vision.items)].filter(Boolean);

  return (
    <div className="vheny-benchmark">
      <div className="vheny-benchmark__copy">
        <p className="adopt-meta-label vheny-subsection__eyebrow">{eyebrow}</p>
        <h3 id={headingId} className="adopt-alt-h3 m-0 scroll-mt-6 text-balance">
          {title}
        </h3>
        {paragraphs.map((line) => (
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
