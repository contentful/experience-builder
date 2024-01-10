import React from 'react';
import { useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { Dropzone } from '../Dropzone/Dropzone';
import DraggableContainer from '../Draggable/DraggableComponentList';
import { sendMessage } from '@contentful/experience-builder-core';
import type { CompositionTree } from '@contentful/experience-builder-core/types';
import { OUTGOING_EVENTS } from '@contentful/experience-builder-core/constants';
import dragState from '@/utils/dragState';
import { usePlaceholderStyle } from '@/hooks/usePlaceholderStyle';
import { ROOT_ID } from '@/types/constants';
import { useTreeStore } from '@/store/tree';
import { useDraggedItemStore } from '@/store/draggedItem';
import { useEditorStore } from '@/store/editor';
import { useZoneStore } from '@/store/zone';
import styles from './render.module.css';
import { useBreakpoints } from '@/hooks/useBreakpoints';
import { useEditorSubscriber } from '@/hooks/useEditorSubscriber';
import useCanvasInteractions from '@/hooks/useCanvasInteractions';

interface Props {
  onChange?: (data: CompositionTree) => void;
}

export const RootRenderer: React.FC<Props> = ({ onChange }) => {
  useEditorSubscriber();

  const setSelectedNodeId = useEditorStore((state) => state.setSelectedNodeId);
  const dragItem = useDraggedItemStore((state) => state.componentId);
  const updateItem = useDraggedItemStore((state) => state.updateItem);
  const setHoveringSection = useZoneStore((state) => state.setHoveringSection);
  const userIsDragging = !!dragItem;
  const breakpoints = useTreeStore((state) => state.breakpoints);

  const { resolveDesignValue } = useBreakpoints(breakpoints);
  const tree = useTreeStore((state) => state.tree);

  const { onAddComponent, onMoveComponent } = useCanvasInteractions();
  useEffect(() => {
    if (onChange) onChange(tree);
  }, [tree, onChange]);

  const { onDragStartOrUpdate } = usePlaceholderStyle();

  return (
    <DragDropContext
      onDragUpdate={(update) => {
        console.log("UPDATE", update)
        updateItem(update);
        onDragStartOrUpdate(update);
      }}
      onBeforeDragStart={(start) => {
        onDragStartOrUpdate(start);
        setSelectedNodeId('');
        sendMessage(OUTGOING_EVENTS.ComponentSelected, {
          nodeId: '',
        });
      }}
      onDragEnd={(droppedItem) => {
        updateItem(undefined);
        dragState.reset();

        sendMessage(OUTGOING_EVENTS.MouseUp);

        // User cancel drag
        if (!droppedItem.destination) {
          sendMessage(OUTGOING_EVENTS.ComponentDragCanceled);
          return;
        }

        // New component added to canvas
        if (droppedItem.source.droppableId.startsWith('component-list')) {
          // console.log("ADD COMPONENT ITEM", droppedItem)
          onAddComponent(droppedItem);
        } else {
          // console.log("DROPPED ITEM", droppedItem)
          onMoveComponent(droppedItem);
        }
      }}>
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
    </DragDropContext>
  );
};
