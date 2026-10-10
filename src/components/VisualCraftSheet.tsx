import { useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { X } from 'lucide-react';
import { VISUAL_LANDING_GRID } from '../content/visualDesign';

const CLUSTER_SPRING = {
  type: 'spring' as const,
  stiffness: 260,
  damping: 28,
  mass: 0.8,
};

const TILT_SPRING = {
  stiffness: 180,
  damping: 20,
  mass: 0.55,
};

const CELL_DEPTH = [0.55, 1, 0.72, 0.88, 0.5, 1.12] as const;

type VisualCraftSheetProps = {
  open: boolean;
  reducedMotion: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onOpen: () => void;
  onClose: () => void;
};

export default function VisualCraftSheet({
  open,
  reducedMotion,
  onHoverStart,
  onHoverEnd,
  onOpen,
  onClose,
}: VisualCraftSheetProps) {
  const clusterRef = useRef<HTMLDivElement>(null);
  const exitingRef = useRef(false);
  const wasOpenRef = useRef(open);
  if (open) exitingRef.current = false;
  else if (wasOpenRef.current) exitingRef.current = true;
  wasOpenRef.current = open;

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const tiltX = useSpring(pointerX, TILT_SPRING);
  const tiltY = useSpring(pointerY, TILT_SPRING);
  const rotateX = useTransform(tiltY, (value) => (reducedMotion ? 0 : value * -8));
  const rotateY = useTransform(tiltX, (value) => (reducedMotion ? 0 : value * 10));
  const shiftX = useTransform(tiltX, (value) => (reducedMotion ? 0 : value * 18));
  const shiftY = useTransform(tiltY, (value) => (reducedMotion ? 0 : value * 12));
  const transition = reducedMotion ? { duration: 0 } : CLUSTER_SPRING;

  const [hoverReach, setHoverReach] = useState(46);

  useLayoutEffect(() => {
    if (!open) return;
    const badge = document.querySelector('[data-visual-craft-badge]');
    if (!(badge instanceof HTMLElement)) return;
    const height = badge.getBoundingClientRect().height;
    if (height > 0) setHoverReach(height + 16 + 10);
  }, [open]);

  const resetTilt = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const pointerStillInside = (target: EventTarget | null) =>
    target instanceof Element && Boolean(target.closest('[data-visual-craft-badge]'));

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const rect = clusterRef.current?.getBoundingClientRect();
    if (!rect || rect.width < 1 || rect.height < 1) return;
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <AnimatePresence onExitComplete={() => { exitingRef.current = false; }}>
      {open ? (
        <motion.div
          key="visual-craft-cluster"
          ref={clusterRef}
          data-visual-craft-cluster=""
          className="pointer-events-none absolute left-1/2 top-0 z-20 w-[108%]"
          style={{ perspective: 1100 }}
          initial={reducedMotion ? false : { x: '-50%', y: '8%' }}
          animate={{ x: '-50%', y: '-2.65rem' }}
          exit={reducedMotion ? undefined : { x: '-50%', y: '120%' }}
          transition={transition}
          onMouseEnter={() => {
            if (exitingRef.current) return;
            onHoverStart();
          }}
          onMouseLeave={(event) => {
            if (pointerStillInside(event.relatedTarget)) return;
            resetTilt();
            onHoverEnd();
          }}
          onPointerMove={onPointerMove}
        >
          <div
            aria-hidden
            className="pointer-events-auto absolute -z-10"
            style={{ left: -10, right: -10, bottom: -10, top: -hoverReach }}
          />
          <button
            type="button"
            className="pointer-events-auto absolute right-0 top-0 z-30 inline-flex h-5 w-5 -translate-y-[calc(100%+16px)] items-center justify-center border-0 bg-transparent p-0 text-[var(--color-hero-ink)]"
            aria-label="Close visual gallery"
            onClick={(event) => {
              event.stopPropagation();
              onClose();
            }}
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
          <motion.div
            className="pointer-events-none"
            style={{
              rotateX,
              rotateY,
              x: shiftX,
              y: shiftY,
              transformStyle: 'preserve-3d',
            }}
          >
            <ul data-visual-craft-sheet="" className="m-0 grid list-none grid-cols-3 p-0">
              {VISUAL_LANDING_GRID.map((work, index) => (
                <VisualCraftCell
                  key={work.id}
                  src={work.coverSrc}
                  label={`Visual and branding, ${work.title}`}
                  depth={CELL_DEPTH[index] ?? 1}
                  tiltX={tiltX}
                  tiltY={tiltY}
                  reducedMotion={reducedMotion}
                  onOpen={onOpen}
                />
              ))}
            </ul>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function VisualCraftCell({
  src,
  label,
  depth,
  tiltX,
  tiltY,
  reducedMotion,
  onOpen,
}: {
  src: string;
  label: string;
  depth: number;
  tiltX: ReturnType<typeof useSpring>;
  tiltY: ReturnType<typeof useSpring>;
  reducedMotion: boolean;
  onOpen: () => void;
}) {
  const x = useTransform(tiltX, (value) => (reducedMotion ? 0 : value * -22 * depth));
  const y = useTransform(tiltY, (value) => (reducedMotion ? 0 : value * -16 * depth));

  return (
    <li className="pointer-events-auto p-[3px]">
      <button
        type="button"
        className="block w-full overflow-hidden border-0 bg-transparent p-0"
        style={{ borderRadius: 'var(--radius-media)' }}
        aria-label={label}
        onClick={onOpen}
      >
        <motion.img
          src={src}
          alt=""
          className="aspect-[5/4] w-full object-cover"
          style={{ x, y, scale: 1.12 }}
          draggable={false}
        />
      </button>
    </li>
  );
}
