import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { Car, MessageSquare, Printer, Send, SlidersHorizontal, UserPlus } from 'lucide-react';
import { INITIAL_DRIVERS, INITIAL_SCHOOLS } from './data';
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

function quietPin(html: string) {
  return html.replaceAll('marker-enter', '').replaceAll('animate-pulse-red', '');
}

function DisclosureScene() {
  const step = usePlay(3, 2600);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gap = INITIAL_SCHOOLS.find((school) => school.id === 'sc17')!;
  const several = [
    { school: INITIAL_SCHOOLS.find((school) => school.id === 'sc16')!, status: 'covered' as const },
    { school: gap, status: 'gap' as const },
    { school: INITIAL_SCHOOLS.find((school) => school.id === 'sc18')!, status: 'covered' as const },
  ];
  const cluster = quietPin(
    buildClusterHtml(
      {
        zone: 'North Seattle',
        totalCount: 8,
        gapCount: 1,
        displayCount: 8,
        filterMode: 'all',
      },
      { isRSVPRequested: true, tone: 'light' },
    ),
  );
  const pin = (school: (typeof several)[number]['school'], status: 'gap' | 'covered', index: number) =>
    quietPin(
      buildSitePinHtml(school, status, {
        level: 'detail',
        tier: null,
        dist: 0,
        tone: 'light',
        index,
        isRSVPRequested: true,
        highlighted: status === 'gap',
      }),
    );
  const layer = (on: boolean) =>
    `absolute inset-0 flex items-center justify-center ${reduce ? '' : 'transition-opacity duration-300'} ${on ? 'opacity-100' : 'pointer-events-none opacity-0'}`;

  return (
    <Stage>
      <div className="relative h-[148px] w-full">
        <div className={layer(step === 0)}>
          <HtmlPin html={cluster} />
        </div>
        <div className={layer(step === 1)}>
          <div className="flex flex-col items-start gap-2.5">
            {several.map((item, index) => (
              <HtmlPin key={item.school.id} html={pin(item.school, item.status, index)} />
            ))}
          </div>
        </div>
        <div className={layer(step === 2)}>
          <HtmlPin html={pin(gap, 'gap', 0)} />
        </div>
      </div>
    </Stage>
  );
}

const DRIVER_GREEN = '#22c55e';

/** Closest ring is solid. The next is half opacity, and the outer ring is a quarter. */
const PROXIMITY_RINGS = [
  { inset: 28, opacity: 1, angles: [-40, 145] },
  { inset: 14, opacity: 0.5, angles: [28, 205] },
  { inset: 0, opacity: 0.25, angles: [-105, 62, 168] },
] as const;

