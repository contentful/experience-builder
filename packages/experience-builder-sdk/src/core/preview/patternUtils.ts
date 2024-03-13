import { checkIsPatternNode, EntityStore } from '@contentful/experiences-core';
import type { ComponentPropertyValue, ComponentTreeNode } from '@contentful/experiences-core/types';

export const deserializePatternNode = ({
  node,
  componentInstanceVariables,
}: {
  node: ComponentTreeNode;
  componentInstanceVariables: ComponentTreeNode['variables'];
}): ComponentTreeNode => {
  const variables: Record<string, ComponentPropertyValue> = {};

  for (const [variableName, variable] of Object.entries(node.variables)) {
    variables[variableName] = variable;
    if (variable.type === 'ComponentValue') {
      const componentValueKey = variable.key;
      const instanceProperty = componentInstanceVariables[componentValueKey];

      // For pattern, we look up the variable in the pattern instance and
      // replace the componentValue with that one.
      if (instanceProperty?.type === 'UnboundValue') {
        variables[variableName] = {
          type: 'UnboundValue',
          key: instanceProperty.key,
        };
      } else if (instanceProperty?.type === 'BoundValue') {
        variables[variableName] = {
          type: 'BoundValue',
          path: instanceProperty.path,
        };
      }
    }
  }

  const children: ComponentTreeNode[] = node.children.map((child) =>
    deserializePatternNode({
      node: child,
      componentInstanceVariables,
    }),
  );

  return {
    definitionId: node.definitionId,
    variables,
    children,
  };
};

export const resolvePattern = ({
  node,
  entityStore,
}: {
  node: ComponentTreeNode;
  entityStore: EntityStore;
}) => {
  const isPattern = checkIsPatternNode({
    componentId: node.definitionId,
    usedComponents: entityStore.usedComponents,
  });

  if (!isPattern) {
    return node;
  }

  const componentId = node.definitionId as string;
  const pattern = entityStore.experienceEntryFields?.usedComponents?.find(
    (component) => component.sys.id === componentId,
  );

  if (!pattern || !('fields' in pattern)) {
    return node;
  }

  const componentFields = pattern.fields;

  const deserializedNode = deserializePatternNode({
    node: {
      definitionId: node.definitionId,
      variables: {},
      children: componentFields.componentTree.children,
    },
    componentInstanceVariables: node.variables,
  });

  entityStore.addPatternUnboundValues(componentFields.unboundValues);

  return deserializedNode;
};
