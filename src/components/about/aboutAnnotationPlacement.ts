export type AnnotationPlacement = {
  left: number;
  top: number;
  translate: string;
  transformOrigin: string;
};

export function annotationPlacement(
  nodeX: number,
  nodeY: number,
  centerX: number,
  centerY: number,
  expanded: boolean,
): AnnotationPlacement {
  if (!expanded) {
    return {
      left: nodeX,
      top: nodeY,
      translate: 'translate(-50%, -50%)',
      transformOrigin: 'center center',
    };
  }

  const dx = nodeX - centerX;
  const dy = nodeY - centerY;

  if (Math.abs(dx) >= Math.abs(dy)) {
    if (dx > 0) {
      return {
        left: nodeX,
        top: nodeY,
        translate: 'translate(0, -50%)',
        transformOrigin: 'left center',
      };
    }
    return {
      left: nodeX,
      top: nodeY,
      translate: 'translate(-100%, -50%)',
      transformOrigin: 'right center',
    };
  }

  if (dy > 0) {
    return {
      left: nodeX,
      top: nodeY,
      translate: 'translate(-50%, 0)',
      transformOrigin: 'top center',
    };
  }

  return {
    left: nodeX,
    top: nodeY,
    translate: 'translate(-50%, -100%)',
    transformOrigin: 'bottom center',
  };
}

export function capsuleRadius(
  nodeX: number,
  nodeY: number,
  centerX: number,
  centerY: number,
): string {
  const dx = nodeX - centerX;
  const dy = nodeY - centerY;

  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx > 0 ? '4px 14px 14px 14px' : '14px 4px 14px 14px';
  }
  return dy > 0 ? '14px 14px 14px 4px' : '14px 14px 4px 14px';
}

export function kindBorderRadius(kind: 0 | 1 | 2): string {
  if (kind === 0) return '9999px';
  if (kind === 1) return '10px';
  return '50% / 42%';
}

/** Nudge expanded shells away from viewport edges without changing radial placement logic. */
export function clampExpandedPlacement(
  placement: AnnotationPlacement,
  shellWidth: number,
  shellMaxHeight: number,
  margin = 14,
): AnnotationPlacement {
  if (typeof window === 'undefined') return placement;

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const { left, top, translate } = placement;

  let boxLeft = left;
  let boxTop = top;

  if (translate === 'translate(0, -50%)') {
    boxTop = top - shellMaxHeight / 2;
  } else if (translate === 'translate(-100%, -50%)') {
    boxLeft = left - shellWidth;
    boxTop = top - shellMaxHeight / 2;
  } else if (translate === 'translate(-50%, 0)') {
    boxLeft = left - shellWidth / 2;
  } else if (translate === 'translate(-50%, -100%)') {
    boxLeft = left - shellWidth / 2;
    boxTop = top - shellMaxHeight;
  }

  let shiftX = 0;
  let shiftY = 0;

  if (boxLeft < margin) shiftX = margin - boxLeft;
  if (boxLeft + shellWidth > vw - margin) shiftX = vw - margin - (boxLeft + shellWidth);
  if (boxTop < margin) shiftY = margin - boxTop;
  if (boxTop + shellMaxHeight > vh - margin) shiftY = vh - margin - (boxTop + shellMaxHeight);

  if (shiftX === 0 && shiftY === 0) return placement;

  return {
    ...placement,
    left: left + shiftX,
    top: top + shiftY,
  };
}
