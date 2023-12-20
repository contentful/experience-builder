export { ExperienceRoot } from './ExperienceRoot';
export { useExperienceBuilder, useFetchExperience } from './hooks';
export { defineComponents } from './core/componentRegistry';
export { defineDesignTokens } from '@contentful/experience-builder-core';
export {
  calculateNodeDefaultHeight,
  checkIfDesignComponent,
  supportedModes,
  VisualEditorMode,
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
  DESIGN_COMPONENT_BLOCK_NODE_TYPE,
  DESIGN_COMPONENT_NODE_TYPE,
  DESIGN_COMPONENT_NODE_TYPES,
  SCROLL_STATES,
} from '@contentful/experience-builder-core/constants';
export { tryParseMessage, doesMismatchMessageSchema } from './utils/validation';

export type { InternalSDKMode, ExternalSDKMode } from '@contentful/experience-builder-core/types';
export { EntityStore } from '@contentful/visual-sdk';
export { fetchers } from './core';
export { createExperience } from './utils/createExperience';

import { create } from 'zustand';
