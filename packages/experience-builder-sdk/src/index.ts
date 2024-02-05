export { ExperienceRoot } from './ExperienceRoot';
export { useExperienceBuilder, useFetchExperience, useFetchById, useFetchBySlug } from './hooks';
export { defineComponents } from './core/componentRegistry';
export {
  calculateNodeDefaultHeight,
  /** @deprecated use `checkIsAssemblyNode` instead. Will be removed with SDK v5. */
  checkIsAssembly,
  checkIsAssemblyNode,
  checkIsAssemblyEntry,
  defineDesignTokens,
  supportedModes,
  VisualEditorMode,
  fetchById,
  fetchBySlug,
} from '@contentful/experience-builder-core';
export {
  /** @deprecated use `CONTENTFUL_COMPONENTS.section.id` instead. This will be removed in version 4. */
  CONTENTFUL_SECTION_ID,
  /** @deprecated use `CONTENTFUL_COMPONENTS.container.id` instead. This will be removed in version 4. */
  CONTENTFUL_CONTAINER_ID,
  CONTENTFUL_COMPONENTS,
  OUTGOING_EVENTS,
  INCOMING_EVENTS,
  CONTENTFUL_COMPONENT_CATEGORY,
  LATEST_SCHEMA_VERSION,
  CF_STYLE_ATTRIBUTES,
  // We still need to expose those, so in the editor we can check for both to support older SDK versions
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

export type {
  InternalSDKMode,
  ExternalSDKMode,
  ComponentDefinition,
} from '@contentful/experience-builder-core/types';
export { EntityStore } from '@contentful/experience-builder-core';
