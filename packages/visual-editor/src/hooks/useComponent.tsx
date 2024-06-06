import React from 'react';
import type {
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
import { ImportedComponentErrorBoundary } from '@components/DraggableHelpers/ImportedComponentErrorBoundary';
import { DragWrapper, DragWrapperProps } from '@components/DraggableHelpers/DragWrapper';
import { RenderDropzoneFunction } from '@components/DraggableBlock/Dropzone.types';

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

  const componentRegistration = useMemo(() => {
    let registration = componentRegistry.get(node.data.blockId!);

    if (node.type === ASSEMBLY_NODE_TYPE && !registration) {
      registration = createAssemblyRegistration({
        definitionId: node.data.blockId!,
        component: Assembly,
      });
    }

    if (!registration) {
      throw Error(
        `Component registration not found for component with id: "${node.data.blockId}". The component might of been removed. To proceed, remove the component manually from the layers tab.`,
      );
    }
    return registration;
  }, [node]);

  const componentId = node.data.id;

  const { componentProps } = useComponentProps({
    node,
    areEntitiesFetched,
    resolveDesignValue,
    renderDropzone,
    definition: componentRegistration.definition,
    userIsDragging,
    slotId,
  });

  const elementToRender = (props?: { dragProps?: DragWrapperProps; rest?: unknown }) => {
    const { dragProps = {} } = props || {};

    const {
      editorMode: _editorMode,
      renderDropzone: _renderDropzone,
      node: _node,
      ...customComponentProps
    } = componentProps;

    const modifiedProps = isStructuralOrPatternComponent() ? componentProps : customComponentProps;

    const requiresDragWrapper = !componentRegistration.options?.wrapComponent;

    const element = React.createElement(
      ImportedComponentErrorBoundary,
      null,
      React.createElement(componentRegistration.component, {
        ...modifiedProps,
        dragProps,
      }),
    );

    if (isStructuralOrPatternComponent()) {
      return element;
    }

    return (
      <DragWrapper wrapComponent={requiresDragWrapper} {...dragProps}>
        {element}
      </DragWrapper>
    );

    function isStructuralOrPatternComponent() {
      return (
        builtInComponents.includes(node.data.blockId || '') || node.type === ASSEMBLY_NODE_TYPE
      );
    }
  };

  return {
    node,
    componentId,
    elementToRender,
    definition: componentRegistration.definition,
  };
};
