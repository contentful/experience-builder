import { CONTENTFUL_CONTAINER_ID, ComponentDefinition } from '@contentful/experience-builder';
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
  if ([CONTENTFUL_CONTAINER_ID].includes(componentDefinition.id)) {
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
