import { ABOUT_INFLUENCE_CARDS } from '../../content/aboutMandalaFacets';

type AboutInfluenceFieldNavProps = {
  onSelect: (cardId: string, trigger: HTMLButtonElement) => void;
};

/** Screen-reader path to six influences and their relationship graph. */
export default function AboutInfluenceFieldNav({ onSelect }: AboutInfluenceFieldNavProps) {
  return (
    <nav className="sr-only" aria-label="Six influences and relationships">
      <ul className="m-0 list-none p-0">
        {ABOUT_INFLUENCE_CARDS.map((card) => (
          <li key={card.id}>
            <button type="button" onClick={(e) => onSelect(card.id, e.currentTarget)}>
              {card.title}: {card.teaser}
            </button>
            {card.relatedInfluences.length > 0 ? (
              <ul className="m-0 list-none p-0 pl-3">
                {card.relatedInfluences.map((rel) => (
                  <li key={rel.id}>
                    {rel.label}. {rel.description}
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </nav>
  );
}
