/**
 * Cartoon badge gleam over the hero portrait when the shooting star crosses.
 */
export default function HeroPortraitStarTwinkle({ intensity }: { intensity: number }) {
  if (intensity < 0.03) return null;

  const a = Math.min(1, intensity);

  return (
    <div
      className="hero-portrait-star-twinkle pointer-events-none absolute inset-0 z-[4] overflow-hidden rounded-full"
      aria-hidden
      style={{ opacity: a }}
    >
      <span className="hero-portrait-gleam hero-portrait-gleam--a" />
      <span className="hero-portrait-gleam hero-portrait-gleam--b" />
      <span className="hero-portrait-gleam hero-portrait-gleam--c" />
      <span className="hero-portrait-star-burst" />
    </div>
  );
}
