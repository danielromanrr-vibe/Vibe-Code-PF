/**
 * Shared contact grammar for pointer celebrations.
 * Hover is mouse-only. Touch maps to tap / scroll / brush — never sticky hover.
 */

export type ContactKind = 'pending' | 'tap' | 'scroll' | 'brush';

export const TAP_MAX_MS = 480;
export const TAP_SLOP_PX = 24;
export const SCROLL_CANCEL_DY_PX = 16;
export const SCROLL_CANCEL_DY_OVER_DX = 2.35;
export const BRUSH_MIN_DX_PX = 28;
/** Keep ink outside a typical fingertip. */
export const CONTACT_PAD_PX = 36;

export const isCoarsePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

export const isTouchLike = (event: { pointerType?: string }) =>
  event.pointerType === 'touch' || event.pointerType === 'pen';

/** Compatibility mouse events on phones — ignore so a tap does not double-fire. */
export const isCoarseMouse = (event: { pointerType?: string }) =>
  event.pointerType === 'mouse' && isCoarsePointer();

export const isFineMouse = (event: { pointerType?: string }) =>
  event.pointerType === 'mouse' && !isCoarsePointer();

export const shufflePick = <T,>(pool: readonly T[], count: number): T[] => {
  const a = [...pool];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i]!;
    a[i] = a[j]!;
    a[j] = t;
  }
  return a.slice(0, Math.max(0, Math.min(count, a.length)));
};

type ClassifyOpts = {
  allowBrush?: boolean;
};

/** Classify an in-progress contact from its origin. */
export const classifyContact = (
  dx: number,
  dy: number,
  _elapsedMs: number,
  opts: ClassifyOpts = {},
): ContactKind => {
  const adx = Math.abs(dx);
  const ady = Math.abs(dy);
  const dist = Math.hypot(dx, dy);

  if (ady >= SCROLL_CANCEL_DY_PX && ady >= adx * SCROLL_CANCEL_DY_OVER_DX) {
    return 'scroll';
  }

  if (opts.allowBrush && adx >= BRUSH_MIN_DX_PX && adx > ady * 1.15) {
    return 'brush';
  }

  if (dist <= TAP_SLOP_PX) return 'pending';

  if (ady >= adx) return 'scroll';
  if (opts.allowBrush && adx >= BRUSH_MIN_DX_PX) return 'brush';
  return 'scroll';
};

/** Resolve a finished contact on lift. */
export const classifyLift = (
  dx: number,
  dy: number,
  elapsedMs: number,
  opts: ClassifyOpts = {},
): Exclude<ContactKind, 'pending'> => {
  const during = classifyContact(dx, dy, elapsedMs, opts);
  if (during === 'pending') return elapsedMs <= TAP_MAX_MS ? 'tap' : 'scroll';
  return during;
};
