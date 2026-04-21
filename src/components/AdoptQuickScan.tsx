import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import AdoptPrototypeFlowDiagram from './AdoptPrototypeFlowDiagram';
import AdoptSystemDiagram from './AdoptSystemDiagram';
import ExpandMediaButton from './ExpandMediaButton';
import { X } from 'lucide-react';

const SCHOOL_ADOPTION_MAP_VIDEO_SRC = '/adopt-a-school/school-adoption-map.mp4';

/** Same pair as the Prototype overview dual hero (physical + digital). */
const OVERVIEW_DISCOVERY_IMAGE_SRC = '/adopt-a-school/Hero-44-case-study.png';
const OVERVIEW_MOBILE_IMAGE_SRC = '/adopt-a-school/Hero33-case-study.png';

const SYSTEM_FLOW_BODY = 'Discovery object, mobile flow, participation system';

const MOBILE_FLOW_BODY = 'School map: interest through enrollment—mobile-first.';

const DISCOVERY_BODY = 'A shared object links physical spaces to the digital flow.';

const MOBILE_FLOW_TITLE = 'Mobile-first activation';

/** Portrait media well — matches tall overview tiles; image keeps intrinsic ratio inside. */
const PORTRAIT_CARD_MEDIA_ASPECT = 'aspect-[3/4]';

type QuickScanPopupVariant = 'discovery' | 'mobile';
type QuickScanTab = {
  id: 'product-design' | 'testing' | 'implications';
  title: 'Product design' | 'Testing' | 'Implications';
  imageSrc: string;
  alt: string;
};

const QUICK_SCAN_POPUP_TABS: Record<QuickScanPopupVariant, QuickScanTab[]> = {
  discovery: [
    {
      id: 'product-design',
      title: 'Product design',
      imageSrc: OVERVIEW_DISCOVERY_IMAGE_SRC,
      alt: 'Physical discovery — activation object in context.',
    },
    {
      id: 'testing',
      title: 'Testing',
      imageSrc: '/adopt-a-school/Humanize-shot_IMG_9438.jpg',
      alt: 'In-context testing moment for discovery interactions.',
    },
    {
      id: 'implications',
      title: 'Implications',
      imageSrc: '/adopt-a-school/Humanize-shot_IMG_9444.jpg',
      alt: 'Implications artifact from discovery and service testing.',
    },
  ],
  mobile: [
    {
      id: 'product-design',
      title: 'Product design',
      imageSrc: OVERVIEW_MOBILE_IMAGE_SRC,
      alt: 'School adoption map — video walkthrough.',
    },
    {
      id: 'testing',
      title: 'Testing',
      imageSrc: '/adopt-a-school/Humanize-shot_IMG_9409.jpg',
      alt: 'Mobile flow testing snapshot with interface and environment.',
    },
    {
      id: 'implications',
      title: 'Implications',
      imageSrc: '/adopt-a-school/Humanize-shot_IMG_9454.jpg',
      alt: 'Implications view for the mobile participation flow.',
    },
  ],
};

const cardShellProminent =
  'rounded-lg border border-ink/[0.11] bg-white p-4 shadow-[0_2px_14px_rgba(20,20,20,0.055)] md:p-5';

function QuickScanMediaPlusButton({
  onClick,
  ariaLabel,
}: {
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <ExpandMediaButton
      className="absolute bottom-2 right-2 z-10"
      aria-label={ariaLabel}
      onClick={onClick}
    />
  );
}

