import React, { CSSProperties } from 'react';
import styles from './styles.module.css';
import { useComponent } from '@/hooks/useComponent';
import type {
  ExperienceTreeNode,
  ResolveDesignValueType,
} from '@contentful/experiences-core/types';
import { RenderDropzoneFunction } from './Dropzone.types';
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

  const { node, elementToRender } = useComponent({
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
      {...provided?.draggableProps}
      {...provided?.dragHandleProps}
      className={classNames(styles.DraggableComponent, styles.DraggableClone, {
        [styles.isAssemblyBlock]: isAssemblyBlock,
        [styles.isDragging]: snapshot?.isDragging,
      })}
      style={getStyle(provided?.draggableProps.style, snapshot)}>
      {elementToRender()}
    </div>
  );
};
