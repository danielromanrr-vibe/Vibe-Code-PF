/**
 * **Nav “home” mandala** — alive logo mark: same *family* as full Euphoria (concentric oscillating core,
 * biological pulse, layer vocabulary, orbit nodes). Phases use a **motion time** so movement reads at ~36px
 * after `navScale`; amplitudes stay tied to `outerR` / `invNavScale` for resonance with the full mandala.
 */

import {
  MANDALA_TINY_STATE_INK_BIAS,
  MANDALA_TINY_STATE_STROKE_WIDTH_MULT,
  MANDALA_TINY_STATE_VISUAL_BOOST,
} from './placement';

const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;
const smoothstep = (t: number) => t * t * (3 - 2 * t);
const dist = (ax: number, ay: number, bx: number, by: number) => {
  const dx = ax - bx;
  const dy = ay - by;
  return Math.sqrt(dx * dx + dy * dy);
};

function subtlePullTowardMouse(
  x: number,
  y: number,
  mx: number,
  my: number,
  reach: number,
  maxShift: number,
) {
  const d = dist(mx, my, x, y);
  if (d < 1e-6) return { dx: 0, dy: 0 };
  const influence = Math.max(0, 1 - d / reach) ** 1.45;
  const pull = maxShift * influence;
  return { dx: ((mx - x) / d) * pull, dy: ((my - y) / d) * pull };
}

/**
 * Full-mandala “biological” product **plus** a stronger carrier sine — the pure product is often ≈0,
 * which made the chip feel static. Blend keeps Euphoria character while staying visible after scale.
 */
function biologicalPulseRing(motionT: number, ringIndex: number, outerR: number): number {
  const beat =
    Math.sin(motionT * 0.52 + ringIndex * 0.2) * Math.sin(motionT * 0.24 + ringIndex * 0.48);
  const carrier = Math.sin(motionT * 0.41 + ringIndex * 0.33);
  const mixed = beat * 0.42 + carrier * 0.58;
  return mixed * outerR * 0.048 * MANDALA_TINY_STATE_VISUAL_BOOST;
}

/**
 * Hero uses `pow(sin,6)` — mostly flat. For the logo we **blend** a sharp spike with a sustained swell
 * so the core reads alive every cycle, not only at rare peaks.
 */
function heartbeatCore(motionT: number, outerR: number): number {
  const spike = Math.pow(Math.sin(motionT * 0.88), 5);
  const swell = 0.5 + 0.5 * Math.sin(motionT * 1.08);
  return outerR * (spike * 0.062 + swell * 0.024);
}

function layerKind(ringIndex: number): number {
  return ringIndex % 6;
}

const MARK_DIAMETER_FRAC = 0.86;

const NAV_HOME_RINGS = 9;
const ORBIT_NODES = 4;
const CORE_MOUSE_REACH = 420;
const CORE_MOUSE_PULL = 5.5;

/**
 * Phase multiplier on engine `t`. Nav tiny state already advances `frameCount` at `~BRANDING_TIME_SCALE`;
 * do **not** multiply by `BRANDING_TIME_SCALE` again here (that made motion ~0.25× speed and feel frozen).
 */
const LOGO_MOTION_PHASE_SCALE = 2.65;

export type NavBrandingHomeDrawArgs = {
  cx: number;
  cy: number;
  t: number;
  mouseX: number;
  mouseY: number;
  rotationAccumulator: number;
  activePalette: string[];
  pf: number;
  hf: number;
  d: number;
  containerW: number;
  containerH: number;
  navScale: number;
  /** 0–1 decaying pulse when the field settles onto the nav anchor (magnetic home). */
  landingPulse?: number;
};

