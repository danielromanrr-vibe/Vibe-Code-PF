import React from 'react';
import { AlertCircle, Car, Search, Users } from 'lucide-react';
import type { Driver, School } from '../types';
import type { SchoolStatus, StatusContext } from '../lib/status';
import {
  archetypeLabel,
  archetypeOf,
  firstName,
  getVolunteerStatus,
  hasTrunkSpace,
  maxRoutes,
  routesOf,
  shortSchoolName,
  tenureLabel,
  vehicleLabel,
  VOLUNTEER_STATUS_LABEL,
  VOLUNTEER_STATUS_TONE,
} from '../lib/volunteer';
import { Avatar, Button, IconStat, Pill, type PillTone } from './ui';
import { VolunteerActions } from './VolunteerActions';

export function TrunkPill({ driver }: { driver: Driver }) {
  if (driver.assignedTo.length === 0 && maxRoutes(driver) === 1) return <Pill tone="neutral">Fits 1 school</Pill>;
  if (hasTrunkSpace(driver)) return <Pill tone="good">Has trunk space for 2nd route</Pill>;
  return <Pill tone="risk">Trunk full</Pill>;
}

interface SchoolPopupCardProps {
  school: School;
  status: SchoolStatus;
  driver?: Driver;
  schools: School[];
  statusCtx: StatusContext;
  tier: 1 | 2 | 3 | null;
  dist: number;
  gapSchool?: School;
  onRequestAssignment: (driverId: string, schoolId: string) => void;
  onFindVolunteer: (schoolId: string) => void;
  onReviewNearby: (schoolId: string) => void;
  onOpenProfile: (driverId: string) => void;
}

export function SchoolPopupCard({
  school,
  status,
  driver,
  schools,
  statusCtx,
  tier,
  dist,
  gapSchool,
  onRequestAssignment,
  onFindVolunteer,
  onReviewNearby,
  onOpenProfile,
}: SchoolPopupCardProps) {
  const isCandidate = !!tier && !!gapSchool;
  const gapShort = gapSchool ? shortSchoolName(gapSchool.name) : '';

  let pill: { tone: PillTone; label: string };
  if (isCandidate) pill = { tone: 'good', label: `Tier ${tier} candidate` };
  else if (status === 'gap') pill = statusCtx.isRSVPRequested ? { tone: 'gap', label: 'Route open' } : { tone: 'neutral', label: 'Awaiting RSVPs' };
  else if (status === 'at-risk') pill = { tone: 'risk', label: 'At risk' };
  else pill = { tone: 'good', label: 'Covered' };

  const otherRoutes = driver ? routesOf(driver, schools).filter((r) => r.id !== school.id) : [];
  const volunteerStatus = driver ? getVolunteerStatus(driver, statusCtx) : null;

  return (
    <div className="w-[300px] p-4 text-[#141414] font-sans">
      <div className="flex items-center justify-between gap-2">
        <Pill tone={pill.tone}>{pill.label}</Pill>
        <span className="text-[12px] font-medium text-[#141414]/65 tabular-nums">
          {school.day} · {school.time}
        </span>
      </div>

      <h3 className="mt-2.5 text-[15px] font-semibold tracking-[-0.03em] leading-snug">{school.name}</h3>
      <p className="text-[12px] text-[#141414]/65 mt-0.5">
        {school.zone}
        {isCandidate ? ` · ${dist.toFixed(1)} mi from ${gapShort}` : ''}
      </p>

      {driver ? (
        <div className="surface-inset mt-3 p-3 flex flex-col gap-2.5">
          <div className="flex items-start gap-2.5">
            <Avatar name={driver.name} size={32} />
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-semibold tracking-[-0.02em] truncate">{driver.name}</div>
              <div className="text-[12px] text-[#141414]/65 leading-snug">
                {tenureLabel(driver.tenureMonths)} · {archetypeLabel(archetypeOf(driver))}
              </div>
            </div>
            {volunteerStatus ? (
              <Pill tone={VOLUNTEER_STATUS_TONE[volunteerStatus]}>{VOLUNTEER_STATUS_LABEL[volunteerStatus]}</Pill>
            ) : null}
          </div>

          <IconStat icon={Car} label="Vehicle" value={vehicleLabel(driver)} />
          <div>
            <TrunkPill driver={driver} />
          </div>
          {otherRoutes.length > 0 ? (
            <p className="text-[12px] text-[#141414]/65">
              Also covers:{' '}
              {otherRoutes.map((r) => `${shortSchoolName(r.name)} (${r.day} ${r.time})`).join(', ')}
            </p>
          ) : null}
          {status === 'at-risk' ? (
            <p className="text-[12px] font-medium text-amber-700">{firstName(driver)} hasn't confirmed</p>
          ) : null}

          <VolunteerActions driver={driver} variant="compact" contextSchoolId={gapSchool?.id ?? school.id} />
        </div>
      ) : (
        <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[13px] font-semibold text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            No volunteer assigned yet
          </div>
          <p className="text-[12px] text-[#141414]/65">
            {statusCtx.isRSVPRequested
              ? 'Nearby covered routes are ringed on the map by distance.'
              : 'RSVPs haven’t gone out yet for this week.'}
          </p>
        </div>
      )}

      <div className="mt-3 flex flex-col gap-1.5">
        {isCandidate && driver ? (
          hasTrunkSpace(driver) ? (
            <Button variant="primary" block data-autofocus onClick={() => onRequestAssignment(driver.id, gapSchool!.id)}>
              Add {gapShort} to {firstName(driver)}’s route
            </Button>
          ) : (
            <>
              <Button variant="primary" block disabled>
                Trunk full
              </Button>
              <Button variant="quiet" block onClick={() => onRequestAssignment(driver.id, gapSchool!.id)}>
                Swap instead…
              </Button>
            </>
          )
        ) : driver ? (
          <Button variant="secondary" block icon={Users} onClick={() => onOpenProfile(driver.id)}>
            View volunteer profile
          </Button>
        ) : (
          <>
            <Button variant="primary" block icon={Search} onClick={() => onFindVolunteer(school.id)}>
              Find a volunteer
            </Button>
            <Button variant="quiet" block onClick={() => onReviewNearby(school.id)}>
              Review nearby routes
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
