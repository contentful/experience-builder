import { checkIsAssemblyNode, EntityStore } from '@contentful/experiences-core';
import type {
  ComponentPropertyValue,
  ComponentTreeNode,
  DesignValue,
  ExperienceComponentSettings,
  PatternProperty,
} from '@contentful/experiences-core/types';
import { resolvePrebindingPath, shouldUsePrebinding } from '../../utils/prebindingUtils';

/** While unfolding the assembly definition on the instance, this function will replace all
 * ComponentValue in the definitions tree with the actual value on the instance. */
export const deserializeAssemblyNode = ({
  node,
  componentInstanceVariables,
  componentSettings,
  patternProperties,
}: {
  node: ComponentTreeNode;
  componentInstanceVariables: ComponentTreeNode['variables'];
  componentSettings: ExperienceComponentSettings;
  patternProperties: Record<string, PatternProperty>;
}): ComponentTreeNode => {
  const variables: Record<string, ComponentPropertyValue> = {};

  for (const [variableName, variable] of Object.entries(node.variables)) {
    variables[variableName] = variable;
    if (variable.type === 'ComponentValue') {
      const componentValueKey = variable.key;
      const instanceProperty = componentInstanceVariables[componentValueKey];
      const variableDefinition = componentSettings.variableDefinitions?.[componentValueKey];
      const defaultValue = variableDefinition?.defaultValue;

      const usePrebinding = shouldUsePrebinding({
        componentSettings,
        componentValueKey,
        patternProperties,
        variable: instanceProperty,
      });
      const path = resolvePrebindingPath({
        componentSettings,
        componentValueKey,
        patternProperties,
      });

      if (usePrebinding && path) {
        variables[variableName] = {
          type: 'BoundValue',
          path,
        };

        // For assembly, we look up the variable in the assembly instance and
        // replace the ComponentValue with that one.
      } else if (instanceProperty?.type === 'UnboundValue') {
        variables[variableName] = {
          type: 'UnboundValue',
          key: instanceProperty.key,
        };
      } else if (instanceProperty?.type === 'NoValue') {
        variables[variableName] = instanceProperty;
      } else if (instanceProperty?.type === 'BoundValue') {
        variables[variableName] = {
          type: 'BoundValue',
          path: instanceProperty.path,
        };
      } else if (instanceProperty?.type === 'HyperlinkValue') {
        variables[variableName] = {
          type: 'HyperlinkValue',
          linkTargetKey: instanceProperty.linkTargetKey,
        };
      } else if (instanceProperty?.type === 'DesignValue') {
        variables[variableName] = {
          type: 'DesignValue',
          valuesByBreakpoint: instanceProperty.valuesByBreakpoint,
        };
      } else if (!instanceProperty && defaultValue) {
        // So far, we only automatically fallback to the defaultValue for design properties
        if (variableDefinition.group === 'style') {
          variables[variableName] = {
            type: 'DesignValue',
            valuesByBreakpoint: (defaultValue as DesignValue).valuesByBreakpoint,
          };
        }
      }
    }
  }

  const children: ComponentTreeNode[] = node.children.map((child) =>
    deserializeAssemblyNode({
      node: child,
      componentInstanceVariables,
      componentSettings,
      patternProperties,
    }),
  );

  return {
    definitionId: node.definitionId,
    id: node.id,
    variables,
    children,
    slotId: node.slotId,
    displayName: node.displayName,
  };
};

export const resolveAssembly = ({
  node,
  parentPatternProperties,
  entityStore,
}: {
  node: ComponentTreeNode;
  entityStore: EntityStore;
  parentPatternProperties: Record<string, PatternProperty>;
}) => {
  const isAssembly = checkIsAssemblyNode({
    componentId: node.definitionId,
    usedComponents: entityStore.usedComponents,
  });

  if (!isAssembly) {
    return node;
  }

  const componentId = node.definitionId as string;
  const assembly = entityStore.usedComponents?.find(
    (component) => component.sys.id === componentId,
  );

  if (!assembly || !('fields' in assembly)) {
    return node;
  }

  node.patternProperties = {
    ...(node.patternProperties || {}),
    ...(parentPatternProperties || {}),
  };

  const componentFields = assembly.fields;

  const deserializedNode = deserializeAssemblyNode({
    node: {
      definitionId: node.definitionId,
      id: node.id,
      variables: node.variables,
      children: componentFields.componentTree.children,
    },
    componentInstanceVariables: node.variables,
    componentSettings: componentFields.componentSettings!,
    patternProperties: node.patternProperties || {},
  });

  entityStore.addAssemblyUnboundValues(componentFields.unboundValues);

  return deserializedNode;
};
