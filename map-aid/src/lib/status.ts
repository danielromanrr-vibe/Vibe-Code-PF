import type { Driver, School } from '../types';

export type SchoolStatus = 'covered' | 'gap' | 'at-risk';

export interface StatusContext {
  isRSVPRequested: boolean;
  isAnimatingRSVP: boolean;
}

export function profiledDriverOf(school: School, drivers: Driver[]): Driver | undefined {
  return drivers.find((d) => d.profileSchoolId === school.id);
}

export function assignedDriverOf(school: School, drivers: Driver[]): Driver | undefined {
  if (!school.assignedDriver) return undefined;
  return drivers.find((d) => d.name === school.assignedDriver);
}

/**
 * A manual assignment is always covered: Hoyt confirmed it himself.
 * Only an auto-assignment can be at risk, and only once RSVPs have settled.
 * Before auto-assignment runs, a "yes" from the profiled driver counts as
 * provisional coverage, unless that driver is already driving somewhere else.
 */
export function getSchoolStatus(school: School, drivers: Driver[], ctx: StatusContext): SchoolStatus {
  if (school.assignedDriver) {
    if (!school.autoAssigned) return 'covered';
    const settled = ctx.isRSVPRequested && !ctx.isAnimatingRSVP;
    const driver = assignedDriverOf(school, drivers);
    return settled && driver?.RSVPStatus !== 'yes' ? 'at-risk' : 'covered';
  }
  const profiled = profiledDriverOf(school, drivers);
  if (profiled?.RSVPStatus === 'yes' && profiled.assignedTo.length === 0) return 'covered';
  return 'gap';
}

export interface CoverageStats {
  total: number;
  assigned: number;
  confirmed: number;
  unresolved: number;
}

export function getCoverageStats(schools: School[], drivers: Driver[], ctx: StatusContext): CoverageStats {
  const total = schools.length;
  const confirmed = schools.filter((s) => getSchoolStatus(s, drivers, ctx) !== 'gap').length;
  return {
    total,
    assigned: schools.filter((s) => s.assignedDriver).length,
    confirmed,
    unresolved: Math.max(0, total - confirmed),
  };
}
