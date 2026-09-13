import { Fragment } from 'react';
import type { VhenyWorkKind } from '../content/vhenyDiamonds';

type VhenySplitPillProps = {
  selected?: VhenyWorkKind | null;
  onSelect: (kind: VhenyWorkKind) => void;
  onHoverChange?: (kind: VhenyWorkKind | null) => void;
  ariaLabel?: string;
};

const OPTIONS: readonly { kind: VhenyWorkKind; label: string }[] = [
  { kind: 'product', label: 'Product design' },
  { kind: 'branding', label: 'Branding' },
];

export function VhenySplitPill({
  selected = null,
  onSelect,
  onHoverChange,
  ariaLabel = 'Choose a body of work',
}: VhenySplitPillProps) {
  return (
    <div className="vheny-work-pill" role="group" aria-label={ariaLabel}>
      {OPTIONS.map(({ kind, label }, index) => (
        <Fragment key={kind}>
          {index > 0 ? <span className="vheny-work-pill__rule" aria-hidden /> : null}
          <button
            type="button"
            className={`vheny-work-pill__option${selected === kind ? ' is-selected' : ''}`}
            aria-pressed={selected ? selected === kind : undefined}
            onClick={() => onSelect(kind)}
            onMouseEnter={() => onHoverChange?.(kind)}
            onMouseLeave={() => onHoverChange?.(null)}
            onFocus={() => onHoverChange?.(kind)}
            onBlur={() => onHoverChange?.(null)}
          >
            {label}
          </button>
        </Fragment>
      ))}
    </div>
  );
}

