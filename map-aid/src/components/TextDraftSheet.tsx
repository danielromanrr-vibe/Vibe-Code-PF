import React, { useEffect, useRef, useState } from 'react';
import { Check, Copy, MessageSquare } from 'lucide-react';
import type { Driver, School } from '../types';
import { buildDraft, formatPhone, mailtoHref, smsHref } from '../lib/volunteer';
import { Avatar, Button, ButtonLink, Sheet } from './ui';

/**
 * Nothing is sent from the prototype. "Open in Messages" hands the draft to
 * the device's SMS app; Hoyt still presses send.
 */
export function TextDraftSheet({
  driver,
  school,
  onClose,
  onCopied,
}: {
  driver: Driver;
  school?: School | null;
  onClose: () => void;
  onCopied: () => void;
  key?: React.Key;
}) {
  const [body, setBody] = useState(() => buildDraft(driver, school));
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (copiedTimer.current) clearTimeout(copiedTimer.current);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(body);
    } catch {
      textareaRef.current?.select();
      document.execCommand('copy');
    }
    setCopied(true);
    onCopied();
    if (copiedTimer.current) clearTimeout(copiedTimer.current);
    copiedTimer.current = setTimeout(() => setCopied(false), 1500);
  };

  const subject = school ? `Backpack Brigade: ${school.name}` : 'Backpack Brigade: route check';

  return (
    <Sheet onClose={onClose} labelledBy="text-draft-title" className="max-w-[420px]" initialFocusRef={textareaRef}>
      <div className="p-6">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0066cc]/[0.08] text-[#0066cc] flex items-center justify-center shrink-0">
            <MessageSquare className="w-[18px] h-[18px]" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h2 id="text-draft-title" className="text-[17px] font-semibold leading-tight">Text draft</h2>
            <p className="text-[13px] text-[#141414]/65 mt-0.5">Edit before it opens in Messages.</p>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <Avatar name={driver.name} size={32} />
          <div className="min-w-0">
            <div className="text-[13px] font-medium truncate">To {driver.name}</div>
            <div className="text-[12px] text-[#141414]/65 tabular-nums">{formatPhone(driver)}</div>
          </div>
        </div>

        <label htmlFor="text-draft-body" className="sr-only">Message</label>
        <textarea
          id="text-draft-body"
          ref={textareaRef}
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="surface-inset mt-3 w-full resize-none px-3.5 py-3 text-[13px] leading-relaxed text-[#141414] outline-none focus-visible:ring-2 focus-visible:ring-[#0066cc]/30"
        />

        <div className="mt-5 flex items-center gap-2">
          <ButtonLink variant="primary" icon={MessageSquare} href={smsHref(driver, body)} className="flex-1">
            Open in Messages
          </ButtonLink>
          <Button variant="secondary" icon={copied ? Check : Copy} onClick={copy} aria-live="polite">
            {copied ? 'Copied' : 'Copy'}
          </Button>
          <Button variant="quiet" onClick={onClose}>
            Cancel
          </Button>
        </div>

        {driver.email && (
          <div className="mt-3 text-center">
            <a
              href={mailtoHref(driver, subject, body)}
              className="text-[12px] font-medium text-[#0066cc] hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066cc]/30"
            >
              Send by email instead
            </a>
          </div>
        )}
      </div>
    </Sheet>
  );
}
