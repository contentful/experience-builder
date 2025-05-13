import { EntityStore, mergeDesignValuesByBreakpoint } from '@contentful/experiences-core';
import md5 from 'md5';
import type {
  ComponentPropertyValue,
  ComponentTreeNode,
  DesignValue,
  ExperienceComponentSettings,
  PatternProperty,
} from '@contentful/experiences-core/types';
import { resolvePrebindingPath, shouldUsePrebinding } from '../../utils/prebindingUtils';
import { PATTERN_PROPERTY_DIVIDER } from '@contentful/experiences-core/constants';

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
        variables[variableName] = mergeDesignValuesByBreakpoint(
          defaultValue as DesignValue,
          instanceProperty,
        );
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
    patternProperties: node.patternProperties,
  };
};

export const resolveAssembly = ({
  node,
  parentPatternProperties,
  patternRootNodeIdsChain,
  entityStore,
}: {
  node: ComponentTreeNode;
  entityStore: EntityStore;
  parentPatternProperties: Record<string, PatternProperty>;
  patternRootNodeIdsChain: string;
}) => {
  const componentId = node.definitionId as string;
  const assembly = entityStore.usedComponents?.find(
    (component) => component.sys.id === componentId,
  );

  if (!assembly || !('fields' in assembly)) {
    return node;
  }

  const patternProperties: Record<string, PatternProperty> = {};

  const allPatternProperties = {
    ...parentPatternProperties,
    ...(node.patternProperties || {}),
  };

  for (const [patternPropertyKey, patternProperty] of Object.entries(allPatternProperties)) {
    /**
     * Bubbled up pattern properties are a concatenation of the node id
     * and the pattern property definition id. We need to split them so
     * that the node only uses the pattern property definition id.
     */
    const [hashKey, patternPropertyDefinitionId] =
      patternPropertyKey.split(PATTERN_PROPERTY_DIVIDER);

    const hashedNodeChain = md5(patternRootNodeIdsChain || '');

    const isMatchingNode = hashKey === hashedNodeChain;

    if (!isMatchingNode) continue;

    patternProperties[patternPropertyDefinitionId] = patternProperty;
  }

  const componentFields = assembly.fields;

  const deserializedNode = deserializeAssemblyNode({
    node: {
      definitionId: node.definitionId,
      id: node.id,
      variables: node.variables,
      children: componentFields.componentTree.children,
      patternProperties,
    },
    componentInstanceVariables: node.variables,
    componentSettings: componentFields.componentSettings!,
    patternProperties,
  });

  entityStore.addAssemblyUnboundValues(componentFields.unboundValues);

  return deserializedNode;
};
