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
import useCenterDraggablePosition from '@/hooks/useCenterDraggablePosition';

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
  const ref = useRef<HTMLElement | undefined | null>(null);

  useCenterDraggablePosition({
    draggableId: id,
    draggableRef: ref,
  });

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
