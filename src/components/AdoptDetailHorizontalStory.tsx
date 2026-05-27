import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';
import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import AdoptSystemDiagram from './AdoptSystemDiagram';
import ExpandMediaButton from './ExpandMediaButton';
import type { ThumbnailStripKey } from './AdoptQuickScan';

const IMG_ACTIVATION = '/adopt-a-school/Hero-44-case-study.png';
const IMG_PHYSICAL = '/adopt-a-school/Hero2_Humanize-shot_IMG_9442.jpg';
const IMG_MOBILE_HAND = '/adopt-a-school/Hero33-case-study.png';
const MAP_VIDEO_SRC = '/adopt-a-school/school-adoption-map.mp4';
const IMG_OPS = '/adopt-a-school/Hero3_.jpg';

function startPanelIndex(key: ThumbnailStripKey): number {
  if (key === 'discovery') return 0;
  if (key === 'mobile') return 2;
  return 4;
}

const EASE: [number, number, number, number] = [0.33, 1, 0.68, 1];

export type AdoptBeatVisualKind = 'img-a' | 'img-p' | 'img-m' | 'video' | 'diagram' | 'img-o';

export type AdoptBeatPanelDef = {
  eyebrow: string;
  caption: string;
  insight?: string;
  visual: AdoptBeatVisualKind;
};

const PANELS: AdoptBeatPanelDef[] = [
  {
    eyebrow: 'Activation in context',
    caption: 'Curiosity starts where the object sits in the world.',
    insight: 'Readable before any URL.',
    visual: 'img-a',
  },
  {
    eyebrow: 'Physical attention moment',
    caption: 'Earn attention in the aisle, beside every other message.',
    visual: 'img-p',
  },
  {
    eyebrow: 'Mobile handoff',
    caption: 'From object to device without losing intent.',
    visual: 'img-m',
  },
  {
    eyebrow: 'Map-first school selection',
    caption: 'Geography makes the pledge legible before forms.',
    visual: 'video',
  },
  {
    eyebrow: 'Funnel / system diagram',
    caption: 'Discovery, conversion, and ops as one field.',
    visual: 'diagram',
  },
  {
    eyebrow: 'Operational implication',
    caption: 'Throughput and coordination define what the system must encode.',
    visual: 'img-o',
  },
];

export const ADOPT_BEAT_PANELS: readonly AdoptBeatPanelDef[] = PANELS;

function PanelVisual({
  kind,
  mediaClassName,
}: {
  kind: AdoptBeatVisualKind;
  /** Override default tall hero sizing (e.g. tabbed process overview). */
  mediaClassName?: string;
}) {
  const mediaClass =
    mediaClassName ??
    'h-full w-full min-h-[min(44vh,300px)] object-cover object-center md:min-h-[min(50vh,380px)]';
  if (kind === 'img-a') {
    return (
      <img
        src={IMG_ACTIVATION}
        alt="Activation object on counter — Backpack Brigade."
        className={mediaClass}
        loading="lazy"
        decoding="async"
      />
    );
  }
  if (kind === 'img-p') {
    return (
      <img
        src={IMG_PHYSICAL}
        alt="Volunteer with activation materials in the field."
        className={mediaClass}
        loading="lazy"
        decoding="async"
      />
    );
  }
  if (kind === 'img-m') {
    return (
      <img
        src={IMG_MOBILE_HAND}
        alt="Hand holding phone — enrollment surfaces."
        className={mediaClass}
        loading="lazy"
        decoding="async"
      />
    );
  }
  if (kind === 'video') {
    return (
      <video
        className={mediaClass}
        src={MAP_VIDEO_SRC}
        autoPlay
        muted
        loop
        playsInline
        controls
        aria-label="School adoption map — map-first enrollment."
      />
    );
  }
  if (kind === 'diagram') {
    return (
      <div
        className={
          mediaClassName
            ? 'h-full w-full min-h-[200px] max-h-[min(52vh,380px)] overflow-x-hidden bg-[rgb(250,250,249)] p-1 md:p-2'
            : 'h-[min(380px,52vh)] min-h-[min(44vh,260px)] w-full max-w-full overflow-x-hidden bg-[rgb(250,250,249)] p-1 md:h-[min(440px,54vh)] md:p-2'
        }
      >
        <AdoptSystemDiagram />
      </div>
    );
  }
  return (
    <img
      src={IMG_OPS}
      alt="Operations floor — physical coordination."
      className={mediaClass}
      loading="lazy"
      decoding="async"
    />
  );
}

