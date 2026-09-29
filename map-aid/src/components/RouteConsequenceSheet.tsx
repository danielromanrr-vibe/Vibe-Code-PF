import React, { useMemo } from 'react';
import { AlertTriangle, ArrowRightLeft, Car, Clock, Layers, UserPlus } from 'lucide-react';
import type { Driver, School } from '../types';
import { PACKS_PER_ROUTE } from '../types';
import { applyAssignment, type AssignMode } from '../lib/assign';
import { getCoverageStats, getSchoolStatus, type StatusContext } from '../lib/status';
import {
  firstName,
  hasTrunkSpace,
  maxRoutes,
  MIN_GAP_MINUTES,
  minutesBetween,
  packsCapacity,
  routesOf,
  vehicleLabel,
} from '../lib/volunteer';
import { Button, Eyebrow, IconStat, Pill, Sheet } from './ui';
import { VolunteerActions } from './VolunteerActions';

export function PackSegments({ total, filled, tone }: { total: number; filled: number; tone: 'good' | 'risk' }) {
  return (
    <div className="flex gap-1" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`h-2 w-8 rounded-full ${
            i < filled ? (tone === 'risk' ? 'bg-amber-500' : 'bg-[#0066cc]') : 'bg-[#141414]/[0.08]'
          }`}
        />
      ))}
    </div>
  );
}

function RouteLine({ label, school, pill }: { label: string; school: School; pill: React.ReactNode; key?: React.Key }) {
  return (
    <div className="grid grid-cols-[92px_1fr_auto] items-center gap-2 py-2 border-b border-[#141414]/[0.06] last:border-0">
      <span className="text-[12px] text-[#141414]/65">{label}</span>
      <span className="min-w-0">
        <span className="block text-[13px] font-medium truncate">{school.name}</span>
        <span className="block text-[12px] text-[#141414]/65 tabular-nums">{school.day} · {school.time}</span>
      </span>
      {pill}
    </div>
  );
}

