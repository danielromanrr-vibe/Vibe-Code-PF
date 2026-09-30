import { ATLAS_GRAMMAR } from '../content/vhenyAtlas';
import VhenyPatternCard from './VhenyPatternCard';
import VhenySpatialShell from './VhenySpatialShell';

type VhenyGrammarSectionProps = {
  headingId: string;
};

export default function VhenyGrammarSection({ headingId }: VhenyGrammarSectionProps) {
  return (
    <div className="vheny-grammar">
      <header className="vheny-grammar__header">
        <p className="adopt-meta-label vheny-subsection__eyebrow">{ATLAS_GRAMMAR.eyebrow}</p>
        <h2 id={headingId} className="adopt-context-heading scroll-mt-6">
          {ATLAS_GRAMMAR.title}
        </h2>
        <p className="vheny-grammar__subhead mb-0 text-pretty">{ATLAS_GRAMMAR.subhead}</p>
        <p className="adopt-body mb-0 text-pretty text-ink/82">{ATLAS_GRAMMAR.context}</p>
      </header>

      <div className="vheny-grammar__decision">
        <h3 className="adopt-alt-h3 m-0">{ATLAS_GRAMMAR.decision.title}</h3>
        <p className="adopt-body mb-0 text-pretty text-ink/82">{ATLAS_GRAMMAR.decision.body}</p>
      </div>

      <VhenySpatialShell />

      <div className="vheny-grammar__patterns">
        <p className="adopt-body vheny-grammar__patterns-intro mb-0 text-pretty text-ink/82">{ATLAS_GRAMMAR.patternsIntro}</p>
        <ul className="vheny-grammar__grid">
          {ATLAS_GRAMMAR.patterns.map((pattern) => (
            <li key={pattern.id} className="vheny-grammar__item">
              <VhenyPatternCard pattern={pattern} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