function QuickScanFeaturedPopup({
  variant,
  onClose,
}: {
  variant: QuickScanPopupVariant;
  onClose: () => void;
}) {
  const tabs = QUICK_SCAN_POPUP_TABS[variant];
  const [selectedTabId, setSelectedTabId] = useState<QuickScanTab['id']>(tabs[0].id);
  const activeTab = tabs.find((tab) => tab.id === selectedTabId) ?? tabs[0];
  const title = variant === 'discovery' ? 'Discovery deep dive' : 'Mobile deep dive';
  const showSystemArchitectureDiagram = variant === 'discovery' && selectedTabId === 'product-design';
  const showMobileMapVideo = variant === 'mobile' && selectedTabId === 'product-design';

  return (
    <motion.div
      className="fixed inset-0 z-[220] flex items-center justify-center p-4"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <motion.div
        className="absolute inset-0 bg-ink/45"
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.32, ease: 'easeOut' }}
      />
      <motion.div
        className="editorial-page relative flex min-h-0 w-full max-w-2xl max-h-[min(95vh,95dvh)] flex-col overflow-hidden rounded-lg border border-ink/12 bg-white shadow-[0_16px_48px_rgba(20,20,20,0.12)] sm:max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
        style={{ transformOrigin: '50% 100%' }}
        initial={{ opacity: 0, y: 18, scale: 0.982 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.99 }}
        transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
      >
        <button
          type="button"
          data-cursor="hand"
          onClick={onClose}
          className="absolute right-[max(0.25rem,env(safe-area-inset-right))] top-[max(0.25rem,env(safe-area-inset-top))] z-10 rounded-full p-3 text-ink/60 transition-colors hover:bg-ink/10 hover:text-ink md:p-4"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="border-b border-ink/10 px-4 pb-2 pt-10 sm:px-5 sm:pt-6">
          <h3 className="mb-4 pr-12 text-balance">{title}</h3>
          <div className="flex gap-1.5 overflow-x-auto overflow-y-visible py-2 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] sm:flex-wrap sm:overflow-visible [&::-webkit-scrollbar]:hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                data-cursor="hand"
                onClick={() => setSelectedTabId(tab.id)}
                className={`shrink-0 rounded-md px-3 py-1.5 font-body text-body font-medium leading-snug tracking-[var(--tracking-body)] transition-colors sm:px-3.5 sm:py-2 ${
                  selectedTabId === tab.id
                    ? 'border border-ink/18 bg-white text-ink shadow-[0_1px_0_rgba(20,20,20,0.04)]'
                    : 'border border-transparent bg-ink/[0.04] text-ink/75 hover:bg-ink/[0.07] hover:text-ink'
                }`}
              >
                {tab.title}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-4 sm:px-5">
          <div className="w-full overflow-hidden rounded-md border border-ink/12 bg-ink/[0.02]">
            <div className="aspect-[4/3] w-full">
              {showSystemArchitectureDiagram ? (
                <div className="relative h-full w-full min-h-[320px] bg-[rgb(250,250,249)] p-1.5 sm:p-2">
                  <div className="relative h-full w-full overflow-visible">
                    <AdoptSystemDiagram />
                  </div>
                </div>
              ) : showMobileMapVideo ? (
                <div className="relative flex h-full min-h-[240px] w-full items-center justify-center bg-black">
                  <video
                    className="h-full w-full max-h-full object-contain object-center"
                    src={SCHOOL_ADOPTION_MAP_VIDEO_SRC}
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                    aria-label="Screen recording of the school adoption map flow."
                  />
                </div>
              ) : (
                <img
                  src={activeTab.imageSrc}
                  alt={activeTab.alt}
                  className="h-full w-full object-cover object-center"
                  loading="eager"
                  decoding="async"
                />
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * Landscape system-flow row — same diagram + behavior as before; height tuned to feel
 * comparable to the portrait activation tiles above (wide strip, not a thin sliver).
 */
function SystemFlowCard({
  onOpenPopup,
}: {
  onOpenPopup: (variant: QuickScanPopupVariant) => void;
}) {
  return (
    <article className={`${cardShellProminent} h-full`}>
      <header className="mb-3.5 text-left md:mb-4">
        <h4 className="mb-1.5">System flow</h4>
        <p className="adopt-card-lede max-w-measure">{SYSTEM_FLOW_BODY}</p>
      </header>

      <div className="relative overflow-hidden rounded-md border border-violet-400/12 bg-[radial-gradient(circle_at_50%_45%,rgba(196,181,253,0.22)_0%,rgba(196,181,253,0.08)_42%,rgba(248,249,250,0.98)_100%)] shadow-[0_0_0_1px_rgba(139,92,246,0.05)]">
        <div className="aspect-[960/520] w-full min-h-[240px] sm:min-h-[280px] md:min-h-[300px] lg:min-h-[340px]">
          <div className="flex h-full w-full min-h-0 items-center justify-center p-0.5 sm:p-px">
            <AdoptPrototypeFlowDiagram className="h-full w-full min-h-0" />
          </div>
        </div>
        <QuickScanMediaPlusButton
          onClick={() => onOpenPopup('discovery')}
          ariaLabel="Open discovery deep dive popup"
        />
      </div>
    </article>
  );
}

function DiscoveryPortraitCard({ onOpenPopup }: { onOpenPopup: (variant: QuickScanPopupVariant) => void }) {
  return (
    <article className={`${cardShellProminent} flex h-full min-h-0 flex-col overflow-hidden`}>
      <header className="mb-3.5 shrink-0 text-left md:mb-4">
        <h4 className="mb-1.5">Discovery</h4>
        <p className="adopt-card-lede max-w-measure">{DISCOVERY_BODY}</p>
      </header>
      <div
        className={`relative w-full overflow-hidden rounded-md bg-ink/[0.02] ${PORTRAIT_CARD_MEDIA_ASPECT}`}
      >
        <img
          src={OVERVIEW_DISCOVERY_IMAGE_SRC}
          alt="Physical discovery — Backpack Brigade activation object (overview)."
          className="absolute inset-0 h-full w-full object-contain object-center"
          loading="lazy"
          decoding="async"
        />
        <QuickScanMediaPlusButton onClick={() => onOpenPopup('discovery')} ariaLabel="Open discovery deep dive popup" />
      </div>
    </article>
  );
}

function MobileFirstPortraitCard({ onOpenPopup }: { onOpenPopup: (variant: QuickScanPopupVariant) => void }) {
  return (
    <article className={`${cardShellProminent} flex h-full min-h-0 flex-col overflow-hidden`}>
      <header className="mb-3.5 shrink-0 text-left md:mb-4">
        <h4 className="mb-1.5">{MOBILE_FLOW_TITLE}</h4>
        <p className="adopt-card-lede max-w-measure">{MOBILE_FLOW_BODY}</p>
      </header>
      <div
        className={`relative w-full overflow-hidden rounded-md bg-ink/[0.02] ${PORTRAIT_CARD_MEDIA_ASPECT}`}
      >
        <img
          src={OVERVIEW_MOBILE_IMAGE_SRC}
          alt="Mobile-first activation — Hero33 overview."
          className="absolute inset-0 h-full w-full object-contain object-center"
          loading="lazy"
          decoding="async"
        />
        <QuickScanMediaPlusButton onClick={() => onOpenPopup('mobile')} ariaLabel="Open mobile deep dive popup" />
      </div>
    </article>
  );
}

export default function AdoptQuickScan() {
  const [activePopup, setActivePopup] = useState<QuickScanPopupVariant | null>(null);

  return (
    <div className="w-full min-w-0">
      <div className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:items-stretch sm:gap-3.5">
        <div className="min-w-0 sm:pr-0.5">
          <DiscoveryPortraitCard onOpenPopup={setActivePopup} />
        </div>
        <div className="min-w-0 sm:pl-0.5">
          <MobileFirstPortraitCard onOpenPopup={setActivePopup} />
        </div>
        <div className="min-w-0 sm:col-span-2 sm:pt-0.5">
          <SystemFlowCard onOpenPopup={setActivePopup} />
        </div>
      </div>

      <AnimatePresence>
        {activePopup ? <QuickScanFeaturedPopup variant={activePopup} onClose={() => setActivePopup(null)} /> : null}
      </AnimatePresence>
    </div>
  );
}
