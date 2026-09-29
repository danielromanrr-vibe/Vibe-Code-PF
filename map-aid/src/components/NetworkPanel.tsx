import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Plus, Search, Users, X } from 'lucide-react';
import type { Driver, School } from '../types';
import { SCHOOL_COORDS } from '../data';
import type { StatusContext } from '../lib/status';
import { getDistance } from '../lib/geo';
import { archetypeLabel, archetypeOf, routesOf } from '../lib/volunteer';
import { SegmentedControl } from './ui';
import { VolunteerCard } from './VolunteerCard';
import { Z } from '../lib/tokens';

type NetworkFilter = 'all' | 'floater' | 'loyalist';

function searchText(d: Driver, schools: School[]): string {
  return [
    d.name,
    d.zone,
    ...routesOf(d, schools).map((s) => s.name),
    d.vehicle.type,
    d.vehicle.model,
    archetypeLabel(archetypeOf(d)),
  ]
    .join(' ')
    .toLowerCase();
}

/** Where the volunteer starts from: their first route if they have one, else home. */
function originOf(d: Driver): [number, number] {
  const routeId = d.assignedTo.find((id) => SCHOOL_COORDS[id]);
  return routeId ? SCHOOL_COORDS[routeId] : d.homeCoords;
}

export function NetworkPanel({
  drivers,
  schools,
  statusCtx,
  gapSchool,
  searchQuery,
  onSearchChange,
  onClearGap,
  onAddVolunteer,
  onAssign,
}: {
  drivers: Driver[];
  schools: School[];
  statusCtx: StatusContext;
  gapSchool: School | null;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onClearGap: () => void;
  onAddVolunteer: () => void;
  onAssign: (driverId: string, schoolId: string) => void;
  key?: React.Key;
}) {
  const [filter, setFilter] = useState<NetworkFilter>('all');

  const onRoutes = drivers.filter((d) => d.assignedTo.length > 0).length;

  const matched = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return q ? drivers.filter((d) => searchText(d, schools).includes(q)) : drivers;
  }, [drivers, schools, searchQuery]);

  const counts = useMemo(
    () => ({
      all: matched.length,
      floater: matched.filter((d) => archetypeOf(d) === 'floater').length,
      loyalist: matched.filter((d) => archetypeOf(d) === 'loyalist').length,
    }),
    [matched],
  );

  const gapCoords = gapSchool ? SCHOOL_COORDS[gapSchool.id] : null;

  const list = useMemo(() => {
    const filtered = filter === 'all' ? matched : matched.filter((d) => archetypeOf(d) === filter);
    if (!gapCoords) return filtered.map((d) => ({ driver: d, distance: null as number | null }));
    return filtered
      .map((d) => {
        const [lat, lng] = originOf(d);
        return { driver: d, distance: getDistance(gapCoords[0], gapCoords[1], lat, lng) as number | null };
      })
      .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
  }, [matched, filter, gapCoords]);

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      style={{ zIndex: Z.mapChrome }}
      aria-labelledby="network-title"
      className="absolute right-6 top-24 bottom-6 w-[420px] max-w-[calc(100vw-3rem)] glass-light rounded-2xl flex flex-col overflow-hidden text-[#141414]"
    >
      <div className="px-4 pt-4 pb-3 space-y-3 border-b border-[#141414]/[0.06]">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 id="network-title" className="text-[14px] font-semibold tracking-[-0.03em]">
              Volunteer Network
            </h2>
            <p className="text-[12px] text-[#141414]/65 tabular-nums">
              {drivers.length} volunteers · {onRoutes} on routes
            </p>
          </div>
          <button
            type="button"
            onClick={onAddVolunteer}
            aria-label="Add volunteer"
            title="Add volunteer"
            className="h-8 w-8 rounded-full bg-[#0066cc] text-white hover:bg-[#0052a3] shadow-xs flex items-center justify-center transition-all duration-200 active:scale-[0.98] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#0066cc]/30"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#141414]/50 pointer-events-none" aria-hidden="true" />
          <input
            type="search"
            aria-label="Search volunteers"
            placeholder="Search name, school, vehicle…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-9 rounded-full bg-[#F8F9FA] border border-[#141414]/[0.06] pl-9 pr-3 text-[13px] text-[#141414] placeholder:text-[#141414]/50 outline-none focus-visible:ring-2 focus-visible:ring-[#0066cc]/30"
          />
        </div>

        <SegmentedControl<NetworkFilter>
          label="Filter volunteers"
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: <span className="tabular-nums">All ({counts.all})</span> },
            { value: 'floater', label: <span className="tabular-nums">Flexible Floaters ({counts.floater})</span> },
            { value: 'loyalist', label: <span className="tabular-nums">Fixed Loyalists ({counts.loyalist})</span> },
          ]}
        />

        {gapSchool && (
          <div className="surface-inset rounded-xl flex items-center gap-2 pl-3 pr-1 py-1">
            <MapPin className="w-4 h-4 text-red-600 shrink-0" aria-hidden="true" />
            <span className="text-[12.5px] leading-snug min-w-0 flex-1 py-1">
              Finding a driver for <span className="font-semibold">{gapSchool.name}</span>
              <span className="text-[#141414]/65 tabular-nums"> · {gapSchool.day} {gapSchool.time}</span>
            </span>
            <button
              type="button"
              onClick={onClearGap}
              aria-label="Stop finding a driver"
              className="h-8 w-8 rounded-full flex items-center justify-center text-[#141414]/65 hover:text-[#141414] hover:bg-black/[0.04] transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#0066cc]/30"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
        {list.length === 0 ? (
          <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-center gap-1.5">
            <Users className="w-6 h-6 text-[#141414]/25" aria-hidden="true" />
            <div className="text-[13px] font-semibold">No volunteers match</div>
            <div className="text-[12px] text-[#141414]/65">Try a different search or filter.</div>
          </div>
        ) : (
          list.map(({ driver, distance }) => (
            <VolunteerCard
              key={driver.id}
              driver={driver}
              schools={schools}
              statusCtx={statusCtx}
              gapSchool={gapSchool}
              distanceToGap={distance}
              onAssign={onAssign}
            />
          ))
        )}
      </div>
    </motion.aside>
  );
}
