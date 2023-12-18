import { DRAGGABLE_HEIGHT, DRAGGABLE_WIDTH } from '@/types/constants';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import React from 'react';

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
  return (
    <div
      id="component-list"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: -1,
      }}>
      <Droppable droppableId={`component-list`} isDropDisabled>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            <Draggable draggableId={id} key={id} index={0}>
              {(provided, snapshot) => (
                <div
                  id="item"
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={{
                    ...getStyle(provided.draggableProps.style, snapshot),
                    width: DRAGGABLE_WIDTH,
                    height: DRAGGABLE_HEIGHT,
                  }}
                />
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
