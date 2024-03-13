import React from 'react';
import type {
  ComponentRegistration,
  ExperienceTreeNode,
  ResolveDesignValueType,
} from '@contentful/experiences-core/types';
import { useMemo } from 'react';
import { useComponentProps } from './useComponentProps';
import { builtInComponents } from '@/types/constants';
import { PATTERN_NODE_TYPE } from '@contentful/experiences-core/constants';
import { Pattern } from '@contentful/experiences-components-react';
import { resolvePattern } from '@/utils/patternUtils';
import { componentRegistry, createPatternRegistration } from '@/store/registries';
import { useEntityStore } from '@/store/entityStore';
import type { RenderDropzoneFunction } from './Dropzone.types';
import { NoWrapDraggableProps } from '@components/Draggable/DraggableChildComponent';

type UseComponentProps = {
  node: ExperienceTreeNode;
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
    if (rawNode.type === PATTERN_NODE_TYPE && areEntitiesFetched) {
      return resolvePattern({
        node: rawNode,
        entityStore,
      });
    }

    return rawNode;
  }, [areEntitiesFetched, rawNode, entityStore]);

  const componentRegistration = useMemo(() => {
    const registration = componentRegistry.get(node.data.blockId as string);

    if (node.type === PATTERN_NODE_TYPE && !registration) {
      return createPatternRegistration({
        definitionId: node.data.blockId as string,
        component: Pattern,
      }) as ComponentRegistration;
    } else if (!registration) {
      console.warn(
        `[experiences-sdk-react] Component registration not found for ${node.data.blockId}`,
      );
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
    : node.type === PATTERN_NODE_TYPE
      ? // Pattern.tsx requires renderDropzone and editorMode as well
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
