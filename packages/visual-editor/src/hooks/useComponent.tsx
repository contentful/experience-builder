import React from 'react';
import type {
  ComponentRegistration,
  ExperienceTreeNode,
  ResolveDesignValueType,
  DragWrapperProps,
} from '@contentful/experiences-core/types';
import { useMemo } from 'react';
import { useComponentProps } from './useComponentProps';
import {
  ASSEMBLY_BLOCK_NODE_TYPE,
  ASSEMBLY_NODE_TYPE,
} from '@contentful/experiences-core/constants';
import { Assembly } from '@contentful/experiences-components-react';
import { componentRegistry, createAssemblyRegistration } from '@/store/registries';
import { useEntityStore } from '@/store/entityStore';
import { ImportedComponentErrorBoundary } from '@components/DraggableHelpers/ImportedComponentErrorBoundary';
import { RenderDropzoneFunction } from '@components/DraggableBlock/Dropzone.types';
import { isContentfulStructureComponent } from '@contentful/experiences-core';
import { MissingComponentPlaceholder } from '@components/DraggableHelpers/MissingComponentPlaceholder';
import { useTreeStore } from '@/store/tree';
import { getItem } from '@/utils/getItem';

type UseComponentProps = {
  node: ExperienceTreeNode;
  resolveDesignValue: ResolveDesignValueType;
  renderDropzone: RenderDropzoneFunction;
  userIsDragging: boolean;
};

export const useComponent = ({
  node,
  resolveDesignValue,
  renderDropzone,
  userIsDragging,
}: UseComponentProps) => {
  const areEntitiesFetched = useEntityStore((state) => state.areEntitiesFetched);
  const tree = useTreeStore((state) => state.tree);

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
        `Component registration not found for component with id: "${node.data.blockId}". The registered component might have been removed from the code. To proceed, remove the component manually from the layers tab.`,
      );
      return undefined;
    }
    return registration;
  }, [node]);

  const componentId = node.data.id;
  const isPatternNode = node.type === ASSEMBLY_NODE_TYPE;
  const isPatternComponent = node.type === ASSEMBLY_BLOCK_NODE_TYPE;
  const parentComponentNode = getItem({ id: node.parentId! }, tree);
  const isNestedPattern =
    isPatternNode &&
    [ASSEMBLY_BLOCK_NODE_TYPE, ASSEMBLY_NODE_TYPE].includes(parentComponentNode?.type ?? '');
  const isStructureComponent = isContentfulStructureComponent(node.data.blockId);
  const requiresDragWrapper =
    !isPatternNode && !isStructureComponent && !componentRegistration?.options?.wrapComponent;

  const { componentProps, wrapperStyles } = useComponentProps({
    node,
    areEntitiesFetched,
    resolveDesignValue,
    renderDropzone,
    definition: componentRegistration?.definition,
    options: componentRegistration?.options,
    userIsDragging,
    requiresDragWrapper,
  });

  const elementToRender = (props?: { dragProps?: DragWrapperProps; rest?: unknown }) => {
    if (!componentRegistration) {
      return <MissingComponentPlaceholder blockId={node.data.blockId} />;
    }

    const { dragProps = {} } = props || {};

    const element = React.createElement(
      ImportedComponentErrorBoundary,
      { componentId: node.data.blockId },
      React.createElement(componentRegistration.component, {
        ...componentProps,
        dragProps,
      }),
    );

    if (!requiresDragWrapper) {
      return element;
    }

    const { children, innerRef, Tag = 'div', ToolTipAndPlaceholder, style, ...rest } = dragProps;
    const {
      'data-cf-node-block-id': dataCfNodeBlockId,
      'data-cf-node-block-type': dataCfNodeBlockType,
      'data-cf-node-id': dataCfNodeId,
    } = componentProps;

    return (
      <Tag
        {...rest}
        style={{ ...style, ...wrapperStyles }}
        ref={(refNode: HTMLElement | null) => {
          if (innerRef && refNode) innerRef(refNode);
        }}
        data-cf-node-id={dataCfNodeId}
        data-cf-node-block-id={dataCfNodeBlockId}
        data-cf-node-block-type={dataCfNodeBlockType}>
        {ToolTipAndPlaceholder}
        {element}
      </Tag>
    );
  };

  return {
    node,
    parentComponentNode,
    isAssembly: isPatternNode,
    isPatternNode,
    isPatternComponent,
    isNestedPattern,
    componentId,
    elementToRender,
    definition: componentRegistration?.definition,
  };
};
