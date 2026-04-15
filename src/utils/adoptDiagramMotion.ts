/**
 * Shared motion phase for Adopt system diagram + atmosphere layer.
 * Keep formulas in sync with AdoptSystemDiagram render() / drawMandalaCore.
 * `tSec` = time in seconds (e.g. performance.now() / 1000).
 */

/** Matches diagram `breathFast` (0 when reduced motion). */
export function adoptBreathFast(tSec: number, rm: boolean): number {
  if (rm) return 0;
  return Math.sin(tSec * 1.05) * 0.5 + 0.5;
}

export function adoptPulseGlobal(tSec: number, rm: boolean): number {
  if (rm) return 0.35;
  return 0.35 + Math.sin(tSec * 2.2) * 0.1;
}

/** Same heartbeat as drawMandalaCore (Shared Mission mandala). */
export function adoptMandalaBeat(tSec: number, rm: boolean): number {
  if (rm) return 0.45;
  return Math.pow(Math.sin(tSec * 2.35), 2) * 0.55 + 0.45;
}

/** Slow outward pulse for center gravity field (0–1). */
export function adoptCenterPulse(tSec: number, rm: boolean): number {
  if (rm) return 0.5;
  return Math.sin(tSec * 1.15) * 0.5 + 0.5;
}
