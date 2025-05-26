import React, { useMemo } from 'react';
import { useTreeStore } from '@/store/tree';
import { ROOT_ID } from '@/types/constants';
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

type NodeBlockProps = {
  node: ExperienceTreeNode;
  resolveDesignValue: ResolveDesignValueType;
  wrappingPatternIds?: Set<string>;
};

export function EditorBlock({
  node,
  resolveDesignValue,
  wrappingPatternIds: parentWrappingPatternIds = new Set(),
}: NodeBlockProps) {
  const tree = useTreeStore((state) => state.tree);
  const isRootAssemblyNode = node.type === ASSEMBLY_NODE_TYPE;

  const wrappingPatternIds = useMemo(() => {
    // On the top level, the node is not defined. If the root blockId is not the default string,
    // we assume that it is the entry ID of the experience/ pattern to properly detect circular dependencies
    if (!node && tree.root.data.blockId && tree.root.data.blockId !== ROOT_ID) {
      return new Set([tree.root.data.blockId, ...parentWrappingPatternIds]);
    }
    if (isRootAssemblyNode && node.data.blockId) {
      return new Set([node.data.blockId, ...parentWrappingPatternIds]);
    }
    return parentWrappingPatternIds;
  }, [isRootAssemblyNode, node, parentWrappingPatternIds, tree.root.data.blockId]);

  const componentRegistration = useComponentRegistration(node);

  if (!componentRegistration) {
    return <MissingComponentPlaceholder blockId={node.data.blockId} />;
  }

  if (isRootAssemblyNode && node.data.blockId && parentWrappingPatternIds.has(node.data.blockId)) {
    return (
      <CircularDependencyErrorPlaceholder node={node} wrappingPatternIds={wrappingPatternIds} />
    );
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
          />
        ))
    : null;

  return (
    <RegistrationComponent
      node={node}
      resolveDesignValue={resolveDesignValue}
      componentRegistration={componentRegistration}
      slotNodes={slotNodes}>
      {children}
    </RegistrationComponent>
  );
}

type RegistrationComponentProps = React.PropsWithChildren<{
  node: ExperienceTreeNode;
  resolveDesignValue: ResolveDesignValueType;
  componentRegistration: ComponentRegistration;
  slotNodes?: Record<string, React.JSX.Element>;
}>;
const RegistrationComponent = ({
  node,
  resolveDesignValue,
  componentRegistration,
  slotNodes,
  children,
}: RegistrationComponentProps) => {
  const { componentProps } = useComponentProps({
    node,
    resolveDesignValue,
    definition: componentRegistration.definition,
    options: componentRegistration.options,
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
