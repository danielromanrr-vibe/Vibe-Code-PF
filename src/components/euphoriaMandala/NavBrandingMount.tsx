import Mandala from '../Mandala';

type NavBrandingMountProps = {
  /** Must match unique ids across concurrent strips (see TopNavStrip). */
  anchorId: string;
  className?: string;
  /**
   * When `false`, tiny-state mandala does not paint or accept grab (identity cluster nested).
   * @default true
   */
  identityRevealed?: boolean;
  /**
   * Nav chip enforces a minimum interactive footprint (`min-h/w-[2.25rem]`).
   * Disable for em-scaled slots (e.g. hero portrait) so the mandala matches the photo bounds.
   * @default true
   */
  enforceNavMinTouchTarget?: boolean;
};

/**
 * **Nav overlay shell** — frameless; the mandala paints on a fixed canvas (clipped to `#anchorId`).
 * No ring/shadow here so the identity slot reads as pure glyph, not a chip.
 *
 * Rendering lives in `Mandala` (canvas portaled to `document.body` so `backdrop-filter` on the strip cannot
 * trap fixed positioning). Tiny state clips to `#anchorId`; activation removes clip and raises z-index above
 * typical in-app overlays.
 */
export default function NavBrandingMount({
  anchorId,
  className = '',
  identityRevealed = true,
  enforceNavMinTouchTarget = true,
}: NavBrandingMountProps) {
  const touchFloor =
    enforceNavMinTouchTarget !== false ? 'min-h-[2.25rem] min-w-[2.25rem]' : 'min-h-0 min-w-0';

  return (
    <div
      className={[
        // No opaque fill: the mandala is drawn on a fixed full-viewport canvas (clipped to #anchorId).
        // A frosted bg here was stacking above the canvas and hid the glyph entirely.
        'pointer-events-none relative z-[192] flex h-9 w-9 shrink-0 items-center justify-center bg-transparent',
        className,
      ]
        .join(' ')
        .trim()}
      title="Interactive logo — click or drag the mandala to open Euphoria"
    >
      <div
        className={`pointer-events-auto relative isolate z-0 flex h-full w-full cursor-pointer items-center justify-center ${touchFloor}`}
        aria-label="Euphoria mandala control — click or drag to interact"
      >
        <Mandala
          variant="navIntegrated"
          anchorId={anchorId}
          navPresentation="overlay"
          identityRevealed={identityRevealed}
        />
      </div>
      <span className="sr-only">Euphoria mandala, interactive. Activate to use the full canvas.</span>
    </div>
  );
}
