import useCanvasInteractions from '@/hooks/useCanvasInteractions';
import { usePlaceholderStyle } from '@/hooks/usePlaceholderStyle';
import { useDraggedItemStore } from '@/store/draggedItem';
import { useEditorStore } from '@/store/editor';
import { sendMessage } from '@contentful/experience-builder-core';
import { OUTGOING_EVENTS } from '@contentful/experience-builder-core/constants';
import {
  DragDropContext,
  OnBeforeDragStartResponder,
  OnDragEndResponder,
  OnDragUpdateResponder,
} from '@hello-pangea/dnd';
import dragState from '@/utils/dragState';
import React, { useRef } from 'react';
import type { ReactNode } from 'react';
import TestDNDContainer from './TestDNDContainer';

type Props = {
  children: ReactNode;
};

export const DNDProvider = ({ children }: Props) => {
  const setSelectedNodeId = useEditorStore((state) => state.setSelectedNodeId);
  const draggedItem = useDraggedItemStore((state) => state.draggedItem);
  const updateItem = useDraggedItemStore((state) => state.updateItem);
  const { onAddComponent, onMoveComponent } = useCanvasInteractions();
  const { onDragStartOrUpdate } = usePlaceholderStyle();
  const selectedNodeId = useEditorStore((state) => state.selectedNodeId);
  const prevSelectedNodeId = useRef<string | null>(null);

  const isTestRun =
    typeof window !== 'undefined' && Object.prototype.hasOwnProperty.call(window, 'Cypress');

  const dragStart: OnBeforeDragStartResponder = (start) => {
    onDragStartOrUpdate(start);
    prevSelectedNodeId.current = selectedNodeId;

    //Unselect the current node when dragging and remove the outline
    setSelectedNodeId('');
    sendMessage(OUTGOING_EVENTS.ComponentSelected, {
      nodeId: '',
    });
  };

  const dragUpdate: OnDragUpdateResponder = (update) => {
    updateItem(update);
    onDragStartOrUpdate(update);
  };

  const dragEnd: OnDragEndResponder = (dropResult) => {
    updateItem(undefined);
    dragState.reset();

    if (!dropResult.destination) {
      if (!draggedItem?.destination) {
        // User cancel drag
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
      // Use the destination from the draggedItem (when clicking the canvas)
      dropResult.destination = draggedItem.destination;
    }

    // New component added to canvas
    if (dropResult.source.droppableId.startsWith('component-list')) {
      onAddComponent(dropResult);
    } else {
      onMoveComponent(dropResult);
    }

    // If a node was previously selected prior to dragging, re-select it
    setSelectedNodeId(dropResult.draggableId);
    sendMessage(OUTGOING_EVENTS.ComponentSelected, {
      nodeId: dropResult.draggableId,
    });
  };

  return (
    <DragDropContext onDragUpdate={dragUpdate} onBeforeDragStart={dragStart} onDragEnd={dragEnd}>
      {isTestRun ? (
        <TestDNDContainer
          onDragEnd={dragEnd}
          onBeforeDragStart={dragStart}
          onDragUpdate={dragUpdate}>
          {children}
        </TestDNDContainer>
      ) : (
        children
      )}
    </DragDropContext>
  );
};
