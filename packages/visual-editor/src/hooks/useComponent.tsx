import React from 'react';
import type {
  ComponentRegistration,
  ExperienceTreeNode,
  ResolveDesignValueType,
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
import { MissingComponentPlaceholder } from '@components/DraggableHelpers/MissingComponentPlaceholder';
import { useTreeStore } from '@/store/tree';
import { getItem } from '@/utils/getItem';
import { CircularDependencyErrorPlaceholder } from '@components/DraggableHelpers/CircularDependencyErrorPlaceholder';
import { isContentfulStructureComponent } from '@contentful/experiences-core';

type UseComponentProps = {
  node: ExperienceTreeNode;
  resolveDesignValue: ResolveDesignValueType;
  renderDropzone: RenderDropzoneFunction;
  wrappingPatternIds: Set<string>;
};

export const useComponent = ({
  node,
  resolveDesignValue,
  renderDropzone,
  wrappingPatternIds,
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
  const isStructureComponent = isContentfulStructureComponent(node.data.blockId);
  const isPatternNode = node.type === ASSEMBLY_NODE_TYPE;
  const isPatternComponent = node.type === ASSEMBLY_BLOCK_NODE_TYPE;
  const parentComponentNode = getItem({ id: node.parentId! }, tree);
  const isNestedPattern =
    isPatternNode &&
    [ASSEMBLY_BLOCK_NODE_TYPE, ASSEMBLY_NODE_TYPE].includes(parentComponentNode?.type ?? '');

  const { componentProps } = useComponentProps({
    node,
    areEntitiesFetched,
    resolveDesignValue,
    renderDropzone,
    definition: componentRegistration?.definition,
    options: componentRegistration?.options,
  });

  const elementToRender = () => {
    const {
      'data-cf-node-block-id': dataCfNodeBlockId,
      'data-cf-node-block-type': dataCfNodeBlockType,
      'data-cf-node-id': dataCfNodeId,
    } = componentProps;

    if (!componentRegistration) {
      return <MissingComponentPlaceholder blockId={node.data.blockId} />;
    }

    if (node.data.blockId && wrappingPatternIds.has(node.data.blockId)) {
      return (
        <CircularDependencyErrorPlaceholder
          data-cf-node-id={dataCfNodeId}
          data-cf-node-block-id={dataCfNodeBlockId}
          data-cf-node-block-type={dataCfNodeBlockType}
          wrappingPatternIds={wrappingPatternIds}
        />
      );
    }

    const {
      editorMode: _editorMode,
      renderDropzone: _renderDropzone,
      node: _node,
      ...customComponentProps
    } = componentProps;
    const modifiedProps =
      isStructureComponent || isPatternNode ? componentProps : customComponentProps;

    const element = React.createElement(
      ImportedComponentErrorBoundary,
      { componentId: node.data.blockId },
      React.createElement(componentRegistration.component, modifiedProps),
    );

    return element;
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
