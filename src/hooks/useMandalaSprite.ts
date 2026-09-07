import { useEffect, useState } from 'react';
import {
  cycleMandalaSprite,
  getMandalaSpriteId,
  MANDALA_SPRITE_NAMES,
  subscribeMandalaSprite,
  type MandalaSpriteId,
} from '../lib/mandalaSprite';

export function useMandalaSprite() {
  const [spriteId, setSpriteId] = useState<MandalaSpriteId>(() => getMandalaSpriteId());

  useEffect(() => subscribeMandalaSprite(setSpriteId), []);

  return {
    spriteId,
    spriteName: MANDALA_SPRITE_NAMES[spriteId],
    cycle: cycleMandalaSprite,
  };
}
