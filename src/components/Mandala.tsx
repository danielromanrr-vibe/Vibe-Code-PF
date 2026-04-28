import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  BRANDING_CORE_LAYER_STRIDE,
  BRANDING_TIME_SCALE,
  MANDALA_TINY_STATE_HIT_RADIUS_SCALE,
  MANDALA_TINY_STATE_INK_BIAS,
  MANDALA_TINY_STATE_STROKE_WIDTH_MULT,
  MANDALA_TINY_STATE_VISUAL_BOOST,
  allowAmbientGridForPlacement,
  applyNavBrandingClipToCanvas,
  getNavBrandingScale,
  isMandalaTinyState,
  isNavBrandingVariant,
  NAV_GLYPH_TO_FULL_BLEND,
  NAV_HOME_REINTEGRATE_DIST_PX,
  shouldDrawPeripheralEcosystem,
  shouldRenderCoreLayerInBrandingMode,
  NAV_BRANDING_HOME_DRAW_NUDGE_X,
  type EuphoriaMandalaVariant,
} from './euphoriaMandala/placement';
import { drawNavBrandingHomeMandala } from './euphoriaMandala/drawNavBrandingHomeMandala';

/**
 * Euphoria Mandala — implements EUPHORIA_MANDALA_SPEC.md
 *
 * Visual: Canvas 2D, concentric oscillating layers, HSB→RGB color, alpha fade at outer edges.
 *
 * Interaction: Hover (distance to center), grab toggles on pointerdown (desktop); tap stays grabbed until
 * second tap on mandala or tap outside. Mobile coarse: center-intent pickup with drag slop; quick tap does
 * not grab. Activation requires ~2s steady hold from center before press visuals engage. Coarse: stronger
 * scroll isolation while dragging and free placement on release. Growth when grabbed+pressed; native grab/grabbing cursors on the canvas when interactive.
 *
 * ── Main menu (`variant="navIntegrated"`) — two presentation modes ──
 *
 * **Mandala tiny state** — Default at rest. The mandala’s *home* is the nav anchor container (`anchorId`):
 * logical center tracks that element; rendering is scaled into the chip, clipped to it, and uses a reduced
 * field (no peripheral ecosystem, no full-screen grid): less visual information, same core vocabulary.
 *
 * **Full Euphoria (legacy hero-equivalent)** — Entered when the tiny mandala is grabbed, or after release
 * with a *placed* position: full viewport canvas, full-scale layers, peripheral ecosystem, grid when active —
 * identical behavior to the former hero-integrated mandala (free movement across the canvas, same physics).
 * Exiting back to tiny state: magnetic return to the anchor, or when the placed instance is cleared.
 *
 * Other variants: `heroIntegrated` is always full field; `default` follows spec for non-hero placements.
 * Nav branding vs activation: `euphoriaMandala/placement.ts`.
 *
 * Tethering: Magnetic home, elastic tether, lerp physics — see spec. Press perf and reduced-motion behavior
 * apply as documented there. Hero ecosystem: balanced kinds + nv/av mod-6 glyphs (Kandinsky-adjacent field).
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

/** Mobile: min movement (px) before grab commits (touch+drag ≈ desktop grabbed). */
const MOBILE_GRAB_SLOP_PX = 10;

/**
 * Max distance from mandala logical center (px) to arm grab / drop — intent handle, not full artwork extent.
 * Capped by getHitRadius() if that is ever smaller (edge cases).
 */
const GRAB_INTENT_RADIUS_PX = 48;

/** Pending grab: cancel if movement looks like vertical scroll (dy dominates) before commit. */
const MOBILE_SCROLL_CANCEL_DY_PX = 16;
const MOBILE_SCROLL_CANCEL_DY_OVER_DX = 2.35;
const MOBILE_HOLD_TO_ACTIVATE_MS = 2000;
const MOBILE_HOLD_TOLERANCE_PX = 10;

/** True for touch-primary devices; desktop (fine pointer) keeps immediate grab on pointerdown. */
function isMobileDragToGrabMode(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: coarse)').matches;
}

/** Desktop: large symmetric halo for hit tests. Coarse: smaller, esp. bottom, so Highlights isn’t eaten. */
const REST_ZONE_PADDING_DESKTOP_PX = 200;

type RestZonePadding = { left: number; right: number; top: number; bottom: number };

function getRestZonePadding(): RestZonePadding {
  if (!isMobileDragToGrabMode()) {
    const p = REST_ZONE_PADDING_DESKTOP_PX;
    return { left: p, right: p, top: p, bottom: p };
  }
  return { left: 56, right: 56, top: 72, bottom: 28 };
}

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

/** Equal counts per kind (±1), randomly shuffled — avoids cyclic 0,1,2 spacing. */
function shuffleBalancedKinds(count: number): (0 | 1 | 2)[] {
  const base = Math.floor(count / 3);
  const rem = count % 3;
  const arr: (0 | 1 | 2)[] = [];
  for (let k = 0; k < 3; k++) {
    const n = base + (k < rem ? 1 : 0);
    for (let j = 0; j < n; j++) arr.push(k as 0 | 1 | 2);
  }
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
  return arr;
}

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
  /**
   * - `heroIntegrated`: full Euphoria field in a large hero region (legacy).
   * - `navIntegrated`: **mandala tiny state** at rest in the main menu anchor; grab → full Euphoria on the viewport.
   * - `default`: spec default for other placements.
   */
  variant?: 'default' | 'heroIntegrated' | 'navIntegrated';
  /**
   * **Home** for tethering: the element whose box defines center (and, in tiny state, clip bounds + scale).
   * Defaults: `mandala-nav` for nav, `mandala-home` for hero/default.
   */
  anchorId?: string;
  /**
   * Nav only. `embedded` — chip chrome lives on this component. `overlay` — use with `NavBrandingMount`
   * (shell + elevation above the strip); mandala renders only anchor + canvas.
   */
  navPresentation?: 'embedded' | 'overlay';
  /**
   * Nav tiny state: when `false`, the identity cluster keeps the mark visually nested — skip draw + grab
   * until the parent reveals (hover / focus / touch). Omitted = treated as `true`.
   */
  identityRevealed?: boolean;
};

type MobileMode = 'idle' | 'pending_center' | 'dragging' | 'activated_hold' | 'placed';

