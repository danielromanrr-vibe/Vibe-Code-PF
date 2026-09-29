import type { Driver, Level, School, VehicleType } from './types';

export const HQ_COORDS: [number, number] = [47.5943, -122.3215]; // SODO HQ

export const SCHOOL_COORDS: Record<string, [number, number]> = {
  sc01: [47.5951, -122.1478], sc02: [47.5538, -122.1098], sc03: [47.5787, -122.1534],
  sc04: [47.6204, -122.1612], sc05: [47.6101, -122.1889], sc06: [47.5662, -122.1245],
  sc07: [47.5497, -122.2781], sc08: [47.5706, -122.3058], sc09: [47.6127, -122.2963],
  sc10: [47.5226, -122.2597], sc11: [47.5623, -122.2891], sc12: [47.5988, -122.2940],
  sc13: [47.5980, -122.3221], sc14: [47.5398, -122.3042], sc15: [47.5330, -122.2877],
  sc16: [47.7070, -122.3286], sc17: [47.7214, -122.2885], sc18: [47.7318, -122.3502],
  sc19: [47.7108, -122.3441], sc20: [47.7261, -122.2726], sc21: [47.7151, -122.2783],
  sc22: [47.7063, -122.2625], sc23: [47.5614, -122.3178], sc24: [47.5290, -122.2838],
  sc25: [47.5622, -122.2768], sc26: [47.5964, -122.3089], sc27: [47.7145, -122.3593],
  sc28: [47.6700, -122.3196],
};

