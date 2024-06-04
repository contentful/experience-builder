import * as Components from '@contentful/experiences-components-react';
import type {
  ComponentRegistration,
  ComponentDefinition,
  ComponentRegistrationOptions,
  DesignTokensDefinition,
} from '@contentful/experiences-core/types';
import {
  OUTGOING_EVENTS,
  INTERNAL_EVENTS,
  CONTENTFUL_COMPONENTS,
  ASSEMBLY_DEFAULT_CATEGORY,
} from '@contentful/experiences-core/constants';
import {
  builtInStyles as builtInStyleDefinitions,
  designTokensRegistry,
  breakpointsRegistry,
  optionalBuiltInStyles,
  sendMessage,
  containerDefinition,
  sectionDefinition,
  columnsDefinition,
  singleColumnDefinition,
} from '@contentful/experiences-core';
import { validateComponentDefinition } from '@contentful/experiences-validators';
import { withComponentWrapper } from '../utils/withComponentWrapper';
import { SDK_VERSION } from '../constants';
import { dividerDefinition } from '@contentful/experiences-core';

const CssVarRegex = /var\(--[\w-]+\)/;

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
    if (builtInStyleDefinitions[style]) {
      clone.variables[style] = builtInStyleDefinitions[style];
    }
    if (optionalBuiltInStyles[style]) {
      clone.variables[style] = optionalBuiltInStyles[style];
    }
  }
  return clone;
};

export const enrichComponentDefinition = ({
  component,
  definition,
  options,
}: ComponentRegistration): ComponentRegistration => {
  const definitionWithFallbacks = applyComponentDefinitionFallbacks(definition);
  const definitionWithBuiltInStyles = applyBuiltInStyleDefinitions(definitionWithFallbacks);
  return {
    component: withComponentWrapper(component, options),
    definition: definitionWithBuiltInStyles,
  };
};

const DEFAULT_COMPONENT_REGISTRATIONS = {
  container: {
    component: Components.ContentfulContainer,
    definition: containerDefinition,
  },
  section: {
    component: Components.ContentfulContainer,
    definition: sectionDefinition,
  },
  columns: {
    component: Components.Columns,
    definition: columnsDefinition,
  },
  singleColumn: {
    component: Components.SingleColumn,
    definition: singleColumnDefinition,
  },
  button: enrichComponentDefinition({
    component: Components.Button,
    definition: Components.ButtonComponentDefinition,
    options: {
      wrapComponent: false,
    },
  }),
  heading: enrichComponentDefinition({
    component: Components.Heading,
    definition: Components.HeadingComponentDefinition,
    options: {
      wrapComponent: false,
    },
  }),
  image: enrichComponentDefinition({
    component: Components.Image,
    definition: Components.ImageComponentDefinition,
    options: { wrapComponent: false },
  }),
  richText: enrichComponentDefinition({
    component: Components.RichText,
    definition: Components.RichTextComponentDefinition,
    options: {
      wrapComponent: false,
    },
  }),
  text: enrichComponentDefinition({
    component: Components.Text,
    definition: Components.TextComponentDefinition,
    options: {
      wrapComponent: false,
    },
  }),
  divider: {
    component: Components.ContentfulDivider,
    definition: dividerDefinition,
    options: {
      wrapComponent: false,
    },
  },
} satisfies Record<string, ComponentRegistration>;

// pre-filling with the default component registrations
export const componentRegistry = new Map<string, ComponentRegistration>([
  [DEFAULT_COMPONENT_REGISTRATIONS.section.definition.id, DEFAULT_COMPONENT_REGISTRATIONS.section],
  [
    DEFAULT_COMPONENT_REGISTRATIONS.container.definition.id,
    DEFAULT_COMPONENT_REGISTRATIONS.container,
  ],
  [
    DEFAULT_COMPONENT_REGISTRATIONS.singleColumn.definition.id,
    DEFAULT_COMPONENT_REGISTRATIONS.singleColumn,
  ],
  [DEFAULT_COMPONENT_REGISTRATIONS.columns.definition.id, DEFAULT_COMPONENT_REGISTRATIONS.columns],
  [DEFAULT_COMPONENT_REGISTRATIONS.button.definition.id, DEFAULT_COMPONENT_REGISTRATIONS.button],
  [DEFAULT_COMPONENT_REGISTRATIONS.heading.definition.id, DEFAULT_COMPONENT_REGISTRATIONS.heading],
  [DEFAULT_COMPONENT_REGISTRATIONS.image.definition.id, DEFAULT_COMPONENT_REGISTRATIONS.image],
  [
    DEFAULT_COMPONENT_REGISTRATIONS.richText.definition.id,
    DEFAULT_COMPONENT_REGISTRATIONS.richText,
  ],
  [DEFAULT_COMPONENT_REGISTRATIONS.text.definition.id, DEFAULT_COMPONENT_REGISTRATIONS.text],
  [DEFAULT_COMPONENT_REGISTRATIONS.divider.definition.id, DEFAULT_COMPONENT_REGISTRATIONS.divider],
]);

