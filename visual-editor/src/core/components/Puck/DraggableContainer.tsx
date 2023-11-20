import { Draggable, Droppable } from '@hello-pangea/dnd';
import React from 'react';

interface Props {
  id: string;
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
        {(provided, snapshot) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            <Draggable draggableId={id} key={id} index={0}>
              {(provided, snapshot) => (
                <div
                  id="item"
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={{
                    ...provided.draggableProps.style,
                    width: 15,
                    height: 15,
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
