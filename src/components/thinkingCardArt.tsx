import design1 from '../assets/thinking-cards/design-1.svg';
import design2 from '../assets/thinking-cards/design-2.svg';
import design3 from '../assets/thinking-cards/design-3.svg';
import design4 from '../assets/thinking-cards/design-4.svg';
import design5 from '../assets/thinking-cards/design-5.svg';

/** Hero / page ink on navy — same register as the homepage field. */
export const KANDINSKY_INK = '#F8F9FA';

export type CardTheme = {
  back: string;
  front: string;
  ink: string;
  a: string;
  b: string;
  pop: string;
};

/** Shared hero sky — cards differ by dusk, not by a new color world. */
export const CARD_THEMES: readonly CardTheme[] = [
  { back: '#080f1c', front: '#050b16', ink: KANDINSKY_INK, a: '#1d3148', b: '#8a96a8', pop: '#080f1c' },
  { back: '#0a1424', front: '#050b18', ink: KANDINSKY_INK, a: '#1d3148', b: '#8a96a8', pop: '#0a1424' },
  { back: '#08111c', front: '#050c16', ink: KANDINSKY_INK, a: '#1d3148', b: '#8a96a8', pop: '#08111c' },
  { back: '#0a121c', front: '#060c16', ink: KANDINSKY_INK, a: '#1d3148', b: '#8a96a8', pop: '#0a121c' },
  { back: '#070b14', front: '#040810', ink: KANDINSKY_INK, a: '#1d3148', b: '#8a96a8', pop: '#070b14' },
];
/** artIndex → design-N.svg (1=challenge, 2=system, 3=build, 4=connect, 5=curious) */
const BACK_SRC_BY_ART_INDEX = [design1, design4, design2, design3, design5] as const;

const ART_CLASS = 'block h-full w-full object-cover object-center';

type ArtProps = { t: CardTheme };

function makeBackArt(src: string) {
  return function BackArt(_props: ArtProps) {
    return <img src={src} alt="" className={ART_CLASS} decoding="async" />;
  };
}

export const BACK_ARTS = BACK_SRC_BY_ART_INDEX.map((src) => makeBackArt(src));

function makeFrontArt(src: string) {
  return function FrontArt(_props: ArtProps) {
    return (
      <img src={src} alt="" className={`absolute inset-0 ${ART_CLASS} opacity-[0.22]`} aria-hidden />
    );
  };
}

export const FRONT_ARTS = BACK_SRC_BY_ART_INDEX.map((src) => makeFrontArt(src));
