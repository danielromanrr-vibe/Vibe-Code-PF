import { ScopeIconMark, ScopeRailRow } from './ScopeReadMorePlus';

const ICON_MAP = '/adopt-a-school/icons/Map-interface.svg';
const ICON_PROFILE = '/adopt-a-school/icons/Business.svg';
const ICON_SUPPORT = '/adopt-a-school/icons/Ongoing-support.svg';

const iconClass =
  'max-h-full w-auto max-w-full object-contain object-center opacity-45';

const SCOPE_ITEMS = [
  {
    eyebrow: 'Structured driver profiles',
    body: 'Availability, constraints, and context captured once—so dispatch does not depend on who remembers whom.',
    src: ICON_PROFILE,
    width: 44,
    height: 38,
  },
  {
    eyebrow: 'Map-based decision layer',
    body: 'Nearby, available drivers surfaced in real time so coordinators decide fast without leaving the map.',
    src: ICON_MAP,
    width: 62,
    height: 59,
  },
  {
    eyebrow: 'Decision support, not automation',
    body: 'The system supports judgment under pressure—it does not replace the person coordinating the route.',
    src: ICON_SUPPORT,
    width: 44,
    height: 38,
  },
];

export default function DriverScopeRail() {
  return (
    <div className="adopt-scope-rail w-full min-w-0" aria-label="Scope — profiles, map layer, and coordinator support">
      <div className="flex w-full min-w-0 flex-col gap-8 md:gap-10">
        {SCOPE_ITEMS.map((item) => (
          <ScopeRailRow
            key={item.eyebrow}
            eyebrow={item.eyebrow}
            body={item.body}
            mark={
              <ScopeIconMark>
                <img
                  src={item.src}
                  alt=""
                  width={item.width}
                  height={item.height}
                  className={iconClass}
                  loading="lazy"
                  decoding="async"
                />
              </ScopeIconMark>
            }
          />
        ))}
      </div>
    </div>
  );
}
