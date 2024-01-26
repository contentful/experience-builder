import React from 'react';
import { CSSProperties, ReactNode, SyntheticEvent } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import classNames from 'classnames';
import styles from './styles.module.css';
import { Rect } from '@components/Draggable/canvasToolsUtils';
import Tooltip from './Tooltip';

export const DraggableComponent = ({
  children,
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
  className,
  isContainer,
  isDragDisabled = false,
  ...rest
}: {
  className?: string;
  label: string;
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
  coordinates: Rect;
  isContainer: boolean;
  userIsDragging?: boolean;
  style?: CSSProperties;
  isDragDisabled?: boolean;
}) => {
  return (
    <Draggable key={id} draggableId={id} index={index} isDragDisabled={isDragDisabled}>
      {(provided, snapshot) => (
        <div
          data-ctfl-draggable-id={id}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          {...rest}
          className={classNames(styles.DraggableComponent, className, {
            [styles.isAssemblyBlock]: isAssemblyBlock,
            [styles.isDragging]: snapshot.isDragging,
            [styles.isSelected]: isSelected,
            [styles.userIsDragging]: userIsDragging,
          })}
          style={{
            ...style,
            ...provided.draggableProps.style,
          }}
          onMouseOver={onMouseOver}
          onMouseOut={onMouseOut}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onClick={onClick}>
          <Tooltip
            id={id}
            coordinates={coordinates}
            isAssemblyBlock={isAssemblyBlock}
            isContainer={isContainer}
            label={label}
          />

          {children}
        </div>
      )}
    </Draggable>
  );
};