export default function Mandala({
  variant = 'default',
  anchorId: anchorIdProp,
  navPresentation = 'embedded',
  identityRevealed: identityRevealedProp = true,
}: MandalaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const identityRevealRef = useRef(identityRevealedProp);
  identityRevealRef.current = identityRevealedProp;
  const variantPlacement: EuphoriaMandalaVariant = variant;
  const isNavBranding = isNavBrandingVariant(variantPlacement);
  const anchorId = anchorIdProp ?? (isNavBranding ? 'mandala-nav' : 'mandala-home');
  const mouseRef = useRef({ x: 0, y: 0, isPressed: false });
  const centerRef = useRef({ x: 0, y: 0 });
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

  /** Touch+drag grab: set on pointerdown in mandala zone; cleared on commit, cancel, or up. */
  const mobileGrabPendingRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
  } | null>(null);
  const mobileGestureRef = useRef<{
    pointerId: number | null;
    dragCommitted: boolean;
    activated: boolean;
    startX: number;
    startY: number;
    holdStartTs: number;
    holdAnchorX: number;
    holdAnchorY: number;
  }>({
    pointerId: null,
    dragCommitted: false,
    activated: false,
    startX: 0,
    startY: 0,
    holdStartTs: 0,
    holdAnchorX: 0,
    holdAnchorY: 0,
  });
  const mobileModeRef = useRef<MobileMode>('idle');
  const coarsePointerRef = useRef(false);
  const mobileHoldRef = useRef<{
    pointerId: number | null;
    startX: number;
    startY: number;
    startTs: number;
    eligible: boolean;
    active: boolean;
  }>({
    pointerId: null,
    startX: 0,
    startY: 0,
    startTs: 0,
    eligible: false,
    active: false,
  });
  const [isMobileLockScroll, setIsMobileLockScroll] = useState(false);

  /** Nav: 0 = settled in chip, 1 = full viewport — lerped for clip / ecosystem / pacing. */
  const navActivationBlendRef = useRef(0);
  /** Smooths identity-slot reveal so the glyph eases in with the CSS crossfade. */
  const identityRevealBlendRef = useRef(0);
  /** One-shot emphasis when the field finishes snapping to the nav anchor. */
  const snapLandingPulseRef = useRef(0);

  /** Web / mobile: scales pressed-state cost & intensity (updated on resize + media queries). */
  const pressPerfRef = useRef({
    web: 1,
    skipGrid: false,
    maxShadow: 10,
    sizeCap: 118,
    sizeInc: 2.5,
    ecoPress: 1,
    pressLerp: 0.15,
    /** Mobile / reduced-motion: shrink drawn layers when idle; hit radius uses hitRadiusScale (smaller cut than visual). */
    visualLayerScale: 1,
    hitRadiusScale: 1,
  });

  /**
   * Coarse + grabbed: lightweight scroll isolation.
   * Avoid fixed-body/touchmove traps that can cause iOS stutter and visual jumps.
   */
  useEffect(() => {
    if (!isMobileLockScroll) {
      document.body.removeAttribute('data-mandala-grabbed-mobile');
      return;
    }
    if (!window.matchMedia('(pointer: coarse)').matches) return;

    document.body.dataset.mandalaGrabbedMobile = 'true';

    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevOverflow = body.style.overflow;
    const prevTouch = body.style.touchAction;
    const prevOverscroll = html.style.overscrollBehavior;

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    body.style.touchAction = 'none';
    html.style.overscrollBehavior = 'none';

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevOverflow;
      body.style.touchAction = prevTouch;
      html.style.overscrollBehavior = prevOverscroll;
      document.body.removeAttribute('data-mandala-grabbed-mobile');
    };
  }, [isMobileLockScroll]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const syncCenterToHome = () => {
      const home = document.getElementById(anchorId);
      if (home) {
        const rect = home.getBoundingClientRect();
        centerRef.current.x = rect.left + rect.width / 2;
        centerRef.current.y = rect.top + rect.height / 2;
      }
    };

    const syncPressPerf = () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const coarse = window.matchMedia('(pointer: coarse)').matches;
      const narrow = window.innerWidth < 640;
      const mobileLike = coarse || narrow;
      coarsePointerRef.current = coarse;
      const p = pressPerfRef.current;
      if (reduced) {
        p.web = 0.2;
        p.skipGrid = true;
        p.maxShadow = 0;
        p.sizeCap = 46;
        p.sizeInc = 0.5;
        p.ecoPress = 0.32;
        p.pressLerp = 0.24;
        p.visualLayerScale = 0.88;
        p.hitRadiusScale = 0.94;
      } else if (mobileLike) {
        p.web = 0.52;
        p.skipGrid = true;
        p.maxShadow = 0;
        p.sizeCap = 74;
        p.sizeInc = 1.15;
        p.ecoPress = 0.68;
        p.pressLerp = 0.2;
        p.visualLayerScale = 0.8;
        p.hitRadiusScale = 0.9;
      } else {
        p.web = 1;
        p.skipGrid = false;
        p.maxShadow = 10;
        p.sizeCap = 124;
        p.sizeInc = 2.5;
        p.ecoPress = 1;
        p.pressLerp = 0.15;
        p.visualLayerScale = 1;
        p.hitRadiusScale = 1;
      }
    };

    const handleResize = () => {
      // Nav uses a full-viewport buffer (same as hero) so grabbed/placed can use the full euphoria field.
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      syncCenterToHome();
      syncPressPerf();
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    let ro: ResizeObserver | null = null;
    if (isNavBranding) {
      const el = document.getElementById(anchorId);
      if (el && typeof ResizeObserver !== 'undefined') {
        ro = new ResizeObserver(() => handleResize());
        ro.observe(el);
      }
    }
    syncCenterToHome();

    const mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mqCoarse = window.matchMedia('(pointer: coarse)');
    const onPressPerfMedia = () => {
      syncPressPerf();
    };
    mqReduced.addEventListener('change', onPressPerfMedia);
    mqCoarse.addEventListener('change', onPressPerfMedia);

    if (systemNodesRef.current.length === 0) {
      const cx0 = centerRef.current.x || window.innerWidth / 2;
      const cy0 = centerRef.current.y || window.innerHeight / 2;
      const systemKinds = shuffleBalancedKinds(SYSTEM_NODE_COUNT);
      systemNodesRef.current = Array.from({ length: SYSTEM_NODE_COUNT }, (_, i) => ({
        phase: (i / SYSTEM_NODE_COUNT) * Math.PI * 2 + Math.random() * 0.6,
        orbit: 85 + Math.random() * 105,
        speed: 0.25 + Math.random() * 0.55,
        wobble: 0.6 + Math.random() * 0.8,
        size: 0.7 + Math.random() * 0.9,
        kind: systemKinds[i],
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
      const ambientKinds = shuffleBalancedKinds(AMBIENT_ENTITY_COUNT);
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
          kind: ambientKinds[i],
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
      const base = (10 + (NUM_LAYERS - 1) * 14) * (size / 50);
      let r = base * pressPerfRef.current.hitRadiusScale;
      const st = interactionRef.current;
      if (isMandalaTinyState(variantPlacement, st.isGrabbed, !!st.placedPos)) {
        r *= MANDALA_TINY_STATE_HIT_RADIUS_SCALE;
      }
      return r;
    };

    const getHitTestCenter = () => {
      const state = interactionRef.current;
      if (state.isGrabbed || state.placedPos) {
        return { x: centerRef.current.x, y: centerRef.current.y };
      }
      const home = document.getElementById(anchorId);
      if (home) {
        const rect = home.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      }
      return { x: centerRef.current.x, y: centerRef.current.y };
    };

    const isClickOnMandalaAtRest = (clientX: number, clientY: number) => {
      const st = interactionRef.current;
      const mandalaTinyStateInteraction = isMandalaTinyState(
        variantPlacement,
        st.isGrabbed,
        !!st.placedPos,
      );
      const pad = mandalaTinyStateInteraction
        ? { left: 24, right: 24, top: 22, bottom: 22 }
        : getRestZonePadding();
      const home = document.getElementById(anchorId);
      if (!home) return false;
      const rect = home.getBoundingClientRect();
      return (
        clientX >= rect.left - pad.left &&
        clientX <= rect.right + pad.right &&
        clientY >= rect.top - pad.top &&
        clientY <= rect.bottom + pad.bottom
      );
    };

    const safeReleasePointerCapture = (pointerId: number) => {
      try {
        if (canvas.hasPointerCapture?.(pointerId)) {
          canvas.releasePointerCapture(pointerId);
        }
      } catch {
        /* noop */
      }
    };

    const resetMobileGesture = () => {
      mobileGestureRef.current.pointerId = null;
      mobileGestureRef.current.dragCommitted = false;
      mobileGestureRef.current.activated = false;
      mobileGestureRef.current.startX = 0;
      mobileGestureRef.current.startY = 0;
      mobileGestureRef.current.holdStartTs = 0;
      mobileModeRef.current = interactionRef.current.placedPos ? 'placed' : 'idle';
      mobileHoldRef.current.pointerId = null;
      mobileHoldRef.current.startX = 0;
      mobileHoldRef.current.startY = 0;
      mobileHoldRef.current.startTs = 0;
      mobileHoldRef.current.eligible = false;
      mobileHoldRef.current.active = false;
      setIsMobileLockScroll(false);
    };

    const commitMobileGrab = (opts?: { activated?: boolean; dragCommitted?: boolean }) => {
      const state = interactionRef.current;
      state.isGrabbed = true;
      state.placedPos = null;
      setIsGrabbedState(true);
      document.body.dataset.mandalaGrabbed = 'true';
      paletteRef.current = [getRandomColor(), getRandomColor(), getRandomColor()];
      mobileGestureRef.current.dragCommitted = opts?.dragCommitted ?? true;
      mobileGestureRef.current.activated = opts?.activated ?? false;
      mobileModeRef.current = (opts?.activated ?? false) ? 'activated_hold' : 'dragging';
      mobileGestureRef.current.holdStartTs = 0;
      mobileGestureRef.current.holdAnchorX = mouseRef.current.x;
      mobileGestureRef.current.holdAnchorY = mouseRef.current.y;
      setIsMobileLockScroll(true);
      mobileGrabPendingRef.current = null;
    };

    const handlePointerMove = (e: PointerEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      const state = interactionRef.current;
      const mobileCoarse = coarsePointerRef.current;
      if (mobileCoarse) {
        const h = mobileHoldRef.current;
        if (h.pointerId === e.pointerId && h.eligible) {
          const dxh = e.clientX - h.startX;
          const dyh = e.clientY - h.startY;
          if (dxh * dxh + dyh * dyh > MOBILE_HOLD_TOLERANCE_PX * MOBILE_HOLD_TOLERANCE_PX) {
            h.eligible = false;
          }
        }
      }

      if (!mobileCoarse) {
        const pending = mobileGrabPendingRef.current;
        if (pending && e.pointerId === pending.pointerId) {
          const sdx = e.clientX - pending.startX;
          const sdy = e.clientY - pending.startY;
          const absX = Math.abs(sdx);
          const absY = Math.abs(sdy);
          if (
            absY > MOBILE_SCROLL_CANCEL_DY_PX &&
            absY > absX * MOBILE_SCROLL_CANCEL_DY_OVER_DX
          ) {
            mobileGrabPendingRef.current = null;
            mobileModeRef.current = interactionRef.current.placedPos ? 'placed' : 'idle';
            resetMobileGesture();
          } else if (sdx * sdx + sdy * sdy >= MOBILE_GRAB_SLOP_PX * MOBILE_GRAB_SLOP_PX) {
            commitMobileGrab({ activated: false, dragCommitted: true });
          }
        }
      }

      const center = getHitTestCenter();
      const dx = e.clientX - center.x;
      const dy = e.clientY - center.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxRadius = getHitRadius();
      const hovered = mobileCoarse ? false : dist < maxRadius;
      interactionRef.current.isHovered = hovered;

      const mandalaTinyForIdentity =
        isNavBrandingVariant(variantPlacement) &&
        isMandalaTinyState(variantPlacement, state.isGrabbed, !!state.placedPos);
      const navTinyIdentityHidden = mandalaTinyForIdentity && !identityRevealRef.current;
      const inZoneRaw = state.isGrabbed
        ? true
        : state.placedPos
          ? dist < POINTER_EVENTS_RADIUS_PLACED
          : isClickOnMandalaAtRest(e.clientX, e.clientY);
      setIsInMandalaZone(navTinyIdentityHidden ? false : inZoneRaw);
    };

    const isInteractiveElement = (el: HTMLElement | null) => {
      if (!el) return false;
      return !!el.closest('a, button, [role="button"], input, textarea, select, [contenteditable="true"]');
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const target = e.target as HTMLElement;
      if (target !== canvas && isInteractiveElement(target)) {
        return;
      }
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.isPressed = true;

      const state = interactionRef.current;
      const center = getHitTestCenter();
      const clickX = e.clientX;
      const clickY = e.clientY;
      const dx = clickX - center.x;
      const dy = clickY - center.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxRadius = getHitRadius();
      const grabIntentRadius = Math.min(GRAB_INTENT_RADIUS_PX, maxRadius);
      const mandalaTinyForIdentity =
        isNavBrandingVariant(variantPlacement) &&
        isMandalaTinyState(variantPlacement, state.isGrabbed, !!state.placedPos);
      const navTinyIdentityHidden = mandalaTinyForIdentity && !identityRevealRef.current;
      const clickOnMandala = dist < grabIntentRadius && !navTinyIdentityHidden;
      const mobileDragToGrab = isMobileDragToGrabMode();

      if (mobileDragToGrab) {
        if (clickOnMandala) {
          mobileModeRef.current = 'pending_center';
          mobileHoldRef.current.pointerId = e.pointerId;
          mobileHoldRef.current.startX = clickX;
          mobileHoldRef.current.startY = clickY;
          mobileHoldRef.current.startTs = performance.now();
          mobileHoldRef.current.eligible = true;
          mobileHoldRef.current.active = false;
          // Prevent iOS/Safari long-press UI behaviors (selection/callout) when activation-eligible.
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        mobileHoldRef.current.pointerId = null;
        mobileHoldRef.current.eligible = false;
        mobileHoldRef.current.active = false;
        return;
      }

      if (clickOnMandala) {
        if (state.isGrabbed) {
          if (!mobileDragToGrab) {
            safeReleasePointerCapture(e.pointerId);
            dropMandala();
            paletteRef.current = [getRandomColor(), getRandomColor(), getRandomColor()];
          }
          return;
        }
        if (mobileDragToGrab) {
          mobileModeRef.current = 'pending_center';
          mobileGestureRef.current.pointerId = e.pointerId;
          mobileGestureRef.current.dragCommitted = false;
          mobileGestureRef.current.activated = false;
          mobileGestureRef.current.startX = clickX;
          mobileGestureRef.current.startY = clickY;
          mobileGestureRef.current.holdStartTs = performance.now();
          mobileGestureRef.current.holdAnchorX = clickX;
          mobileGestureRef.current.holdAnchorY = clickY;
          mobileGrabPendingRef.current = {
            pointerId: e.pointerId,
            startX: clickX,
            startY: clickY,
          };
          try {
            canvas.setPointerCapture(e.pointerId);
          } catch {
            /* noop */
          }
          e.preventDefault();
          e.stopPropagation();
          return;
        }
      }

      paletteRef.current = [getRandomColor(), getRandomColor(), getRandomColor()];

      if (clickOnMandala) {
        if (!state.isGrabbed) {
          state.isGrabbed = true;
          state.placedPos = null;
          setIsGrabbedState(true);
          document.body.dataset.mandalaGrabbed = 'true';
          e.preventDefault();
          e.stopPropagation();
        }
      } else if (state.isGrabbed && !mobileDragToGrab) {
        dropMandala();
      }
    };

    const dropMandala = () => {
      interactionRef.current.isGrabbed = false;
      setIsGrabbedState(false);
      document.body.dataset.mandalaGrabbed = '';
      resetMobileGesture();

      const home = document.getElementById(anchorId);
      if (home && !isMobileDragToGrabMode()) {
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
      if (isMobileDragToGrabMode()) {
        mobileModeRef.current = 'placed';
      }
    };

    /** Release press only — grab is toggled on pointerdown (tap stays grabbed until second tap / tap out). */
    const handlePointerUp = (e: PointerEvent) => {
      if (!e.isPrimary) return;
      safeReleasePointerCapture(e.pointerId);
      const pend = mobileGrabPendingRef.current;
      if (pend && e.pointerId === pend.pointerId) {
        mobileGrabPendingRef.current = null;
      }
      if (isMobileDragToGrabMode()) {
        resetMobileGesture();
      }
      mouseRef.current.isPressed = false;
    };

    const handlePointerCancel = (e: PointerEvent) => {
      if (!e.isPrimary) return;
      safeReleasePointerCapture(e.pointerId);
      const pend = mobileGrabPendingRef.current;
      if (pend && e.pointerId === pend.pointerId) {
        mobileGrabPendingRef.current = null;
      }
      if (isMobileDragToGrabMode()) {
        resetMobileGesture();
      }
      mouseRef.current.isPressed = false;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, true);
    window.addEventListener('pointerup', handlePointerUp, true);
    window.addEventListener('pointercancel', handlePointerCancel, true);

    let animationFrame: number;

    const render = () => {
      const state = interactionRef.current;
      const pp = pressPerfRef.current;
      const mobileCoarse = coarsePointerRef.current;
      const mh = mobileHoldRef.current;

      if (
        mobileCoarse &&
        mh.pointerId !== null &&
        mh.eligible &&
        mouseRef.current.isPressed &&
        performance.now() - mh.startTs >= MOBILE_HOLD_TO_ACTIVATE_MS
      ) {
        mh.active = true;
        mobileModeRef.current = 'activated_hold';
      }

      const mobileMode: MobileMode = mobileCoarse
        ? (mh.active ? 'activated_hold' : mobileModeRef.current)
        : 'idle';

      const targetPF = (
        mobileCoarse
          ? (mh.active && mouseRef.current.isPressed)
          : (state.isGrabbed && mouseRef.current.isPressed)
      ) ? 1.0 : 0.0;
      state.pressFactor += (targetPF - state.pressFactor) * pp.pressLerp;
      state.hoverFactor = mobileCoarse
        ? lerp(state.hoverFactor, 0, 0.22)
        : lerp(state.hoverFactor, state.isHovered ? 1 : 0, 0.1);

      const pf = state.pressFactor;
      const hf = state.hoverFactor;
      const mandalaTinyState = isMandalaTinyState(
        variantPlacement,
        state.isGrabbed,
        !!state.placedPos,
      );
      const t = state.frameCount;

      if (state.isGrabbed && mouseRef.current.isPressed) {
        state.currentSize = Math.min(state.currentSize + pp.sizeInc, pp.sizeCap);
      } else {
        state.currentSize *= 0.97;
        state.currentSize = Math.max(state.currentSize, 18);
      }

      const dx = mouseRef.current.x - centerRef.current.x;
      const dy = mouseRef.current.y - centerRef.current.y;
      const distFromCenter = Math.sqrt(dx * dx + dy * dy);
      const d = Math.min(distFromCenter / 400, 1.0);

      const activePalette = paletteRef.current;

      let targetX = mouseRef.current.x;
      let targetY = mouseRef.current.y;

      if (mobileCoarse) {
        const home = document.getElementById(anchorId);
        if (home) {
          const rect = home.getBoundingClientRect();
          targetX = rect.left + rect.width / 2;
          targetY = rect.top + rect.height / 2;
        }
      } else if (!state.isGrabbed) {
        if (state.placedPos) {
          targetX = state.placedPos.x;
          targetY = state.placedPos.y - window.scrollY;
          if (!mobileCoarse) {
            const margin = 200;
            if (
              targetY < -margin ||
              targetY > window.innerHeight + margin ||
              targetX < -margin ||
              targetX > window.innerWidth + margin
            ) {
              state.placedPos = null;
            }
          }
        } else {
          const home = document.getElementById(anchorId);
          if (home) {
            const rect = home.getBoundingClientRect();
            targetX = rect.left + rect.width / 2;
            targetY = rect.top + rect.height / 2;
          }
        }
      }

      const lerpFactor = state.isGrabbed ? (mobileCoarse ? 0.32 : 0.2) : 0.08;
      centerRef.current.x = lerp(centerRef.current.x, targetX, lerpFactor);
      centerRef.current.y = lerp(centerRef.current.y, targetY, lerpFactor);

      let navActivationBlend = 0;
      if (isNavBranding) {
        const abPrev = navActivationBlendRef.current;
        let targetAct = 1;
        if (mandalaTinyState) {
          const hel = document.getElementById(anchorId);
          let distH = 1e9;
          if (hel) {
            const r = hel.getBoundingClientRect();
            const hx = r.left + r.width / 2;
            const hy = r.top + r.height / 2;
            distH = Math.sqrt(
              (centerRef.current.x - hx) ** 2 + (centerRef.current.y - hy) ** 2,
            );
          }
          const eps = mqReduced.matches ? 8 : NAV_HOME_REINTEGRATE_DIST_PX;
          targetAct = distH < eps ? 0 : 1;
        } else {
          targetAct = 1;
        }
        const step = mqReduced.matches ? 0.48 : 0.2;
        navActivationBlendRef.current += (targetAct - navActivationBlendRef.current) * step;
        navActivationBlend = navActivationBlendRef.current;

        if (
          mandalaTinyState &&
          abPrev > 0.2 &&
          navActivationBlend <= 0.2 &&
          targetAct === 0
        ) {
          snapLandingPulseRef.current = Math.min(1, snapLandingPulseRef.current + 0.72);
        }
        snapLandingPulseRef.current *= mqReduced.matches ? 0.85 : 0.9;

        identityRevealBlendRef.current = identityRevealRef.current ? 1 : 0;
      } else {
        navActivationBlendRef.current = 0;
      }

      const brandingPace = !mandalaTinyState
        ? 1
        : lerp(BRANDING_TIME_SCALE, 1, navActivationBlend);
      const tinyStateBoost = !mandalaTinyState
        ? 1
        : lerp(MANDALA_TINY_STATE_VISUAL_BOOST, 1, navActivationBlend);
      const drawPeripheralEcosystem = shouldDrawPeripheralEcosystem(
        variantPlacement,
        mandalaTinyState,
        navActivationBlend,
      );
      const peripheralIntroAlpha =
        isNavBranding && mandalaTinyState
          ? Math.min(1, Math.max(0, (navActivationBlend - 0.06) / 0.26))
          : 1;

      const oscSpeed = (0.4 + pf * 1.2 * pp.web + hf * 0.3) * brandingPace;
      state.frameCount += oscSpeed / 60;

      const rotationSpeed = (0.3 + pf * 1.5 * pp.web + hf * 0.2) * brandingPace;
      state.rotationAccumulator += rotationSpeed / 60;

      const heartbeat =
        Math.pow(Math.sin(t * 0.8), 6) * 15 * (1 + pf * (1.1 + 0.9 * pp.web)) * tinyStateBoost;
      const waveIntensity = (pf * (7 + 8 * pp.web) + hf * 5) * tinyStateBoost;
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

      let navDrawPushed = false;
      /** Nav chip geometry for tiny-state logo mark: exact center + scale to fill the anchor box. */
      let navChipForHome: {
        left: number;
        top: number;
        width: number;
        height: number;
        scale: number;
      } | null = null;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const useNavGlyphOnly =
        isNavBranding &&
        mandalaTinyState &&
        navActivationBlend < NAV_GLYPH_TO_FULL_BLEND;
      const navTinyRevealDraw =
        useNavGlyphOnly &&
        identityRevealRef.current &&
        identityRevealBlendRef.current > 0.006;
      if (useNavGlyphOnly && identityRevealRef.current) {
        const nrEl = document.getElementById(anchorId);
        const nr = nrEl?.getBoundingClientRect();
        if (nr && nr.width > 0) {
          const navScale = getNavBrandingScale(Math.min(nr.width, nr.height));
          navChipForHome = {
            left: nr.left,
            top: nr.top,
            width: nr.width,
            height: nr.height,
            scale: navScale,
          };
          ctx.save();
          navDrawPushed = true;
          /**
           * Chip-local space: `translate(+left,+top)` puts the chip TL at the correct viewport pixel.
           * (Using `translate(-left,-top)` with viewport coords was wrong — it mapped the mark to ~x≈w/2
           * on the full canvas, i.e. far left, so only a sliver appeared inside the clip.)
           */
          ctx.translate(nr.left, nr.top);
          ctx.translate(nr.width / 2, nr.height / 2);
          ctx.scale(navScale, navScale);
          ctx.translate(-nr.width / 2, -nr.height / 2);
        }
      }

      if (
        (hf > 0.1 || pf > 0.1) &&
        !pp.skipGrid &&
        allowAmbientGridForPlacement(variantPlacement, mandalaTinyState, navActivationBlend)
      ) {
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

      // Peripheral ecosystem: hero always; nav only when activated (not mandala tiny state).
      if (drawPeripheralEcosystem) {
        ctx.save();
        ctx.globalAlpha *= peripheralIntroAlpha;
        const reduceEcoMobile = mobileCoarse && mobileMode !== 'activated_hold';
        const activePalette = paletteRef.current;
        const paletteRGB = activePalette.map((c) => {
          const m = c.match(/\d+/g);
          return m ? m.map(Number) : [80, 100, 200];
        });
        const nodes = systemNodesRef.current;
        const ringNodes = ringNodesRef.current;
        const grabbed = state.isGrabbed;
        const pressBlast = pf * pp.ecoPress;
        // Mobile reduced mode: no synthetic hover floor; keep the field calmer.
        const ecoHf = reduceEcoMobile ? hf : Math.max(hf, 0.66);
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
            // Orb family: circles + Kandinsky-like arcs / ruled lines / bezier (nv 3–5 = non-circular bias).
            const nv = ((ni * 7907 + (n.spread * 13) | 0) + (Math.floor(n.phase * 100) % 97)) % 6;
            const outerR = nodeR * 1.45;
            const satA = t * (1.2 + n.speed);
            const strokeHexPath = (r: number, close: boolean) => {
              ctx.beginPath();
              for (let s = 0; s <= 6; s++) {
                const aa = (s / 6) * Math.PI * 2;
                const hx = Math.cos(aa) * r;
                const hy = Math.sin(aa) * r;
                if (s === 0) ctx.moveTo(hx, hy);
                else ctx.lineTo(hx, hy);
              }
              if (close) ctx.closePath();
            };
            if (nv === 3) {
              ctx.lineWidth = 0.78;
              ctx.globalAlpha = 0.48;
              ctx.beginPath();
              ctx.moveTo(-nodeR * 1.15, -nodeR * 0.12);
              ctx.lineTo(nodeR * 1.15, -nodeR * 0.12);
              ctx.stroke();
              ctx.globalAlpha = 0.38;
              ctx.beginPath();
              ctx.moveTo(-nodeR * 0.95, nodeR * 0.28);
              ctx.lineTo(nodeR * 0.95, nodeR * 0.28);
              ctx.stroke();
              ctx.globalAlpha = 0.62;
              ctx.beginPath();
              ctx.arc(0, -nodeR * 0.32, nodeR * 0.72, 0.12 * Math.PI, 0.88 * Math.PI);
              ctx.stroke();
              ctx.beginPath();
              ctx.arc(nodeR * 0.48, nodeR * 0.52, nodeR * 0.48, Math.PI * 1.08, Math.PI * 1.82);
              ctx.stroke();
              ctx.globalAlpha = 0.85;
              ctx.beginPath();
              ctx.arc(0, 0, 1.25, 0, Math.PI * 2);
              ctx.fill();
              ctx.globalAlpha = 1;
            } else if (nv === 4) {
              ctx.lineWidth = 0.82;
              ctx.globalAlpha = 0.58;
              ctx.beginPath();
              ctx.moveTo(-nodeR * 1.05, 0);
              ctx.quadraticCurveTo(0, -nodeR * 1.12, nodeR * 1.05, 0);
              ctx.stroke();
              ctx.globalAlpha = 0.45;
              ctx.beginPath();
              ctx.moveTo(-nodeR * 0.92, nodeR * 0.48);
              ctx.quadraticCurveTo(0, nodeR * 0.92, nodeR * 0.92, nodeR * 0.48);
              ctx.stroke();
              ctx.globalAlpha = 0.35;
              ctx.beginPath();
              ctx.moveTo(-nodeR * 0.42, -nodeR * 0.48);
              ctx.lineTo(nodeR * 0.38, nodeR * 0.52);
              ctx.stroke();
              ctx.globalAlpha = 0.55;
              ctx.beginPath();
              ctx.moveTo(nodeR * 0.55, -nodeR * 0.35);
              ctx.lineTo(-nodeR * 0.5, nodeR * 0.4);
              ctx.stroke();
              ctx.globalAlpha = 1;
            } else if (nv === 5) {
              ctx.lineWidth = 0.75;
              ctx.globalAlpha = 0.5;
              for (let k = -1; k <= 1; k++) {
                ctx.beginPath();
                ctx.moveTo(-nodeR * 0.35, k * nodeR * 0.22);
                ctx.lineTo(nodeR * 0.35, k * nodeR * 0.22);
                ctx.stroke();
              }
              ctx.globalAlpha = 0.55;
              ctx.beginPath();
              ctx.moveTo(0, -nodeR * 0.95);
              ctx.lineTo(0, nodeR * 0.95);
              ctx.stroke();
              ctx.globalAlpha = 0.65;
              ctx.beginPath();
              ctx.arc(-nodeR * 0.55, 0, nodeR * 0.42, -Math.PI * 0.45, Math.PI * 0.45);
              ctx.stroke();
              ctx.beginPath();
              ctx.arc(nodeR * 0.55, 0, nodeR * 0.42, Math.PI * 0.55, Math.PI * 1.45);
              ctx.stroke();
              ctx.globalAlpha = 1;
            } else if (nv === 1) {
              ctx.globalAlpha = 0.55;
              strokeHexPath(nodeR * 0.48, true);
              ctx.fill();
              ctx.globalAlpha = 1;
              ctx.beginPath();
              ctx.arc(0, 0, nodeR, 0, Math.PI * 2);
              ctx.stroke();
              ctx.setLineDash([2, 4]);
              ctx.beginPath();
              ctx.arc(0, 0, outerR, -0.35, Math.PI * 2 * 0.78);
              ctx.stroke();
              ctx.setLineDash([]);
              ctx.beginPath();
              ctx.arc(Math.cos(satA) * outerR, Math.sin(satA) * outerR, 1.1, 0, Math.PI * 2);
              ctx.fill();
            } else if (nv === 2) {
              ctx.beginPath();
              ctx.arc(0, 0, nodeR * 0.5, 0, Math.PI * 2);
              ctx.fill();
              ctx.beginPath();
              ctx.arc(0, 0, nodeR, 0, Math.PI * 2);
              ctx.stroke();
              ctx.setLineDash([2, 4]);
              ctx.beginPath();
              ctx.arc(0, 0, outerR, -0.9, Math.PI * 2 * 0.55);
              ctx.stroke();
              ctx.setLineDash([]);
              ctx.beginPath();
              ctx.moveTo(Math.cos(-0.9) * outerR, Math.sin(-0.9) * outerR);
              ctx.lineTo(Math.cos(-0.9) * outerR * 1.1, Math.sin(-0.9) * outerR * 1.1);
              ctx.stroke();
              ctx.beginPath();
              ctx.arc(Math.cos(satA * 0.85) * outerR, Math.sin(satA * 0.85) * outerR, 1.1, 0, Math.PI * 2);
              ctx.fill();
            } else {
              ctx.beginPath();
              ctx.arc(0, 0, nodeR * 0.52, 0, Math.PI * 2);
              ctx.fill();
              ctx.beginPath();
              ctx.arc(0, 0, nodeR, 0, Math.PI * 2);
              ctx.stroke();
              ctx.setLineDash([2, 4]);
              ctx.beginPath();
              ctx.arc(0, 0, outerR, 0, Math.PI * 2);
              ctx.stroke();
              ctx.setLineDash([]);
              ctx.beginPath();
              ctx.arc(Math.cos(satA) * outerR, Math.sin(satA) * outerR, 1.1, 0, Math.PI * 2);
              ctx.fill();
            }
          } else if (n.kind === 1) {
            const nv = ((ni * 5303 + Math.floor(n.spread) * 5) % 6 + 6) % 6;
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
            if (nv === 3) {
              ctx.lineWidth = 0.8;
              ctx.globalAlpha = 0.52;
              drawHex(nodeR * 1.18);
              ctx.globalAlpha = 0.4;
              ctx.beginPath();
              ctx.moveTo(-nodeR * 1.25, -nodeR * 1.25);
              ctx.lineTo(nodeR * 1.25, nodeR * 1.25);
              ctx.stroke();
              ctx.beginPath();
              ctx.moveTo(-nodeR * 1.25, nodeR * 1.25);
              ctx.lineTo(nodeR * 1.25, -nodeR * 1.25);
              ctx.stroke();
              ctx.globalAlpha = 1;
            } else if (nv === 4) {
              ctx.lineWidth = 0.78;
              ctx.globalAlpha = 0.55;
              ctx.beginPath();
              ctx.moveTo(-nodeR * 1.1, 0);
              ctx.lineTo(nodeR * 1.1, 0);
              ctx.stroke();
              ctx.beginPath();
              ctx.arc(0, -nodeR * 0.55, nodeR * 0.85, 0.05 * Math.PI, 0.95 * Math.PI);
              ctx.stroke();
              ctx.beginPath();
              ctx.arc(0, nodeR * 0.55, nodeR * 0.85, Math.PI * 1.05, Math.PI * 1.95);
              ctx.stroke();
              ctx.globalAlpha = 0.45;
              ctx.beginPath();
              ctx.moveTo(-nodeR * 0.5, -nodeR * 0.85);
              ctx.quadraticCurveTo(nodeR * 0.15, 0, -nodeR * 0.5, nodeR * 0.85);
              ctx.stroke();
              ctx.globalAlpha = 1;
            } else if (nv === 5) {
              ctx.lineWidth = 0.72;
              ctx.globalAlpha = 0.5;
              ctx.beginPath();
              ctx.moveTo(-nodeR * 1.05, nodeR * 0.2);
              ctx.lineTo(-nodeR * 0.2, -nodeR * 0.85);
              ctx.lineTo(nodeR * 0.55, nodeR * 0.35);
              ctx.lineTo(nodeR * 1.05, -nodeR * 0.5);
              ctx.stroke();
              ctx.globalAlpha = 0.58;
              ctx.beginPath();
              ctx.arc(-nodeR * 0.35, nodeR * 0.15, nodeR * 0.28, 0, Math.PI * 1.15);
              ctx.stroke();
              ctx.globalAlpha = 1;
            } else {
              drawHex(nodeR * 1.2);
              ctx.setLineDash([2, 4]);
              drawHex(nodeR * 0.78);
              ctx.setLineDash([]);
              if (nv === 1) {
                for (let s = 0; s < 6; s++) {
                  const aa = (s / 6) * Math.PI * 2;
                  const x0 = Math.cos(aa) * nodeR * 1.2;
                  const y0 = Math.sin(aa) * nodeR * 1.2;
                  const x1 = Math.cos(aa) * nodeR * 1.36;
                  const y1 = Math.sin(aa) * nodeR * 1.36;
                  ctx.beginPath();
                  ctx.moveTo(x0, y0);
                  ctx.lineTo(x1, y1);
                  ctx.stroke();
                }
              } else if (nv === 2) {
                ctx.globalAlpha = 0.5;
                ctx.setLineDash([1, 3]);
                drawHex(nodeR * 0.46);
                ctx.setLineDash([]);
                ctx.globalAlpha = 1;
              }
            }
          } else {
            const nv = ((ni * 3407 + Math.floor(n.wobble * 100)) % 6 + 6) % 6;
            const rayCount = nv === 1 ? 6 : 8;
            if (nv === 3) {
              ctx.lineWidth = 0.72;
              const tilt = n.phase * 0.4;
              ctx.globalAlpha = 0.42;
              for (let ln = 0; ln < 5; ln++) {
                const off = (ln - 2) * nodeR * 0.14;
                ctx.beginPath();
                ctx.moveTo(-nodeR * 1.05 + off * Math.cos(tilt), -nodeR * 0.9 + off * Math.sin(tilt));
                ctx.lineTo(nodeR * 1.05 + off * Math.cos(tilt), nodeR * 0.9 + off * Math.sin(tilt));
                ctx.stroke();
              }
              ctx.globalAlpha = 0.55;
              ctx.beginPath();
              ctx.arc(0, -nodeR * 0.25, nodeR * 0.65, 0.2 * Math.PI, 0.75 * Math.PI);
              ctx.stroke();
              ctx.globalAlpha = 1;
            } else if (nv === 4) {
              ctx.lineWidth = 0.78;
              ctx.globalAlpha = 0.52;
              ctx.beginPath();
              ctx.arc(0, 0, nodeR * 0.95, -0.25 * Math.PI, 0.65 * Math.PI);
              ctx.stroke();
              ctx.beginPath();
              ctx.arc(nodeR * 0.35, -nodeR * 0.2, nodeR * 0.55, Math.PI * 0.4, Math.PI * 1.35);
              ctx.stroke();
              ctx.beginPath();
              ctx.arc(-nodeR * 0.42, nodeR * 0.35, nodeR * 0.48, Math.PI * 1.1, Math.PI * 1.85);
              ctx.stroke();
              ctx.globalAlpha = 0.38;
              ctx.beginPath();
              ctx.moveTo(-nodeR * 0.85, nodeR * 0.65);
              ctx.lineTo(nodeR * 0.75, -nodeR * 0.55);
              ctx.stroke();
              ctx.globalAlpha = 1;
            } else if (nv === 5) {
              ctx.lineWidth = 0.75;
              ctx.globalAlpha = 0.5;
              ctx.beginPath();
              ctx.moveTo(-nodeR, -nodeR * 0.35);
              ctx.quadraticCurveTo(0, nodeR * 0.15, nodeR, -nodeR * 0.35);
              ctx.stroke();
              ctx.globalAlpha = 0.42;
              ctx.beginPath();
              ctx.moveTo(-nodeR * 0.85, nodeR * 0.4);
              ctx.quadraticCurveTo(0, -nodeR * 0.2, nodeR * 0.85, nodeR * 0.4);
              ctx.stroke();
              ctx.globalAlpha = 0.55;
              ctx.beginPath();
              ctx.moveTo(0, -nodeR * 1.05);
              ctx.lineTo(0, nodeR * 1.05);
              ctx.stroke();
              ctx.globalAlpha = 1;
            } else {
              for (let li = 0; li < 3; li++) {
                const rr = nodeR * (0.7 + li * 0.38);
                const rot = t * 0.8 * (0.6 + li * 0.2) + li;
                ctx.globalAlpha = 0.55 - li * 0.12;
                const aspect = nv === 2 ? 0.62 + li * 0.09 : 0.85 + li * 0.07;
                ctx.beginPath();
                ctx.ellipse(0, 0, rr, rr * aspect, rot, 0, Math.PI * 2);
                ctx.stroke();
              }
              ctx.globalAlpha = 0.42;
              for (let rj = 0; rj < rayCount; rj++) {
                const aa = (rj / rayCount) * Math.PI * 2 + t * 0.6;
                ctx.beginPath();
                ctx.moveTo(Math.cos(aa) * nodeR * 0.3, Math.sin(aa) * nodeR * 0.3);
                ctx.lineTo(Math.cos(aa) * nodeR * 1.1, Math.sin(aa) * nodeR * 1.1);
                ctx.stroke();
              }
              ctx.globalAlpha = 1;
            }
          }
          ctx.restore();

          nodePositions.push({ x: n.x, y: n.y, r: nodeR, kind: n.kind });
        }

        // Dedicated ring network (~10 nodes) around the core.
        if (!reduceEcoMobile) for (let ri = 0; ri < ringNodes.length; ri++) {
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
          const rg = ri % 6;
          if (rg === 0) {
            ctx.beginPath();
            ctx.arc(0, 0, rr * 0.55, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(0, 0, rr, 0, Math.PI * 2);
            ctx.stroke();
          } else if (rg === 1) {
            ctx.beginPath();
            for (let s = 0; s <= 6; s++) {
              const aa = (s / 6) * Math.PI * 2;
              const x = Math.cos(aa) * rr;
              const y = Math.sin(aa) * rr;
              if (s === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.stroke();
          } else if (rg === 2) {
            ctx.beginPath();
            ctx.ellipse(0, 0, rr * 1.2, rr * 0.82, t * 0.45 + ri, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.ellipse(0, 0, rr * 0.7, rr * 1.1, -t * 0.38 - ri, 0, Math.PI * 2);
            ctx.stroke();
          } else if (rg === 3) {
            ctx.globalAlpha = 0.52;
            ctx.beginPath();
            ctx.moveTo(-rr * 1.2, 0);
            ctx.lineTo(rr * 1.2, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, -rr * 0.35, rr * 0.75, 0.1 * Math.PI, 0.9 * Math.PI);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(-rr * 0.35, rr * 0.55);
            ctx.quadraticCurveTo(rr * 0.2, -rr * 0.25, rr * 0.55, rr * 0.45);
            ctx.stroke();
            ctx.globalAlpha = 1;
          } else if (rg === 4) {
            ctx.globalAlpha = 0.55;
            ctx.beginPath();
            ctx.arc(0, 0, rr * 0.55, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, 0, rr, -0.25 * Math.PI, 0.65 * Math.PI);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(-rr * 0.9, rr * 0.4);
            ctx.lineTo(rr * 0.85, -rr * 0.35);
            ctx.stroke();
            ctx.globalAlpha = 1;
          } else {
            ctx.globalAlpha = 0.48;
            for (let q = -1; q <= 1; q++) {
              ctx.beginPath();
              ctx.moveTo(-rr * 1.1, q * rr * 0.22);
              ctx.lineTo(rr * 1.1, q * rr * 0.22);
              ctx.stroke();
            }
            ctx.globalAlpha = 0.58;
            ctx.beginPath();
            ctx.arc(rr * 0.35, 0, rr * 0.4, Math.PI * 0.5, Math.PI * 1.5);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
          ctx.restore();
          ringPositions.push({ x: rn.x, y: rn.y, r: rr, kind: (ri % 3) as 0 | 1 | 2 });
        }

        // Ambient ecosystem entities (banner-inspired) surrounding the node system.
        const entities = ambientEntitiesRef.current;
        if (!reduceEcoMobile) for (let ei = 0; ei < entities.length; ei++) {
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
          const av = ((ei * 17 + Math.floor(e.seed)) % 6 + 6) % 6;
          if (e.kind === 0) {
            if (av === 3) {
              ctx.lineWidth = 0.72;
              ctx.globalAlpha = 0.45;
              ctx.beginPath();
              ctx.moveTo(-size * 1.1, -size * 0.1);
              ctx.lineTo(size * 1.1, -size * 0.1);
              ctx.stroke();
              ctx.beginPath();
              ctx.moveTo(-size * 0.95, size * 0.22);
              ctx.lineTo(size * 0.95, size * 0.22);
              ctx.stroke();
              ctx.globalAlpha = 0.58;
              ctx.beginPath();
              ctx.arc(0, -size * 0.28, size * 0.7, 0.15 * Math.PI, 0.88 * Math.PI);
              ctx.stroke();
              ctx.globalAlpha = 0.75;
              ctx.beginPath();
              ctx.arc(0, 0, 1.1, 0, Math.PI * 2);
              ctx.fill();
              ctx.globalAlpha = 1;
            } else if (av === 4) {
              ctx.lineWidth = 0.75;
              ctx.globalAlpha = 0.52;
              ctx.beginPath();
              ctx.moveTo(-size, 0);
              ctx.quadraticCurveTo(0, -size * 1.05, size, 0);
              ctx.stroke();
              ctx.globalAlpha = 0.4;
              ctx.beginPath();
              ctx.moveTo(-size * 0.35, size * 0.45);
              ctx.lineTo(size * 0.4, -size * 0.42);
              ctx.stroke();
              ctx.globalAlpha = 1;
            } else if (av === 5) {
              ctx.lineWidth = 0.68;
              ctx.globalAlpha = 0.44;
              ctx.beginPath();
              ctx.moveTo(0, -size * 1.05);
              ctx.lineTo(0, size * 1.05);
              ctx.stroke();
              ctx.globalAlpha = 0.48;
              for (let k = -1; k <= 1; k++) {
                ctx.beginPath();
                ctx.moveTo(-size * 0.9, k * size * 0.18);
                ctx.lineTo(size * 0.9, k * size * 0.18);
                ctx.stroke();
              }
              ctx.globalAlpha = 0.55;
              ctx.beginPath();
              ctx.arc(-size * 0.45, 0, size * 0.38, -Math.PI * 0.4, Math.PI * 0.4);
              ctx.stroke();
              ctx.globalAlpha = 1;
            } else if (av === 1) {
              ctx.globalAlpha = 0.55;
              ctx.beginPath();
              for (let s = 0; s <= 6; s++) {
                const aa = (s / 6) * Math.PI * 2;
                const x = Math.cos(aa) * size * 0.5;
                const y = Math.sin(aa) * size * 0.5;
                if (s === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
              }
              ctx.closePath();
              ctx.fill();
              ctx.globalAlpha = 1;
              ctx.beginPath();
              ctx.arc(0, 0, size, 0, Math.PI * 2);
              ctx.stroke();
            } else {
              ctx.beginPath();
              ctx.arc(0, 0, size * 0.5, 0, Math.PI * 2);
              ctx.fill();
              ctx.beginPath();
              ctx.arc(0, 0, size, 0, Math.PI * 2);
              ctx.stroke();
              if (av === 2) {
                ctx.setLineDash([1, 4]);
                ctx.beginPath();
                ctx.arc(0, 0, size * 1.2, 0.2, Math.PI * 1.4);
                ctx.stroke();
                ctx.setLineDash([]);
              }
            }
          } else if (e.kind === 1) {
            if (av === 3) {
              ctx.lineWidth = 0.72;
              ctx.globalAlpha = 0.48;
              ctx.beginPath();
              for (let s = 0; s <= 6; s++) {
                const aa = (s / 6) * Math.PI * 2;
                const x = Math.cos(aa) * size * 1.02;
                const y = Math.sin(aa) * size * 1.02;
                if (s === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
              }
              ctx.stroke();
              ctx.globalAlpha = 0.38;
              ctx.beginPath();
              ctx.moveTo(-size * 1.15, -size * 1.15);
              ctx.lineTo(size * 1.15, size * 1.15);
              ctx.stroke();
              ctx.globalAlpha = 1;
            } else if (av === 4) {
              ctx.lineWidth = 0.74;
              ctx.globalAlpha = 0.5;
              ctx.beginPath();
              ctx.moveTo(-size * 1.1, 0);
              ctx.lineTo(size * 1.1, 0);
              ctx.stroke();
              ctx.beginPath();
              ctx.arc(0, -size * 0.5, size * 0.78, 0.08 * Math.PI, 0.92 * Math.PI);
              ctx.stroke();
              ctx.globalAlpha = 1;
            } else if (av === 5) {
              ctx.lineWidth = 0.68;
              ctx.globalAlpha = 0.48;
              ctx.beginPath();
              ctx.moveTo(-size * 1.05, size * 0.18);
              ctx.lineTo(-size * 0.15, -size * 0.82);
              ctx.lineTo(size * 0.55, size * 0.32);
              ctx.lineTo(size * 1.1, -size * 0.48);
              ctx.stroke();
              ctx.globalAlpha = 0.55;
              ctx.beginPath();
              ctx.arc(-size * 0.32, size * 0.12, size * 0.26, 0, Math.PI);
              ctx.stroke();
              ctx.globalAlpha = 1;
            } else {
              ctx.beginPath();
              for (let s = 0; s <= 6; s++) {
                const aa = (s / 6) * Math.PI * 2;
                const x = Math.cos(aa) * size * 1.05;
                const y = Math.sin(aa) * size * 1.05;
                if (s === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
              }
              ctx.stroke();
              if (av === 1) {
                for (let s = 0; s < 6; s++) {
                  const aa = (s / 6) * Math.PI * 2;
                  ctx.beginPath();
                  ctx.moveTo(Math.cos(aa) * size * 1.05, Math.sin(aa) * size * 1.05);
                  ctx.lineTo(Math.cos(aa) * size * 1.22, Math.sin(aa) * size * 1.22);
                  ctx.stroke();
                }
              }
            }
          } else {
            const asp = av === 2 ? 0.68 : 0.85;
            if (av === 3) {
              ctx.lineWidth = 0.68;
              ctx.globalAlpha = 0.44;
              for (let ln = 0; ln < 4; ln++) {
                const off = (ln - 1.5) * size * 0.12;
                ctx.beginPath();
                ctx.moveTo(-size * 0.95 + off, -size * 0.85);
                ctx.lineTo(size * 0.95 + off, size * 0.85);
                ctx.stroke();
              }
              ctx.globalAlpha = 0.52;
              ctx.beginPath();
              ctx.arc(0, -size * 0.2, size * 0.62, 0.18 * Math.PI, 0.78 * Math.PI);
              ctx.stroke();
              ctx.globalAlpha = 1;
            } else if (av === 4) {
              ctx.lineWidth = 0.74;
              ctx.globalAlpha = 0.5;
              ctx.beginPath();
              ctx.arc(0, 0, size * 0.88, -0.2 * Math.PI, 0.75 * Math.PI);
              ctx.stroke();
              ctx.beginPath();
              ctx.arc(size * 0.32, -size * 0.18, size * 0.52, Math.PI * 0.45, Math.PI * 1.4);
              ctx.stroke();
              ctx.beginPath();
              ctx.arc(-size * 0.38, size * 0.28, size * 0.45, Math.PI * 1.05, Math.PI * 1.95);
              ctx.stroke();
              ctx.globalAlpha = 1;
            } else if (av === 5) {
              ctx.lineWidth = 0.7;
              ctx.globalAlpha = 0.48;
              ctx.beginPath();
              ctx.moveTo(-size * 0.95, -size * 0.28);
              ctx.quadraticCurveTo(0, size * 0.12, size * 0.95, -size * 0.28);
              ctx.stroke();
              ctx.globalAlpha = 0.42;
              ctx.beginPath();
              ctx.moveTo(0, -size * 1.05);
              ctx.lineTo(0, size * 1.05);
              ctx.stroke();
              ctx.globalAlpha = 1;
            } else {
              ctx.beginPath();
              ctx.ellipse(0, 0, size * 1.2, size * asp, t * 0.25 + e.phase, 0, Math.PI * 2);
              ctx.stroke();
              ctx.beginPath();
              ctx.ellipse(0, 0, size * 0.65, size * (1.18 - asp * 0.25), -t * 0.2 - e.phase, 0, Math.PI * 2);
              ctx.stroke();
              if (av === 1) {
                for (let rj = 0; rj < 6; rj++) {
                  const aa = (rj / 6) * Math.PI * 2 + t * 0.2;
                  ctx.beginPath();
                  ctx.moveTo(Math.cos(aa) * size * 0.25, Math.sin(aa) * size * 0.25);
                  ctx.lineTo(Math.cos(aa) * size * 1.05, Math.sin(aa) * size * 1.05);
                  ctx.stroke();
                }
              }
            }
          }
          ctx.restore();
          ambientPositions.push({ x: e.x, y: e.y, r: size, kind: e.kind });
        }

        // System connective filaments around the euphoria core.
        // Phase 2: edge-tension styling + traveling pulse packets.
        if (!reduceEcoMobile) {
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
        }

        // Organic web: connect both primary nodes + ambient entities by local proximity.
        const allPoints = [...nodePositions, ...ringPositions, ...ambientPositions];
        if (!reduceEcoMobile && allPoints.length > 3) {
          const seen = new Set<string>();
          const webStride = pp.skipGrid && pf > 0.12 ? 2 : 1;
          ctx.save();
          for (let i = 0; i < allPoints.length; i += webStride) {
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
        ctx.restore();
      }

      const numLayers = NUM_LAYERS;
      const networkBiasLen = Math.sqrt(networkBiasX * networkBiasX + networkBiasY * networkBiasY) || 1;
      const networkDirX = networkBiasX / networkBiasLen;
      const networkDirY = networkBiasY / networkBiasLen;
      const networkInfluence = Math.min(1, networkStress * (0.95 + pf * 0.55));

      const skipFullCoreWhileNameOnly =
        isNavBranding &&
        mandalaTinyState &&
        navActivationBlend < NAV_GLYPH_TO_FULL_BLEND &&
        !identityRevealRef.current;

      if (navTinyRevealDraw && navChipForHome) {
        const { left: nl, top: nt, width: nw, height: nh } = navChipForHome;
        ctx.save();
        ctx.globalAlpha *= identityRevealBlendRef.current;
        drawNavBrandingHomeMandala(ctx, {
          cx: nw / 2 + NAV_BRANDING_HOME_DRAW_NUDGE_X,
          cy: nh / 2,
          t,
          mouseX: mouseRef.current.x - nl,
          mouseY: mouseRef.current.y - nt,
          rotationAccumulator: state.rotationAccumulator,
          activePalette,
          pf,
          hf,
          d,
          containerW: navChipForHome.width,
          containerH: navChipForHome.height,
          navScale: navChipForHome.scale,
          landingPulse: snapLandingPulseRef.current,
        });
        ctx.restore();
      }

      if (
        !skipFullCoreWhileNameOnly &&
        (!useNavGlyphOnly || !navTinyRevealDraw || !navChipForHome)
      ) {
      for (let i = 0; i < numLayers; i++) {
        if (
          mandalaTinyState &&
          navActivationBlend < NAV_GLYPH_TO_FULL_BLEND &&
          !shouldRenderCoreLayerInBrandingMode(i, BRANDING_CORE_LAYER_STRIDE)
        ) {
          continue;
        }
        const driftSeed = i * 133.7;
        const driftX =
          (Math.sin(t * 0.12 + driftSeed) + Math.sin(t * 0.28 + i)) *
          (pf * 180 * (i / numLayers) * pp.web);
        const driftY =
          (Math.cos(t * 0.18 - driftSeed) + Math.cos(t * 0.09 + i)) *
          (pf * 180 * (i / numLayers) * pp.web);

        const jitterX = Math.sin(t * 0.71 + driftSeed * 0.017) * 0.4;
        const jitterY = Math.cos(t * 0.69 + driftSeed * 0.019) * 0.4;

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

        const layerVisScale = lerp(pp.visualLayerScale, 1, pf);
        const baseRadius =
          (10 + i * 14) * (state.currentSize / 50) * depthScale * layerVisScale;
        const biologicalPulse = Math.sin(t * 0.5 + i * 0.2) * Math.sin(t * 0.2 + i * 0.5);
        const oscAmp =
          (8 + pf * 100 * pp.web) * (1 + d * 1.5) * (mandalaTinyState ? tinyStateBoost : 1);
        const radius = Math.max(0.1, baseRadius + biologicalPulse * oscAmp);

        const rotationOffset = (state.rotationAccumulator * (0.012 + i * 0.003)) + (i * Math.PI / 1.1);

        const charcoal = { r: 20, g: 20, b: 20 };
        const rgbMatch = activePalette[i % activePalette.length].match(/\d+/g);
        const accentRGB = rgbMatch ? rgbMatch.map(Number) : [80, 100, 200];
        const targetColor = { r: accentRGB[0], g: accentRGB[1], b: accentRGB[2] };

        const colorFactor = Math.min(
          1.0,
          0.42 + pf * 1.08 + hf * 0.3 + (mandalaTinyState ? MANDALA_TINY_STATE_INK_BIAS : 0),
        );
        const r = Math.round(lerp(charcoal.r, targetColor.r, colorFactor));
        const g = Math.round(lerp(charcoal.g, targetColor.g, colorFactor));
        const b = Math.round(lerp(charcoal.b, targetColor.b, colorFactor));
        const strokeColor = `rgb(${r}, ${g}, ${b})`;

        ctx.strokeStyle = strokeColor;
        ctx.globalAlpha = Math.min(
          1,
          (lerp(0.11, 0.66, pf) + (hf * 0.18) + networkInfluence * 0.1) *
            (1 - i / numLayers * 0.47) *
            (mandalaTinyState ? tinyStateBoost : 1),
        );
        ctx.lineWidth =
          (i % 5 === 0 ? 1.5 : 0.5) *
          lerp(1, 2.0, pf) *
          (mandalaTinyState ? MANDALA_TINY_STATE_STROKE_WIDTH_MULT : 1);

        if (pf > 0.1 && pp.maxShadow > 0 && !mandalaTinyState) {
          ctx.shadowBlur = Math.min(pp.maxShadow, 10 * pf);
          ctx.shadowColor = strokeColor;
        } else {
          ctx.shadowBlur = 0;
        }

        const strokeOsc = Math.sin(t * 0.5 + i) * 0.5 + 0.5;
        ctx.lineWidth *= 0.8 + strokeOsc * 0.4;

        if (mandalaTinyState) {
          ctx.setLineDash([]);
        } else if (i % 7 === 0) {
          ctx.setLineDash([40, 20]);
        } else if (i % 4 === 0) {
          ctx.setLineDash([2, 8]);
        } else if (i % 9 === 0) {
          ctx.setLineDash([15, 5, 2, 5]);
        } else {
          ctx.setLineDash([]);
        }

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

        if (i === 7 && !mandalaTinyState) {
          ctx.save();
          ctx.globalAlpha *= 0.5;
          ctx.setLineDash([2, 10]);
          ctx.beginPath();
          ctx.arc(lcx, lcy, radius * 1.15, t * 0.5, t * 0.5 + Math.PI * 0.5);
          ctx.stroke();
          ctx.restore();
        }

        if (
          !mandalaTinyState &&
          (pf > 0.2 || hf > 0.5) &&
          i % 5 === 0 &&
          pp.web > 0.35
        ) {
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

        if (!mandalaTinyState && (pf > 0.1 || hf > 0.3) && pp.web > 0.35) {
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
      }

      if (navDrawPushed) {
        ctx.restore();
      }

      if (isNavBranding) {
        applyNavBrandingClipToCanvas(canvas, anchorId, navActivationBlend);
      }

      animationFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      document.body.dataset.mandalaGrabbed = '';
      mqReduced.removeEventListener('change', onPressPerfMedia);
      mqCoarse.removeEventListener('change', onPressPerfMedia);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown, true);
      window.removeEventListener('pointerup', handlePointerUp, true);
      window.removeEventListener('pointercancel', handlePointerCancel, true);
      window.removeEventListener('resize', handleResize);
      ro?.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, [variant, anchorId]);

  const navTinyIdentityHiddenAtRender =
    isNavBranding &&
    isMandalaTinyState(variantPlacement, isGrabbedState, !!interactionRef.current.placedPos) &&
    !identityRevealRef.current;

  useEffect(() => {
    if (navTinyIdentityHiddenAtRender) {
      setIsInMandalaZone(false);
    }
  }, [navTinyIdentityHiddenAtRender]);

  // Use `isInMandalaZone` (rest pad / placed halo), not `isHovered` alone — tiny-state hit radius can be
  // smaller than the interaction pad; requiring both left the canvas `pointer-events-none` so grabs missed.
  const canvasPointerClass = navTinyIdentityHiddenAtRender
    ? 'pointer-events-none'
    : isGrabbedState || isInMandalaZone
      ? 'pointer-events-auto'
      : 'pointer-events-none';
  const canvasCursorClass = isGrabbedState
    ? 'cursor-grabbing'
    : navTinyIdentityHiddenAtRender
      ? 'cursor-auto'
      : isInMandalaZone
      ? 'cursor-grab'
      : 'cursor-auto';

  if (isNavBranding) {
    const overlayChrome = navPresentation === 'overlay';
    return (
      <div
        className={
          overlayChrome
            ? 'relative h-full w-full'
            : 'relative z-0 h-9 w-9 shrink-0 rounded-md ring-1 ring-ink/[0.1] bg-ink/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] transition-[box-shadow,ring-color] duration-300 hover:ring-ink/22 hover:bg-ink/[0.06] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]'
        }
        title={overlayChrome ? undefined : 'Euphoria mandala — click and drag to interact'}
      >
        <div
          id={anchorId}
          className={`pointer-events-none absolute inset-0 overflow-hidden ${overlayChrome ? 'rounded-none' : 'rounded-[inherit]'}`}
          aria-hidden="true"
        />
        {/* Portal: nav uses backdrop-blur, which creates a containing block — fixed canvas would be
            trapped and vertically clipped to the strip. Body attachment = full viewport + system-layer breakout. */}
        {createPortal(
          <canvas
            ref={canvasRef}
            data-mandala-interactive="true"
            className={`fixed inset-0 z-[196] block h-full w-full touch-none ${canvasPointerClass} ${canvasCursorClass}`}
            aria-hidden="true"
          />,
          document.body,
        )}
        {!overlayChrome ? (
          <span className="sr-only">Euphoria mandala, interactive. Activate to use the full canvas.</span>
        ) : null}
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      data-mandala-interactive="true"
      className={`fixed inset-0 block h-full w-full touch-none ${
        !navTinyIdentityHiddenAtRender && (isGrabbedState || isInMandalaZone) ? 'z-[100]' : 'z-[15]'
      } ${canvasPointerClass} ${canvasCursorClass}`}
      aria-hidden="true"
    />
  );
}
