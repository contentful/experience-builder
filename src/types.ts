import { CONTENTFUL_SECTION_ID } from './constants'
import { Link } from "contentful-management"

export enum OutgoingExperienceBuilderEvent {
  REGISTERED_COMPONENTS = 'registeredComponents',
  MOUSE_MOVE = 'mouseMove',
  COMPONENT_SELECTED = 'componentSelected',
  COMPONENT_DROPPED = 'componentDropped',
  COMPONENT_REMOVED = 'componentRemoved',
}

export enum IncomingExperienceBuilderEvent {
  COMPOSITION_UPDATED = 'componentTreeUpdated',
  COMPONENT_VALUE_CHANGED = 'valueChanged',
  COMPONENT_DRAGGING_CHANGED = 'componentDraggingChanged',
  SELECTED_COMPONENT_CHANGED = 'selectedComponentChanged',
}

export type ComponentDefinitionVariableType =
  | 'Text'
  | 'Number'
  | 'Date'
  | 'Boolean'
  | 'Location'
  | 'Link'
  | 'Array'
export type ComponentDefinitionVariableArrayItemType = 'Link' | 'Symbol' | 'Component'

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
  defaultValue?: string | boolean | number
}

export interface ComponentDefinitionVariableLink extends ComponentDefinitionVariableBase<'Link'> {
  linkType: 'Entry' | 'Asset'
}

export interface ComponentDefinitionVariableArrayOfEntityLinks
  extends ComponentDefinitionVariableBase<'Array'> {
  items: {
    type: 'Link'
    linkType: 'Entry' | 'Asset'
  }
}

export interface ComponentDefinitionVariableArrayOfPrimitives
  extends ComponentDefinitionVariableBase<'Array'> {
  type: 'Array'
}

export interface ComponentDefinitionVariableArrayOfComponents {
  type: 'Array'
  items: {
    type: 'Component'
  }
}

export type ComponentDefinitionVariableArray<
  K extends ComponentDefinitionVariableArrayItemType = ComponentDefinitionVariableArrayItemType
> = K extends 'Link'
  ? ComponentDefinitionVariableArrayOfEntityLinks
  : ComponentDefinitionVariableArrayOfPrimitives

export type ComponentDefinitionVariable<
  T extends ComponentDefinitionVariableType,
  K extends ComponentDefinitionVariableArrayItemType = ComponentDefinitionVariableArrayItemType
> = T extends 'Link'
  ? ComponentDefinitionVariableLink
  : T extends 'Array'
  ? { items: { type: K } } & ComponentDefinitionVariableArray<K>
  : ComponentDefinitionVariableBase<T>

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

type DataSourceEntryValueType =
  | Link<'Entry'>
  | Link<'Asset'>
  | { value: CompositionVariableValueType }

export type LocalizedDataSource = Record<
  string, // locale
  Record<
    string, // uuid
    DataSourceEntryValueType
  >
>

export type CompositionVariableValueType = string | boolean | number | undefined
type CompositionComponentPropType = 'BoundValue' | 'UnboundValue' | 'DesignValue'

export type CompositionComponentPropValue<
  T extends CompositionComponentPropType = CompositionComponentPropType
> = T extends 'DesignValue'
  ? { type: T; value: CompositionVariableValueType }
  : { type: T; path: string }

// TODO: add conditional typing magic to reduce the number of optionals
export type CompositionComponentNode = {
  type: 'block' | 'root'
  data: {
    id: string
    blockId?: string // will be undefined in case string node or if root component
    props: Record<string, CompositionComponentPropValue<CompositionComponentPropType>>
    dataSource: Record<
      string, // locale
      Record<
        string, // uuid
        DataSourceEntryValueType
      >
    >
  }
  children: CompositionComponentNode[]
  parentId?: string
}

export type CompositionTree = {
  root: CompositionComponentNode
}

export type Experience = {
  tree?: CompositionTree
  dataSource: LocalizedDataSource
  isDragging: boolean
  selectedNodeId: string
}

export type SECTION_STYLE_ATTRIBUTE_KEY =
  | 'horizontalAlignment'
  | 'verticalAlignment'
  | 'margin'
  | 'padding'
  | 'backgroundColor'
  | 'width'
  | 'height'
  | 'flexDirection'
  | 'border'
  | 'maxWidth'
  | 'gap'

export type ContentfulSectionType = Omit<ComponentDefinition, 'variables'> & {
  id: typeof CONTENTFUL_SECTION_ID
  name: 'Contentful Section'
  variables: Record<SECTION_STYLE_ATTRIBUTE_KEY, ComponentDefinitionVariable<'Text'>>
}

// cda types
export type CompositionNode = {
  definitionId: string
  children: Array<CompositionNode>
  variables: Record<string, CompositionComponentPropValue>
}

export type CompositionDataSource = Record<string, DataSourceEntryValueType>

export type Composition = {
  children: Array<CompositionNode>
  dataSource: CompositionDataSource
}
