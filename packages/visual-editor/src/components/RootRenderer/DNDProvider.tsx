import useCanvasInteractions from '@/hooks/useCanvasInteractions';
import { usePlaceholderStyle } from '@/hooks/usePlaceholderStyle';
import { useDraggedItemStore } from '@/store/draggedItem';
import { useEditorStore } from '@/store/editor';
import { sendMessage } from '@contentful/experience-builder-core';
import { OUTGOING_EVENTS } from '@contentful/experience-builder-core/constants';
import { DragDropContext } from '@hello-pangea/dnd';
import dragState from '@/utils/dragState';
import React from 'react';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export const DNDProvider = ({ children }: Props) => {
  const setSelectedNodeId = useEditorStore((state) => state.setSelectedNodeId);
  const updateItem = useDraggedItemStore((state) => state.updateItem);
  const { onAddComponent, onMoveComponent } = useCanvasInteractions();
  const { onDragStartOrUpdate } = usePlaceholderStyle();

  const dragStart = (start) => {
    onDragStartOrUpdate(start);
    setSelectedNodeId('');
    sendMessage(OUTGOING_EVENTS.ComponentSelected, {
      nodeId: '',
    });
  };

  const dragUpdate = (update) => {
    updateItem(update);
    onDragStartOrUpdate(update);
  };

  const dragEnd = (droppedItem) => {
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
      onAddComponent(droppedItem);
    } else {
      onMoveComponent(droppedItem);
    }
  };

  const isTestRun =
    typeof window !== 'undefined' && Object.prototype.hasOwnProperty.call(window, 'Cypress');
  console.log('isTestRun', isTestRun);

  return (
    <DragDropContext onDragUpdate={dragUpdate} onBeforeDragStart={dragStart} onDragEnd={dragEnd}>
      {isTestRun ? (
        <div
          data-test-id="dnd-context-substitute"
          onDragStart={dragStart}
          onDrag={dragUpdate}
          onDragEnd={dragEnd}>
          {children}
        </div>
      ) : (
        children
      )}
    </DragDropContext>
  );
};
