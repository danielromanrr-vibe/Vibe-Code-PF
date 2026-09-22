/**
 * Shared pigment palettes for pointer celebrations (click burst + scroll trail).
 * Kandinsky gouache — chromatic enough to read on navy and paper, not neon.
 */
export const CELEBRATION_INK_PALETTES = [
  {
    line: 'rgba(78, 122, 236, 0.9)',
    fill: 'rgba(118, 154, 244, 0.42)',
    ring: 'rgba(92, 132, 238, 0.76)',
  },
  {
    line: 'rgba(224, 72, 86, 0.9)',
    fill: 'rgba(236, 108, 112, 0.4)',
    ring: 'rgba(228, 84, 94, 0.74)',
  },
  {
    line: 'rgba(28, 176, 148, 0.9)',
    fill: 'rgba(64, 196, 168, 0.4)',
    ring: 'rgba(40, 182, 154, 0.76)',
  },
  {
    line: 'rgba(232, 148, 36, 0.9)',
    fill: 'rgba(244, 174, 64, 0.4)',
    ring: 'rgba(236, 156, 42, 0.74)',
  },
  {
    line: 'rgba(126, 92, 236, 0.9)',
    fill: 'rgba(154, 122, 244, 0.4)',
    ring: 'rgba(136, 102, 238, 0.76)',
  },
  {
    line: 'rgba(148, 168, 36, 0.88)',
    fill: 'rgba(172, 188, 58, 0.38)',
    ring: 'rgba(156, 176, 42, 0.72)',
  },
  {
    line: 'rgba(206, 70, 158, 0.9)',
    fill: 'rgba(222, 102, 176, 0.4)',
    ring: 'rgba(212, 80, 164, 0.74)',
  },
] as const;

export type CelebrationInkPalette = {
  line: string;
  fill: string;
  ring: string;
};

/**
 * Click palettes are tuned for 7–9 overlapping marks. Trails spawn two,
 * so lift alpha so a single mark still reads as ink, not a whisper.
 */
export function inkWithPresence(
  palette: CelebrationInkPalette,
  gain = 1.22,
): CelebrationInkPalette {
  const bump = (color: string, cap: number) => {
    const match = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
    if (!match) return color;
    const alpha = Math.min(cap, parseFloat(match[4]) * gain);
    return `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${alpha})`;
  };
  return {
    line: bump(palette.line, 0.96),
    fill: bump(palette.fill, 0.55),
    ring: bump(palette.ring, 0.86),
  };
}

/** Kandinsky trail vocabulary — same family as click bursts. */
export type ScrollTrailKind =
  | 'spark'
  | 'dash'
  | 'trail'
  | 'orb'
  | 'diamond'
  | 'arc'
  | 'triangle'
  | 'wedge'
  | 'kite'
  | 'hex'
  | 'mandala'
  | 'bar'
  | 'thickBar'
  | 'ellipse'
  | 'path'
  | 'shard'
  | 'sweep'
  | 'zig';

export const SCROLL_TRAIL_PRIMARY: readonly ScrollTrailKind[] = [
  'spark',
  'thickBar',
  'bar',
  'dash',
  'trail',
  'path',
  'zig',
];

export const SCROLL_TRAIL_SECONDARY: readonly ScrollTrailKind[] = [
  'triangle',
  'wedge',
  'kite',
  'arc',
  'sweep',
  'diamond',
  'hex',
  'mandala',
  'ellipse',
  'orb',
  'shard',
];

/** Mixed Kandinsky set — pick one, less-is-more. */
export const SCROLL_TRAIL_KINDS: readonly ScrollTrailKind[] = [
  ...SCROLL_TRAIL_PRIMARY,
  ...SCROLL_TRAIL_SECONDARY,
];

const resetMarkStyle = (el: HTMLSpanElement) => {
  el.style.background = 'none';
  el.style.backgroundColor = 'transparent';
  el.style.backgroundImage = 'none';
  el.style.border = '0';
  el.style.borderRadius = '0';
  el.style.boxShadow = 'none';
  el.style.clipPath = 'none';
  el.style.width = '';
  el.style.height = '';
};

/**
 * Same glyphs as click/scroll celebrations and the footer sky trail.
 * `glyph` is the cursor's 0.82 scale; titles sit closer to constellation (≈0.7).
 */
