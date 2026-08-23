const HOME_HERO_INTRO_STORAGE_KEY = 'pf-home-hero-intro-complete';

function readFlag(storage: Storage): boolean {
  try {
    return storage.getItem(HOME_HERO_INTRO_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

function writeFlag(storage: Storage): void {
  try {
    storage.setItem(HOME_HERO_INTRO_STORAGE_KEY, '1');
  } catch {
    /* ignore quota / private mode */
  }
}

function clearFlag(storage: Storage): void {
  try {
    storage.removeItem(HOME_HERO_INTRO_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/** Intro finished for this browser tab session (not every Home click). */
export function isHomeHeroIntroComplete(): boolean {
  if (typeof window === 'undefined') return false;
  /* Drop legacy permanent flag so dev/preview isn’t stuck after one run */
  try {
    window.localStorage.removeItem(HOME_HERO_INTRO_STORAGE_KEY);
  } catch {
    /* ignore */
  }
  return readFlag(window.sessionStorage);
}

export function markHomeHeroIntroComplete(): void {
  if (typeof window === 'undefined') return;
  writeFlag(window.sessionStorage);
}

export function clearHomeHeroIntroComplete(): void {
  if (typeof window === 'undefined') return;
  clearFlag(window.sessionStorage);
}

/** Dev / QA: `/?replayHeroIntro=1` clears the flag and replays the sequence. */
export function peekHomeHeroIntroReplayRequest(): boolean {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).has('replayHeroIntro');
}

/** Dev / QA: `/?replayHeroIntro=1` clears the flag and replays the sequence. */
export function consumeHomeHeroIntroReplayRequest(): boolean {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  if (!params.has('replayHeroIntro')) return false;
  clearHomeHeroIntroComplete();
  params.delete('replayHeroIntro');
  const next = params.toString();
  const path = `${window.location.pathname}${next ? `?${next}` : ''}${window.location.hash}`;
  window.history.replaceState(null, '', path);
  return true;
}
