import React, { CSSProperties } from 'react';
import styles from '../Draggable/styles.module.css';
import { useComponent } from './useComponent';
import type {
  ExperienceTreeNode,
  ResolveDesignValueType,
  RenderDropzoneFunction,
} from '@contentful/experiences-core/types';
import { DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd';
import { useDraggedItemStore } from '@/store/draggedItem';
import {
  ASSEMBLY_BLOCK_NODE_TYPE,
  CONTENTFUL_COMPONENTS,
} from '@contentful/experiences-core/constants';
import classNames from 'classnames';

function getStyle(style: CSSProperties = {}, snapshot?: DraggableStateSnapshot) {
  if (!snapshot?.isDropAnimating) {
    return style;
  }

  return {
    ...style,
    // cannot be 0, but make it super tiny
    transitionDuration: `0.001s`,
  };
}

type EditorBlockCloneProps = {
  node: ExperienceTreeNode;
  resolveDesignValue: ResolveDesignValueType;
  provided?: DraggableProvided;
  snapshot?: DraggableStateSnapshot;
  renderDropzone: RenderDropzoneFunction;
};

export const EditorBlockClone: React.FC<EditorBlockCloneProps> = ({
  node: rawNode,
  resolveDesignValue,
  snapshot,
  provided,
  renderDropzone,
}) => {
  const userIsDragging = useDraggedItemStore((state) => state.isDraggingOnCanvas);

  const { node, wrapperProps, elementToRender } = useComponent({
    node: rawNode,
    resolveDesignValue,
    renderDropzone,
    userIsDragging,
  });

  const isAssemblyBlock = node.type === ASSEMBLY_BLOCK_NODE_TYPE;
  const isSingleColumn = node.data.blockId === CONTENTFUL_COMPONENTS.singleColumn.id;

  if (isSingleColumn) {
    return elementToRender();
  }

  return (
    <div
      ref={provided?.innerRef}
      data-ctfl-dragging-element
      {...wrapperProps}
      {...provided?.draggableProps}
      {...provided?.dragHandleProps}
      className={classNames(
        styles.DraggableComponent,
        wrapperProps.className,
        styles.DraggableClone,
        {
          [styles.isAssemblyBlock]: isAssemblyBlock,
          [styles.isDragging]: snapshot?.isDragging,
        },
      )}
      style={getStyle(provided?.draggableProps.style, snapshot)}>
      {elementToRender()}
    </div>
  );
};
