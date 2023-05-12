export const enum ComponentDefinitionVariableType {
  TEXT = 'Text',
  NUMBER = 'Number',
  DATE = 'Date',
  BOOLEAN = 'Boolean',
  LOCATION = 'Location',
  LINK = 'Link',
  ARRAY = 'Array',
}

export const enum ComponentDefinitionVariableArrayItemType {
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
  isStyle?: boolean
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

type BoundVariable = Record<string, { value?: any }>
export type BoundDataMap = Record<string, BoundVariable>
export type BoundDataByEntityId = Record<string, BoundDataMap>
export type BoundData = Record<string, BoundDataByEntityId>
