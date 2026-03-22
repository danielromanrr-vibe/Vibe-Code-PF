# Euphoria Mandala + Mandala Banner (React)

This bundle contains the two canvas components from the portfolio:

| File | Role |
|------|------|
| `components/Mandala.tsx` | **Euphoria Mandala** — full-viewport, anchored to `#mandala-home`, grab/drop/hover interaction. |
| `components/MandalaBanner.tsx` | **Mandala Banner** — 16:9 editorial strip; node clusters, paths, mouse repulsion, grain. |
| `docs/EUPHORIA_MANDALA_SPEC.md` | Behavior spec for the Euphoria Mandala. |

## Requirements

- **React** 18+
- **TypeScript** (or rename `.tsx` → `.jsx` and remove types)
- **Tailwind CSS** recommended — components use utility classes (`fixed`, `z-[10]`, `aspect-[16/9]`, etc.). If you don’t use Tailwind, replace `className` with equivalent CSS.

No other npm packages are required for these files (no `motion`, no `lucide`).

## Quick integration

**Euphoria Mandala** — place an anchor where the mandala should “live” (e.g. behind hero text), then render `<Mandala />` once (full-screen canvas):

```tsx
<div id="mandala-home" className="absolute inset-0 -z-10" aria-hidden />
<Mandala />
```

**Mandala Banner** — drop anywhere you want the wide strip:

```tsx
<MandalaBanner />
```

## Cursor hook (optional)

`Mandala` sets `document.body.dataset.mandalaGrabbed = 'true'` while grabbed. Your `CustomCursor` (if any) can read that to swap icons.

## License

Same as your project; code extracted from your portfolio build.
