import type {
  ComponentRegistration,
  CompositionComponentNode,
  ResolveDesignValueType,
} from '@contentful/experience-builder-core/types';
import { useMemo } from 'react';
import { useComponentProps } from './useComponentProps';
import { builtInComponents } from '@/types/constants';
import { DESIGN_COMPONENT_NODE_TYPE } from '@contentful/experience-builder-core/constants';
import { DesignComponent } from '@contentful/experience-builder-components';
import { resolveDesignComponent } from '@/utils/designComponentUtils';
import { componentRegistry, createDesignComponentRegistration } from '@/store/registries';
import { useEntityStore } from '@/store/entityStore';

interface ComponentParams {
  node: CompositionComponentNode;
  resolveDesignValue: ResolveDesignValueType;
}

export const useComponent = ({ node: rawNode, resolveDesignValue }: ComponentParams) => {
  const areEntitiesFetched = useEntityStore((state) => state.areEntitiesFetched);
  const entityStore = useEntityStore((state) => state.entityStore);

  const node = useMemo(() => {
    if (rawNode.type === DESIGN_COMPONENT_NODE_TYPE && areEntitiesFetched) {
      return resolveDesignComponent({
        node: rawNode,
        entityStore,
      });
    }

    return rawNode;
  }, [areEntitiesFetched, rawNode, entityStore]);

  const componentRegistration = useMemo(() => {
    const registration = componentRegistry.get(node.data.blockId as string);

    if (node.type === DESIGN_COMPONENT_NODE_TYPE && !registration) {
      return createDesignComponentRegistration({
        definitionId: node.data.blockId as string,
        component: DesignComponent,
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
    definition: componentRegistration.definition,
  });

  const Component = builtInComponents[node.data.blockId!] || componentRegistration.component;

  return {
    node,
    componentId,
    Component,
    props,
    wrapperProps: editorWrapperProps,
    label: componentRegistration.definition.name,
  };
};
