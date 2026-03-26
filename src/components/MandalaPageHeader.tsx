import { ArrowLeft } from 'lucide-react';
import MandalaBanner from './MandalaBanner';

export type MandalaPageHeaderProps = {
  onBack: () => void;
};

/**
 * Shared header for full-page editorial views (Designing with AI, Touchpoints, Adopt).
 * Banner fills the container; Back button is embedded top-left over the banner.
 */
export default function MandalaPageHeader({ onBack }: MandalaPageHeaderProps) {
  return (
    <header
      className="shrink-0 flex flex-col border-b border-ink/20 relative overflow-hidden"
      style={{ backgroundColor: '#F8F9FA' }}
    >
      <div className="flex-1 flex min-h-0 min-w-0 w-full">
        <MandalaBanner />
      </div>
      <button
        type="button"
        data-cursor="hand"
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
