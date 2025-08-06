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
import { EntityStoreBase } from '@contentful/experiences-core';

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

  const slotNodes: Record<string, React.JSX.Element> = {};
  for (const slotId in componentRegistration.definition.slots) {
    const nodes = node.children.filter((child) => child.data.slotId === slotId);
    slotNodes[slotId] =
      nodes.length === 0 ? (
        <div className={styles.emptySlot} />
      ) : (
        <>
          {nodes.map((slotChildNode) => (
            <EditorBlock
              key={slotChildNode.data.id}
              node={slotChildNode}
              resolveDesignValue={resolveDesignValue}
              wrappingPatternIds={wrappingPatternIds}
              entityStore={entityStore}
              areEntitiesFetched={areEntitiesFetched}
            />
          ))}
        </>
      );
  }

  const children = componentRegistration.definition.children
    ? node.children
        .filter((node) => node.data.slotId === undefined)
        .map((childNode) => (
          <EditorBlock
            key={childNode.data.id}
            node={childNode}
            resolveDesignValue={resolveDesignValue}
            wrappingPatternIds={wrappingPatternIds}
            entityStore={entityStore}
            areEntitiesFetched={areEntitiesFetched}
          />
        ))
    : null;

  return (
    <RegistrationComponent
      node={node}
      resolveDesignValue={resolveDesignValue}
      componentRegistration={componentRegistration}
      slotNodes={slotNodes}
      entityStore={entityStore}
      areEntitiesFetched={areEntitiesFetched}>
      {children}
    </RegistrationComponent>
  );
}

type RegistrationComponentProps = React.PropsWithChildren<{
  node: ExperienceTreeNode;
  resolveDesignValue: ResolveDesignValueType;
  componentRegistration: ComponentRegistration;
  slotNodes?: Record<string, React.JSX.Element>;
  entityStore: EntityStoreBase;
  areEntitiesFetched: boolean;
}>;
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
      children,
    ),
  );
};