export const optionalBuiltInComponents = [
  DEFAULT_COMPONENT_REGISTRATIONS.button.definition.id,
  DEFAULT_COMPONENT_REGISTRATIONS.heading.definition.id,
  DEFAULT_COMPONENT_REGISTRATIONS.image.definition.id,
  DEFAULT_COMPONENT_REGISTRATIONS.richText.definition.id,
  DEFAULT_COMPONENT_REGISTRATIONS.text.definition.id,
];

export const sendRegisteredComponentsMessage = () => {
  // Send the definitions (without components) via the connection message to the experience builder
  const registeredDefinitions = Array.from(componentRegistry.values()).map(
    ({ definition }) => definition,
  );

  sendMessage(OUTGOING_EVENTS.RegisteredComponents, {
    definitions: registeredDefinitions,
  });
};

export const runRegisteredComponentValidations = () => {
  Array.from(componentRegistry.values()).map(({ definition }) => {
    const validation = validateComponentDefinition(definition);
    if (!validation.success) {
      throw new Error(
        `Invalid component definition for component '${definition.name}'. Failed with errors: \n${JSON.stringify(validation.errors, null, 2)}`,
      );
    }
  });
};

const getSingleCssVariableValue = (
  element: HTMLDivElement,
  cssVariableValue: string,
  cssAttribute: any,
) => {
  element.style[cssAttribute] = cssVariableValue;
  const styles = getComputedStyle(element);
  const resolvedValue = styles.getPropertyValue(cssAttribute);
  return resolvedValue;
};

const getAllCssVariableValues = (
  element: HTMLDivElement,
  cssVariable: Record<string, string>,
  cssAttribute: any,
) => {
  const resolvedCssVariables = {} as Record<string, string>;

  Object.keys(cssVariable).forEach((key) => {
    const cssVariableValue = cssVariable[key];
    if (CssVarRegex.test(cssVariableValue)) {
      const resolvedValue = getSingleCssVariableValue(element, cssVariableValue, cssAttribute);
      resolvedCssVariables[cssVariableValue] = resolvedValue;
    }
  });
  return resolvedCssVariables;
};

type CssMapType = {
  variable?: Record<string, string>;
  property: string;
};

const resolveCssVariables = (designTokensDefinition: DesignTokensDefinition) => {
  const {
    spacing,
    sizing,
    color,
    borderRadius,
    fontSize,
    lineHeight,
    letterSpacing,
    textColor,
    border,
  } = designTokensDefinition;
  const resolvedCssVariables = {} as Record<string, string>;

  // Create an element
  const element = document.createElement('div');
  document.body.appendChild(element);

  const cssProperties: CssMapType[] = [
    { variable: spacing, property: 'margin' },
    { variable: sizing, property: 'width' },
    { variable: color, property: 'background-color' },
    { variable: borderRadius, property: 'border-radius' },
    { variable: fontSize, property: 'font-size' },
    { variable: lineHeight, property: 'line-height' },
    { variable: letterSpacing, property: 'letter-spacing' },
    { variable: textColor, property: 'color' },
  ];

  cssProperties.forEach(({ variable, property }) => {
    if (variable) {
      const rawResolvedValues = getAllCssVariableValues(element, variable, property);
      Object.assign(resolvedCssVariables, rawResolvedValues);
    }
  });

  if (border) {
    const tempResolvedValue = {} as Record<string, string>;
    Object.keys(border).forEach((borderKey) => {
      const { width, style, color } = border[borderKey];

      if (width && CssVarRegex.test(width)) {
        const resolvedValue = getSingleCssVariableValue(element, width, 'border-width');
        tempResolvedValue[width] = resolvedValue;
      }
      if (style && CssVarRegex.test(style)) {
        const resolvedValue = getSingleCssVariableValue(element, style, 'border-style');
        tempResolvedValue[style] = resolvedValue;
      }
      if (color && CssVarRegex.test(color)) {
        const resolvedValue = getSingleCssVariableValue(element, color, 'border-color');
        tempResolvedValue[color] = resolvedValue;
      }
      Object.assign(resolvedCssVariables, tempResolvedValue);
    });
  }

  document.body.removeChild(element);
  return resolvedCssVariables;
};

