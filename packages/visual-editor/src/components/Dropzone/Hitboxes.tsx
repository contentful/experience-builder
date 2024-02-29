import React, { CSSProperties, useCallback, useEffect, useMemo, useState } from 'react';
import styles from './styles.module.css';
import { useTreeStore } from '@/store/tree';
import { getItemDepthFromTree } from '@/utils/getItem';
import { CTFL_ZONE_ID, DRAGGABLE_WIDTH, ROOT_ID } from '@/types/constants';
import { useZoneStore } from '@/store/zone';
import { useDraggedItemStore } from '@/store/draggedItem';
import { createPortal } from 'react-dom';

interface Props {
  parentZoneId: string;
  zoneId: string;
  enableRootHitboxes: boolean;
}

const INITIAL_OFFSET = 10;
const OFFSET_INCREMENT = 8;
const HITBOX_HEIGHT = 20;
const HITBOX_WIDTH = 80;
const MIN_HEIGHT = 45;
const MIN_DEPTH = 20;
enum HitboxDirection {
  TOP,
  LEFT,
  RIGHT,
  BOTTOM,
  SELF_VERTICAL,
  SELF_HORIZONTAL,
}

const calcOffsetDepth = (depth: number) => {
  return INITIAL_OFFSET - OFFSET_INCREMENT * depth;
};

const Hitboxes: React.FC<Props> = ({ zoneId, parentZoneId, enableRootHitboxes }) => {
  const tree = useTreeStore((state) => state.tree);
  const isDraggingOnCanvas = useDraggedItemStore((state) => state.isDraggingOnCanvas);
  const zoneDepth = useMemo(
    () => getItemDepthFromTree({ id: parentZoneId }, tree),
    [tree, parentZoneId],
  );
  const [fetchDomRect, setFetchDomRect] = useState(Date.now());

  useEffect(() => {
    /**
     * A bit hacky but we need to wait a very small amount
     * of time to fetch the dom getBoundingClientRect once a
     * drag starts because we need pre-drag styles like padding
     * applied before we calculate positions of hitboxes
     */
    setTimeout(() => {
      setFetchDomRect(Date.now());
    }, 50);
  }, [isDraggingOnCanvas]);

  const hitboxContainer = useMemo(() => {
    return document.querySelector('[data-ctfl-hitboxes]');
  }, []);

  const domRect = useMemo(() => {
    return document.querySelector(`[${CTFL_ZONE_ID}="${zoneId}"]`)?.getBoundingClientRect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoneId, fetchDomRect]);

  const zones = useZoneStore((state) => state.zones);

  const direction = zones[parentZoneId]?.direction || 'vertical';
  const isVertical = direction === 'vertical';

  const isRoot = parentZoneId === ROOT_ID;

  const getStyles = useCallback(
    (direction: HitboxDirection): CSSProperties => {
      if (!domRect) {
        return {
          display: 'none',
        };
      }

      const { width, height, top, left, bottom, right } = domRect;

      const isDeepZone = zoneDepth > 5;
      switch (direction) {
        case HitboxDirection.TOP:
          return {
            width,
            height: HITBOX_HEIGHT,
            top: top - calcOffsetDepth(zoneDepth),
            left,
            zIndex: 100 + zoneDepth,
          };
        case HitboxDirection.BOTTOM:
          return {
            width,
            height: HITBOX_HEIGHT,
            top: bottom + calcOffsetDepth(zoneDepth),
            left,
            zIndex: 100 + zoneDepth,
          };
        case HitboxDirection.LEFT:
          return {
            width: HITBOX_WIDTH,
            height: height - HITBOX_HEIGHT,
            left: left - calcOffsetDepth(zoneDepth) - HITBOX_WIDTH / 2,
            top: top + HITBOX_HEIGHT / 2,
            zIndex: 100 + zoneDepth,
          };
        case HitboxDirection.RIGHT:
          return {
            width: HITBOX_WIDTH,
            height: height - HITBOX_HEIGHT,
            left: right - calcOffsetDepth(zoneDepth) - HITBOX_WIDTH / 2,
            top: top + HITBOX_HEIGHT / 2,
            zIndex: 100 + zoneDepth,
          };
        case HitboxDirection.SELF_VERTICAL: {
          if (height > 60 && !isDeepZone) {
            return { display: 'none' };
          }

          const selfHeight = isDeepZone ? MIN_DEPTH : MIN_HEIGHT;
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
    },
    [zoneDepth, domRect],
  );

  const ActiveHitboxes = (
    <>
      {isVertical ? (
        <div
          data-ctfl-zone-id={zoneId}
          className={styles.hitbox}
          style={getStyles(HitboxDirection.SELF_VERTICAL)}
        />
      ) : (
        <div
          data-ctfl-zone-id={zoneId}
          className={styles.hitbox}
          style={getStyles(HitboxDirection.SELF_HORIZONTAL)}
        />
      )}
      {isRoot && enableRootHitboxes ? (
        <div
          data-ctfl-zone-id={parentZoneId}
          className={styles.hitbox}
          style={getStyles(HitboxDirection.BOTTOM)}
        />
      ) : isVertical ? (
        <>
          <div
            data-ctfl-zone-id={parentZoneId}
            className={styles.hitbox}
            style={getStyles(HitboxDirection.TOP)}
          />
          <div
            data-ctfl-zone-id={parentZoneId}
            className={styles.hitbox}
            style={getStyles(HitboxDirection.BOTTOM)}
          />
        </>
      ) : (
        <>
          <div
            data-ctfl-zone-id={parentZoneId}
            className={styles.hitbox}
            style={getStyles(HitboxDirection.LEFT)}
          />
          <div
            data-ctfl-zone-id={parentZoneId}
            className={styles.hitbox}
            style={getStyles(HitboxDirection.RIGHT)}
          />
        </>
      )}
    </>
  );

  if (!hitboxContainer) {
    return null;
  }
  return createPortal(ActiveHitboxes, hitboxContainer);
};

export default Hitboxes;
