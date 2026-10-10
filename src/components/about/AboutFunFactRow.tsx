import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { asides, type AboutAside } from '../../content/about';
import { BACK_ARTS, CARD_THEMES, FRONT_ARTS } from '../thinkingCardArt';

const LAYOUT = [
  { artIndex: 0, fan: '-8deg', z: 2, place: 'high' },
  { artIndex: 2, fan: '-2deg', z: 1, place: 'low' },
  { artIndex: 1, fan: '2deg', z: 1, place: 'center' },
  { artIndex: 4, fan: '8deg', z: 2, place: 'center' },
] as const;

export default function AboutFunFactRow() {
  const reduced = useReducedMotion();
  const [canHover, setCanHover] = useState(true);

  useEffect(() => {
    setCanHover(window.matchMedia('(hover: hover)').matches);
  }, []);

  const cards = asides.slice(0, LAYOUT.length);

  return (
    <ul className="about-fun-facts" aria-label="A few asides">
      {cards.map((card, index) => (
        <FunFactCard
          key={card.id}
          card={card}
          index={index}
          artIndex={LAYOUT[index]?.artIndex ?? 0}
          fan={LAYOUT[index]?.fan ?? '0deg'}
          z={LAYOUT[index]?.z ?? 1}
          place={LAYOUT[index]?.place ?? 'center'}
          canHover={canHover}
          reduced={!!reduced}
        />
      ))}
    </ul>
  );
}

function FunFactCard({
  card,
  index,
  artIndex,
  fan,
  z,
  place,
  canHover,
  reduced,
}: {
  card: AboutAside;
  index: number;
  artIndex: number;
  fan: string;
  z: number;
  place: 'high' | 'low' | 'center';
  canHover: boolean;
  reduced: boolean;
}) {
  const [flipped, setFlipped] = useState(false);
  const theme = CARD_THEMES[artIndex] ?? CARD_THEMES[0];
  const BackArt = BACK_ARTS[artIndex];
  const FrontArt = FRONT_ARTS[artIndex];

  const turn = (next: boolean) => {
    if (canHover) setFlipped(next);
  };

  const back = reduced
    ? { rotateY: flipped ? -90 : 0, opacity: flipped ? 0 : 1, transition: { duration: 0 } }
    : { rotateY: flipped ? -90 : 0, opacity: flipped ? 0 : 1 };
  const front = reduced
    ? { rotateY: flipped ? 0 : 90, opacity: flipped ? 1 : 0, transition: { duration: 0 } }
    : { rotateY: flipped ? 0 : 90, opacity: flipped ? 1 : 0 };
  const backTransition = reduced
    ? { duration: 0 }
    : flipped
      ? { rotateY: { duration: 0.22, ease: 'easeIn' as const }, opacity: { duration: 0.18, ease: 'easeIn' as const } }
      : { rotateY: { duration: 0.22, ease: 'easeOut' as const, delay: 0.18 }, opacity: { duration: 0.12, delay: 0.18 } };
  const frontTransition = reduced
    ? { duration: 0 }
    : flipped
      ? { rotateY: { duration: 0.22, ease: 'easeOut' as const, delay: 0.18 }, opacity: { duration: 0.12, delay: 0.18 } }
      : { rotateY: { duration: 0.22, ease: 'easeIn' as const }, opacity: { duration: 0.18, ease: 'easeIn' as const } };

  return (
    <li
      className="about-fun-facts__card"
      style={{ ['--fan' as string]: fan, ['--fan-z' as string]: flipped ? 5 : z }}
    >
      <button
        type="button"
        className="about-fun-facts__face"
        aria-pressed={flipped}
        aria-label={`${card.front.join('. ')}. ${card.items.join(', ')}`}
        onMouseEnter={() => turn(true)}
        onMouseLeave={() => turn(false)}
        onFocus={() => setFlipped(true)}
        onBlur={() => turn(false)}
        onClick={() => {
          if (!canHover) setFlipped((value) => !value);
        }}
      >
        <motion.span
          className={`about-fun-facts__side about-fun-facts__side--front is-${place}`}
          animate={back}
          transition={backTransition}
          aria-hidden={flipped}
        >
          {BackArt ? <BackArt t={theme} /> : null}
          <span className="about-fun-facts__copy">
            <span className="about-fun-facts__kicker">{String(index + 1).padStart(2, '0')}</span>
            {card.front.map((line) => (
              <span key={line} className="about-fun-facts__title">
                {line}
              </span>
            ))}
            {card.id === 'explorer'
              ? card.items.map((line) => (
                  <span key={line} className="about-fun-facts__title">
                    {line}
                  </span>
                ))
              : null}
          </span>
        </motion.span>
        <motion.span
          className={`about-fun-facts__side about-fun-facts__side--fact is-${card.kind}`}
          animate={front}
          transition={frontTransition}
          style={{ background: theme.front, color: theme.ink }}
          aria-hidden={!flipped}
        >
          {FrontArt ? <FrontArt t={theme} /> : null}
          {card.kind === 'list' ? (
            <ul className="about-fun-facts__list">
              {card.items.map((item, itemIndex) => (
                <li key={item} className="about-fun-facts__item">
                  <span className="about-fun-facts__index">{String(itemIndex + 1).padStart(2, '0')}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <span className="about-fun-facts__copy">
              {card.items.map((line) => (
                <span key={line} className="about-fun-facts__back">
                  {line}
                </span>
              ))}
            </span>
          )}
        </motion.span>
      </button>
    </li>
  );
}
