import { useId, type KeyboardEvent, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

export type EditorialTabItem = {
  id: string;
  label: string;
};

export type EditorialTabRenderContext = {
  tab: EditorialTabItem;
  index: number;
  isActive: boolean;
  isPast: boolean;
  num: string;
  baseId: string;
  tabPanelId?: string;
  onSelect: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
};

export type EditorialTabNavProps = {
  tabs: readonly EditorialTabItem[];
  activeIndex: number;
  onSelect: (index: number) => void;
  ariaLabel: string;
  tabPanelId?: string;
  /** Zilla 01–0n index before each label (process chapters). */
  showIndex?: boolean;
  align?: 'center' | 'start';
  /** Shared layoutId for the sliding selector across tabs. */
  ruleLayoutId?: string;
  /** Stable id prefix for tabs — `${tabIdPrefix}-${tab.id}` (a11y wiring to tabpanel). */
  tabIdPrefix?: string;
  className?: string;
  /** Replace default tab button (e.g. prototyping chapter + track select). */
  renderTab?: (ctx: EditorialTabRenderContext) => ReactNode | null;
};

export type EditorialTabUnderlineProps = {
  isActive: boolean;
  ruleLayoutId?: string;
};

const DEFAULT_RULE_LAYOUT_ID = 'editorial-tab-selector';

const ruleSpring = { type: 'spring' as const, stiffness: 380, damping: 32, mass: 0.7 };

function chapterNumber(index: number): string {
  return String(index + 1).padStart(2, '0');
}

/** Underline track sized to parent stack (w-fit); selector spans full label width. */
export function EditorialTabUnderline({
  isActive,
  ruleLayoutId = DEFAULT_RULE_LAYOUT_ID,
}: EditorialTabUnderlineProps) {
  const reduceMotion = useReducedMotion();
  const ruleTransition = reduceMotion ? { duration: 0 } : ruleSpring;

  return (
    <span className="editorial-tab-nav__track relative mt-3 block h-px w-full" aria-hidden>
      {isActive ? (
        <motion.span
          layoutId={ruleLayoutId}
          className="editorial-tab-nav__selector pointer-events-none absolute inset-x-0 top-0 h-full w-full"
          transition={ruleTransition}
        />
      ) : null}
    </span>
  );
}

export default function EditorialTabNav({
  tabs,
  activeIndex,
  onSelect,
  ariaLabel,
  tabPanelId,
  showIndex = false,
  align = 'center',
  ruleLayoutId = DEFAULT_RULE_LAYOUT_ID,
  tabIdPrefix,
  className = '',
  renderTab,
}: EditorialTabNavProps) {
  const baseId = useId();
  const tabIdStem = tabIdPrefix ?? `${baseId}-tab`;

  const onChapterKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      onSelect(Math.min(tabs.length - 1, index + 1));
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      onSelect(Math.max(0, index - 1));
    } else if (event.key === 'Home') {
      event.preventDefault();
      onSelect(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      onSelect(tabs.length - 1);
    }
  };

  if (tabs.length === 0) return null;

  const alignStart = align === 'start';
  const tabAlignClass = alignStart ? 'items-start' : 'items-center';

  return (
    <header className={`editorial-tab-nav mb-0 min-w-0 ${className}`.trim()}>
      <div className="editorial-tab-nav__shell min-w-0">
        <nav className="min-w-0" aria-label={ariaLabel}>
          <div className="editorial-tab-nav__scroll overflow-x-auto [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="editorial-tab-nav__inner w-max min-w-full">
              <div className="editorial-tab-nav__strip relative px-0 pb-3 pt-2 sm:pb-3.5">
                <span
                  className="editorial-tab-nav__path pointer-events-none absolute inset-x-0 bottom-3 h-px sm:bottom-3.5"
                  aria-hidden
                />

                <div
                  className={`editorial-tab-nav__list relative flex w-full min-w-0 items-end ${tabAlignClass}`}
                  role="tablist"
                >
                  {tabs.map((tab, i) => {
                    const isActive = i === activeIndex;
                    const isPast = showIndex && i < activeIndex;
                    const num = chapterNumber(i);

                    const labelState = isActive
                      ? 'editorial-tab-nav__label--active'
                      : isPast
                        ? 'editorial-tab-nav__label--past'
                        : 'editorial-tab-nav__label--idle';

                    const ctx: EditorialTabRenderContext = {
                      tab,
                      index: i,
                      isActive,
                      isPast,
                      num,
                      baseId,
                      tabPanelId,
                      onSelect: () => onSelect(i),
                      onKeyDown: (event) => onChapterKeyDown(event, i),
                    };

                    const custom = renderTab?.(ctx);
                    if (custom != null) {
                      return (
                        <div
                          key={tab.id}
                          className={`editorial-tab-nav__tab-slot flex min-w-0 flex-1 flex-col px-2 sm:px-3 ${tabAlignClass}`}
                        >
                          {custom}
                        </div>
                      );
                    }

                    return (
                      <button
                        key={tab.id}
                        type="button"
                        id={`${tabIdStem}-${tab.id}`}
                        role="tab"
                        aria-selected={isActive}
                        aria-current={isActive ? 'step' : undefined}
                        aria-controls={tabPanelId}
                        aria-label={`${showIndex ? `Chapter ${num}: ` : ''}${tab.label}${isActive ? ' (current)' : isPast ? ' (completed)' : ''}`}
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => onSelect(i)}
                        onKeyDown={(event) => onChapterKeyDown(event, i)}
                        className={`editorial-tab-nav__tab group flex min-w-0 flex-1 flex-col px-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink/25 sm:px-3 ${tabAlignClass}`}
                      >
                        <span className="editorial-tab-nav__stack inline-flex w-fit max-w-full flex-col">
                          <span
                            className={`editorial-tab-nav__label-row inline-flex min-w-0 items-baseline gap-2 whitespace-nowrap ${
                              alignStart ? 'justify-start' : 'justify-center'
                            }`}
                          >
                            {showIndex ? (
                              <span className="editorial-tab-nav__index shrink-0" aria-hidden>
                                {num}
                              </span>
                            ) : null}
                            <span
                              className={`editorial-tab-nav__label min-w-0 transition-colors duration-150 ${labelState}`}
                            >
                              {tab.label}
                            </span>
                          </span>
                          <EditorialTabUnderline isActive={isActive} ruleLayoutId={ruleLayoutId} />
                        </span>
                        {isPast ? <span className="sr-only"> — completed</span> : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
