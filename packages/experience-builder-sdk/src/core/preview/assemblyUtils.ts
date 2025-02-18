import { checkIsAssemblyNode, EntityStore } from '@contentful/experiences-core';
import type {
  ComponentPropertyValue,
  ComponentTreeNode,
  DesignValue,
  ExperienceComponentSettings,
  PatternProperty,
} from '@contentful/experiences-core/types';
import { UnresolvedLink } from 'contentful';

/** While unfolding the assembly definition on the instance, this function will replace all
 * ComponentValue in the definitions tree with the actual value on the instance. */
export const deserializeAssemblyNode = ({
  node,
  componentInstanceVariables,
  assemblyVariableDefinitions,
  assemblyPatternPropertDefinitions,
  assemblyVariableMappings,
  patternProperties,
  entityStore,
}: {
  node: ComponentTreeNode;
  componentInstanceVariables: ComponentTreeNode['variables'];
  assemblyVariableDefinitions: ExperienceComponentSettings['variableDefinitions'];
  assemblyPatternPropertDefinitions: ExperienceComponentSettings['patternPropertyDefinitions'];
  assemblyVariableMappings: ExperienceComponentSettings['variableMappings'];
  patternProperties: Record<string, PatternProperty>;
  entityStore: EntityStore;
}): ComponentTreeNode => {
  const variables: Record<string, ComponentPropertyValue> = {};

  for (const [variableName, variable] of Object.entries(node.variables)) {
    variables[variableName] = variable;
    if (variable.type === 'ComponentValue') {
      const componentValueKey = variable.key;
      const instanceProperty = componentInstanceVariables[componentValueKey];
      const variableDefinition = assemblyVariableDefinitions?.[componentValueKey];
      const defaultValue = variableDefinition?.defaultValue;
      const variableMapping = assemblyVariableMappings?.[componentValueKey];

      const patternPropertyDefinition =
        assemblyPatternPropertDefinitions?.[variableMapping?.patternPropertyDefinitionId || ''];
      const patternProperty =
        patternProperties?.[variableMapping?.patternPropertyDefinitionId || ''];
      const isValidForPrebinding = patternPropertyDefinition && patternProperty && variableMapping;

      if (isValidForPrebinding && instanceProperty.type === 'NoValue') {
        const [, uuid] = patternProperty.path.split('/');
        const binding = entityStore.dataSource[uuid] as UnresolvedLink<'Entry' | 'Asset'>;
        const entityOrAsset = entityStore.getEntryOrAsset(binding, patternProperty.path);

        let contentType = '';

        if (entityOrAsset?.sys.type === 'Entry') {
          contentType = entityOrAsset.sys.contentType.sys.id;
        }

        const fieldPath = variableMapping.pathsByContentType[contentType]?.path;

        if (fieldPath) {
          const fullPath = patternProperty.path + fieldPath;

          variables[variableName] = {
            type: 'BoundValue',
            path: fullPath,
          };
        }

        // For assembly, we look up the variable in the assembly instance and
        // replace the ComponentValue with that one.
      } else if (instanceProperty?.type === 'UnboundValue') {
        variables[variableName] = {
          type: 'UnboundValue',
          key: instanceProperty.key,
        };
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
      assemblyVariableDefinitions,
      assemblyPatternPropertDefinitions,
      assemblyVariableMappings,
      patternProperties,
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
  };
};

export const resolveAssembly = ({
  node,
  entityStore,
}: {
  node: ComponentTreeNode;
  entityStore: EntityStore;
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

  const componentFields = assembly.fields;

  const deserializedNode = deserializeAssemblyNode({
    node: {
      definitionId: node.definitionId,
      id: node.id,
      variables: node.variables,
      children: componentFields.componentTree.children,
    },
    componentInstanceVariables: node.variables,
    assemblyVariableDefinitions: componentFields.componentSettings!.variableDefinitions,
    assemblyPatternPropertDefinitions:
      componentFields.componentSettings?.patternPropertyDefinitions,
    assemblyVariableMappings: componentFields.componentSettings?.variableMappings,
    patternProperties: node.patternProperties || {},
    entityStore,
  });

  entityStore.addAssemblyUnboundValues(componentFields.unboundValues);

  return deserializedNode;
};
