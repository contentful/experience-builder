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
import { ContentfulContainer, Assembly } from '@contentful/experience-builder-components';
import { resolveAssembly } from '@/utils/assemblyUtils';
import { componentRegistry, createAssemblyRegistration } from '@/store/registries';
import { useEntityStore } from '@/store/entityStore';
import type { RenderDropzoneFunction } from './Dropzone.types';

type UseComponentProps = {
  node: CompositionComponentNode;
  resolveDesignValue: ResolveDesignValueType;
  renderDropzone: RenderDropzoneFunction;
};

export const useComponent = ({
  node: rawNode,
  resolveDesignValue,
  renderDropzone,
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

  const [props, editorWrapperProps] = useComponentProps({
    node,
    areEntitiesFetched,
    resolveDesignValue,
    renderDropzone,
    definition: componentRegistration.definition,
  });

  // Only pass editor props to built-in components
  const { editorMode, renderDropzone: _renderDropzone, ...componentProps } = props;
  const elementToRender = builtInComponents.includes(node.data.blockId || '') ? (
    <ContentfulContainer {...(props as React.ComponentProps<typeof ContentfulContainer>)} />
  ) : node.type === DESIGN_COMPONENT_NODE_TYPE || node.type === ASSEMBLY_NODE_TYPE ? (
    // Assembly.tsx requires renderDropzone and editorMode as well
    React.createElement(componentRegistration.component, props)
  ) : (
    React.createElement(componentRegistration.component, componentProps)
  );

  return {
    node,
    componentId,
    elementToRender,
    wrapperProps: editorWrapperProps,
    label: componentRegistration.definition.name,
  };
};
