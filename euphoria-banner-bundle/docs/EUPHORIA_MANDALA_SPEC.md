# Euphoria Mandala: Technical Specification & Behavioral Logic

The **Euphoria Mandala** is a generative, interactive UI entity designed as a "living" brand asset. It exhibits complex spatial behaviors, state-aware positioning, and physics-based interpolation.

---

## 1. Visual Architecture
- **Rendering Engine:** HTML5 Canvas (2D Context).
- **Geometry:** A series of concentric, oscillating ellipses (default: 30 layers).
- **Color Logic:** HSB to RGB conversion. Hue oscillates between 45 and 60 (Gold/Amber spectrum).
- **Dynamics:** 
    - **Oscillation:** `Math.sin(frameCount + layerIndex)` drives width and height.
    - **Rotation:** Each layer is rotated based on a `rotationFactor` that increases during interaction.
    - **Alpha Mapping:** Layers fade out as they reach the outer edges of the hue spectrum.

---

## 2. Interaction Model
- **Hover Detection:** Calculated via Euclidean distance between the cursor and the interpolated center.
- **Grab Toggle:** A single click/tap within the mandala's radius toggles the `isGrabbed` state.
- **Growth/Excitement:** When `isGrabbed` AND `isPressed` (mouse held down), the mandala grows in size and its rotation speed increases. When released, it smoothly shrinks back to its base size.
- **Cursor Affordance:** 
    - Default: Standard cursor.
    - Hover: `hand`.
    - Grabbed: `grabbing`.

---

## 3. Spatial States & Positioning

### A. The "Home" State (Default)
- **Anchor:** Mathematically tethered to a DOM element ID (`#mandala-home`) located behind the primary headline.
- **Layering:** Positioned at `z-index: 10` (behind text at `z-index: 20`).
- **Pointer Events:** The parent container uses `pointer-events-none` while the canvas uses `pointer-events-auto` (conditionally) to allow interaction through the text.
- **Scroll Behavior:** **Fixed to Layout.** It tracks the anchor's `getBoundingClientRect()` every frame, moving perfectly with the page scroll.

### B. The "Wild" State (Exile)
- **Trigger:** Dropped outside the "Magnetic Home" radius.
- **Coordinate System:** Stored as **Page-Relative** coordinates (`mouse.y + window.scrollY`).
- **Scroll Behavior:** **Fixed to Content.** It maintains its specific position on the "paper" of the website, scrolling away as the user moves down the page.

---

## 4. Advanced Behavioral Properties

### I. Magnetic Home (Snap-to-Origin)
- **Logic:** When the mandala is dropped, a distance check is performed against the "Home" anchor.
- **Radius:** `(AnchorWidth / 2) + 80px margin`.
- **Behavior:** If dropped within this radius, the `placedPos` is cleared (`null`), causing the mandala to smoothly snap back to its centered position behind the text.

### II. Elastic Tether (Viewport Recovery)
- **Logic:** The system monitors the mandala's screen-space coordinates every frame.
- **Threshold:** Viewport boundaries +/- `200px` buffer.
- **Behavior:** If the mandala leaves the user's view (due to scrolling away or window resizing), it automatically resets to the "Home" state.
- **Animation:** The reset is not a teleport; it uses `lerp` (Linear Interpolation) to glide the mandala from its off-screen position back to the home anchor.

### III. Physics & Smoothing
- **Interpolation:** All movement uses `lerp` with varying factors (faster when grabbed, slower when snapping).
- **State Factors:** `grabFactor` and `hoverFactor` are interpolated values (0 to 1) used to smoothly transition color saturation and oscillation speeds.

---

## 5. Implementation Notes for AI
- **State Management:** Use `useRef` for high-frequency updates (mouse, center, frameCount) to avoid React render cycles. Use `useState` only for UI-syncing flags (hover/grabbed states).
- **The Render Loop:** The `requestAnimationFrame` loop must handle the visibility check, the scroll-adjustment math, and the anchor-tracking simultaneously.
- **Coordinate Transformation:** Always distinguish between **Viewport Space** (clientX/Y) and **Document Space** (PageX/Y) when switching between "Home" and "Wild" states.
