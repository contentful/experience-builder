import { SDK_VERSION } from './sdkVersion';

export { ExperienceRoot } from './ExperienceRoot';
export { useFetchById, useFetchBySlug } from './hooks';
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
  createExperience,
} from '@contentful/experiences-core';
export {
  CONTENTFUL_COMPONENTS,
  OUTGOING_EVENTS,
  INCOMING_EVENTS,
  CONTENTFUL_COMPONENT_CATEGORY,
  LATEST_SCHEMA_VERSION,
  CF_STYLE_ATTRIBUTES,
  ASSEMBLY_BLOCK_NODE_TYPE,
  ASSEMBLY_NODE_TYPE,
  ASSEMBLY_NODE_TYPES,
  SCROLL_STATES,
} from '@contentful/experiences-core/constants';

// Simple state store to store a few things that are needed across the SDK
if (typeof window !== 'undefined') {
  window.__EB__ = {
    sdkVersion: SDK_VERSION,
  };
}

export type {
  InternalSDKMode,
  ExternalSDKMode,
  ComponentDefinition,
} from '@contentful/experiences-core/types';
export { EntityStore } from '@contentful/experiences-core';
