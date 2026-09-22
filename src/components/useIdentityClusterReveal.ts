import { useCallback, useEffect, useRef, useState, type FocusEvent } from 'react';

export type NameSlotPointerHandlers = {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onFocusCapture: () => void;
  onBlurCapture: (e: FocusEvent<HTMLDivElement>) => void;
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
  /** Immediate close (Escape). Does not remount the home mandala. */
  dismiss: () => void;
  nameButtonHandlers: NameButtonIdentityHandlers;
  identitySlotPointerHandlers: NameSlotPointerHandlers;
} {
  const [hoverOpen, setHoverOpen] = useState(false);
  const [coarsePointer, setCoarsePointer] = useState(false);
  const [mandalaSessionStamp, setMandalaSessionStamp] = useState(0);
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastFineCloseAtRef = useRef(0);
  const grabHoldRef = useRef(false);

  const LEAVE_GRACE_MS = 280;
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
    grabHoldRef.current = false;
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
    if (document.body.dataset.mandalaGrabbed === 'true') {
      grabHoldRef.current = true;
      return;
    }
    clearLeaveTimer();
    leaveTimerRef.current = setTimeout(() => {
      setHoverOpen(false);
      if (!coarsePointer) {
        lastFineCloseAtRef.current = performance.now();
      }
    }, LEAVE_GRACE_MS);
  }, [clearLeaveTimer, coarsePointer]);

  useEffect(() => {
    const syncGrabHold = () => {
      if (document.body.dataset.mandalaGrabbed === 'true') {
        clearLeaveTimer();
        setHoverOpen(true);
        return;
      }
      if (grabHoldRef.current) {
        grabHoldRef.current = false;
        close();
      }
    };
    const obs = new MutationObserver(syncGrabHold);
    obs.observe(document.body, { attributes: true, attributeFilter: ['data-mandala-grabbed'] });
    return () => obs.disconnect();
  }, [clearLeaveTimer, close]);

  const dismiss = useCallback(() => {
    grabHoldRef.current = false;
    clearLeaveTimer();
    setHoverOpen(false);
    if (!coarsePointer) {
      lastFineCloseAtRef.current = performance.now();
    }
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
    onFocusCapture: open,
    onBlurCapture: (e) => {
      const next = e.relatedTarget as Node | null;
      if (next && e.currentTarget.contains(next)) return;
      close();
    },
  };

  return {
    identityRevealed,
    mandalaSessionStamp,
    dismiss,
    nameButtonHandlers,
    identitySlotPointerHandlers,
  };
}
