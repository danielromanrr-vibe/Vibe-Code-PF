/** Shared depth-wheel motion — Process Overview + Thinking deck modal. */

export const STACK_RANGE = 2.35;

/**
 * Bottom-origin scale shrinks the top edge down by ~H*(1-s).
 * Y must clear that shrinkage PLUS a visible rim, or the card behind is fully covered.
 */
const STACK_REF_HEIGHT = 460;
const PEEK_RIM_PX = 22;
const PEEK_RIM_DEEP_PX = 36;

function peekYForScale(scale: number, rimPx: number): number {
  return -(STACK_REF_HEIGHT * (1 - scale) + rimPx);
}

/** Milder scales so a clear rim stays visible above the front card. */
export const STACK_PEEK_SCALE = { tier1: 0.92, tier2: 0.84, front: 1 } as const;

export const STACK_PEEK_Y = {
  tier1: peekYForScale(STACK_PEEK_SCALE.tier1, PEEK_RIM_PX),
  tier2: peekYForScale(STACK_PEEK_SCALE.tier2, PEEK_RIM_DEEP_PX),
  exit: peekYForScale(0.88, PEEK_RIM_PX),
} as const;

export const CARD_SPRING = { stiffness: 118, damping: 22, mass: 0.36 };

export const DEPTH_SHELL = {
  front: {
    bg: '#FAF8F4',
    shadow: '0 1px 2px rgba(12, 21, 40, 0.04), 0 6px 18px rgba(12, 21, 40, 0.06)',
  },
  mid: {
    bg: '#F2EFE9',
    shadow: '0 1px 2px rgba(12, 21, 40, 0.03), 0 3px 10px rgba(12, 21, 40, 0.045)',
  },
  deep: {
    bg: '#EAE6DF',
    shadow: '0 1px 2px rgba(12, 21, 40, 0.03)',
  },
} as const;

export const EDITORIAL_STAGE_MIN_HEIGHT = 'var(--process-stage-height)';

type DepthTier = 0 | 1 | 2 | 'hidden';

export type CardStackMotion = {
  y: number;
  opacity: number;
  scale: number;
  zIndex: number;
  tier: DepthTier;
  isFront: boolean;
  visible: boolean;
  backgroundColor: string;
  boxShadow: string;
};

