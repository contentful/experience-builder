import React from 'react';
import { useEffect } from 'react';
import { Dropzone } from '../Dropzone/Dropzone';
import DraggableContainer from '../Draggable/DraggableComponentList';
import type { CompositionTree } from '@contentful/experience-builder-core/types';

import { ROOT_ID } from '@/types/constants';
import { useTreeStore } from '@/store/tree';
import { useDraggedItemStore } from '@/store/draggedItem';
import { useZoneStore } from '@/store/zone';
import styles from './render.module.css';
import { useBreakpoints } from '@/hooks/useBreakpoints';
import { useEditorSubscriber } from '@/hooks/useEditorSubscriber';
import { DNDProvider } from './DNDProvider';

interface Props {
  onChange?: (data: CompositionTree) => void;
}

export const RootRenderer: React.FC<Props> = ({ onChange }) => {
  useEditorSubscriber();

  const dragItem = useDraggedItemStore((state) => state.componentId);
  const setHoveringSection = useZoneStore((state) => state.setHoveringSection);
  const userIsDragging = !!dragItem;
  const breakpoints = useTreeStore((state) => state.breakpoints);

  const { resolveDesignValue } = useBreakpoints(breakpoints);
  const tree = useTreeStore((state) => state.tree);

  useEffect(() => {
    if (onChange) onChange(tree);
  }, [tree, onChange]);

  return (
    <DNDProvider>
      {dragItem && <DraggableContainer id={dragItem} />}

      <div className={styles.container}>
        {/* 
          This hitbox is required so that users can
          add sections to the top of the document.
        */}
        {userIsDragging && (
          <div
            className={styles.hitbox}
            onMouseOver={(e) => {
              e.stopPropagation();
              setHoveringSection(ROOT_ID);
            }}
          />
        )}
        <Dropzone sectionId={ROOT_ID} zoneId={ROOT_ID} resolveDesignValue={resolveDesignValue} />
        {/* 
          This hitbox is required so that users can
          add sections to the bottom of the document.
        */}
        {userIsDragging && (
          <div
            className={styles.hitboxLower}
            onMouseOver={(e) => {
              e.stopPropagation();
              setHoveringSection(ROOT_ID);
            }}
          />
        )}
      </div>
    </DNDProvider>
  );
};
