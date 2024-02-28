import React from 'react';
import styles from '../Draggable/styles.module.css';
import { useComponent } from './useComponent';
import type {
  CompositionComponentNode,
  ResolveDesignValueType,
} from '@contentful/experience-builder-core/types';
import { RenderDropzoneFunction } from './Dropzone.types';
import { DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd';
import classNames from 'classnames';
import {
  ASSEMBLY_BLOCK_NODE_TYPE,
  CONTENTFUL_COMPONENTS,
} from '@contentful/experience-builder-core/constants';

function getStyle(style = {}, snapshot?: DraggableStateSnapshot) {
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
  node: CompositionComponentNode;
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
  const { node, wrapperProps, elementToRender } = useComponent({
    node: rawNode,
    resolveDesignValue,
    renderDropzone,
  });

  const isAssemblyBlock = node.type === ASSEMBLY_BLOCK_NODE_TYPE;
  const isSingleColumn = node.data.blockId === CONTENTFUL_COMPONENTS.singleColumn.id;

  if (isSingleColumn) {
    return elementToRender();
  }

  return (
    <div
      ref={provided?.innerRef}
      {...wrapperProps}
      {...provided?.draggableProps}
      {...provided?.dragHandleProps}
      className={classNames(styles.DraggableComponent, wrapperProps.className, {
        [styles.isAssemblyBlock]: isAssemblyBlock,
        [styles.isDragging]: snapshot?.isDragging,
      })}
      style={getStyle(provided?.draggableProps.style, snapshot)}>
      {elementToRender()}
    </div>
  );
};
