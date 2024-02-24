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

/**
 * Calculate the size and position of the dropzone indicator
 * when dragging a new component onto the canvas
 */
const calcNewComponentStyles = (params: CalcStylesParams): CSSProperties => {
  const { destinationIndex, elementIndex, dropzoneElementId, id, direction, totalIndexes } = params;

  const isEnd = destinationIndex === totalIndexes && elementIndex === totalIndexes - 1;
  const isHorizontal = direction === 'horizontal';
  const isRightAlign = isHorizontal && isEnd;
  const isBottomAlign = !isHorizontal && isEnd;

  const dropzone = document.querySelector(`[data-rfd-droppable-id="${dropzoneElementId}"]`);
  const element = document.querySelector(`[data-ctfl-draggable-id="${id}"]`);

  if (!dropzone || !element) {
    return emptyStyles;
  }

  const elementSizes = element.getBoundingClientRect();
  const dropzoneSizes = dropzone.getBoundingClientRect();

  const width = isHorizontal ? DRAGGABLE_WIDTH : dropzoneSizes.width;
  const height = isHorizontal ? dropzoneSizes.height : DRAGGABLE_HEIGHT;
  const top = isHorizontal ? -(height - elementSizes.height) / 2 : -height;
  const left = isHorizontal ? -width : -(width - elementSizes.width) / 2;

  return {
    width,
    height,
    top: !isBottomAlign ? top : 'unset',
    right: isRightAlign ? -width : 'unset',
    bottom: isBottomAlign ? -height : 'unset',
    left: !isRightAlign ? left : 'unset',
  };
};

/**
 * Calculate the size and position of the dropzone indicator
 * when moving an existing component on the canvas
 */
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
  const isHorizontal = direction === 'horizontal';
  const isSameZone = destinationId === sourceId;
  const isBelowSourceIndex = destinationIndex > sourceIndex;
  const isRightAlign = isHorizontal && (isEnd || (isSameZone && isBelowSourceIndex));
  const isBottomAlign = !isHorizontal && (isEnd || (isSameZone && isBelowSourceIndex));

  const dropzone = document.querySelector(`[data-rfd-droppable-id="${dropzoneElementId}"]`);
  const draggable = document.querySelector(`[data-rfd-draggable-id="${draggableId}"]`);
  const element = document.querySelector(`[data-ctfl-draggable-id="${id}"]`);

  if (!dropzone || !element || !draggable) {
    return emptyStyles;
  }

  const elementSizes = element.getBoundingClientRect();
  const dropzoneSizes = dropzone.getBoundingClientRect();
  const draggableSizes = draggable.getBoundingClientRect();

  const width = isHorizontal ? draggableSizes.width : dropzoneSizes.width;
  const height = isHorizontal ? dropzoneSizes.height : draggableSizes.height;
  const top = isHorizontal ? -(height - elementSizes.height) / 2 : -height;
  const left = isHorizontal ? -width : -(width - elementSizes.width) / 2;

  return {
    width,
    height,
    top: !isBottomAlign ? top : 'unset',
    right: isRightAlign ? -width : 'unset',
    bottom: isBottomAlign ? -height : 'unset',
    left: !isRightAlign ? left : 'unset',
  };
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
