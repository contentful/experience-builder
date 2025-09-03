import React, { useMemo } from 'react';
import { ASSEMBLY_NODE_TYPE } from '@contentful/experiences-core/constants';
import {
  ComponentRegistration,
  ExperienceTreeNode,
  ResolveDesignValueType,
} from '@contentful/experiences-core/types';
import {
  CircularDependencyErrorPlaceholder,
  MissingComponentPlaceholder,
  ImportedComponentErrorBoundary,
} from '@/error-handling';
import styles from './EditorBlock.module.css';
import { useComponentRegistration } from './useComponentRegistration';
import { useComponentProps } from './useComponentProps';
import { EntityStoreBase, splitDirectAndSlotChildren } from '@contentful/experiences-core';

type EditorBlockProps = {
  node: ExperienceTreeNode;
  resolveDesignValue: ResolveDesignValueType;
  wrappingPatternIds?: Set<string>;
  entityStore: EntityStoreBase;
  areEntitiesFetched: boolean;
};

export function EditorBlock({
  node,
  resolveDesignValue,
  wrappingPatternIds: parentWrappingPatternIds = new Set(),
  entityStore,
  areEntitiesFetched,
}: EditorBlockProps) {
  const isRootAssemblyNode = node.type === ASSEMBLY_NODE_TYPE;
  const wrappingPatternIds = useMemo(() => {
    if (isRootAssemblyNode && node.data.blockId) {
      return new Set([node.data.blockId, ...parentWrappingPatternIds]);
    }
    return parentWrappingPatternIds;
  }, [isRootAssemblyNode, node, parentWrappingPatternIds]);

  const componentRegistration = useComponentRegistration(node);

  if (!componentRegistration) {
    return <MissingComponentPlaceholder blockId={node.data.blockId} />;
  }

  if (isRootAssemblyNode && node.data.blockId && parentWrappingPatternIds.has(node.data.blockId)) {
    return <CircularDependencyErrorPlaceholder wrappingPatternIds={wrappingPatternIds} />;
  }

  const { slotNodesMap, directChildNodes } = splitDirectAndSlotChildren(
    node.children,
    componentRegistration.definition,
  );

  const renderChildNode = (childNode: ExperienceTreeNode) => (
    <EditorBlock
      key={childNode.data.id}
      node={childNode}
      resolveDesignValue={resolveDesignValue}
      wrappingPatternIds={wrappingPatternIds}
      entityStore={entityStore}
      areEntitiesFetched={areEntitiesFetched}
    />
  );

  const renderedSlotNodesMap = Object.entries(slotNodesMap).reduce(
    (acc, [slotId, nodes]) => {
      if (nodes?.length) {
        acc[slotId] = <>{nodes.map((slotChildNode) => renderChildNode(slotChildNode))}</>;
      } else {
        acc[slotId] = <div className={styles.emptySlot} />;
      }
      return acc;
    },
    {} as Record<string, React.JSX.Element>,
  );

  const renderedChildren = directChildNodes?.map((childNode) => renderChildNode(childNode));

  return (
    <RegistrationComponent
      node={node}
      resolveDesignValue={resolveDesignValue}
      componentRegistration={componentRegistration}
      slotNodes={renderedSlotNodesMap}
      entityStore={entityStore}
      areEntitiesFetched={areEntitiesFetched}>
      {renderedChildren}
    </RegistrationComponent>
  );
}

type RegistrationComponentProps = {
  node: ExperienceTreeNode;
  resolveDesignValue: ResolveDesignValueType;
  componentRegistration: ComponentRegistration;
  slotNodes?: Record<string, React.JSX.Element>;
  entityStore: EntityStoreBase;
  areEntitiesFetched: boolean;
  children?: React.JSX.Element[];
};
const RegistrationComponent = ({
  node,
  resolveDesignValue,
  componentRegistration,
  slotNodes,
  children,
  entityStore,
  areEntitiesFetched,
}: RegistrationComponentProps) => {
  const { componentProps } = useComponentProps({
    node,
    resolveDesignValue,
    definition: componentRegistration.definition,
    options: componentRegistration.options,
    entityStore,
    areEntitiesFetched,
  });

  return React.createElement(
    ImportedComponentErrorBoundary,
    { componentId: node.data.blockId },
    React.createElement(
      componentRegistration.component,
      { ...componentProps, ...slotNodes },
      // If there are no children, a custom property called `children` can be passed through to the custom component
      ...(children ?? []),
    ),
  );
};
