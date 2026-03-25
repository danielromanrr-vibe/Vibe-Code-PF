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
const SYSTEM_NODE_COUNT = 17;
const RING_NODE_COUNT = 10;
const AMBIENT_ENTITY_COUNT = 80;
const NODE_PUSH_RADIUS = 130;
const NODE_PUSH_STRENGTH = 27;
const NODE_MOUSE_REACH = 420;
const NODE_MOUSE_PULL = 18;
const CORE_MOUSE_REACH = 520;
const CORE_MOUSE_PULL = 16;
const WEB_LINK_MAX_DIST = 340;

const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;
const dist = (ax: number, ay: number, bx: number, by: number) => {
  const dx = ax - bx;
  const dy = ay - by;
  return Math.sqrt(dx * dx + dy * dy);
};
const subtlePullTowardMouse = (
  x: number,
  y: number,
  mx: number,
  my: number,
  reach: number,
  maxShift: number,
) => {
  const d = dist(mx, my, x, y);
  if (d < 1e-6) return { dx: 0, dy: 0 };
  const influence = Math.max(0, 1 - d / reach) ** 1.35;
  const pull = maxShift * influence;
  return { dx: ((mx - x) / d) * pull, dy: ((my - y) / d) * pull };
};

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

type MandalaProps = {
  variant?: 'default' | 'heroIntegrated';
};

