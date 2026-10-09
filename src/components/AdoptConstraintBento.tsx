import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import type { AdoptConstraintCard } from '../content/adopt';

function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px), (hover: none), (pointer: coarse)');
    const sync = () => setCoarse(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  return coarse;
}

type AdoptConstraintBentoProps = {
  heading: string;
  headingId?: string;
  cards: readonly AdoptConstraintCard[];
  reducedMotion?: boolean;
};

export default function AdoptConstraintBento({
  heading,
  headingId = 'adopt-constraints-heading',
  cards,
  reducedMotion = false,
}: AdoptConstraintBentoProps) {
  const coarse = useCoarsePointer();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="adopt-constraint-bento">
      <h2 id={headingId} className="adopt-context-heading adopt-constraint-bento__title text-balance">
        {heading}
      </h2>
      <div className="adopt-constraint-bento__grid" role="list">
        {cards.map((card) => {
          const open = openId === card.id;
          const showTeaser = reducedMotion || coarse || open;

          return (
            <article
              key={card.id}
              role="listitem"
              className={`adopt-constraint-bento__card${open ? ' is-open' : ''}${
                showTeaser ? ' is-revealed' : ''
              }`}
            >
              <p className="adopt-meta-label adopt-meta-label--bold">{card.eyebrow}</p>
              <h4 className="adopt-alt-h3 adopt-constraint-bento__heading">{card.title}</h4>
              {card.teaser ? (
                <p className="adopt-body adopt-constraint-bento__teaser mb-0 text-pretty">{card.teaser}</p>
              ) : null}
              {open && card.detail.length > 0 ? (
                <div className="adopt-constraint-bento__detail">
                  {card.detail.map((paragraph) => (
                    <p key={paragraph} className="adopt-body mb-0 text-pretty">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : null}
              <button
                type="button"
                className="adopt-constraint-bento__plus"
                aria-expanded={open}
                aria-label={open ? `Hide ${card.title}` : `Read ${card.title}`}
                onClick={() => setOpenId(open ? null : card.id)}
              >
                <Plus size={18} strokeWidth={1.75} aria-hidden />
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
