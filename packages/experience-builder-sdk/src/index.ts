import { enableDebug, disableDebug } from '@contentful/experiences-core';
import { SDK_VERSION } from './sdkVersion';
export { SDK_VERSION as version };

export { ExperienceRoot } from './ExperienceRoot';
export { useFetchById, useFetchBySlug, useCustomFetch } from './hooks';
export { defineComponents } from './core/componentRegistry';
export {
  entityCache,
  useEntityStore,
  defineDesignTokens,
  defineBreakpoints,
  VisualEditorMode,
  fetchById,
  fetchBySlug,
  createExperience,
  detachExperienceStyles,
  fetchReferencedEntities,
  fetchExperienceEntry,
  localizeEntity,
} from '@contentful/experiences-core';
export {
  CONTENTFUL_COMPONENTS,
  LATEST_SCHEMA_VERSION,
  CF_STYLE_ATTRIBUTES,
} from '@contentful/experiences-core/constants';
export type {
  Experience,
  ComponentDefinition,
  ComponentRegistration,
} from '@contentful/experiences-core/types';

// Simple state store to store a few things that are needed across the SDK
if (typeof window !== 'undefined') {
  if (!window.__EB__) {
    window.__EB__ = {};
  }
  window.__EB__.sdkVersion = SDK_VERSION;
  window.__EB__.enableDebug = enableDebug;
  window.__EB__.disableDebug = disableDebug;
}