function TiersScene() {
  usePlay(2, 2600);
  const school = INITIAL_SCHOOLS.find((item) => item.id === 'sc17')!;

  return (
    <Stage>
      <div className="relative mx-auto h-56 w-56">
        {PROXIMITY_RINGS.map((ring) => (
          <span
            key={ring.inset}
            className="absolute rounded-full border"
            style={{
              inset: `${ring.inset}%`,
              borderColor: DRIVER_GREEN,
              opacity: ring.opacity,
            }}
          />
        ))}
        {PROXIMITY_RINGS.flatMap((ring) => {
          const radius = 48 - ring.inset;
          return ring.angles.map((angle) => {
            const rad = (angle * Math.PI) / 180;
            return (
              <Car
                key={`${ring.inset}-${angle}`}
                aria-hidden
                strokeWidth={2.25}
                className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${50 + radius * Math.cos(rad)}%`,
                  top: `${50 + radius * Math.sin(rad)}%`,
                  color: DRIVER_GREEN,
                  opacity: ring.opacity,
                  rotate: `${angle + 90}deg`,
                }}
              />
            );
          });
        })}
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

/** 0–2 fill the RSVP bar beside Print. 3 is the full sheet. */
function useManifestPhase(): number {
  const still = new URLSearchParams(window.location.search).get('still') === '1';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [phase, setPhase] = useState(still || reduce ? 3 : 0);
  const [playing, setPlaying] = useState(() => !still && !reduce);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || data.type !== 'map-aid') return;
      if (data.action === 'pause') setPlaying(false);
      if (data.action === 'play' && !still && !reduce) setPlaying(true);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [still, reduce]);

  useEffect(() => {
    if (!playing) return;
    const ms = phase < 3 ? 1300 : 3600;
    const id = window.setTimeout(() => setPhase((current) => (current + 1) % 4), ms);
    return () => window.clearTimeout(id);
  }, [playing, phase]);

  return phase;
}

const SHEET_COLORS: { name: string; ink: string; kind: string; chip?: string }[] = [
  { name: 'White', ink: '#3f3f3f', kind: '1 crate', chip: '#eceae4' },
  { name: 'Black', ink: '#141414', kind: '1 bag' },
  { name: 'Pink', ink: '#d4537e', kind: '1 bag' },
  { name: 'Purple', ink: '#6d4ea3', kind: '1 crate' },
  { name: 'Green', ink: '#2f8a4a', kind: '1 bag' },
  { name: 'Red', ink: '#d23b3b', kind: '1 bag' },
  { name: 'Yellow', ink: '#b8860b', kind: '1 crate' },
];

function RouteSheet() {
  return (
    <article className="flex h-full w-full flex-col bg-[#FCFBF7] px-[5%] py-[6%] text-[#141414]">
      <p className="text-[clamp(11px,3.2cqw,15px)] font-semibold tracking-[0.08em] uppercase">Route sheet</p>
      <div className="mt-[7%] grid flex-1 grid-cols-4 content-center gap-x-[3%] gap-y-[10%]">
        {SHEET_COLORS.map((color) => (
          <div key={color.name} className="min-w-0">
            <p
              className="truncate text-[clamp(12px,4.4cqw,18px)] font-semibold underline decoration-2 underline-offset-[3px]"
              style={{ color: color.ink, background: color.chip }}
            >
              {color.name}
            </p>
            <p className="mt-[10%] text-[clamp(11px,3.2cqw,14px)] text-[#141414]/75">{color.kind}</p>
          </div>
        ))}
      </div>
      <div className="mt-[8%] flex items-end gap-2">
        <span className="text-[clamp(12px,3.6cqw,16px)] font-medium">Signature</span>
        <span className="mb-[0.35em] h-px flex-1 bg-[#141414]/45" />
      </div>
    </article>
  );
}

function ManifestScene() {
  const phase = useManifestPhase();
  const printed = phase === 3;
  const total = INITIAL_SCHOOLS.length;
  const progress = [0.22, 0.58, 1][Math.min(phase, 2)] ?? 1;
  const confirmed = Math.round(total * progress);
  const percent = Math.round(progress * 100);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#F8F9FA] text-[#141414] [container-type:size]">
      <motion.div
        className="absolute inset-0 flex items-center justify-center px-4"
        initial={false}
        animate={{ opacity: printed ? 0 : 1 }}
        transition={{ duration: 0.35 }}
        aria-hidden={printed}
      >
        <div className="flex w-full max-w-[560px] items-center gap-3">
          <div className="glass-light flex h-11 min-w-0 flex-1 items-center rounded-full p-1.5 shadow-xs">
            <div className="relative h-full flex-1 overflow-hidden rounded-full bg-[#141414]/[0.06]">
              <div className="absolute inset-0 flex items-center px-3.5">
                <span className="whitespace-nowrap text-[clamp(10px,3.4cqw,13px)] font-medium tracking-[-0.012em] text-[#141414]">
                  {confirmed}/{total} routes covered ({percent}%)
                </span>
              </div>
              <div className="h-full overflow-hidden bg-[#0066cc] transition-[width] duration-700 ease-out" style={{ width: `${percent}%` }}>
                <div className="flex h-full items-center px-3.5" style={{ width: '280px' }}>
                  <span className="whitespace-nowrap text-[clamp(10px,3.4cqw,13px)] font-medium tracking-[-0.012em] text-white">
                    {confirmed}/{total} routes covered ({percent}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
          <Button
            variant="primary"
            icon={Printer}
            tabIndex={-1}
            className={`shrink-0 shadow-[0_8px_18px_-10px_rgba(0,40,90,0.7)] ${phase === 2 ? 'map-aid-press' : ''}`}
          >
            Print
          </Button>
        </div>
      </motion.div>

      <motion.div
        className="absolute inset-[5%] overflow-hidden rounded-[2px] border border-[#141414]/15 shadow-[0_16px_36px_-24px_rgba(12,21,40,0.45)]"
        initial={false}
        animate={{ opacity: printed ? 1 : 0 }}
        transition={{ duration: 0.35 }}
        aria-hidden={!printed}
      >
        <RouteSheet />
      </motion.div>
    </div>
  );
}

/** Add volunteer fills the square: press, three contact details, then Flexibility opens Very / Medium / Low. */
function VolunteerScene() {
  const step = usePlay(3, 2600);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const phase = reduce ? 2 : step;
  const pressed = phase === 0;
  const filled = phase >= 1;
  const open = phase === 2;
  const contacts = ['Name', 'Phone', 'Primary school'] as const;
  const parameters = ['Flexibility', 'Reliability', 'Capacity'] as const;

  return (
    <div className="flex h-full w-full flex-col bg-[#F8F9FA] px-[8%] py-[9%] text-[#141414] [container-type:size]">
      <div
        className={`flex w-fit items-center gap-[2.4cqw] rounded-[2.2cqw] py-[1.2cqw] pr-[2.4cqw] ${pressed ? 'map-aid-press bg-[#0066cc] pl-[1.2cqw] text-white' : 'text-[#141414]'}`}
      >
        <div
          className={`flex h-[10cqw] w-[10cqw] shrink-0 items-center justify-center rounded-[2.2cqw] ${pressed ? 'bg-white/15 text-white' : 'bg-[#0066cc]/[0.08] text-[#0066cc]'}`}
        >
          <UserPlus className="h-[5cqw] w-[5cqw]" aria-hidden="true" />
        </div>
        <h2 className="text-[clamp(13px,4.6cqw,18px)] font-semibold tracking-[-0.03em]">Add volunteer</h2>
      </div>

      <div className="mt-[7%] flex flex-1 flex-col justify-center gap-[2.6cqw]">
        {contacts.map((item, index) => (
          <div
            key={item}
            className="flex h-[7.5cqw] min-h-[18px] items-center rounded-[1.5cqw] bg-[#141414]/[0.045] px-[3cqw]"
          >
            <span
              className="text-[clamp(11px,3.8cqw,15px)] font-semibold tracking-[-0.02em] transition-opacity duration-300 ease-out"
              style={{ opacity: filled ? 1 : 0, transitionDelay: filled ? `${index * 280}ms` : '0ms' }}
            >
              {item}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-[6%] grid grid-cols-2 items-start gap-x-[4%]">
        <div className="flex items-start gap-[2cqw]">
          <SlidersHorizontal className="mt-[0.7cqw] h-[4cqw] w-[4cqw] shrink-0 text-[#141414]/70" aria-hidden="true" />
          <div className="text-[clamp(12px,4cqw,16px)] font-bold leading-snug tracking-[-0.02em]">
            {parameters.map((item) => {
              const selected = open && item === 'Flexibility';
              return (
                <p
                  key={item}
                  className={`w-fit rounded-[1.2cqw] px-[1.2cqw] transition-colors duration-200 ${selected ? 'bg-[#0066cc] text-white' : ''}`}
                >
                  {item}
                </p>
              );
            })}
          </div>
        </div>

        <div
          className="text-[clamp(12px,4cqw,16px)] font-bold leading-snug tracking-[-0.02em] transition-opacity duration-300 ease-out"
          style={{ opacity: open ? 1 : 0 }}
          aria-hidden={!open}
        >
          {['Very', 'Medium', 'Low'].map((level) => (
            <p key={level} className="px-[1.2cqw]">{level}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

const SCENES = {
  rsvp: RsvpScene,
  disclosure: DisclosureScene,
  tiers: TiersScene,
  stack: StackScene,
  roster: RosterScene,
  manifest: ManifestScene,
  volunteer: VolunteerScene,
} as const;

export default function MapAidScenes({ scene }: { scene: string }) {
  const View = SCENES[scene as keyof typeof SCENES];
  if (!View) return <Stage>Map-Aid</Stage>;
  return <View />;
}
