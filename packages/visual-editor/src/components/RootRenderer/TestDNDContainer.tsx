import {
  DragStart,
  DragUpdate,
  DropResult,
  OnBeforeDragStartResponder,
  OnDragEndResponder,
  OnDragUpdateResponder,
  ResponderProvided,
} from '@hello-pangea/dnd';
import React from 'react';

interface TestDNDContainerProps extends React.PropsWithChildren {
  onDragUpdate: OnDragUpdateResponder;
  onBeforeDragStart: OnBeforeDragStartResponder;
  onDragEnd: OnDragEndResponder;
}

const TestDNDContainer: React.FC<TestDNDContainerProps> = ({
  onDragEnd,
  onBeforeDragStart,
  onDragUpdate,
  children,
}) => {
  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    const draggedItem = event.nativeEvent as unknown as DragStart;
    const start: DragStart = {
      mode: draggedItem.mode,
      draggableId: draggedItem.draggableId,
      type: draggedItem.type,
      source: draggedItem.source,
    };
    console.log('dragStart', start);
    onBeforeDragStart(start);
  };

  const handleDrag = (event: React.DragEvent<HTMLDivElement>) => {
    const draggedItem = event.nativeEvent as unknown as DragUpdate;
    const update: DragUpdate = {
      mode: draggedItem.mode,
      draggableId: draggedItem.draggableId,
      type: draggedItem.type,
      source: draggedItem.source,
      destination: draggedItem.destination,
      combine: draggedItem.combine,
    };
    onDragUpdate(update, {} as ResponderProvided);
  };

  const handleDragEnd = (event: React.DragEvent<HTMLDivElement>) => {
    const draggedItem = event.nativeEvent as unknown as DropResult;
    const result: DropResult = {
      mode: draggedItem.mode,
      draggableId: draggedItem.draggableId,
      type: draggedItem.type,
      source: draggedItem.source,
      destination: draggedItem.destination,
      combine: draggedItem.combine,
      reason: draggedItem.reason,
    };
    onDragEnd(result, {} as ResponderProvided);
  };

  return (
    <div
      data-test-id="dnd-context-substitute"
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}>
      {children}
    </div>
  );
};

export default TestDNDContainer;
