import type { VisualOwnership } from '../content/visualDesign';

export type OwnershipEntry = VisualOwnership & {
  id: string;
};

type OwnershipSidebarProps = {
  entries: readonly OwnershipEntry[];
  activeId: string | null;
};

/**
 * Desktop margin card. Hidden below 1280px so the reading column stays full width.
 */
export default function OwnershipSidebar({ entries, activeId }: OwnershipSidebarProps) {
  const active = entries.find((entry) => entry.id === activeId);
  if (!active) return null;

  return (
    <aside className="ownership-sidebar" aria-label="What I owned">
      <div className="ownership-sidebar__card">
        <p className="ownership-sidebar__kicker">What I owned</p>
        <div aria-live="polite" aria-atomic="true">
          <div key={active.id} className="ownership-sidebar__body">
            <p className="ownership-sidebar__title">{active.title}</p>
            {active.bullets.length > 1 ? (
              <ul className="ownership-sidebar__list">
                {active.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : (
              <p className="ownership-sidebar__copy">{active.bullets[0]}</p>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
