import { useEffect, useState } from 'react';
import { motion, useMotionValue } from 'motion/react';
import { Hand, Grab } from 'lucide-react';

export default function CustomCursor() {
  const [cursorType, setCursorType] = useState<'default' | 'hand' | 'grabbing'>('default');

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement;
      const cursorAttr = target.closest('[data-cursor]')?.getAttribute('data-cursor');

      if (cursorAttr === 'grabbing') {
        setCursorType('grabbing');
      } else if (cursorAttr === 'hand') {
        setCursorType('hand');
      } else {
        setCursorType('default');
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (document.body.dataset.mandalaGrabbed === 'true') {
        setCursorType('grabbing');
      } else {
        const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
        const attr = el?.closest('[data-cursor]')?.getAttribute('data-cursor');
        if (attr === 'grabbing') setCursorType('grabbing');
        else if (attr === 'hand') setCursorType('hand');
        else setCursorType('default');
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      const attr = el?.closest('[data-cursor]')?.getAttribute('data-cursor');
      if (attr === 'grabbing') setCursorType('grabbing');
      else if (attr === 'hand') setCursorType('hand');
      else setCursorType('default');
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Single cursor layer: only one of arrow / hand / grabbing is visible */}
      <motion.div
        className="cursor-dot flex items-center justify-center"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        {cursorType === 'hand' && (
          <Hand size={24} fill="currentColor" fillOpacity={0.12} strokeWidth={1.25} className="text-accent shrink-0" />
        )}
        {cursorType === 'grabbing' && (
          <Grab size={24} fill="currentColor" fillOpacity={0.12} strokeWidth={1.25} className="text-accent shrink-0" />
        )}
        {cursorType === 'default' && null}
      </motion.div>
    </>
  );
}
