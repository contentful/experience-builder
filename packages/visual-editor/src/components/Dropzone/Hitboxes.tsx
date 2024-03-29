import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './styles.module.css';
import { useTreeStore } from '@/store/tree';
import { getItemDepthFromNode } from '@/utils/getItem';
import { CTFL_ZONE_ID, HitboxDirection, ROOT_ID } from '@/types/constants';
import { useZoneStore } from '@/store/zone';
import { useDraggedItemStore } from '@/store/draggedItem';
import { createPortal } from 'react-dom';
import { getHitboxStyles } from '@/utils/getHitboxStyles';

interface Props {
  parentZoneId: string;
  zoneId: string;
  enableRootHitboxes: boolean;
}

const Hitboxes: React.FC<Props> = ({ zoneId, parentZoneId, enableRootHitboxes }) => {
  const tree = useTreeStore((state) => state.tree);
  const isDraggingOnCanvas = useDraggedItemStore((state) => state.isDraggingOnCanvas);
  const scrollY = useDraggedItemStore((state) => state.scrollY);
  const zoneDepth = useMemo(
    () => getItemDepthFromNode({ id: parentZoneId }, tree.root),
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

  const zoneDirection = zones[parentZoneId]?.direction || 'vertical';
  const isVertical = zoneDirection === 'vertical';
  const isRoot = parentZoneId === ROOT_ID;
  const showRootHitboxes = isRoot && enableRootHitboxes;

  const getStyles = useCallback(
    (direction: HitboxDirection) => getHitboxStyles({ direction, zoneDepth, domRect, scrollY }),
    [zoneDepth, domRect, scrollY],
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
      {showRootHitboxes && (
        <div
          data-ctfl-zone-id={parentZoneId}
          className={styles.hitbox}
          style={getStyles(HitboxDirection.BOTTOM)}
        />
      )}
      {!isRoot && (
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
