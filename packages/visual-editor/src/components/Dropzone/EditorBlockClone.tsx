import React, { CSSProperties } from 'react';
import styles from '../Draggable/styles.module.css';
import { useComponent } from './useComponent';
import type {
  CompositionComponentNode,
  ResolveDesignValueType,
} from '@contentful/experiences-core/types';
import { RenderDropzoneFunction } from './Dropzone.types';
import { DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd';
import { useDraggedItemStore } from '@/store/draggedItem';

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
  const userIsDragging = useDraggedItemStore((state) => state.isDraggingOnCanvas);

  const { definition, wrapperProps } = useComponent({
    node: rawNode,
    resolveDesignValue,
    renderDropzone,
    userIsDragging,
  });

  return (
    <div
      ref={provided?.innerRef}
      {...wrapperProps}
      {...provided?.draggableProps}
      {...provided?.dragHandleProps}
      className={styles.componentCard}
      style={getStyle(provided?.draggableProps.style, snapshot)}>
      {definition.name}
    </div>
  );
};
