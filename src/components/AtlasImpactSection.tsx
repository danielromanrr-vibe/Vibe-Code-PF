import { ATLAS_IMPACT } from '../content/vhenyAtlas';

type AtlasImpactSectionProps = {
  headingId: string;
};

export default function AtlasImpactSection({ headingId }: AtlasImpactSectionProps) {
  return (
    <div className="atlas-impact">
      <header className="atlas-impact__header">
        <h2 id={headingId} className="adopt-context-heading scroll-mt-6">
          {ATLAS_IMPACT.title}
        </h2>
        <p className="adopt-body mb-0 text-pretty text-ink/82">{ATLAS_IMPACT.subtitle}</p>
      </header>

      <div className="atlas-impact__pillars">
        {ATLAS_IMPACT.pillars.map((pillar) => (
          <section key={pillar.id} aria-labelledby={`atlas-impact-${pillar.id}`}>
            <h3 id={`atlas-impact-${pillar.id}`} className="adopt-alt-h3 atlas-impact__group">
              {pillar.title}
            </h3>
            <ul className="atlas-impact__points">
              {pillar.points.map((point) => (
                <li key={point.label}>
                  <p className="atlas-impact__point">
                    <strong>{point.label}</strong>
                    {point.body}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="atlas-impact__tradeoffs" aria-labelledby="atlas-impact-tradeoffs">
        <h3 id="atlas-impact-tradeoffs" className="adopt-alt-h3 atlas-impact__group">
          {ATLAS_IMPACT.tradeoffsHeading}
        </h3>
        <ul>
          {ATLAS_IMPACT.tradeoffs.map((tradeoff) => (
            <li key={tradeoff.label}>
              <p className="atlas-impact__label">{tradeoff.label}</p>
              <p className="adopt-body mb-0 text-pretty">{tradeoff.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="atlas-impact__comparison" aria-labelledby="atlas-impact-comparison">
        <h3 id="atlas-impact-comparison" className="adopt-alt-h3 atlas-impact__group">
          {ATLAS_IMPACT.comparisonHeading}
        </h3>
        <div className="atlas-impact__table-wrap">
          <table className="atlas-impact__table">
            <thead>
              <tr>
                <th scope="col">{ATLAS_IMPACT.metricLabel}</th>
                <th scope="col">{ATLAS_IMPACT.legacyLabel}</th>
                <th scope="col">{ATLAS_IMPACT.atlasLabel}</th>
              </tr>
            </thead>
            <tbody>
              {ATLAS_IMPACT.rows.map((row) => (
                <tr key={row.metric}>
                  <th scope="row">{row.metric}</th>
                  <td>{row.legacy}</td>
                  <td>{row.atlas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="atlas-impact__reflections" aria-labelledby="atlas-impact-reflection">
        <h3 id="atlas-impact-reflection" className="adopt-alt-h3 atlas-impact__group">
          {ATLAS_IMPACT.reflectionHeading}
        </h3>
        <p className="adopt-body mb-0 text-pretty">{ATLAS_IMPACT.reflection}</p>
      </section>
    </div>
  );
}
