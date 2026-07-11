type Rgb = readonly [number, number, number];

type MandalaInfluenceGlyphProps = {
  kind: 0 | 1 | 2;
  nodeIndex: number;
  rgb: Rgb;
  size: number;
  presence?: 'rest' | 'preview' | 'related' | 'active' | 'visited';
};

const FALLBACK_RGB: Rgb = [80, 100, 200];

function rgba(rgb: Rgb, alpha: number): string {
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
}

/** Deterministic sub-variant — mirrors Mandala canvas nv selection. */
export function mandalaGlyphVariant(kind: 0 | 1 | 2, nodeIndex: number): number {
  const spread = 16 + (nodeIndex * 7) % 24;
  const phase = (nodeIndex / 17) * Math.PI * 2;
  const wobble = 0.6 + (nodeIndex % 5) * 0.15;
  if (kind === 0) {
    return ((nodeIndex * 7907 + (spread * 13) | 0) + (Math.floor(phase * 100) % 97)) % 6;
  }
  if (kind === 1) {
    return ((nodeIndex * 5303 + Math.floor(spread) * 5) % 6 + 6) % 6;
  }
  return ((nodeIndex * 3407 + Math.floor(wobble * 100)) % 6 + 6) % 6;
}

function hexPoints(r: number): string {
  return Array.from({ length: 6 }, (_, s) => {
    const a = (s / 6) * Math.PI * 2 - Math.PI / 2;
    return `${Math.cos(a) * r},${Math.sin(a) * r}`;
  }).join(' ');
}

function OrbGlyph({
  rgb,
  nodeR,
  strokeA,
  fillA,
  nv,
}: {
  rgb: Rgb;
  nodeR: number;
  strokeA: number;
  fillA: number;
  nv: number;
}) {
  const outerR = nodeR * 1.45;
  const stroke = rgba(rgb, strokeA);
  const fill = rgba(rgb, fillA);

  if (nv === 1) {
    return (
      <>
        <polygon points={hexPoints(nodeR * 0.48)} fill={fill} opacity={0.55} />
        <circle r={nodeR} fill="none" stroke={stroke} strokeWidth={0.95} />
        <circle
          r={outerR}
          fill="none"
          stroke={stroke}
          strokeWidth={0.85}
          strokeDasharray="2 4"
          strokeDashoffset={0}
          pathLength={100}
          strokeOpacity={0.7}
        />
        <circle cx={outerR} cy={0} r={1.1} fill={stroke} />
      </>
    );
  }

  if (nv === 2) {
    return (
      <>
        <circle r={nodeR * 0.5} fill={fill} />
        <circle r={nodeR} fill="none" stroke={stroke} strokeWidth={0.95} />
        <circle
          r={outerR}
          fill="none"
          stroke={stroke}
          strokeWidth={0.85}
          strokeDasharray="2 4"
          opacity={0.75}
        />
        <circle cx={Math.cos(-0.9) * outerR} cy={Math.sin(-0.9) * outerR} r={1.1} fill={stroke} />
      </>
    );
  }

  return (
    <>
      <circle r={nodeR * 0.52} fill={fill} />
      <circle r={nodeR} fill="none" stroke={stroke} strokeWidth={0.95} />
      <circle
        r={outerR}
        fill="none"
        stroke={stroke}
        strokeWidth={0.85}
        strokeDasharray="2 4"
        opacity={0.72}
      />
      <circle cx={outerR * 0.62} cy={outerR * 0.35} r={1.1} fill={stroke} />
    </>
  );
}

function HexGlyph({
  rgb,
  nodeR,
  strokeA,
  nv,
}: {
  rgb: Rgb;
  nodeR: number;
  strokeA: number;
  nv: number;
}) {
  const stroke = rgba(rgb, strokeA);

  if (nv >= 3) {
    return (
      <>
        <polygon
          points={hexPoints(nodeR * 1.2)}
          fill="none"
          stroke={stroke}
          strokeWidth={0.8}
          opacity={0.55}
        />
        <line x1={-nodeR} y1={-nodeR} x2={nodeR} y2={nodeR} stroke={stroke} strokeWidth={0.75} opacity={0.45} />
        <line x1={-nodeR} y1={nodeR} x2={nodeR} y2={-nodeR} stroke={stroke} strokeWidth={0.75} opacity={0.45} />
      </>
    );
  }

  return (
    <>
      <polygon
        points={hexPoints(nodeR * 1.2)}
        fill="none"
        stroke={stroke}
        strokeWidth={0.9}
        opacity={0.58}
      />
      <polygon
        points={hexPoints(nodeR * 0.78)}
        fill="none"
        stroke={stroke}
        strokeWidth={0.8}
        strokeDasharray="2 4"
        opacity={0.48}
      />
    </>
  );
}