function smoothstep(t: number): number {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpHex(from: string, to: string, t: number): string {
  const parse = (hex: string) => {
    const h = hex.replace('#', '');
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  };
  const a = parse(from);
  const b = parse(to);
  const mix = a.map((v, i) => Math.round(lerp(v, b[i], t)));
  return `rgb(${mix[0]} ${mix[1]} ${mix[2]})`;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

/** Continuous scroll position across N steps (0 → n-1). */
export function scrollPosition(p: number, total: number): number {
  if (total <= 1) return 0;
  return clamp01(p) * (total - 1);
}

/**
 * Stack depth for deck affordance.
 * 0 = front; (0,1) = exiting; negative = behind (upcoming, or wrapped under after leaving).
 * Ensures the last card still has a card peeping behind (wrap).
 */
export function wheelDistance(pos: number, cardIndex: number, total: number): number {
  if (total <= 1) return 0;
  let d = pos - cardIndex;
  // Fully passed cards wrap under the stack so a rim always remains behind.
  if (d >= 1) d -= total;
  if (d < 1 - total) d += total;
  return d;
}

type DepthShell = { backgroundColor: string; boxShadow: string };

function shellFromDepth(scale: number, tier: DepthTier): DepthShell {
  if (tier === 0 || scale >= 0.96) {
    return { backgroundColor: DEPTH_SHELL.front.bg, boxShadow: DEPTH_SHELL.front.shadow };
  }
  if (tier === 1 || scale >= 0.88) {
    return { backgroundColor: DEPTH_SHELL.mid.bg, boxShadow: DEPTH_SHELL.mid.shadow };
  }
  return { backgroundColor: DEPTH_SHELL.deep.bg, boxShadow: DEPTH_SHELL.deep.shadow };
}

/** Y that keeps a visible rim above the front card for a given scale (bottom-origin). */
function yForScale(scale: number, rimPx: number): number {
  return peekYForScale(scale, rimPx);
}

/** Bottom-anchored depth stack — scale + offset + tone; no blur. */
export function getCardStackMotion(cardIndex: number, p: number, total: number): CardStackMotion {
  const n = Math.max(1, total);
  if (n === 1) {
    const shell = shellFromDepth(1, 0);
    return {
      y: 0,
      opacity: 1,
      scale: 1,
      zIndex: 30,
      tier: 0,
      isFront: true,
      visible: true,
      backgroundColor: shell.backgroundColor,
      boxShadow: shell.boxShadow,
    };
  }

  const pos = scrollPosition(p, n);
  const d = wheelDistance(pos, cardIndex, n);

  if (d > 1.08 || d < -STACK_RANGE) {
    return {
      y: STACK_PEEK_Y.tier2,
      opacity: 0,
      scale: STACK_PEEK_SCALE.tier2,
      zIndex: 0,
      tier: 'hidden',
      isFront: false,
      visible: false,
      backgroundColor: DEPTH_SHELL.deep.bg,
      boxShadow: 'none',
    };
  }

  let y: number;
  let opacity: number;
  let scale: number;
  let zIndex: number;
  let tier: DepthTier;
  let isFront: boolean;

  if (d > 0) {
    // Exiting forward — lift away while the next card becomes front.
    const t = smoothstep(d);
    scale = lerp(1, 0.88, t);
    y = lerp(0, yForScale(0.88, PEEK_RIM_PX), t);
    opacity = lerp(1, 0.55, t);
    zIndex = Math.round(lerp(30, 12, t));
    tier = t < 0.45 ? 0 : 1;
    isFront = t < 0.25;
  } else if (d > -1) {
    // Next card behind → rising to front.
    const t = smoothstep(1 + d);
    scale = lerp(STACK_PEEK_SCALE.tier1, 1, t);
    y = lerp(yForScale(STACK_PEEK_SCALE.tier1, PEEK_RIM_PX), 0, t);
    opacity = lerp(0.94, 1, t);
    zIndex = Math.round(lerp(18, 30, t));
    tier = t < 0.55 ? 1 : 0;
    isFront = t > 0.68;
  } else if (d > -2) {
    // Second card in the stack — always a visible rim.
    const t = smoothstep(2 + d);
    scale = lerp(STACK_PEEK_SCALE.tier2, STACK_PEEK_SCALE.tier1, t);
    y = lerp(
      yForScale(STACK_PEEK_SCALE.tier2, PEEK_RIM_DEEP_PX),
      yForScale(STACK_PEEK_SCALE.tier1, PEEK_RIM_PX),
      t,
    );
    opacity = lerp(0.82, 0.94, t);
    zIndex = Math.round(lerp(10, 18, t));
    tier = t < 0.4 ? 2 : 1;
    isFront = false;
  } else {
    const t = smoothstep((d + STACK_RANGE) / (STACK_RANGE - 2));
    scale = STACK_PEEK_SCALE.tier2;
    y = yForScale(STACK_PEEK_SCALE.tier2, PEEK_RIM_DEEP_PX);
    opacity = lerp(0, 0.82, t);
    zIndex = 10;
    tier = 2;
    isFront = false;
  }

  const shell = shellFromDepth(scale, tier);
  let backgroundColor = shell.backgroundColor;
  if (scale < 0.97 && scale > 0.9) {
    backgroundColor = lerpHex(DEPTH_SHELL.mid.bg, DEPTH_SHELL.front.bg, (scale - 0.9) / 0.07);
  } else if (scale <= 0.9) {
    backgroundColor = lerpHex(DEPTH_SHELL.deep.bg, DEPTH_SHELL.mid.bg, Math.max(0, (scale - 0.82) / 0.08));
  }

  if (isFront && Math.abs(d) < 0.08 && n > 1) {
    scale = STACK_PEEK_SCALE.front;
    y = 0;
  }

  return {
    y,
    opacity,
    scale,
    zIndex,
    tier,
    isFront,
    visible: opacity > 0.04,
    backgroundColor,
    boxShadow: shell.boxShadow,
  };
}

export function nearestStepIndex(p: number, total: number): number {
  return Math.min(total - 1, Math.max(0, Math.round(scrollPosition(p, total))));
}

/** Inverse of scrollPosition — set the wheel to an exact moment when click/keyboard drives. */
export function progressFromIndex(index: number, total: number): number {
  if (total <= 1) return 0;
  return clamp01(index / (total - 1));
}

/** Peek band above the front card — room for stacked rims. */
export function stackPeekBandForCount(count: number): string {
  const baseRem = 2.75;
  const extraRem = Math.max(0, count - 3) * 0.35;
  return `${baseRem + extraRem}rem`;
}