export function RouteConsequenceSheet({
  driver,
  school,
  schools,
  drivers,
  statusCtx,
  mode,
  onModeChange,
  onCancel,
  onConfirm,
}: {
  driver: Driver;
  school: School;
  schools: School[];
  drivers: Driver[];
  statusCtx: StatusContext;
  mode: AssignMode;
  onModeChange: (mode: AssignMode) => void;
  onCancel: () => void;
  onConfirm: (mode: AssignMode) => void;
  key?: React.Key;
}) {
  const name = firstName(driver);
  const currentRoutes = routesOf(driver, schools);
  const trunkFull = currentRoutes.length > 0 && !hasTrunkSpace(driver);
  const view: 'fresh' | 'stack' | 'trunk-full' | 'swap' =
    mode === 'swap' ? 'swap' : trunkFull ? 'trunk-full' : currentRoutes.length === 0 ? 'fresh' : 'stack';

  const preview = useMemo(() => {
    const before = getCoverageStats(schools, drivers, statusCtx);
    const next = view === 'trunk-full' ? null : applyAssignment({ schools, drivers }, mode, driver.id, school.id);
    if (!next) return { before, after: before, newGaps: [] as School[] };
    const after = getCoverageStats(next.schools, next.drivers, statusCtx);
    const newGaps = next.schools.filter(
      (s) =>
        getSchoolStatus(s, next.drivers, statusCtx) === 'gap' &&
        getSchoolStatus(schools.find((o) => o.id === s.id)!, drivers, statusCtx) !== 'gap',
    );
    return { before, after, newGaps };
  }, [schools, drivers, statusCtx, mode, view, driver.id, school.id]);

  const capacity = packsCapacity(driver);
  const routesAfter = view === 'swap' ? 1 : currentRoutes.length + (view === 'trunk-full' ? 0 : 1);
  const loadAfter = routesAfter * PACKS_PER_ROUTE;
  const fitCopy =
    view === 'trunk-full'
      ? `${name}’s vehicle is full (${currentRoutes.length * PACKS_PER_ROUTE} of ${capacity} packs).`
      : loadAfter <= capacity / 2
        ? 'Fits comfortably in vehicle.'
        : loadAfter === capacity
          ? 'Fits in vehicle — trunk will be full after this route.'
          : 'Fits in vehicle.';

  const tightStop =
    view === 'stack'
      ? currentRoutes
          .map((r) => ({ r, gap: minutesBetween(r, school) }))
          .find((x) => x.gap !== null && x.gap <= MIN_GAP_MINUTES)
      : undefined;

  const title =
    view === 'fresh'
      ? `Assign ${name} to ${school.name}?`
      : view === 'swap'
        ? `Move ${name} to ${school.name}?`
        : view === 'trunk-full'
          ? `${name} can’t take another route`
          : `Add an additional route for ${name}?`;
  const subtitle =
    view === 'fresh'
      ? `${name} isn’t driving a route this week yet.`
      : view === 'swap'
        ? `${name} leaves their current route. That school opens up.`
        : view === 'trunk-full'
          ? 'Their vehicle is already carrying a full load.'
          : `Nothing ${name} covers today will change.`;
  const TitleIcon = view === 'swap' ? ArrowRightLeft : view === 'fresh' ? UserPlus : view === 'trunk-full' ? AlertTriangle : Layers;

  const newGapCount = preview.newGaps.length;

  return (
    <Sheet onClose={onCancel} labelledBy="consequence-title" className="max-w-[440px]">
      <div className="p-5 flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              view === 'trunk-full' ? 'bg-amber-50 text-amber-700' : view === 'swap' ? 'bg-red-50 text-red-600' : 'bg-[#0066cc]/10 text-[#0066cc]'
            }`}
          >
            <TitleIcon className="w-4 h-4" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h2 id="consequence-title" className="text-[17px] font-semibold tracking-[-0.03em] leading-snug">
              {title}
            </h2>
            <p className="text-[12px] text-[#141414]/65 mt-0.5">{subtitle}</p>
          </div>
        </div>

        <div>
          {currentRoutes.map((r) => (
            <RouteLine
              key={r.id}
              label="Current route"
              school={r}
              pill={
                view === 'swap' ? (
                  <Pill tone="gap">Becomes a gap</Pill>
                ) : (
                  <Pill tone="good">Stays covered</Pill>
                )
              }
            />
          ))}
          <RouteLine
            label={currentRoutes.length === 0 ? 'Route' : view === 'swap' ? 'New route' : '+ Additional'}
            school={school}
            pill={view === 'trunk-full' ? <Pill tone="neutral">Still open</Pill> : <Pill tone="info">Newly covered</Pill>}
          />
        </div>

        <div className={`p-3 flex flex-col gap-2 ${view === 'trunk-full' ? 'rounded-xl bg-amber-50 border border-amber-200' : 'surface-inset'}`}>
          <Eyebrow>Capacity check</Eyebrow>
          <IconStat icon={Car} label="Vehicle" value={vehicleLabel(driver)} className="text-[#141414]" />
          <div className="flex items-center gap-2.5">
            <PackSegments total={maxRoutes(driver)} filled={Math.min(routesAfter, maxRoutes(driver))} tone={view === 'trunk-full' ? 'risk' : 'good'} />
            <span className="text-[12px] font-medium tabular-nums">
              Total load: {routesAfter} {routesAfter === 1 ? 'route' : 'routes'} · {Math.min(loadAfter, capacity)} of {capacity} packs
            </span>
          </div>
          <p className={`text-[12px] ${view === 'trunk-full' ? 'text-amber-800 font-medium' : 'text-[#141414]/65'}`}>{fitCopy}</p>
        </div>

        {tightStop ? (
          <div className="flex items-center gap-2 text-[12px]">
            <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" aria-hidden="true" />
            <Pill tone="risk">Timing check</Pill>
            <span className="text-[#141414]/78">
              Only {tightStop.gap} min between stops — confirm {name} can make both.
            </span>
          </div>
        ) : null}

        {view !== 'trunk-full' ? (
          <div className="rounded-xl border border-[#141414]/[0.08] p-3 flex flex-col gap-1">
            <Eyebrow>Coverage</Eyebrow>
            <div className="flex items-center justify-between gap-2 text-[13px]">
              <span>
                Confirmed routes{' '}
                <span className="font-semibold tabular-nums">
                  {preview.before.confirmed} → {preview.after.confirmed}
                </span>{' '}
                <span className="text-[#141414]/65 tabular-nums">of {preview.after.total}</span>
              </span>
              {newGapCount === 0 ? (
                <Pill tone="good">No new gaps created</Pill>
              ) : (
                <Pill tone="gap">
                  {newGapCount} new {newGapCount === 1 ? 'gap' : 'gaps'}
                </Pill>
              )}
            </div>
            {newGapCount > 0 ? (
              <p className="text-[12px] text-red-700">{preview.newGaps.map((s) => s.name).join(', ')} will become a gap.</p>
            ) : null}
          </div>
        ) : null}

        <VolunteerActions driver={driver} variant="quiet" contextSchoolId={school.id} />

        <div className="flex items-center justify-between gap-2 pt-1">
          <div>
            {view === 'trunk-full' ? (
              <button
                type="button"
                data-autofocus
                onClick={() => onModeChange('swap')}
                className="text-[13px] font-medium text-[#0066cc] hover:text-[#0052a3] rounded-full px-1 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#0066cc]/30"
              >
                Swap instead…
              </button>
            ) : view === 'swap' && trunkFull ? (
              <button
                type="button"
                onClick={() => onModeChange('stack')}
                className="text-[13px] font-medium text-[#141414]/65 hover:text-[#141414] rounded-full px-1 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#0066cc]/30"
              >
                Back
              </button>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="quiet" onClick={onCancel}>
              Cancel
            </Button>
            {view === 'swap' ? (
              <Button variant="destructive" data-autofocus onClick={() => onConfirm('swap')}>
                Confirm Swap
              </Button>
            ) : view === 'trunk-full' ? (
              <Button variant="primary" disabled>
                Can’t add route
              </Button>
            ) : (
              <Button variant="primary" data-autofocus onClick={() => onConfirm(mode)}>
                {view === 'fresh' ? 'Confirm Assignment' : 'Confirm Additional Route'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Sheet>
  );
}
