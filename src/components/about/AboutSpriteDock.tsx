import { useRef, useState, type KeyboardEvent } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { MANDALA_SPRITE_IDS, MANDALA_SPRITE_NAMES, type MandalaSpriteId } from '../../lib/mandalaSprite';
import AboutSpriteMini from './AboutSpriteMini';

const TILE_REST = 40;
const TILE_MAX = 62;
const MAGNIFY_REACH = 130;
const MARK_PX = 64;

type AboutSpriteDockProps = {
  spriteId: MandalaSpriteId;
  onSelect: (id: MandalaSpriteId) => void;
};

function DockTile({
  id,
  active,
  mouseX,
  reduceMotion,
  tabIndex,
  onSelect,
}: {
  id: MandalaSpriteId;
  active: boolean;
  mouseX: MotionValue<number>;
  reduceMotion: boolean;
  tabIndex: number;
  onSelect: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [launches, setLaunches] = useState(0);

  const distance = useTransform(mouseX, (x) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect || !Number.isFinite(x)) return MAGNIFY_REACH;
    return x - (rect.left + rect.width / 2);
  });
  const target = useTransform(distance, [-MAGNIFY_REACH, 0, MAGNIFY_REACH], [TILE_REST, TILE_MAX, TILE_REST]);
  const size = useSpring(target, { mass: 0.1, stiffness: 170, damping: 14 });
  const tile = reduceMotion ? TILE_REST : size;
  const markScale = useTransform(size, (s) => (s * 0.82) / MARK_PX);

  return (
    <motion.div
      ref={ref}
      className="about-sprite-dock__slot"
      style={{ width: tile, height: tile }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <AnimatePresence>
        {hovered ? (
          <motion.span
            className="about-sprite-dock__label"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.14 }}
            aria-hidden
          >
            {MANDALA_SPRITE_NAMES[id]}
          </motion.span>
        ) : null}
      </AnimatePresence>
      <motion.div
        key={launches}
        className={['about-sprite-dock__tile', active ? 'is-active' : ''].join(' ')}
        animate={reduceMotion || launches === 0 ? undefined : { y: [0, -16, 0, -7, 0] }}
        transition={{ duration: 0.62, ease: 'easeOut' }}
      >
        <motion.div className="about-sprite-dock__mark" style={{ scale: reduceMotion ? (TILE_REST * 0.82) / MARK_PX : markScale }}>
          <AboutSpriteMini
            id={id}
            size={MARK_PX}
            role="radio"
            ariaChecked={active}
            active={active}
            tabIndex={tabIndex}
            onSelect={() => {
              if (!active) setLaunches((n) => n + 1);
              onSelect();
            }}
          />
        </motion.div>
      </motion.div>
      <span className={['about-sprite-dock__dot', active ? 'is-on' : ''].join(' ')} aria-hidden />
    </motion.div>
  );
}

export default function AboutSpriteDock({ spriteId, onSelect }: AboutSpriteDockProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY);
  const groupRef = useRef<HTMLDivElement>(null);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const delta = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const index = MANDALA_SPRITE_IDS.indexOf(spriteId);
    const next = MANDALA_SPRITE_IDS[(index + delta + MANDALA_SPRITE_IDS.length) % MANDALA_SPRITE_IDS.length]!;
    onSelect(next);
    requestAnimationFrame(() =>
      groupRef.current?.querySelector<HTMLButtonElement>(`[data-mandala-sprite-id="${next}"]`)?.focus(),
    );
  };

  return (
    <div className="about-sprite-dock" data-mandala-shield>
      <div
        ref={groupRef}
        className="about-sprite-dock__shelf"
        role="radiogroup"
        aria-label="Choose a mandala"
        onPointerMove={(event) => mouseX.set(event.clientX)}
        onPointerLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
        onKeyDown={onKeyDown}
      >
        {MANDALA_SPRITE_IDS.map((id) => (
          <DockTile
            key={id}
            id={id}
            active={id === spriteId}
            mouseX={mouseX}
            reduceMotion={reduceMotion}
            tabIndex={id === spriteId ? 0 : -1}
            onSelect={() => onSelect(id)}
          />
        ))}
      </div>
    </div>
  );
}
