import React, { useMemo, useRef } from 'react';

import type {
  ExperienceTreeNode,
  ResolveDesignValueType,
} from '@contentful/experiences-core/types';

import useDraggablePosition from '@/hooks/useDraggablePosition';
import { DraggablePosition } from '@/types/constants';

import { useReadOnlyComponent } from '@/hooks/useReadOnlyComponent';

type EditorBlockProps = {
  node: ExperienceTreeNode;
  resolveDesignValue: ResolveDesignValueType;
};

export const ReadOnlyEditorBlock: React.FC<EditorBlockProps> = ({
  node: rawNode,
  resolveDesignValue,
  ...props
}) => {
  const ref = useRef<HTMLElement | null>(null);

  const renderDropzone = (node, props) => {
    return (
      <>
        {node.children.map((childNode) => (
          <ReadOnlyEditorBlock
            key={childNode.data.id}
            node={childNode}
            resolveDesignValue={resolveDesignValue}
            {...props}
          />
        ))}
      </>
    );
  };

  const { componentId, elementToRender } = useReadOnlyComponent({
    node: rawNode,
    resolveDesignValue,
    renderDropzone,
  });

  useDraggablePosition({
    draggableId: componentId,
    draggableRef: ref,
    position: DraggablePosition.MOUSE_POSITION,
  });

  return <>{elementToRender(props)}</>;
};
