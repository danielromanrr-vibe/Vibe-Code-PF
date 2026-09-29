import { PACKS_PER_ROUTE, VEHICLE_PACK_CAPACITY, type Archetype, type Driver, type School } from '../types';
import type { StatusContext } from './status';

export const MIN_GAP_MINUTES = 30;

export const DAY_FULL: Record<string, string> = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
  Sun: 'Sunday',
};

export function packsCapacity(d: Driver): number {
  return VEHICLE_PACK_CAPACITY[d.vehicle.type];
}

export function packsLoad(d: Driver, extraRoutes = 0): number {
  return (d.assignedTo.length + extraRoutes) * PACKS_PER_ROUTE;
}

export function maxRoutes(d: Driver): number {
  return Math.floor(packsCapacity(d) / PACKS_PER_ROUTE);
}

export function hasTrunkSpace(d: Driver): boolean {
  return packsLoad(d, 1) <= packsCapacity(d);
}

export function tenureLabel(months: number): string {
  if (months <= 1) return 'New volunteer · 1st month';
  if (months < 12) return `${months} mo tenure`;
  const years = Math.floor(months / 12);
  return `${years} ${years === 1 ? 'yr' : 'yrs'} tenure`;
}

export function archetypeOf(d: Driver): Archetype | null {
  if (d.incomplete || d.tag === 'no-data') return null;
  return d.tag === 'fixed' ? 'loyalist' : 'floater';
}

export function archetypeLabel(archetype: Archetype | null): string {
  if (archetype === 'loyalist') return 'Fixed Route Loyalist';
  if (archetype === 'floater') return 'Flexible Floater';
  return 'Profile incomplete';
}

export function firstName(d: Driver): string {
  // Generated roster names ("Volunteer 13") have no first name to shorten to.
  if (/^Volunteer \d+$/.test(d.name)) return d.name;
  return d.name.split(' ')[0] ?? d.name;
}

export function shortSchoolName(name: string): string {
  return name.replace(/ Elementary| High School| Middle School| K-8/gi, '').trim();
}

export function routesOf(d: Driver, schools: School[]): School[] {
  return d.assignedTo.map((id) => schools.find((s) => s.id === id)).filter((s): s is School => !!s);
}

export function anchorLabel(d: Driver, schools: School[]): string {
  const routes = routesOf(d, schools);
  if (routes.length === 0) return d.available ? 'Available for assignment' : 'Not available this week';
  if (routes.length === 1) return routes[0].name;
  return `${routes.map((r) => r.name).join(' + ')} (${routes.length} routes)`;
}

export function vehicleLabel(d: Driver): string {
  return `${d.vehicle.model} · ${d.vehicle.type} · ${packsCapacity(d)} packs`;
}

export type VolunteerStatus = 'confirmed' | 'pending' | 'at-risk' | 'declined' | 'unavailable';

export function getVolunteerStatus(d: Driver, ctx: StatusContext): VolunteerStatus {
  if (!d.available) return 'unavailable';
  if (d.RSVPStatus === 'yes') return 'confirmed';
  // A manual assignment after a "no" means Hoyt reached them and they agreed.
  if (d.assignedTo.length > 0 && d.RSVPStatus === 'no') return 'confirmed';
  if (d.RSVPStatus === 'no') return 'declined';
  const settled = ctx.isRSVPRequested && !ctx.isAnimatingRSVP;
  if (settled && d.assignedTo.length > 0) return 'at-risk';
  return 'pending';
}

export const VOLUNTEER_STATUS_LABEL: Record<VolunteerStatus, string> = {
  confirmed: 'Confirmed',
  pending: 'Pending',
  'at-risk': 'At risk',
  declined: 'Declined',
  unavailable: 'Unavailable this week',
};

export const VOLUNTEER_STATUS_TONE = {
  confirmed: 'good',
  pending: 'neutral',
  'at-risk': 'risk',
  declined: 'gap',
  unavailable: 'neutral',
} as const;

function digits(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function formatPhone(d: Driver): string {
  const raw = digits(d.phone);
  const local = raw.length === 11 && raw.startsWith('1') ? raw.slice(1) : raw;
  if (local.length !== 10) return d.phone;
  return `(${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6)}`;
}

function e164(d: Driver): string {
  const raw = digits(d.phone);
  return raw.length === 10 ? `+1${raw}` : `+${raw}`;
}

export function telHref(d: Driver): string {
  return `tel:${e164(d)}`;
}

export function mailtoHref(d: Driver, subject?: string, body?: string): string {
  const params: string[] = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${d.email}${params.length ? `?${params.join('&')}` : ''}`;
}

export function smsHref(d: Driver, body: string): string {
  return `sms:${e164(d)}?&body=${encodeURIComponent(body)}`;
}

export function buildDraft(d: Driver, school?: School | null): string {
  if (school) {
    const day = DAY_FULL[school.day] ?? school.day;
    return `Hi ${firstName(d)}! Quick check from Backpack Brigade: could you cover ${school.name} on ${day} at ${school.time}? Let me know!`;
  }
  return `Hi ${firstName(d)}! Quick check from Backpack Brigade: are you available to help cover a route this week? Let me know!`;
}

/** Minutes since midnight for "9:15 AM". */
export function parseTime(time: string): number | null {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  let hours = Number(match[1]) % 12;
  if (match[3].toUpperCase() === 'PM') hours += 12;
  return hours * 60 + Number(match[2]);
}

export function minutesBetween(a: School, b: School): number | null {
  if (a.day !== b.day) return null;
  const ta = parseTime(a.time);
  const tb = parseTime(b.time);
  if (ta === null || tb === null) return null;
  return Math.abs(ta - tb);
}
