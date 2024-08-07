import { EntityStoreBase } from '@contentful/experiences-core';
import type {
  ComponentTreeNode,
  ExperienceDataSource,
  ExperienceUnboundValues,
  ExperienceTreeNode,
  ComponentPropertyValue,
  ExperienceFields,
  ExperienceComponentSettings,
  DesignValue,
} from '@contentful/experiences-core/types';
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
  assemblyDataSource,
  assemblyUnboundValues,
  assemblyVariableDefinitions,
  assemblyId,
  assemblyComponentId,
  componentInstanceProps,
  componentInstanceUnboundValues,
  componentInstanceDataSource,
}: {
  node: ComponentTreeNode;
  nodeId: string;
  nodeLocation: string | null;
  parentId?: string;
  assemblyDataSource: ExperienceDataSource;
  assemblyUnboundValues: ExperienceUnboundValues;
  assemblyVariableDefinitions: ExperienceComponentSettings['variableDefinitions'];
  assemblyId: string;
  assemblyComponentId: string;
  componentInstanceProps: Record<string, ComponentPropertyValue>;
  componentInstanceUnboundValues: ExperienceUnboundValues;
  componentInstanceDataSource: ExperienceDataSource;
}): ExperienceTreeNode => {
  const childNodeVariable: Record<string, ComponentPropertyValue> = {};
  const dataSource: ExperienceDataSource = {};
  const unboundValues: ExperienceUnboundValues = {};

  for (const [variableName, variable] of Object.entries(node.variables)) {
    childNodeVariable[variableName] = variable;
    if (variable.type === 'ComponentValue') {
      const componentValueKey = variable.key;
      const instanceProperty = componentInstanceProps[componentValueKey];
      const variableDefinition = assemblyVariableDefinitions?.[componentValueKey];
      const defaultValue = variableDefinition?.defaultValue;

      // For assembly, we look up the value in the assembly instance and
      // replace the componentValue with that one.
      if (instanceProperty?.type === 'UnboundValue') {
        const componentInstanceValue = componentInstanceUnboundValues[instanceProperty.key];
        unboundValues[instanceProperty.key] = componentInstanceValue;
        childNodeVariable[variableName] = instanceProperty;
      } else if (instanceProperty?.type === 'BoundValue') {
        const [, dataSourceKey] = instanceProperty.path.split('/');
        const componentInstanceValue = componentInstanceDataSource[dataSourceKey];
        dataSource[dataSourceKey] = componentInstanceValue;
        childNodeVariable[variableName] = instanceProperty;
      } else if (instanceProperty?.type === 'HyperlinkValue') {
        const componentInstanceValue = componentInstanceDataSource[instanceProperty.linkTargetKey];
        dataSource[instanceProperty.linkTargetKey] == componentInstanceValue;
        childNodeVariable[variableName] = instanceProperty;
      } else if (instanceProperty?.type === 'DesignValue') {
        childNodeVariable[variableName] = instanceProperty;
      } else if (!instanceProperty && defaultValue) {
        // So far, we only automatically fallback to the defaultValue for design properties
        if (variableDefinition.group === 'style') {
          childNodeVariable[variableName] = defaultValue as DesignValue;
        }
      }
    }
  }

  const isAssembly = assembliesRegistry.has(node.definitionId);

  const children: ExperienceTreeNode[] = node.children.map((child, childIndex) => {
    const newNodeLocation =
      nodeLocation === null ? `${childIndex}` : nodeLocation + '_' + childIndex;
    return deserializeAssemblyNode({
      node: child,
      nodeId: `${assemblyComponentId}---${newNodeLocation}`,
      nodeLocation: newNodeLocation,
      parentId: nodeId,
      assemblyDataSource,
      assemblyUnboundValues,
      assemblyVariableDefinitions,
      assemblyId,
      assemblyComponentId,
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
        id: assemblyId,
        componentId: assemblyComponentId,
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
    assemblyDataSource: {},
    assemblyId: assembly.sys.id,
    assemblyComponentId: node.data.id,
    assemblyUnboundValues: componentFields.unboundValues,
    assemblyVariableDefinitions: componentFields.componentSettings!.variableDefinitions,
    componentInstanceProps: node.data.props,
    componentInstanceUnboundValues: node.data.unboundValues,
    componentInstanceDataSource: node.data.dataSource,
  });

  return deserializedNode;
};
