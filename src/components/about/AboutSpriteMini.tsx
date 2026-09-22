import { useEffect, useRef } from 'react';
import { MANDALA_SPRITE_NAMES, type MandalaSpriteId } from '../../lib/mandalaSprite';
import { drawSpriteMiniMark, type SpriteMiniDensity } from './drawSpriteMiniMark';

const DEFAULT_MARK_CSS_PX = 52;

type AboutSpriteMiniProps = {
  id: MandalaSpriteId;
  active: boolean;
  onSelect: () => void;
  size?: number;
  /** Interactive pad. Defaults to `size`. Nav catalog uses 44. */
  hitSize?: number;
  density?: SpriteMiniDensity;
  onPreview?: (id: MandalaSpriteId) => void;
  role?: 'button' | 'radio';
  ariaChecked?: boolean;
  tabIndex?: number;
};

export default function AboutSpriteMini({
  id,
  active,
  onSelect,
  size = DEFAULT_MARK_CSS_PX,
  hitSize,
  density = 'default',
  onPreview,
  role = 'button',
  ariaChecked,
  tabIndex,
}: AboutSpriteMiniProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  activeRef.current = active;
  const pad = hitSize ?? size;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let t = 0;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const fit = () => {
      const dpr = window.devicePixelRatio || 1;
      const nextW = Math.round(size * dpr);
      const nextH = Math.round(size * dpr);
      if (canvas.width !== nextW || canvas.height !== nextH) {
        canvas.width = nextW;
        canvas.height = nextH;
        canvas.style.width = `${size}px`;
        canvas.style.height = `${size}px`;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const paint = (time: number) => {
      ctx.clearRect(0, 0, size, size);
      drawSpriteMiniMark(ctx, id, time, activeRef.current, size, density);
    };

    if (reduceMotion) {
      fit();
      paint(0);
      return;
    }

    const loop = () => {
      t += 1 / 60;
      fit();
      paint(t);
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [density, id, size]);

  return (
    <button
      type="button"
      role={role}
      className={['about-art-mini', active ? 'about-art-mini--on' : ''].filter(Boolean).join(' ')}
      style={{ width: pad, height: pad }}
      data-mandala-sprite-id={id}
      tabIndex={tabIndex}
      onMouseEnter={() => onPreview?.(id)}
      onFocus={() => onPreview?.(id)}
      onClick={onSelect}
      aria-checked={role === 'radio' ? ariaChecked : undefined}
      aria-label={MANDALA_SPRITE_NAMES[id]}
    >
      <canvas ref={canvasRef} aria-hidden="true" />
    </button>
  );
}
