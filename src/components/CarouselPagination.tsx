import { motion } from 'motion/react';

export type CarouselPaginationVariant = 'tray' | 'organic';

export type CarouselPaginationProps = {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
  reducedMotion?: boolean;
  layoutIdPrefix?: string;
  /** Optional labels for each index (used in aria-label and tooltips). */
  labels?: string[];
  /** Overrides the tablist aria-label (default: "Slide indicators"). */
  ariaLabel?: string;
  /** `organic` — bare fluid dots; `tray` — enclosed pill control. */
  variant?: CarouselPaginationVariant;
  /** Tighter dot cluster for inline nav controls (arrows flanking). */
  compact?: boolean;
  className?: string;
};

const organicSpring = {
  type: 'spring' as const,
  stiffness: 420,
  damping: 28,
  mass: 0.62,
};

const organicSpringReduced = { duration: 0.2, ease: 'easeOut' as const };

/**
 * Simple dot pagination — `organic` is the default editorial pattern (fluid droplets).
 */
export default function CarouselPagination({
  count,
  activeIndex,
  onSelect,
  reducedMotion,
  layoutIdPrefix = 'project-carousel',
  labels,
  ariaLabel = 'Slide indicators',
  variant = 'organic',
  compact = false,
  className = '',
}: CarouselPaginationProps) {
  if (count <= 1) return null;

  const traySpring = reducedMotion
    ? { duration: 0.16, ease: 'easeOut' as const }
    : { type: 'spring' as const, stiffness: 540, damping: 42, mass: 0.52 };

  if (variant === 'tray') {
    return (
      <div className="flex justify-center pt-2 md:pt-2" role="tablist" aria-label={ariaLabel}>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-ink/[0.07] bg-white/[0.92] px-2 py-1 shadow-[0_1px_2px_rgba(12,21,40,0.05),inset_0_1px_0_rgba(255,255,255,0.88)]">
          {Array.from({ length: count }, (_, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                className="relative flex h-5 min-w-[1rem] shrink-0 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ink/25 focus-visible:ring-offset-1 focus-visible:ring-offset-[#F8F9FA]"
                onClick={() => onSelect(i)}
                aria-label={
                  labels?.[i]
                    ? `${labels[i]}, slide ${i + 1} of ${count}`
                    : `Slide ${i + 1} of ${count}`
                }
                title={labels?.[i]}
              >
                {isActive ? (
                  <motion.span
                    layoutId={`${layoutIdPrefix}-active-pill`}
                    className="h-1.5 w-[1.625rem] shrink-0 rounded-full bg-ink/44 shadow-[0_1px_2px_rgba(12,21,40,0.1)]"
                    transition={traySpring}
                    aria-hidden
                  />
                ) : (
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-ink/32 transition-colors hover:bg-ink/44"
                    aria-hidden
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`carousel-pagination-organic flex items-center justify-center ${
        compact ? 'carousel-pagination-organic--compact gap-1 pt-0' : 'gap-2.5 pt-3 md:gap-3 md:pt-3.5'
      } ${className}`.trim()}
      role="tablist"
      aria-label={ariaLabel}
    >
      {Array.from({ length: count }, (_, i) => {
        const isActive = i === activeIndex;
        return (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            className={`carousel-pagination-organic-hit relative flex items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ink/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F9FA] ${
              compact ? 'h-6 w-6' : 'h-7 w-7'
            }`}
            onClick={() => onSelect(i)}
            aria-label={
              labels?.[i] ? `${labels[i]}, slide ${i + 1} of ${count}` : `Slide ${i + 1} of ${count}`
            }
            title={labels?.[i]}
          >
            <motion.span
              layout
              className="block rounded-full bg-ink/30"
              initial={false}
              animate={{
                width: isActive ? 10 : 6,
                height: isActive ? 10 : 6,
                opacity: isActive ? 0.52 : 0.28,
                scale: isActive ? 1 : 0.92,
              }}
              transition={reducedMotion ? organicSpringReduced : organicSpring}
              aria-hidden
            />
            {isActive && !reducedMotion ? (
              <motion.span
                className="pointer-events-none absolute inset-0 m-auto h-3 w-3 rounded-full bg-ink/18"
                initial={{ scale: 0.6, opacity: 0.5 }}
                animate={{ scale: [0.85, 1.15, 0.95], opacity: [0.35, 0.12, 0.28] }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                aria-hidden
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
