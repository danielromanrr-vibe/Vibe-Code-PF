const TICKER_ITEMS = [
  'Product design',
  'UX design',
  'Visual design',
  'Interaction design',
  'Product strategy',
  'Prototyping',
] as const;

/** Enough repeats that one group is always wider than the viewport — keeps the loop seamless. */
const TICKER_COPIES_PER_GROUP = 6;

const TICKER_LABEL = TICKER_ITEMS.join(', ');

function TickerGroup({ copyId }: { copyId: string }) {
  return (
    <span className="home-partnering-ticker__group">
      {Array.from({ length: TICKER_COPIES_PER_GROUP }, (_, copy) =>
        TICKER_ITEMS.map((item) => (
          <span key={`${copyId}-${copy}-${item}`} className="home-partnering-ticker__item">
            <span className="home-partnering-ticker__chunk">{item}</span>
            <span className="home-partnering-ticker__sep" aria-hidden>
              ·
            </span>
          </span>
        )),
      )}
    </span>
  );
}

/**
 * Decorative marquee at the top of the homepage case-study sheet — personality beat, not navigation.
 */
export default function HomePartneringTicker() {
  return (
    <div className="home-partnering-ticker" aria-label={TICKER_LABEL}>
      <div className="home-partnering-ticker__viewport" aria-hidden>
        <div className="home-partnering-ticker__track">
          <TickerGroup copyId="a" />
          <TickerGroup copyId="b" />
        </div>
      </div>
    </div>
  );
}
