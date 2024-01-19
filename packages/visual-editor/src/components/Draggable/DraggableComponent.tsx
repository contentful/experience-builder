import React, { useMemo, useRef } from 'react';
import { CSSProperties, ReactNode, SyntheticEvent } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import classNames from 'classnames';
import styles from './styles.module.css';
import { Rect, getTooltipPositions } from '@components/Draggable/canvasToolsUtils';
// import { css } from 'emotion';

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
  const tooltipRef = useRef<HTMLDivElement>(null);
  const tooltipStyles = useMemo(() => {
    const tooltipRect = tooltipRef.current?.getBoundingClientRect();
    const previewSize = '100%'; // This should be based on breakpoints
    const newTooltipStyles = getTooltipPositions({ previewSize, tooltipRect, coordinates });

    // return css(newTooltipStyles);
  }, [coordinates, previewSize]);

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
              ref={tooltipRef}
              className={classNames(styles.overlay, {
                [styles.overlayContainer]: isContainer,
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
