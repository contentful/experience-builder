import React from 'react';
import { CSSProperties, SyntheticEvent } from 'react';
import {
  Draggable,
  DraggableProvidedDragHandleProps,
  DraggableProvidedDraggableProps,
} from '@hello-pangea/dnd';
import classNames from 'classnames';
import styles from './styles.module.css';
import { Rect } from '@components/Draggable/canvasToolsUtils';
import Tooltip from './Tooltip';
import {
  ComponentDefinition,
  ComponentDefinitionVariableType,
} from '@contentful/experiences-core/types';
import { useDraggedItemStore } from '@/store/draggedItem';

export type NoWrapDraggableProps = {
  ['data-ctfl-draggable-id']: string;
  wrapperClassName: string;
  Tooltip: React.ReactNode;
  innerRef: (element?: HTMLElement | null | undefined) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps;
  style: CSSProperties;
  onClick: (e: SyntheticEvent<Element, Event>) => void;
  onMouseOver: (e: SyntheticEvent<Element, Event>) => void;
  ['data-test-id']?: string;
};

type DraggableChildComponentProps = {
  wrapperProps: Record<string, string | undefined>;
  elementToRender: (props: NoWrapDraggableProps) => JSX.Element;
  id: string;
  index: number;
  isAssemblyBlock?: boolean;
  isSelected?: boolean;
  onClick?: (e: SyntheticEvent) => void;
  onMouseOver?: (e: SyntheticEvent) => void;
  coordinates: Rect | null;
  isContainer: boolean;
  blockId: string;
  userIsDragging?: boolean;
  style?: CSSProperties;
  isDragDisabled?: boolean;
  className?: string;
  definition: ComponentDefinition<ComponentDefinitionVariableType>;
};

/**
 * This component is meant to function the same as DraggableComponent except
 * with the difference that the draggable props are passed to the underlying
 * component. This removes an extra nested `div` in editor mode that otherwise
 * is not visible in delivery mode.
 *
 * This is helpful for `flex` or `grid` layouts. Currently used by the SingleColumn
 * component.
 */
export const DraggableChildComponent: React.FC<DraggableChildComponentProps> = (props) => {
  const {
    elementToRender,
    id,
    index,
    isAssemblyBlock = false,
    isSelected = false,
    onClick = () => null,
    onMouseOver = () => null,
    coordinates,
    userIsDragging,
    style,
    isContainer,
    blockId,
    isDragDisabled = false,
    wrapperProps,
    definition,
  } = props;
  const isHoveredComponent = useDraggedItemStore((state) => state.hoveredComponentId === id);

  return (
    <Draggable key={id} draggableId={id} index={index} isDragDisabled={isDragDisabled}>
      {(provided, snapshot) =>
        elementToRender({
          ['data-ctfl-draggable-id']: id,
          ['data-test-id']: `draggable-${blockId}`,
          innerRef: provided.innerRef,
          ...wrapperProps,
          draggableProps: provided.draggableProps,
          wrapperClassName: classNames(styles.DraggableComponent, wrapperProps.className, {
            [styles.isAssemblyBlock]: isAssemblyBlock,
            [styles.isDragging]: snapshot.isDragging,
            [styles.isSelected]: isSelected,
            [styles.userIsDragging]: userIsDragging,
            [styles.isHoveringComponent]: isHoveredComponent,
          }),
          dragHandleProps: provided.dragHandleProps!,
          style: {
            ...style,
            ...provided.draggableProps.style,
          },
          onClick,
          onMouseOver,
          Tooltip: (
            <Tooltip
              id={id}
              coordinates={coordinates}
              isAssemblyBlock={isAssemblyBlock}
              isContainer={isContainer}
              label={definition.name || 'No label specified'}
            />
          ),
        })
      }
    </Draggable>
  );
};
