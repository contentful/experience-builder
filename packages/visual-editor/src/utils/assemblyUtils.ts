import { EntityStoreBase } from '@contentful/experience-builder-core';
import type {
  CompositionNode,
  CompositionDataSource,
  CompositionUnboundValues,
  CompositionComponentNode,
  CompositionComponentPropValue,
  Composition,
} from '@contentful/experience-builder-core/types';
import type { Entry } from 'contentful';

import {
  DESIGN_COMPONENT_NODE_TYPE,
  ASSEMBLY_BLOCK_NODE_TYPE,
  ASSEMBLY_NODE_TYPE,
} from '@contentful/experience-builder-core/constants';
import { generateRandomId } from '@contentful/experience-builder-core';
import { assembliesRegistry } from '@/store/registries';

export const checkIsAssemblyEntry = (entry: Entry): boolean => {
  return Boolean(entry.fields?.componentSettings);
};

export const deserializeAssemblyNode = ({
  node,
  nodeId,
  parentId,
  assemblyDataSource,
  assemblyUnboundValues,
  componentInstanceProps,
  componentInstanceUnboundValues,
  componentInstanceDataSource,
}: {
  node: CompositionNode;
  nodeId: string;
  parentId?: string;
  assemblyDataSource: CompositionDataSource;
  assemblyUnboundValues: CompositionUnboundValues;
  componentInstanceProps: Record<string, CompositionComponentPropValue>;
  componentInstanceUnboundValues: CompositionUnboundValues;
  componentInstanceDataSource: CompositionDataSource;
}): CompositionComponentNode => {
  const childNodeVariable: Record<string, CompositionComponentPropValue> = {};
  const dataSource: CompositionDataSource = {};
  const unboundValues: CompositionUnboundValues = {};

  for (const [variableName, variable] of Object.entries(node.variables)) {
    childNodeVariable[variableName] = variable;
    if (variable.type === 'ComponentValue') {
      const componentValueKey = variable.key;
      const instanceProperty = componentInstanceProps[componentValueKey];

      // For assembly, we look up the value in the assembly instance and
      // replace the componentValue with that one.
      if (instanceProperty?.type === 'UnboundValue') {
        const componentInstanceValue = componentInstanceUnboundValues[instanceProperty.key];
        unboundValues[instanceProperty.key] = componentInstanceValue;
        childNodeVariable[variableName] = {
          type: 'UnboundValue',
          key: instanceProperty.key,
        };
      } else if (instanceProperty?.type === 'BoundValue') {
        const [, dataSourceKey] = instanceProperty.path.split('/');
        const componentInstanceValue = componentInstanceDataSource[dataSourceKey];
        dataSource[dataSourceKey] = componentInstanceValue;
        childNodeVariable[variableName] = {
          type: 'BoundValue',
          path: instanceProperty.path,
        };
      }
    }
  }

  const isAssembly = assembliesRegistry.has(node.definitionId);

  const children: CompositionComponentNode[] = node.children.map((child) =>
    deserializeAssemblyNode({
      node: child,
      nodeId: generateRandomId(16),
      parentId: nodeId,
      assemblyDataSource,
      assemblyUnboundValues,
      componentInstanceProps,
      componentInstanceUnboundValues,
      componentInstanceDataSource,
    })
  );

  return {
    // separate node type identifiers for assemblies and their blocks, so we can treat them differently in as much as we want
    type: isAssembly ? ASSEMBLY_NODE_TYPE : ASSEMBLY_BLOCK_NODE_TYPE,
    parentId,
    data: {
      id: nodeId,
      blockId: node.definitionId,
      props: childNodeVariable,
      dataSource,
      unboundValues,
      breakpoints: [],
    },
    children,
  };
};

export const resolveAssembly = ({
  node,
  entityStore,
}: {
  node: CompositionComponentNode;
  entityStore: EntityStoreBase | null;
}) => {
  if (node.type !== DESIGN_COMPONENT_NODE_TYPE && node.type !== ASSEMBLY_NODE_TYPE) {
    return node;
  }

  const componentId = node.data.blockId as string;
  const assembly = assembliesRegistry.get(componentId);

  if (!assembly) {
    console.warn(`Link to assembly with ID '${componentId}' not found`, {
      assembliesRegistry,
    });
    return node;
  }

  const componentFields = entityStore?.getValue(assembly, ['fields']) as unknown as Composition;

  if (!componentFields) {
    console.warn(`Entry for assembly with ID '${componentId}' not found`, { entityStore });
    return node;
  }

  if (!componentFields.componentTree?.children) {
    console.warn(`Component tree for assembly with ID '${componentId}' not found`, {
      componentFields,
    });
  }

  const deserializedNode = deserializeAssemblyNode({
    node: {
      definitionId: node.data.blockId || '',
      variables: {},
      children: componentFields.componentTree?.children ?? [],
    },
    nodeId: node.data.id,
    parentId: node.parentId,
    assemblyDataSource: {},
    assemblyUnboundValues: componentFields.unboundValues,
    componentInstanceProps: node.data.props,
    componentInstanceUnboundValues: node.data.unboundValues,
    componentInstanceDataSource: node.data.dataSource,
  });

  return deserializedNode;
};
