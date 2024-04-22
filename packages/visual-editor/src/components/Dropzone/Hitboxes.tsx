import React, { useCallback, useMemo } from 'react';
import styles from './styles.module.css';
import { useTreeStore } from '@/store/tree';
import { getItemDepthFromNode } from '@/utils/getItem';
import { CTFL_DRAGGING_ELEMENT, CTFL_ZONE_ID, HitboxDirection, ROOT_ID } from '@/types/constants';
import { useZoneStore } from '@/store/zone';
import { useDraggedItemStore } from '@/store/draggedItem';
import { createPortal } from 'react-dom';
import { getHitboxStyles } from '@/utils/getHitboxStyles';

interface Props {
  parentZoneId: string;
  zoneId: string;
  isEmptyZone: boolean;
}

const Hitboxes: React.FC<Props> = ({ zoneId, parentZoneId, isEmptyZone }) => {
  const tree = useTreeStore((state) => state.tree);
  const isDraggingOnCanvas = useDraggedItemStore((state) => state.isDraggingOnCanvas);
  const scrollY = useDraggedItemStore((state) => state.scrollY);
  const zoneDepth = useMemo(
    () => getItemDepthFromNode({ id: parentZoneId }, tree.root),
    [tree, parentZoneId],
  );
  const zones = useZoneStore((state) => state.zones);
  const hoveringZone = useZoneStore((state) => state.hoveringZone);
  const isHoveringZone = hoveringZone === zoneId;

  const hitboxContainer = useMemo(() => {
    return document.querySelector('[data-ctfl-hitboxes]');
  }, []);

  const domRect = useMemo(() => {
    if (!isDraggingOnCanvas) return;
    return document.querySelector(`[${CTFL_ZONE_ID}="${zoneId}"]`)?.getBoundingClientRect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoneId, isDraggingOnCanvas]);

  // Use the size of the cloned dragging element to offset the position of the hitboxes
  // So that when dragging causes a dropzone to expand, the hitboxes will be in the correct position
  const offsetRect = useMemo(() => {
    if (!isDraggingOnCanvas || isEmptyZone || !isHoveringZone) return;
    return document.querySelector(`[${CTFL_DRAGGING_ELEMENT}]`)?.getBoundingClientRect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEmptyZone, isHoveringZone, isDraggingOnCanvas]);

  const zoneDirection = zones[parentZoneId]?.direction || 'vertical';
  const isVertical = zoneDirection === 'vertical';
  const isRoot = parentZoneId === ROOT_ID;

  const getStyles = useCallback(
    (direction: HitboxDirection) =>
      getHitboxStyles({
        direction,
        zoneDepth,
        domRect,
        scrollY,
        offsetRect,
      }),
    [zoneDepth, domRect, scrollY, offsetRect],
  );

  const ActiveHitboxes = (
    <>
      <div
        data-ctfl-zone-id={zoneId}
        className={styles.hitbox}
        style={getStyles(
          isVertical ? HitboxDirection.SELF_VERTICAL : HitboxDirection.SELF_HORIZONTAL,
        )}
      />
      {isRoot ? (
        <div
          data-ctfl-zone-id={parentZoneId}
          className={styles.hitbox}
          style={getStyles(HitboxDirection.BOTTOM)}
        />
      ) : (
        <>
          <div
            data-ctfl-zone-id={parentZoneId}
            className={styles.hitbox}
            style={getStyles(isVertical ? HitboxDirection.TOP : HitboxDirection.LEFT)}
          />
          <div
            data-ctfl-zone-id={parentZoneId}
            className={styles.hitbox}
            style={getStyles(isVertical ? HitboxDirection.BOTTOM : HitboxDirection.RIGHT)}
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
