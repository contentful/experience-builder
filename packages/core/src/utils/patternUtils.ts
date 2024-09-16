import type {
  ComponentPropertyValue,
  ExperienceDataSource,
  ExperienceUnboundValues,
  ExperienceComponentSettings,
  DesignValue,
} from '../types';

export const deserializePatternVariables = ({
  nodeVariables,
  componentInstanceProps,
  componentInstanceUnboundValues,
  componentInstanceDataSource,
  assemblyVariableDefinitions,
}: {
  nodeVariables: Record<string, ComponentPropertyValue>;
  componentInstanceProps: Record<string, ComponentPropertyValue>;
  componentInstanceUnboundValues: ExperienceUnboundValues;
  componentInstanceDataSource: ExperienceDataSource;
  assemblyVariableDefinitions?: ExperienceComponentSettings['variableDefinitions'];
}): {
  childNodeVariable: Record<string, ComponentPropertyValue>;
  dataSource: ExperienceDataSource;
  unboundValues: ExperienceUnboundValues;
} => {
  const childNodeVariable: Record<string, ComponentPropertyValue> = {};
  const dataSource: ExperienceDataSource = {};
  const unboundValues: ExperienceUnboundValues = {};

  for (const [variableName, variable] of Object.entries(nodeVariables)) {
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

  return { childNodeVariable, dataSource, unboundValues };
};
