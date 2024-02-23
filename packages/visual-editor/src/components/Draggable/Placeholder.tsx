import { useDraggedItemStore } from '@/store/draggedItem';
import { COMPONENT_LIST_ID, DRAGGABLE_HEIGHT, DRAGGABLE_WIDTH } from '@/types/constants';
import { Direction } from '@hello-pangea/dnd';
import React, { CSSProperties } from 'react';

export interface PlaceholderParams {
  dropzoneElementId: string;
  direction: Direction;
  elementIndex: number;
  totalIndexes: number;
  isDraggingOver: boolean;
}

interface PlaceholderProps extends PlaceholderParams {
  id: string;
}

const calcNewComponentStyles = (params: CalcStylesParams): CSSProperties => {
  const { destinationIndex, elementIndex, dropzoneElementId, id, direction, totalIndexes } = params;

  const isEnd = destinationIndex === totalIndexes && elementIndex === totalIndexes - 1;

  const dropzoneElement = document.querySelector(`[data-rfd-droppable-id="${dropzoneElementId}"]`);
  const element = document.querySelector(`[data-ctfl-draggable-id="${id}"]`);

  if (!dropzoneElement || !element) {
    return emptyStyles;
  }

  const { width, height } = dropzoneElement.getBoundingClientRect();

  if (direction === 'horizontal') {
    const top = (height - element.getBoundingClientRect().height) / 2;

    if (isEnd) {
      return { width: DRAGGABLE_WIDTH, height, top: -top, right: -DRAGGABLE_WIDTH };
    }

    return { width: DRAGGABLE_WIDTH, height, top: -top, left: -DRAGGABLE_WIDTH };
  }

  const left = (width - element.getBoundingClientRect().width) / 2;
  const top = -DRAGGABLE_HEIGHT;

  if (isEnd) {
    return { width, height: DRAGGABLE_HEIGHT, bottom: -DRAGGABLE_HEIGHT, left: -left };
  }

  return { width, height: DRAGGABLE_HEIGHT, top, left: -left };
};

const calcMovementStyles = (params: CalcStylesParams): CSSProperties => {
  const {
    destinationIndex,
    sourceIndex,
    destinationId,
    sourceId,
    elementIndex,
    dropzoneElementId,
    id,
    direction,
    totalIndexes,
    draggableId,
  } = params;

  const isEnd = destinationIndex === totalIndexes && elementIndex === totalIndexes - 1;
  const isEmptyZone = totalIndexes === 0;

  const isSameZone = destinationId === sourceId;
  const dropzoneElement = document.querySelector(`[data-rfd-droppable-id="${dropzoneElementId}"]`);
  const draggableElement = document.querySelector(`[data-rfd-draggable-id="${draggableId}"]`);
  const element = document.querySelector(`[data-ctfl-draggable-id="${id}"]`);

  if (!dropzoneElement || !element || !draggableElement) {
    return emptyStyles;
  }

  const dropzoneSizes = dropzoneElement.getBoundingClientRect();

  const draggableSizes = draggableElement.getBoundingClientRect();
  const elementSizes = element.getBoundingClientRect();

  if (direction === 'horizontal') {
    const width = draggableSizes.width;
    const height = dropzoneSizes.height;
    const top = (dropzoneSizes.height - elementSizes.height) / 2;

    if (isSameZone && destinationIndex > sourceIndex) {
      return { width, height, top: -top, right: -width };
    }
    if (isEnd) {
      return { width, height, top: -top, right: -width };
    }

    return { width, height, top: -top, left: -width };
  }

  const width = dropzoneSizes.width;
  const height = draggableSizes.height;
  const top = -height;
  const left = (dropzoneSizes.width - elementSizes.width) / 2;

  if (isEmptyZone) {
    return { width, height, bottom: -height, left: -left };
  }
  if (isSameZone && destinationIndex > sourceIndex) {
    return { width, height, bottom: -height, left: -left };
  }

  if (isEnd) {
    return { width, height, bottom: -height, left: -left };
  }

  return { width, height, top, left: -left };
};

interface CalcStylesParams extends PlaceholderProps {
  sourceIndex: number;
  sourceId: string;
  destinationIndex: number;
  destinationId: string;
  draggableId: string;
}

const emptyStyles = { width: 0, height: 0 };

const calcPlaceholderStyles = (params: CalcStylesParams): CSSProperties => {
  const { isDraggingOver, sourceId } = params;

  if (!isDraggingOver) {
    return emptyStyles;
  }

  if (sourceId === COMPONENT_LIST_ID) {
    return calcNewComponentStyles(params);
  }

  return calcMovementStyles(params);
};

const Placeholder: React.FC<PlaceholderProps> = (props) => {
  const sourceIndex = useDraggedItemStore((state) => state.draggedItem?.source.index) ?? -1;
  const draggableId = useDraggedItemStore((state) => state.draggedItem?.draggableId) ?? '';
  const sourceId = useDraggedItemStore((state) => state.draggedItem?.source.droppableId) ?? '';
  const destinationIndex =
    useDraggedItemStore((state) => state.draggedItem?.destination?.index) ?? -1;
  const destinationId =
    useDraggedItemStore((state) => state.draggedItem?.destination?.droppableId) ?? '';

  const { elementIndex, totalIndexes, isDraggingOver } = props;

  const isActive = destinationIndex === elementIndex;
  const isEnd = destinationIndex === totalIndexes && elementIndex === totalIndexes - 1;
  const isVisible = isEnd || isActive;

  const isComponentList = destinationId === COMPONENT_LIST_ID;

  return (
    !isComponentList &&
    isDraggingOver &&
    isVisible && (
      <div
        style={{
          ...calcPlaceholderStyles({
            ...props,
            sourceId,
            sourceIndex,
            destinationId,
            destinationIndex,
            draggableId,
          }),
          backgroundColor: 'rgba(var(--exp-builder-blue300-rgb), 0.5)',
          position: 'absolute',
        }}
      />
    )
  );
};

export default Placeholder;
