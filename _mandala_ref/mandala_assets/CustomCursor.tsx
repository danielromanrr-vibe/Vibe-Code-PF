import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';
import { Hand, Grab } from 'lucide-react';

export default function CustomCursor() {
  const [cursorType, setCursorType] = useState<'default' | 'hand' | 'grabbing'>('default');
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 30, stiffness: 250 });
  const springY = useSpring(mouseY, { damping: 30, stiffness: 250 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      const target = e.target as HTMLElement;
      const attr = target.closest('[data-cursor]')?.getAttribute('data-cursor');
      setCursorType((attr as any) || 'default');
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div 
      className="fixed z-[9999] pointer-events-none"
      style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%' }}
    >
      {cursorType === 'hand' && <Hand className="text-blue-500" />}
      {cursorType === 'grabbing' && <Grab className="text-blue-500" />}
      {cursorType === 'default' && <div className="w-2 h-2 bg-black rounded-full" />}
    </motion.div>
  );
}
