import { InternalSDKMode, SchemaVersions } from './types'

export const CONTENTFUL_SECTION_ID = 'contentful-section' // TODO: remove me once all customers are using 2023-09-28 schema version
export const CONTENTFUL_CONTAINER_ID = 'contentful-container'
export const CONTENTFUL_SECTION_NAME = 'Section' // TODO: remove me once all customers are using 2023-09-28 schema version
export const CONTENTFUL_CONTAINER_NAME = 'Container'
export const CONTENTFUL_COMPONENT_CATEGORY = 'contentful-component'
export const LATEST_SCHEMA_VERSION = '2023-09-28'
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
  // For backwards compatibility
  // we need to keep those in this constant array
  // so that omit() in <VisualEditorBlock> and <CompositionBlock>
  // can filter them out and not pass as props
  'cfBackgroundImageAlignmentVertical',
  'cfBackgroundImageAlignmentHorizontal',
]

export const supportedModes: InternalSDKMode[] = ['delivery', 'preview', 'editor']
// this is the array of version which currently LATEST_SCHEMA_VERSION is compatible with
export const compatibleVersions: SchemaVersions[] = ['2023-08-23', '2023-09-28']
