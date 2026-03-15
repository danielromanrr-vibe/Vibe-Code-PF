import { useEffect, useRef, useState } from 'react';

const COLORS = {
  ink: 'rgb(20, 20, 20)',
  accent: 'rgb(80, 100, 200)',
  palettes: {
    dawn: ['rgb(180, 210, 255)', 'rgb(255, 255, 255)', 'rgb(100, 150, 255)'],
    day: ['rgb(255, 230, 0)', 'rgb(255, 50, 150)', 'rgb(0, 220, 255)'],
    dusk: ['rgb(255, 120, 50)', 'rgb(255, 80, 150)', 'rgb(100, 50, 200)'],
    night: ['rgb(50, 50, 150)', 'rgb(20, 20, 40)', 'rgb(150, 100, 255)']
  }
};

const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

const getRandomColor = () => {
  const h = Math.random();
  const s = 0.7 + Math.random() * 0.2;
  const l = 0.5 + Math.random() * 0.1;
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = Math.round(hue2rgb(p, q, h + 1/3) * 255);
  const g = Math.round(hue2rgb(p, q, h) * 255);
  const b = Math.round(hue2rgb(p, q, h - 1/3) * 255);
  return `rgb(${r}, ${g}, ${b})`;
};

export default function Mandala() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, isPressed: false });
  const centerRef = useRef({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isGrabbedState, setIsGrabbedState] = useState(false);
  const paletteRef = useRef([getRandomColor(), getRandomColor(), getRandomColor()]);

  const interactionRef = useRef({
    isGrabbed: false,
    placedPos: null as { x: number; y: number } | null,
    isHovered: false,
    frameCount: 0,
    pressFactor: 0,
    hoverFactor: 0,
    currentSize: 40,
    rotationAccumulator: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      const dx = e.clientX - centerRef.current.x;
      const dy = e.clientY - centerRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxRadius = (18 + 13 * 10) * (interactionRef.current.currentSize / 50);
      const hovered = dist < maxRadius;
      interactionRef.current.isHovered = hovered;
      setIsHovered(hovered);
    };

    const handleMouseDown = () => {
      mouseRef.current.isPressed = true;
      paletteRef.current = [getRandomColor(), getRandomColor(), getRandomColor()];
      const dx = mouseRef.current.x - centerRef.current.x;
      const dy = mouseRef.current.y - centerRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxRadius = (18 + 13 * 10) * (interactionRef.current.currentSize / 50);

      if (dist < maxRadius) {
        if (!interactionRef.current.isGrabbed) {
          interactionRef.current.isGrabbed = true;
          interactionRef.current.placedPos = null;
          setIsGrabbedState(true);
        } else {
          dropMandala();
        }
      } else if (interactionRef.current.isGrabbed) {
        dropMandala();
      }
    };

    const dropMandala = () => {
      interactionRef.current.isGrabbed = false;
      setIsGrabbedState(false);
      const home = document.getElementById('mandala-home');
      if (home) {
        const rect = home.getBoundingClientRect();
        const homeX = rect.left + rect.width / 2;
        const homeY = rect.top + rect.height / 2;
        const distToHome = Math.sqrt(Math.pow(mouseRef.current.x - homeX, 2) + Math.pow(mouseRef.current.y - homeY, 2));
        if (distToHome < (rect.width / 2) + 80) {
          interactionRef.current.placedPos = null;
          return;
        }
      }
      interactionRef.current.placedPos = { x: mouseRef.current.x, y: mouseRef.current.y + window.scrollY };
    };

    const handleMouseUp = () => { mouseRef.current.isPressed = false; };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    let animationFrame: number;
    const render = () => {
      const state = interactionRef.current;
      const targetPF = (state.isGrabbed && mouseRef.current.isPressed) ? 1.0 : 0.0;
      state.pressFactor += (targetPF - state.pressFactor) * 0.15;
      state.hoverFactor = lerp(state.hoverFactor, state.isHovered ? 1 : 0, 0.1);
      
      const pf = state.pressFactor;
      const hf = state.hoverFactor;
      const t = state.frameCount;

      if (state.isGrabbed && mouseRef.current.isPressed) {
        state.currentSize += 2.5; 
      } else {
        state.currentSize *= 0.97;
        state.currentSize = Math.max(state.currentSize, 18);
      }

      let targetX = mouseRef.current.x;
      let targetY = mouseRef.current.y;

      if (!state.isGrabbed) {
        if (state.placedPos) {
          targetX = state.placedPos.x;
          targetY = state.placedPos.y - window.scrollY;
        } else {
          const home = document.getElementById('mandala-home');
          if (home) {
            const rect = home.getBoundingClientRect();
            targetX = rect.left + rect.width / 2;
            targetY = rect.top + rect.height / 2;
          }
        }
      }

      centerRef.current.x = lerp(centerRef.current.x, targetX, state.isGrabbed ? 0.2 : 0.08);
      centerRef.current.y = lerp(centerRef.current.y, targetY, state.isGrabbed ? 0.2 : 0.08);

      const cx = centerRef.current.x + Math.sin(t * 1.2) * (pf * 15 + hf * 5);
      const cy = centerRef.current.y + Math.cos(t * 1.0) * (pf * 15 + hf * 5);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const numLayers = 20;
      for (let i = 0; i < numLayers; i++) {
        const radius = (10 + i * 14) * (state.currentSize / 50);
        const rotationOffset = (state.rotationAccumulator * (0.012 + i * 0.003)) + (i * Math.PI / 1.1);
        const strokeColor = pf > 0.1 ? paletteRef.current[i % 3] : 'rgba(20, 20, 20, 0.1)';
        ctx.strokeStyle = strokeColor;
        ctx.globalAlpha = (lerp(0.08, 0.6, pf) + (hf * 0.15)) * (1 - i / numLayers * 0.5);
        ctx.lineWidth = (i % 5 === 0 ? 1.5 : 0.5) * lerp(1, 2.0, pf);
        ctx.beginPath();
        ctx.ellipse(cx, cy, radius, radius, rotationOffset, 0, Math.PI * 2);
        ctx.stroke();
      }

      state.frameCount += (0.4 + pf * 1.2 + hf * 0.3) / 60;
      state.rotationAccumulator += (0.3 + pf * 1.5 + hf * 0.2) / 60;
      animationFrame = requestAnimationFrame(render);
    };

    render();
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      data-cursor={isGrabbedState ? "grabbing" : (isHovered ? "hand" : undefined)}
      className={`fixed inset-0 w-full h-full block z-10 ${isHovered || isGrabbedState ? 'pointer-events-auto' : 'pointer-events-none'}`}
      style={{ touchAction: 'none' }}
    />
  );
}
