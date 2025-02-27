import { SDK_VERSION } from './sdkVersion';
export { SDK_VERSION as version };

export { ExperienceRoot } from './ExperienceRoot';
export { useFetchById, useFetchBySlug } from './hooks';
export { defineComponents, maintainBasicComponentIdsWithoutPrefix } from './core/componentRegistry';
export {
  defineDesignTokens,
  defineBreakpoints,
  VisualEditorMode,
  fetchById,
  fetchBySlug,
  createExperience,
} from '@contentful/experiences-core';
export {
  CONTENTFUL_COMPONENTS,
  LATEST_SCHEMA_VERSION,
  CF_STYLE_ATTRIBUTES,
} from '@contentful/experiences-core/constants';

// Simple state store to store a few things that are needed across the SDK
if (typeof window !== 'undefined') {
  if (!window.__EB__) {
    window.__EB__ = {};
  }
  window.__EB__.sdkVersion = SDK_VERSION;
}

export type {
  Experience,
  ComponentDefinition,
  ComponentRegistration,
} from '@contentful/experiences-core/types';

export { detachExperienceStyles } from '@contentful/experiences-core';
