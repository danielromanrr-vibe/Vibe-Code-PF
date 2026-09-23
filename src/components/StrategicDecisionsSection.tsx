import { ChevronDown } from 'lucide-react';
import type { StrategicDecisionItem } from '../content/adoptCaseStudy';

export type StrategicDecisionsSectionProps = {
  heading?: string;
  /** Chapter title stays h2. A subsection under a parent h2 uses h3. */
  headingAs?: 'h2' | 'h3';
  lede?: string;
  /** When the heading and lede live in a neighboring column, render only the questions. */
  showHeader?: boolean;
  items: readonly StrategicDecisionItem[];
  openIndex: number | null;
  onToggle: (index: number) => void;
};

export default function StrategicDecisionsSection({
  heading = 'Navigating ambiguity & designing strategically',
  headingAs = 'h2',
  lede = '',
  showHeader = true,
  items,
  openIndex,
  onToggle,
}: StrategicDecisionsSectionProps) {
  const HeadingTag = headingAs === 'h3' ? 'h3' : 'h2';

  return (
    <div
      className={[
        'adopt-strategic-decisions__inner flex w-full min-w-0 flex-col',
        showHeader ? 'mx-auto max-w-2xl items-center text-center' : 'items-stretch text-left',
      ].join(' ')}
    >
      {showHeader ? (
        <header className="adopt-strategic-decisions__head min-w-0">
          <HeadingTag className="adopt-context-heading mx-auto max-w-[28ch] text-balance">
            {heading}
          </HeadingTag>
          {lede ? (
            <p className="adopt-body mx-auto mb-0 max-w-[44ch] text-pretty text-ink/82">{lede}</p>
          ) : null}
        </header>
      ) : null}

      <div
        className={[
          'adopt-strategic-decisions__list w-full min-w-0 text-left',
          showHeader ? 'border-y border-ink/[0.08]' : 'flex flex-col gap-3',
        ].join(' ')}
        role="list"
      >
        {items.map((item, i) => {
          const isOpen = openIndex === i;

          return (
            <div
              key={item.id}
              role="listitem"
              className={
                showHeader
                  ? 'adopt-strategic-row border-b border-ink/[0.08] last:border-b-0'
                  : 'adopt-strategic-row rounded-2xl border border-ink/[0.09] bg-white px-1 shadow-[0_1px_2px_rgba(0,0,0,0.04)]'
              }
            >
              <button
                type="button"
                onClick={() => onToggle(i)}
                className="adopt-strategic-row__trigger group flex w-full items-start justify-between gap-4 text-left transition-colors hover:bg-ink/[0.015] md:gap-5"
                aria-expanded={isOpen}
              >
                <span className="min-w-0 flex-1">
                  <span className="adopt-body block text-pretty text-ink/88 transition-colors group-hover:text-ink">
                    {item.title}
                  </span>
                </span>
                <ChevronDown
                  size={16}
                  strokeWidth={1.75}
                  className={`mt-1 shrink-0 text-ink/40 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  aria-hidden
                />
              </button>

              {isOpen ? (
                <div className="adopt-strategic-row__panel flex flex-col gap-3 border-t border-ink/[0.06]">
                  {item.content.split('\n\n').filter(Boolean).map((paragraph) => (
                    <p
                      key={paragraph}
                      className="adopt-body adopt-strategic-body mb-0 max-w-[52ch] text-pretty text-ink/78"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
