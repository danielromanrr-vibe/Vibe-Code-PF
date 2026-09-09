import { useEffect, type RefObject } from 'react';

const FINE_POINTER = '(hover: hover) and (pointer: fine)';
const REDUCE_MOTION = '(prefers-reduced-motion: reduce)';

/** Same D-wink as the CSS fallback; pointer adds a little weather around it. */
const WINK_BASE = -5.5;
const WINK_FOLLOW = 1.15;
const WINK_MIN = -8.5;
const WINK_MAX = -2.5;

/** Wide needle — rest is east; never a full spin through the word. */
const ARROW_MAX_DEG = 110;
const ARROW_FOLLOW = 0.48;
const ARROW_DEAD_ZONE = 18;
const ARROW_REACH = 1.25;
const ARROW_SELECTOR = '.home-case-study-cta__arrow, .about-story-section__cta-arrow';
const WORD_SELECTOR = '.text-link-word';

const WORD_MAX_X = 2.25;
const WORD_MAX_Y = 2.75;
const WORD_MAX_R = 2.75;
const WORD_FOLLOW = 0.38;

const LERP = 0.12;
const SNAP = 0.12;

type WordMotion = {
  el: HTMLElement;
  targetX: number;
  targetY: number;
  targetR: number;
  curX: number;
  curY: number;
  curR: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function lerp(current: number, target: number, amount: number) {
  const next = current + (target - current) * amount;
  return Math.abs(target - next) < SNAP ? target : next;
}

function settled(current: number, target: number) {
  return Math.abs(target - current) < SNAP;
}

function clearWordFollow(word: WordMotion) {
  word.el.style.removeProperty('--text-link-word-x');
  word.el.style.removeProperty('--text-link-word-y');
  word.el.style.removeProperty('--text-link-word-r');
}

/**
 * Live wink + arrow needle on text CTAs.
 * The label keeps the D tilt; each word and the arrow ease toward the pointer.
 */
export function useTextLinkArrowFollow(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fineMq = window.matchMedia(FINE_POINTER);
    const motionMq = window.matchMedia(REDUCE_MOTION);
    let detach: (() => void) | undefined;

    const clearFollow = () => {
      el.style.removeProperty('--text-link-wink');
      el.style.removeProperty('--text-link-arrow-follow');
      el.style.removeProperty('--text-link-arrow-follow-x');
      el.style.removeProperty('--text-link-arrow-follow-y');
    };

    const bind = () => {
      detach?.();
      detach = undefined;
      clearFollow();
      el.classList.remove('has-text-link-follow');
      if (!fineMq.matches || motionMq.matches) return;

      el.classList.add('has-text-link-follow');

      const words: WordMotion[] = Array.from(el.querySelectorAll(WORD_SELECTOR))
        .filter((node): node is HTMLElement => node instanceof HTMLElement)
        .map((wordEl) => ({
          el: wordEl,
          targetX: 0,
          targetY: 0,
          targetR: 0,
          curX: 0,
          curY: 0,
          curR: 0,
        }));

      let raf = 0;
      let hovering = false;
      let targetWink = 0;
      let targetDeg = 0;
      let targetX = 0;
      let targetY = 0;
      let curWink = 0;
      let curDeg = 0;
      let curX = 0;
      let curY = 0;

      const applyWords = () => {
        for (const word of words) {
          word.el.style.setProperty('--text-link-word-x', `${word.curX}px`);
          word.el.style.setProperty('--text-link-word-y', `${word.curY}px`);
          word.el.style.setProperty('--text-link-word-r', `${word.curR}deg`);
        }
      };

      const apply = () => {
        el.style.setProperty('--text-link-wink', `${curWink}deg`);
        el.style.setProperty('--text-link-arrow-follow', `${curDeg}deg`);
        el.style.setProperty('--text-link-arrow-follow-x', `${curX}px`);
        el.style.setProperty('--text-link-arrow-follow-y', `${curY}px`);
        applyWords();
      };

      const tick = () => {
        curWink = lerp(curWink, targetWink, LERP);
        curDeg = lerp(curDeg, targetDeg, LERP);
        curX = lerp(curX, targetX, LERP);
        curY = lerp(curY, targetY, LERP);

        for (const word of words) {
          word.curX = lerp(word.curX, word.targetX, LERP);
          word.curY = lerp(word.curY, word.targetY, LERP);
          word.curR = lerp(word.curR, word.targetR, LERP);
        }

        apply();

        const wordsDone = words.every(
          (word) =>
            settled(word.curX, word.targetX) &&
            settled(word.curY, word.targetY) &&
            settled(word.curR, word.targetR),
        );

        const done =
          settled(curWink, targetWink) &&
          settled(curDeg, targetDeg) &&
          settled(curX, targetX) &&
          settled(curY, targetY) &&
          wordsDone;

        if (!done) {
          raf = window.requestAnimationFrame(tick);
          return;
        }

        raf = 0;
        if (!hovering) {
          clearFollow();
          for (const word of words) clearWordFollow(word);
        }
      };

      const kick = () => {
        if (!raf) raf = window.requestAnimationFrame(tick);
      };

      const onMove = (event: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        if (rect.width < 4 || rect.height < 4) return;
        hovering = true;
        const nx = clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1);
        const ny = clamp(((event.clientY - rect.top) / rect.height) * 2 - 1, -1, 1);
        targetWink = clamp(WINK_BASE + nx * WINK_FOLLOW + ny * 0.4, WINK_MIN, WINK_MAX);

        const center = (words.length - 1) / 2;
        words.forEach((word, index) => {
          const wordRect = word.el.getBoundingClientRect();
          if (wordRect.width < 2 || wordRect.height < 2) return;

          const wx = clamp(((event.clientX - wordRect.left) / wordRect.width) * 2 - 1, -1, 1);
          const wy = clamp(((event.clientY - wordRect.top) / wordRect.height) * 2 - 1, -1, 1);
          const phase = (index - center) * 0.18;
          const amp = 0.82 + index * 0.08;

          word.targetX = clamp((wx * 0.55 + nx * 0.45 + phase) * WORD_MAX_X * amp * WORD_FOLLOW, -3, 3);
          word.targetY = clamp((wy * 0.65 + ny * 0.35 - phase * 0.35) * WORD_MAX_Y * amp * WORD_FOLLOW, -3.5, 3.5);
          word.targetR = clamp((wx * 0.4 + phase * 0.55) * WORD_MAX_R * WORD_FOLLOW, -4, 4);
        });

        const arrowEl = el.querySelector(ARROW_SELECTOR);
        if (arrowEl instanceof HTMLElement) {
          const arrowRect = arrowEl.getBoundingClientRect();
          const dx = event.clientX - (arrowRect.left + arrowRect.width / 2);
          const dy = event.clientY - (arrowRect.top + arrowRect.height / 2);
          const dist = Math.hypot(dx, dy);
          if (dist >= ARROW_DEAD_ZONE) {
            const heading = ((Math.atan2(dy, dx) * 180) / Math.PI - targetWink) * ARROW_FOLLOW;
            targetDeg = clamp(heading, -ARROW_MAX_DEG, ARROW_MAX_DEG);
            const reach = ARROW_REACH * Math.min(1, dist / 96);
            const rad = (targetDeg * Math.PI) / 180;
            targetX = Math.cos(rad) * reach;
            targetY = Math.sin(rad) * reach;
          }
        }

        kick();
      };

      const onLeave = () => {
        hovering = false;
        targetWink = 0;
        targetDeg = 0;
        targetX = 0;
        targetY = 0;
        for (const word of words) {
          word.targetX = 0;
          word.targetY = 0;
          word.targetR = 0;
        }
        kick();
      };

      el.addEventListener('pointerenter', onMove, { passive: true });
      el.addEventListener('pointermove', onMove, { passive: true });
      el.addEventListener('pointerleave', onLeave);
      el.addEventListener('pointercancel', onLeave);

      detach = () => {
        el.removeEventListener('pointerenter', onMove);
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerleave', onLeave);
        el.removeEventListener('pointercancel', onLeave);
        if (raf) window.cancelAnimationFrame(raf);
        el.classList.remove('has-text-link-follow');
        clearFollow();
        for (const word of words) clearWordFollow(word);
      };
    };

    bind();
    fineMq.addEventListener('change', bind);
    motionMq.addEventListener('change', bind);
    return () => {
      fineMq.removeEventListener('change', bind);
      motionMq.removeEventListener('change', bind);
      detach?.();
    };
  }, [ref]);
}
