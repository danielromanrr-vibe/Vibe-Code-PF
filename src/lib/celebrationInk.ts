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
