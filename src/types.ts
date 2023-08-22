/**
 * danv:
 * NOTE!! The code commented here will be used in future. We commented it out to remove not yet fully unsupported
 * parts to prepare this library for EAP
 */

import {
  CONTENTFUL_CONTAINER_ID,
  CONTENTFUL_CONTAINER_NAME,
  CONTENTFUL_SECTION_ID,
  CONTENTFUL_SECTION_NAME,
} from './constants'

export enum ScrollStates {
  SCROLL_START = 'scrollStart',
  IS_SCROLLING = 'isScrolling',
  SCROLL_END = 'scrollEnd',
}

export enum OutgoingExperienceBuilderEvent {
  REGISTERED_COMPONENTS = 'registeredComponents',
  HOVERED_SECTION = 'hoveredSection',
  MOUSE_MOVE = 'mouseMove',
  COMPONENT_SELECTED = 'componentSelected',

  COMPONENT_DROPPED = 'componentDropped',
  CANVAS_RELOAD = 'canvasReload',
  UPDATE_SELECTED_COMPONENT_COORDINATES = 'updateSelectedComponentCoordinates',
  CANVAS_SCROLL = 'canvasScrolling',
}

export enum IncomingExperienceBuilderEvent {
  COMPOSITION_UPDATED = 'componentTreeUpdated',
  COMPONENT_DRAGGING_CHANGED = 'componentDraggingChanged',
  SELECTED_COMPONENT_CHANGED = 'selectedComponentChanged',
  CANVAS_RESIZED = 'canvasResized',
  SELECT_COMPONENT = 'selectComponent',
}

export interface Link<T extends string> {
  sys: {
    type: 'Link'
    linkType: T
    id: string
  }
}

export type ComponentDefinitionVariableType =
  | 'Text'
  | 'RichText'
  | 'Number'
  | 'Date'
  | 'Boolean'
  | 'Location'
  | 'Object'
// | 'Link'
// | 'Array'
// export type ComponentDefinitionVariableArrayItemType = 'Link' | 'Symbol' | 'Component'

export type ValidationOption<T extends ComponentDefinitionVariableType> = {
  value: T extends 'Text' ? string : T extends 'Number' ? number : never
  displayName?: string
}

export type ComponentDefinitionVariableValidation<T extends ComponentDefinitionVariableType> = {
  required?: boolean
  in?: ValidationOption<T>[]
}

export interface ComponentDefinitionVariableBase<T extends ComponentDefinitionVariableType> {
  type: T
  validations?: ComponentDefinitionVariableValidation<T>
  group?: 'style' | 'content'
  description?: string
  displayName?: string
  defaultValue?: string | boolean | number | Record<any, any>
}

// export interface ComponentDefinitionVariableLink extends ComponentDefinitionVariableBase<'Link'> {
//   linkType: 'Entry' | 'Asset'
// }

// export interface ComponentDefinitionVariableArrayOfEntityLinks
//   extends ComponentDefinitionVariableBase<'Array'> {
//   items: {
//     type: 'Link'
//     linkType: 'Entry' | 'Asset'
//   }
// }

// export interface ComponentDefinitionVariableArrayOfPrimitives
//   extends ComponentDefinitionVariableBase<'Array'> {
//   type: 'Array'
// }

// export interface ComponentDefinitionVariableArrayOfComponents {
//   type: 'Array'
//   items: {
//     type: 'Component'
//   }
// }

// export type ComponentDefinitionVariableArray<
//   K extends ComponentDefinitionVariableArrayItemType = ComponentDefinitionVariableArrayItemType
// > = K extends 'Link'
//   ? ComponentDefinitionVariableArrayOfEntityLinks
//   : ComponentDefinitionVariableArrayOfPrimitives

export type ComponentDefinitionVariable<
  T extends ComponentDefinitionVariableType
  // K extends ComponentDefinitionVariableArrayItemType = ComponentDefinitionVariableArrayItemType
> =
  // T extends 'Link'
  // ? ComponentDefinitionVariableLink
  // : T extends 'Array'
  // ? { items: { type: K } } & ComponentDefinitionVariableArray<K>
  /*:*/ ComponentDefinitionVariableBase<T>

export type ComponentDefinition<
  T extends ComponentDefinitionVariableType = ComponentDefinitionVariableType
> = {
  id: string
  name: string
  category?: string
  thumbnailUrl?: string
  variables: Record<string, { type: T } & ComponentDefinitionVariable<T>>
  children?: boolean
}

export type Binding = {
  spaceId: string
  environmentId: string
  entityId: string
  entityType: 'Entry' | 'Asset' | 'ContentType'
  path: string[]
}

