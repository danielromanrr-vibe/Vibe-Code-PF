/**
 * Shared product sprite (homepage / nav). About keeps its own local id and
 * must not write this store — banner and nav stay the default Euphoria mark.
 */

export const MANDALA_SPRITE_IDS = ['euphoria', 'clockwise', 'memphis', 'paloma'] as const;
export type MandalaSpriteId = (typeof MANDALA_SPRITE_IDS)[number];

export const MANDALA_SPRITE_NAMES: Record<MandalaSpriteId, string> = {
  euphoria: 'Euphoria',
  clockwise: 'Clockwise',
  memphis: 'Memphis',
  paloma: 'Paloma',
};

const STORAGE_KEY = 'pf-mandala-sprite';

const MEMPHIS_POOL = [
  'rgb(204, 98, 78)',
  'rgb(210, 164, 72)',
  'rgb(38, 122, 128)',
  'rgb(118, 82, 148)',
  'rgb(28, 32, 40)',
] as const;

const CLOCKWISE_POOL = [
  'rgb(72, 96, 168)',
  'rgb(48, 68, 128)',
  'rgb(132, 148, 196)',
] as const;

const PALOMA_POOL = [
  'rgb(196, 132, 36)',
  'rgb(228, 168, 48)',
  'rgb(242, 196, 72)',
  'rgb(250, 220, 128)',
] as const;

const CHARCOAL = { r: 20, g: 20, b: 20 };

const listeners = new Set<(id: MandalaSpriteId) => void>();
let currentId: MandalaSpriteId = readStoredSprite();

function isSpriteId(value: string | null): value is MandalaSpriteId {
  return value != null && (MANDALA_SPRITE_IDS as readonly string[]).includes(value);
}

function readStoredSprite(): MandalaSpriteId {
  if (typeof window === 'undefined') return 'euphoria';
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return isSpriteId(raw) ? raw : 'euphoria';
  } catch {
    return 'euphoria';
  }
}

function persist(id: MandalaSpriteId): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, id);
  } catch {
    /* ignore quota / private mode */
  }
}

export function getMandalaSpriteId(): MandalaSpriteId {
  return currentId;
}

export function setMandalaSpriteId(id: MandalaSpriteId): void {
  if (id === currentId) return;
  currentId = id;
  persist(id);
  listeners.forEach((fn) => fn(id));
}

export function cycleMandalaSprite(): MandalaSpriteId {
  const i = MANDALA_SPRITE_IDS.indexOf(currentId);
  const next = MANDALA_SPRITE_IDS[(i + 1) % MANDALA_SPRITE_IDS.length] ?? 'euphoria';
  setMandalaSpriteId(next);
  return next;
}

export function subscribeMandalaSprite(fn: (id: MandalaSpriteId) => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

const hue2rgb = (p: number, q: number, t: number) => {
  let u = t;
  if (u < 0) u += 1;
  if (u > 1) u += -1;
  if (u < 1 / 6) return p + (q - p) * 6 * u;
  if (u < 1 / 2) return q;
  if (u < 2 / 3) return p + (q - p) * (2 / 3 - u) * 6;
  return p;
};

/** Current Euphoria grab shuffle — keep default look. */
export function randomEuphoriaColor(): string {
  const h = Math.random();
  const s = 0.7 + Math.random() * 0.2;
  const l = 0.5 + Math.random() * 0.1;
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
  const g = Math.round(hue2rgb(p, q, h) * 255);
  const b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);
  return `rgb(${r}, ${g}, ${b})`;
}

