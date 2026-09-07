import { useEffect, useRef } from 'react';
import { MANDALA_SPRITE_NAMES, type MandalaSpriteId } from '../../lib/mandalaSprite';
import { drawSpriteMiniMark } from './drawSpriteMiniMark';

const MARK_CSS_PX = 52;

type AboutSpriteMiniProps = {
  id: MandalaSpriteId;
  active: boolean;
  onSelect: () => void;
};

export default function AboutSpriteMini({ id, active, onSelect }: AboutSpriteMiniProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let t = 0;

    const fit = () => {
      const dpr = window.devicePixelRatio || 1;
      const nextW = Math.round(MARK_CSS_PX * dpr);
      const nextH = Math.round(MARK_CSS_PX * dpr);
      if (canvas.width !== nextW || canvas.height !== nextH) {
        canvas.width = nextW;
        canvas.height = nextH;
        canvas.style.width = `${MARK_CSS_PX}px`;
        canvas.style.height = `${MARK_CSS_PX}px`;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const loop = () => {
      t += 1 / 60;
      fit();
      ctx.clearRect(0, 0, MARK_CSS_PX, MARK_CSS_PX);
      drawSpriteMiniMark(ctx, id, t, activeRef.current, MARK_CSS_PX);
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [id]);

  return (
    <button
      type="button"
      className={['about-art-mini', active ? 'about-art-mini--on' : ''].filter(Boolean).join(' ')}
      onClick={onSelect}
      aria-pressed={active}
      aria-label={`${MANDALA_SPRITE_NAMES[id]}${active ? ', current room' : ''}`}
    >
      <canvas ref={canvasRef} aria-hidden="true" />
    </button>
  );
}