export type ComponentBinding = Record<string, Binding>
export type BindingMap = Record<string, ComponentBinding>
export type BindingMapByBlockId = Record<string, BindingMap>

export type DataSourceEntryValueType = Link<'Entry' | 'Asset'>

export type LocalizedUnboundValues = Record<
  string,
  Record<string, { value: CompositionVariableValueType }>
>

export type LocalizedDataSource = Record<
  string, // locale
  Record<
    string, // uuid
    DataSourceEntryValueType
  >
>

export type CompositionVariableValueType = string | boolean | number | Record<any, any> | undefined
type CompositionComponentPropType = 'BoundValue' | 'UnboundValue' | 'DesignValue'

export type CompositionComponentPropValue<
  T extends CompositionComponentPropType = CompositionComponentPropType
> = T extends 'DesignValue'
  ? // The keys in valuesByBreakpoint are the breakpoint ids
    { type: T; valuesByBreakpoint: Record<string, CompositionVariableValueType> }
  : T extends 'BoundValue'
  ? { type: T; path: string }
  : { type: T; key: string }

// TODO: add conditional typing magic to reduce the number of optionals
export type CompositionComponentNode = {
  type: 'block' | 'root' | 'editorRoot'
  data: {
    id: string
    blockId?: string // will be undefined in case string node or if root component
    props: Record<string, CompositionComponentPropValue<CompositionComponentPropType>>
    dataSource: CompositionDataSource
    unboundValues: CompositionUnboundValues
    breakpoints: Breakpoint[]
  }
  children: CompositionComponentNode[]
  parentId?: string
}

export type CompositionTree = {
  root: CompositionComponentNode
}

export type CompositionMode = 'editor' | 'preview' | 'delivery'

export type ExperienceConfig = {
  accessToken?: string
  spaceId?: string
  environmentId?: string
  locale?: string
  host?: string
}

export type Experience = {
  tree?: CompositionTree
  experienceTypeId: string
  dataSource: CompositionDataSource
  unboundValues: CompositionUnboundValues
  config: ExperienceConfig
  isDragging: boolean
  selectedNodeId: string
  mode: CompositionMode | undefined
  breakpoints: Breakpoint[]
}

/**
 * Internally defined style variables are prefix with `cf` to avoid
 * collisions with user defined variables.
 */
export type StyleProps = {
  cfHorizontalAlignment: 'start' | 'end' | 'center'
  cfVerticalAlignment: 'start' | 'end' | 'center'
  cfMargin: string
  cfPadding: string
  cfBackgroundColor: string
  cfWidth: string
  cfMaxWidth: string
  cfHeight: string
  cfFlexDirection: 'row' | 'column'
  cfFlexWrap: 'nowrap' | 'wrap'
  cfBorder: string
  cfGap: string
  cfBackgroundImageUrl: string
  cfBackgroundImageScaling: 'fit' | 'fill' | 'tile'
  cfBackgroundImageAlignment: 'left' | 'right' | 'top' | 'bottom'
}

// We might need to replace this with Record<string, string | number> when we want to be React-agnostic
export type CSSProperties = React.CSSProperties

export type SectionStyleVariableName = keyof StyleProps

export type ContentfulSectionType = Omit<ComponentDefinition, 'variables'> & {
  id: typeof CONTENTFUL_SECTION_ID | typeof CONTENTFUL_CONTAINER_ID
  name: typeof CONTENTFUL_SECTION_NAME | typeof CONTENTFUL_CONTAINER_NAME
  variables: Record<SectionStyleVariableName, ComponentDefinitionVariable<'Text'>>
}

// cda types
export type CompositionNode = {
  definitionId: string
  children: Array<CompositionNode>
  variables: Record<string, CompositionComponentPropValue>
}

export type CompositionDataSource = Record<string, DataSourceEntryValueType>
export type CompositionUnboundValues = Record<string, { value: CompositionVariableValueType }>

export type Breakpoint = {
  id: string
  query: string
  displayName: string
  previewSize: string
}

export type SCHEMA_VERSIONS = '2023-06-27' | '2023-07-26' // | '2024-06-27' | ...

export type Composition = {
  title: string
  slug: string
  componentTree: {
    breakpoints: Array<Breakpoint>
    children: Array<CompositionNode>
    schemaVersion: SCHEMA_VERSIONS
  }
  dataSource: CompositionDataSource
  unboundValues: CompositionUnboundValues
}

export interface RawCoordinates {
  left: number
  top: number
  width: number
  height: number
}

export interface Coordinates extends RawCoordinates {
  childrenCoordinates: RawCoordinates[]
}
export interface HoveredElement {
  blockType: string | undefined
  nodeId: string | undefined
  blockId: string | undefined
}