export const INITIAL_SCHOOLS: School[] = [
  { id:'sc01', name:'Bellevue High School', day:'Wed', time:'10:00 AM', zone:'Bellevue', assignedDriver:null, emailSent:false, autoAssigned:false },
  { id:'sc02', name:'Eastgate Elementary', day:'Wed', time:'9:15 AM', zone:'East Seattle', assignedDriver:null, emailSent:false, autoAssigned:false },
  { id:'sc03', name:'Tyee Middle School', day:'Wed', time:'9:30 AM', zone:'Bellevue', assignedDriver:null, emailSent:false, autoAssigned:false },
  { id:'sc04', name:'Interlake High School', day:'Wed', time:'8:45 AM', zone:'Bellevue', assignedDriver:null, emailSent:false, autoAssigned:false },
  { id:'sc05', name:'Newport High School', day:'Wed', time:'9:00 AM', zone:'Bellevue', assignedDriver:null, emailSent:false, autoAssigned:false },
  { id:'sc06', name:'Ohlson Elementary', day:'Wed', time:'9:45 AM', zone:'East Seattle', assignedDriver:null, emailSent:false, autoAssigned:false },
  { id:'sc07', name:'South Shore Elementary', day:'Thu', time:'9:30 AM', zone:'South Seattle', assignedDriver:null, emailSent:false, autoAssigned:false },
  { id:'sc08', name:'Beacon Hill Elementary', day:'Thu', time:'9:00 AM', zone:'South Seattle', assignedDriver:null, emailSent:false, autoAssigned:false },
  { id:'sc09', name:'Madrona Elementary', day:'Thu', time:'9:30 AM', zone:'East Seattle', assignedDriver:null, emailSent:false, autoAssigned:false },
  { id:'sc10', name:'Rainier Beach High', day:'Thu', time:'8:45 AM', zone:'South Seattle', assignedDriver:null, emailSent:false, autoAssigned:false },
  { id:'sc11', name:'Hawthorne Elementary', day:'Thu', time:'9:00 AM', zone:'South Seattle', assignedDriver:null, emailSent:false, autoAssigned:false },
  { id:'sc12', name:'Leschi Elementary', day:'Thu', time:'9:15 AM', zone:'Central', assignedDriver:null, emailSent:false, autoAssigned:false },
  { id:'sc13', name:'Washington Middle School', day:'Thu', time:'10:00 AM', zone:'Central', assignedDriver:null, emailSent:false, autoAssigned:false },
  { id:'sc14', name:'Mercer International MS', day:'Thu', time:'9:45 AM', zone:'South Seattle', assignedDriver:null, emailSent:false, autoAssigned:false },
  { id:'sc15', name:'Aki Kurose Middle School', day:'Thu', time:'9:30 AM', zone:'South Seattle', assignedDriver:null, emailSent:false, autoAssigned:false },
  { id:'sc16', name:'Northgate Middle', day:'Fri', time:'9:00 AM', zone:'North Seattle', assignedDriver:null, emailSent:false, autoAssigned:false },
  { id:'sc17', name:'Olympic Hills Elementary', day:'Fri', time:'9:15 AM', zone:'North Seattle', assignedDriver:null, emailSent:false, autoAssigned:false },
  { id:'sc18', name:'Broadview Thomson K-8', day:'Fri', time:'9:30 AM', zone:'North Seattle', assignedDriver:null, emailSent:false, autoAssigned:false },
  { id:'sc19', name:'Licton Springs K-8', day:'Fri', time:'8:45 AM', zone:'North Seattle', assignedDriver:null, emailSent:false, autoAssigned:false },
  { id:'sc20', name:'John Rogers Elementary', day:'Fri', time:'9:00 AM', zone:'North Seattle', assignedDriver:null, emailSent:false, autoAssigned:false },
  { id:'sc21', name:'Cedar Park Elementary', day:'Fri', time:'9:30 AM', zone:'North Seattle', assignedDriver:null, emailSent:false, autoAssigned:false },
  { id:'sc22', name:'Thornton Creek Elementary', day:'Fri', time:'10:00 AM', zone:'North Seattle', assignedDriver:null, emailSent:false, autoAssigned:false },
  { id:'sc23', name:'Denny International MS', day:'Sat', time:'10:00 AM', zone:'South Seattle', assignedDriver:null, emailSent:false, autoAssigned:false },
  { id:'sc24', name:'Cleveland High School', day:'Sat', time:'10:30 AM', zone:'South Seattle', assignedDriver:null, emailSent:false, autoAssigned:false },
  { id:'sc25', name:'Franklin High School', day:'Sat', time:'10:00 AM', zone:'South Seattle', assignedDriver:null, emailSent:false, autoAssigned:false },
  { id:'sc26', name:'Garfield High School', day:'Sat', time:'10:30 AM', zone:'Central', assignedDriver:null, emailSent:false, autoAssigned:false },
  { id:'sc27', name:'Ingraham High School', day:'Sat', time:'11:00 AM', zone:'North Seattle', assignedDriver:null, emailSent:false, autoAssigned:false },
  { id:'sc28', name:'Roosevelt High School', day:'Sat', time:'10:00 AM', zone:'North Seattle', assignedDriver:null, emailSent:false, autoAssigned:false },
];

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const MODELS: Record<VehicleType, readonly string[]> = {
  Compact: ['Mini Cooper', 'Fiat 500', 'Chevrolet Spark'],
  Sedan: ['Toyota Camry', 'Honda Accord', 'Hyundai Elantra', 'Nissan Sentra'],
  Hatchback: ['Honda Fit', 'Toyota Prius', 'Volkswagen Golf'],
  SUV: ['Subaru Outback', 'Toyota RAV4', 'Honda CR-V', 'Mazda CX-5'],
  Van: ['Honda Odyssey', 'Toyota Sienna', 'Chrysler Pacifica'],
  Truck: ['Ford F-150', 'Toyota Tacoma', 'Chevrolet Silverado'],
};

