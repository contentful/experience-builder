import { checkIfDesignComponent } from '@contentful/experience-builder-core';
import type {
  CompositionComponentPropValue,
  CompositionNode,
} from '@contentful/experience-builder-core/types';
import { EntityStore } from './EntityStore';

export const deserializeDesignComponentNode = ({
  node,
  componentInstanceVariables,
}: {
  node: CompositionNode;
  componentInstanceVariables: CompositionNode['variables'];
}): CompositionNode => {
  const variables: Record<string, CompositionComponentPropValue> = {};

  for (const [variableName, variable] of Object.entries(node.variables)) {
    variables[variableName] = variable;
    if (variable.type === 'ComponentValue') {
      const componentValueKey = variable.key;
      const instanceProperty = componentInstanceVariables[componentValueKey];

      // For design component, we look up the variable in the design component instance and
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

  const children: CompositionNode[] = node.children.map((child) =>
    deserializeDesignComponentNode({
      node: child,
      componentInstanceVariables,
    })
  );

  return {
    definitionId: node.definitionId,
    variables,
    children,
  };
};

export const resolveDesignComponent = ({
  node,
  entityStore,
}: {
  node: CompositionNode;
  entityStore: EntityStore | undefined;
}) => {
  const isDesignComponent = checkIfDesignComponent({
    componentId: node.definitionId,
    usedComponents: entityStore?.usedComponents,
  });

  if (!isDesignComponent) {
    return node;
  }

  const componentId = node.definitionId as string;
  const designComponent = entityStore?.experienceEntryFields?.usedComponents?.find(
    (component) => component.sys.id === componentId
  );

  if (!designComponent || !('fields' in designComponent)) {
    return node;
  }

  const componentFields = designComponent.fields;

  const deserializedNode = deserializeDesignComponentNode({
    node: {
      definitionId: node.definitionId,
      variables: {},
      children: componentFields.componentTree.children,
    },
    componentInstanceVariables: node.variables,
  });

  entityStore?.updateUnboundValues(componentFields.unboundValues);

  return deserializedNode;
};
