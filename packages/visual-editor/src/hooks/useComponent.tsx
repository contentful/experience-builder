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
import { ImportedComponentErrorBoundary } from '@components/DraggableHelpers/ImportedComponentErrorBoundary';
import { RenderDropzoneFunction } from '@components/DraggableBlock/Dropzone.types';
import {
  isContentfulStructureComponent,
  entityCacheStore,
  EntityStoreBase,
} from '@contentful/experiences-core';
import { MissingComponentPlaceholder } from '@components/DraggableHelpers/MissingComponentPlaceholder';
import { useTreeStore } from '@/store/tree';
import { getItem } from '@/utils/getItem';
import { CircularDependencyErrorPlaceholder } from '@components/DraggableHelpers/CircularDependencyErrorPlaceholder';
import { Entry } from 'contentful';
import { useStore } from 'zustand';

type UseComponentProps = {
  node: ExperienceTreeNode;
  entityStore: EntityStoreBase;
  resolveDesignValue: ResolveDesignValueType;
  renderDropzone: RenderDropzoneFunction;
  userIsDragging: boolean;
  wrappingPatternIds: Set<string>;
};

export const useComponent = ({
  node,
  entityStore,
  resolveDesignValue,
  renderDropzone,
  userIsDragging,
  wrappingPatternIds,
}: UseComponentProps) => {
  useStore(entityCacheStore, (state) => state.areEntitiesFetched);
  const areEntitiesFetched = useStore(entityCacheStore, (state) => state.areEntitiesFetched);
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
    entityStore,
    areEntitiesFetched,
    resolveDesignValue,
    renderDropzone,
    definition: componentRegistration?.definition,
    options: componentRegistration?.options,
    userIsDragging,
    requiresDragWrapper,
  });

  const elementToRender = (props?: { dragProps?: DragWrapperProps; rest?: unknown }) => {
    const { dragProps = {} } = props || {};
    const { children, innerRef, Tag = 'div', ToolTipAndPlaceholder, style, ...rest } = dragProps;
    const {
      'data-cf-node-block-id': dataCfNodeBlockId,
      'data-cf-node-block-type': dataCfNodeBlockType,
      'data-cf-node-id': dataCfNodeId,
    } = componentProps;
    const refCallback = (refNode: HTMLElement | null) => {
      if (innerRef && refNode) innerRef(refNode);
    };

    if (!componentRegistration) {
      return <MissingComponentPlaceholder blockId={node.data.blockId} />;
    }

    if (node.data.blockId && wrappingPatternIds.has(node.data.blockId)) {
      return (
        <CircularDependencyErrorPlaceholder
          ref={refCallback}
          data-cf-node-id={dataCfNodeId}
          data-cf-node-block-id={dataCfNodeBlockId}
          data-cf-node-block-type={dataCfNodeBlockType}
          wrappingPatternIds={wrappingPatternIds}
        />
      );
    }

    // const services = {
    //   hello() {
    //     console.log('hello');
    //   },
    //   getEntityStore() {
    //     return entityStore;
    //   },
    //   entityStore, // TODO: should we expose it here or just use getter?
    //   resolveLinksUpToLevel3(shallowEntry: Entry): Entry {
    //     const resolvedEntry = structuredClone(shallowEntry);
    //     for (const [field, fieldValue] of Object.entries(resolvedEntry.fields)) {
    //       if (fieldValue && fieldValue.sys?.type === 'Link') {
    //         const resolvedEntryOrAsset = entityStore.getEntryOrAsset(fieldValue, ''); // no need for field, as it is only for deep binding
    //         if (resolvedEntryOrAsset) {
    //           resolvedEntry.fields[field] = resolvedEntryOrAsset;
    //         }
    //       }
    //     }
    //     return resolvedEntry;
    //   },
    // };

    const element = React.createElement(
      ImportedComponentErrorBoundary,
      { componentId: node.data.blockId },
      React.createElement(componentRegistration.component, {
        ...componentProps,
        dragProps,
        // services,
      }),
    );

    if (!requiresDragWrapper) {
      return element;
    }

    return (
      <Tag
        {...rest}
        style={{ ...style, ...wrapperStyles }}
        ref={refCallback}
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
