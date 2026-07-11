/** Shared editorial reveal — homepage hero + case-study acts. */
export const EDITORIAL_REVEAL_EASE = [0.2, 0.8, 0.2, 1] as const;
export const EDITORIAL_INTRO_EASE = [0.16, 0.84, 0.22, 1] as const;

export const editorialIntroTiming = {
  bundleDurationS: 0.68,
  staggerChildrenS: 0.1,
  itemDurationS: 0.54,
} as const;

export function makeIntroBundle(reducedMotion: boolean) {
  if (reducedMotion) {
    return { hidden: { opacity: 1 }, show: { opacity: 1 } };
  }
  return {
    hidden: { opacity: 0, y: 20, filter: 'blur(3px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: editorialIntroTiming.bundleDurationS,
        ease: EDITORIAL_INTRO_EASE,
        staggerChildren: editorialIntroTiming.staggerChildrenS,
        when: 'beforeChildren' as const,
      },
    },
  };
}

export function makeIntroItem(reducedMotion: boolean) {
  if (reducedMotion) {
    return { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } };
  }
  return {
    hidden: { opacity: 0, y: 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: editorialIntroTiming.itemDurationS,
        ease: EDITORIAL_REVEAL_EASE,
      },
    },
  };
}

export function makeRevealSection(reducedMotion: boolean) {
  if (reducedMotion) {
    return { hidden: { opacity: 1, y: 0, scale: 1 }, show: { opacity: 1, y: 0, scale: 1 } };
  }
  return {
    hidden: { opacity: 0, y: 28, scale: 0.985 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.54,
        ease: EDITORIAL_REVEAL_EASE,
        staggerChildren: 0.1,
        when: 'beforeChildren' as const,
      },
    },
  };
}

export function makeRevealItem(reducedMotion: boolean) {
  if (reducedMotion) {
    return { hidden: { opacity: 1, y: 0, scale: 1 }, show: { opacity: 1, y: 0, scale: 1 } };
  }
  return {
    hidden: { opacity: 0, y: 20, scale: 0.99 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.46,
        ease: EDITORIAL_REVEAL_EASE,
      },
    },
  };
}
