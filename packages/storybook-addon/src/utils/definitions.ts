import { CONTENTFUL_COMPONENTS, ComponentDefinition } from '@contentful/experiences-sdk-react';
import { builtInStyles } from './variables';

const cloneObject = <T>(targetObject: T): T => {
  if (typeof structuredClone !== 'undefined') {
    return structuredClone(targetObject);
  }

  return JSON.parse(JSON.stringify(targetObject));
};

const applyComponentDefinitionFallbacks = (componentDefinition: ComponentDefinition) => {
  const clone = cloneObject(componentDefinition);
  for (const variable of Object.values(clone.variables)) {
    variable.group = variable.group ?? 'content';
  }
  return clone;
};

const applyBuiltInStyleDefinitions = (componentDefinition: ComponentDefinition) => {
  if ([CONTENTFUL_COMPONENTS.container.id].includes(componentDefinition.id)) {
    return componentDefinition;
  }

  const clone = cloneObject(componentDefinition);

  // set margin built-in style by default
  if (!clone.builtInStyles) {
    clone.builtInStyles = ['cfMargin'];
  }

  for (const style of Object.values(clone.builtInStyles || [])) {
    if (builtInStyles[style]) {
      clone.variables[style] = builtInStyles[style];
    }
  }
  return clone;
};

export const enrichComponentDefinition = (componentDefinition: ComponentDefinition) => {
  const definitionWithFallbacks = applyComponentDefinitionFallbacks(componentDefinition);
  const definitionWithBuiltInStyles = applyBuiltInStyleDefinitions(definitionWithFallbacks);

  return definitionWithBuiltInStyles;
};
