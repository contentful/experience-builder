import useCenterDraggablePosition from '@/hooks/useCenterDraggablePosition';
import { useDraggedItemStore } from '@/store/draggedItem';
import {
  COMPONENT_LIST_ID,
  DRAGGABLE_HEIGHT,
  DRAGGABLE_WIDTH,
  NEW_COMPONENT_ID,
} from '@/types/constants';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import React, { CSSProperties, useRef } from 'react';

interface Props {
  id: string;
}

function getStyle(style, snapshot) {
  if (!snapshot.isDropAnimating) {
    return style;
  }
  return {
    ...style,
    // cannot be 0, but make it super tiny
    transitionDuration: `0.001s`,
  };
}

const DraggableContainer: React.FC<Props> = ({ id }) => {
  const ref = useRef<HTMLElement | undefined | null>(null);
  const mouseX = useDraggedItemStore((state) => state.mouseX);
  const mouseY = useDraggedItemStore((state) => state.mouseY);

  // const [coordinates, setCoordinates] = useState({ top: 0, left: 0 });

  // const coordinateSetCount = useRef(0);

  useCenterDraggablePosition({
    draggableId: id,
    draggableRef: ref,
  });

  return (
    <div
      id={COMPONENT_LIST_ID}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: -1,
      }}>
      <Droppable droppableId={COMPONENT_LIST_ID} isDropDisabled>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            <Draggable draggableId={id} key={id} index={0}>
              {(provided, snapshot) => (
                <div
                  id={NEW_COMPONENT_ID}
                  data-ctfl-dragging-element
                  ref={(node) => {
                    provided.innerRef(node);
                    ref.current = node;
                  }}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={{
                    ...getStyle(provided.draggableProps.style as CSSProperties, snapshot),
                    width: DRAGGABLE_WIDTH,
                    height: DRAGGABLE_HEIGHT,
                    backgroundColor: 'red',
                    pointerEvents: 'none',
                  }}>
                  {mouseX}, {mouseY}
                </div>
              )}
            </Draggable>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default DraggableContainer;