// DEMO DATA — hand-authored so the recovery story is reachable for every scripted gap.
const NAMED_DRIVERS: Driver[] = [
  { id:'d01', name:'Kristen L.', available:true, tag:'flexible', incomplete:false, zone:'North Seattle', pref:'North cluster', vehicle:{ type:'SUV', model:'Subaru Outback' }, tenureMonths:36, assignedTo:[], profileSchoolId:'sc09', RSVPStatus:'pending', email:'kristen.l@example.com', phone:'(206) 555-0101', homeCoords:[47.7070, -122.3286], flexibility:'High', reliability:'High', notes:'Very reliable.', history:[] },
  { id:'d02', name:'Chloe M.', available:true, tag:'fixed', incomplete:false, zone:'Bellevue', pref:'Bellevue cluster', vehicle:{ type:'Sedan', model:'Honda Civic' }, tenureMonths:28, assignedTo:[], profileSchoolId:'sc01', RSVPStatus:'pending', email:'chloe.m@example.com', phone:'(206) 555-0102', homeCoords:[47.5951, -122.1478], flexibility:'Low', reliability:'High', notes:'Avoids highways.', history:[] },
  { id:'d03', name:'Christine C.', available:true, tag:'no-data', incomplete:true, zone:'Unknown', pref:'No data', vehicle:{ type:'Sedan', model:'Toyota Corolla' }, tenureMonths:1, assignedTo:[], profileSchoolId:'sc10', RSVPStatus:'pending', email:'christine.c@example.com', phone:'(206) 555-0103', homeCoords:[47.5943, -122.3215], flexibility:'Medium', reliability:'Medium', notes:null, history:[] },
  { id:'d04', name:'Paul D.', available:false, tag:'fixed', incomplete:false, zone:'South Seattle', pref:'South cluster', vehicle:{ type:'Truck', model:'Ford F-150' }, tenureMonths:50, assignedTo:[], profileSchoolId:'sc05', RSVPStatus:'pending', email:'paul.d@example.com', phone:'(206) 555-0104', homeCoords:[47.5226, -122.2597], flexibility:'Low', reliability:'Medium', notes:'Not available this week.', history:[] },
  { id:'d05', name:'Marco R.', available:true, tag:'flexible', incomplete:false, zone:'Anywhere', pref:'Any zone', vehicle:{ type:'Van', model:'Toyota Sienna' }, tenureMonths:44, assignedTo:[], profileSchoolId:'sc08', RSVPStatus:'pending', email:'marco.r@example.com', phone:'(206) 555-0105', homeCoords:[47.5706, -122.3058], flexibility:'High', reliability:'High', notes:'Most flexible driver.', history:[] },
  { id:'d06', name:'Sandra B.', available:true, tag:'no-data', incomplete:true, zone:'East Seattle', pref:'East Seattle', vehicle:{ type:'Compact', model:'Mini Cooper' }, tenureMonths:7, assignedTo:[], profileSchoolId:'sc02', RSVPStatus:'pending', email:'sandra.b@example.com', phone:'(206) 555-0106', homeCoords:[47.5538, -122.1098], flexibility:'Medium', reliability:'Low', notes:null, history:[] },
  { id:'d07', name:'James T.', available:true, tag:'flexible', incomplete:false, zone:'Central', pref:'Central + South', vehicle:{ type:'Van', model:'Honda Odyssey' }, tenureMonths:30, assignedTo:[], profileSchoolId:'sc06', RSVPStatus:'pending', email:'james.t@example.com', phone:'(206) 555-0107', homeCoords:[47.5980, -122.3221], flexibility:'Medium', reliability:'High', notes:'Good communicator.', history:[] },
  { id:'d08', name:'Nora H.', available:true, tag:'flexible', incomplete:false, zone:'North/Eastside', pref:'North or Eastside', vehicle:{ type:'SUV', model:'Toyota RAV4' }, tenureMonths:3, assignedTo:[], profileSchoolId:'sc03', RSVPStatus:'pending', email:'nora.h@example.com', phone:'(206) 555-0108', homeCoords:[47.5787, -122.1534], flexibility:'High', reliability:'Medium', notes:'New driver.', history:[] },
  { id:'d09', name:'Diana P.', available:true, tag:'flexible', incomplete:false, zone:'South Seattle', pref:'South + Central', vehicle:{ type:'SUV', model:'Mazda CX-5' }, tenureMonths:26, assignedTo:[], profileSchoolId:'sc11', RSVPStatus:'pending', email:'diana.p@example.com', phone:'(206) 555-0109', homeCoords:[47.5623, -122.2891], flexibility:'High', reliability:'High', notes:'Very dependable.', history:[] },
  { id:'d10', name:'Frank O.', available:true, tag:'fixed', incomplete:false, zone:'Central', pref:'Central only', vehicle:{ type:'Sedan', model:'Toyota Camry' }, tenureMonths:60, assignedTo:[], profileSchoolId:'sc12', RSVPStatus:'pending', email:'frank.o@example.com', phone:'(206) 555-0110', homeCoords:[47.5988, -122.2940], flexibility:'Low', reliability:'High', notes:'Strict Central only.', history:[] },
  { id:'d11', name:'Yuki R.', available:true, tag:'flexible', incomplete:false, zone:'South Seattle', pref:'South + Bellevue', vehicle:{ type:'Hatchback', model:'Honda Fit' }, tenureMonths:14, assignedTo:[], profileSchoolId:'sc14', RSVPStatus:'pending', email:'yuki.r@example.com', phone:'(206) 555-0111', homeCoords:[47.5398, -122.3042], flexibility:'High', reliability:'Medium', notes:'Bilingual.', history:[] },
  { id:'d12', name:'Marcus B.', available:true, tag:'fixed', incomplete:false, zone:'South Seattle', pref:'South cluster', vehicle:{ type:'Truck', model:'Chevrolet Silverado' }, tenureMonths:48, assignedTo:[], profileSchoolId:'sc15', RSVPStatus:'pending', email:'marcus.b@example.com', phone:'(206) 555-0112', homeCoords:[47.5330, -122.2877], flexibility:'Low', reliability:'High', notes:'Knows South routes cold.', history:[] },
];

