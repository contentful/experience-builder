import React from 'react';
import { useEffect } from 'react';
import { Dropzone } from '../Dropzone/Dropzone';
import DraggableContainer from '../Draggable/DraggableComponentList';
import type { CompositionTree } from '@contentful/experience-builder-core/types';

import { COMPONENT_LIST_ID, ROOT_ID } from '@/types/constants';
import { useTreeStore } from '@/store/tree';
import { useDraggedItemStore } from '@/store/draggedItem';
import styles from './render.module.css';
import { useBreakpoints } from '@/hooks/useBreakpoints';
import { useEditorSubscriber } from '@/hooks/useEditorSubscriber';
import { DNDProvider } from './DNDProvider';
import { sendMessage } from '@contentful/experience-builder-core';
import { OUTGOING_EVENTS } from '@contentful/experience-builder-core/constants';

interface Props {
  onChange?: (data: CompositionTree) => void;
}

export const RootRenderer: React.FC<Props> = ({ onChange }) => {
  useEditorSubscriber();

  const dragItem = useDraggedItemStore((state) => state.componentId);
  const userIsDragging = useDraggedItemStore((state) => state.isDraggingOnCanvas);
  const breakpoints = useTreeStore((state) => state.breakpoints);
  const draggableSourceId = useDraggedItemStore((state) => state.draggedItem?.source.droppableId);
  const draggingNewComponent = !!draggableSourceId?.startsWith(COMPONENT_LIST_ID);

  const { resolveDesignValue } = useBreakpoints(breakpoints);
  const tree = useTreeStore((state) => state.tree);

  useEffect(() => {
    if (onChange) onChange(tree);
  }, [tree, onChange]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleClickOutside = () => {
    sendMessage(OUTGOING_EVENTS.OutsideCanvasClick, {
      outsideCanvasClick: true,
    });
  };

  return (
    <DNDProvider>
      {dragItem && <DraggableContainer id={dragItem} />}

      <div className={styles.container}>
        {/* 
          This hitbox is required so that users can
          add sections to the top of the document.
        */}
        {userIsDragging && draggingNewComponent && (
          <div className={styles.hitbox} data-ctfl-zone-id={ROOT_ID} />
        )}
        <Dropzone zoneId={ROOT_ID} resolveDesignValue={resolveDesignValue} />
        {/* 
          This hitbox is required so that users can
          add sections to the bottom of the document.
        */}
        {userIsDragging && draggingNewComponent && (
          <div data-ctfl-zone-id={ROOT_ID} className={styles.hitboxLower} />
        )}
      </div>
    </DNDProvider>
  );
};
