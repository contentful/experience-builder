import React from 'react';
import { CSSProperties, ReactNode, SyntheticEvent } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import classNames from 'classnames';
import styles from './styles.module.css';

export const DraggableComponent = ({
  children,
  id,
  index,
  isSelected = false,
  onClick = () => null,
  onMouseDown = () => null,
  onMouseUp = () => null,
  onMouseOver = () => null,
  onMouseOut = () => null,
  debug,
  label,
  isLocked = false,
  userIsDragging,
  forceHover = false,
  indicativeHover = false,
  style,
}: {
  label: string;
  children: ReactNode;
  id: string;
  index: number;
  isSelected?: boolean;
  onClick?: (e: SyntheticEvent) => void;
  onMouseDown?: (e: SyntheticEvent) => void;
  onMouseUp?: (e: SyntheticEvent) => void;
  onMouseOver?: (e: SyntheticEvent) => void;
  onMouseOut?: (e: SyntheticEvent) => void;
  debug?: string;
  isLocked: boolean;
  userIsDragging?: boolean;
  forceHover?: boolean;
  indicativeHover?: boolean;
  style?: CSSProperties;
}) => {
  return (
    <Draggable key={id} draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={classNames(styles.DraggableComponent, {
            [styles.isDragging]: snapshot.isDragging,
            [styles.isSelected]: isSelected,
            [styles.userIsDragging]: userIsDragging,
            isLocked,
            forceHover,
            indicativeHover,
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
          {debug}
          {!isSelected ? <div className={styles.overlay}>{label}</div> : null}

          {children}
        </div>
      )}
    </Draggable>
  );
};
