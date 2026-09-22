const INK = [
  'rgba(78, 122, 236, 0.55)',
  'rgba(224, 72, 86, 0.42)',
  'rgba(28, 176, 148, 0.5)',
  'rgba(232, 148, 36, 0.48)',
  'rgba(126, 92, 236, 0.5)',
  'rgba(148, 168, 36, 0.42)',
  'rgba(206, 70, 158, 0.4)',
] as const;

type NodeKind = 'orb' | 'hex' | 'diamond' | 'triangle';

type WebNode = {
  id: string;
  x: number;
  y: number;
  kind: NodeKind;
  ink: number;
  role?: 'origin' | 'tel' | 'email' | 'social' | 'mid';
};

const NODES: WebNode[] = [
  { id: 'a', x: 150, y: 92, kind: 'orb', ink: 0, role: 'origin' },
  { id: 'b', x: 380, y: 178, kind: 'hex', ink: 2, role: 'tel' },
  { id: 'c', x: 600, y: 68, kind: 'diamond', ink: 3, role: 'email' },
  { id: 'd', x: 840, y: 186, kind: 'triangle', ink: 1, role: 'social' },
  { id: 'e', x: 1030, y: 98, kind: 'orb', ink: 4, role: 'mid' },
];

const EDGES: [string, string, number][] = [
  ['a', 'b', 0.1],
  ['b', 'c', -0.08],
  ['c', 'd', 0.1],
  ['c', 'e', -0.06],
  ['d', 'e', 0.08],
];

function nodeById(id: string) {
  return NODES.find((node) => node.id === id)!;
}

function hexPoints(cx: number, cy: number, r: number) {
  return Array.from({ length: 6 }, (_, s) => {
    const a = (s / 6) * Math.PI * 2 - Math.PI / 2;
    return `${(cx + Math.cos(a) * r).toFixed(2)},${(cy + Math.sin(a) * r).toFixed(2)}`;
  }).join(' ');
}

function diamondPoints(cx: number, cy: number, r: number) {
  return `${cx},${(cy - r).toFixed(1)} ${(cx + r).toFixed(1)},${cy} ${cx},${(cy + r).toFixed(1)} ${(cx - r).toFixed(1)},${cy}`;
}

function trianglePoints(cx: number, cy: number, r: number) {
  return Array.from({ length: 3 }, (_, s) => {
    const a = (s / 3) * Math.PI * 2 - Math.PI / 2;
    return `${(cx + Math.cos(a) * r).toFixed(2)},${(cy + Math.sin(a) * r).toFixed(2)}`;
  }).join(' ');
}

function chord(a: WebNode, b: WebNode, bulge: number) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  return `M${a.x} ${a.y} Q ${(mx + (-dy / len) * len * bulge).toFixed(1)} ${(my + (dx / len) * len * bulge).toFixed(1)} ${b.x} ${b.y}`;
}

function localTicks(cx: number, cy: number, r: number, count = 6) {
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2 - Math.PI / 2;
    return {
      key: `${cx}-${i}`,
      x1: cx + Math.cos(a) * r,
      y1: cy + Math.sin(a) * r,
      x2: cx + Math.cos(a) * (r + 2.4),
      y2: cy + Math.sin(a) * (r + 2.4),
    };
  });
}

/**
 * Sparse Kandinsky sky behind the contact type — few nodes, few chords.
 * Pointer celebration lives in FooterSkyTrail, not here.
 */
export default function FooterConstellation() {
  return (
    <svg
      className="site-footer-sky"
      viewBox="0 0 1160 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
    >
      <g className="site-footer-sky__paths">
        {EDGES.map(([from, to, bulge], i) => {
          const a = nodeById(from);
          const b = nodeById(to);
          return (
            <path
              key={`${from}-${to}`}
              className={`site-footer-sky__draw${i % 3 === 2 ? ' site-footer-sky__draw--late' : i % 2 ? ' site-footer-sky__draw--mid' : ''}`}
              pathLength={1}
              d={chord(a, b, bulge)}
              stroke={INK[(a.ink + b.ink) % INK.length]}
              strokeWidth="0.55"
              strokeLinecap="round"
            />
          );
        })}
      </g>

      {NODES.map((node) => {
        const ink = INK[node.ink]!;
        const ticks = node.kind === 'orb' && node.role ? localTicks(node.x, node.y, 7.2) : [];
        return (
          <g
            key={node.id}
            className={`site-footer-sky__node${node.role ? ` site-footer-sky__node--${node.role}` : ''}`}
          >
            <g className={`site-footer-sky__breath site-footer-sky__breath--${node.id}`}>
              {node.kind === 'hex' ? (
                <polygon points={hexPoints(node.x, node.y, 5.4)} fill={ink} fillOpacity="0.28" stroke={ink} strokeWidth="0.5" />
              ) : null}
              {node.kind === 'diamond' ? (
                <polygon points={diamondPoints(node.x, node.y, 4.6)} fill={ink} fillOpacity="0.22" stroke={ink} strokeWidth="0.5" />
              ) : null}
              {node.kind === 'triangle' ? (
                <polygon points={trianglePoints(node.x, node.y, 5.1)} fill={ink} fillOpacity="0.2" stroke={ink} strokeWidth="0.5" />
              ) : null}
              {node.kind === 'orb' ? (
                <>
                  <circle cx={node.x} cy={node.y} r="1.35" fill="currentColor" />
                  <circle cx={node.x} cy={node.y} r="4.6" stroke={ink} strokeWidth="0.5" />
                </>
              ) : (
                <circle cx={node.x} cy={node.y} r="1.05" fill="currentColor" />
              )}
              {ticks.map((tick) => (
                <line
                  key={tick.key}
                  x1={tick.x1}
                  y1={tick.y1}
                  x2={tick.x2}
                  y2={tick.y2}
                  stroke="currentColor"
                  strokeWidth="0.45"
                  strokeLinecap="round"
                  opacity="0.28"
                />
              ))}
            </g>
          </g>
        );
      })}
    </svg>
  );
}
