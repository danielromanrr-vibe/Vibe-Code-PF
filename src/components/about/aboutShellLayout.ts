import type { InfluenceDepth } from '../../content/aboutMandalaFacets';

const ANNOTATION_WIDTH = 248;
const REFLECTION_MAX_WIDTH = 460;
const REFLECTION_MIN_WIDTH = 280;

export function shellWidthForDepth(depth: InfluenceDepth, glyphSize: number, viewportWidth: number): number {
  if (depth === 'reflection') {
    return Math.min(REFLECTION_MAX_WIDTH, Math.max(REFLECTION_MIN_WIDTH, viewportWidth - 32));
  }
  if (depth === 'annotation') {
    return Math.min(ANNOTATION_WIDTH, Math.max(ANNOTATION_WIDTH - 24, viewportWidth - 40));
  }
  return glyphSize;
}

export function reflectionMaxHeight(viewportHeight: number): number {
  return Math.min(viewportHeight * 0.68, 440);
}
