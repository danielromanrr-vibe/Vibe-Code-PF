const TICKER_ITEMS = [
  'Product design',
  'UX design',
  'Visual design',
  'Interaction design',
  'System design',
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

type HomePartneringTickerProps = {
  /** Star pass finished (or intro skipped) — allowed to drop. */
  dropped?: boolean;
  /** Viewport is still in the hero — same gate as the nav role label. */
  heroActive?: boolean;
  /** Identity mandala is open — marquee eases back. */
  recede?: boolean;
};

/**
 * Hero marquee — drops from under the nav after the star, lives only while the hero is in view.
 */
export default function HomePartneringTicker({
  dropped = false,
  heroActive = false,
  recede = false,
}: HomePartneringTickerProps) {
  const open = dropped && heroActive;

  return (
    <div
      className={[
        'home-hero-marquee-slot',
        open ? 'is-open' : '',
        recede && open ? 'is-recede' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-hidden={!open}
    >
      <div className="home-partnering-ticker home-partnering-ticker--hero" aria-label={open ? TICKER_LABEL : undefined}>
        <div className="home-partnering-ticker__viewport">
          <div className="home-partnering-ticker__track">
            <TickerGroup copyId="a" />
            <TickerGroup copyId="b" />
          </div>
        </div>
      </div>
    </div>
  );
}
