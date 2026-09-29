import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { Z } from '../lib/tokens';

export type PillTone = 'neutral' | 'good' | 'risk' | 'gap' | 'info';

export function Pill({
  tone = 'neutral',
  icon: Icon,
  children,
  className = '',
}: {
  tone?: PillTone;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={`pill pill--${tone} ${className}`}>
      {Icon ? <Icon className="w-3 h-3 shrink-0" aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

export function Eyebrow({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <div id={id} className={`eyebrow ${className}`}>
      {children}
    </div>
  );
}

export type ButtonVariant = 'primary' | 'secondary' | 'quiet' | 'card' | 'destructive';

const FOCUS = 'outline-none focus-visible:ring-2 focus-visible:ring-[#0066cc]/30';

const BUTTON_BASE =
  'inline-flex items-center justify-center gap-1.5 rounded-full tracking-[-0.012em] whitespace-nowrap transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-40 disabled:pointer-events-none aria-disabled:opacity-40 aria-disabled:pointer-events-none';

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: 'h-9 px-3.5 text-[13px] font-semibold bg-[#0066cc] text-white hover:bg-[#0052a3] shadow-xs',
  secondary:
    'h-9 px-3.5 text-[13px] font-medium bg-white border border-[#141414]/10 text-[#141414] hover:bg-black/[0.03] shadow-xs',
  quiet: 'h-9 px-3 text-[13px] font-medium text-[#141414]/65 hover:text-[#141414] hover:bg-black/[0.04]',
  card: 'h-8 px-3 text-[12.5px] font-medium text-[#141414] bg-[#F8F9FA] border border-[#141414]/[0.06] hover:bg-black/[0.04]',
  destructive: 'h-9 px-3.5 text-[13px] font-semibold bg-red-600 text-white hover:bg-red-700 shadow-xs',
};

type ButtonOwnProps = {
  variant?: ButtonVariant;
  icon?: React.ComponentType<{ className?: string }>;
  block?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export function buttonClass(variant: ButtonVariant = 'secondary', block = false, className = '') {
  return `${BUTTON_BASE} ${BUTTON_VARIANTS[variant]} ${FOCUS} ${block ? 'w-full' : ''} ${className}`;
}

export const Button = React.forwardRef(function Button(
  { variant = 'secondary', icon: Icon, block, className = '', children, type = 'button', ...rest }: ButtonOwnProps & React.ButtonHTMLAttributes<HTMLButtonElement>,
  ref: React.Ref<HTMLButtonElement>,
) {
  return (
    <button ref={ref} type={type} className={buttonClass(variant, block, className)} {...rest}>
      {Icon ? <Icon className={variant === 'card' ? 'w-3.5 h-3.5' : 'w-4 h-4'} aria-hidden="true" /> : null}
      {children}
    </button>
  );
});

export function ButtonLink({
  variant = 'secondary',
  icon: Icon,
  block,
  className = '',
  children,
  ...rest
}: ButtonOwnProps & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={buttonClass(variant, block, className)} {...rest}>
      {Icon ? <Icon className={variant === 'card' ? 'w-3.5 h-3.5' : 'w-4 h-4'} aria-hidden="true" /> : null}
      {children}
    </a>
  );
}

export function IconStat({
  icon: Icon,
  label,
  value,
  href,
  className = '',
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
  href?: string;
  className?: string;
}) {
  const body = (
    <>
      <Icon className="w-3.5 h-3.5 shrink-0 text-[#141414]/50" aria-hidden="true" />
      <span className="truncate">{value}</span>
    </>
  );
  const base = `flex items-center gap-1.5 min-w-0 text-[12px] text-[#141414]/78 ${className}`;
  if (href) {
    return (
      <a
        href={href}
        aria-label={label}
        className={`${base} rounded-full hover:text-[#0066cc] transition-colors duration-200 ${FOCUS}`}
      >
        {body}
      </a>
    );
  }
  return (
    <div className={base} aria-label={label}>
      {body}
    </div>
  );
}

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  label,
  className = '',
}: {
  value: T;
  options: { value: T; label: React.ReactNode }[];
  onChange: (value: T) => void;
  label: string;
  className?: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className={`h-9 p-1 rounded-full bg-[#141414]/[0.05] flex items-center gap-0.5 ${className}`}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={`flex-1 h-7 px-2.5 rounded-full text-[12.5px] tracking-[-0.012em] whitespace-nowrap transition-all duration-200 active:scale-[0.98] cursor-pointer ${FOCUS} ${
              active
                ? 'bg-white text-[#141414] font-semibold shadow-xs border border-[#141414]/10'
                : 'text-[#141414]/78 font-medium hover:text-[#141414] border border-transparent'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export const SHEET_SPRING = { type: 'spring', stiffness: 380, damping: 32 } as const;

const sheetStack: symbol[] = [];

/**
 * Centered modal shell. Only the top-most open sheet reacts to Escape,
 * so a Text Draft opened over a profile closes on its own.
 */
export function Sheet({
  onClose,
  labelledBy,
  children,
  className = 'max-w-lg',
  initialFocusRef,
}: {
  onClose: () => void;
  labelledBy: string;
  children: React.ReactNode;
  className?: string;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  key?: React.Key;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const token = Symbol('sheet');
    sheetStack.push(token);
    const trigger = document.activeElement as HTMLElement | null;

    const focusTarget =
      initialFocusRef?.current ??
      panelRef.current?.querySelector<HTMLElement>('[data-autofocus]') ??
      panelRef.current?.querySelector<HTMLElement>('button, a[href], input, textarea, select');
    requestAnimationFrame(() => focusTarget?.focus());

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && sheetStack[sheetStack.length - 1] === token) {
        event.stopPropagation();
        onCloseRef.current();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      const index = sheetStack.indexOf(token);
      if (index !== -1) sheetStack.splice(index, 1);
      if (trigger && document.contains(trigger)) trigger.focus();
    };
  }, []);

  return createPortal(
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
        onClick={onClose}
        style={{ zIndex: Z.scrim }}
        className="fixed inset-0 bg-[#141414]/30 backdrop-blur-[6px]"
        aria-hidden="true"
      />
      <div style={{ zIndex: Z.sheet }} className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelledBy}
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0, transition: SHEET_SPRING }}
          exit={{ opacity: 0, scale: 0.96, y: 8, transition: { duration: 0.15 } }}
          className={`pointer-events-auto w-full max-h-[calc(100vh-2rem)] overflow-y-auto bg-white rounded-2xl border border-[#141414]/[0.08] shadow-[0_24px_48px_-12px_rgba(12,21,40,0.28)] text-[#141414] ${className}`}
        >
          {children}
        </motion.div>
      </div>
    </>,
    document.body,
  );
}

export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const initials = name
    .replace(/\./g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
  return (
    <div
      aria-hidden="true"
      style={{ width: size, height: size }}
      className="rounded-full bg-[#141414]/[0.06] text-[#141414] text-[13px] font-semibold flex items-center justify-center shrink-0 tabular-nums"
    >
      {initials}
    </div>
  );
}
