import AdoptPrototypeFlowDiagram from './AdoptPrototypeFlowDiagram';

const QR_ENTRY_IMAGE_SRC = '/adopt-a-school/key-interaction-qr-entry.png?v=2';
const SCHOOL_ADOPTION_MAP_VIDEO_SRC = '/adopt-a-school/school-adoption-map.mp4';

const SYSTEM_FLOW_BODY = 'Discovery object, mobile flow, participation system';

const MOBILE_FLOW_BODY = 'School map: interest through enrollment—mobile-first.';

const DISCOVERY_BODY = 'A shared object links physical spaces to the digital flow.';

const MOBILE_FLOW_TITLE = 'Mobile-first activation';

/** Supporting cards — lighter shell (secondary to mobile activation row). */
const cardShellSecondary =
  'rounded-md border border-ink/[0.07] bg-white/[0.9] p-3 shadow-[0_1px_0_rgba(20,20,20,0.03)] md:p-3.5';

/** Full-width activation — dominant visual weight. */
const cardShellProminent =
  'rounded-lg border border-ink/[0.11] bg-white p-4 shadow-[0_2px_14px_rgba(20,20,20,0.055)] md:p-5';

/** Matches `ZoomInWindow` expand control — positioned in the bottom-right of the media area. */
function QuickScanMediaPlusButton({
  scrollTargetId,
  ariaLabel,
}: {
  scrollTargetId: string;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      data-cursor="hand"
      aria-label={ariaLabel}
      onClick={() =>
        document.getElementById(scrollTargetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      className="absolute bottom-2 right-2 z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ink/30 bg-ink/5 text-lg font-heading font-medium leading-none text-[var(--color-heading-h4)] transition-colors hover:border-ink/40 hover:bg-ink/10"
    >
      +
    </button>
  );
}

type SystemFlowMedia = 'diagram' | 'adoptionMapVideo';

/** System map (diagram) or mobile adoption map (video). */
function SystemFlowCard({
  media = 'diagram',
  prominent = false,
}: {
  media?: SystemFlowMedia;
  /** Larger media runway — full-width mobile row. */
  prominent?: boolean;
}) {
  const plusTarget =
    media === 'adoptionMapVideo' ? 'adopt-section-prototype' : 'adopt-section-system';
  const plusLabel =
    media === 'adoptionMapVideo' ? 'View prototype section' : 'View system architecture';

  const heading = media === 'adoptionMapVideo' ? MOBILE_FLOW_TITLE : 'System flow';

  const mediaMin = prominent
    ? 'min-h-[220px] sm:min-h-[300px] lg:min-h-[380px]'
    : 'min-h-[160px] sm:min-h-[200px] lg:min-h-[240px]';

  const shell = prominent ? cardShellProminent : cardShellSecondary;
  const lede = media === 'adoptionMapVideo' ? MOBILE_FLOW_BODY : SYSTEM_FLOW_BODY;

  return (
    <article className={`${shell} h-full`}>
      <header className={`text-left ${prominent ? 'mb-3.5 md:mb-4' : 'mb-2.5'}`}>
        <h4 className="mb-1.5">{heading}</h4>
        <p className="adopt-card-lede max-w-measure">{lede}</p>
      </header>

      {media === 'diagram' ? (
        <div className="relative overflow-hidden rounded-md border border-violet-400/12 bg-[radial-gradient(circle_at_50%_45%,rgba(196,181,253,0.22)_0%,rgba(196,181,253,0.08)_42%,rgba(248,249,250,0.98)_100%)] shadow-[0_0_0_1px_rgba(139,92,246,0.05)]">
          <div className={`aspect-[960/520] w-full ${mediaMin}`}>
            <div className="flex h-full w-full items-center justify-center p-0.5 sm:p-px">
              <div className="h-full w-full origin-center scale-[1.06]">
                <AdoptPrototypeFlowDiagram className="h-full w-full" />
              </div>
            </div>
          </div>
          <QuickScanMediaPlusButton scrollTargetId={plusTarget} ariaLabel={plusLabel} />
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-md border border-ink/25 bg-black shadow-[0_4px_28px_rgba(0,0,0,0.18)]">
          <div className={`aspect-[960/520] w-full ${mediaMin}`}>
            <video
              className="block h-full w-full object-cover object-center"
              src={SCHOOL_ADOPTION_MAP_VIDEO_SRC}
              autoPlay
              muted
              loop
              playsInline
              aria-label="Screen recording of the school adoption map flow."
            />
          </div>
          <QuickScanMediaPlusButton scrollTargetId={plusTarget} ariaLabel={plusLabel} />
        </div>
      )}
    </article>
  );
}

/** Top row, right — Discovery + QR entry. */
function DiscoveryCard() {
  return (
    <article className={`${cardShellSecondary} flex h-full min-h-0 flex-col`}>
      <header className="mb-2.5 text-left">
        <h4 className="mb-1.5">Discovery</h4>
        <p className="adopt-card-lede">{DISCOVERY_BODY}</p>
      </header>
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-md border border-ink/[0.08] bg-ink/[0.02]">
        <img
          src={QR_ENTRY_IMAGE_SRC}
          alt="Physical prototype for QR entry into the Adopt-a-School flow."
          className="h-full w-full object-cover object-center"
          loading="lazy"
          decoding="async"
        />
        <QuickScanMediaPlusButton scrollTargetId="adopt-section-prototype" ariaLabel="View prototype section" />
      </div>
    </article>
  );
}

export default function AdoptQuickScan() {
  return (
    <div className="w-full min-w-0">
      {/*
        Row 1: System flow (2) | Discovery (1).
        Row 2: Mobile flow — full width, largest media treatment.
      */}
      <div className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-3.5">
        <div className="min-w-0 sm:col-span-2 sm:pr-1">
          <SystemFlowCard />
        </div>
        <div className="min-w-0 sm:col-span-1 sm:pl-0.5">
          <DiscoveryCard />
        </div>
        <div className="min-w-0 sm:col-span-3 sm:pt-0.5">
          <SystemFlowCard media="adoptionMapVideo" prominent />
        </div>
      </div>
    </div>
  );
}
