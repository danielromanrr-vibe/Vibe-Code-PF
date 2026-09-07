import {
  resolveSpriteStroke,
  spriteBodyScale,
  type MandalaSpriteId,
} from '../../lib/mandalaSprite';

const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

function hsbToRgb(h: number, s: number, br: number): [number, number, number] {
  const sat = s / 100;
  const val = br / 100;
  const k = (n: number) => (n + h / 60) % 6;
  const f = (n: number) => val * (1 - sat * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
  return [Math.round(255 * f(5)), Math.round(255 * f(3)), Math.round(255 * f(1))];
}

function map(val: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  return outMin + (outMax - outMin) * ((val - inMin) / (inMax - inMin));
}

/** Same gold family: honey → amber → coin → champagne. */
function palomaShade(
  u: number,
  shimmer: number,
  energy: number,
  hf: number,
): { r: number; g: number; b: number } {
  const hue = 43 + u * 13 + shimmer * 0.28;
  const sat = Math.min(
    92,
    lerp(58, 82, u) + energy * 10 + hf * 7 + Math.sin(u * Math.PI * 2 + shimmer) * 4,
  );
  const bright = lerp(86, 97, 1 - u * 0.2) + energy * 2;
  const [r, g, b] = hsbToRgb(Math.max(41, Math.min(57, hue)), sat, Math.min(98, bright));
  return { r, g, b };
}

/** Paloma — original gold body. Pickup (gf) floods; hover warms; hold grows via currentSize. */
export function drawPalomaField(
  ctx: CanvasRenderingContext2D,
  opts: {
    cx: number;
    cy: number;
    t: number;
    pf: number;
    hf: number;
    gf: number;
    currentSize: number;
    fieldScale: number;
  },
): void {
  const { cx, cy, t, pf, hf, gf, currentSize, fieldScale } = opts;
  const energy = Math.min(1, gf * 0.72 + pf * 0.55);
  const scale = spriteBodyScale(currentSize, fieldScale, energy);
  const rotationFactor = lerp(0.52, lerp(0.78, 1.12, pf), gf);
  const shimmer = Math.sin(t * 0.28) * 1.6;

  ctx.save();
  ctx.translate(cx, cy);

  for (let r = 0; r < 3; r++) {
    const radX = (52 + r * 15) * scale;
    const radY = (28 + r * 10) * scale;
    const ring = palomaShade(r / 2, shimmer, energy, hf);
    ctx.save();
    ctx.rotate(r * 0.14 + t * 0.022);
    ctx.strokeStyle = `rgba(${ring.r}, ${ring.g}, ${ring.b}, ${lerp(0.52, 0.78, energy) + hf * 0.08})`;
    ctx.lineWidth = lerp(0.65, 1.15, energy);
    ctx.beginPath();
    ctx.ellipse(0, 0, radX, radY, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  for (let i = 0; i < 30; i++) {
    const oscillationFactor = Math.sin(t * 0.72 + i) * 0.2 + 1;
    let w = 150 * scale - i * 4;
    let h = 80 * scale - i * 3;
    w *= oscillationFactor;
    h *= oscillationFactor;
    if (w <= 0 || h <= 0) continue;

    const u = i / 29;
    const shade = palomaShade(u, shimmer + i * 0.28, energy, hf);
    const alphaEdgeFade = map(u, 0, 1, 0.6, 1);
    const alpha = alphaEdgeFade * (lerp(0.74, 0.96, energy) + hf * 0.1);

    ctx.save();
    ctx.rotate(i * rotationFactor);
    ctx.fillStyle = `rgba(${shade.r}, ${shade.g}, ${shade.b}, ${Math.max(0, Math.min(1, alpha))})`;
    ctx.beginPath();
    ctx.ellipse(0, 0, Math.max(0.4, w / 2), Math.max(0.4, h / 2), 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

/**
 * Clockwise — OG 14-ring turbine (sprite 2 spec).
 * Rest: partial dashed arcs + quiet vertex marks.
 * Hold: arcs complete, dashes race, two trails, even-layer wash, orbiting nodes.
 */
export function drawClockwiseField(
  ctx: CanvasRenderingContext2D,
  opts: {
    cx: number;
    cy: number;
    t: number;
    pf: number;
    hf: number;
    gf: number;
    currentSize: number;
    fieldScale: number;
    rotationAccumulator: number;
  },
): void {
  const { cx, cy, t, pf, hf, gf, currentSize, fieldScale, rotationAccumulator } = opts;
  const scale = spriteBodyScale(currentSize, fieldScale, pf);
  const outer = 82 * scale;
  const inner = outer * (18 / 148);
  const jitter = pf * 5;
  const lcx = cx + (Math.random() - 0.5) * jitter;
  const lcy = cy + (Math.random() - 0.5) * jitter;
  const numLayers = 14;

  ctx.save();
  ctx.shadowBlur = 0;
  ctx.lineCap = 'round';

  for (let i = 0; i < numLayers; i++) {
    const baseRadius = lerp(inner, outer, i / (numLayers - 1));
    const currentAmp = lerp(4, 22, pf);
    const oscillation = Math.sin(t * 2 + i * 0.8) * currentAmp;
    const rad = Math.max(0.1, baseRadius + oscillation);
    const rotationOffset =
      rotationAccumulator * (0.2 + i * 0.05) + (i * Math.PI) / 7;

    const { r, g, b } = resolveSpriteStroke(
      'clockwise',
      i,
      t,
      pf,
      hf,
      'rgb(72, 96, 168)',
      0,
      gf,
    );
    const stroke = `rgb(${r}, ${g}, ${b})`;
    const alpha = Math.min(1, lerp(0.36, 0.48, pf) + hf * 0.28);

    ctx.strokeStyle = stroke;
    ctx.fillStyle = stroke;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = (i % 4 === 0 ? 2.5 : 1.2) * lerp(1, 2.2, pf);

    if (i % 4 === 0) ctx.setLineDash([5, 5]);
    else if (i % 3 === 0) ctx.setLineDash([2, 10]);
    else ctx.setLineDash([]);
    ctx.lineDashOffset = -t * 15 * (1 + pf * 2);

    const startAngle = rotationOffset;
    const arcCompletion = lerp(0.5 + Math.sin(i * 1.5) * 0.2, 2, pf);
    const arcLength = Math.PI * arcCompletion;

    ctx.beginPath();
    ctx.arc(lcx, lcy, rad, startAngle, startAngle + arcLength);
    if (pf > 0.1) {
      for (let s = 0; s < 2; s++) {
        const trailOffset = Math.sin(t * 3 + i + s) * 15 * pf;
        const trailRadius = Math.max(0.1, rad + trailOffset);
        const trailStart = startAngle + (s * Math.PI) / 3 * pf;
        ctx.moveTo(
          lcx + Math.cos(trailStart) * trailRadius,
          lcy + Math.sin(trailStart) * trailRadius,
        );
        ctx.arc(lcx, lcy, trailRadius, trailStart, trailStart + arcLength * 0.4);
      }
    }
    ctx.stroke();

    if (pf > 0.1 && i % 3 === 0) {
      ctx.globalAlpha = alpha * 0.3;
      ctx.setLineDash([2, 5]);
      ctx.beginPath();
      ctx.moveTo(lcx, lcy);
      ctx.lineTo(lcx + Math.cos(startAngle) * rad, lcy + Math.sin(startAngle) * rad);
      ctx.stroke();
    }

    if (pf > 0.5 && i % 2 === 0) {
      ctx.globalAlpha = alpha * 0.15;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(lcx, lcy, rad, startAngle, startAngle + arcLength);
      ctx.fill();
    }

    const sides = i % 3 === 0 ? 5 : i % 5 === 0 ? 4 : i % 7 === 0 ? 6 : 8;
    const orbitRadius = pf * 6;
    ctx.setLineDash([]);
    for (let s = 0; s < sides; s++) {
      const ang = (s / sides) * Math.PI * 2 + rotationOffset;
      const shimmer = Math.sin(t * 12 * lerp(1, 3, pf) + s) * (pf * 8);
      const vx = lcx + Math.cos(ang) * (rad + shimmer);
      const vy = lcy + Math.sin(ang) * (rad + shimmer);
      const orbitAngle = t * 8 + s;
      const px = vx + Math.cos(orbitAngle) * orbitRadius;
      const py = vy + Math.sin(orbitAngle) * orbitRadius;

      ctx.globalAlpha = lerp(0.22, 0.55, pf);
      ctx.beginPath();
      if (i % 2 === 0) {
        const sz = lerp(3.2, 5, pf);
        ctx.rect(px - sz / 2, py - sz / 2, sz, sz);
      } else {
        ctx.arc(px, py, lerp(1.4, 3.2, pf), 0, Math.PI * 2);
      }
      ctx.fillStyle = stroke;
      ctx.fill();

      if (pf > 0.6) {
        ctx.beginPath();
        ctx.arc(px, py, 1, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.globalAlpha = pf;
        ctx.fill();
      }
    }
  }

  ctx.restore();
}

const MEMPHIS_REST = [
  [214, 92, 72],
  [216, 168, 64],
  [36, 132, 136],
  [128, 82, 158],
  [210, 86, 118],
] as const;

/**
 * Memphis — OG 12-ring graphic (sprite 3 spec), Paloma-scaled.
 * Rest already carries color and closed polygons. Hold adds opposite-spin chaos and squiggles.
 */
export function drawMemphisField(
  ctx: CanvasRenderingContext2D,
  opts: {
    cx: number;
    cy: number;
    t: number;
    pf: number;
    hf: number;
    gf: number;
    currentSize: number;
    fieldScale: number;
    rotationAccumulator: number;
  },
): void {
  const { cx, cy, t, pf, hf, gf, currentSize, fieldScale, rotationAccumulator } = opts;
  const energy = Math.min(1, gf * 0.78 + pf * 0.45);
  const scale = spriteBodyScale(currentSize, fieldScale, energy);
  const outer = 82 * scale;
  const inner = outer * (18 / 106);
  const chaos = energy * 15 + pf * 4;
  const numLayers = 12;

  ctx.save();
  ctx.shadowBlur = 0;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  for (let i = 0; i < numLayers; i++) {
    const baseRadius = lerp(inner, outer, i / (numLayers - 1));
    const oscillation = Math.sin(t + i * 0.8) * lerp(6, 22, energy);
    const rad = Math.max(0.1, baseRadius + oscillation);
    const sign = i % 2 === 0 ? 1 : -1;
    const rotation =
      rotationAccumulator * (0.28 + i * 0.035) * sign +
      Math.sin(t * 0.5 + i) * energy * 0.2;

    const [mr, mg, mb] = MEMPHIS_REST[i % MEMPHIS_REST.length]!;
    const chroma = lerp(0.88, 1, energy) + hf * 0.06;
    const r = Math.round(lerp(20, mr, chroma));
    const g = Math.round(lerp(20, mg, chroma));
    const b = Math.round(lerp(20, mb, chroma));
    const alpha = Math.min(1, lerp(0.78, 0.94, energy) + hf * 0.08);

    ctx.save();
    ctx.translate(cx + Math.sin(t * 1.5 + i) * chaos, cy + Math.cos(t * 1.2 + i) * chaos);
    ctx.rotate(rotation);

    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * lerp(0.16, 0.3, energy)})`;
    const baseWidth = i % 4 === 0 ? 2.7 : 1.55;
    ctx.lineWidth = lerp(baseWidth, baseWidth * 2, energy);
    if (i % 4 === 0) ctx.setLineDash([5, 5]);
    else if (i % 3 === 0) ctx.setLineDash([2, 10]);
    else ctx.setLineDash([]);

    let numPoints = 8;
    if (i % 3 === 0) numPoints = 5;
    else if (i % 5 === 0) numPoints = 4;
    else if (i % 7 === 0) numPoints = 6;

    const points: Array<{ x: number; y: number }> = [];
    for (let j = 0; j < numPoints; j++) {
      const angle = (j / numPoints) * Math.PI * 2;
      const pJitter = Math.sin(t * 2 + j + i) * chaos * 0.3;
      points.push({
        x: Math.cos(angle) * (rad + pJitter),
        y: Math.sin(angle) * (rad + pJitter),
      });
    }

    const first = points[0]!;
    ctx.beginPath();
    ctx.moveTo(first.x, first.y);
    for (let j = 1; j < numPoints; j++) {
      const prev = points[j - 1]!;
      const curr = points[j]!;
      if (energy > 0.3 && i % 2 === 0) {
        const midX = (prev.x + curr.x) / 2;
        const midY = (prev.y + curr.y) / 2;
        const dx = curr.x - prev.x;
        const dy = curr.y - prev.y;
        const seg = Math.hypot(dx, dy) || 1;
        const pulse = Math.sin(t * 2.2 + j * 0.7 + i) * lerp(1, 10, energy);
        ctx.quadraticCurveTo(midX + (-dy / seg) * pulse, midY + (dx / seg) * pulse, curr.x, curr.y);
      } else {
        ctx.lineTo(curr.x, curr.y);
      }
    }
    ctx.closePath();
    ctx.stroke();
    if (i % 2 === 0) ctx.fill();

    ctx.setLineDash([]);
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    for (let j = 0; j < numPoints; j++) {
      if (i % 2 !== 0 && j % 2 !== 0) continue;
      const p = points[j]!;
      ctx.beginPath();
      if (i % 2 === 0) {
        const sz = lerp(2.4, 3.6, energy);
        ctx.fillRect(p.x - sz / 2, p.y - sz / 2, sz, sz);
      } else {
        ctx.arc(p.x, p.y, lerp(1.45, 2.4, energy), 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  ctx.restore();
}

/** Small company around the About skins — not Euphoria’s full ecosystem. */
export function drawSpriteCompanions(
  ctx: CanvasRenderingContext2D,
  opts: {
    spriteId: MandalaSpriteId;
    cx: number;
    cy: number;
    t: number;
    pf: number;
    hf: number;
    gf: number;
    fieldScale: number;
  },
): void {
  const { spriteId, cx, cy, t, pf, hf, gf, fieldScale } = opts;
  if (spriteId === 'euphoria' || spriteId === 'clockwise') return;

  const energy = Math.min(1, gf * 0.7 + pf * 0.5 + hf * 0.35);
  const count = spriteId === 'paloma' ? 7 : 11;
  const body = spriteBodyScale(62, fieldScale, energy);
  const reach = (82 + 36 + energy * 48) * body;

  ctx.save();
  for (let i = 0; i < count; i++) {
    const a = t * (0.14 + i * 0.02) + i * 1.7;
    const orbit = reach * (0.42 + (i % 5) * 0.11);
    const x = cx + Math.cos(a) * orbit;
    const y = cy + Math.sin(a) * orbit * (spriteId === 'paloma' ? 0.62 : 1);
    const pulse = 1 + Math.sin(t * 0.9 + i) * 0.1;

    if (spriteId === 'paloma') {
      const shade = palomaShade((i % 5) / 4, t * 0.4 + i, energy, hf);
      ctx.strokeStyle = `rgba(${shade.r}, ${shade.g}, ${shade.b}, ${lerp(0.4, 0.68, energy)})`;
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.ellipse(x, y, 2.1 * pulse, 1.05 * pulse, a, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      const pool = [
        [204, 98, 78],
        [210, 164, 72],
        [38, 122, 128],
        [118, 82, 148],
      ] as const;
      const [r, g, b] = pool[i % pool.length]!;
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${lerp(0.64, 0.86, energy)})`;
      if (i % 2 === 0) {
        const s = 2.6 * pulse;
        ctx.fillRect(x - s / 2, y - s / 2, s, s);
      } else {
        ctx.beginPath();
        ctx.arc(x, y, 1.55 * pulse, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  ctx.restore();
}
