import AdoptPrototypeFlowDiagram from './AdoptPrototypeFlowDiagram';

/** Research synthesis / post-it wall visual. */
const POSTIT_SYNTHESIS_IMAGE_SRC = '/adopt-a-school/Post-it3_Humanize-shot_IMG_8754.jpg';
/** Key interactions — QR apple / physical gateway (same asset as case study). */
const QR_ENTRY_IMAGE_SRC = '/adopt-a-school/key-interaction-qr-entry.png?v=2';
/** Same asset as Key interactions → School adoption map. */
const SCHOOL_ADOPTION_MAP_VIDEO_SRC = '/adopt-a-school/school-adoption-map.mp4';

const SYSTEM_FLOW_BODY =
  'Physical discovery object, mobile flow, and participation system';

const PRODUCT_DESIGN_BODY =
  'The system mixes real world objects in digital interfaces';

const SCALABILITY_BODY = '150 raw data points from observation turned into insight';

const cardShell =
  'rounded-2xl border border-ink/20 bg-white p-4 shadow-md ring-1 ring-ink/[0.05] md:p-[1.125rem] lg:p-5 transition-[box-shadow,border-color] duration-200 hover:border-ink/28 hover:shadow-lg';

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
      className="absolute bottom-2 right-2 z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ink/30 bg-ink/5 text-lg font-heading font-medium leading-none text-[var(--color-heading-h3)] transition-colors hover:border-ink/40 hover:bg-ink/10"
    >
      +
    </button>
  );
}

type SystemFlowMedia = 'diagram' | 'adoptionMapVideo';

/** Top row: System flow (diagram). Bottom row wide tile: Mobile flow (school adoption map video). */
function SystemFlowCard({
  media = 'diagram',
}: {
  media?: SystemFlowMedia;
}) {
  const plusTarget =
    media === 'adoptionMapVideo' ? 'adopt-section-school-map' : 'adopt-section-system';
  const plusLabel =
    media === 'adoptionMapVideo' ? 'View school adoption map section' : 'View system architecture';

  const heading = media === 'adoptionMapVideo' ? 'Mobile flow' : 'System flow';

  return (
    <article className={`${cardShell} h-full`}>
      <header className="mb-3 text-left">
        <h3 className="font-heading mb-2 text-[length:var(--text-h3)] leading-snug text-[var(--color-heading-h3)]">
          {heading}
        </h3>
        <p className="font-body text-[length:var(--text-body)] leading-relaxed tracking-[var(--tracking-body)] text-ink/85">
          {SYSTEM_FLOW_BODY}
        </p>
      </header>

      {media === 'diagram' ? (
        <div className="relative overflow-hidden rounded-xl border border-violet-500/15 bg-[radial-gradient(circle_at_50%_45%,rgba(196,181,253,0.28)_0%,rgba(196,181,253,0.1)_42%,rgba(248,249,250,0.98)_100%)] shadow-[0_0_0_1px_rgba(139,92,246,0.07),0_8px_28px_-10px_rgba(139,92,246,0.2)]">
          <div className="aspect-[960/520] w-full min-h-[160px] sm:min-h-[200px] lg:min-h-[240px]">
            <div className="flex h-full w-full items-center justify-center p-0.5 sm:p-px">
              <div className="h-full w-full origin-center scale-[1.06]">
                <AdoptPrototypeFlowDiagram className="h-full w-full" />
              </div>
            </div>
          </div>
          <QuickScanMediaPlusButton scrollTargetId={plusTarget} ariaLabel={plusLabel} />
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-xl border border-ink/20 bg-black shadow-[0_0_0_1px_rgba(20,20,20,0.06)]">
          <div className="aspect-[960/520] w-full min-h-[160px] sm:min-h-[200px] lg:min-h-[240px]">
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

/** Top row, right — Product design + QR entry. */
function ProductDesignCard() {
  return (
    <article className={`${cardShell} flex h-full min-h-0 flex-col`}>
      <header className="mb-3 text-left">
        <h3 className="font-heading mb-2 text-[length:var(--text-h3)] leading-snug text-[var(--color-heading-h3)]">
          Product design
        </h3>
        <p className="font-body text-[length:var(--text-body)] leading-relaxed tracking-[var(--tracking-body)] text-ink/85">
          {PRODUCT_DESIGN_BODY}
        </p>
      </header>
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl border border-ink/10 bg-ink/[0.02]">
        <img
          src={QR_ENTRY_IMAGE_SRC}
          alt="Physical prototype for QR entry into the Adopt-a-School flow."
          className="h-full w-full object-cover object-center"
          loading="lazy"
          decoding="async"
        />
        <QuickScanMediaPlusButton scrollTargetId="adopt-section-qr-entry" ariaLabel="View QR entry section" />
      </div>
    </article>
  );
}

/** Bottom row, left — Scalability + post-it synthesis image. */
function ScalabilityCard() {
  return (
    <article className={`${cardShell} flex h-full min-h-0 flex-col`}>
      <header className="mb-3 text-left">
        <h3 className="font-heading mb-2 text-[length:var(--text-h3)] leading-snug text-[var(--color-heading-h3)]">
          Scalability
        </h3>
        <p className="font-body text-[length:var(--text-body)] leading-relaxed tracking-[var(--tracking-body)] text-ink/85">
          {SCALABILITY_BODY}
        </p>
      </header>
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl border border-ink/10 bg-ink/[0.02]">
        <img
          src={POSTIT_SYNTHESIS_IMAGE_SRC}
          alt="Research synthesis wall with post-its and photos from field work."
          className="h-full w-full object-cover object-center"
          loading="lazy"
          decoding="async"
        />
        <QuickScanMediaPlusButton scrollTargetId="adopt-section-approach" ariaLabel="View research insights" />
      </div>
    </article>
  );
}

export default function AdoptQuickScan() {
  return (
    <div className="w-full min-w-0">
      {/*
        Row 1: System flow (wide) | Product design (QR entry).
        Row 2: Scalability (post-its) | Mobile flow (wide, video) — inverted (`col-start-2`).
      */}
      <div className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <div className="min-w-0 sm:col-span-2">
          <SystemFlowCard />
        </div>
        <div className="min-w-0 sm:col-span-1">
          <ProductDesignCard />
        </div>
        <div className="min-w-0 sm:col-span-1">
          <ScalabilityCard />
        </div>
        <div className="min-w-0 sm:col-span-2 sm:col-start-2">
          <SystemFlowCard media="adoptionMapVideo" />
        </div>
      </div>
    </div>
  );
}