export const sendConnectedEventWithRegisteredComponents = () => {
  // Send the definitions (without components) via the connection message to the experience builder
  const registeredDefinitions = Array.from(componentRegistry.values()).map(
    ({ definition }) => definition,
  );

  sendMessage(OUTGOING_EVENTS.Connected, {
    sdkVersion: SDK_VERSION,
    definitions: registeredDefinitions,
  });

  sendMessage(OUTGOING_EVENTS.RegisteredBreakpoints, {
    breakpoints: breakpointsRegistry,
  });

  sendMessage(OUTGOING_EVENTS.DesignTokens, {
    designTokens: designTokensRegistry,
    resolvedCssVariables: resolveCssVariables(designTokensRegistry),
  });
};

/**
 * Registers multiple components and their component definitions at once
 * @param componentRegistrations - ComponentRegistration[]
 * @returns void
 */
export const defineComponents = (
  componentRegistrations: ComponentRegistration[],
  options?: ComponentRegistrationOptions,
) => {
  if (options?.enabledBuiltInComponents) {
    for (const id of optionalBuiltInComponents) {
      if (!options.enabledBuiltInComponents.includes(id)) {
        componentRegistry.delete(id);
      }
    }
  }

  for (const registration of componentRegistrations) {
    // Fill definitions with fallbacks values
    const enrichedComponentRegistration = enrichComponentDefinition(registration);

    componentRegistry.set(
      enrichedComponentRegistration.definition.id,
      enrichedComponentRegistration,
    );
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(INTERNAL_EVENTS.ComponentsRegistered));
  }
};

/**
 * use this function only in tests
 */
export const resetComponentRegistry = () => {
  componentRegistry.clear();
  for (const registration of Object.values(DEFAULT_COMPONENT_REGISTRATIONS)) {
    componentRegistry.set(registration.definition.id, registration);
  }
};

export const getComponentRegistration = (id: string) => componentRegistry.get(id);

export const addComponentRegistration = (componentRegistration: ComponentRegistration) => {
  componentRegistry.set(componentRegistration.definition.id, componentRegistration);
};

export const createAssemblyRegistration = ({
  definitionId,
  definitionName,
  component,
}: {
  definitionId: string;
  definitionName?: string;
  component: ComponentRegistration['component'];
}) => {
  const componentRegistration = componentRegistry.get(definitionId);

  if (componentRegistration) {
    return componentRegistration;
  }

  const definition = {
    id: definitionId,
    name: definitionName || 'Component',
    variables: {} as ComponentDefinition['variables'],
    children: true,
    category: ASSEMBLY_DEFAULT_CATEGORY,
  };

  addComponentRegistration({ component, definition });

  return componentRegistry.get(definitionId);
};

/**
 * @deprecated This method is used to maintain the basic component ids (without the prefix 'contentful-') in order to be compatible
 * with experiences created with an older alpha version of the SDK. Components in these experiences should be migrated to use
 * the components with the 'contentful-' prefix. To do so, load the experience in the editor, and replace any older basic components
 * (marked with [OLD] in the UI) with the new components (without the [OLD]). This method (and functionality for the older components)
 * will be removed in the next major release.
 */
export const maintainBasicComponentIdsWithoutPrefix = () => {
  optionalBuiltInComponents.forEach((id) => {
    if (componentRegistry.has(id) && id.startsWith('contentful-')) {
      const registeredComponent = componentRegistry.get(id)!;
      const definition = registeredComponent.definition;
      const newDefinition = cloneObject(definition);
      newDefinition.name = newDefinition.name + '[OLD]';
      const newId = id.replace('contentful-', '');
      newDefinition.id = newId;
      const newRegisteredComponent = { ...registeredComponent, definition: newDefinition };
      componentRegistry.set(newId, newRegisteredComponent);
    }
  });
};
