import { useState, type MouseEventHandler } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import AdoptPrototypeFlowDiagram from './AdoptPrototypeFlowDiagram';
import AdoptSystemDiagram from './AdoptSystemDiagram';
import ExpandMediaButton from './ExpandMediaButton';
import { X } from 'lucide-react';

const SCHOOL_ADOPTION_MAP_VIDEO_SRC = '/adopt-a-school/school-adoption-map.mp4';

/** Same pair as the Prototype overview dual hero (physical + digital). */
const OVERVIEW_DISCOVERY_IMAGE_SRC = '/adopt-a-school/Hero-44-case-study.png';
const OVERVIEW_MOBILE_IMAGE_SRC = '/adopt-a-school/Hero33-case-study.png';

/** Context & intro rail — diagram-aligned marks (replace photo thumbnails). */
const STRIP_ICON_DISCOVERY = '/adopt-a-school/icons/Discovery-object.svg';
const STRIP_ICON_UX_UI = '/adopt-a-school/icons/ux-ui-enrollment.svg';
const STRIP_ICON_LAYERED_SYSTEM = '/adopt-a-school/icons/layered-system.svg';

/** Scope decorative strip — in-page targets for “Learn more”. */
const SCOPE_LEARN_MORE_PROCESS = '#adopt-process-overview';
const SCOPE_LEARN_MORE_SYSTEM = '#adopt-section-system-diagram';

