import React from 'react';
import { motion } from 'motion/react';
import { Anchor, Car, Mail, Phone, Plus, Shuffle, Truck } from 'lucide-react';
import type { Driver, School } from '../types';
import type { StatusContext } from '../lib/status';
import {
  archetypeLabel,
  archetypeOf,
  formatPhone,
  getVolunteerStatus,
  hasTrunkSpace,
  routesOf,
  shortSchoolName,
  telHref,
  tenureLabel,
  vehicleLabel,
  VOLUNTEER_STATUS_LABEL,
  VOLUNTEER_STATUS_TONE,
} from '../lib/volunteer';
import { Avatar, Button, IconStat, Pill } from './ui';
import { TrunkPill } from './SchoolPopupCard';
import { useVolunteerActions, VolunteerActions } from './VolunteerActions';

const RELIABILITY_DOT: Record<Driver['reliability'], string> = {
  High: 'bg-emerald-500',
  Medium: 'bg-amber-400',
  Low: 'bg-red-500',
};

function RouteRow({ school, stacked }: { school: School; stacked?: boolean; key?: React.Key }) {
  return (
    <div className={`flex items-baseline justify-between gap-3 min-w-0 ${stacked ? 'pl-4 relative' : ''}`}>
      {stacked && <Plus className="w-3 h-3 absolute left-0 top-[3px] text-[#141414]/50" aria-hidden="true" />}
      <span className="text-[13px] font-semibold tracking-[-0.012em] truncate">{school.name}</span>
      <span className="text-[12px] text-[#141414]/65 tabular-nums whitespace-nowrap">
        {school.day} · {school.time}
      </span>
    </div>
  );
}

export function VolunteerCard({
  driver,
  schools,
  statusCtx,
  gapSchool,
  distanceToGap,
  onAssign,
}: {
  driver: Driver;
  schools: School[];
  statusCtx: StatusContext;
  gapSchool?: School | null;
  distanceToGap?: number | null;
  onAssign: (driverId: string, schoolId: string) => void;
  key?: React.Key;
}) {
  const { openProfile } = useVolunteerActions();
  const status = getVolunteerStatus(driver, statusCtx);
  const archetype = archetypeOf(driver);
  const routes = routesOf(driver, schools);
  const unavailable = status === 'unavailable';
  const VehicleIcon = driver.vehicle.type === 'Truck' ? Truck : Car;
  const showAssign = !!gapSchool && !unavailable && !driver.assignedTo.includes(gapSchool.id);

  return (
    <motion.article
      layout
      aria-label={driver.name}
      className={`bg-white rounded-2xl border border-[#141414]/[0.08] p-3.5 hover:shadow-[var(--shadow-panel)] transition-shadow duration-200 text-[#141414] ${
        unavailable ? 'opacity-70' : ''
      }`}
    >
      {/* Identity & status */}
      <div className="flex items-start gap-3">
        <Avatar name={driver.name} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <button
              type="button"
              onClick={() => openProfile(driver.id)}
              className="text-[14px] font-semibold tracking-[-0.02em] truncate hover:text-[#0066cc] rounded transition-colors duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#0066cc]/30"
              aria-label={`Open profile for ${driver.name}`}
            >
              {driver.name}
            </button>
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${RELIABILITY_DOT[driver.reliability]}`}
              title={`${driver.reliability} reliability`}
              role="img"
              aria-label={`${driver.reliability} reliability`}
            />
          </div>
          <div className="flex flex-wrap items-center gap-x-1 gap-y-0.5 text-[12px] text-[#141414]/65 mt-0.5 min-w-0">
            <span className="whitespace-nowrap">{tenureLabel(driver.tenureMonths)}</span>
            <span aria-hidden="true">·</span>
            {archetype === null ? (
              <Pill tone="neutral">Profile incomplete</Pill>
            ) : (
              <span className="flex items-center gap-1 min-w-0">
                {archetype === 'loyalist' ? (
                  <Anchor className="w-3 h-3 shrink-0" aria-hidden="true" />
                ) : (
                  <Shuffle className="w-3 h-3 shrink-0" aria-hidden="true" />
                )}
                <span className="whitespace-nowrap">{archetypeLabel(archetype)}</span>
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <Pill tone={VOLUNTEER_STATUS_TONE[status]}>{VOLUNTEER_STATUS_LABEL[status]}</Pill>
          {distanceToGap != null && (
            <span className="text-[12px] text-[#141414]/65 tabular-nums">{distanceToGap.toFixed(1)} mi from gap</span>
          )}
        </div>
      </div>

      {/* Assignment anchor */}
      <div className="mt-3 pt-3 border-t border-[#141414]/[0.06] space-y-1">
        {routes.length === 0 ? (
          <div className="flex items-center justify-between gap-3">
            <span className="text-[13px] font-semibold tracking-[-0.012em]">
              {driver.available ? 'Available for assignment' : 'Not available this week'}
            </span>
            {driver.available && hasTrunkSpace(driver) && <Pill tone="good">Open</Pill>}
          </div>
        ) : (
          <>
            <RouteRow school={routes[0]} />
            {routes.slice(1).map((r) => (
              <RouteRow key={r.id} school={r} stacked />
            ))}
            {routes.length > 1 && (
              <div className="flex justify-end pt-0.5">
                <Pill tone="info">{routes.length} routes</Pill>
              </div>
            )}
          </>
        )}
      </div>

      {/* Contact & physical spec */}
      <div className="mt-3 pt-3 border-t border-[#141414]/[0.06] space-y-2">
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
          <IconStat icon={Phone} label={`Call ${driver.name}`} href={telHref(driver)} value={<span className="tabular-nums">{formatPhone(driver)}</span>} />
          {driver.email ? (
            <IconStat icon={Mail} label={`Email ${driver.name}`} href={`mailto:${driver.email}`} value={driver.email} />
          ) : (
            <IconStat icon={Mail} label="No email on file" value="No email on file" />
          )}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5 min-w-0">
          <IconStat icon={VehicleIcon} label="Vehicle" value={vehicleLabel(driver)} className="shrink-0 max-w-full" />
          <span className="shrink-0">
            <TrunkPill driver={driver} />
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-3 pt-3 border-t border-[#141414]/[0.06] space-y-2">
        <VolunteerActions driver={driver} variant="bar" />
        {showAssign && (
          <Button variant="primary" block icon={Plus} onClick={() => onAssign(driver.id, gapSchool!.id)}>
            Assign to {shortSchoolName(gapSchool!.name)}
          </Button>
        )}
      </div>
    </motion.article>
  );
}
