import React from 'react';
import type {
  ComponentRegistration,
  ExperienceTreeNode,
  ResolveDesignValueType,
} from '@contentful/experiences-core/types';
import { useMemo } from 'react';
import { useComponentProps } from './useComponentProps';
import { builtInComponents } from '@/types/constants';
import { ASSEMBLY_NODE_TYPE } from '@contentful/experiences-core/constants';
import { Assembly } from '@contentful/experiences-components-react';
import { resolveAssembly } from '@/utils/assemblyUtils';
import { componentRegistry, createAssemblyRegistration } from '@/store/registries';
import { useEntityStore } from '@/store/entityStore';
import type { RenderDropzoneFunction } from './Dropzone.types';
import { NoWrapDraggableProps } from '@components/Draggable/DraggableChildComponent';
import { ImportedComponentErrorBoundary } from './ImportedComponentErrorBoundary';

type UseComponentProps = {
  node: ExperienceTreeNode;
  resolveDesignValue: ResolveDesignValueType;
  renderDropzone: RenderDropzoneFunction;
  userIsDragging: boolean;
  slotId?: string;
};

export const useComponent = ({
  node: rawNode,
  resolveDesignValue,
  renderDropzone,
  userIsDragging,
  slotId,
}: UseComponentProps) => {
  const areEntitiesFetched = useEntityStore((state) => state.areEntitiesFetched);
  const entityStore = useEntityStore((state) => state.entityStore);

  const node = useMemo(() => {
    if (rawNode.type === ASSEMBLY_NODE_TYPE && areEntitiesFetched) {
      return resolveAssembly({
        node: rawNode,
        entityStore,
      });
    }

    return rawNode;
  }, [areEntitiesFetched, rawNode, entityStore]);

  const componentRegistration: ComponentRegistration | undefined = useMemo(() => {
    let registration = componentRegistry.get(node.data.blockId!);

    if (node.type === ASSEMBLY_NODE_TYPE && !registration) {
      registration = createAssemblyRegistration({
        definitionId: node.data.blockId!,
        component: Assembly,
      });
    }

    if (!registration) {
      console.warn(
        `Component registration not found for component with id: "${node.data.blockId}". The component might of been removed. To proceed, remove the component manually from the layers tab.`,
      );
      return undefined;
    }
    return registration;
  }, [node]);

  const componentId = node.data.id;

  const { componentProps, wrapperProps } = useComponentProps({
    node,
    areEntitiesFetched,
    resolveDesignValue,
    renderDropzone,
    definition: componentRegistration?.definition,
    userIsDragging,
    slotId,
  });

  // Only pass editor props to built-in components
  const { editorMode, renderDropzone: _renderDropzone, ...otherComponentProps } = componentProps;
  const createElementToRender = (componentRegistration: ComponentRegistration) => {
    if (builtInComponents.includes(node.data.blockId || '')) {
      // eslint-disable-next-line react/display-name
      return (dragProps?: NoWrapDraggableProps) =>
        React.createElement(componentRegistration.component, {
          ...dragProps,
          ...componentProps,
        });
    }

    if (node.type === ASSEMBLY_NODE_TYPE) {
      // Assembly.tsx requires renderDropzone and editorMode as well
      // eslint-disable-next-line react/display-name
      return () => React.createElement(componentRegistration.component, componentProps);
    }

    // eslint-disable-next-line react/display-name
    return () =>
      React.createElement(
        ImportedComponentErrorBoundary,
        null,
        React.createElement(componentRegistration.component, otherComponentProps),
      );
  };

  const elementToRender = componentRegistration
    ? createElementToRender(componentRegistration)
    : null;

  return {
    isComponentMissing: !componentRegistration,
    node,
    componentId,
    elementToRender,
    wrapperProps,
    definition: componentRegistration?.definition,
  };
};
