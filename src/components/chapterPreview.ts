import { createContext, useContext } from 'react';
import type { MotionValue } from 'motion/react';

/**
 * Signed share (−1…1) of the way the active chapter underline leans toward its neighbour
 * while the reader pulls past a chapter's first or last page. Null outside a process deck.
 */
export const ChapterPreviewContext = createContext<MotionValue<number> | null>(null);

export function useChapterPreview(): MotionValue<number> | null {
  return useContext(ChapterPreviewContext);
}
