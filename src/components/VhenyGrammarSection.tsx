import { ATLAS_GRAMMAR } from '../content/vhenyAtlas';
import VhenyPatternCard from './VhenyPatternCard';

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
        <p className="adopt-body mb-0 text-pretty text-ink/82">{ATLAS_GRAMMAR.subhead}</p>
      </header>

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
