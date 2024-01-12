export { ExperienceRoot } from './ExperienceRoot';
export { useExperienceBuilder, useFetchExperience, useFetchById, useFetchBySlug } from './hooks';
export { defineComponents } from './core/componentRegistry';
export {
  calculateNodeDefaultHeight,
  checkIsAssembly,
  defineDesignTokens,
  supportedModes,
  VisualEditorMode,
  fetchById,
  fetchBySlug,
} from '@contentful/experience-builder-core';
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
  /** @deprecated use `ASSEMBLY_BLOCK_NODE_TYPE` instead. This will be removed in version 5. */
  DESIGN_COMPONENT_BLOCK_NODE_TYPE,
  /** @deprecated use `ASSEMBLY_NODE_TYPE` instead. This will be removed in version 5. */
  DESIGN_COMPONENT_NODE_TYPE,
  /** @deprecated use `ASSEMBLY_NODE_TYPES` instead. This will be removed in version 5. */
  DESIGN_COMPONENT_NODE_TYPES,
  ASSEMBLY_BLOCK_NODE_TYPE,
  ASSEMBLY_NODE_TYPE,
  ASSEMBLY_NODE_TYPES,
  SCROLL_STATES,
} from '@contentful/experience-builder-core/constants';
export { tryParseMessage, doesMismatchMessageSchema } from './utils/validation';

export type {
  InternalSDKMode,
  ExternalSDKMode,
  ComponentDefinition,
} from '@contentful/experience-builder-core/types';
export { EntityStore } from '@contentful/visual-sdk';
