import useCanvasInteractions from '@/hooks/useCanvasInteractions';
import { useDraggedItemStore } from '@/store/draggedItem';
import { useEditorStore } from '@/store/editor';
import { sendMessage } from '@contentful/experiences-core';
import { OUTGOING_EVENTS } from '@contentful/experiences-core/constants';
import {
  DragDropContext,
  OnBeforeCaptureResponder,
  OnBeforeDragStartResponder,
  OnDragEndResponder,
  OnDragStartResponder,
  OnDragUpdateResponder,
} from '@hello-pangea/dnd';
import React, { useRef } from 'react';
import type { ReactNode } from 'react';
import TestDNDContainer from './TestDNDContainer';
import { COMPONENT_LIST_ID } from '@/types/constants';
import SimulateDnD from '@/utils/simulateDnD';

type Props = {
  children: ReactNode;
};

export const DNDProvider = ({ children }: Props) => {
  const setSelectedNodeId = useEditorStore((state) => state.setSelectedNodeId);
  const draggedItem = useDraggedItemStore((state) => state.draggedItem);
  const setOnBeforeCaptureId = useDraggedItemStore((state) => state.setOnBeforeCaptureId);
  const setDraggingOnCanvas = useDraggedItemStore((state) => state.setDraggingOnCanvas);
  const updateItem = useDraggedItemStore((state) => state.updateItem);
  const { onAddComponent, onMoveComponent } = useCanvasInteractions();
  const selectedNodeId = useEditorStore((state) => state.selectedNodeId);
  const prevSelectedNodeId = useRef<string | null>(null);

  const isTestRun =
    typeof window !== 'undefined' && Object.prototype.hasOwnProperty.call(window, 'Cypress');

  const beforeDragStart: OnBeforeDragStartResponder = ({ source }) => {
    prevSelectedNodeId.current = selectedNodeId;

    // Unselect the current node when dragging and remove the outline
    setSelectedNodeId('');

    // Set dragging state here to make sure that DnD capture phase has completed
    setDraggingOnCanvas(true);

    sendMessage(OUTGOING_EVENTS.ComponentSelected, {
      nodeId: '',
    });
    if (source.droppableId !== COMPONENT_LIST_ID) {
      sendMessage(OUTGOING_EVENTS.ComponentMoveStarted);
    }
  };

  const beforeCapture: OnBeforeCaptureResponder = ({ draggableId }) => {
    setOnBeforeCaptureId(draggableId);
  };

  const dragStart: OnDragStartResponder = (start) => {
    updateItem(start);
  };

  const dragUpdate: OnDragUpdateResponder = (update) => {
    updateItem(update);
  };

  const dragEnd: OnDragEndResponder = (dropResult) => {
    setDraggingOnCanvas(false);
    setOnBeforeCaptureId('');
    updateItem();
    SimulateDnD.reset();

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
    sendMessage(OUTGOING_EVENTS.ComponentMoveEnded);
    sendMessage(OUTGOING_EVENTS.ComponentSelected, {
      nodeId: dropResult.draggableId,
    });
  };

  return (
    <DragDropContext
      onBeforeCapture={beforeCapture}
      onDragUpdate={dragUpdate}
      onBeforeDragStart={beforeDragStart}
      onDragStart={dragStart}
      onDragEnd={dragEnd}>
      {isTestRun ? (
        <TestDNDContainer
          onDragEnd={dragEnd}
          onBeforeDragStart={beforeDragStart}
          onDragStart={dragStart}
          onDragUpdate={dragUpdate}>
          {children}
        </TestDNDContainer>
      ) : (
        children
      )}
    </DragDropContext>
  );
};
