import { EntityStoreBase } from '@contentful/experiences-core';
import type {
  ComponentTreeNode,
  ExperienceDataSource,
  ExperienceUnboundValues,
  ExperienceTreeNode,
  ComponentPropertyValue,
  ExperienceFields,
  ExperienceComponentSettings,
} from '@contentful/experiences-core/types';
import { deserializePatternVariables } from '@contentful/experiences-core';
import type { Entry } from 'contentful';
import {
  ASSEMBLY_BLOCK_NODE_TYPE,
  ASSEMBLY_NODE_TYPE,
} from '@contentful/experiences-core/constants';
import { assembliesRegistry } from '@/store/registries';

export const checkIsAssemblyEntry = (entry: Entry): boolean => {
  return Boolean(entry.fields?.componentSettings);
};

/** While unfolding the assembly definition on the instance, this function will replace all
 * ComponentValue in the definitions tree with the actual value on the instance. */
export const deserializeAssemblyNode = ({
  node,
  nodeId,
  nodeLocation,
  parentId,
  patternDataSource,
  patternUnboundValues,
  patternVariableDefinitions,
  patternId,
  patternComponentId,
  componentInstanceProps,
  componentInstanceUnboundValues,
  componentInstanceDataSource,
}: {
  node: ComponentTreeNode;
  nodeId: string;
  nodeLocation: string | null;
  parentId?: string;
  patternDataSource: ExperienceDataSource;
  patternUnboundValues: ExperienceUnboundValues;
  patternVariableDefinitions: ExperienceComponentSettings['variableDefinitions'];
  patternId: string;
  patternComponentId: string;
  componentInstanceProps: Record<string, ComponentPropertyValue>;
  componentInstanceUnboundValues: ExperienceUnboundValues;
  componentInstanceDataSource: ExperienceDataSource;
}): ExperienceTreeNode => {
  const { childNodeVariable, dataSource, unboundValues } = deserializePatternVariables({
    nodeVariables: node.variables,
    componentInstanceProps,
    componentInstanceUnboundValues,
    componentInstanceDataSource,
    patternVariableDefinitions,
  });

  const isAssembly = assembliesRegistry.has(node.definitionId);

  const children: ExperienceTreeNode[] = node.children.map((child, childIndex) => {
    const newNodeLocation =
      nodeLocation === null ? `${childIndex}` : nodeLocation + '_' + childIndex;
    return deserializeAssemblyNode({
      node: child,
      nodeId: `${patternComponentId}---${newNodeLocation}`,
      nodeLocation: newNodeLocation,
      parentId: nodeId,
      patternDataSource,
      patternUnboundValues,
      patternVariableDefinitions,
      patternId,
      patternComponentId,
      componentInstanceProps,
      componentInstanceUnboundValues,
      componentInstanceDataSource,
    });
  });

  return {
    // separate node type identifiers for assemblies and their blocks, so we can treat them differently in as much as we want
    type: isAssembly ? ASSEMBLY_NODE_TYPE : ASSEMBLY_BLOCK_NODE_TYPE,
    parentId,
    data: {
      id: nodeId,
      assembly: {
        id: patternId,
        componentId: patternComponentId,
        nodeLocation: nodeLocation || null,
      },
      blockId: node.definitionId,
      slotId: node.slotId,
      displayName: node.displayName,
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
  node: ExperienceTreeNode;
  entityStore: EntityStoreBase | null;
}) => {
  if (node.type !== ASSEMBLY_NODE_TYPE) {
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

  const componentFields = entityStore?.getValue(assembly, [
    'fields',
  ]) as unknown as ExperienceFields;

  if (!componentFields) {
    console.warn(`Entry for assembly with ID '${componentId}' not found`, { entityStore });
    return node;
  }

  if (!componentFields.componentTree?.children) {
    console.warn(`Component tree for assembly with ID '${componentId}' not found`, {
      componentFields,
    });
    return node;
  }

  if (!componentFields.componentSettings?.variableDefinitions) {
    console.warn(`Component settings for assembly with ID '${componentId}' not found`, {
      componentFields,
    });
    return node;
  }

  const deserializedNode = deserializeAssemblyNode({
    node: {
      definitionId: node.data.blockId || '',
      variables: {},
      children: componentFields.componentTree?.children ?? [],
    },
    nodeLocation: null,
    nodeId: node.data.id,
    parentId: node.parentId,
    patternDataSource: {},
    patternId: assembly.sys.id,
    patternComponentId: node.data.id,
    patternUnboundValues: componentFields.unboundValues,
    patternVariableDefinitions: componentFields.componentSettings!.variableDefinitions,
    componentInstanceProps: node.data.props,
    componentInstanceUnboundValues: node.data.unboundValues,
    componentInstanceDataSource: node.data.dataSource,
  });

  return deserializedNode;
};
