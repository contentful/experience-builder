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

export type NoWrapDraggableProps = {
  ['data-ctfl-draggable-id']: string;
  wrapperClassName: string;
  Tooltip: React.ReactNode;
  innerRef: (element?: HTMLElement | null | undefined) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps;
  style: CSSProperties;
  onMouseOver: (e: SyntheticEvent<Element, Event>) => void;
  onMouseOut: (e: SyntheticEvent<Element, Event>) => void;
  onMouseDown: (e: SyntheticEvent<Element, Event>) => void;
  onMouseUp: (e: SyntheticEvent<Element, Event>) => void;
  onClick: (e: SyntheticEvent<Element, Event>) => void;
  ['data-test-id']?: string;
};

type DraggableChildComponentProps = {
  label: string;
  wrapperProps: Record<string, string>;
  elementToRender: (props: NoWrapDraggableProps) => JSX.Element;
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
  blockId: string;
  userIsDragging?: boolean;
  style?: CSSProperties;
  isDragDisabled?: boolean;
  className?: string;
};

/**
 * This component is meant to function the same as DraggableComponent except
 * with the difference that the draggable props are passed to the underlying
 * component. This removes an extra nexted `div` in editor mode that otherwise
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
    onMouseDown = () => null,
    onMouseUp = () => null,
    onMouseOver = () => null,
    onMouseOut = () => null,
    label,
    coordinates,
    userIsDragging,
    style,
    isContainer,
    blockId,
    isDragDisabled = false,
    wrapperProps,
  } = props;

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
          }),
          dragHandleProps: provided.dragHandleProps!,
          style: {
            ...style,
            ...provided.draggableProps.style,
          },
          onMouseOver,
          onMouseOut,
          onMouseDown,
          onMouseUp,
          onClick,
          Tooltip: (
            <Tooltip
              id={id}
              coordinates={coordinates}
              isAssemblyBlock={isAssemblyBlock}
              isContainer={isContainer}
              label={label}
            />
          ),
        })
      }
    </Draggable>
  );
};