export default function Mandala({ variant = 'default' }: MandalaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isHeroIntegrated = variant === 'heroIntegrated';
  const mouseRef = useRef({ x: 0, y: 0, isPressed: false });
  const centerRef = useRef({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isGrabbedState, setIsGrabbedState] = useState(false);
  const [isInMandalaZone, setIsInMandalaZone] = useState(false);
  const paletteRef = useRef([getRandomColor(), getRandomColor(), getRandomColor()]);
  const systemNodesRef = useRef<Array<{
    phase: number;
    orbit: number;
    speed: number;
    wobble: number;
    size: number;
    kind: 0 | 1 | 2;
    spread: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    mass: number;
  }>>([]);
  const ambientEntitiesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    phase: number;
    kind: 0 | 1 | 2;
    seed: number;
  }>>([]);
  const ringNodesRef = useRef<Array<{
    phase: number;
    radius: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
  }>>([]);

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

    if (systemNodesRef.current.length === 0) {
      const cx0 = centerRef.current.x || window.innerWidth / 2;
      const cy0 = centerRef.current.y || window.innerHeight / 2;
      systemNodesRef.current = Array.from({ length: SYSTEM_NODE_COUNT }, (_, i) => ({
        phase: (i / SYSTEM_NODE_COUNT) * Math.PI * 2 + Math.random() * 0.6,
        orbit: 85 + Math.random() * 105,
        speed: 0.25 + Math.random() * 0.55,
        wobble: 0.6 + Math.random() * 0.8,
        size: 0.7 + Math.random() * 0.9,
        kind: (i % 3) as 0 | 1 | 2, // 0 orb, 1 hex, 2 mini-mandala
        spread: 16 + Math.random() * 24,
        x: cx0 + Math.cos((i / SYSTEM_NODE_COUNT) * Math.PI * 2) * (95 + Math.random() * 35),
        y: cy0 + Math.sin((i / SYSTEM_NODE_COUNT) * Math.PI * 2) * (95 + Math.random() * 35),
        vx: 0,
        vy: 0,
        mass: 0.85 + Math.random() * 0.45,
      }));
    }
    if (ambientEntitiesRef.current.length === 0) {
      const cx0 = centerRef.current.x || window.innerWidth / 2;
      const cy0 = centerRef.current.y || window.innerHeight / 2;
      ambientEntitiesRef.current = Array.from({ length: AMBIENT_ENTITY_COUNT }, (_, i) => {
        const a = (i / AMBIENT_ENTITY_COUNT) * Math.PI * 2 + Math.random() * 0.8;
        const r = 140 + Math.random() * 220;
        return {
          x: cx0 + Math.cos(a) * r,
          y: cy0 + Math.sin(a) * r,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: 0.7 + Math.random() * 1.4,
          phase: Math.random() * Math.PI * 2,
          // Weighted toward mini-mandalas for a denser "living mandala field".
          kind: ((i % 5) < 3 ? 2 : (i % 2 === 0 ? 0 : 1)) as 0 | 1 | 2,
          seed: Math.random() * 1000,
        };
      });
    }
    if (ringNodesRef.current.length === 0) {
      const cx0 = centerRef.current.x || window.innerWidth / 2;
      const cy0 = centerRef.current.y || window.innerHeight / 2;
      ringNodesRef.current = Array.from({ length: RING_NODE_COUNT }, (_, i) => {
        const a = (i / RING_NODE_COUNT) * Math.PI * 2;
        const r = 120 + Math.random() * 36;
        return {
          phase: a + Math.random() * 0.35,
          radius: r,
          x: cx0 + Math.cos(a) * r,
          y: cy0 + Math.sin(a) * r,
          vx: 0,
          vy: 0,
        };
      });
    }

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
      const baseCx = centerRef.current.x + Math.sin(t * 1.2) * waveIntensity;
      const baseCy = centerRef.current.y + Math.cos(t * 1.0) * waveIntensity + heartbeat;
      // Default "tendril-like" feel: softly lean toward pointer with elastic falloff.
      const corePull = subtlePullTowardMouse(
        baseCx,
        baseCy,
        mouseRef.current.x,
        mouseRef.current.y,
        CORE_MOUSE_REACH,
        CORE_MOUSE_PULL * (1 - pf * 0.45),
      );
      const cx = baseCx + corePull.dx;
      const cy = baseCy + corePull.dy;
      let networkStress = 0;
      let networkBiasX = 0;
      let networkBiasY = 0;

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

      // Peripheral ecosystem nodes are enabled only in the integrated hero variant.
      if (isHeroIntegrated) {
        const activePalette = paletteRef.current;
        const paletteRGB = activePalette.map((c) => {
          const m = c.match(/\d+/g);
          return m ? m.map(Number) : [80, 100, 200];
        });
        const nodes = systemNodesRef.current;
        const ringNodes = ringNodesRef.current;
        const grabbed = state.isGrabbed;
        const pressBlast = pf;
        // Keep ecosystem in a persistent "hover-ready" state for coherence.
        const ecoHf = Math.max(hf, 0.66);
        const clusterTightness = grabbed ? 1 : 0;
        const lineAlpha = grabbed ? 0.19 + pressBlast * 0.2 : 0.12 + ecoHf * 0.06;
        const nodePositions: Array<{ x: number; y: number; r: number; kind: 0 | 1 | 2 }> = [];
        const ambientPositions: Array<{ x: number; y: number; r: number; kind: 0 | 1 | 2 }> = [];
        const ringPositions: Array<{ x: number; y: number; r: number; kind: 0 | 1 | 2 }> = [];

        for (let ni = 0; ni < nodes.length; ni++) {
          const n = nodes[ni];
          const a = t * n.speed + n.phase;
          const orbitPulse = 1 + Math.sin(t * 0.45 + ni * 0.7) * 0.12 * n.wobble;
          const orbitR = n.orbit * orbitPulse;

          // Orbit spring target around mandala.
          let tx = cx + Math.cos(a) * orbitR + Math.sin(t * 0.9 + ni) * 6;
          let ty = cy + Math.sin(a) * orbitR + Math.cos(t * 0.75 + ni) * 6;

          // Grabbed state: collapse nodes into a center "system" around the mandala core.
          // Pressed state: the same nodes expand outward (blast) while staying phase-locked.
          if (grabbed) {
            const ca = (ni / nodes.length) * Math.PI * 2 + t * 0.2;
            const coreR = n.spread + Math.sin(t * 1.1 + ni) * 2.5;
            const blastR = coreR + pressBlast * (68 + n.orbit * 0.35);
            const blastJitter = pressBlast * (5 + Math.sin(t * 2.2 + ni) * 4);
            const coreX = cx + Math.cos(ca) * coreR;
            const coreY = cy + Math.sin(ca) * coreR;
            const blastX = cx + Math.cos(ca) * blastR + Math.sin(t * 2.7 + ni) * blastJitter;
            const blastY = cy + Math.sin(ca) * blastR + Math.cos(t * 2.5 + ni) * blastJitter;
            tx = lerp(tx, coreX, 0.68);
            ty = lerp(ty, coreY, 0.68);
            tx = lerp(tx, blastX, 0.2 + pressBlast * 0.58);
            ty = lerp(ty, blastY, 0.2 + pressBlast * 0.58);
          }

          // === Physics coupling (mandala <-> nodes) ===
          // 1) Spring toward target orbit/cluster.
          const springK = grabbed ? 0.095 : 0.07;
          let fx = (tx - n.x) * springK;
          let fy = (ty - n.y) * springK;

          // 2) Mandala field: repulsive core + attractive ring + tangential swirl.
          const toNodeX = n.x - cx;
          const toNodeY = n.y - cy;
          const r = Math.max(1, Math.sqrt(toNodeX * toNodeX + toNodeY * toNodeY));
          const nx = toNodeX / r;
          const ny = toNodeY / r;
          const txv = -ny;
          const tyv = nx;
          const coreRadius = 62 + pressBlast * 40;
          const ringRadius = grabbed ? 48 + pressBlast * 42 : orbitR * 0.9;
          const ringDelta = r - ringRadius;
          const ringAttract = -Math.tanh(ringDelta / 46) * (0.42 + ecoHf * 0.22 + pressBlast * 0.25);
          const coreRepel =
            r < coreRadius
              ? (1 - r / coreRadius) * (0.95 + pressBlast * 1.35)
              : 0;
          const swirl = (0.22 + ecoHf * 0.14 + pressBlast * 0.26) * (grabbed ? 1.15 : 0.95);
          fx += nx * (ringAttract + coreRepel) + txv * swirl;
          fy += ny * (ringAttract + coreRepel) + tyv * swirl;

          // 3) Pointer coupling: tendril-like pull + local push bubble.
          if (!grabbed) {
            const pull = subtlePullTowardMouse(
              n.x,
              n.y,
              mouseRef.current.x,
              mouseRef.current.y,
              NODE_MOUSE_REACH,
              NODE_MOUSE_PULL,
            );
            fx += pull.dx * 0.06;
            fy += pull.dy * 0.06;
          }
          const mdx = n.x - mouseRef.current.x;
          const mdy = n.y - mouseRef.current.y;
          const md = Math.sqrt(mdx * mdx + mdy * mdy);
          if (md < NODE_PUSH_RADIUS && md > 2) {
            const s = (1 - md / NODE_PUSH_RADIUS) * (NODE_PUSH_STRENGTH * 0.05) * (grabbed ? 0.7 : 1);
            fx += (mdx / md) * s;
            fy += (mdy / md) * s;
          }

          // Integrate with damping for smooth, coherent lag.
          const damping = grabbed ? 0.84 : 0.88;
          n.vx = (n.vx + fx / n.mass) * damping;
          n.vy = (n.vy + fy / n.mass) * damping;
          n.x += n.vx;
          n.y += n.vy;

          const rgb = paletteRGB[ni % paletteRGB.length];
          const baseR = (2.45 + n.size * 2.65) * (1 + ecoHf * 0.14 + pf * 0.37);
          const nodeR = grabbed ? baseR * (1.1 + pressBlast * 0.15) : baseR;

          ctx.save();
          ctx.translate(n.x, n.y);
          ctx.rotate(t * (0.25 + pressBlast * 0.35) * (0.6 + n.speed));
          ctx.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${0.53 + clusterTightness * 0.18 + pressBlast * 0.2})`;
          ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${0.18 + clusterTightness * 0.08 + pressBlast * 0.09})`;
          ctx.lineWidth = 0.95 + pressBlast * 0.4;

          if (n.kind === 0) {
            // Orb: core + orbit ring + satellite tick.
            ctx.beginPath();
            ctx.arc(0, 0, nodeR * 0.52, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(0, 0, nodeR, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([2, 4]);
            ctx.beginPath();
            ctx.arc(0, 0, nodeR * 1.45, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
            const satA = t * (1.2 + n.speed);
            ctx.beginPath();
            ctx.arc(Math.cos(satA) * nodeR * 1.45, Math.sin(satA) * nodeR * 1.45, 1.1, 0, Math.PI * 2);
            ctx.fill();
          } else if (n.kind === 1) {
            // Hex: double-shell technical hex.
            const drawHex = (r: number) => {
              ctx.beginPath();
              for (let s = 0; s <= 6; s++) {
                const aa = (s / 6) * Math.PI * 2;
                const x = Math.cos(aa) * r;
                const y = Math.sin(aa) * r;
                if (s === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
              }
              ctx.stroke();
            };
            drawHex(nodeR * 1.2);
            ctx.setLineDash([2, 4]);
            drawHex(nodeR * 0.78);
            ctx.setLineDash([]);
          } else {
            // Mini-mandala: layered ellipses with tiny radial rays.
            for (let li = 0; li < 3; li++) {
              const rr = nodeR * (0.7 + li * 0.38);
              const rot = t * 0.8 * (0.6 + li * 0.2) + li;
              ctx.globalAlpha = 0.55 - li * 0.12;
              ctx.beginPath();
              ctx.ellipse(0, 0, rr, rr * (0.85 + li * 0.07), rot, 0, Math.PI * 2);
              ctx.stroke();
            }
            ctx.globalAlpha = 0.42;
            for (let rj = 0; rj < 8; rj++) {
              const aa = (rj / 8) * Math.PI * 2 + t * 0.6;
              ctx.beginPath();
              ctx.moveTo(Math.cos(aa) * nodeR * 0.3, Math.sin(aa) * nodeR * 0.3);
              ctx.lineTo(Math.cos(aa) * nodeR * 1.1, Math.sin(aa) * nodeR * 1.1);
              ctx.stroke();
            }
          }
          ctx.restore();

          nodePositions.push({ x: n.x, y: n.y, r: nodeR, kind: n.kind });
        }

        // Dedicated ring network (~10 nodes) around the core, always responsive to mouse.
        for (let ri = 0; ri < ringNodes.length; ri++) {
          const rn = ringNodes[ri];
          const a = t * (0.24 + (ri % 5) * 0.04) + rn.phase;
          const baseRadius = rn.radius + Math.sin(t * 0.6 + ri) * 6;
          let tx = cx + Math.cos(a) * baseRadius;
          let ty = cy + Math.sin(a) * baseRadius;
          if (grabbed) {
            const ca = (ri / ringNodes.length) * Math.PI * 2 + t * 0.22;
            const cr = 36 + Math.sin(t * 1.2 + ri) * 4 + pressBlast * 70;
            tx = lerp(tx, cx + Math.cos(ca) * cr, 0.55 + pressBlast * 0.2);
            ty = lerp(ty, cy + Math.sin(ca) * cr, 0.55 + pressBlast * 0.2);
          }
          // Banner-style interaction: attraction + local push.
          const pull = subtlePullTowardMouse(
            rn.x,
            rn.y,
            mouseRef.current.x,
            mouseRef.current.y,
            NODE_MOUSE_REACH,
            NODE_MOUSE_PULL * 0.9,
          );
          let fx = (tx - rn.x) * 0.1 + pull.dx * 0.05;
          let fy = (ty - rn.y) * 0.1 + pull.dy * 0.05;
          const mdx = rn.x - mouseRef.current.x;
          const mdy = rn.y - mouseRef.current.y;
          const md = Math.sqrt(mdx * mdx + mdy * mdy);
          if (md < NODE_PUSH_RADIUS * 1.05 && md > 2) {
            const s = (1 - md / (NODE_PUSH_RADIUS * 1.05)) * (NODE_PUSH_STRENGTH * 0.045);
            fx += (mdx / md) * s;
            fy += (mdy / md) * s;
          }
          rn.vx = (rn.vx + fx) * (grabbed ? 0.86 : 0.9);
          rn.vy = (rn.vy + fy) * (grabbed ? 0.86 : 0.9);
          rn.x += rn.vx;
          rn.y += rn.vy;

          const rr = 3.45 + Math.sin(t * 0.8 + ri) * 0.75 + ecoHf * 0.62 + pressBlast * 0.82;
          const rgb = paletteRGB[ri % paletteRGB.length];
          ctx.save();
          ctx.translate(rn.x, rn.y);
          ctx.rotate(t * 0.35 + ri * 0.2);
          ctx.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${0.58 + ecoHf * 0.18 + pressBlast * 0.14})`;
          ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${0.23 + ecoHf * 0.1 + pressBlast * 0.07})`;
          ctx.lineWidth = 1.0;
          // mixed glyphs for coherence with ecosystem language
          if (ri % 3 === 0) {
            ctx.beginPath();
            ctx.arc(0, 0, rr * 0.55, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(0, 0, rr, 0, Math.PI * 2);
            ctx.stroke();
          } else if (ri % 3 === 1) {
            ctx.beginPath();
            for (let s = 0; s <= 6; s++) {
              const aa = (s / 6) * Math.PI * 2;
              const x = Math.cos(aa) * rr;
              const y = Math.sin(aa) * rr;
              if (s === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.stroke();
          } else {
            ctx.beginPath();
            ctx.ellipse(0, 0, rr * 1.2, rr * 0.82, t * 0.45 + ri, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.ellipse(0, 0, rr * 0.7, rr * 1.1, -t * 0.38 - ri, 0, Math.PI * 2);
            ctx.stroke();
          }
          ctx.restore();
          ringPositions.push({ x: rn.x, y: rn.y, r: rr, kind: (ri % 3) as 0 | 1 | 2 });
        }

        // Ambient ecosystem entities (banner-inspired) surrounding the node system.
        const entities = ambientEntitiesRef.current;
        for (let ei = 0; ei < entities.length; ei++) {
          const e = entities[ei];
          const driftA = t * (0.2 + (ei % 9) * 0.028) + e.phase;
          const ringR = 165 + Math.sin(t * 0.35 + e.seed) * 42 + (ei % 13) * 8;
          const tx = cx + Math.cos(driftA) * ringR + Math.sin(t * 0.8 + e.seed) * 22;
          const ty = cy + Math.sin(driftA) * ringR + Math.cos(t * 0.65 + e.seed) * 22;

          // Weak spring to keep entities orbiting the ecosystem field.
          let fx = (tx - e.x) * 0.018;
          let fy = (ty - e.y) * 0.018;

          // Respond to mandala field with lighter force than primary nodes.
          const dx = e.x - cx;
          const dy = e.y - cy;
          const rr = Math.max(1, Math.sqrt(dx * dx + dy * dy));
          const nx = dx / rr;
          const ny = dy / rr;
          const txv = -ny;
          const tyv = nx;
          const swirl = 0.08 + ecoHf * 0.08 + pf * 0.12;
          const ringAttract = -Math.tanh((rr - 215) / 70) * 0.16;
          fx += nx * ringAttract + txv * swirl;
          fy += ny * ringAttract + tyv * swirl;

          // Pointer influence for living default behavior.
          if (!grabbed) {
            const pull = subtlePullTowardMouse(
              e.x,
              e.y,
              mouseRef.current.x,
              mouseRef.current.y,
              NODE_MOUSE_REACH * 1.05,
              NODE_MOUSE_PULL * 0.55,
            );
            fx += pull.dx * 0.035;
            fy += pull.dy * 0.035;
          }
          const mdx = e.x - mouseRef.current.x;
          const mdy = e.y - mouseRef.current.y;
          const md = Math.sqrt(mdx * mdx + mdy * mdy);
          if (md < NODE_PUSH_RADIUS * 1.1 && md > 2) {
            const s = (1 - md / (NODE_PUSH_RADIUS * 1.1)) * (NODE_PUSH_STRENGTH * 0.03);
            fx += (mdx / md) * s;
            fy += (mdy / md) * s;
          }

          const damping = grabbed ? 0.9 : 0.92;
          e.vx = (e.vx + fx) * damping;
          e.vy = (e.vy + fy) * damping;
          e.x += e.vx;
          e.y += e.vy;

          const size = (1.75 + e.size * 2.15) * (1 + ecoHf * 0.1 + pf * 0.16);
          const rgb = paletteRGB[ei % paletteRGB.length];
          ctx.save();
          ctx.translate(e.x, e.y);
          ctx.rotate(t * 0.15 + e.phase);
          ctx.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${0.5 + ecoHf * 0.14 + pf * 0.11})`;
          ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${0.2 + ecoHf * 0.085 + pf * 0.06})`;
          ctx.lineWidth = 0.85;
          if (e.kind === 0) {
            ctx.beginPath();
            ctx.arc(0, 0, size * 0.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(0, 0, size, 0, Math.PI * 2);
            ctx.stroke();
          } else if (e.kind === 1) {
            ctx.beginPath();
            for (let s = 0; s <= 6; s++) {
              const aa = (s / 6) * Math.PI * 2;
              const x = Math.cos(aa) * size * 1.05;
              const y = Math.sin(aa) * size * 1.05;
              if (s === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.stroke();
          } else {
            ctx.beginPath();
            ctx.ellipse(0, 0, size * 1.2, size * 0.85, t * 0.25 + e.phase, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.ellipse(0, 0, size * 0.65, size * 1.1, -t * 0.2 - e.phase, 0, Math.PI * 2);
            ctx.stroke();
          }
          ctx.restore();
          ambientPositions.push({ x: e.x, y: e.y, r: size, kind: e.kind });
        }

        // System connective filaments around the euphoria core.
        // Phase 2: edge-tension styling + traveling pulse packets.
        ctx.save();
        ctx.lineWidth = 0.6 + pressBlast * 0.35;
        ctx.setLineDash([2, 5]);
        for (let i = 0; i < nodePositions.length; i++) {
          const a = nodePositions[i];
          const b = nodePositions[(i + 1) % nodePositions.length];
          const mx = (a.x + b.x) / 2 + Math.sin(t * 0.7 + i) * 4;
          const my = (a.y + b.y) / 2 + Math.cos(t * 0.6 + i) * 4;

          // Tension: edge stretch/compression vs a semantic rest length.
          const nA = nodes[i];
          const nB = nodes[(i + 1) % nodes.length];
          const len = dist(a.x, a.y, b.x, b.y);
          const desired = grabbed
            ? 24 + (nA.spread + nB.spread) * 0.7 + pressBlast * 18
            : Math.max(44, (nA.orbit + nB.orbit) * 0.42);
          const tension = Math.min(1, Math.abs(len - desired) / Math.max(1, desired));
          networkStress += tension;
          const bmX = (a.x + b.x) / 2;
          const bmY = (a.y + b.y) / 2;
          networkBiasX += (bmX - cx) * tension;
          networkBiasY += (bmY - cy) * tension;

          // Base edge.
          ctx.strokeStyle = `rgba(20,20,20,${lineAlpha * (0.9 - tension * 0.2)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.quadraticCurveTo(mx, my, b.x, b.y);
          ctx.stroke();

          // Tension overlay: brighter/thicker when stretched.
          if (tension > 0.08 || pressBlast > 0.03) {
            ctx.lineWidth = 0.55 + pressBlast * 0.3 + tension * 0.95;
            ctx.setLineDash([]);
            ctx.strokeStyle = `rgba(80,100,200,${0.06 + tension * 0.24 + pressBlast * 0.18})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.quadraticCurveTo(mx, my, b.x, b.y);
            ctx.stroke();
            ctx.lineWidth = 0.6 + pressBlast * 0.35;
            ctx.setLineDash([2, 5]);
          }

          // Traveling pulse packet along edge.
          const pulseU = ((t * (0.14 + tension * 0.35 + pressBlast * 0.5)) + i * 0.17) % 1;
          const o = 1 - pulseU;
          const px = o * o * a.x + 2 * o * pulseU * mx + pulseU * pulseU * b.x;
          const py = o * o * a.y + 2 * o * pulseU * my + pulseU * pulseU * b.y;
          const pulseR = 0.9 + tension * 1.25 + pressBlast * 1.4;
          ctx.fillStyle = `rgba(80,100,200,${0.08 + tension * 0.28 + pressBlast * 0.24})`;
          ctx.beginPath();
          ctx.arc(px, py, pulseR, 0, Math.PI * 2);
          ctx.fill();
        }
        if (nodePositions.length > 0) {
          networkStress /= nodePositions.length;
        }

        // Press-state network burst: center spokes signal the ecosystem synchronizing with the core.
        if (pressBlast > 0.04) {
          ctx.setLineDash([1, 4]);
          ctx.lineWidth = 0.45 + pressBlast * 0.45;
          ctx.strokeStyle = `rgba(20,20,20,${0.08 + pressBlast * 0.28})`;
          for (let i = 0; i < nodePositions.length; i++) {
            const p = nodePositions[i];
            const mx = lerp(cx, p.x, 0.45) + Math.sin(t * 2.1 + i) * (2 + pressBlast * 6);
            const my = lerp(cy, p.y, 0.45) + Math.cos(t * 1.9 + i) * (2 + pressBlast * 6);
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.quadraticCurveTo(mx, my, p.x, p.y);
            ctx.stroke();
          }
        }
        ctx.setLineDash([]);
        ctx.restore();

        // Organic web: connect both primary nodes + ambient entities by local proximity.
        const allPoints = [...nodePositions, ...ringPositions, ...ambientPositions];
        if (allPoints.length > 3) {
          const seen = new Set<string>();
          ctx.save();
          for (let i = 0; i < allPoints.length; i++) {
            const a = allPoints[i];
            const candidates: Array<{ j: number; d: number }> = [];
            for (let j = 0; j < allPoints.length; j++) {
              if (i === j) continue;
              const b = allPoints[j];
              const d = dist(a.x, a.y, b.x, b.y);
              if (d < WEB_LINK_MAX_DIST) candidates.push({ j, d });
            }
            candidates.sort((p, q) => p.d - q.d);
            for (const { j, d } of candidates.slice(0, 4)) {
              const key = i < j ? `${i}-${j}` : `${j}-${i}`;
              if (seen.has(key)) continue;
              seen.add(key);
              const b = allPoints[j];
              const attenuation = 0.55 + (1 - d / WEB_LINK_MAX_DIST) * 0.45;
              const alpha = attenuation * (0.2 + ecoHf * 0.1 + pf * 0.16);
              ctx.strokeStyle = `rgba(20,20,20,${alpha})`;
              ctx.lineWidth = 0.58 + (1 - d / WEB_LINK_MAX_DIST) * 0.82;
              ctx.setLineDash([1, 6]);
              const mx = (a.x + b.x) / 2 + Math.sin(t * 0.55 + i * 0.9 + j * 0.3) * 3.5;
              const my = (a.y + b.y) / 2 + Math.cos(t * 0.5 + i * 0.8 + j * 0.4) * 3.5;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.quadraticCurveTo(mx, my, b.x, b.y);
              ctx.stroke();
            }
          }
          ctx.setLineDash([]);
          ctx.restore();
        }
      }

      const numLayers = NUM_LAYERS;
      const networkBiasLen = Math.sqrt(networkBiasX * networkBiasX + networkBiasY * networkBiasY) || 1;
      const networkDirX = networkBiasX / networkBiasLen;
      const networkDirY = networkBiasY / networkBiasLen;
      const networkInfluence = Math.min(1, networkStress * (0.95 + pf * 0.55));
      for (let i = 0; i < numLayers; i++) {
        const driftSeed = i * 133.7;
        const driftX = (Math.sin(t * 0.12 + driftSeed) + Math.sin(t * 0.28 + i)) * (pf * 180 * (i / numLayers));
        const driftY = (Math.cos(t * 0.18 - driftSeed) + Math.cos(t * 0.09 + i)) * (pf * 180 * (i / numLayers));

        const jitterX = (Math.random() - 0.5) * 0.8;
        const jitterY = (Math.random() - 0.5) * 0.8;

        const lcxBase = cx + driftX + jitterX;
        const lcyBase = cy + driftY + jitterY;
        // Layered elastic pull creates "living tendril" micro-response in default state.
        const layerPull = subtlePullTowardMouse(
          lcxBase,
          lcyBase,
          mouseRef.current.x,
          mouseRef.current.y,
          CORE_MOUSE_REACH,
          (1 - i / numLayers) * 10 * (1 - pf * 0.35),
        );
        const biasFalloff = 1 - i / numLayers;
        const feedbackShift = (8 + pf * 10) * networkInfluence * biasFalloff;
        const lcx = lcxBase + layerPull.dx + networkDirX * feedbackShift;
        const lcy = lcyBase + layerPull.dy + networkDirY * feedbackShift;

        const stressWarp = networkInfluence * (0.22 + pf * 0.18) * biasFalloff;
        const stretchX = 1 + Math.sin(t * 0.06 + i * 1.8) * 0.7 * pf + networkDirX * stressWarp;
        const stretchY = 1 + Math.cos(t * 0.1 + i * 1.3) * 0.7 * pf + networkDirY * stressWarp;
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

        const colorFactor = Math.min(1.0, 0.42 + pf * 1.08 + hf * 0.3);
        const r = Math.round(lerp(charcoal.r, targetColor.r, colorFactor));
        const g = Math.round(lerp(charcoal.g, targetColor.g, colorFactor));
        const b = Math.round(lerp(charcoal.b, targetColor.b, colorFactor));
        const strokeColor = `rgb(${r}, ${g}, ${b})`;

        ctx.strokeStyle = strokeColor;
        ctx.globalAlpha =
          (lerp(0.11, 0.66, pf) + (hf * 0.18) + networkInfluence * 0.1) * (1 - i / numLayers * 0.47);
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
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      data-mandala-interactive="true"
      data-cursor={isGrabbedState ? 'grabbing' : (isHovered ? 'hand' : undefined)}
      className={`fixed inset-0 w-full h-full block ${isGrabbedState || (isHovered && isInMandalaZone) ? 'z-[100] pointer-events-auto' : 'z-[10] pointer-events-none'}`}
      style={{ touchAction: 'none' }}
      aria-hidden="true"
    />
  );
}
