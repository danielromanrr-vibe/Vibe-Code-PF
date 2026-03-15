import { useEffect, useRef, useState } from 'react';

/**
 * Euphoria Mandala — implements EUPHORIA_MANDALA_SPEC.md
 * - Visual: Canvas 2D, concentric oscillating layers, HSB→RGB color, alpha fade at outer edges.
 * - Interaction: Hover (distance to center), grab toggle (click in radius), growth when grabbed+pressed, cursor hand/grabbing.
 * - Home: Tethered to #mandala-home, z-10 behind text (z-20), pointer-events conditional, fixed to layout (tracks anchor).
 * - Wild: Page-relative coords (y + scrollY), fixed to content (scrolls with page).
 * - Magnetic Home: Drop within (anchorWidth/2)+80px → snap back (placedPos = null).
 * - Elastic Tether: Viewport ±200px → reset to Home via lerp.
 * - Physics: lerp movement (faster grabbed, slower snap); pressFactor & hoverFactor 0→1 for smoothing.
 * - State: useRef for high-freq (mouse, center, frameCount); useState only for hover/grabbed UI sync.
 */

const NUM_LAYERS = 30;

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
  const [isInMandalaZone, setIsInMandalaZone] = useState(false);
  const paletteRef = useRef([getRandomColor(), getRandomColor(), getRandomColor()]);

  const POINTER_EVENTS_RADIUS_PLACED = 160;

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

    const syncCenterToHome = () => {
      const home = document.getElementById('mandala-home');
      if (home) {
        const rect = home.getBoundingClientRect();
        centerRef.current.x = rect.left + rect.width / 2;
        centerRef.current.y = rect.top + rect.height / 2;
      }
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      syncCenterToHome();
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    syncCenterToHome();

    const getHitRadius = () => {
      const size = interactionRef.current.currentSize;
      return (10 + (NUM_LAYERS - 1) * 14) * (size / 50);
    };

    const getHitTestCenter = () => {
      const state = interactionRef.current;
      if (state.isGrabbed || state.placedPos) {
        return { x: centerRef.current.x, y: centerRef.current.y };
      }
      const home = document.getElementById('mandala-home');
      if (home) {
        const rect = home.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      }
      return { x: centerRef.current.x, y: centerRef.current.y };
    };

    const isClickOnMandalaAtRest = (clientX: number, clientY: number) => {
      const home = document.getElementById('mandala-home');
      if (!home) return false;
      const rect = home.getBoundingClientRect();
      const padding = 200;
      return (
        clientX >= rect.left - padding &&
        clientX <= rect.right + padding &&
        clientY >= rect.top - padding &&
        clientY <= rect.bottom + padding
      );
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;

      const state = interactionRef.current;
      const center = getHitTestCenter();
      const dx = e.clientX - center.x;
      const dy = e.clientY - center.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxRadius = getHitRadius();
      const hovered = dist < maxRadius;
      interactionRef.current.isHovered = hovered;
      setIsHovered(hovered);

      const inZone = state.isGrabbed
        ? true
        : state.placedPos
          ? dist < POINTER_EVENTS_RADIUS_PLACED
          : isClickOnMandalaAtRest(e.clientX, e.clientY);
      setIsInMandalaZone(inZone);
    };

    const isInteractiveElement = (el: HTMLElement | null) => {
      if (!el) return false;
      return !!el.closest('a, button, [role="button"], input, textarea, select, [contenteditable="true"]');
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      const target = e.target as HTMLElement;
      if (target !== canvas && isInteractiveElement(target)) {
        return;
      }
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.isPressed = true;

      paletteRef.current = [getRandomColor(), getRandomColor(), getRandomColor()];

      const state = interactionRef.current;
      const center = getHitTestCenter();
      const clickX = e.clientX;
      const clickY = e.clientY;
      const dx = clickX - center.x;
      const dy = clickY - center.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxRadius = getHitRadius();
      const insideRadius = dist < maxRadius;
      const atRest = !state.isGrabbed && !state.placedPos;
      const inAtRestZone = isClickOnMandalaAtRest(clickX, clickY);
      const clickOnMandala = atRest ? (insideRadius || inAtRestZone) : insideRadius;

      if (clickOnMandala) {
        if (!state.isGrabbed) {
          state.isGrabbed = true;
          state.placedPos = null;
          setIsGrabbedState(true);
          document.body.dataset.mandalaGrabbed = 'true';
          e.preventDefault();
          e.stopPropagation();
        } else {
          dropMandala();
        }
      } else if (state.isGrabbed) {
        dropMandala();
      }
    };

    const dropMandala = () => {
      interactionRef.current.isGrabbed = false;
      setIsGrabbedState(false);
      document.body.dataset.mandalaGrabbed = '';

      const home = document.getElementById('mandala-home');
      if (home) {
        const rect = home.getBoundingClientRect();
        const homeX = rect.left + rect.width / 2;
        const homeY = rect.top + rect.height / 2;
        const distToHome = Math.sqrt(
          Math.pow(mouseRef.current.x - homeX, 2) +
          Math.pow(mouseRef.current.y - homeY, 2)
        );

        const magneticRadius = (rect.width / 2) + 80;
        if (distToHome < magneticRadius) {
          interactionRef.current.placedPos = null;
          return;
        }
      }

      interactionRef.current.placedPos = {
        x: mouseRef.current.x,
        y: mouseRef.current.y + window.scrollY
      };
    };

    const handleMouseUp = () => {
      if (interactionRef.current.isGrabbed) {
        dropMandala();
      }
      mouseRef.current.isPressed = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown, true);
    window.addEventListener('mouseup', handleMouseUp, true);

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

      const dx = mouseRef.current.x - centerRef.current.x;
      const dy = mouseRef.current.y - centerRef.current.y;
      const distFromCenter = Math.sqrt(dx * dx + dy * dy);
      const d = Math.min(distFromCenter / 400, 1.0);

      const activePalette = paletteRef.current;

      const oscSpeed = 0.4 + pf * 1.2 + hf * 0.3;
      state.frameCount += oscSpeed / 60;

      const rotationSpeed = 0.3 + pf * 1.5 + hf * 0.2;
      state.rotationAccumulator += rotationSpeed / 60;

      let targetX = mouseRef.current.x;
      let targetY = mouseRef.current.y;

      if (!state.isGrabbed) {
        if (state.placedPos) {
          targetX = state.placedPos.x;
          targetY = state.placedPos.y - window.scrollY;
          const margin = 200;
          if (
            targetY < -margin ||
            targetY > window.innerHeight + margin ||
            targetX < -margin ||
            targetX > window.innerWidth + margin
          ) {
            state.placedPos = null;
          }
        } else {
          const home = document.getElementById('mandala-home');
          if (home) {
            const rect = home.getBoundingClientRect();
            targetX = rect.left + rect.width / 2;
            targetY = rect.top + rect.height / 2;
          }
        }
      }

      const lerpFactor = state.isGrabbed ? 0.2 : 0.08;
      centerRef.current.x = lerp(centerRef.current.x, targetX, lerpFactor);
      centerRef.current.y = lerp(centerRef.current.y, targetY, lerpFactor);

      const heartbeat = Math.pow(Math.sin(t * 0.8), 6) * 15 * (1 + pf * 2);
      const waveIntensity = pf * 15 + hf * 5;
      const cx = centerRef.current.x + Math.sin(t * 1.2) * waveIntensity;
      const cy = centerRef.current.y + Math.cos(t * 1.0) * waveIntensity + heartbeat;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (hf > 0.1 || pf > 0.1) {
        ctx.save();
        ctx.strokeStyle = `rgba(20, 20, 20, ${0.03 * (hf + pf)})`;
        ctx.lineWidth = 0.5;
        const gridSize = 40;
        const offsetX = cx % gridSize;
        const offsetY = cy % gridSize;

        ctx.beginPath();
        for (let x = offsetX; x < canvas.width; x += gridSize) {
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
        }
        for (let y = offsetY; y < canvas.height; y += gridSize) {
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
        }
        ctx.stroke();
        ctx.restore();
      }

      const numLayers = NUM_LAYERS;
      for (let i = 0; i < numLayers; i++) {
        const driftSeed = i * 133.7;
        const driftX = (Math.sin(t * 0.12 + driftSeed) + Math.sin(t * 0.28 + i)) * (pf * 180 * (i / numLayers));
        const driftY = (Math.cos(t * 0.18 - driftSeed) + Math.cos(t * 0.09 + i)) * (pf * 180 * (i / numLayers));

        const jitterX = (Math.random() - 0.5) * 0.8;
        const jitterY = (Math.random() - 0.5) * 0.8;

        const lcx = cx + driftX + jitterX;
        const lcy = cy + driftY + jitterY;

        const stretchX = 1 + Math.sin(t * 0.06 + i * 1.8) * 0.7 * pf;
        const stretchY = 1 + Math.cos(t * 0.1 + i * 1.3) * 0.7 * pf;
        const depthScale = 1 - (i / numLayers) * 0.5 * pf;

        const baseRadius = (10 + i * 14) * (state.currentSize / 50) * depthScale;
        const biologicalPulse = Math.sin(t * 0.5 + i * 0.2) * Math.sin(t * 0.2 + i * 0.5);
        const oscAmp = (8 + pf * 100) * (1 + d * 1.5);
        const radius = Math.max(0.1, baseRadius + biologicalPulse * oscAmp);

        const rotationOffset = (state.rotationAccumulator * (0.012 + i * 0.003)) + (i * Math.PI / 1.1);

        const charcoal = { r: 20, g: 20, b: 20 };
        const rgbMatch = activePalette[i % activePalette.length].match(/\d+/g);
        const accentRGB = rgbMatch ? rgbMatch.map(Number) : [80, 100, 200];
        const targetColor = { r: accentRGB[0], g: accentRGB[1], b: accentRGB[2] };

        const colorFactor = Math.min(1.0, pf * 1.2 + hf * 0.3);
        const r = Math.round(lerp(charcoal.r, targetColor.r, colorFactor));
        const g = Math.round(lerp(charcoal.g, targetColor.g, colorFactor));
        const b = Math.round(lerp(charcoal.b, targetColor.b, colorFactor));
        const strokeColor = `rgb(${r}, ${g}, ${b})`;

        ctx.strokeStyle = strokeColor;
        ctx.globalAlpha = (lerp(0.08, 0.6, pf) + (hf * 0.15)) * (1 - i / numLayers * 0.5);
        ctx.lineWidth = (i % 5 === 0 ? 1.5 : 0.5) * lerp(1, 2.0, pf);

        if (pf > 0.1) {
          ctx.shadowBlur = 10 * pf;
          ctx.shadowColor = strokeColor;
        } else {
          ctx.shadowBlur = 0;
        }

        const strokeOsc = Math.sin(t * 0.5 + i) * 0.5 + 0.5;
        ctx.lineWidth *= 0.8 + strokeOsc * 0.4;

        if (i % 7 === 0) ctx.setLineDash([40, 20]);
        else if (i % 4 === 0) ctx.setLineDash([2, 8]);
        else if (i % 9 === 0) ctx.setLineDash([15, 5, 2, 5]);
        else ctx.setLineDash([]);

        const layerType = i % 6;

        if (pf < 0.05 || layerType === 1) {
          ctx.beginPath();
          ctx.ellipse(lcx, lcy, radius * stretchX, radius * stretchY, rotationOffset, 0, Math.PI * 2);
          ctx.stroke();
        } else if (layerType === 0) {
          const arcStart = rotationOffset;
          const arcEnd = arcStart + Math.PI * (0.5 + Math.sin(t * 0.2 + i) * 0.5);
          ctx.beginPath();
          ctx.arc(lcx, lcy, radius, arcStart, arcEnd);
          ctx.stroke();

          if (i % 2 === 0) {
            ctx.beginPath();
            ctx.arc(lcx, lcy, radius * 0.9, arcStart + Math.PI, arcEnd + Math.PI);
            ctx.stroke();
          }
        } else if (layerType === 4) {
          const numTicks = 8;
          for (let s = 0; s < numTicks; s++) {
            const angle = (s / numTicks) * Math.PI * 2 + rotationOffset * 0.5;
            const x1 = lcx + Math.cos(angle) * radius * 0.95;
            const y1 = lcy + Math.sin(angle) * radius * 0.95;
            const x2 = lcx + Math.cos(angle) * radius * 1.05;
            const y2 = lcy + Math.sin(angle) * radius * 1.05;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        } else if (layerType === 2) {
          const crossSize = radius * 0.5 * (pf + 0.1);
          ctx.save();
          ctx.globalAlpha *= 0.3;
          ctx.translate(lcx, lcy);
          ctx.rotate(rotationOffset);
          ctx.beginPath();
          ctx.moveTo(-crossSize, 0);
          ctx.lineTo(crossSize, 0);
          ctx.moveTo(0, -crossSize);
          ctx.lineTo(0, crossSize);
          ctx.stroke();
          ctx.restore();
        } else if (layerType === 3) {
          const sides = 6;
          ctx.save();
          ctx.globalAlpha *= 0.2;
          ctx.beginPath();
          for (let s = 0; s <= sides; s++) {
            const angle = (s / sides) * Math.PI * 2 + rotationOffset;
            const vx = lcx + Math.cos(angle) * radius * stretchX;
            const vy = lcy + Math.sin(angle) * radius * stretchY;
            if (s === 0) ctx.moveTo(vx, vy);
            else ctx.lineTo(vx, vy);
          }
          ctx.stroke();
          ctx.restore();
        }

        if (i === 7) {
          ctx.save();
          ctx.globalAlpha *= 0.5;
          ctx.setLineDash([2, 10]);
          ctx.beginPath();
          ctx.arc(lcx, lcy, radius * 1.15, t * 0.5, t * 0.5 + Math.PI * 0.5);
          ctx.stroke();
          ctx.restore();
        }

        if ((pf > 0.2 || hf > 0.5) && i % 5 === 0) {
          ctx.save();
          ctx.globalAlpha *= 0.08;
          ctx.setLineDash([2, 20]);

          ctx.beginPath();
          ctx.moveTo(0, lcy);
          ctx.lineTo(canvas.width, lcy);
          ctx.moveTo(lcx, 0);
          ctx.lineTo(lcx, canvas.height);
          ctx.stroke();

          ctx.fillStyle = strokeColor;
          ctx.globalAlpha = (pf + hf) * 0.1;
          ctx.fillRect(lcx - 2, lcy - 2, 4, 4);

          ctx.restore();
        }

        if (pf > 0.1 || hf > 0.3) {
          const numNodes = Math.floor(lerp(0, 3, pf + hf * 0.5));
          for (let n = 0; n < numNodes; n++) {
            const nodeAngle = rotationOffset + n * Math.PI * 0.5 + i * 0.7;
            const nodeDist = radius * (1.4 + Math.sin(t * 0.3 + n) * 0.8) * (pf + hf * 0.3);
            const nx = lcx + Math.cos(nodeAngle) * nodeDist * stretchX;
            const ny = lcy + Math.sin(nodeAngle) * nodeDist * stretchY;

            ctx.beginPath();
            ctx.arc(nx, ny, 1, 0, Math.PI * 2);
            ctx.fillStyle = strokeColor;
            ctx.globalAlpha = (pf + hf) * 0.3;
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(lcx, lcy);
            ctx.lineTo(nx, ny);
            ctx.globalAlpha = (pf + hf) * 0.05;
            ctx.setLineDash([1, 4]);
            ctx.stroke();
          }
        }
        ctx.shadowBlur = 0;
      }

      animationFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      document.body.dataset.mandalaGrabbed = '';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown, true);
      window.removeEventListener('mouseup', handleMouseUp, true);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      data-cursor={isGrabbedState ? 'grabbing' : (isHovered ? 'hand' : undefined)}
      className={`fixed inset-0 w-full h-full block ${isGrabbedState || (isHovered && isInMandalaZone) ? 'z-[100] pointer-events-auto' : 'z-[10] pointer-events-none'}`}
      style={{ touchAction: 'none' }}
      aria-hidden="true"
    />
  );
}
