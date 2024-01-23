import useCanvasInteractions from '@/hooks/useCanvasInteractions';
import { usePlaceholderStyle } from '@/hooks/usePlaceholderStyle';
import { useDraggedItemStore } from '@/store/draggedItem';
import { useEditorStore } from '@/store/editor';
import { sendMessage } from '@contentful/experience-builder-core';
import { OUTGOING_EVENTS } from '@contentful/experience-builder-core/constants';
import { DragDropContext } from '@hello-pangea/dnd';
import dragState from '@/utils/dragState';
import React, { useRef } from 'react';
import type { ReactNode } from 'react';
import { pick } from 'lodash-es';

type Props = {
  children: ReactNode;
};

export const DNDProvider = ({ children }: Props) => {
  const setSelectedNodeId = useEditorStore((state) => state.setSelectedNodeId);
  const updateItem = useDraggedItemStore((state) => state.updateItem);
  const { onAddComponent, onMoveComponent } = useCanvasInteractions();
  const { onDragStartOrUpdate } = usePlaceholderStyle();
  const selectedNodeId = useEditorStore((state) => state.selectedNodeId);
  const prevSelectedNodeId = useRef<string | null>(null);

  const isTestRun =
    typeof window !== 'undefined' && Object.prototype.hasOwnProperty.call(window, 'Cypress');

  const dragStart = (event) => {
    const start = isTestRun
      ? pick(event.nativeEvent, ['mode', 'draggableId', 'type', 'source', 'destination'])
      : event;
    onDragStartOrUpdate(start);
    prevSelectedNodeId.current = selectedNodeId;

    //Unselect the current node when dragging and remove the outline
    setSelectedNodeId('');
    sendMessage(OUTGOING_EVENTS.ComponentSelected, {
      nodeId: '',
    });
  };

  const dragUpdate = (event) => {
    const update = isTestRun
      ? pick(event.nativeEvent, ['mode', 'draggableId', 'type', 'source', 'destination'])
      : event;
    updateItem(update);
    onDragStartOrUpdate(update);
  };

  const dragEnd = (event) => {
    const droppedItem = isTestRun
      ? pick(event.nativeEvent, ['mode', 'draggableId', 'type', 'source', 'destination'])
      : event;
    updateItem(undefined);
    dragState.reset();

    sendMessage(OUTGOING_EVENTS.MouseUp);

    // User cancel drag
    if (!droppedItem.destination) {
      sendMessage(OUTGOING_EVENTS.ComponentDragCanceled);
      //select the previously selected node if drag was canceled
      if (prevSelectedNodeId.current) {
        setSelectedNodeId(prevSelectedNodeId.current);
        sendMessage(OUTGOING_EVENTS.ComponentSelected, {
          nodeId: prevSelectedNodeId.current,
        });
        prevSelectedNodeId.current = null;
      }
      return;
    }

    // New component added to canvas
    if (droppedItem.source.droppableId.startsWith('component-list')) {
      onAddComponent(droppedItem);
    } else {
      onMoveComponent(droppedItem);
    }

    // If a node was previously selected prior to dragging, re-select it
    setSelectedNodeId(droppedItem.draggableId);
    sendMessage(OUTGOING_EVENTS.ComponentSelected, {
      nodeId: droppedItem.draggableId,
    });
  };

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
