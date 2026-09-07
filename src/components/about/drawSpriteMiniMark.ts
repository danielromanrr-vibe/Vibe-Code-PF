import type { MandalaSpriteId } from '../../lib/mandalaSprite';

const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

function hsbToRgb(h: number, s: number, br: number): [number, number, number] {
  const sat = s / 100;
  const val = br / 100;
  const k = (n: number) => (n + h / 60) % 6;
  const f = (n: number) => val * (1 - sat * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
  return [Math.round(255 * f(5)), Math.round(255 * f(3)), Math.round(255 * f(1))];
}

/**
 * Compressed playground doors — readable at ~52px, not a shrink of the full field.
 * Paloma stays stroke-led (no gold blob).
 */
export function drawSpriteMiniMark(
  ctx: CanvasRenderingContext2D,
  id: MandalaSpriteId,
  t: number,
  active: boolean,
  size: number,
): void {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const gain = active ? 1 : 0.72;
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  if (id === 'euphoria') drawEuphoriaMini(ctx, cx, cy, r, t, gain);
  else if (id === 'clockwise') drawClockwiseMini(ctx, cx, cy, r, t, gain);
  else if (id === 'memphis') drawMemphisMini(ctx, cx, cy, r, t, gain);
  else drawPalomaMini(ctx, cx, cy, r, t, gain);
  ctx.restore();
}

function drawEuphoriaMini(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  t: number,
  gain: number,
): void {
  const rings = 4;
  for (let i = 0; i < rings; i++) {
    const u = (i + 1) / rings;
    const pulse = Math.sin(t * 0.9 + i * 0.7) * r * 0.035;
    const rx = r * u + pulse;
    const ry = r * u * (0.92 + Math.sin(t * 0.55 + i) * 0.03);
    ctx.strokeStyle = `rgba(20, 20, 20, ${0.28 * gain + u * 0.42 * gain})`;
    ctx.lineWidth = i === rings - 1 ? 1.35 : i % 2 === 0 ? 1.05 : 0.7;
    ctx.setLineDash(i === 1 ? [2.2, 2.4] : []);
    ctx.beginPath();
    ctx.ellipse(cx, cy, Math.max(0.6, rx), Math.max(0.6, ry), i * 0.12, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.setLineDash([]);
  for (let k = 0; k < 3; k++) {
    const ang = t * 0.35 + (k / 3) * Math.PI * 2;
    ctx.strokeStyle = `rgba(20, 20, 20, ${0.5 * gain})`;
    ctx.lineWidth = 0.85;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(ang) * r * 0.62, cy + Math.sin(ang) * r * 0.62);
    ctx.lineTo(cx + Math.cos(ang) * r * 0.9, cy + Math.sin(ang) * r * 0.9);
    ctx.stroke();
  }
}

function drawClockwiseMini(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  t: number,
  gain: number,
): void {
  const palette: Array<readonly [number, number, number]> = [
    [72, 96, 168],
    [48, 68, 128],
    [132, 148, 196],
    [88, 108, 176],
  ];
  const spin = t * 0.55;
  ctx.lineCap = 'round';
  for (let i = 0; i < 4; i++) {
    const [cr, cg, cb] = palette[i]!;
    const rad = r * (0.38 + i * 0.17);
    const start = spin + i * 0.7;
    const len = Math.PI * (0.58 + Math.sin(i * 1.5) * 0.12);
    ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${0.7 * gain})`;
    ctx.lineWidth = i % 4 === 0 ? 1.7 : 1.15;
    if (i % 2 === 0) ctx.setLineDash([4.5, 2.4]);
    else ctx.setLineDash([]);
    ctx.lineDashOffset = -t * 12;
    ctx.beginPath();
    ctx.arc(cx, cy, rad, start, start + len);
    ctx.stroke();
  }
  ctx.setLineDash([]);
  ctx.fillStyle = `rgba(72, 96, 168, ${0.72 * gain})`;
  const tip = spin + Math.PI * 0.7;
  const sz = 2.2;
  ctx.fillRect(cx + Math.cos(tip) * r * 0.86 - sz / 2, cy + Math.sin(tip) * r * 0.86 - sz / 2, sz, sz);
}

function drawMemphisMini(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  t: number,
  gain: number,
): void {
  const palette: Array<readonly [number, number, number]> = [
    [214, 92, 72],
    [216, 168, 64],
    [36, 132, 136],
  ];
  const sides = [5, 4, 6];
  const radii = [0.92, 0.58, 0.32];
  for (let i = 0; i < 3; i++) {
    const [cr, cg, cb] = palette[i]!;
    const sign = i % 2 === 0 ? 1 : -1;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(t * (0.22 + i * 0.08) * sign);
    ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${0.82 * gain})`;
    ctx.lineWidth = i === 0 ? 1.65 : 1.2;
    ctx.setLineDash(i === 0 ? [3.2, 2] : []);
    polygon(ctx, sides[i]!, r * radii[i]!);
    ctx.stroke();
    if (i === 1) {
      ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${0.16 * gain})`;
      ctx.fill();
    }
    ctx.restore();
  }

  ctx.setLineDash([]);
  ctx.fillStyle = `rgba(214, 92, 72, ${0.82 * gain})`;
  ctx.fillRect(cx + r * 0.58 - 1.3, cy - r * 0.16 - 1.3, 2.6, 2.6);
  ctx.fillStyle = `rgba(36, 132, 136, ${0.8 * gain})`;
  ctx.beginPath();
  ctx.arc(cx - r * 0.52, cy + r * 0.38, 1.45, 0, Math.PI * 2);
  ctx.fill();
}

function drawPalomaMini(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  t: number,
  gain: number,
): void {
  for (let i = 0; i < 5; i++) {
    const hue = 46 + Math.sin(t * 0.35 + i * 0.28) * 2.5;
    const [cr, cg, cb] = hsbToRgb(hue, lerp(62, 78, i / 4), lerp(86, 94, 1 - i / 4));
    const w = r * (1.05 - i * 0.14);
    const h = r * (0.52 - i * 0.055);
    if (w < 1.2 || h < 0.7) continue;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(i * 0.42 + t * 0.16);
    if (i === 2) {
      ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${0.18 * gain})`;
      ctx.beginPath();
      ctx.ellipse(0, 0, w, Math.max(0.55, h), 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${0.8 * gain})`;
    ctx.lineWidth = i === 0 ? 1.5 : 1.05;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.ellipse(0, 0, w, Math.max(0.55, h), 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

function polygon(ctx: CanvasRenderingContext2D, sides: number, radius: number): void {
  ctx.beginPath();
  for (let s = 0; s <= sides; s++) {
    const a = (s / sides) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(a) * radius;
    const y = Math.sin(a) * radius;
    if (s === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
}