export function drawNavBrandingHomeMandala(
  ctx: CanvasRenderingContext2D,
  a: NavBrandingHomeDrawArgs,
): void {
  const {
    cx,
    cy,
    t,
    mouseX,
    mouseY,
    rotationAccumulator,
    activePalette,
    pf,
    hf,
    d,
    containerW,
    containerH,
    navScale,
    landingPulse = 0,
  } = a;

  const motionT = t * LOGO_MOTION_PHASE_SCALE;
  const land = Math.max(0, Math.min(1, landingPulse));

  const minSide = Math.max(8, Math.min(containerW, containerH));

  /** Envelope: larger % swing so expansion/contraction is felt (still < clip). */
  const breathSlow = 1 + 0.095 * Math.sin(motionT * 0.14);
  const breathMid = 1 + 0.055 * Math.sin(motionT * 0.22 + 1.05);
  const breath = breathSlow * breathMid * (1 + land * 0.07);

  const outerR = ((minSide * 0.5 * MARK_DIAMETER_FRAC) / Math.max(0.08, navScale)) * breath;
  const innerR = outerR * 0.12;
  const charcoal = { r: 20, g: 20, b: 20 };
  const invNavScale = 1 / Math.max(0.08, navScale);

  const hb = heartbeatCore(motionT, outerR);
  const paletteShift = Math.sin(motionT * 0.22) * 0.5 + 0.5;

  ctx.save();
  const veilR = Math.min(outerR * 0.5, innerR * 4.2 + hb * 2.8);
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, veilR);
  const veilAlpha = 0.085 + 0.12 * (0.5 + 0.5 * Math.sin(motionT * 1.05)) + 0.06 * Math.sin(motionT * 1.65) ** 2;
  g.addColorStop(0, `rgba(24, 28, 38, ${Math.min(0.28, veilAlpha)})`);
  g.addColorStop(0.55, 'rgba(22, 24, 30, 0.045)');
  g.addColorStop(1, 'rgba(20, 22, 28, 0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(cx, cy, veilR, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const seedR = (innerR * 0.88 + hb * 0.42) * (1 + 0.14 * hf);
  const seedRgb = activePalette[0].match(/\d+/g);
  const seedAccent = seedRgb ? seedRgb.map(Number) : [80, 100, 200];
  const seedMix = 0.58 + 0.16 * Math.sin(motionT * 0.95) + pf * 0.08;
  ctx.save();
  ctx.fillStyle = `rgb(${Math.round(lerp(charcoal.r, seedAccent[0], seedMix))},${Math.round(
    lerp(charcoal.g, seedAccent[1], seedMix),
  )},${Math.round(lerp(charcoal.b, seedAccent[2], seedMix))})`;
  ctx.globalAlpha = 0.42 + 0.28 * (0.5 + 0.5 * Math.sin(motionT * 1.12)) + hf * 0.14;
  ctx.beginPath();
  ctx.arc(cx, cy, Math.max(0.45, seedR), 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.restore();

  for (let i = 0; i < NAV_HOME_RINGS; i++) {
    const u = NAV_HOME_RINGS <= 1 ? 1 : i / (NAV_HOME_RINGS - 1);
    const uEase = smoothstep(u);
    const baseR = lerp(innerR, outerR, uEase);

    const drift =
      Math.sin(motionT * 0.18 + i * 0.52) * 0.32 + Math.cos(motionT * 0.14 + i * 0.46) * 0.26;
    const lcxBase = cx + drift * (0.2 + pf * 0.38);
    const lcyBase = cy + drift * (0.17 + pf * 0.35);

    const pull = subtlePullTowardMouse(
      lcxBase,
      lcyBase,
      mouseX,
      mouseY,
      CORE_MOUSE_REACH,
      CORE_MOUSE_PULL * (1 - i / NAV_HOME_RINGS) * (0.4 + pf * 0.45),
    );
    const lcx = lcxBase + pull.dx;
    const lcy = lcyBase + pull.dy;

    const bio = biologicalPulseRing(motionT, i, outerR);
    const breathe = Math.sin(motionT * 0.16 + i * 0.38) * outerR * 0.022 * (1 + pf * 0.35);
    const radius = Math.max(
      0.55,
      baseR + bio + breathe + d * outerR * 0.008 * pf + land * outerR * 0.04 * (1 - u * 0.35),
    );

    const rot =
      rotationAccumulator * (0.014 + i * 0.0035) +
      i * (Math.PI / 7.2) +
      Math.sin(motionT * 0.085 + i * 0.24) * 0.065;
    const stretchX = 1 + Math.sin(motionT * 0.11 + i * 0.75) * 0.048 * (0.45 + pf);
    const stretchY = 1 + Math.cos(motionT * 0.105 + i * 0.72) * 0.048 * (0.45 + pf);

    const pal = activePalette[(i + Math.floor(paletteShift * 2.2)) % activePalette.length];
    const rgbMatch = pal.match(/\d+/g);
    const accentRGB = rgbMatch ? rgbMatch.map(Number) : [80, 100, 200];
    const colorWave = 0.04 * Math.sin(motionT * 0.65 + i * 0.4);
    const colorFactor = Math.min(
      1,
      0.5 + pf * 0.62 + hf * 0.22 + MANDALA_TINY_STATE_INK_BIAS + paletteShift * 0.08 + colorWave,
    );
    const r = Math.round(lerp(charcoal.r, accentRGB[0], colorFactor));
    const gCh = Math.round(lerp(charcoal.g, accentRGB[1], colorFactor));
    const b = Math.round(lerp(charcoal.b, accentRGB[2], colorFactor));
    const strokeColor = `rgb(${r}, ${gCh}, ${b})`;

    const strokeOsc = Math.sin(motionT * 0.62 + i * 0.95) * 0.5 + 0.5;
    const baseLw =
      (i === 0 || i === NAV_HOME_RINGS - 1 ? 1.35 : i % 5 === 0 ? 1.08 : 0.74) *
      (0.9 + pf * 0.24) *
      MANDALA_TINY_STATE_STROKE_WIDTH_MULT *
      invNavScale *
      (0.72 + strokeOsc * 0.48);

    ctx.strokeStyle = strokeColor;
    const alphaBreath = 0.92 + 0.08 * Math.sin(motionT * 0.88 + i * 0.55);
    const ringAlpha = lerp(0.52, 0.94, uEase) * (0.93 + pf * 0.07) * alphaBreath + hf * 0.07;
    ctx.globalAlpha = Math.min(0.97, ringAlpha);
    ctx.lineWidth = baseLw;
    ctx.shadowBlur = 0;

    const kind = layerKind(i);

    ctx.setLineDash([]);
    if (kind === 4 && i === 4) {
      ctx.globalAlpha = Math.min(0.97, ringAlpha) * 0.44;
      ctx.beginPath();
      ctx.ellipse(lcx, lcy, radius * stretchX, radius * stretchY, rot, 0, Math.PI * 2);
      ctx.stroke();
      const numTicks = 6;
      ctx.globalAlpha = Math.min(0.97, ringAlpha) * 0.9;
      for (let s = 0; s < numTicks; s++) {
        const angle = (s / numTicks) * Math.PI * 2 + rot * 0.45;
        const x1 = lcx + Math.cos(angle) * radius * stretchX * 0.93;
        const y1 = lcy + Math.sin(angle) * radius * stretchY * 0.93;
        const x2 = lcx + Math.cos(angle) * radius * stretchX * 1.04;
        const y2 = lcy + Math.sin(angle) * radius * stretchY * 1.04;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      ctx.globalAlpha = Math.min(0.97, ringAlpha);
    } else {
      ctx.beginPath();
      ctx.ellipse(lcx, lcy, radius * stretchX, radius * stretchY, rot, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (kind === 0 && i >= 2) {
      const arcStart = rot + motionT * 0.065;
      const arcLen = Math.PI * (0.42 + 0.12 * Math.sin(motionT * 0.24 + i));
      ctx.globalAlpha = Math.min(0.97, ringAlpha) * 0.74;
      ctx.lineWidth = baseLw * 0.88;
      ctx.beginPath();
      ctx.arc(lcx, lcy, radius * stretchX, arcStart, arcStart + arcLen);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(lcx, lcy, radius * stretchX * 0.9, arcStart + Math.PI, arcStart + Math.PI + arcLen * 0.85);
      ctx.stroke();
      ctx.globalAlpha = Math.min(0.97, ringAlpha);
      ctx.lineWidth = baseLw;
    }

    if (i === Math.floor(NAV_HOME_RINGS / 2)) {
      ctx.globalAlpha *= 0.78;
      ctx.lineWidth = baseLw * 0.78;
      const arcStart = rot + motionT * 0.058;
      const arcLen = Math.PI * (0.36 + 0.09 * Math.sin(motionT * 0.1 + i));
      ctx.beginPath();
      ctx.arc(lcx, lcy, radius * 0.96 * Math.min(stretchX, stretchY), arcStart, arcStart + arcLen);
      ctx.stroke();
      ctx.globalAlpha = Math.min(0.97, ringAlpha);
    }
  }

  /** Orbit: faster phase + visible radial “tide” so travel reads (Euphoria peripheral vocabulary). */
  const orbitBreath = 1 + 0.09 * Math.sin(motionT * 0.2);
  const orbitWobble = Math.sin(motionT * 0.31) * outerR * 0.028;
  const orbitR = lerp(innerR * 1.15, outerR * 0.92, 0.64) * orbitBreath + orbitWobble;
  const orbitPhase =
    motionT * 0.118 +
    rotationAccumulator * 0.012 +
    Math.sin(motionT * 0.07) * 0.12;
  const nodeRadius = 2.15 * invNavScale;
  const nodeStrokeW = 0.52 * invNavScale;

  for (let k = 0; k < ORBIT_NODES; k++) {
    const ang = orbitPhase + (k / ORBIT_NODES) * Math.PI * 2;
    const nx = cx + Math.cos(ang) * orbitR;
    const ny = cy + Math.sin(ang) * orbitR;
    const rgbMatch = activePalette[(k + 2) % activePalette.length].match(/\d+/g);
    const accentRGB = rgbMatch ? rgbMatch.map(Number) : [80, 100, 200];
    const rr = Math.round(lerp(charcoal.r, accentRGB[0], 0.72));
    const gg = Math.round(lerp(charcoal.g, accentRGB[1], 0.72));
    const bb = Math.round(lerp(charcoal.b, accentRGB[2], 0.72));
    const nodePulse = 0.68 + 0.32 * Math.sin(motionT * 1.35 + k * 1.4) ** 2;
    ctx.fillStyle = `rgb(${rr}, ${gg}, ${bb})`;
    ctx.globalAlpha = (0.84 + pf * 0.1) * nodePulse;
    ctx.beginPath();
    ctx.arc(nx, ny, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = `rgba(${rr}, ${gg}, ${bb}, 0.48)`;
    ctx.lineWidth = nodeStrokeW;
    ctx.globalAlpha = 0.62 * nodePulse;
    ctx.stroke();
  }

  /** Rim: crawling dashes — high lineDashOffset speed so motion is unmissable. */
  const affordPulse = 0.5 + 0.5 * Math.sin(motionT * 0.22);
  ctx.save();
  ctx.setLineDash([3.2 * invNavScale, 2.1 * invNavScale]);
  ctx.lineDashOffset = -motionT * 8.5 * invNavScale;
  ctx.strokeStyle = `rgba(36, 42, 58, ${0.4 + 0.34 * affordPulse})`;
  ctx.lineWidth = 1.42 * invNavScale;
  ctx.globalAlpha = 0.55 + 0.32 * affordPulse;
  ctx.beginPath();
  ctx.arc(cx, cy, outerR * 1.015 * breathMid, 0, Math.PI * 2);
  ctx.stroke();

  ctx.globalAlpha = 0.28 + 0.22 * affordPulse;
  ctx.lineWidth = 0.68 * invNavScale;
  ctx.setLineDash([7 * invNavScale, 9 * invNavScale]);
  ctx.lineDashOffset = motionT * 5.2 * invNavScale;
  ctx.strokeStyle = `rgba(80, 100, 200, ${0.32 + 0.28 * affordPulse})`;
  ctx.beginPath();
  ctx.arc(cx, cy, outerR * 0.78, 0, Math.PI * 2);
  ctx.stroke();

  ctx.setLineDash([]);
  ctx.globalAlpha = 1;
  ctx.restore();
}
