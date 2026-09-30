type VhenyPersona = {
  name: string;
  age: string;
  role: string;
  behavior: string;
  requirement: string;
  feature: string;
};

type VhenyPersonasProps = {
  headingId: string;
  eyebrow: string;
  title: string;
  body: readonly string[];
  people: readonly VhenyPersona[];
};

export default function VhenyPersonas({
  headingId,
  eyebrow,
  title,
  body,
  people,
}: VhenyPersonasProps) {
  return (
    <div className="vheny-personas">
      <div className="vheny-personas__copy">
        <p className="adopt-meta-label vheny-subsection__eyebrow">{eyebrow}</p>
        <h3 id={headingId} className="adopt-alt-h3 m-0 scroll-mt-6 text-balance">
          {title}
        </h3>
        {body.map((line) => (
          <p key={line} className="adopt-body mb-0 text-pretty text-ink/82">
            {line}
          </p>
        ))}
      </div>
      <ul className="vheny-personas__grid">
        {people.map((person) => (
          <li key={person.name} className="vheny-persona">
            <div className="vheny-persona__media" aria-hidden />
            <h4 className="adopt-alt-h3 vheny-persona__name">
              {person.age ? `${person.name}, ${person.age}` : person.name}
            </h4>
            {person.role ? <p className="adopt-meta-label vheny-persona__role">{person.role}</p> : null}
            <p className="adopt-body vheny-persona__behavior mb-0 text-pretty">{person.behavior}</p>
            {person.requirement || person.feature ? (
              <div className="vheny-persona__map">
                {person.requirement ? <p className="vheny-persona__requirement mb-0">{person.requirement}</p> : null}
                {person.feature ? <p className="vheny-persona__feature mb-0">{person.feature}</p> : null}
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
