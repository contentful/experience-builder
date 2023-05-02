export type ComponentDefinitionVariables = {
  name: string
  dataType: string
  defaultValue?: string | boolean
  options?: string[]
  required?: boolean
  childNode?: boolean
}

export type ComponentDefinition = {
  id: string
  container: boolean
  category: string
  variables: ComponentDefinitionVariables[]
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