const PROCESS_OVERVIEW_MEDIA_CLASS =
  'h-full w-full min-h-[200px] max-h-[min(48vh,320px)] object-cover object-center sm:min-h-[240px] sm:max-h-[min(50vh,340px)] md:min-h-[260px]';

/** Static beat visual for tabbed layouts (optional compact height). */
export function AdoptBeatMedia({ kind, compact }: { kind: AdoptBeatVisualKind; compact?: boolean }) {
  return <PanelVisual kind={kind} mediaClassName={compact ? PROCESS_OVERVIEW_MEDIA_CLASS : undefined} />;
}

/**
 * Scroll progress for each beat vs the scrollport focal line, in [-1, 1].
 * - `direct` follows scroll immediately (use for media parallax — no overshoot).
 * - `smooth` is spring-smoothed (captions / card softening).
 */
function useBeatScrollProgress(
  sectionRef: React.RefObject<HTMLElement | null>,
  scrollRef: React.RefObject<HTMLDivElement | null>,
  reduceMotion: boolean,
): { direct: MotionValue<number>; smooth: MotionValue<number> } {
  const raw = useMotionValue(0);
  const springConfig = useMemo(
    () =>
      reduceMotion
        ? { stiffness: 520, damping: 48, mass: 0.2 }
        : { stiffness: 38, damping: 22, mass: 0.42 },
    [reduceMotion],
  );
  const smooth = useSpring(raw, springConfig);

  useEffect(() => {
    const root = scrollRef.current;
    const panel = sectionRef.current;
    if (!root || !panel) return;

    const measure = () => {
      const rr = root.getBoundingClientRect();
      const pr = panel.getBoundingClientRect();
      const focalY = rr.top + rr.height * 0.38;
      const panelCenter = pr.top + pr.height * 0.42;
      const span = Math.max(rr.height * 0.58, 220);
      const t = Math.max(-1, Math.min(1, (focalY - panelCenter) / span));
      raw.set(t);
    };

    root.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    ro.observe(panel);
    measure();
    return () => {
      root.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
      ro.disconnect();
    };
  }, [raw, scrollRef, sectionRef]);

  return { direct: raw, smooth };
}

type ParallaxBeatProps = {
  panel: AdoptBeatPanelDef;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  reduceMotion: boolean;
};

const ParallaxBeat = forwardRef<HTMLElement, ParallaxBeatProps>(function ParallaxBeat(
  { panel, scrollRef, reduceMotion },
  forwardedRef,
) {
  const innerRef = useRef<HTMLElement | null>(null);
  const setRefs = useCallback(
    (node: HTMLElement | null) => {
      innerRef.current = node;
      if (typeof forwardedRef === 'function') forwardedRef(node);
      else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = node;
    },
    [forwardedRef],
  );

  const { direct, smooth } = useBeatScrollProgress(innerRef, scrollRef, reduceMotion);

  /** Spring-smoothed — chrome that can lag slightly without feeling like a loose crop. */
  const shellOpacity = useTransform(smooth, [-1, -0.4, 0.4, 1], [0.45, 1, 1, 0.5]);
  /** Keep floor higher so type stays readable when the beat is partly out of band. */
  const captionOpacity = useTransform(smooth, [-1, -0.35, 0.35, 1], [0.58, 1, 1, 0.55]);
  /** Slide the caption block in/out (translation only — no scale; avoids “pop from a point”). */
  const captionX = useTransform(
    smooth,
    [-1, -0.28, 0.28, 1],
    reduceMotion ? [0, 0, 0, 0] : [22, 0, 0, -14],
  );
  const captionY = useTransform(
    smooth,
    [-1, -0.32, 0.32, 1],
    reduceMotion ? [0, 0, 0, 0] : [14, 0, 0, -8],
  );

  /** Direct scroll tie-in: subtle parallax + gentle opacity — no spring, so the fill doesn’t “swim”. */
  const mediaY = useTransform(direct, [-1, 0, 1], reduceMotion ? [0, 0, 0] : [8, 0, -6]);
  const mediaOpacity = useTransform(
    direct,
    [-1, -0.42, -0.12, 0.2, 1],
    reduceMotion ? [1, 1, 1, 1, 1] : [0.82, 0.94, 1, 1, 0.9],
  );

  return (
    <motion.article
      ref={setRefs}
      className="relative mb-8 text-left last:mb-4 md:mb-10 md:last:mb-6"
      style={{ opacity: shellOpacity }}
    >
      <div className="relative isolate overflow-hidden rounded-2xl border border-ink/[0.08] bg-ink/[0.02] shadow-sm">
        <motion.div
          className="relative min-h-0 w-full origin-center scale-[1.02] will-change-transform motion-reduce:scale-100"
          style={{ y: mediaY, opacity: mediaOpacity }}
        >
          <PanelVisual kind={panel.visual} />
        </motion.div>

        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-start p-3 sm:p-4 md:p-5"
          style={{
            opacity: captionOpacity,
            x: captionX,
            y: captionY,
          }}
        >
          <div className="max-w-[min(100%,26rem)] rounded-full border border-ink/15 bg-white/[0.96] px-4 py-2.5 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.28)] backdrop-blur-md md:px-4 md:py-3">
            <p className="adopt-body mb-0 text-left font-medium leading-[1.45] text-ink">
              {panel.caption}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.article>
  );
});

