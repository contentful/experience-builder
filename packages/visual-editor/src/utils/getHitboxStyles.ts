import { DRAGGABLE_HEIGHT, DRAGGABLE_WIDTH, HITBOX, HitboxDirection } from '@/types/constants';
import { CSSProperties } from '@contentful/experiences-core/types';

const { WIDTH, HEIGHT, INITIAL_OFFSET, OFFSET_INCREMENT, MIN_HEIGHT, MIN_DEPTH_HEIGHT, DEEP_ZONE } =
  HITBOX;

interface Params {
  direction: HitboxDirection;
  domRect?: DOMRect;
  zoneDepth: number;
}

const calcOffsetDepth = (depth: number) => {
  return INITIAL_OFFSET - OFFSET_INCREMENT * depth;
};

export const getHitboxStyles = ({ direction, zoneDepth, domRect }: Params): CSSProperties => {
  if (!domRect) {
    return {
      display: 'none',
    };
  }

  const { width, height, top, left, bottom, right } = domRect;

  const MAX_SELF_HEIGHT = DRAGGABLE_HEIGHT * 2;

  const isDeepZone = zoneDepth > DEEP_ZONE;
  const isAboveMaxHeight = height > MAX_SELF_HEIGHT;

  switch (direction) {
    case HitboxDirection.TOP:
      return {
        width,
        height: HEIGHT,
        top: top - calcOffsetDepth(zoneDepth),
        left,
        zIndex: 100 + zoneDepth,
      };
    case HitboxDirection.BOTTOM:
      return {
        width,
        height: HEIGHT,
        top: bottom + calcOffsetDepth(zoneDepth),
        left,
        zIndex: 100 + zoneDepth,
      };
    case HitboxDirection.LEFT:
      return {
        width: WIDTH,
        height: height - HEIGHT,
        left: left - calcOffsetDepth(zoneDepth) - WIDTH / 2,
        top: top + HEIGHT / 2,
        zIndex: 100 + zoneDepth,
      };
    case HitboxDirection.RIGHT:
      return {
        width: WIDTH,
        height: height - HEIGHT,
        left: right - calcOffsetDepth(zoneDepth) - WIDTH / 2,
        top: top + HEIGHT / 2,
        zIndex: 100 + zoneDepth,
      };
    case HitboxDirection.SELF_VERTICAL: {
      if (isAboveMaxHeight && !isDeepZone) {
        return { display: 'none' };
      }

      const selfHeight = isDeepZone ? MIN_DEPTH_HEIGHT : MIN_HEIGHT;
      return {
        width,
        height: selfHeight,
        left,
        top: top + height / 2 - selfHeight / 2,
        zIndex: 1000 + zoneDepth,
      };
    }
    case HitboxDirection.SELF_HORIZONTAL: {
      if (width > DRAGGABLE_WIDTH) {
        return { display: 'none' };
      }
      return {
        width: width - DRAGGABLE_WIDTH * 2,
        height,
        left: left + (DRAGGABLE_WIDTH * 2) / 2,
        top,
        zIndex: 1000 + zoneDepth,
      };
    }
    default:
      return {};
  }
};
