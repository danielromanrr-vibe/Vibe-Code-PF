import { ChevronDown } from 'lucide-react';
import type { StrategicDecisionItem } from '../content/adoptCaseStudy';

export type StrategicDecisionsSectionProps = {
  lede: string;
  items: readonly StrategicDecisionItem[];
  openIndex: number | null;
  onToggle: (index: number) => void;
};

export default function StrategicDecisionsSection({
  lede,
  items,
  openIndex,
  onToggle,
}: StrategicDecisionsSectionProps) {
  return (
    <div className="adopt-strategic-decisions__inner mx-auto flex w-full max-w-2xl flex-col items-center text-center">
      <header className="adopt-strategic-decisions__head mb-8 min-w-0 md:mb-10">
        <h2 className="adopt-context-heading mx-auto mb-1.5 max-w-[28ch] text-balance md:mb-2">
          Navigating ambiguity &amp; designing strategically
        </h2>
        <p className="adopt-body mx-auto mb-0 max-w-[44ch] text-pretty text-ink/82">{lede}</p>
      </header>

      <div
        className="adopt-strategic-decisions__list w-full min-w-0 border-y border-ink/[0.08] text-left"
        role="list"
      >
        {items.map((item, i) => {
          const isOpen = openIndex === i;

          return (
            <div
              key={item.id}
              role="listitem"
              className="adopt-strategic-row border-b border-ink/[0.08] last:border-b-0"
            >
              <button
                type="button"
                onClick={() => onToggle(i)}
                className="adopt-strategic-row__trigger group flex w-full items-start justify-between gap-4 py-5 text-left transition-colors hover:bg-ink/[0.015] md:gap-5 md:py-6"
                aria-expanded={isOpen}
              >
                <span className="adopt-strategic-marker mt-1 shrink-0" aria-hidden />
                <span className="min-w-0 flex-1">
                  <span className="adopt-meta-label mb-1.5 block">{item.label}</span>
                  <span className="adopt-card-title block text-balance transition-colors group-hover:text-ink">
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
                <div className="adopt-strategic-row__panel border-t border-ink/[0.06] pb-5 pt-4 md:pb-6 md:pt-5">
                  <p className="adopt-body adopt-strategic-body mb-0 max-w-[52ch] whitespace-pre-line text-pretty text-ink/78">
                    {item.content}
                  </p>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
