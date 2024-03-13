import { EntityStoreBase } from '@contentful/experiences-core';
import type {
  ComponentTreeNode,
  ExperienceDataSource,
  ExperienceUnboundValues,
  ExperienceTreeNode,
  ComponentPropertyValue,
  ExperienceFields,
} from '@contentful/experiences-core/types';
import type { Entry } from 'contentful';
import { PATTERN_BLOCK_NODE_TYPE, PATTERN_NODE_TYPE } from '@contentful/experiences-core/constants';
import { patternsRegistry } from '@/store/registries';

export const deserializePatternNode = ({
  node,
  nodeId,
  nodeLocation,
  parentId,
  patternDataSource,
  patternId,
  patternComponentId,
  patternUnboundValues,
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
  patternId: string;
  patternComponentId: string;
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

      // For pattern, we look up the value in the pattern instance and
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

  const isPattern = patternsRegistry.has(node.definitionId);

  const children: ExperienceTreeNode[] = node.children.map((child, childIndex) => {
    const newNodeLocation =
      nodeLocation === null ? `${childIndex}` : nodeLocation + '_' + childIndex;
    return deserializePatternNode({
      node: child,
      nodeId: `${patternComponentId}---${newNodeLocation}`,
      parentId: nodeId,
      nodeLocation: newNodeLocation,
      patternId,
      patternDataSource,
      patternComponentId,
      patternUnboundValues,
      componentInstanceProps,
      componentInstanceUnboundValues,
      componentInstanceDataSource,
    });
  });

  return {
    // separate node type identifiers for patterns and their blocks, so we can treat them differently in as much as we want
    type: isPattern ? PATTERN_NODE_TYPE : PATTERN_BLOCK_NODE_TYPE,
    parentId,
    data: {
      id: nodeId,
      pattern: {
        id: patternId,
        componentId: patternComponentId,
        nodeLocation: nodeLocation || null,
      },
      blockId: node.definitionId,
      props: childNodeVariable,
      dataSource,
      unboundValues,
      breakpoints: [],
    },
    children,
  };
};

export const resolvePattern = ({
  node,
  entityStore,
}: {
  node: ExperienceTreeNode;
  entityStore: EntityStoreBase | null;
}) => {
  if (node.type !== PATTERN_NODE_TYPE) {
    return node;
  }

  const componentId = node.data.blockId as string;
  const pattern = patternsRegistry.get(componentId);

  if (!pattern) {
    console.warn(`Link to pattern with ID '${componentId}' not found`, {
      patternsRegistry,
    });
    return node;
  }

  const componentFields = entityStore?.getValue(pattern, ['fields']) as unknown as ExperienceFields;

  if (!componentFields) {
    console.warn(`Entry for pattern with ID '${componentId}' not found`, { entityStore });
    return node;
  }

  if (!componentFields.componentTree?.children) {
    console.warn(`Component tree for pattern with ID '${componentId}' not found`, {
      componentFields,
    });
  }

  const deserializedNode = deserializePatternNode({
    node: {
      definitionId: node.data.blockId || '',
      variables: {},
      children: componentFields.componentTree?.children ?? [],
    },
    nodeLocation: null,
    nodeId: node.data.id,
    parentId: node.parentId,
    patternDataSource: {},
    patternId: pattern.sys.id,
    patternComponentId: node.data.id,
    patternUnboundValues: componentFields.unboundValues,
    componentInstanceProps: node.data.props,
    componentInstanceUnboundValues: node.data.unboundValues,
    componentInstanceDataSource: node.data.dataSource,
  });

  return deserializedNode;
};