function IntroContextStripVisual({
  variant,
  plain = false,
}: {
  variant: 'discovery' | 'mobile' | 'system';
  /** Flat fill — no gradients (Scope rail / simplified tiles). */
  plain?: boolean;
}) {
  const imgBase = 'pointer-events-none h-auto max-h-full w-auto max-w-full select-none object-contain object-center';
  const discoveryBg = plain
    ? 'bg-white'
    : 'bg-gradient-to-b from-white via-ink/[0.02] to-ink/[0.055]';
  const mobileBg = plain ? 'bg-white' : 'bg-gradient-to-br from-white via-ink/[0.02] to-ink/[0.06]';
  const systemBg = plain
    ? 'bg-white'
    : 'bg-[radial-gradient(ellipse_at_50%_40%,rgba(196,181,253,0.16)_0%,rgba(248,249,250,0.98)_70%)]';

  if (variant === 'discovery') {
    return (
      <div
        className={`absolute inset-0 flex items-center justify-center px-1.5 py-2 sm:px-2 sm:py-2.5 ${discoveryBg}`}
      >
        <img
          src={STRIP_ICON_DISCOVERY}
          alt=""
          width={42}
          height={60}
          className={`${imgBase} max-h-[min(72%,6.25rem)] w-[min(64%,3.875rem)] sm:max-h-[min(76%,6.75rem)] sm:w-[min(68%,4.125rem)]`}
          loading="lazy"
          decoding="async"
          aria-hidden
        />
      </div>
    );
  }
  if (variant === 'mobile') {
    return (
      <div
        className={`absolute inset-0 flex items-center justify-center px-1.5 py-2 sm:px-2 sm:py-2.5 ${mobileBg}`}
      >
        <img
          src={STRIP_ICON_UX_UI}
          alt=""
          width={62}
          height={59}
          className={`${imgBase} w-[min(80%,5.25rem)] max-w-[84%] sm:w-[min(82%,5.625rem)]`}
          loading="lazy"
          decoding="async"
          aria-hidden
        />
      </div>
    );
  }
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center px-1.5 py-2 sm:px-2 sm:py-2.5 ${systemBg}`}
    >
      <img
        src={STRIP_ICON_LAYERED_SYSTEM}
        alt=""
        width={44}
        height={38}
        className={`${imgBase} w-[min(74%,4.375rem)] max-h-[68%] sm:w-[min(78%,4.625rem)] sm:max-h-[72%]`}
        loading="lazy"
        decoding="async"
        aria-hidden
      />
    </div>
  );
}

/** Scope strip — uniform size, reduced contrast. All icons rendered at the same fixed dimensions. */
function ScopeStripIcon({ variant }: { variant: 'discovery' | 'mobile' | 'system' }) {
  const imgClass =
    'pointer-events-none h-[1.375rem] w-[1.375rem] select-none object-contain object-center opacity-70';

  if (variant === 'discovery') {
    return (
      <img src={STRIP_ICON_DISCOVERY} alt="" width={42} height={60} className={imgClass} loading="lazy" decoding="async" aria-hidden />
    );
  }
  if (variant === 'mobile') {
    return (
      <img src={STRIP_ICON_UX_UI} alt="" width={62} height={59} className={imgClass} loading="lazy" decoding="async" aria-hidden />
    );
  }
  return (
    <img src={STRIP_ICON_LAYERED_SYSTEM} alt="" width={44} height={38} className={imgClass} loading="lazy" decoding="async" aria-hidden />
  );
}

function ScopeDecorativeIconTile({
  variant,
}: {
  variant: 'discovery' | 'mobile' | 'system';
}) {
  const label =
    variant === 'discovery'
      ? 'Mission discovery object'
      : variant === 'mobile'
        ? 'Map-first enrollment UX'
        : 'System design overview';

  return (
    <div
      className="relative shrink-0 flex items-center justify-center"
      aria-label={label}
      role="group"
    >
      <div className="flex h-[3rem] w-[3rem] items-center justify-center rounded-full border border-ink/[0.13]">
        <ScopeStripIcon variant={variant} />
      </div>
    </div>
  );
}

const SYSTEM_FLOW_BODY =
  'End-to-end funnel diagram: where discovery, conversion, and ops reinforce each other—what we optimized first.';

/** Strip + inline copy for the system design overview artifact (canvas diagram, not the funnel card). */
const SYSTEM_DESIGN_OVERVIEW_COPY =
  'Comprehensive system map on canvas—poles, tendrils, and arcs from ambient discovery through ongoing support.';

const MOBILE_FLOW_BODY =
  'Map-first enrollment: shortens the path from curiosity to pledge so intent is captured before attention drops.';

const DISCOVERY_BODY =
  'Activation object: earns attention in noisy retail and retail-adjacent contexts, then hands off to the digital flow.';

/** Thumbnail-strip eyebrows (case study intro rail — Zilla; default + narrow vertical rail). */
export const STRIP_EYEBROW_DISCOVERY = 'Mission discovery object';
export const STRIP_EYEBROW_MOBILE = 'Map powered Ux/ui for enrollment';
export const STRIP_EYEBROW_SYSTEM = 'System design overview';

const stripEyebrowClass = 'adopt-prototype-strip-eyebrow';

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

type ThumbnailStripKey = 'discovery' | 'mobile' | 'system';

export type { ThumbnailStripKey };

const QUICK_SCAN_POPUP_TABS: Record<QuickScanPopupVariant, QuickScanTab[]> = {
  discovery: [
    {
      id: 'product-design',
      title: 'Product design',
      imageSrc: OVERVIEW_DISCOVERY_IMAGE_SRC,
      alt: 'Physical discovery: object as on-ramp to the program story in real environments.',
    },
    {
      id: 'testing',
      title: 'Testing',
      alt: 'In-context testing moment for discovery interactions.',
      imageSrc: '/adopt-a-school/Humanize-shot_IMG_9438.jpg',
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
      alt: 'School map flow: where geography and pledge UX meet for faster commitment.',
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

/** Inline system strip — same canonical lines as the portrait cards; maps to Product design / Testing / Implications. */
const SYSTEM_STRIP_INLINE_ROWS: { title: QuickScanTab['title']; body: string }[] = [
  { title: 'Product design', body: SYSTEM_DESIGN_OVERVIEW_COPY },
  { title: 'Testing', body: MOBILE_FLOW_BODY },
  { title: 'Implications', body: DISCOVERY_BODY },
];

const cardShellProminent =
  'rounded-lg border border-ink/[0.11] bg-white p-4 shadow-[0_2px_14px_rgba(12,21,40,0.055)] md:p-5';

function QuickScanMediaPlusButton({
  onClick,
  ariaLabel,
  expanded = false,
  compact = false,
}: {
  onClick: MouseEventHandler<HTMLButtonElement>;
  ariaLabel: string;
  expanded?: boolean;
  /** Smaller control for thumbnail strip (fits compact viewport layout). */
  compact?: boolean;
}) {
  return (
    <ExpandMediaButton
      expanded={expanded}
      className={`pointer-events-auto max-md:opacity-100 md:opacity-0 md:translate-y-0.5 md:transition md:duration-200 md:ease-out md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100 ${
        compact ? '!h-8 !w-8 min-h-0 text-[15px]' : ''
      }`.trim()}
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
        className="editorial-page relative flex min-h-0 w-full max-w-2xl max-h-[min(95vh,95dvh)] flex-col overflow-hidden rounded-lg border border-ink/12 bg-white shadow-[0_16px_48px_rgba(12,21,40,0.12)] sm:max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
        style={{ transformOrigin: '50% 100%' }}
        initial={{ opacity: 0, y: 18, scale: 0.982 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.99 }}
        transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
      >
        <button
          type="button"
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
                onClick={() => setSelectedTabId(tab.id)}
                className={`shrink-0 rounded-md px-3 py-1.5 font-body text-body font-medium leading-snug tracking-[var(--tracking-body)] transition-colors sm:px-3.5 sm:py-2 ${
                  selectedTabId === tab.id
                    ? 'border border-ink/18 bg-white text-ink shadow-[0_1px_0_rgba(12,21,40,0.04)]'
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
                  <div className="relative h-full w-full min-h-0 overflow-visible">
                    <AdoptSystemDiagram compact />
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

function getInlineRows(key: ThumbnailStripKey): { title: QuickScanTab['title']; body: string }[] {
  if (key === 'system') return SYSTEM_STRIP_INLINE_ROWS;
  return QUICK_SCAN_POPUP_TABS[key].map((t) => ({ title: t.title, body: t.alt }));
}

function ThumbnailStripInlinePanel({
  stripKey,
  onOpenFull,
}: {
  stripKey: ThumbnailStripKey;
  onOpenFull: () => void;
}) {
  const rows = getInlineRows(stripKey);
  const regionLabel =
    stripKey === 'discovery'
      ? 'Product and service design — prototype notes'
      : stripKey === 'mobile'
        ? 'Mobile activation — prototype notes'
        : 'System flow — prototype notes';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.22, ease: [0.22, 0.82, 0.24, 1] }}
      className="modal-scroll max-h-[min(45vh,22rem)] overflow-y-auto border-t border-ink/[0.06] bg-ink/[0.02] px-4 py-4 sm:px-5 md:px-6"
      role="region"
      aria-label={regionLabel}
    >
      <div className="mx-auto grid max-w-[920px] grid-cols-1 gap-5 md:grid-cols-3 md:gap-0 md:divide-x md:divide-ink/[0.08]">
        {rows.map((row, i) => (
          <div
            key={row.title}
            className={`md:px-6 ${i === 0 ? 'md:pl-0' : ''} ${i === rows.length - 1 ? 'md:pr-0' : ''}`}
          >
            <p className="adopt-card-title mb-0 text-ink">{row.title}</p>
            <p className="adopt-body mt-2.5 mb-0 max-w-[36ch] text-ink/76">{row.body}</p>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-4 flex max-w-[920px] justify-start border-t border-ink/[0.06] pt-3">
        <button
          type="button"
          onClick={onOpenFull}
          className="font-body text-body font-medium text-ink/72 underline decoration-ink/20 underline-offset-[0.22em] transition-colors hover:text-ink hover:decoration-ink/35"
        >
          Open full prototype view
        </button>
      </div>
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

function DiscoveryPortraitCard({
  onOpenPopup,
}: {
  onOpenPopup: (variant: QuickScanPopupVariant) => void;
}) {
  return (
    <article className={`${cardShellProminent} flex h-full min-h-0 flex-col overflow-hidden`}>
      <header className="mb-3.5 shrink-0 text-left md:mb-4">
        <h4 className="mb-1.5">Discovery</h4>
        <p className="adopt-card-lede max-w-measure">{DISCOVERY_BODY}</p>
      </header>
      <div className={`relative w-full overflow-hidden rounded-md bg-ink/[0.02] ${PORTRAIT_CARD_MEDIA_ASPECT}`}>
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

function MobileFirstPortraitCard({
  onOpenPopup,
}: {
  onOpenPopup: (variant: QuickScanPopupVariant) => void;
}) {
  return (
    <article className={`${cardShellProminent} flex h-full min-h-0 flex-col overflow-hidden`}>
      <header className="mb-3.5 shrink-0 text-left md:mb-4">
        <h4 className="mb-1.5">{MOBILE_FLOW_TITLE}</h4>
        <p className="adopt-card-lede max-w-measure">{MOBILE_FLOW_BODY}</p>
      </header>
      <div className={`relative w-full overflow-hidden rounded-md bg-ink/[0.02] ${PORTRAIT_CARD_MEDIA_ASPECT}`}>
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

function PrototypeThumbnailStrip({
  openInline,
  setOpenInline,
  onOpenPopup,
  progressiveMode = false,
  onProgressiveSelect,
  railCompressed = false,
  selectedRailKey = null,
  /** Desktop expanded detail: hide artifact rail; title lives in the detail column. */
  omitRailInDesktopDetail = false,
  staticDecorative = false,
}: {
  openInline: ThumbnailStripKey | null;
  setOpenInline: (k: ThumbnailStripKey | null) => void;
  onOpenPopup: (variant: QuickScanPopupVariant) => void;
  progressiveMode?: boolean;
  onProgressiveSelect?: (key: ThumbnailStripKey) => void;
  /** Narrow navigation rail while detail is open (fixed-height stage). */
  railCompressed?: boolean;
  selectedRailKey?: ThumbnailStripKey | null;
  omitRailInDesktopDetail?: boolean;
  /** Scope rail: no + controls or popups — quiet visual anchors only. */
  staticDecorative?: boolean;
}) {
  const toggle = (key: ThumbnailStripKey) => {
    if (staticDecorative) return;
    if (progressiveMode && onProgressiveSelect) {
      onProgressiveSelect(key);
      return;
    }
    setOpenInline(openInline === key ? null : key);
  };

  const openFullFor = (key: ThumbnailStripKey) => {
    if (staticDecorative) return;
    onOpenPopup(key === 'mobile' ? 'mobile' : 'discovery');
  };

  /** Same vertical step as meta rail (1.875rem); Scope uses a looser stack. */
  const stripBlockGapClass = 'gap-[1.875rem]';

  /** Thumbnail ↔ copy; `items-start` aligns eyebrow block with thumb top like meta dt/dd rhythm. */
  const moleculeRow =
    'flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4';

  /** Context & Intro Scope — icon left, eyebrow + body right; circle centred against the text block. */
  const scopeMoleculeRow = 'flex flex-row items-center gap-3 sm:gap-4';

  /** Compact thumb — 112×84 @ 4:3; radius 24px (viewport-dense strip). */
  const thumbShell =
    'group relative aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-3xl bg-ink/[0.035] shadow-[0_2px_12px_-4px_rgba(12,21,40,0.06)] outline-none ring-1 ring-ink/[0.06] focus-visible:ring-2 focus-visible:ring-ink/25';

  const thumbRail =
    'group relative aspect-[4/3] w-full max-w-[104px] shrink-0 overflow-hidden rounded-2xl bg-ink/[0.035] shadow-[0_2px_12px_-4px_rgba(12,21,40,0.06)] outline-none ring-1 ring-ink/[0.06] focus-visible:ring-2 focus-visible:ring-ink/25';

  const railItemShell = (key: ThumbnailStripKey) =>
    `${thumbRail} self-start transition-[box-shadow] duration-300 ease-out ${
      selectedRailKey === key ? 'ring-2 ring-ink/22 shadow-[0_0_0_1px_rgba(12,21,40,0.08)]' : ''
    }`;

  if (staticDecorative) {
    return (
      <div className="h-full w-full min-w-0" aria-label="Scope — mission object, enrollment UX, and system layers">
        <div className="adopt-scope-rail flex h-full w-full min-w-0 flex-col justify-between">
          <h3 className="adopt-alt-h3 mb-4 md:mb-5">End to end product &amp; service design</h3>
          <div className={scopeMoleculeRow}>
            <ScopeDecorativeIconTile variant="discovery" />
            <div className="min-w-0 flex-1">
              <p className={`${stripEyebrowClass} mb-1.5`}>{STRIP_EYEBROW_DISCOVERY}</p>
              <p className="adopt-body adopt-prototype-strip-copy mb-1.5 max-w-none line-clamp-2 leading-[1.45] text-ink/72">{DISCOVERY_BODY}</p>
              <a href={SCOPE_LEARN_MORE_PROCESS} className="text-link adopt-body" onClick={(e) => e.stopPropagation()}>Learn more</a>
            </div>
          </div>
          <div className={scopeMoleculeRow}>
            <ScopeDecorativeIconTile variant="mobile" />
            <div className="min-w-0 flex-1">
              <p className={`${stripEyebrowClass} mb-1.5`}>{STRIP_EYEBROW_MOBILE}</p>
              <p className="adopt-body adopt-prototype-strip-copy mb-1.5 max-w-none line-clamp-2 leading-[1.45] text-ink/72">{MOBILE_FLOW_BODY}</p>
              <a href={SCOPE_LEARN_MORE_PROCESS} className="text-link adopt-body" onClick={(e) => e.stopPropagation()}>Learn more</a>
            </div>
          </div>
          <div id="adopt-system-design-overview" className={`${scopeMoleculeRow} scroll-mt-6`}>
            <ScopeDecorativeIconTile variant="system" />
            <div className="min-w-0 flex-1">
              <p className={`${stripEyebrowClass} mb-1.5`}>{STRIP_EYEBROW_SYSTEM}</p>
              <p className="adopt-body adopt-prototype-strip-copy mb-1.5 max-w-none line-clamp-2 leading-[1.45] text-ink/72">{SYSTEM_DESIGN_OVERVIEW_COPY}</p>
              <a href={SCOPE_LEARN_MORE_SYSTEM} className="text-link adopt-body" onClick={(e) => e.stopPropagation()}>Learn more</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (railCompressed && progressiveMode && omitRailInDesktopDetail) {
    return (
      <div
        className="h-full min-h-0 w-full min-w-0 shrink-0"
        aria-hidden
      />
    );
  }

  if (railCompressed) {
    return (
      <nav
        className="flex h-full min-h-0 w-full flex-col items-stretch gap-3 overflow-y-auto overflow-x-hidden py-0.5 pr-0.5 text-left"
        aria-label="Case study artifacts"
      >
        <div className="flex flex-col items-start gap-2 border-b border-ink/[0.06] pb-3">
          <div className={railItemShell('discovery')} tabIndex={0}>
            <IntroContextStripVisual variant="discovery" />
            <div className="absolute bottom-1.5 right-1.5 z-10">
              <QuickScanMediaPlusButton
                compact
                expanded={selectedRailKey === 'discovery'}
                onClick={(e) => {
                  e.stopPropagation();
                  toggle('discovery');
                }}
                ariaLabel="Open activation object detail"
              />
            </div>
          </div>
          <p className={`${stripEyebrowClass} mb-0 max-w-none text-pretty`}>{STRIP_EYEBROW_DISCOVERY}</p>
        </div>

        <div className="flex flex-col items-start gap-2 border-b border-ink/[0.06] pb-3">
          <div className={railItemShell('mobile')} tabIndex={0}>
            <IntroContextStripVisual variant="mobile" />
            <div className="absolute bottom-1.5 right-1.5 z-10">
              <QuickScanMediaPlusButton
                compact
                expanded={selectedRailKey === 'mobile'}
                onClick={(e) => {
                  e.stopPropagation();
                  toggle('mobile');
                }}
                ariaLabel="Open map-first enrollment detail"
              />
            </div>
          </div>
          <p className={`${stripEyebrowClass} mb-0 max-w-none text-pretty`}>{STRIP_EYEBROW_MOBILE}</p>
        </div>

        <div className="mt-1 flex flex-col items-start gap-2 pb-1">
          <div className={railItemShell('system')} tabIndex={0}>
            <IntroContextStripVisual variant="system" />
            <div className="absolute bottom-1.5 right-1.5 z-10">
              <QuickScanMediaPlusButton
                compact
                expanded={selectedRailKey === 'system'}
                onClick={(e) => {
                  e.stopPropagation();
                  toggle('system');
                }}
                ariaLabel="Open system design overview detail"
              />
            </div>
          </div>
          <p className={`${stripEyebrowClass} mb-0 max-w-none text-pretty`}>{STRIP_EYEBROW_SYSTEM}</p>
        </div>
      </nav>
    );
  }

  return (
    <div className="w-full min-w-0">
      <div className={`flex w-full min-w-0 flex-col ${stripBlockGapClass}`}>
        <div className={moleculeRow}>
          <div className={`${thumbShell}`} tabIndex={0}>
            <IntroContextStripVisual variant="discovery" />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/20 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
              aria-hidden
            />
            <div className="absolute bottom-2 right-2 z-10">
              <QuickScanMediaPlusButton
                compact
                expanded={openInline === 'discovery'}
                onClick={(e) => {
                  e.stopPropagation();
                  toggle('discovery');
                }}
                ariaLabel={
                  progressiveMode
                    ? 'Open activation object detail'
                    : 'Toggle product and service design prototype notes'
                }
              />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className={`${stripEyebrowClass} mb-2`}>{STRIP_EYEBROW_DISCOVERY}</p>
            <p className="adopt-body adopt-prototype-strip-copy mb-0 max-w-none leading-[1.45]">
              {DISCOVERY_BODY}
            </p>
          </div>
        </div>

        <div className={moleculeRow}>
          <div className={`${thumbShell}`} tabIndex={0}>
            <IntroContextStripVisual variant="mobile" />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/20 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
              aria-hidden
            />
            <div className="absolute bottom-2 right-2 z-10">
              <QuickScanMediaPlusButton
                compact
                expanded={openInline === 'mobile'}
                onClick={(e) => {
                  e.stopPropagation();
                  toggle('mobile');
                }}
                ariaLabel={
                  progressiveMode ? 'Open map-first enrollment detail' : 'Toggle mobile activation prototype notes'
                }
              />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className={`${stripEyebrowClass} mb-2`}>{STRIP_EYEBROW_MOBILE}</p>
            <p className="adopt-body adopt-prototype-strip-copy mb-0 max-w-none leading-[1.45]">
              {MOBILE_FLOW_BODY}
            </p>
          </div>
        </div>

        <div id="adopt-system-design-overview" className={`${moleculeRow} scroll-mt-6`}>
          <div className={`${thumbShell}`} tabIndex={0}>
            <IntroContextStripVisual variant="system" />
            <div className="absolute bottom-2 right-2 z-10">
              <QuickScanMediaPlusButton
                compact
                expanded={openInline === 'system'}
                onClick={(e) => {
                  e.stopPropagation();
                  toggle('system');
                }}
                ariaLabel={
                  progressiveMode ? 'Open system design overview detail' : 'Toggle system flow prototype notes'
                }
              />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className={`${stripEyebrowClass} mb-2`}>{STRIP_EYEBROW_SYSTEM}</p>
            <p className="adopt-body adopt-prototype-strip-copy mb-0 max-w-none leading-[1.45]">
              {SYSTEM_DESIGN_OVERVIEW_COPY}
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!progressiveMode && openInline ? (
          <div className="mt-6 w-full min-w-0">
            <ThumbnailStripInlinePanel
              key={openInline}
              stripKey={openInline}
              onOpenFull={() => {
                openFullFor(openInline);
                setOpenInline(null);
              }}
            />
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export type AdoptQuickScanProps = {
  thumbnailStrip?: boolean;
  /** When true with thumbnailStrip: + opens in-page progressive detail (no modal, no inline accordion). */
  thumbnailStripProgressive?: boolean;
  onThumbnailProgressive?: (key: ThumbnailStripKey) => void;
  /** Compress strip into a narrow rail (detail open, bounded stage). */
  thumbnailStripRailCompressed?: boolean;
  thumbnailStripSelectedKey?: ThumbnailStripKey | null;
  /** Desktop expanded detail: hide artifact thumbnails/tabs in the rail. */
  thumbnailStripOmitRailInDesktopDetail?: boolean;
  /** Scope rail only: no +, popups, or keyboard affordances on artifact tiles. */
  thumbnailStripDecorative?: boolean;
};

export default function AdoptQuickScan({
  thumbnailStrip = false,
  thumbnailStripProgressive = false,
  onThumbnailProgressive,
  thumbnailStripRailCompressed = false,
  thumbnailStripSelectedKey = null,
  thumbnailStripOmitRailInDesktopDetail = false,
  thumbnailStripDecorative = false,
}: AdoptQuickScanProps) {
  const [activePopup, setActivePopup] = useState<QuickScanPopupVariant | null>(null);
  const [openInline, setOpenInline] = useState<ThumbnailStripKey | null>(null);

  if (thumbnailStrip) {
    return (
      <div className={`${thumbnailStripDecorative ? 'h-full' : ''} w-full min-w-0`}>
        <PrototypeThumbnailStrip
          openInline={openInline}
          setOpenInline={setOpenInline}
          onOpenPopup={(v) => {
            setActivePopup(v);
          }}
          progressiveMode={thumbnailStripDecorative ? false : thumbnailStripProgressive}
          onProgressiveSelect={thumbnailStripDecorative ? undefined : onThumbnailProgressive}
          railCompressed={thumbnailStripDecorative ? false : thumbnailStripRailCompressed}
          selectedRailKey={thumbnailStripDecorative ? null : thumbnailStripSelectedKey}
          omitRailInDesktopDetail={thumbnailStripDecorative ? false : thumbnailStripOmitRailInDesktopDetail}
          staticDecorative={thumbnailStripDecorative}
        />
        <AnimatePresence>
          {!thumbnailStripDecorative && !thumbnailStripProgressive && activePopup ? (
            <QuickScanFeaturedPopup variant={activePopup} onClose={() => setActivePopup(null)} />
          ) : null}
        </AnimatePresence>
      </div>
    );
  }

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
