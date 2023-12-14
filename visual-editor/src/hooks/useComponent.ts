import { useEditorStore } from '@/store/editor';
import {
  ComponentRegistration,
  CompositionComponentNode,
} from '@contentful/experience-builder-core';
import { useMemo } from 'react';
import { ResolveDesignValueType } from './useBreakpoints';
import { useComponentProps } from './useComponentProps';
import { builtInComponents } from '@/shared/utils/constants';

interface ComponentParams {
  node: CompositionComponentNode;
  resolveDesignValue: ResolveDesignValueType;
  areEntitiesFetched: boolean;
}

export const useComponent = ({ node, resolveDesignValue, areEntitiesFetched }: ComponentParams) => {
  const componentRegistry = useEditorStore((state) => state.componentRegistry);

  const componentRegistration = useMemo(() => {
    const id = node.data.blockId as string;

    return componentRegistry.get(id) as ComponentRegistration;
  }, [node]);

  const componentId = node.data.id;

  const [props, editorWrapperProps] = useComponentProps({
    node,
    areEntitiesFetched,
    resolveDesignValue,
    definition: componentRegistration.definition,
  });

  const Component = builtInComponents[node.data.blockId!] || componentRegistration.component;

  return {
    componentId,
    Component,
    props,
    wrapperProps: editorWrapperProps,
    label: componentRegistration.definition.name,
  };
};
