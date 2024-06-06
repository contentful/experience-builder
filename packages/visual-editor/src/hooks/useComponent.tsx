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
import type { RenderDropzoneFunction } from './Dropzone.types';
// import { NoWrapDraggableProps } from '@components/Draggable/DraggableChildComponent';
import { ImportedComponentErrorBoundary } from './ImportedComponentErrorBoundary';
import { DragWrapper, DragWrapperProps } from './DragWrapper';

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

  const { componentProps, wrapperProps } = useComponentProps({
    node,
    areEntitiesFetched,
    resolveDesignValue,
    renderDropzone,
    definition: componentRegistration.definition,
    userIsDragging,
  });

  const elementToRender = (props?: { dragProps?: DragWrapperProps; rest?: unknown }) => {
    const { dragProps = {}, ...rest } = props || {};

    if (isStructuralOrPatternComponent()) {
      const element = React.createElement(componentRegistration.component, {
        ...rest,
        ...componentProps,
        dragProps,
      });
      return element;
    } else {
      // Don't pass editor props to custom components
      const {
        editorMode: _editorMode,
        renderDropzone: _renderDropzone,
        node: _node,
        ...customComponentProps
      } = componentProps;

      const requiresDragWrapper = !componentRegistration.options?.wrapComponent;

      const element = React.createElement(
        ImportedComponentErrorBoundary,
        null,
        React.createElement(componentRegistration.component, {
          ...customComponentProps,
          dragProps,
        }),
      );

      return (
        <DragWrapper wrapComponent={requiresDragWrapper} {...dragProps}>
          {element}
        </DragWrapper>
      );
    }

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
    wrapperProps,
    definition: componentRegistration.definition,
  };
};
