import type { ReactNode } from 'react';

export function ScopeIconMark({ children }: { children: ReactNode }) {
  return (
    <span
      className="flex h-[3.25rem] w-[3.25rem] shrink-0 items-center justify-center overflow-hidden rounded-full border border-ink/[0.13] bg-white p-1 sm:h-[3.75rem] sm:w-[3.75rem] sm:p-1.5"
      aria-hidden
    >
      {children}
    </span>
  );
}

type ScopeRailRowProps = {
  eyebrow: string;
  body: string;
  mark?: ReactNode;
  clampBody?: boolean;
  id?: string;
};

/** Context & Intro scope rail — icon + eyebrow + body. */
export function ScopeRailRow({ eyebrow, body, mark, clampBody = false, id }: ScopeRailRowProps) {
  return (
    <div
      id={id}
      className={['flex flex-row items-start gap-3 sm:gap-4', id ? 'scroll-mt-6' : ''].filter(Boolean).join(' ')}
    >
      {mark}
      <div className="min-w-0 flex-1">
        <p className="adopt-prototype-strip-eyebrow mb-1.5">{eyebrow}</p>
        <p
          className={[
            'adopt-body adopt-prototype-strip-copy mb-0 max-w-none leading-[1.45] text-ink/72',
            clampBody ? 'line-clamp-2' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {body}
        </p>
      </div>
    </div>
  );
}
