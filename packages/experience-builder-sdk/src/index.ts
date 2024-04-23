import { SDK_VERSION } from './sdkVersion';

export { ExperienceRoot } from './ExperienceRoot';
export { useFetchById, useFetchBySlug } from './hooks';
export { defineComponents, maintainBasicComponentIdsWithoutPrefix } from './core/componentRegistry';
export {
  defineDesignTokens,
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

export { detachExperienceStyles } from './utils/ssrStyles';

// Simple state store to store a few things that are needed across the SDK
if (typeof window !== 'undefined') {
  window.__EB__ = {
    sdkVersion: SDK_VERSION,
  };
}

export type { ExternalSDKMode, ComponentDefinition } from '@contentful/experiences-core/types';
