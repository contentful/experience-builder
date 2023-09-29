export { ExperienceRoot } from './blocks'
export { useExperienceBuilder, getValueForBreakpoint } from './hooks'
export { defineComponents } from './core/componentRegistry'
export type {
  ComponentDefinition,
  ComponentRegistration,
  Experience,
  ComponentDefinitionVariable,
  ComponentDefinitionVariableType,
  CompositionVariableValueType,
  CompositionComponentPropValue,
  ValidationOption,
} from './types'
export {
  /**
  * @deprecated Sections are deprecated and are replaced by Containers in the schema version "2023-09-28". Support for sections will be removed completely as soon as all customer data was migrated.
  */
  CONTENTFUL_SECTION_ID,
  CONTENTFUL_COMPONENT_CATEGORY,
  CONTENTFUL_CONTAINER_ID,
  LATEST_SCHEMA_VERSION,
} from './constants'
