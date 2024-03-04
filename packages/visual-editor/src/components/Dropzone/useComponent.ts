import React from 'react';
import type {
  ComponentRegistration,
  CompositionComponentNode,
  ResolveDesignValueType,
} from '@contentful/experience-builder-core/types';
import { useMemo } from 'react';
import { useComponentProps } from './useComponentProps';
import { builtInComponents } from '@/types/constants';
import {
  DESIGN_COMPONENT_NODE_TYPE,
  ASSEMBLY_NODE_TYPE,
} from '@contentful/experience-builder-core/constants';
import { Assembly } from '@contentful/experience-builder-components';
import { resolveAssembly } from '@/utils/assemblyUtils';
import { componentRegistry, createAssemblyRegistration } from '@/store/registries';
import { useEntityStore } from '@/store/entityStore';
import type { RenderDropzoneFunction } from './Dropzone.types';
import { NoWrapDraggableProps } from '@components/Draggable/DraggableChildComponent';

type UseComponentProps = {
  node: CompositionComponentNode;
  resolveDesignValue: ResolveDesignValueType;
  renderDropzone: RenderDropzoneFunction;
  userIsDragging: boolean;
};

export const useComponent = ({
  node: rawNode,
  resolveDesignValue,
  renderDropzone,
  userIsDragging,
}: UseComponentProps) => {
  const areEntitiesFetched = useEntityStore((state) => state.areEntitiesFetched);
  const entityStore = useEntityStore((state) => state.entityStore);

  const node = useMemo(() => {
    if (
      (rawNode.type === DESIGN_COMPONENT_NODE_TYPE || rawNode.type === ASSEMBLY_NODE_TYPE) &&
      areEntitiesFetched
    ) {
      return resolveAssembly({
        node: rawNode,
        entityStore,
      });
    }

    return rawNode;
  }, [areEntitiesFetched, rawNode, entityStore]);

  const componentRegistration = useMemo(() => {
    const registration = componentRegistry.get(node.data.blockId as string);

    if (
      (node.type === DESIGN_COMPONENT_NODE_TYPE || node.type === ASSEMBLY_NODE_TYPE) &&
      !registration
    ) {
      return createAssemblyRegistration({
        definitionId: node.data.blockId as string,
        component: Assembly,
      }) as ComponentRegistration;
    } else if (!registration) {
      console.warn(`[exp-builder.sdk] Component registration not found for ${node.data.blockId}`);
    }
    return registration as ComponentRegistration;
  }, [node]);

  const componentId = node.data.id;

  const { componentProps, wrapperProps } = useComponentProps({
    node,
    areEntitiesFetched,
    resolveDesignValue,
    renderDropzone,
    definition: componentRegistration.definition,
    userIsDragging,
  });

  // Only pass editor props to built-in components
  const { editorMode, renderDropzone: _renderDropzone, ...otherComponentProps } = componentProps;
  const elementToRender = builtInComponents.includes(node.data.blockId || '')
    ? (dragProps?: NoWrapDraggableProps) =>
        React.createElement(componentRegistration.component, { ...dragProps, ...componentProps })
    : node.type === DESIGN_COMPONENT_NODE_TYPE || node.type === ASSEMBLY_NODE_TYPE
      ? // Assembly.tsx requires renderDropzone and editorMode as well
        () => React.createElement(componentRegistration.component, componentProps)
      : () => React.createElement(componentRegistration.component, otherComponentProps);

  return {
    node,
    componentId,
    elementToRender,
    wrapperProps,
    definition: componentRegistration.definition,
  };
};
