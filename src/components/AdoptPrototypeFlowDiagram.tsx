import { useId, useState } from 'react';

/**
 * Horizontal participation flow: Discover → Enroll → Activate → Scale.
 * Used in Quick Scan and (optionally) elsewhere; SVG defs are scoped with useId for safe reuse.
 */
export default function AdoptPrototypeFlowDiagram({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, '');
  const id = (name: string) => `adopt-proto-flow-${uid}-${name}`;
  const [shift, setShift] = useState({ x: 0, y: 0 });

  const flowProgress = id('flowProgress');
  const bannerPink = id('bannerPink');
  const bannerBlue = id('bannerBlue');
  const nodeGlow1 = id('nodeGlow1');
  const nodeGlow2 = id('nodeGlow2');
  const nodeGlow3 = id('nodeGlow3');
  const nodeGlow4 = id('nodeGlow4');
  const tendrilPath = id('prototypeFlowTendrilPath');

  return (
    <div
      className={className}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const rx = (e.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
        const ry = (e.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
        setShift({ x: rx * 10, y: ry * 6 });
      }}
      onMouseLeave={() => setShift({ x: 0, y: 0 })}
    >
      <svg
        viewBox="0 0 960 520"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Progressive flow diagram: Discover leads to Enroll, Activate, and Scale with increasing momentum."
        className="h-full w-full"
      >
        <defs>
          <linearGradient id={flowProgress} x1="10%" y1="0%" x2="90%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.24" />
            <stop offset="35%" stopColor="#7c3aed" stopOpacity="0.42" />
            <stop offset="70%" stopColor="#6d28d9" stopOpacity="0.58" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.34" />
          </linearGradient>
          <linearGradient id={bannerPink} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ec4899" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.03" />
          </linearGradient>
          <linearGradient id={bannerBlue} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.03" />
          </linearGradient>
          <linearGradient id={nodeGlow1} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.04" />
          </linearGradient>
          <linearGradient id={nodeGlow2} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id={nodeGlow3} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6d28d9" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#6d28d9" stopOpacity="0.12" />
          </linearGradient>
          <radialGradient id={nodeGlow4} cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g aria-hidden>
          <path d="M150 260 L370 260 L590 260 L810 260" fill="none" stroke={`url(#${bannerPink})`} strokeWidth="1" strokeDasharray="3 10" />
          <path d="M150 260 L590 210 L810 260" fill="none" stroke={`url(#${bannerBlue})`} strokeWidth="1" strokeDasharray="3 10" />
          <path d="M150 260 L370 310 L810 260" fill="none" stroke={`url(#${bannerPink})`} strokeWidth="1" strokeDasharray="3 10" />
          <circle cx="370" cy="260" r="22" fill="none" stroke="#ec4899" strokeOpacity="0.22" />
          <circle cx="590" cy="260" r="25" fill="none" stroke="#3b82f6" strokeOpacity="0.22" />
          <circle cx="810" cy="260" r="28" fill="none" stroke="#ec4899" strokeOpacity="0.2" />
        </g>

        <g aria-hidden style={{ transform: `translate(${shift.x}px, ${shift.y}px)` }}>
          <path d="M178 260 L340 260" fill="none" stroke="rgba(139, 92, 246, 0.12)" strokeWidth="1.05" strokeLinecap="round" />
          <path d="M178 260 L340 260" fill="none" stroke="#8b5cf6" strokeOpacity="0.48" strokeWidth="1.12" strokeLinecap="round" strokeDasharray="9 15" />

          <path d="M340 260 L560 260" fill="none" stroke="rgba(139, 92, 246, 0.12)" strokeWidth="1.05" strokeLinecap="round" />
          <path d="M340 260 L560 260" fill="none" stroke="#8b5cf6" strokeOpacity="0.48" strokeWidth="1.12" strokeLinecap="round" strokeDasharray="9 15" />

          <path d="M560 260 L782 260" fill="none" stroke="rgba(139, 92, 246, 0.12)" strokeWidth="1.05" strokeLinecap="round" />
          <path d="M560 260 L782 260" fill="none" stroke="#8b5cf6" strokeOpacity="0.48" strokeWidth="1.12" strokeLinecap="round" strokeDasharray="9 15" />

          <g>
            <circle r="11" fill="#c4b5fd" fillOpacity="0.2">
              <animateMotion dur="8.6s" repeatCount="indefinite" rotate="auto">
                <mpath href={`#${tendrilPath}`} />
              </animateMotion>
              <animate attributeName="opacity" values="0.08;0.72;0.1" dur="8.6s" repeatCount="indefinite" />
            </circle>
            <circle r="4.8" fill="#8b5cf6" fillOpacity="0.56">
              <animateMotion dur="8.6s" repeatCount="indefinite" rotate="auto">
                <mpath href={`#${tendrilPath}`} />
              </animateMotion>
              <animate attributeName="opacity" values="0.14;0.86;0.12" dur="8.6s" repeatCount="indefinite" />
            </circle>
          </g>
          <g>
            <circle r="10.5" fill="#c4b5fd" fillOpacity="0.18">
              <animateMotion dur="8.6s" begin="2.2s" repeatCount="indefinite" rotate="auto">
                <mpath href={`#${tendrilPath}`} />
              </animateMotion>
              <animate attributeName="opacity" values="0.07;0.66;0.09" dur="8.6s" begin="2.2s" repeatCount="indefinite" />
            </circle>
            <circle r="4.5" fill="#7c3aed" fillOpacity="0.52">
              <animateMotion dur="8.6s" begin="2.2s" repeatCount="indefinite" rotate="auto">
                <mpath href={`#${tendrilPath}`} />
              </animateMotion>
              <animate attributeName="opacity" values="0.13;0.82;0.11" dur="8.6s" begin="2.2s" repeatCount="indefinite" />
            </circle>
          </g>
          <g>
            <circle r="10" fill="#c4b5fd" fillOpacity="0.16">
              <animateMotion dur="8.6s" begin="4.4s" repeatCount="indefinite" rotate="auto">
                <mpath href={`#${tendrilPath}`} />
              </animateMotion>
              <animate attributeName="opacity" values="0.06;0.62;0.08" dur="8.6s" begin="4.4s" repeatCount="indefinite" />
            </circle>
            <circle r="4.2" fill="#6d28d9" fillOpacity="0.48">
              <animateMotion dur="8.6s" begin="4.4s" repeatCount="indefinite" rotate="auto">
                <mpath href={`#${tendrilPath}`} />
              </animateMotion>
              <animate attributeName="opacity" values="0.12;0.78;0.1" dur="8.6s" begin="4.4s" repeatCount="indefinite" />
            </circle>
          </g>
        </g>

        <path id={tendrilPath} d="M178 260 L782 260" fill="none" stroke="none" />

        <path
          d="M150 260 C230 260, 250 260, 320 260 C390 260, 410 260, 480 260 C550 260, 570 260, 640 260 C710 260, 730 260, 810 260"
          fill="none"
          stroke={`url(#${flowProgress})`}
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="2 18"
        />

        {[
          { x: 150, label: 'Discover', r: 28, glow: `url(#${nodeGlow1})`, inner: 11, pulse: '0.9;1;0.9' },
          { x: 370, label: 'Enroll', r: 30, glow: `url(#${nodeGlow2})`, inner: 12, pulse: '0.94;1.04;0.94' },
          { x: 590, label: 'Activate', r: 33, glow: `url(#${nodeGlow3})`, inner: 13, pulse: '0.98;1.08;0.98' },
          { x: 810, label: 'Scale', r: 36, glow: `url(#${nodeGlow4})`, inner: 11, pulse: '1;1.05;1' },
        ].map((node) => (
          <g key={node.label}>
            <circle cx={node.x} cy={260} r={node.r + 14} fill={node.glow} />
            <circle
              cx={node.x}
              cy={260}
              r={node.r}
              fill="#f8f9fa"
              stroke="#8b5cf6"
              strokeOpacity={node.label === 'Discover' ? 0.52 : node.label === 'Enroll' ? 0.62 : node.label === 'Activate' ? 0.76 : 0.46}
            >
              <animateTransform
                attributeName="transform"
                type="scale"
                values={node.pulse}
                dur="5.8s"
                repeatCount="indefinite"
                additive="sum"
              />
            </circle>
            <circle cx={node.x} cy={260} r={node.inner} fill="none" stroke="#141414" strokeOpacity="0.45" />
            <line
              x1={node.x - node.inner * 0.7}
              y1={260}
              x2={node.x + node.inner * 0.7}
              y2={260}
              stroke="#141414"
              strokeOpacity="0.45"
            />
            <line
              x1={node.x}
              y1={260 - node.inner * 0.7}
              x2={node.x}
              y2={260 + node.inner * 0.7}
              stroke="#141414"
              strokeOpacity="0.45"
            />
            <text
              x={node.x}
              y={334}
              textAnchor="middle"
              fill="#141414"
              fillOpacity="0.88"
              fontFamily="var(--font-body)"
              fontSize="24"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
