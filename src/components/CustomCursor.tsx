import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';
import { Hand, Grab } from 'lucide-react';

export default function CustomCursor() {
  const [isPressed, setIsPressed] = useState(false);
  const [cursorType, setCursorType] = useState<'default' | 'hand' | 'grabbing'>('default');
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 250 };
  const ringX = useSpring(mouseX, springConfig);
  const ringY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setCoords({ x: e.clientX, y: e.clientY });

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

    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);

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
      {/* Technical Crosshair Ring */}
      <motion.div
        className="cursor-dot w-12 h-12 border border-ink/20 rounded-full flex items-center justify-center"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: cursorType === 'default' ? 1 : 0,
        }}
      >
        <div className="absolute w-full h-[0.5px] bg-ink/30" />
        <div className="absolute h-full w-[0.5px] bg-ink/30" />

        <motion.div
          className="absolute inset-0 w-full h-full rounded-full border border-ink/40"
          animate={{
            scale: isPressed ? 0.7 : 1,
            rotate: isPressed ? 45 : 0,
          }}
        />

        <div className="absolute top-14 left-14 label whitespace-nowrap opacity-0 pointer-events-none" aria-hidden>
          X:{coords.x} Y:{coords.y}
        </div>
      </motion.div>

      {cursorType === 'hand' && (
        <motion.div
          className="cursor-dot text-accent flex items-center justify-center"
          style={{
            x: mouseX,
            y: mouseY,
            translateX: '-50%',
            translateY: '-50%',
          }}
        >
          <Hand size={28} fill="currentColor" fillOpacity={0.1} strokeWidth={1} />
        </motion.div>
      )}

      {cursorType === 'grabbing' && (
        <motion.div
          className="cursor-dot text-accent flex items-center justify-center"
          style={{
            x: mouseX,
            y: mouseY,
            translateX: '-50%',
            translateY: '-50%',
          }}
        >
          <Grab size={28} fill="currentColor" fillOpacity={0.2} strokeWidth={1} />
        </motion.div>
      )}

      {cursorType === 'default' && (
        <motion.div
          className="cursor-dot flex items-center justify-center"
          style={{
            x: mouseX,
            y: mouseY,
            translateX: '-50%',
            translateY: '-50%',
          }}
        >
          <div className="w-1 h-1 bg-ink rounded-full" />
          <motion.div
            className="absolute w-4 h-4 border border-ink/10 rounded-full"
            animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      )}
    </>
  );
}
