import React from 'react';
import type {
  ComponentRegistration,
  ExperienceTreeNode,
  ResolveDesignValueType,
} from '@contentful/experiences-core/types';
import { useMemo } from 'react';
import { useComponentProps } from './useComponentProps';
import { ASSEMBLY_NODE_TYPE } from '@contentful/experiences-core/constants';
import { Assembly } from '@contentful/experiences-components-react';
import { resolveAssembly } from '@/utils/assemblyUtils';
import { componentRegistry, createAssemblyRegistration } from '@/store/registries';
import { useEntityStore } from '@/store/entityStore';
import { ImportedComponentErrorBoundary } from '@components/DraggableHelpers/ImportedComponentErrorBoundary';
import { RenderDropzoneFunction } from '@components/DraggableBlock/Dropzone.types';
import { isContentfulStructureComponent } from '@contentful/experiences-core';
import { DragWrapperProps } from '@/types/Config';
import { MissingComponentPlacehoder } from '@components/DraggableHelpers/MissingComponentPlaceholder';

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

  const { componentProps, sizeStyles } = useComponentProps({
    node,
    areEntitiesFetched,
    resolveDesignValue,
    renderDropzone,
    definition: componentRegistration?.definition,
    userIsDragging,
    slotId,
  });

  const elementToRender = (props?: { dragProps?: DragWrapperProps; rest?: unknown }) => {
    if (!componentRegistration) {
      return <MissingComponentPlacehoder blockId={node.data.blockId} />;
    }

    const { dragProps = {} } = props || {};

    const {
      editorMode: _editorMode,
      renderDropzone: _renderDropzone,
      node: _node,
      ...customComponentProps
    } = componentProps;

    const isStructureComponent = isContentfulStructureComponent(node.data.blockId);
    const isAssembly = node.type === 'assembly';
    const modifiedProps =
      isStructureComponent || isAssembly ? componentProps : customComponentProps;

    const requiresDragWrapper =
      !isStructureComponent && componentRegistration.options?.wrapComponent === false;

    const element = React.createElement(
      ImportedComponentErrorBoundary,
      null,
      React.createElement(componentRegistration.component, {
        ...modifiedProps,
        dragProps,
      }),
    );

    if (!requiresDragWrapper) {
      return element;
    }

    const { children, innerRef, Tag = 'div', ToolTipAndPlaceholder, style, ...rest } = dragProps;

    return (
      <Tag
        {...rest}
        style={{ ...style, ...sizeStyles }}
        ref={(refNode: HTMLElement | null) => {
          if (innerRef && refNode) innerRef(refNode);
        }}>
        {ToolTipAndPlaceholder}
        {element}
      </Tag>
    );
  };

  return {
    node,
    componentId,
    elementToRender,
    definition: componentRegistration?.definition,
  };
};
