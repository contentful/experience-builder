import { CompositionMode } from './types'

export const CONTENTFUL_SECTION_ID = 'contentful-section'
export const CONTENTFUL_CONTAINER_ID = 'contentful-container'
export const CONTENTFUL_SECTION_NAME = 'Section'
export const CONTENTFUL_CONTAINER_NAME = 'Container'
export const CONTENTFUL_COMPONENT_CATEGORY = 'contentful-component'
export const LATEST_SCHEMA_VERSION = '2023-08-23'
export const CF_STYLE_ATTRIBUTES = [
  'cfHorizontalAlignment',
  'cfVerticalAlignment',
  'cfMargin',
  'cfPadding',
  'cfBackgroundColor',
  'cfWidth',
  'cfMaxWidth',
  'cfHeight',
  'cfFlexDirection',
  'cfFlexWrap',
  'cfBorder',
  'cfGap',
  'cfBackgroundImageUrl',
  'cfBackgroundImageScaling',
  'cfBackgroundImageAlignment',
]

export const supportedModes: CompositionMode[] = ['delivery', 'preview', 'editor']
