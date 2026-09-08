import { useEffect, useState } from 'react';

/** True when the viewport is at or below `px`. Desktop-first: starts false. */
export function useMaxWidth(px: number): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${px}px)`);
    const sync = () => setMatches(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, [px]);

  return matches;
}