function RayGlyph({
  rgb,
  nodeR,
  strokeA,
  nv,
}: {
  rgb: Rgb;
  nodeR: number;
  strokeA: number;
  nv: number;
}) {
  const stroke = rgba(rgb, strokeA);
  const rayCount = nv === 1 ? 6 : 8;

  if (nv >= 3) {
    return (
      <>
        {[-2, -1, 0, 1, 2].map((ln) => (
          <line
            key={ln}
            x1={-nodeR * 1.05}
            y1={ln * nodeR * 0.22}
            x2={nodeR * 1.05}
            y2={ln * nodeR * 0.22}
            stroke={stroke}
            strokeWidth={0.72}
            opacity={0.42}
          />
        ))}
        <path
          d={`M ${-nodeR * 0.65} ${-nodeR * 0.25} A ${nodeR * 0.65} ${nodeR * 0.65} 0 0 1 ${nodeR * 0.65} ${-nodeR * 0.25}`}
          fill="none"
          stroke={stroke}
          strokeWidth={0.78}
          opacity={0.55}
        />
      </>
    );
  }

  return (
    <>
      {[0, 1, 2].map((li) => {
        const rr = nodeR * (0.7 + li * 0.38);
        const aspect = nv === 2 ? 0.62 + li * 0.09 : 0.85 + li * 0.07;
        return (
          <ellipse
            key={li}
            rx={rr}
            ry={rr * aspect}
            fill="none"
            stroke={stroke}
            strokeWidth={0.85}
            opacity={0.55 - li * 0.12}
            transform={`rotate(${li * 18})`}
          />
        );
      })}
      {Array.from({ length: rayCount }, (_, rj) => {
        const a = (rj / rayCount) * Math.PI * 2;
        const x1 = Math.cos(a) * nodeR * 0.3;
        const y1 = Math.sin(a) * nodeR * 0.3;
        const x2 = Math.cos(a) * nodeR * 1.1;
        const y2 = Math.sin(a) * nodeR * 1.1;
        return (
          <line
            key={rj}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={stroke}
            strokeWidth={0.72}
            opacity={0.42}
          />
        );
      })}
    </>
  );
}

export default function MandalaInfluenceGlyph({
  kind,
  nodeIndex,
  rgb = FALLBACK_RGB,
  size,
  presence = 'rest',
}: MandalaInfluenceGlyphProps) {
  const nodeR = 5.8;
  const emphasized = presence !== 'rest';
  const strokeA = presence === 'active' ? 0.72 : presence === 'related' ? 0.64 : emphasized ? 0.6 : 0.56;
  const fillA = presence === 'active' ? 0.28 : emphasized ? 0.22 : 0.2;
  const nv = mandalaGlyphVariant(kind, nodeIndex);
  const inkRing =
    presence === 'active'
      ? 'rgba(12, 21, 40, 0.34)'
      : emphasized
        ? 'rgba(12, 21, 40, 0.24)'
        : 'rgba(12, 21, 40, 0.18)';
  const satellites = [
    { a: 0.4, d: 9.5 },
    { a: 2.1, d: 10.2 },
    { a: 3.8, d: 9.8 },
    { a: 5.5, d: 10.5 },
  ];

  return (
    <svg
      className={['mandala-influence-glyph', `mandala-influence-glyph--${presence}`].join(' ')}
      width={size}
      height={size}
      viewBox="-14 -14 28 28"
      aria-hidden
    >
      <line x1={-11} y1={0} x2={11} y2={0} stroke="rgba(12, 21, 40, 0.08)" strokeWidth={0.45} />
      <line x1={0} y1={-11} x2={0} y2={11} stroke="rgba(12, 21, 40, 0.08)" strokeWidth={0.45} />
      <circle r={nodeR * 1.65} fill="none" stroke={inkRing} strokeWidth={0.65} strokeDasharray="3 5" />
      <circle r={nodeR * 2.15} fill="none" stroke={inkRing} strokeWidth={0.45} strokeDasharray="1 8" opacity={0.55} />
      {satellites.map((sat, i) => (
        <circle
          key={i}
          cx={Math.cos(sat.a + nodeIndex * 0.07) * sat.d}
          cy={Math.sin(sat.a + nodeIndex * 0.07) * sat.d}
          r={0.75}
          fill={rgba(rgb, 0.35 + (emphasized ? 0.15 : 0))}
        />
      ))}
      <g transform={`scale(${size / 28})`}>
        {kind === 0 ? (
          <OrbGlyph rgb={rgb} nodeR={nodeR} strokeA={strokeA} fillA={fillA} nv={nv} />
        ) : kind === 1 ? (
          <HexGlyph rgb={rgb} nodeR={nodeR} strokeA={strokeA} nv={nv} />
        ) : (
          <RayGlyph rgb={rgb} nodeR={nodeR} strokeA={strokeA} nv={nv} />
        )}
      </g>
    </svg>
  );
}

export function mandalaAccentRgb(layoutRgb?: Rgb): Rgb {
  return layoutRgb ?? FALLBACK_RGB;
}