type AdoptDetailHorizontalStoryProps = {
  selectedKey: ThumbnailStripKey;
  reduceMotion: boolean;
  /** Desktop expanded detail: show frosted − on the lead panel image (matches artifact +). */
  overviewCloseOnLeadMedia?: boolean;
  onOverviewClose?: () => void;
};

export default function AdoptDetailHorizontalStory({
  selectedKey,
  reduceMotion,
  overviewCloseOnLeadMedia = false,
  onOverviewClose,
}: AdoptDetailHorizontalStoryProps) {
  const detailRootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const beatRefs = useRef<(HTMLElement | null)[]>([]);
  const [progress, setProgress] = useState(0);

  const syncScrollChrome = useCallback(() => {
    const sc = scrollRef.current;
    if (!sc) return;
    const max = Math.max(0, sc.scrollHeight - sc.clientHeight);
    setProgress(max > 0 ? sc.scrollTop / max : 0);
  }, []);

  useLayoutEffect(() => {
    const sc = scrollRef.current;
    const idx = startPanelIndex(selectedKey);
    const el = beatRefs.current[idx];
    if (!sc || !el) return;
    sc.scrollTo({ top: el.offsetTop, behavior: 'auto' });
    syncScrollChrome();
  }, [selectedKey, syncScrollChrome]);

  useEffect(() => {
    const sc = scrollRef.current;
    if (!sc) return;
    syncScrollChrome();
    sc.addEventListener('scroll', syncScrollChrome, { passive: true });
    window.addEventListener('resize', syncScrollChrome);
    return () => {
      sc.removeEventListener('scroll', syncScrollChrome);
      window.removeEventListener('resize', syncScrollChrome);
    };
  }, [syncScrollChrome]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      const root = detailRootRef.current;
      const sc = scrollRef.current;
      if (!root || !sc) return;
      const ae = document.activeElement;
      if (!ae || (!root.contains(ae) && ae !== sc)) return;

      e.preventDefault();
      const step = Math.max(120, sc.clientHeight * 0.55);
      sc.scrollBy({ top: e.key === 'ArrowDown' ? step : -step, behavior: 'smooth' });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div
      ref={detailRootRef}
      data-adopt-horizontal-story
      className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden text-left"
    >
      <div
        ref={scrollRef}
        className="adopt-detail-story-scroll min-h-0 min-w-0 w-full flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain px-3 py-3 text-left outline-none sm:px-4 md:px-5 md:py-4"
        style={{ WebkitOverflowScrolling: 'touch' }}
        tabIndex={0}
        role="region"
        aria-roledescription="Vertical visual story"
        aria-label="Case study evidence — scroll vertically. Optional: Arrow up and down while focused here."
      >
        {overviewCloseOnLeadMedia && onOverviewClose ? (
          <div className="pointer-events-none sticky top-0 z-40 flex justify-end px-0 pb-3 pt-2 sm:pt-2.5">
            <div className="pointer-events-auto pr-0.5 sm:pr-0">
              <ExpandMediaButton
                tone="darkMedia"
                expanded
                aria-label="Close detail and return to overview"
                onClick={onOverviewClose}
              />
            </div>
          </div>
        ) : null}
        {PANELS.map((panel, i) => {
          return (
            <ParallaxBeat
              key={panel.eyebrow}
              ref={(el) => {
                beatRefs.current[i] = el;
              }}
              panel={panel}
              scrollRef={scrollRef}
              reduceMotion={reduceMotion}
            />
          );
        })}
      </div>

      <div className="h-0.5 shrink-0 bg-ink/[0.08]" aria-hidden>
        <motion.div
          className="h-full origin-left bg-ink/35"
          animate={{ scaleX: progress }}
          transition={{ type: 'tween', duration: 0.1, ease: EASE }}
        />
      </div>
    </div>
  );
}
