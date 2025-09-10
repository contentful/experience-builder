import { EntityStore, mergeDesignValuesByBreakpoint } from '@contentful/experiences-core';
import type {
  ComponentPropertyValue,
  ComponentTreeNode,
  DesignValue,
  ExperienceComponentSettings,
  Parameter,
  ParameterDefinition,
} from '@contentful/experiences-core/types';
import { resolvePrebindingPath, shouldUsePrebinding } from '../../utils/prebindingUtils';

/** While unfolding the pattern definition on the instance, this function will replace all
 * ComponentValue in the definitions tree with the actual value on the instance. */
export const deserializePatternNode = ({
  node,
  componentInstanceVariables,
  componentSettings,
  entityStore,
  rootPatternParameters,
}: {
  node: ComponentTreeNode;
  componentInstanceVariables: ComponentTreeNode['variables'];
  componentSettings: ExperienceComponentSettings;
  entityStore: EntityStore;
  rootPatternParameters: Record<string, Parameter>;
}): ComponentTreeNode => {
  const variables: Record<string, ComponentPropertyValue> = {};

  const prebindingDefinition = componentSettings.prebindingDefinitions?.[0] ?? {
    parameterDefinitions: {},
  };
  const parameterDefinitions = prebindingDefinition.parameterDefinitions;

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
        parameters: rootPatternParameters,
      });
      const path = resolvePrebindingPath({
        componentSettings,
        componentValueKey,
        parameters: rootPatternParameters,
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
        throw new Error(
          `Unexpected NoValue for variable "${variableName}" when deserializing pattern "${node.definitionId}". ` +
            `This can only happen if you created experience in pre-release version of prebinding and experience contains NoValue properties. ` +
            `Resave experience to fix this issue.`,
        );
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
          defaultValue as DesignValue | undefined,
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

  const hoistingInstructionsByNodeId: Record<
    string,
    Array<{
      hoistedParameterId: string;
      hoistingInstruction: NonNullable<ParameterDefinition['passToNodes']>[0];
    }>
  > = {};
  for (const [parameterId, parameterDefinition] of Object.entries(parameterDefinitions)) {
    if (Array.isArray(parameterDefinition.passToNodes) && parameterDefinition.passToNodes.length) {
      const [hoistingInstruction] = parameterDefinition.passToNodes;
      const savedHoistingInstructions =
        hoistingInstructionsByNodeId[hoistingInstruction.nodeId] || [];
      savedHoistingInstructions.push({ hoistedParameterId: parameterId, hoistingInstruction });
      hoistingInstructionsByNodeId[hoistingInstruction.nodeId] = savedHoistingInstructions;
    }
  }

  const children: ComponentTreeNode[] = node.children.map((child) => {
    const childNodeParameters: Record<string, Parameter> = {};

    const hoistedParametersFromChildNode = hoistingInstructionsByNodeId[child.id!] || [];

    for (const { hoistedParameterId, hoistingInstruction } of hoistedParametersFromChildNode) {
      if (rootPatternParameters[hoistedParameterId]) {
        childNodeParameters[hoistingInstruction.parameterId] =
          rootPatternParameters[hoistedParameterId];
      }
    }

    if (Object.keys(childNodeParameters).length) {
      Object.assign(child, {
        parameters: childNodeParameters,
      });
    }

    return deserializePatternNode({
      node: child,
      componentInstanceVariables,
      componentSettings,
      entityStore,
      rootPatternParameters,
    });
  });

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
  entityStore,
}: {
  node: ComponentTreeNode;
  entityStore: EntityStore;
}) => {
  const componentId = node.definitionId as string;
  const patternEntry = entityStore.usedComponents?.find(
    (component) => component.sys.id === componentId,
  );

  if (!patternEntry || !('fields' in patternEntry)) {
    return node;
  }

  const componentFields = patternEntry.fields;

  const deserializedNode = deserializePatternNode({
    node: {
      definitionId: node.definitionId,
      id: node.id,
      variables: node.variables,
      children: componentFields.componentTree.children,
      parameters: node.parameters,
    },
    componentInstanceVariables: node.variables,
    componentSettings: componentFields.componentSettings!,
    entityStore,
    rootPatternParameters: node.parameters ?? {},
  });

  entityStore.addAssemblyUnboundValues(componentFields.unboundValues);

  return deserializedNode;
};
