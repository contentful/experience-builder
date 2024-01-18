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
  label,
  userIsDragging,
  style,
  className,
  isRootZone,
  isContainer,
  isHovering,
  isDragDisabled = false,
  ...rest
}: {
  className?: string;
  label: string;
  children: ReactNode;
  id: string;
  index: number;
  isSelected?: boolean;
  isRootZone: boolean;
  isContainer: boolean;
  isHovering: boolean;
  onClick?: (e: SyntheticEvent) => void;
  onMouseDown?: (e: SyntheticEvent) => void;
  onMouseUp?: (e: SyntheticEvent) => void;
  onMouseOver?: (e: SyntheticEvent) => void;
  onMouseOut?: (e: SyntheticEvent) => void;
  userIsDragging?: boolean;
  style?: CSSProperties;
  isDragDisabled?: boolean;
}) => {
  console.log('ID', id);
  console.log('IS CONTAINRER', isContainer);
  console.log('ISHOVERING', isHovering);
  return (
    <Draggable key={id} draggableId={id} index={index} isDragDisabled={isDragDisabled}>
      {(provided, snapshot) => {
        const Child = (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            {...rest}
            className={classNames(styles.DraggableComponent, className, {
              [styles.isDragging]: snapshot.isDragging,
              [styles.isSelected]: isSelected,
              [styles.userIsDragging]: userIsDragging,
            })}
            style={{
              ...style,
              ...provided.draggableProps.style,
              position: 'relative',
              zIndex: 1000,
            }}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onClick={onClick}>
            {!isSelected && (
              <div className={isContainer ? styles.overlayContainer : styles.overlay}>{label}</div>
            )}
            {/* {!isSelected ? <div className={styles.overlay}>{'VERY LONG LONG TEXT'}</div> : null} */}
            {children}
          </div>
        );

        // if(snapshot.isDragging) {
        //   // do portal stuff
        //   console.log("CREATE PROTAL", document.querySelector('#chaseId')!)
        //   return ReactDOM.createPortal(Child, document.querySelector('#chaseId')!)
        // }

        return Child;
      }}
    </Draggable>
  );
};
