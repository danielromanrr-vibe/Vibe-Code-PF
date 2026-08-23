const ICON_MAP = '/adopt-a-school/icons/Map-interface.svg';
const ICON_PROFILE = '/adopt-a-school/icons/Business.svg';
const ICON_SUPPORT = '/adopt-a-school/icons/Ongoing-support.svg';

function ScopeStripIcon({ variant }: { variant: 'map' | 'profile' | 'support' }) {
  const src =
    variant === 'map' ? ICON_MAP : variant === 'profile' ? ICON_PROFILE : ICON_SUPPORT;
  const imgClass =
    'pointer-events-none max-h-full w-auto max-w-full select-none object-contain object-center opacity-45';

  if (variant === 'map') {
    return (
      <img
        src={src}
        alt=""
        width={62}
        height={59}
        className={`${imgClass} h-[3.375rem] w-auto sm:h-[4rem]`}
        loading="lazy"
        decoding="async"
        aria-hidden
      />
    );
  }
  if (variant === 'profile') {
    return (
      <img
        src={src}
        alt=""
        width={44}
        height={38}
        className={`${imgClass} h-[2.875rem] w-auto sm:h-[3.5rem]`}
        loading="lazy"
        decoding="async"
        aria-hidden
      />
    );
  }
  return (
    <img
      src={src}
      alt=""
      width={44}
      height={38}
      className={`${imgClass} h-[3.75rem] w-auto sm:h-[4.375rem]`}
      loading="lazy"
      decoding="async"
      aria-hidden
    />
  );
}

function ScopeDecorativeIconTile({ variant }: { variant: 'map' | 'profile' | 'support' }) {
  return (
    <div
      className="scope-icon-learn-more scope-icon-learn-more--tall pointer-events-none shrink-0"
      aria-hidden="true"
    >
      <span className="scope-icon-learn-more__mark">
        <span className="flex h-[3.25rem] w-[3.25rem] items-center justify-center overflow-hidden rounded-full border border-ink/[0.13] bg-white p-1 sm:h-[3.75rem] sm:w-[3.75rem] sm:p-1.5">
          <ScopeStripIcon variant={variant} />
        </span>
      </span>
    </div>
  );
}

const stripEyebrowClass = 'adopt-prototype-strip-eyebrow';

const SCOPE_ITEMS = [
  {
    variant: 'profile' as const,
    eyebrow: 'Structured driver profiles',
    body: 'Availability, constraints, and context captured once—so dispatch does not depend on who remembers whom.',
  },
  {
    variant: 'map' as const,
    eyebrow: 'Map-based decision layer',
    body: 'Nearby, available drivers surfaced in real time so coordinators decide fast without leaving the map.',
  },
  {
    variant: 'support' as const,
    eyebrow: 'Decision support, not automation',
    body: 'The system supports judgment under pressure—it does not replace the person coordinating the route.',
  },
];

export default function DriverScopeRail() {
  const scopeBlockGapClass = 'gap-8 md:gap-10';
  const scopeMoleculeRow = 'flex flex-row items-center gap-3 sm:gap-4';

  return (
    <div className="adopt-scope-rail w-full min-w-0" aria-label="Scope — profiles, map layer, and coordinator support">
      <div className={`flex w-full min-w-0 flex-col ${scopeBlockGapClass}`}>
        {SCOPE_ITEMS.map((item) => (
          <div key={item.eyebrow} className={scopeMoleculeRow}>
            <ScopeDecorativeIconTile variant={item.variant} />
            <div className="min-w-0 flex-1">
              <p className={`${stripEyebrowClass} mb-2`}>{item.eyebrow}</p>
              <p className="adopt-body adopt-prototype-strip-copy mb-0 max-w-none leading-[1.45] text-ink/72">
                {item.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
