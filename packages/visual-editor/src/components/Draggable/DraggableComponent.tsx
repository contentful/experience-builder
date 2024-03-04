import React, { useEffect, useRef } from 'react';
import { CSSProperties, ReactNode, SyntheticEvent } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import classNames from 'classnames';
import styles from './styles.module.css';
import { Rect } from '@components/Draggable/canvasToolsUtils';
import Tooltip from './Tooltip';
import Placeholder, { PlaceholderParams } from './Placeholder';
import { useDraggedItemStore } from '@/store/draggedItem';
import {
  ComponentDefinition,
  ComponentDefinitionVariableType,
} from '@contentful/experience-builder-core/types';

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

interface DraggableComponentProps {
  placeholder: PlaceholderParams;
  wrapperProps: Record<string, string | undefined>;
  children: ReactNode;
  id: string;
  index: number;
  isAssemblyBlock?: boolean;
  isSelected?: boolean;
  onClick?: (e: SyntheticEvent) => void;
  onMouseDown?: (e: SyntheticEvent) => void;
  onMouseUp?: (e: SyntheticEvent) => void;
  onMouseOver?: (e: SyntheticEvent) => void;
  onMouseOut?: (e: SyntheticEvent) => void;
  coordinates: Rect | null;
  isContainer: boolean;
  blockId?: string;
  userIsDragging?: boolean;
  style?: CSSProperties;
  isDragDisabled?: boolean;
  definition: ComponentDefinition<ComponentDefinitionVariableType>;
}

export const DraggableComponent: React.FC<DraggableComponentProps> = ({
  children,
  id,
  index,
  isAssemblyBlock = false,
  isSelected = false,
  onClick = () => null,
  coordinates,
  userIsDragging,
  style,
  wrapperProps,
  isContainer,
  blockId,
  isDragDisabled = false,
  placeholder,
  definition,
  ...rest
}) => {
  const isDraggingOnCanvas = useDraggedItemStore((state) => state.isDraggingOnCanvas);
  const draggingId = useDraggedItemStore((state) => state.onBeforeCaptureId);
  const mouseX = useDraggedItemStore((state) => state.mouseX);
  const mouseY = useDraggedItemStore((state) => state.mouseY);
  const ref = useRef<HTMLElement | undefined | null>(null);

  useEffect(() => {
    if (!isDraggingOnCanvas) {
      return;
    }

    if (draggingId !== id) {
      return;
    }

    const el: HTMLElement | undefined | null = ref.current;

    if (!el) {
      return;
    }

    // const WIDTH = 114;
    // const HEIGHT = 42;
    // const width = `${WIDTH}px`;
    // const height = `${HEIGHT}px`;

    // const { width, height } = el.getBoundingClientRect();
    // const MAX_HEIGHT = window.innerHeight * 0.75;
    // const MAX_WIDTH = window.innerWidth * 0.75;

    const updatedWidth = 115;
    const updatedHeight = 40;

    // if (height > MAX_HEIGHT) {
    //   updatedHeight = updatedHeight / 2;
    // }

    const left = `${mouseX - updatedWidth / 2}px`;
    const top = `${mouseY - updatedHeight / 2}px`;

    el.style.position = 'fixed';
    el.style.left = left;
    el.style.top = top;
    el.style.width = `${updatedWidth}px`;
    el.style.height = `${updatedHeight}px`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, id, isDraggingOnCanvas, draggingId]);

  return (
    <Draggable key={id} draggableId={id} index={index} isDragDisabled={isDragDisabled}>
      {(provided, snapshot) => (
        <div
          data-ctfl-draggable-id={id}
          data-test-id={`draggable-${blockId ?? 'node'}`}
          ref={(refNode) => {
            provided?.innerRef(refNode);
            ref.current = refNode;
          }}
          {...wrapperProps}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          {...rest}
          className={classNames(styles.DraggableComponent, wrapperProps.className, {
            [styles.isAssemblyBlock]: isAssemblyBlock,
            [styles.isDragging]: snapshot.isDragging,
            [styles.isSelected]: isSelected,
            [styles.userIsDragging]: userIsDragging,
          })}
          style={{
            ...style,
            ...getStyle(provided.draggableProps.style, snapshot),
            resize: 'both',
          }}
          onClick={onClick}>
          <Tooltip
            id={id}
            coordinates={coordinates}
            isAssemblyBlock={isAssemblyBlock}
            isContainer={isContainer}
            label={definition.name || 'No label specified'}
          />
          <Placeholder {...placeholder} id={id} />
          {children}
        </div>
      )}
    </Draggable>
  );
};
