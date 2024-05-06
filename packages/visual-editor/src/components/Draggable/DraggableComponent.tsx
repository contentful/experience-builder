import React, { useRef } from 'react';
import { CSSProperties, ReactNode, SyntheticEvent } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import classNames from 'classnames';
import styles from './styles.module.css';
import { Rect } from '@components/Draggable/canvasToolsUtils';
import Tooltip from './Tooltip';
import Placeholder, { PlaceholderParams } from './Placeholder';
import {
  ComponentDefinition,
  ComponentDefinitionVariableType,
} from '@contentful/experiences-core/types';
import useDraggablePosition from '@/hooks/useDraggablePosition';
import { DraggablePosition } from '@/types/constants';
import { useDraggedItemStore } from '@/store/draggedItem';

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
  elementToRender: (props?: Record<string, unknown>) => React.ReactElement;
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
  elementToRender,
  children,
  id,
  index,
  isAssemblyBlock = false,
  isSelected = false,
  onClick = () => null,
  onMouseOver = () => null,
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
  const ref = useRef<HTMLElement | null>(null);
  const setDomRect = useDraggedItemStore((state) => state.setDomRect);
  const isHoveredComponent = useDraggedItemStore((state) => state.hoveredComponentId === id);

  useDraggablePosition({
    draggableId: id,
    draggableRef: ref,
    position: DraggablePosition.MOUSE_POSITION,
  });

  return (
    <Draggable
      key={id}
      draggableId={id}
      index={index}
      isDragDisabled={isDragDisabled}
      disableInteractiveElementBlocking>
      {(provided, snapshot) => (
        <>
          {elementToRender({
            dragProps: {
              ...wrapperProps,
              'data-ctfl-draggable-id': id,
              'data-test-id': `draggable-${blockId ?? 'node'}`,
              innerRef: (refNode) => {
                provided?.innerRef(refNode);
                ref.current = refNode;
              },
              ...provided.draggableProps,
              ...provided.dragHandleProps,
              ...rest,
              className: classNames(styles.DraggableComponent, wrapperProps.className, {
                [styles.isAssemblyBlock]: isAssemblyBlock,
                [styles.isDragging]: snapshot?.isDragging,
                [styles.isSelected]: isSelected,
                [styles.userIsDragging]: userIsDragging,
                [styles.isHoveringComponent]: isHoveredComponent,
              }),
              style: {
                ...style,
                ...getStyle(provided.draggableProps.style, snapshot),
              },
              onMouseDown: (e) => {
                if (isDragDisabled) {
                  return;
                }

                e.stopPropagation();
                setDomRect(e.currentTarget.getBoundingClientRect());
              },
              onMouseOver,
              onClick,
              ToolTipAndPlaceHolder: (
                <>
                  <Tooltip
                    id={id}
                    coordinates={coordinates}
                    isAssemblyBlock={isAssemblyBlock}
                    isContainer={isContainer}
                    label={definition.name || 'No label specified'}
                  />
                  <Placeholder {...placeholder} id={id} />
                </>
              ),
            },
          })}

          {/* <div
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
              [styles.isHoveringComponent]: isHoveredComponent,
            })}
            style={{
              ...style,
              ...getStyle(provided.draggableProps.style, snapshot),
            }}
            onMouseDown={(e) => {
              if (isDragDisabled) {
                return;
              }

              e.stopPropagation();
              setDomRect(e.currentTarget.getBoundingClientRect());
            }}
            onMouseOver={onMouseOver}
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
          </div> */}

          {children}
        </>
      )}
    </Draggable>
  );
};
