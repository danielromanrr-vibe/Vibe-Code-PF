import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { MessageSquare, Printer, Send } from 'lucide-react';
import { INITIAL_DRIVERS, INITIAL_SCHOOLS, SCHOOL_COORDS } from './data';
import { distanceBetween } from './lib/geo';
import { buildClusterHtml, buildSitePinHtml } from './lib/markers';
import type { Driver, School } from './types';
import { PACKS_PER_ROUTE } from './types';
import { VolunteerCard } from './components/VolunteerCard';
import { VolunteerActionsContext } from './components/VolunteerActions';
import { Button, Eyebrow, Pill } from './components/ui';
import { buildDraft, formatPhone, packsCapacity, vehicleLabel } from './lib/volunteer';

const STATUS = { isRSVPRequested: true, isAnimatingRSVP: false };

function usePlay(steps: number, ms: number) {
  const still = new URLSearchParams(window.location.search).get('still') === '1';
  const [step, setStep] = useState(still ? steps - 1 : 0);
  const [playing, setPlaying] = useState(
    () => !still && !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || data.type !== 'map-aid') return;
      if (data.action === 'pause') setPlaying(false);
      if (data.action === 'play' && !still) setPlaying(true);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [still]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setStep((current) => (current + 1) % steps), ms);
    return () => window.clearInterval(id);
  }, [playing, steps, ms]);

  return step;
}

function Stage({ children }: { children: ReactNode }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const item = itemRef.current;
    if (!frame || !item) return;

    const measure = () => {
      const width = item.offsetWidth;
      const height = item.offsetHeight;
      if (!frame.clientWidth || !frame.clientHeight || !width || !height) return;
      const next = Math.min(1, (frame.clientWidth * 0.92) / width, (frame.clientHeight * 0.92) / height);
      setScale((current) => (Math.abs(current - next) < 0.015 ? current : next));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [children]);

  return (
    <div ref={frameRef} className="h-full w-full overflow-hidden bg-[#F8F9FA] text-[#141414] flex items-center justify-center">
      <div style={{ transform: `scale(${scale})` }}>
        <div ref={itemRef} className="w-[272px]">{children}</div>
      </div>
    </div>
  );
}

