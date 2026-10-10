function OverviewPoint({ point }: { point: string }) {
  const split = point.indexOf(':');
  if (split > 0 && split <= 42) {
    return (
      <li>
        <span className="adopt-overview__card-point-label">{point.slice(0, split)}:</span>{' '}
        {point.slice(split + 1).trim()}
      </li>
    );
  }
  return <li>{point}</li>;
}

export type CaseStudyOpeningCard = {
  eyebrow: string;
  body: string;
  points?: readonly string[];
};

export type CaseStudyOpeningCopy = {
  facts: { cards: readonly CaseStudyOpeningCard[] };
  story: { h3: string; cards: readonly CaseStudyOpeningCard[] };
};

type CaseStudyOpeningProps = {
  copy: CaseStudyOpeningCopy;
  factsId?: string;
  storyId?: string;
  factsLabel?: string;
};

/** Hero opening shared by Adopt, Map-Aid, and Atlas: body-support cards, then H3 + story cards. */
export default function CaseStudyOpening({
  copy,
  factsId,
  storyId,
  factsLabel = 'Role, context, scope, and impact',
}: CaseStudyOpeningProps) {
  return (
    <div className="adopt-overview">
      <div
        className="adopt-overview__block adopt-overview__block--facts"
        id={factsId}
        aria-label={factsLabel}
      >
        <div className="adopt-overview__cards adopt-overview__cards--facts">
          {copy.facts.cards.map((card) => (
            <article key={card.eyebrow}>
              <p className="adopt-meta-label adopt-meta-label--bold">{card.eyebrow}</p>
              {card.body.split('\n\n').filter(Boolean).map((paragraph) => (
                <p key={paragraph} className="adopt-body adopt-overview__card-copy mb-0 text-pretty">
                  {paragraph}
                </p>
              ))}
              {card.points && card.points.length > 0 ? (
                <ul className="adopt-overview__card-points">
                  {card.points.map((point) => (
                    <OverviewPoint key={point} point={point} />
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </div>
      <div className="adopt-overview__block adopt-overview__block--story">
        <h3 id={storyId} className="adopt-context-heading scroll-mt-6">
          {copy.story.h3}
        </h3>
        <div className="adopt-overview__cards adopt-overview__cards--story">
          {copy.story.cards.map((card) => (
            <article key={card.eyebrow}>
              <p className="adopt-meta-label adopt-meta-label--bold">{card.eyebrow}</p>
              {card.body.split('\n\n').filter(Boolean).map((paragraph) => (
                <p key={paragraph} className="adopt-body adopt-overview__card-copy mb-0 text-pretty">
                  {paragraph}
                </p>
              ))}
              {card.points && card.points.length > 0 ? (
                <ul className="adopt-overview__card-points">
                  {card.points.map((point) => (
                    <OverviewPoint key={point} point={point} />
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
