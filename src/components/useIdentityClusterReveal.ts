import { useCallback, useEffect, useRef, useState, type FocusEvent } from 'react';

export type NameSlotPointerHandlers = {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

export type NameButtonIdentityHandlers = {
  onMouseEnter: () => void;
  onFocus: () => void;
  onBlur: (e: FocusEvent<HTMLButtonElement>) => void;
};

/**
 * Identity slot: **default = name**; **hover/focus on the name** shows the mandala in the same slot.
 * **Coarse pointer:** mandala stays available (no hover). `(hover: none)` alone is not used — it misclassifies many desktops.
 *
 * **`mandalaSessionStamp`** increments on intentional fine-pointer reveals (with jitter guard). Pass to `key`
 * on `NavBrandingMount` so most reveals mount a fresh mandala, without churn from edge flicker.
 */
export function useIdentityClusterReveal(): {
  identityRevealed: boolean;
  /** Bump when identity goes false→true (new mandala instance). Stable for coarse-only sessions. */
  mandalaSessionStamp: number;
  nameButtonHandlers: NameButtonIdentityHandlers;
  identitySlotPointerHandlers: NameSlotPointerHandlers;
} {
  const [hoverOpen, setHoverOpen] = useState(false);
  const [coarsePointer, setCoarsePointer] = useState(false);
  const [mandalaSessionStamp, setMandalaSessionStamp] = useState(0);
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastFineCloseAtRef = useRef(0);

  const LEAVE_GRACE_MS = 100;
  const REMOUNT_JITTER_GUARD_MS = 140;

  useEffect(() => {
    const coarseMq = window.matchMedia('(pointer: coarse)');
    const sync = () => setCoarsePointer(coarseMq.matches);
    sync();
    coarseMq.addEventListener('change', sync);
    return () => coarseMq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    return () => {
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    };
  }, []);

  const identityRevealed = coarsePointer || hoverOpen;

  const clearLeaveTimer = useCallback(() => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
  }, []);

  const open = useCallback(() => {
    clearLeaveTimer();
    setHoverOpen(true);
    // Avoid remount churn from tiny leave/enter jitter near the slot edge.
    if (!coarsePointer) {
      const now = performance.now();
      if (now - lastFineCloseAtRef.current > REMOUNT_JITTER_GUARD_MS) {
        setMandalaSessionStamp((n) => n + 1);
      }
    }
  }, [clearLeaveTimer, coarsePointer]);

  const close = useCallback(() => {
    clearLeaveTimer();
    leaveTimerRef.current = setTimeout(() => {
      setHoverOpen(false);
      if (!coarsePointer) {
        lastFineCloseAtRef.current = performance.now();
      }
    }, LEAVE_GRACE_MS);
  }, [clearLeaveTimer, coarsePointer]);

  const nameButtonHandlers: NameButtonIdentityHandlers = {
    onMouseEnter: open,
    onFocus: open,
    onBlur: (e) => {
      const next = e.relatedTarget as Node | null;
      if (next && e.currentTarget.contains(next)) return;
      close();
    },
  };

  const identitySlotPointerHandlers: NameSlotPointerHandlers = {
    onMouseEnter: open,
    onMouseLeave: close,
  };

  return {
    identityRevealed,
    mandalaSessionStamp,
    nameButtonHandlers,
    identitySlotPointerHandlers,
  };
}
