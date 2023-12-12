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

  const props = useComponentProps({
    node,
    areEntitiesFetched,
    resolveDesignValue,
    definition: componentRegistration.definition,
  });

  const Render = builtInComponents[node.data.blockId!] || componentRegistration.component;

  return {
    componentId,
    Render,
    props,
    label: componentRegistration.definition.name,
  };
};
