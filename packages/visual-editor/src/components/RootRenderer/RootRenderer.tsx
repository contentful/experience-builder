import React, { CSSProperties, useCallback, useRef, useState } from 'react';
import { useEffect } from 'react';
import { Dropzone } from '../Dropzone/Dropzone';
import DraggableContainer from '../Draggable/DraggableComponentList';
import type { CompositionTree } from '@contentful/experience-builder-core/types';

import { COMPONENT_LIST_ID, DRAGGABLE_HEIGHT, ROOT_ID } from '@/types/constants';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolveDesignValue } = useBreakpoints(breakpoints);
  const [containerStyles, setContainerStyles] = useState<CSSProperties>({});
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

  const handleResizeCanvas = useCallback(() => {
    const parentElement = containerRef.current?.parentElement;
    if (!parentElement) {
      return;
    }

    let siblingHeight = 0;

    for (const child of parentElement.children) {
      if (!child.hasAttribute('data-ctfl-root')) {
        siblingHeight += child.getBoundingClientRect().height;
      }
    }

    if (!siblingHeight) {
      /**
       * DRAGGABLE_HEIGHT is subtracted here due to an uninteded scrolling effect
       * when dragging a new component onto the canvas
       *
       * The DRAGGABLE_HEIGHT is then added as margin bottom to offset this value
       * so that visually there is no difference to the user.
       */
      setContainerStyles({
        minHeight: `${window.innerHeight - DRAGGABLE_HEIGHT}px`,
      });
      return;
    }

    setContainerStyles({
      minHeight: `${window.innerHeight - siblingHeight}px`,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef.current]);

  useEffect(() => {
    handleResizeCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef.current]);

  return (
    <DNDProvider>
      {dragItem && <DraggableContainer id={dragItem} />}

      <div data-ctfl-root className={styles.container} ref={containerRef} style={containerStyles}>
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
      <div data-ctfl-hitboxes />
    </DNDProvider>
  );
};