function RsvpScene() {
  const step = usePlay(3, 2200);
  const total = INITIAL_SCHOOLS.length;
  const confirmed = step === 0 ? 0 : step === 1 ? Math.round(total * 0.4) : Math.round(total * 0.78);
  const progress = (confirmed / total) * 100;

  return (
    <Stage>
      <div className="w-full max-w-[280px] flex flex-col gap-3">
        {step === 0 ? (
          <button
            type="button"
            className="h-9 px-3.5 rounded-full text-[13px] font-semibold tracking-[-0.012em] bg-[#0066cc] text-white flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            Request RSVPs
          </button>
        ) : (
          <div className="glass-light p-1.5 rounded-full h-11 flex items-center shadow-xs">
            <div className="relative flex-1 h-full bg-[#141414]/[0.06] rounded-full overflow-hidden">
              <div className="absolute inset-0 flex items-center px-3.5">
                <span className="text-[#141414] font-medium text-[12px] tracking-[-0.012em] whitespace-nowrap">
                  {confirmed}/{total} routes covered ({Math.round(progress)}%)
                </span>
              </div>
              <div className="h-full bg-[#0066cc] overflow-hidden" style={{ width: `${progress}%` }}>
                <div className="h-full flex items-center px-3.5" style={{ width: '240px' }}>
                  <span className="text-white font-medium text-[12px] tracking-[-0.012em] whitespace-nowrap">
                    {confirmed}/{total} routes covered ({Math.round(progress)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex gap-2">
          <span className={`pill ${step < 2 ? 'pill--risk' : 'pill--gap'}`}>
            {step < 2 ? 'Pending' : 'Gap'}
          </span>
          <span className={`pill ${step === 0 ? 'pill--neutral' : 'pill--good'}`}>
            {step === 0 ? 'Standby' : 'Confirmed'}
          </span>
        </div>
      </div>
    </Stage>
  );
}

function HtmlPin({ html }: { html: string }) {
  return <div className="pointer-events-none" dangerouslySetInnerHTML={{ __html: html }} />;
}

function DisclosureScene() {
  const step = usePlay(2, 2800);
  const north = INITIAL_SCHOOLS.filter((school) => school.zone === 'North Seattle').slice(0, 3);
  const cluster = buildClusterHtml(
    {
      zone: 'North Seattle',
      totalCount: 8,
      gapCount: 1,
      displayCount: 8,
      filterMode: 'all',
    },
    { isRSVPRequested: true, tone: 'light' },
  );

  return (
    <Stage>
      {step === 0 ? (
        <HtmlPin html={cluster} />
      ) : (
        <div className="flex flex-col gap-3">
          {north.map((school, index) => (
            <HtmlPin
              key={school.id}
              html={buildSitePinHtml(school, index === 0 ? 'gap' : 'covered', {
                level: 'detail',
                tier: null,
                dist: 0,
                tone: 'light',
                index,
                isRSVPRequested: true,
                highlighted: index === 0,
              })}
            />
          ))}
        </div>
      )}
    </Stage>
  );
}

function TiersScene() {
  usePlay(2, 2600);
  const school = INITIAL_SCHOOLS.find((item) => item.id === 'sc17')!;
  const origin = SCHOOL_COORDS[school.id];
  const nearest = useMemo(() => {
    return INITIAL_DRIVERS.filter((driver) => driver.available && driver.homeCoords)
      .map((driver) => ({
        driver,
        miles: distanceBetween(origin, driver.homeCoords!),
      }))
      .sort((a, b) => a.miles - b.miles)
      .slice(0, 3);
  }, [origin]);

  return (
    <Stage>
      <div className="flex flex-col items-center">
      <div className="relative w-44 h-44">
        <span className="absolute inset-0 rounded-full border border-emerald-600/25" />
        <span className="absolute inset-[18%] rounded-full border border-emerald-600/40" />
        <span className="absolute inset-[36%] rounded-full border border-emerald-600/70" />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <HtmlPin
            html={buildSitePinHtml(school, 'gap', {
              level: 'compact',
              tier: null,
              dist: 0,
              tone: 'light',
              index: 0,
              isRSVPRequested: true,
              highlighted: true,
            })}
          />
        </span>
      </div>
      <ul className="mt-4 flex flex-col gap-1 text-[12px] font-medium">
        {nearest.map(({ driver, miles }) => (
          <li key={driver.id}>
            {driver.name} · {miles.toFixed(1)} mi
          </li>
        ))}
      </ul>
      </div>
    </Stage>
  );
}

function stackCast(): { driver: Driver; school: School; schools: School[]; drivers: Driver[] } {
  const schools = INITIAL_SCHOOLS.map((school) =>
    school.id === 'sc09' ? { ...school, assignedDriver: 'Kristen L.' } : school,
  );
  const drivers = INITIAL_DRIVERS.map((driver) =>
    driver.id === 'd01' ? { ...driver, assignedTo: ['sc09'], RSVPStatus: 'yes' as const } : driver,
  );
  return {
    driver: drivers.find((driver) => driver.id === 'd01')!,
    school: schools.find((school) => school.id === 'sc17')!,
    schools,
    drivers,
  };
}

function StackScene() {
  const step = usePlay(2, 3200);
  const cast = useMemo(stackCast, []);
  const madrona = cast.schools.find((school) => school.id === 'sc09')!;
  const added = step > 0;
  const capacity = packsCapacity(cast.driver);
  const routes = added ? 2 : 1;
  const load = routes * PACKS_PER_ROUTE;

  return (
    <Stage>
      <article className="bg-white rounded-2xl border border-[#141414]/[0.08] shadow-[0_8px_24px_-16px_rgba(12,21,40,0.28)] p-3 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-[13px] font-semibold tracking-[-0.03em] leading-snug">
              Add an additional route for Kristen?
            </h2>
            <p className="text-[11px] text-[#141414]/65 mt-0.5">{vehicleLabel(cast.driver)}</p>
          </div>
          <Pill tone="good">Confirmed</Pill>
        </div>

        <div className="border-t border-[#141414]/[0.06]">
          <div className="grid grid-cols-[88px_1fr] gap-2 py-2 border-b border-[#141414]/[0.06]">
            <span className="text-[12px] text-[#141414]/65">Current route</span>
            <span className="min-w-0">
              <span className="block text-[13px] font-medium truncate">{madrona.name}</span>
              <span className="block text-[12px] text-[#141414]/65 tabular-nums">
                {madrona.day} · {madrona.time} · {PACKS_PER_ROUTE} packs
              </span>
            </span>
          </div>
          <div className="grid grid-cols-[88px_1fr] gap-2 py-2">
            <span className="text-[12px] text-[#141414]/65">+ Additional</span>
            <span className="min-w-0">
              <span className="block text-[13px] font-medium truncate">{cast.school.name}</span>
              <span className="block text-[12px] text-[#141414]/65 tabular-nums">
                {cast.school.day} · {cast.school.time} · {added ? `+${PACKS_PER_ROUTE} packs` : 'Open'}
              </span>
            </span>
          </div>
        </div>

        <div className="surface-inset p-2.5 flex flex-col gap-1.5">
          <Eyebrow>Capacity check</Eyebrow>
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 flex-1 rounded-full bg-[#0066cc]" />
            <span
              className={`h-2.5 flex-1 rounded-full ${added ? 'bg-emerald-500 animate-pulse' : 'bg-[#141414]/[0.08]'}`}
            />
          </div>
          <p className="text-[12px] font-medium tabular-nums">
            {load} of {capacity} packs · {routes} {routes === 1 ? 'route' : 'routes'}
          </p>
          <p className="text-[12px] text-[#141414]/65">
            {added ? 'Fits in vehicle — trunk will be full after this route.' : 'Fits comfortably in vehicle.'}
          </p>
        </div>

        {added ? (
          <p className="rounded-xl bg-emerald-50 border border-emerald-200 px-2.5 py-2 text-[12px] text-emerald-900">
            Madrona stays covered. Olympic Hills is newly covered.
          </p>
        ) : null}

        <div className="flex items-center justify-end gap-2">
          <Button variant="quiet">Cancel</Button>
          <Button variant="primary" className={added ? 'map-aid-press' : ''}>
            Confirm Additional Route
          </Button>
        </div>
      </article>
    </Stage>
  );
}

function RosterScene() {
  const step = usePlay(2, 3200);
  const driver = INITIAL_DRIVERS.find((item) => item.id === 'd10')!;
  const school = INITIAL_SCHOOLS.find((item) => item.id === 'sc17')!;
  const draft = buildDraft(driver, school);

  return (
    <VolunteerActionsContext.Provider
      value={{ openTextDraft: () => {}, openProfile: () => {}, locateOnMap: () => {}, canLocate: () => false }}
    >
      <Stage>
        {step === 0 ? (
          <VolunteerCard
            driver={driver}
            schools={INITIAL_SCHOOLS}
            statusCtx={STATUS}
            gapSchool={school}
            onAssign={() => {}}
          />
        ) : (
          <article className="bg-white rounded-2xl border border-[#141414]/[0.08] shadow-[0_8px_24px_-16px_rgba(12,21,40,0.28)] p-4">
            <h2 className="text-[15px] font-semibold tracking-[-0.03em]">Text draft</h2>
            <p className="text-[12px] text-[#141414]/65 mt-1">Edit before it opens in Messages.</p>
            <p className="mt-3 text-[13px] font-medium">
              To {driver.name}
              <span className="block text-[12px] font-normal text-[#141414]/65 mt-0.5">{vehicleLabel(driver)}</span>
              <span className="block text-[12px] font-normal text-[#141414]/65 tabular-nums whitespace-nowrap">{formatPhone(driver)}</span>
            </p>
            <p className="surface-inset mt-3 px-3.5 py-3 text-[13px] leading-relaxed">{draft}</p>
            <Button variant="primary" icon={MessageSquare} block className="mt-4">
              Open in Messages
            </Button>
          </article>
        )}
      </Stage>
    </VolunteerActionsContext.Provider>
  );
}

function ManifestScene() {
  const step = usePlay(2, 2800);
  const driver = INITIAL_DRIVERS.find((item) => item.id === 'd01')!;
  const madrona = INITIAL_SCHOOLS.find((item) => item.id === 'sc09')!;
  const olympic = INITIAL_SCHOOLS.find((item) => item.id === 'sc17')!;
  const stops = [
    { school: madrona, slip: 'Blue slip' },
    { school: olympic, slip: 'Green slip' },
  ];

  return (
    <Stage>
      <article className="bg-[#FCFBF7] text-[#141414] border border-[#141414]/15 shadow-[0_10px_28px_-16px_rgba(12,21,40,0.45)] rounded-sm p-3 font-mono text-[10.5px] leading-snug">
        <div className="flex items-center justify-between gap-2">
          <p className="font-semibold tracking-[0.04em] uppercase leading-tight">Route sheet</p>
          <Button variant="primary" icon={Printer} className={`shrink-0 ${step > 0 ? 'map-aid-press' : ''}`}>
            Print
          </Button>
        </div>
        <p className="mt-1.5 font-semibold">Backpack Brigade</p>
        <p className="mt-3">Driver: {driver.name}</p>
        <p>Phone: {formatPhone(driver)}</p>
        <p>Vehicle: {driver.vehicle.model} · {driver.vehicle.type}</p>
        <p>Capacity: {packsCapacity(driver)} packs</p>
        <div className="mt-3 pt-3 border-t border-dashed border-[#141414]/25 flex flex-col gap-2.5">
          {stops.map((stop, index) => (
            <p key={stop.school.id}>
              Stop {index + 1}: {stop.school.name}
              <span className="block">
                {stop.school.day} · {stop.school.time} · {PACKS_PER_ROUTE} packs · {stop.slip}
              </span>
            </p>
          ))}
        </div>
        <p className="mt-3 pt-3 border-t border-dashed border-[#141414]/25">
          Dock: crate count matched to trunk capacity. Call the driver from this sheet.
        </p>
        <p className="mt-3">Warehouse check-out: Sam Hoyt</p>
        <p className="mt-2">Driver signature: ________________</p>
      </article>
    </Stage>
  );
}

const SCENES = {
  rsvp: RsvpScene,
  disclosure: DisclosureScene,
  tiers: TiersScene,
  stack: StackScene,
  roster: RosterScene,
  manifest: ManifestScene,
} as const;

export default function MapAidScenes({ scene }: { scene: string }) {
  const View = SCENES[scene as keyof typeof SCENES];
  if (!View) return <Stage>Map-Aid</Stage>;
  return <View />;
}
