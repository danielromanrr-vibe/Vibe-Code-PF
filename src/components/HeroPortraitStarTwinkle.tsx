/**
 * Studio light catch on the portrait when the star crosses — brief specular glimmer.
 */
export default function HeroPortraitStarTwinkle({ intensity }: { intensity: number }) {
  if (intensity < 0.08) return null;

  const a = Math.min(0.55, intensity * 0.48);
  const sparkle = Math.min(0.38, intensity * intensity * 0.42);

  return (
    <>
      <div
        className="hero-portrait-star-catch pointer-events-none absolute inset-0 z-[4] overflow-hidden rounded-full"
        aria-hidden
        style={{ opacity: a }}
      />
      <div
        className="hero-portrait-star-sparkle pointer-events-none absolute inset-0 z-[5] overflow-hidden rounded-full"
        aria-hidden
        style={{ opacity: sparkle }}
      />
    </>
  );
}
