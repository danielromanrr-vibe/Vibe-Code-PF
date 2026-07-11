import ScopeIconLearnMoreLink from './ScopeIconLearnMoreLink';

const ICON_MAP = '/adopt-a-school/icons/Map-interface.svg';
const ICON_PROFILE = '/adopt-a-school/icons/Business.svg';
const ICON_SUPPORT = '/adopt-a-school/icons/Ongoing-support.svg';

const SCOPE_LEARN_MORE_PROCESS = '#driver-process-overview';
const SCOPE_LEARN_MORE_MAP = '#driver-section-map';

function ScopeStripIcon({ variant }: { variant: 'map' | 'profile' | 'support' }) {
  const src =
    variant === 'map' ? ICON_MAP : variant === 'profile' ? ICON_PROFILE : ICON_SUPPORT;
  const imgClass =
    'pointer-events-none max-h-full w-auto max-w-full select-none object-contain object-center';

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

function ScopeDecorativeIconTile({
  variant,
  learnMoreHref,
}: {
  variant: 'map' | 'profile' | 'support';
  learnMoreHref: string;
}) {
  const label =
    variant === 'map'
      ? 'Map-based decision layer'
      : variant === 'profile'
        ? 'Structured driver profiles'
        : 'Coordinator decision support';

  return (
    <ScopeIconLearnMoreLink href={learnMoreHref} label={label} cta="Learn more" className="scope-icon-learn-more--tall">
      <ScopeStripIcon variant={variant} />
    </ScopeIconLearnMoreLink>
  );
}

const stripEyebrowClass = 'adopt-prototype-strip-eyebrow';

const SCOPE_ITEMS = [
  {
    variant: 'profile' as const,
    eyebrow: 'Structured driver profiles',
    body: 'Availability, constraints, and context captured once—so dispatch does not depend on who remembers whom.',
    href: SCOPE_LEARN_MORE_PROCESS,
  },
  {
    variant: 'map' as const,
    eyebrow: 'Map-based decision layer',
    body: 'Nearby, available drivers surfaced in real time so coordinators decide fast without leaving the map.',
    href: SCOPE_LEARN_MORE_MAP,
  },
  {
    variant: 'support' as const,
    eyebrow: 'Decision support, not automation',
    body: 'The system supports judgment under pressure—it does not replace the person coordinating the route.',
    href: SCOPE_LEARN_MORE_PROCESS,
  },
];

export default function DriverScopeRail() {
  const scopeBlockGapClass = 'gap-8 md:gap-10';
  const scopeMoleculeRow = 'flex flex-row items-start gap-3 sm:gap-4';

  return (
    <div className="adopt-scope-rail w-full min-w-0" aria-label="Scope — profiles, map layer, and coordinator support">
      <div className={`flex w-full min-w-0 flex-col ${scopeBlockGapClass}`}>
        {SCOPE_ITEMS.map((item, i) => (
          <div
            key={item.eyebrow}
            id={i === 1 ? 'driver-section-map' : undefined}
            className={`${scopeMoleculeRow} ${i === 2 ? 'scroll-mt-6' : ''}`}
          >
            <ScopeDecorativeIconTile variant={item.variant} learnMoreHref={item.href} />
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
