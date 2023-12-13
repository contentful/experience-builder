export { ExperienceRoot } from './ExperienceRoot';
export { useExperienceBuilder, getValueForBreakpoint, useFetchExperience } from './hooks';
export { defineComponents } from './core/componentRegistry';
export { defineDesignTokens } from './core/designTokenRegistry';
export { setVisualEditorMode } from './core/visualEditorSettings';
export { calculateNodeDefaultHeight } from './utils/stylesUtils';
export { checkIfDesignComponent } from './utils/utils';
export { tryParseMessage, doesMismatchMessageSchema } from './utils/validation';
export type {
  ComponentDefinition,
  ComponentRegistration,
  EntityStore,
  Experience,
  ExternalSDKMode,
  DeprecatedExperience,
  ComponentDefinitionVariable,
  ComponentDefinitionVariableType,
  CompositionVariableValueType,
  CompositionComponentPropValue,
  ValidationOption,
  ExperienceEntry,
  IncomingEvent,
} from './types';

export {
  /**
   * @deprecated Sections are deprecated and are replaced by Containers in the schema version "2023-09-28". Support for sections will be removed completely as soon as all customer data was migrated.
   */
  CONTENTFUL_SECTION_ID,
  OUTGOING_EVENTS,
  INCOMING_EVENTS,
  CONTENTFUL_COMPONENT_CATEGORY,
  CONTENTFUL_CONTAINER_ID,
  LATEST_SCHEMA_VERSION,
  CF_STYLE_ATTRIBUTES,
  DESIGN_COMPONENT_BLOCK_NODE_TYPE,
  DESIGN_COMPONENT_NODE_TYPE,
  DESIGN_COMPONENT_NODE_TYPES,
  SCROLL_STATES,
  supportedModes,
} from './constants';
export { fetchers } from './core';
export { createExperience } from './utils/createExperience';