function generateVolunteers(count: number): Driver[] {
  const rand = mulberry32(42);
  const pick = <T,>(list: readonly T[]): T => list[Math.floor(rand() * list.length)];
  const levels: readonly Level[] = ['Low', 'Medium', 'High'];

  return Array.from({ length: count }, (_, i) => {
    const n = i + 13;
    const vehicleRoll = rand();
    const type: VehicleType =
      vehicleRoll < 0.25 ? 'SUV' : vehicleRoll < 0.4 ? pick(['Van', 'Truck'] as const) : pick(['Sedan', 'Compact', 'Hatchback'] as const);
    const loyalist = rand() < 0.25;
    const homeCoords: [number, number] = [47.6062 + (rand() - 0.5) * 0.1, -122.3321 + (rand() - 0.5) * 0.1];
    return {
      id: `d${n}`,
      name: `Volunteer ${n}`,
      available: true,
      tag: loyalist ? ('fixed' as const) : ('flexible' as const),
      incomplete: false,
      zone: 'Various',
      pref: loyalist ? 'Same route each week' : 'Flexible',
      vehicle: { type, model: pick(MODELS[type]) },
      tenureMonths: Math.floor(rand() * 61),
      assignedTo: [],
      profileSchoolId: INITIAL_SCHOOLS[(i % (INITIAL_SCHOOLS.length - 3)) + 3].id,
      RSVPStatus: 'pending' as const,
      email: `volunteer.${n}@example.com`,
      phone: `(206) 555-${(1000 + i).toString().padStart(4, '0')}`,
      homeCoords,
      flexibility: loyalist ? 'Low' : pick(['Medium', 'High'] as const),
      reliability: pick(levels),
      notes: 'Generated volunteer.',
      history: [],
    };
  });
}

export const INITIAL_DRIVERS: Driver[] = [...NAMED_DRIVERS, ...generateVolunteers(78)];
