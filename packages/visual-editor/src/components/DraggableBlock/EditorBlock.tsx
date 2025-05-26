import React from 'react';
import { useComponent } from '@/hooks/useComponent';
import type {
  ExperienceTreeNode,
  ResolveDesignValueType,
} from '@contentful/experiences-core/types';
import { RenderDropzoneFunction } from './Dropzone.types';

type EditorBlockProps = {
  node: ExperienceTreeNode;
  resolveDesignValue: ResolveDesignValueType;
  renderDropzone: RenderDropzoneFunction;
  wrappingPatternIds: Set<string>;
};

export const EditorBlock: React.FC<EditorBlockProps> = ({
  node: rawNode,
  resolveDesignValue,
  renderDropzone,
  wrappingPatternIds,
}) => {
  const { elementToRender } = useComponent({
    node: rawNode,
    resolveDesignValue,
    renderDropzone,
    wrappingPatternIds,
  });
  return elementToRender();
};
