import design1 from '../assets/thinking-cards/design-1.svg';
import design2 from '../assets/thinking-cards/design-2.svg';
import design3 from '../assets/thinking-cards/design-3.svg';
import design4 from '../assets/thinking-cards/design-4.svg';
import design5 from '../assets/thinking-cards/design-5.svg';

/** Shared cream ink for eyebrow numerals on dark fields */
export const KANDINSKY_INK = '#F4EFE4';

export type CardTheme = {
  back: string;
  front: string;
  ink: string;
  a: string;
  b: string;
  pop: string;
};

/** Flip-face rim tint only — card art is your SVG files in assets/thinking-cards/ */
export const CARD_THEMES: readonly CardTheme[] = [
  { back: '#101C3A', front: '#152238', ink: KANDINSKY_INK, a: '#3360AD', b: '#5A90EC', pop: '#101C3A' },
  { back: '#2B2402', front: '#222210', ink: KANDINSKY_INK, a: '#EEC741', b: '#DCA600', pop: '#2B2402' },
  { back: '#2E0E06', front: '#2A1408', ink: KANDINSKY_INK, a: '#D93B24', b: '#EF6B41', pop: '#2E0E06' },
  { back: '#041D12', front: '#143028', ink: KANDINSKY_INK, a: '#007D56', b: '#21AA7F', pop: '#041D12' },
  { back: '#1C0F2B', front: '#282040', ink: KANDINSKY_INK, a: '#714CA0', b: '#9B77C5', pop: '#1C0F2B' },
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
      <img src={src} alt="" className={`absolute inset-0 ${ART_CLASS} opacity-[0.14]`} aria-hidden />
    );
  };
}

export const FRONT_ARTS = BACK_SRC_BY_ART_INDEX.map((src) => makeFrontArt(src));
