import { Link } from 'contentful-management'

export enum OutgoingExperienceBuilderEvent {
  REGISTERED_COMPONENTS = 'registeredComponents',
  MOUSE_MOVE = 'mouseMove',
  COMPONENT_SELECTED = 'componentSelected',
  COMPONENT_DROPPED = 'componentDropped',
}

export enum IncomingExperienceBuilderEvent {
  COMPOSITION_UPDATED = 'componentTreeUpdated',
  COMPONENT_VALUE_CHANGED = 'valueChanged',
}

// export enum ComponentDefinitionVariableType {
//   TEXT = 'Text',
//   NUMBER = 'Number',
//   DATE = 'Date',
//   BOOLEAN = 'Boolean',
//   LOCATION = 'Location',
//   LINK = 'Link',
//   ARRAY = 'Array',
// }

export type ComponentDefinitionVariableType =
  | 'Text'
  | 'Number'
  | 'Date'
  | 'Boolean'
  | 'Location'
  | 'Link'
  | 'Array'
export type ComponentDefinitionVariableArrayItemType = 'Link' | 'Symbol' | 'Component'

// export enum ComponentDefinitionVariableArrayItemType {
//   LINK = 'Link',
//   SYMBOL = 'Symbol',
//   COMPONENT = 'Component',
// }

export type ComponentDefinitionVariableValidation = {
  required?: boolean
}

export interface ComponentDefinitionVariableBase<T extends ComponentDefinitionVariableType> {
  type: T
  validations?: ComponentDefinitionVariableValidation
  group?: 'style' | 'content'
  description?: string
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
type TreeNodePropType = 'BoundValue' | 'UnboundValue' | 'DesignValue'

type TreeNodePropValue<T extends TreeNodePropType = TreeNodePropType> = T extends 'DesignValue'
  ? { type: T; value: CompositionVariableValueType }
  : { type: T; path: string }

// TODO: add conditional typing magic to reduce the number of optionals
export type TreeNode = {
  type: 'block' | 'root'
  data: {
    id: string
    blockId?: string // will be undefined in case string node or if root component
    propKey?: string // will have the key of variable that block configuration marked as "childNode"
    props: Record<string, TreeNodePropValue<TreeNodePropType>>
    dataSource: Record<
      string, // locale
      Record<
        string, // uuid
        DataSourceEntryValueType
      >
    >
  }
  children: TreeNode[]
  parentId?: string
}

export type Tree = {
  root: TreeNode
}

export type Experience = { tree?: Tree; dataSource: LocalizedDataSource }
