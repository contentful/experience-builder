import { Link } from 'contentful-management'

export enum OutcomingExperienceBuilderEvent {
  REGISTERED_COMPONENTS = 'registeredComponents',
  MOUSE_MOVE = 'mouseMove',
  COMPONENT_SELECTED = 'componentSelected',
  COMPONENT_DROPPED = 'componentDropped',
}

export enum IncomingExperienceBuilderEvent {
  COMPOSITION_UPDATED = 'componentTreeUpdated',
  COMPONENT_VALUE_CHANGED = 'valueChanged',
}

export enum ComponentDefinitionVariableType {
  TEXT = 'Text',
  NUMBER = 'Number',
  DATE = 'Date',
  BOOLEAN = 'Boolean',
  LOCATION = 'Location',
  LINK = 'Link',
  ARRAY = 'Array',
}

export enum ComponentDefinitionVariableArrayItemType {
  LINK = 'Link',
  SYMBOL = 'Symbol',
  COMPONENT = 'Component',
}

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

export interface ComponentDefinitionVariableLink
  extends ComponentDefinitionVariableBase<ComponentDefinitionVariableType.LINK> {
  linkType: 'Entry' | 'Asset'
}

export interface ComponentDefinitionVariableArrayOfEntityLinks
  extends ComponentDefinitionVariableBase<ComponentDefinitionVariableType.ARRAY> {
  items: {
    type: ComponentDefinitionVariableArrayItemType.LINK
    linkType: 'Entry' | 'Asset'
  }
}

export interface ComponentDefinitionVariableArrayOfPrimitives
  extends ComponentDefinitionVariableBase<ComponentDefinitionVariableType.ARRAY> {
  type: ComponentDefinitionVariableType.ARRAY
}

export interface ComponentDefinitionVariableArrayOfComponents {
  type: ComponentDefinitionVariableType.ARRAY
  items: {
    type: ComponentDefinitionVariableArrayItemType.COMPONENT
  }
}

export type ComponentDefinitionVariableArray<
  K extends ComponentDefinitionVariableArrayItemType = ComponentDefinitionVariableArrayItemType
> = K extends ComponentDefinitionVariableArrayItemType.LINK
  ? ComponentDefinitionVariableArrayOfEntityLinks
  : ComponentDefinitionVariableArrayOfPrimitives

export type ComponentDefinitionVariable<
  T extends ComponentDefinitionVariableType,
  K extends ComponentDefinitionVariableArrayItemType = ComponentDefinitionVariableArrayItemType
> = T extends ComponentDefinitionVariableType.LINK
  ? ComponentDefinitionVariableLink
  : T extends ComponentDefinitionVariableType.ARRAY
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

type DataSourceEntry = Record<
  string,
  Link<'Entry'> | Link<'Asset'> | { value: string | number | boolean | undefined }
>
export type LocalizedDataSource = Record<string, Record<string, DataSourceEntry>>

// TODO: add conditional typing magic to reduce the number of optionals
export type TreeNode = {
  type: 'block' | 'root'
  data: {
    id: string
    blockId?: string // will be undefined in case string node or if root component
    propKey?: string // will have the key of variable that block configuration marked as "childNode"
    props: Record<string, { path: string; type: 'BoundValue' | 'UnboundValue' }>
    dataSource: Record<
      string,
      Record<
        string,
        Link<'Entry'> | Link<'Asset'> | { value: string | boolean | number | undefined }
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
