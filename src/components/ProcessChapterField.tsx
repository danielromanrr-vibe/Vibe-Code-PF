import type { ProcessOverviewChapterId } from './AdoptProcessOverview';

const CHAPTER_ACCENT: Record<ProcessOverviewChapterId, { stroke: string; glow: string; field: string }> = {
  research: {
    stroke: 'rgba(51, 96, 173, 0.28)',
    glow: 'rgba(51, 96, 173, 0.12)',
    field: 'rgba(51, 96, 173, 0.06)',
  },
  definition: {
    stroke: 'rgba(113, 76, 160, 0.28)',
    glow: 'rgba(139, 92, 246, 0.14)',
    field: 'rgba(113, 76, 160, 0.07)',
  },
  'rapid-prototyping': {
    stroke: 'rgba(220, 166, 0, 0.3)',
    glow: 'rgba(238, 199, 65, 0.14)',
    field: 'rgba(220, 166, 0, 0.06)',
  },
  validation: {
    stroke: 'rgba(0, 125, 86, 0.28)',
    glow: 'rgba(33, 170, 127, 0.12)',
    field: 'rgba(0, 125, 86, 0.06)',
  },
};

type ProcessChapterFieldProps = {
  chapterId: ProcessOverviewChapterId;
  className?: string;
};

/** Static orbit field — mandala / system-diagram vocabulary at low intensity. */
export default function ProcessChapterField({ chapterId, className = '' }: ProcessChapterFieldProps) {
  const accent = CHAPTER_ACCENT[chapterId];

  return (
    <div
      className={['process-chapter-field pointer-events-none absolute inset-0 overflow-hidden', className]
        .filter(Boolean)
        .join(' ')}
      aria-hidden
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 80% 70% at 50% 42%, ${accent.field} 0%, transparent 72%)`,
        }}
      />
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 400 280"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <ellipse
          cx="200"
          cy="140"
          rx="148"
          ry="108"
          stroke={accent.stroke}
          strokeWidth="0.75"
          opacity="0.85"
        />
        <ellipse
          cx="200"
          cy="140"
          rx="108"
          ry="78"
          stroke={accent.stroke}
          strokeWidth="0.5"
          strokeDasharray="3 5"
          opacity="0.45"
        />
        <circle cx="200" cy="140" r="5" fill={accent.glow} stroke={accent.stroke} strokeWidth="0.75" />
        <path
          d="M 52 140 Q 200 68 348 140"
          stroke={accent.stroke}
          strokeWidth="0.6"
          opacity="0.35"
        />
        <path
          d="M 52 140 Q 200 212 348 140"
          stroke={accent.stroke}
          strokeWidth="0.6"
          opacity="0.25"
        />
        <circle cx="52" cy="140" r="3" fill={accent.glow} opacity="0.7" />
        <circle cx="348" cy="140" r="3" fill={accent.glow} opacity="0.7" />
      </svg>
    </div>
  );
}
