import React from 'react';
import { useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { DropZone } from '../DropZone/Dropzone';
import DraggableContainer from '../Draggable/DraggableComponentList';
import { CompositionTree, OUTGOING_EVENTS } from '@contentful/experience-builder-core';
import { sendMessage } from '@/communication/sendMessage';
import { ResolveDesignValueType } from '@/hooks/useBreakpoints';
import dragState from '@/shared/utils/dragState';
import { onDrop } from '@/shared/utils/onDrop';
import { usePlaceholderStyle } from '@/hooks/usePlaceholderStyle';
import { ROOT_ID } from '@/shared/utils/constants';
import { useTreeStore } from '@/store/tree';
import { useDraggedItemStore } from '@/store/draggedItem';
import { useEditorStore } from '@/store/editor';
import { useZoneStore } from '@/store/zone';
import styles from './render.module.css';
import { onComponentMoved } from '@/communication/onComponentMoved';

interface Props {
  resolveDesignValue: ResolveDesignValueType;
  areEntitiesFetched: boolean;
  onChange?: (data: CompositionTree) => void;
}

export const RootRenderer: React.FC<Props> = ({
  onChange,
  resolveDesignValue,
  areEntitiesFetched,
}) => {
  const setSelectedNodeId = useEditorStore((state) => state.setSelectedNodeId);
  const dragItem = useDraggedItemStore((state) => state.componentId);
  const updateItem = useDraggedItemStore((state) => state.updateItem);
  const setHoveringSection = useZoneStore((state) => state.setHoveringSection);
  const userIsDragging = !!dragItem;

  const tree = useTreeStore((state) => state.tree);

  useEffect(() => {
    if (onChange) onChange(tree as any);
  }, [tree]);

  const { onDragStartOrUpdate } = usePlaceholderStyle();

  return (
    <DragDropContext
      onDragUpdate={(update) => {
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
          return;
        }

        // New component
        if (
          droppedItem.source.droppableId.startsWith('component-list') &&
          droppedItem.destination
        ) {
          onDrop({
            data: tree,
            componentType: droppedItem.draggableId,
            destinationIndex: droppedItem.destination!.index,
            destinationZoneId: droppedItem.destination.droppableId,
          });

          return;
        } else {
          onComponentMoved({
            nodeId: droppedItem.draggableId.replace('draggable-', ''),
            destinationIndex: droppedItem.destination!.index,
            destinationParentId: droppedItem.destination.droppableId,
            sourceIndex: droppedItem.source.index,
            sourceParentId: droppedItem.source.droppableId,
          });
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
        <DropZone
          sectionId={ROOT_ID}
          zoneId={ROOT_ID}
          areEntitiesFetched={areEntitiesFetched}
          resolveDesignValue={resolveDesignValue}
        />
      </div>
    </DragDropContext>
  );
};
