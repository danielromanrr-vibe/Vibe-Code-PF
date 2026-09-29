import React from 'react';
import { Anchor, Car, Mail, Phone, Shuffle, Truck, Wrench, X } from 'lucide-react';
import type { Driver, School } from '../types';
import type { StatusContext } from '../lib/status';
import {
  archetypeLabel,
  archetypeOf,
  formatPhone,
  getVolunteerStatus,
  maxRoutes,
  packsCapacity,
  packsLoad,
  routesOf,
  telHref,
  tenureLabel,
  VOLUNTEER_STATUS_LABEL,
  VOLUNTEER_STATUS_TONE,
} from '../lib/volunteer';
import { Avatar, Button, Eyebrow, IconStat, Pill, Sheet } from './ui';
import { PackSegments } from './RouteConsequenceSheet';
import { TrunkPill } from './SchoolPopupCard';
import { VolunteerActions } from './VolunteerActions';

const FLEXIBILITY_COPY: Record<Driver['flexibility'], string> = {
  High: 'Can cover routes in multiple zones and is available on short notice.',
  Medium: 'Open to nearby zones with 24h notice.',
  Low: 'Strict adherence to preferred zone.',
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="pt-4 mt-4 border-t border-[#141414]/[0.06] first:border-0 first:pt-0 first:mt-0">
      <Eyebrow className="mb-2">{title}</Eyebrow>
      {children}
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1">
      <span className="text-[12px] text-[#141414]/65 shrink-0">{label}</span>
      <span className="text-[13px] text-right min-w-0">{children}</span>
    </div>
  );
}

export function ProfileSheet({
  driver,
  schools,
  statusCtx,
  onClose,
  onFixRouteRisk,
}: {
  driver: Driver;
  schools: School[];
  statusCtx: StatusContext;
  onClose: () => void;
  onFixRouteRisk: (schoolId: string) => void;
  key?: React.Key;
}) {
  const status = getVolunteerStatus(driver, statusCtx);
  const routes = routesOf(driver, schools);
  const archetype = archetypeOf(driver);
  const homeBase = driver.profileSchoolId ? schools.find((s) => s.id === driver.profileSchoolId) : undefined;
  const riskTarget = driver.assignedTo[0] ?? driver.profileSchoolId;
  const VehicleIcon = driver.vehicle.type === 'Truck' ? Truck : Car;
  const titleId = `profile-title-${driver.id}`;

  return (
    <Sheet onClose={onClose} labelledBy={titleId} className="max-w-lg">
      <div className="p-6">
        <div className="flex items-start gap-3">
          <Avatar name={driver.name} size={44} />
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="text-[17px] font-semibold tracking-[-0.02em] leading-tight">
              {driver.name}
            </h2>
            <p className="text-[12px] text-[#141414]/65 mt-0.5">
              {tenureLabel(driver.tenureMonths)} · {driver.zone}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <Pill tone={VOLUNTEER_STATUS_TONE[status]}>{VOLUNTEER_STATUS_LABEL[status]}</Pill>
              {statusCtx.isRSVPRequested && (status === 'at-risk' || (status === 'confirmed' && driver.RSVPStatus === 'no')) && (
                <Pill tone="neutral">RSVP: {driver.RSVPStatus === 'yes' ? 'Yes' : driver.RSVPStatus === 'no' ? 'No' : 'Pending'}</Pill>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close profile"
            className="h-8 w-8 -mr-1 -mt-1 rounded-full flex items-center justify-center text-[#141414]/65 hover:text-[#141414] hover:bg-black/[0.04] transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#0066cc]/30"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-5">
          <Section title="Assignment">
            {routes.length === 0 ? (
              <p className="text-[13px] font-semibold">{driver.available ? 'Available for assignment' : 'Not available this week'}</p>
            ) : (
              <div className="space-y-1">
                {routes.map((r) => (
                  <div key={r.id} className="flex items-baseline justify-between gap-3">
                    <span className="text-[13px] font-semibold truncate">{r.name}</span>
                    <span className="text-[12px] text-[#141414]/65 tabular-nums whitespace-nowrap">
                      {r.day} · {r.time}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {homeBase && !driver.assignedTo.includes(homeBase.id) && <p className="text-[12px] text-[#141414]/65 mt-1.5">Home base: {homeBase.name}</p>}
          </Section>

          <Section title="Vehicle">
            <div className="flex items-center justify-between gap-2">
              <IconStat icon={VehicleIcon} label="Vehicle" value={`${driver.vehicle.model || 'Model not set'} · ${driver.vehicle.type}`} />
              <TrunkPill driver={driver} />
            </div>
            <div className="flex items-center gap-3 mt-2.5">
              <PackSegments total={maxRoutes(driver)} filled={driver.assignedTo.length} tone="good" />
              <span className="text-[12px] text-[#141414]/78 tabular-nums">
                {packsLoad(driver)} of {packsCapacity(driver)} packs used
              </span>
            </div>
          </Section>

          <Section title="Contact">
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
              <IconStat icon={Phone} label={`Call ${driver.name}`} href={telHref(driver)} value={<span className="tabular-nums">{formatPhone(driver)}</span>} />
              {driver.email ? (
                <IconStat icon={Mail} label={`Email ${driver.name}`} href={`mailto:${driver.email}`} value={driver.email} />
              ) : (
                <IconStat icon={Mail} label="No email on file" value="No email on file" />
              )}
            </div>
          </Section>

          <Section title="Profile">
            <Row label="Archetype">
              <span className="inline-flex items-center gap-1">
                {archetype === 'loyalist' && <Anchor className="w-3 h-3" aria-hidden="true" />}
                {archetype === 'floater' && <Shuffle className="w-3 h-3" aria-hidden="true" />}
                {archetypeLabel(archetype)}
              </span>
            </Row>
            <Row label="Reliability">{driver.reliability}</Row>
            <Row label="Flexibility">{driver.flexibility}</Row>
            <p className="text-[12px] text-[#141414]/65 mt-0.5">{FLEXIBILITY_COPY[driver.flexibility]}</p>
          </Section>

          {driver.notes && (
            <Section title="Notes">
              <p className="text-[13px] text-[#141414]/78">“{driver.notes}”</p>
            </Section>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-[#141414]/[0.06] space-y-2">
          <VolunteerActions driver={driver} variant="bar" />
          {status === 'at-risk' && riskTarget && (
            <Button variant="primary" block icon={Wrench} onClick={() => onFixRouteRisk(riskTarget)}>
              Fix Route Risk
            </Button>
          )}
        </div>
      </div>
    </Sheet>
  );
}
