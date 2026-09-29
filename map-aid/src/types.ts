export interface School {
  id: string;
  name: string;
  day: string;
  time: string;
  zone: string;
  assignedDriver: string | null;
  emailSent: boolean;
  autoAssigned: boolean;
}

export type OperationalMode = 'Standard' | 'Network' | 'Status' | 'Recovery';

export type RSVPStatus = 'pending' | 'yes' | 'no';
export type Level = 'Low' | 'Medium' | 'High';

export type VehicleType = 'Compact' | 'Sedan' | 'Hatchback' | 'SUV' | 'Van' | 'Truck';
export const VEHICLE_TYPES: readonly VehicleType[] = ['Compact', 'Sedan', 'Hatchback', 'SUV', 'Van', 'Truck'];
export const PACKS_PER_ROUTE = 20;
// Single source of truth for physical capacity. Product owner may tune these.
export const VEHICLE_PACK_CAPACITY: Record<VehicleType, number> = {
  Compact: 20,
  Sedan: 20,
  Hatchback: 20,
  SUV: 40,
  Van: 40,
  Truck: 40,
};
export type Archetype = 'loyalist' | 'floater';

export interface Driver {
  id: string;
  name: string;
  available: boolean;
  tag: 'flexible' | 'fixed' | 'no-data';
  incomplete: boolean;
  zone: string;
  pref: string;
  vehicle: { type: VehicleType; model: string };
  tenureMonths: number;
  assignedTo: string[];
  profileSchoolId: string;
  RSVPStatus: RSVPStatus;
  email: string;
  phone: string;
  homeCoords: [number, number];
  flexibility: Level;
  reliability: Level;
  notes: string | null;
  history: any[];
}

export type TileSource = 'canvas' | 'dark' | 'satellite' | 'topo' | 'streets';
