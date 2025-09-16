import {
  checkIsAssemblyNode,
  EntityStore,
  mergeDesignValuesByBreakpoint,
} from '@contentful/experiences-core';
import type {
  ComponentPropertyValue,
  ComponentTreeNode,
  DesignValue,
  ExperienceComponentSettings,
  Parameter,
} from '@contentful/experiences-core/types';
import { resolvePrebindingPath, shouldUsePrebinding } from '../../utils/prebindingUtils';
import { PrebindingManager } from './PrebindingManager';

type ComponentTreeNodeWithPatternInformation = ComponentTreeNode & {
  pattern?: {
    parentPatternNodeId: string;
    nodeIdOnPattern: string;
    prefixedNodeId: string;
  };
};

/** While unfolding the pattern definition on the instance, this function will replace all
 * ComponentValue in the definitions tree with the actual value on the instance. */
export const deserializePatternNode = ({
  node,
  rootPatternVariables,
  componentSettings,
  entityStore,
  rootPatternParameters,
  parentPatternRootNodeIdsChain,
}: {
  node: ComponentTreeNode;
  rootPatternVariables: ComponentTreeNode['variables'];
  componentSettings: ExperienceComponentSettings;
  entityStore: EntityStore;
  rootPatternParameters: Record<string, Parameter>;
  parentPatternRootNodeIdsChain: string[];
}): ComponentTreeNodeWithPatternInformation => {
  const variables: Record<string, ComponentPropertyValue> = {};

  const parentPatternNodeId = parentPatternRootNodeIdsChain.slice(-1)[0];

  for (const [variableName, variable] of Object.entries(node.variables)) {
    variables[variableName] = variable;
    if (variable.type === 'ComponentValue') {
      const componentValueKey = variable.key;
      const instanceProperty = rootPatternVariables[componentValueKey];
      const variableDefinition = componentSettings.variableDefinitions?.[componentValueKey];
      const defaultValue = variableDefinition?.defaultValue;

      const usePrebinding = shouldUsePrebinding({
        componentSettings,
        componentValueKey,
        parameters: rootPatternParameters,
        patternRootNodeIdsChain: parentPatternRootNodeIdsChain,
      });
      const path = resolvePrebindingPath({
        componentSettings,
        componentValueKey,
        parameters: rootPatternParameters,
        entityStore,
        patternRootNodeIdsChain: parentPatternRootNodeIdsChain,
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
      } else if (instanceProperty?.type === 'ComponentValue') {
        if (!usePrebinding) {
          // @ts-expect-error ignore for now
          variables[variableName] = defaultValue;
        }
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

  const children: ComponentTreeNode[] = node.children.map((child) => {
    const isPatternNode = checkIsAssemblyNode({
      componentId: child.definitionId,
      usedComponents: entityStore.usedComponents,
    });

    if (isPatternNode) {
      return deserializePatternNode({
        node: child,
        rootPatternVariables,
        componentSettings,
        entityStore,
        rootPatternParameters,
        parentPatternRootNodeIdsChain,
      });
    }

    return deserializePatternNode({
      node: child,
      rootPatternVariables,
      componentSettings,
      entityStore,
      rootPatternParameters,
      parentPatternRootNodeIdsChain,
    });
  });

  const indexedNodeId = [parentPatternRootNodeIdsChain.join('---'), node.id!].join('-');

  return {
    definitionId: node.definitionId,
    id: node.id,
    variables,
    children,
    pattern: {
      nodeIdOnPattern: node.id!,
      parentPatternNodeId: parentPatternNodeId,
      prefixedNodeId: indexedNodeId,
    },
    slotId: node.slotId,
    displayName: node.displayName,
    parameters: node.parameters,
  };
};

export const resolvePattern = ({
  node,
  entityStore,
  parentPatternRootNodeIdsChain,
  rootPatternParameters,
}: {
  node: ComponentTreeNode;
  entityStore: EntityStore;
  parentPatternRootNodeIdsChain: string[];
  rootPatternParameters: Record<string, Parameter>;
}): ComponentTreeNodeWithPatternInformation => {
  const componentId = node.definitionId as string;
  const patternEntry = entityStore.usedComponents?.find(
    (component) => component.sys.id === componentId,
  );

  if (!patternEntry || !('fields' in patternEntry)) {
    return node;
  }

  const componentFields = patternEntry.fields;
  const parameters = rootPatternParameters;
  let nodeParameters: Record<string, Parameter> | undefined;

  if (rootPatternParameters) {
    nodeParameters = {};
    const prebindingDefinitions = componentFields.componentSettings?.prebindingDefinitions ?? [];
    const indexedNodeId = parentPatternRootNodeIdsChain.join('---');
    PrebindingManager.linkOriginalNodeIds(indexedNodeId, node.id!);
    PrebindingManager.storePrebindingDefinitions(indexedNodeId, componentId, prebindingDefinitions);

    const prebindingDefinition = prebindingDefinitions[0];

    if (prebindingDefinition && prebindingDefinition.parameterDefinitions) {
      for (const [parameterId] of Object.entries(prebindingDefinition.parameterDefinitions)) {
        const hoistedParameterId = PrebindingManager.getHoistedIdForParameterId(
          parameterId,
          indexedNodeId,
        );
        if (rootPatternParameters[hoistedParameterId]) {
          nodeParameters[parameterId] = rootPatternParameters[hoistedParameterId];
        }
      }
    }
  }

  const deserializedNode = deserializePatternNode({
    node: {
      definitionId: node.definitionId,
      id: node.id,
      variables: node.variables,
      children: componentFields.componentTree.children,
      parameters: nodeParameters,
    },
    rootPatternVariables: node.variables,
    componentSettings: componentFields.componentSettings!,
    entityStore,
    rootPatternParameters: parameters,
    parentPatternRootNodeIdsChain,
  });

  entityStore.addAssemblyUnboundValues(componentFields.unboundValues);

  return deserializedNode;
};
