import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import MandalaBanner from './MandalaBanner';

export type MandalaPageHeaderProps = {
  onBack: () => void;
  /** When set, replaces the default Mandala banner (e.g. case study hero image). */
  banner?: ReactNode;
};

/**
 * Shared header for full-page editorial views (Designing with AI, Touchpoints, Adopt).
 * Banner fills the container; Back button is embedded top-left over the banner.
 * Pass `banner={null}` for a slim bar with no banner (Back only).
 */
export default function MandalaPageHeader({ onBack, banner }: MandalaPageHeaderProps) {
  const showDefaultBanner = banner === undefined;
  const showNoBanner = banner === null;
  return (
    <header
      className="shrink-0 flex flex-col border-b border-ink/20 relative overflow-hidden"
      style={{ backgroundColor: '#F8F9FA' }}
    >
      <div
        className={`flex min-w-0 w-full ${showNoBanner ? 'min-h-14 shrink-0' : 'min-h-0 flex-1'}`}
      >
        {showDefaultBanner ? <MandalaBanner /> : banner}
      </div>
      <button
        type="button"
        onClick={onBack}
        className="absolute top-0 left-0 z-10 p-4 md:p-6 label hover:opacity-100 transition-opacity flex items-center gap-2"
        aria-label="Back"
      >
        <ArrowLeft size={14} />
        Back
      </button>
    </header>
  );
}
