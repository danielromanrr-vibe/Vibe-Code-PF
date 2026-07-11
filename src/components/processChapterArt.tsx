import type { ProcessOverviewChapterId } from './AdoptProcessOverview';

export type ProcessChapterTheme = {
  back: string;
  accent: string;
  ink: string;
};

export const PROCESS_CHAPTER_THEMES: Record<ProcessOverviewChapterId, ProcessChapterTheme> = {
  research: { back: '#101C3A', accent: '#3360AD', ink: '#F4EFE4' },
  definition: { back: '#1C0F2B', accent: '#714CA0', ink: '#F4EFE4' },
  'rapid-prototyping': { back: '#2B2402', accent: '#DCA600', ink: '#F4EFE4' },
  validation: { back: '#041D12', accent: '#007D56', ink: '#F4EFE4' },
};

type ChapterArtProps = {
  theme: ProcessChapterTheme;
  chapterId: ProcessOverviewChapterId;
};

/** Simple geometric fields — matches Thinking Through Design card art direction */
export function ProcessChapterArt({ theme, chapterId }: ChapterArtProps) {
  if (chapterId === 'research') {
    return (
      <div
        className="absolute inset-0 overflow-hidden"
        aria-hidden
        style={{
          background: `linear-gradient(145deg, ${theme.back} 0%, ${theme.accent}88 100%)`,
        }}
      >
        <div
          className="absolute -bottom-[8%] left-1/2 h-[72%] w-[120%] -translate-x-1/2"
          style={{
            background: theme.accent,
            clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
            opacity: 0.55,
          }}
        />
      </div>
    );
  }

  if (chapterId === 'definition') {
    return (
      <div className="absolute inset-0 overflow-hidden" aria-hidden style={{ background: theme.back }}>
        <div
          className="absolute -right-[18%] top-[12%] h-[78%] w-[68%] rounded-full"
          style={{ background: theme.accent, opacity: 0.42 }}
        />
        <div
          className="absolute -left-[12%] bottom-[8%] h-[44%] w-[52%] rounded-full"
          style={{ background: theme.accent, opacity: 0.28 }}
        />
      </div>
    );
  }

  if (chapterId === 'rapid-prototyping') {
    return (
      <div className="absolute inset-0 overflow-hidden" aria-hidden style={{ background: theme.back }}>
        <div
          className="absolute inset-x-0 bottom-0 h-[58%]"
          style={{
            background: `linear-gradient(180deg, transparent 0%, ${theme.accent}66 100%)`,
          }}
        />
        <div
          className="absolute left-[14%] top-[18%] h-[38%] w-[38%] rotate-12 rounded-lg"
          style={{ background: theme.accent, opacity: 0.5 }}
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden style={{ background: theme.back }}>
      <div
        className="absolute -bottom-[6%] left-1/2 h-[68%] w-[110%] -translate-x-1/2"
        style={{
          background: theme.accent,
          clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
          opacity: 0.5,
        }}
      />
    </div>
  );
}
