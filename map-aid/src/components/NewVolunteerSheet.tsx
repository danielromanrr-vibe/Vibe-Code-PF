import React, { useMemo, useRef, useState } from 'react';
import { ChevronDown, UserPlus } from 'lucide-react';
import type { Archetype, Driver, Level, School, VehicleType } from '../types';
import { VEHICLE_PACK_CAPACITY, VEHICLE_TYPES } from '../types';
import { SCHOOL_COORDS } from '../data';
import { Button, SegmentedControl, Sheet } from './ui';

const FIELD =
  'w-full h-9 rounded-full bg-[#F8F9FA] border border-[#141414]/[0.06] px-3.5 text-[13px] text-[#141414] placeholder:text-[#141414]/50 outline-none focus-visible:ring-2 focus-visible:ring-[#0066cc]/30';

function Field({ id, label, hint, children }: { id?: string; label: string; hint?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="block text-[12px] font-medium text-[#141414]/65 mb-1.5">
        {label}
      </label>
      {children}
      {hint && <p className="text-[12px] text-[#141414]/65 mt-1.5">{hint}</p>}
    </div>
  );
}

function Select({ id, value, onChange, children }: { id: string; value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <div className="relative">
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={`${FIELD} appearance-none pr-8 cursor-pointer`}>
        {children}
      </select>
      <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[#141414]/50 pointer-events-none" aria-hidden="true" />
    </div>
  );
}

function formatPhoneInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').replace(/^1(?=\d{10})/, '');
  if (digits.length !== 10) return raw.trim();
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function NewVolunteerSheet({
  schools,
  onClose,
  onAdd,
}: {
  schools: School[];
  onClose: () => void;
  onAdd: (driver: Driver) => void;
  key?: React.Key;
}) {
  const zones = useMemo(() => Array.from(new Set(schools.map((s) => s.zone))), [schools]);
  const nameRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [zone, setZone] = useState(zones[0] ?? 'Central');
  const [profileSchoolId, setProfileSchoolId] = useState(schools[0]?.id ?? '');
  const [vehicleType, setVehicleType] = useState<VehicleType>('Sedan');
  const [model, setModel] = useState('');
  const [archetype, setArchetype] = useState<Archetype>('floater');
  const [reliability, setReliability] = useState<Level>('High');

  const packs = VEHICLE_PACK_CAPACITY[vehicleType];
  const routes = Math.floor(packs / 20);
  const canSubmit = name.trim().length > 0 && (phone.replace(/\D/g, '').length >= 10 || /\S+@\S+\.\S+/.test(email));

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    const loyalist = archetype === 'loyalist';
    onAdd({
      id: `d${Date.now()}`,
      name: name.trim(),
      available: true,
      tag: loyalist ? 'fixed' : 'flexible',
      incomplete: false,
      zone,
      pref: zone,
      vehicle: { type: vehicleType, model: model.trim() },
      tenureMonths: 0,
      assignedTo: [],
      profileSchoolId,
      RSVPStatus: 'pending',
      email: email.trim(),
      phone: formatPhoneInput(phone),
      homeCoords: SCHOOL_COORDS[profileSchoolId] ?? [47.6062, -122.3321],
      flexibility: loyalist ? 'Low' : 'High',
      reliability,
      notes: null,
      history: [],
    });
  };

  return (
    <Sheet onClose={onClose} labelledBy="new-volunteer-title" className="max-w-lg" initialFocusRef={nameRef}>
      <form onSubmit={submit} className="p-6" noValidate>
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0066cc]/[0.08] text-[#0066cc] flex items-center justify-center shrink-0">
            <UserPlus className="w-[18px] h-[18px]" aria-hidden="true" />
          </div>
          <div>
            <h2 id="new-volunteer-title" className="text-[17px] font-semibold leading-tight">
              Add volunteer
            </h2>
            <p className="text-[13px] text-[#141414]/65 mt-0.5">Name plus a phone number or email is enough to start.</p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <Field id="nv-name" label="Full name">
            <input id="nv-name" ref={nameRef} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sarah J." className={FIELD} autoComplete="off" />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field id="nv-phone" label="Phone">
              <input
                id="nv-phone"
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onBlur={() => setPhone((p) => formatPhoneInput(p))}
                placeholder="(206) 555-0123"
                className={`${FIELD} tabular-nums`}
              />
            </Field>
            <Field id="nv-email" label="Email">
              <input id="nv-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className={FIELD} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field id="nv-zone" label="Zone">
              <Select id="nv-zone" value={zone} onChange={setZone}>
                {zones.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </Select>
            </Field>
            <Field id="nv-school" label="Home-base school">
              <Select id="nv-school" value={profileSchoolId} onChange={setProfileSchoolId}>
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <Field label="Vehicle" hint={<span className="tabular-nums">Max {packs} packs ({routes} {routes === 1 ? 'school' : 'schools'})</span>}>
            <SegmentedControl<VehicleType>
              label="Vehicle type"
              value={vehicleType}
              onChange={setVehicleType}
              options={VEHICLE_TYPES.map((t) => ({ value: t, label: t }))}
            />
          </Field>

          <Field id="nv-model" label="Model (optional)">
            <input id="nv-model" value={model} onChange={(e) => setModel(e.target.value)} placeholder="e.g. Toyota RAV4" className={FIELD} autoComplete="off" />
          </Field>

          <div className="grid grid-cols-[1.4fr_1fr] gap-3">
            <Field label="Archetype">
              <SegmentedControl<Archetype>
                label="Archetype"
                value={archetype}
                onChange={setArchetype}
                options={[
                  { value: 'floater', label: 'Flexible Floater' },
                  { value: 'loyalist', label: 'Fixed Loyalist' },
                ]}
              />
            </Field>
            <Field label="Reliability">
              <SegmentedControl<Level>
                label="Reliability"
                value={reliability}
                onChange={setReliability}
                options={[
                  { value: 'Low', label: 'Low' },
                  { value: 'Medium', label: 'Medium' },
                  { value: 'High', label: 'High' },
                ]}
              />
            </Field>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <Button variant="quiet" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={!canSubmit} icon={UserPlus}>
            Add volunteer
          </Button>
        </div>
      </form>
    </Sheet>
  );
}