function parseRgb(color: string): { r: number; g: number; b: number } {
  const m = color.match(/\d+/g);
  if (!m || m.length < 3) return { ...CHARCOAL };
  return { r: Number(m[0]), g: Number(m[1]), b: Number(m[2]) };
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function hsbToRgb(h: number, s: number, br: number): { r: number; g: number; b: number } {
  const sat = s / 100;
  const val = br / 100;
  const k = (n: number) => (n + h / 60) % 6;
  const f = (n: number) => val * (1 - sat * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
  return {
    r: Math.round(255 * f(5)),
    g: Math.round(255 * f(3)),
    b: Math.round(255 * f(1)),
  };
}

export function sampleSpritePalette(id: MandalaSpriteId = currentId): [string, string, string] {
  if (id === 'euphoria') {
    return [randomEuphoriaColor(), randomEuphoriaColor(), randomEuphoriaColor()];
  }
  if (id === 'paloma') {
    return [PALOMA_POOL[0], PALOMA_POOL[1], PALOMA_POOL[3]];
  }
  if (id === 'clockwise') {
    return [CLOCKWISE_POOL[0], CLOCKWISE_POOL[1], CLOCKWISE_POOL[2]];
  }
  const start = Math.floor(Math.random() * MEMPHIS_POOL.length);
  return [
    MEMPHIS_POOL[start % MEMPHIS_POOL.length]!,
    MEMPHIS_POOL[(start + 1) % MEMPHIS_POOL.length]!,
    MEMPHIS_POOL[(start + 2) % MEMPHIS_POOL.length]!,
  ];
}

/** Matches Mandala `NUM_LAYERS` — outer ring index used to lock stroke skins to Paloma. */
const LAYER_COUNT = 30;
const LAYER_OUTER = 10 + (LAYER_COUNT - 1) * 14;
/** Paloma’s outer ellipse radius in draw units (radX at rest rings). */
const PALOMA_REF_RADIUS = 82;

/** About pins a skin — every sprite uses Paloma’s rest size. */
export function spriteRestSize(_id: MandalaSpriteId, pinned: boolean): number {
  return pinned ? 62 : 18;
}

/** Paloma’s About presence: 1.24 at rest, opens slightly on hold. Homepage uses fieldScale as-is. */
export function spritePresenceMul(fieldScale: number, energy = 0): number {
  if (fieldScale >= 1) return fieldScale;
  return lerp(1.24, 1.36, energy);
}

/** Paloma body scale — shared reference for every About skin. */
export function spriteBodyScale(currentSize: number, fieldScale: number, energy = 0): number {
  return (Math.max(currentSize, 36) / 50) * spritePresenceMul(fieldScale, energy);
}

/**
 * Layer fieldScale so the outer ring matches Paloma’s coin.
 * Homepage (unpinned) keeps the raw fieldScale.
 */
export function spriteAboutFieldMul(
  pinned: boolean,
  fieldScale: number,
  currentSize = 62,
  energy = 0,
): number {
  if (!pinned) return fieldScale;
  const palomaR = PALOMA_REF_RADIUS * spriteBodyScale(currentSize, fieldScale, energy);
  const layerOuter = LAYER_OUTER * (Math.max(currentSize, 36) / 50);
  return palomaR / layerOuter;
}

export function spriteRestLayerAlpha(id: MandalaSpriteId, pinned: boolean): number {
  if (!pinned) return 0.11;
  if (id === 'euphoria') return 0.3;
  if (id === 'memphis') return 0.42;
  if (id === 'clockwise') return 0.2;
  return 0.11;
}

export function spriteRotationMul(id: MandalaSpriteId, pressFactor: number): number {
  if (id === 'clockwise') return lerp(1.2, 5.2, pressFactor);
  if (id === 'memphis') return lerp(0.95, 1.55, pressFactor);
  if (id === 'paloma') return lerp(0.92, 1.35, pressFactor);
  return 1;
}

export function spriteRotationSign(id: MandalaSpriteId, layerIndex: number): number {
  if (id === 'memphis') return layerIndex % 2 === 0 ? 1 : -1;
  return 1;
}

export function spriteLineWidthMul(id: MandalaSpriteId): number {
  if (id === 'memphis') return 1.35;
  if (id === 'paloma') return 1;
  return 1;
}

export function spriteDashOffset(id: MandalaSpriteId, t: number, pressFactor: number): number {
  if (id !== 'clockwise') return 0;
  return -t * 15 * (1 + pressFactor * 2);
}

export function spriteRestColorBias(id: MandalaSpriteId): number {
  if (id === 'memphis') return 0.82;
  if (id === 'clockwise') return 0.48;
  if (id === 'paloma') return 0.48;
  return 0;
}

export function spriteAllowsSoftFill(id: MandalaSpriteId, pressFactor: number, tiny: boolean): boolean {
  if (tiny) return false;
  if (id === 'paloma') return true;
  if (id === 'memphis' || id === 'clockwise') return pressFactor > 0.45;
  return false;
}

export function resolveSpriteAccent(
  id: MandalaSpriteId,
  layerIndex: number,
  t: number,
  pressFactor: number,
  paletteColor: string,
): { r: number; g: number; b: number } {
  if (id === 'paloma') {
    const u = (layerIndex % 8) / 7;
    const hue = 43 + u * 13 + Math.sin(t * 0.28 + layerIndex * 0.14) * 2;
    const sat = lerp(58, 80, pressFactor) + u * 6;
    return hsbToRgb(Math.max(41, Math.min(57, hue)), sat, lerp(84, 96, 1 - u * 0.24));
  }

  if (id === 'clockwise') {
    const hue = 224 + Math.sin(t * 0.28 + layerIndex * 0.12) * 8;
    return hsbToRgb(hue, lerp(48, 64, pressFactor), lerp(50, 68, pressFactor));
  }

  if (id === 'euphoria') {
    return parseRgb(paletteColor);
  }

  return parseRgb(MEMPHIS_POOL[layerIndex % MEMPHIS_POOL.length]!);
}

export function resolveSpriteStroke(
  id: MandalaSpriteId,
  layerIndex: number,
  t: number,
  pressFactor: number,
  hoverFactor: number,
  paletteColor: string,
  tinyInkBias: number,
  grabFactor = 0,
): { r: number; g: number; b: number } {
  const accent = resolveSpriteAccent(
    id,
    layerIndex,
    t,
    Math.max(pressFactor, grabFactor * 0.7),
    paletteColor,
  );
  const rest = spriteRestColorBias(id);
  const colorFactor = Math.min(
    1,
    rest + 0.28 + pressFactor * 1.08 + grabFactor * 0.55 + hoverFactor * 0.38 + tinyInkBias,
  );
  return {
    r: Math.round(lerp(CHARCOAL.r, accent.r, colorFactor)),
    g: Math.round(lerp(CHARCOAL.g, accent.g, colorFactor)),
    b: Math.round(lerp(CHARCOAL.b, accent.b, colorFactor)),
  };
}