export function paintCelebrationMark(
  el: HTMLSpanElement,
  kind: ScrollTrailKind,
  palette: CelebrationInkPalette,
  opacity: number,
  rot: number,
  seed: number,
  glyph = 0.82,
) {
  const visible = opacity > 0.02;
  el.style.opacity = visible ? String(Math.min(1, opacity)) : '0';
  el.style.visibility = visible ? 'visible' : 'hidden';
  const scale = (0.94 + opacity * 0.38) * glyph;
  const base = `translate(-50%, -50%) rotate(${rot}deg) scale(${scale})`;
  resetMarkStyle(el);

  if (kind === 'spark') {
    el.style.width = `${8 + (seed % 6) * 1.6}px`;
    el.style.height = seed % 3 === 0 ? '3px' : '1.5px';
    el.style.backgroundColor = palette.line;
    el.style.borderRadius = '1px';
    el.style.transform = base;
    return;
  }
  if (kind === 'dash') {
    el.style.width = `${14 + (seed % 4) * 2.2}px`;
    el.style.height = '0px';
    el.style.borderTop = `1.5px ${seed % 3 === 0 ? 'dashed' : 'solid'} ${palette.line}`;
    el.style.transform = base;
    return;
  }
  if (kind === 'trail') {
    const len = 12 + (seed % 5) * 2.4;
    el.style.width = `${len}px`;
    el.style.height = '2.5px';
    el.style.borderRadius = seed % 2 === 0 ? '2px 0 0 2px' : '0 2px 2px 0';
    el.style.background = `linear-gradient(90deg, ${palette.line}, ${palette.fill})`;
    el.style.transform = `translate(-50%, -50%) rotate(${rot}deg) scaleX(${(0.78 + opacity * 1.1) * glyph})`;
    return;
  }
  if (kind === 'thickBar') {
    el.style.width = `${16 + (seed % 4)}px`;
    el.style.height = `${3 + (seed % 2)}px`;
    el.style.backgroundColor = palette.line;
    el.style.borderRadius = '1px';
    el.style.transform = base;
    return;
  }
  if (kind === 'bar') {
    el.style.width = `${2 + (seed % 2)}px`;
    el.style.height = `${15 + (seed % 5)}px`;
    el.style.backgroundColor = palette.line;
    el.style.borderRadius = '1px';
    el.style.transform = `translate(-50%, -50%) rotate(${rot + 18}deg) scale(${scale})`;
    return;
  }
  if (kind === 'path') {
    el.style.width = `${18 + (seed % 5) * 2}px`;
    el.style.height = `${8 + (seed % 3)}px`;
    el.style.borderTop = `1.5px solid ${palette.line}`;
    el.style.borderRadius = '999px';
    el.style.transform = base;
    return;
  }
  if (kind === 'zig') {
    el.style.width = '18px';
    el.style.height = '11px';
    el.style.background = `linear-gradient(115deg, transparent 40%, ${palette.line} 40%, ${palette.line} 45%, transparent 45%, transparent 55%, ${palette.line} 55%, ${palette.line} 60%, transparent 60%)`;
    el.style.transform = base;
    return;
  }
  if (kind === 'diamond') {
    const d = `${10 + (seed % 3)}px`;
    el.style.width = d;
    el.style.height = d;
    el.style.border = `1.5px solid ${palette.ring}`;
    el.style.transform = `translate(-50%, -50%) rotate(${45 + (seed % 2) * 18}deg) scale(${scale})`;
    return;
  }
  if (kind === 'triangle') {
    el.style.width = '15px';
    el.style.height = '13px';
    el.style.backgroundColor = palette.fill;
    el.style.border = `1.5px solid ${palette.ring}`;
    el.style.clipPath = 'polygon(50% 0%, 100% 100%, 0% 100%)';
    el.style.transform = base;
    return;
  }
  if (kind === 'kite') {
    el.style.width = '13px';
    el.style.height = '13px';
    el.style.background = `linear-gradient(135deg, ${palette.fill}, transparent 55%)`;
    el.style.border = `1.5px solid ${palette.ring}`;
    el.style.clipPath = 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
    el.style.transform = base;
    return;
  }
  if (kind === 'shard') {
    el.style.width = '11px';
    el.style.height = '17px';
    el.style.backgroundColor = palette.line;
    el.style.clipPath = 'polygon(50% 0%, 100% 35%, 80% 100%, 20% 100%, 0% 35%)';
    el.style.transform = base;
    return;
  }
  if (kind === 'arc') {
    const a = `${16 + (seed % 4)}px`;
    el.style.width = a;
    el.style.height = a;
    el.style.borderRadius = '50%';
    el.style.border = `1.5px solid ${palette.ring}`;
    el.style.borderBottomColor = 'transparent';
    el.style.borderLeftColor = seed % 2 === 0 ? 'transparent' : palette.ring;
    el.style.transform = base;
    return;
  }
  if (kind === 'wedge') {
    const span = 48 + (seed % 5) * 14;
    el.style.width = '22px';
    el.style.height = '22px';
    el.style.background = `conic-gradient(from ${rot}deg, ${palette.fill} 0deg ${span}deg, transparent ${span}deg)`;
    el.style.transform = `translate(-50%, -50%) scale(${scale})`;
    return;
  }
  if (kind === 'sweep') {
    const span = 70 + (seed % 4) * 12;
    el.style.width = '24px';
    el.style.height = '24px';
    el.style.borderRadius = '50%';
    el.style.background = `conic-gradient(from ${rot}deg, ${palette.line} 0deg ${span}deg, transparent ${span}deg, transparent 360deg)`;
    el.style.transform = `translate(-50%, -50%) scale(${scale})`;
    return;
  }
  if (kind === 'mandala') {
    const m = `${13 + (seed % 3)}px`;
    el.style.width = m;
    el.style.height = m;
    el.style.borderRadius = '50%';
    el.style.border = `1.5px solid ${palette.ring}`;
    el.style.boxShadow = `0 0 0 1px ${palette.fill} inset`;
    el.style.transform = base;
    return;
  }
  if (kind === 'hex') {
    const h = `${11 + (seed % 2)}px`;
    el.style.width = h;
    el.style.height = h;
    el.style.border = `1.5px solid ${palette.ring}`;
    el.style.clipPath = 'polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)';
    el.style.transform = base;
    return;
  }
  if (kind === 'ellipse') {
    el.style.width = `${16 + (seed % 5) * 2}px`;
    el.style.height = `${9 + (seed % 4)}px`;
    el.style.borderRadius = '50%';
    el.style.border = `1.5px solid ${palette.ring}`;
    el.style.transform = base;
    return;
  }
  const o = `${Math.max(8, 8 + (seed % 4))}px`;
  el.style.width = o;
  el.style.height = o;
  el.style.borderRadius = '50%';
  el.style.border = `1.5px solid ${palette.ring}`;
  el.style.backgroundColor = palette.fill;
  el.style.transform = base;
}
