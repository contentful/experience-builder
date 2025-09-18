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
  defineSdkOptions,
  debug,
  isContentfulStructureComponent,
  checkIsAssemblyDefinition,
} from '@contentful/experiences-core';
import { validateComponentDefinition } from '@contentful/experiences-validators';
import { withComponentWrapper } from '../utils/withComponentWrapper';
import { SDK_VERSION } from '../constants';
import {
  sectionDefinition,
  containerDefinition,
  columnsDefinition,
  singleColumnDefinition,
  dividerDefinition,
} from '@contentful/experiences-components-react';

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
  const clone = cloneObject(componentDefinition);

  // set margin built-in style by default
  if (!clone.builtInStyles) {
    clone.builtInStyles = ['cfMargin'];
  }

  if (!clone.variables) {
    clone.variables = {};
  }

  // Enforce the presence of this property for toggling visibility on any node
  clone.variables['cfVisibility'] = builtInStyleDefinitions['cfVisibility'];

  for (const style of clone.builtInStyles || []) {
    if (builtInStyleDefinitions[style]) {
      clone.variables[style] = builtInStyleDefinitions[style] as any; // TODO: fix type
    }
    if (optionalBuiltInStyles[style]) {
      clone.variables[style] = optionalBuiltInStyles[style] as any; // TODO: fix type
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
    options,
  };
};

const DEFAULT_COMPONENT_REGISTRATIONS = {
  container: {
    component: Components.ContentfulContainer,
    definition: containerDefinition,
    options: {
      enableEditorProperties: {
        isEditorMode: true,
        isEmpty: true,
        nodeBlockId: true,
      },
    },
  },
  section: {
    component: Components.ContentfulContainer,
    definition: sectionDefinition,
    options: {
      enableEditorProperties: {
        isEditorMode: true,
        isEmpty: true,
        nodeBlockId: true,
      },
    },
  },
  columns: {
    component: Components.Columns,
    definition: columnsDefinition,
  },
  singleColumn: {
    component: Components.SingleColumn,
    definition: singleColumnDefinition,
    options: {
      enableEditorProperties: {
        isEditorMode: true,
        isEmpty: true,
      },
    },
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
  divider: enrichComponentDefinition({
    component: Components.ContentfulDivider,
    definition: dividerDefinition,
    options: {
      wrapComponent: false,
    },
  }),
  carousel: enrichComponentDefinition({
    component: Components.Carousel,
    definition: Components.carouselDefinition,
    options: {
      wrapComponent: false,
    },
  }),
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
  DEFAULT_COMPONENT_REGISTRATIONS.divider.definition.id,
];

export const sendRegisteredComponentsMessage = () => {
  // Send the definitions (without components) via the connection message to the experience builder
  const registeredDefinitions = Array.from(componentRegistry.values())
    .map(({ definition }) => definition)
    // Assembly definitions are empty placeholder within the SDK without variables
    // We don't send those to the editor as they would overwrite the actual correct definitions.
    .filter((definition) => !checkIsAssemblyDefinition(definition));

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
  if (options?.experimentalComponents?.carousel) {
    componentRegistry.set(
      CONTENTFUL_COMPONENTS.carousel.id,
      DEFAULT_COMPONENT_REGISTRATIONS.carousel,
    );
  }

  if (options?.enabledBuiltInComponents) {
    for (const id of optionalBuiltInComponents) {
      if (!options.enabledBuiltInComponents.includes(id)) {
        componentRegistry.delete(id);
      }
    }
  }

  defineSdkOptions({
    __disableTextAlignmentTransform: !!options?.__disableTextAlignmentTransform,
    __unsafe__enableBuiltInStructureOverwrites:
      !!options?.__unsafe__enableBuiltInStructureOverwrites,
  });

  for (const registration of componentRegistrations) {
    if (
      isContentfulStructureComponent(registration.definition.id) &&
      !options?.__unsafe__enableBuiltInStructureOverwrites
    ) {
      debug.warn(
        `[experience-builder-sdk:defineComponents] You are registering a ` +
          `structure component with the reserved id '${registration.definition.id}'. This is not recommended ` +
          `and can lead to unexpected behavior. If you still want to register it, please provide the registry option ` +
          `'__unsafe__enableBuiltInStructureOverwrites' to fully enable built-in structure overwrites.`,
      );
    }

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
    variables: {},
    children: true,
    category: ASSEMBLY_DEFAULT_CATEGORY,
  };

  addComponentRegistration({ component, definition });

  return componentRegistry.get(definitionId);
};
