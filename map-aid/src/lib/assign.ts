import type { Driver, School } from '../types';
import { hasTrunkSpace } from './volunteer';

export type AssignMode = 'fresh' | 'stack' | 'swap';

export interface Roster {
  schools: School[];
  drivers: Driver[];
}

function detachPreviousDriver(drivers: Driver[], school: School, keepDriverId: string): Driver[] {
  if (!school.assignedDriver) return drivers;
  return drivers.map((d) =>
    d.name === school.assignedDriver && d.id !== keepDriverId
      ? { ...d, assignedTo: d.assignedTo.filter((id) => id !== school.id) }
      : d,
  );
}

/** Appends the school to the driver's route. Nothing they already cover changes. */
export function applyStack(roster: Roster, driverId: string, schoolId: string): Roster | null {
  const driver = roster.drivers.find((d) => d.id === driverId);
  const school = roster.schools.find((s) => s.id === schoolId);
  if (!driver || !school) return null;
  if (driver.assignedTo.includes(schoolId)) return null;
  if (driver.assignedTo.length > 0 && !hasTrunkSpace(driver)) return null;

  const drivers = detachPreviousDriver(roster.drivers, school, driverId).map((d) =>
    d.id === driverId ? { ...d, assignedTo: [...d.assignedTo, schoolId] } : d,
  );
  const schools = roster.schools.map((s) =>
    s.id === schoolId ? { ...s, assignedDriver: driver.name, autoAssigned: false } : s,
  );
  return { schools, drivers };
}

/** Moves the driver off every current route onto this one. Their old schools open up. */
export function applySwap(roster: Roster, driverId: string, schoolId: string): Roster | null {
  const driver = roster.drivers.find((d) => d.id === driverId);
  const school = roster.schools.find((s) => s.id === schoolId);
  if (!driver || !school) return null;

  const drivers = detachPreviousDriver(roster.drivers, school, driverId).map((d) =>
    d.id === driverId ? { ...d, assignedTo: [schoolId] } : d,
  );
  const schools = roster.schools.map((s) => {
    if (s.id === schoolId) return { ...s, assignedDriver: driver.name, autoAssigned: false };
    if (s.assignedDriver === driver.name) return { ...s, assignedDriver: null, autoAssigned: false };
    return s;
  });
  return { schools, drivers };
}

export function applyAssignment(roster: Roster, mode: AssignMode, driverId: string, schoolId: string): Roster | null {
  return mode === 'swap' ? applySwap(roster, driverId, schoolId) : applyStack(roster, driverId, schoolId);
}
