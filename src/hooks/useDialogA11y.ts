import { useEffect, useRef, type MutableRefObject } from 'react';

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useDialogA11y(
  open: boolean,
  onClose: () => void,
  returnFocusRef: MutableRefObject<HTMLElement | null>,
) {
  const dialogRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    const previousFocus = document.activeElement as HTMLElement | null;

    const getFocusable = () =>
      Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => !el.hasAttribute('disabled') && el.offsetParent !== null,
      );

    const focusInitial = () => {
      const items = getFocusable();
      (items[0])?.focus();
      dialog.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    };

    const raf = requestAnimationFrame(focusInitial);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;

      const items = getFocusable();
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKeyDown);
      const returnEl = returnFocusRef.current;
      if (returnEl?.isConnected) {
        returnEl.focus();
      } else if (previousFocus?.isConnected) {
        previousFocus.focus();
      }
    };
  }, [open, onClose, returnFocusRef]);

  return dialogRef;
}
