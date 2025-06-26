import { EntityStore } from '@contentful/experiences-core';
import md5 from 'md5';
import type {
  ComponentPropertyValue,
  ComponentTreeNode,
  DesignValue,
  ExperienceComponentSettings,
  Parameter,
} from '@contentful/experiences-core/types';
import { resolvePrebindingPath, shouldUsePrebinding } from '../../utils/prebindingUtils';
import { PATTERN_PROPERTY_DIVIDER } from '@contentful/experiences-core/constants';

/** While unfolding the pattern definition on the instance, this function will replace all
 * ComponentValue in the definitions tree with the actual value on the instance. */
export const deserializePatternNode = ({
  node,
  componentInstanceVariables,
  componentSettings,
  parameters,
  entityStore,
}: {
  node: ComponentTreeNode;
  componentInstanceVariables: ComponentTreeNode['variables'];
  componentSettings: ExperienceComponentSettings;
  parameters: Record<string, Parameter>;
  entityStore: EntityStore;
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
        parameters: parameters,
        variable: instanceProperty,
      });
      const path = resolvePrebindingPath({
        componentSettings,
        componentValueKey,
        parameters: parameters,
        entityStore,
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
    deserializePatternNode({
      node: child,
      componentInstanceVariables,
      componentSettings,
      parameters,
      entityStore,
    }),
  );

  return {
    definitionId: node.definitionId,
    id: node.id,
    variables,
    children,
    slotId: node.slotId,
    displayName: node.displayName,
    parameters: node.parameters,
  };
};

export const resolvePattern = ({
  node,
  parentParameters,
  patternRootNodeIdsChain,
  entityStore,
}: {
  node: ComponentTreeNode;
  entityStore: EntityStore;
  parentParameters: Record<string, Parameter>;
  patternRootNodeIdsChain: string;
}) => {
  const componentId = node.definitionId as string;
  const assembly = entityStore.usedComponents?.find(
    (component) => component.sys.id === componentId,
  );

  if (!assembly || !('fields' in assembly)) {
    return node;
  }

  const parameters: Record<string, Parameter> = {};

  const allParameters = {
    ...parentParameters,
    ...(node.parameters || {}),
  };

  for (const [parameterKey, parameter] of Object.entries(allParameters)) {
    /**
     * Bubbled up pattern properties are a concatenation of the node id
     * and the pattern property definition id. We need to split them so
     * that the node only uses the pattern property definition id.
     */
    const [hashKey, parameterId] = parameterKey.split(PATTERN_PROPERTY_DIVIDER);

    const hashedNodeChain = md5(patternRootNodeIdsChain || '');

    const isMatchingNode = hashKey === hashedNodeChain;

    if (!isMatchingNode) continue;

    parameters[parameterId] = parameter;
  }

  const componentFields = assembly.fields;

  const deserializedNode = deserializePatternNode({
    node: {
      definitionId: node.definitionId,
      id: node.id,
      variables: node.variables,
      children: componentFields.componentTree.children,
      parameters: parameters,
    },
    componentInstanceVariables: node.variables,
    componentSettings: componentFields.componentSettings!,
    parameters: parameters,
    entityStore,
  });

  entityStore.addAssemblyUnboundValues(componentFields.unboundValues);

  return deserializedNode;
};
