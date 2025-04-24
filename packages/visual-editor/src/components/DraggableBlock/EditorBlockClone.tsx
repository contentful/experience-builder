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
import { ASSEMBLY_BLOCK_NODE_TYPE } from '@contentful/experiences-core/constants';
import classNames from 'classnames';
import { EntityStoreBase } from '@contentful/experiences-core';

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
  entityStore: EntityStoreBase;
  resolveDesignValue: ResolveDesignValueType;
  provided?: DraggableProvided;
  snapshot?: DraggableStateSnapshot;
  renderDropzone: RenderDropzoneFunction;
  wrappingPatternIds: Set<string>;
};

export const EditorBlockClone: React.FC<EditorBlockCloneProps> = ({
  node: rawNode,
  entityStore,
  resolveDesignValue,
  snapshot,
  provided,
  renderDropzone,
  wrappingPatternIds,
}) => {
  const userIsDragging = useDraggedItemStore((state) => state.isDraggingOnCanvas);

  const { node, elementToRender } = useComponent({
    node: rawNode,
    entityStore,
    resolveDesignValue,
    renderDropzone,
    userIsDragging,
    wrappingPatternIds,
  });

  const isAssemblyBlock = node.type === ASSEMBLY_BLOCK_NODE_TYPE;

  return elementToRender({
    dragProps: {
      ...provided?.draggableProps,
      ...provided?.dragHandleProps,
      'data-ctfl-dragging-element': 'true',
      innerRef: provided?.innerRef,
      className: classNames(styles.DraggableComponent, styles.DraggableClone, {
        [styles.isAssemblyBlock]: isAssemblyBlock,
        [styles.isDragging]: snapshot?.isDragging,
      }),
      style: getStyle(provided?.draggableProps.style, snapshot),
    },
  });
};
