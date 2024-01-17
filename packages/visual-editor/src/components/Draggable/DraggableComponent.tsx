import React from 'react';
import { CSSProperties, ReactNode, SyntheticEvent } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import classNames from 'classnames';
import styles from './styles.module.css';

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
  userIsDragging,
  style,
  className,
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
  userIsDragging?: boolean;
  style?: CSSProperties;
  isDragDisabled?: boolean;
}) => {
  return (
    <Draggable key={id} draggableId={id} index={index} isDragDisabled={isDragDisabled}>
      {(provided, snapshot) => (
        <div
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
          {!isSelected ? (
            <div
              className={classNames(styles.overlay, {
                [styles.overlayAssembly]: isAssemblyBlock,
              })}>
              {label}
            </div>
          ) : null}

          {children}
        </div>
      )}
    </Draggable>
  );
};
