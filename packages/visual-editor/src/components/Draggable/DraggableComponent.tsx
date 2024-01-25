import React, { useMemo, useRef } from 'react';
import { CSSProperties, ReactNode, SyntheticEvent } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import classNames from 'classnames';
import styles from './styles.module.css';
import { Rect, getTooltipPositions } from '@components/Draggable/canvasToolsUtils';

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
  const draggableRef = useRef<HTMLDivElement>(null);

  const previewSize = '100%'; // This should be based on breakpoints and added to usememo dependency array

  const tooltipStyles = useMemo(() => {
    const tooltipRect = tooltipRef.current?.getBoundingClientRect();
    const draggableRect = draggableRef.current?.getBoundingClientRect();

    const newTooltipStyles = getTooltipPositions({
      previewSize,
      tooltipRect,
      coordinates: draggableRect,
    });

    return newTooltipStyles;

    // Ignore eslint because we intentionally want to trigger this whenever a user clicks on a container/component which is tracked by these coordinates of the component being clicked being changed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinates]);

  return (
    <div className={classNames('Draggable', className)} ref={draggableRef}>
      <Draggable key={id} draggableId={id} index={index} isDragDisabled={isDragDisabled}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            {...rest}
            className={classNames(styles.DraggableComponent, {
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
                style={tooltipStyles}
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
    </div>
  );
};
