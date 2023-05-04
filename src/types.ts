export enum ComponentDefinitionVariableType {
  TEXT = 'Text',
  NUMBER = 'Number',
  DATE = 'Date',
  BOOLEAN = 'Boolean',
  LOCATION = 'Location',
  LINK = 'Link',
  ARRAY = 'Array'
}

export enum ComponentDefinitionVariableArrayItemType {
  LINK = 'Link',
  SYMBOL = 'Symbol',
  COMPONENT = 'Component'
}

export type ComponentDefinitionVariableValidation = {
  required?: boolean;
}

export interface ComponentDefinitionVariableBase {
  validations?: ComponentDefinitionVariableValidation;
  isStyle?: boolean;
  description?: string;
}

export interface ComponentDefinitionVariableLink extends ComponentDefinitionVariableBase {
  type: ComponentDefinitionVariableType.LINK,
  linkType: 'Entry' | 'Asset'
}

export interface ComponentDefinitionVariableArrayOfEntityLinks {
  type: ComponentDefinitionVariableType.ARRAY,
  items: {
    type: ComponentDefinitionVariableArrayItemType.LINK,
    linkType: 'Entry' | 'Asset'
  }
}

export interface ComponentDefinitionVariableArrayOfPrimitives {
  type: ComponentDefinitionVariableType.ARRAY,
}

export interface ComponentDefinitionVariableArrayOfComponents {
  type: ComponentDefinitionVariableType.ARRAY,
  items: {
    type: ComponentDefinitionVariableArrayItemType.COMPONENT
  }
}

export type ComponentDefinitionVariableArray<K extends ComponentDefinitionVariableArrayItemType = ComponentDefinitionVariableArrayItemType> = K extends ComponentDefinitionVariableArrayItemType.LINK
  ? ComponentDefinitionVariableArrayOfEntityLinks
  : ComponentDefinitionVariableArrayOfPrimitives;

export type ComponentDefinitionVariable<T extends ComponentDefinitionVariableType, K extends ComponentDefinitionVariableArrayItemType = ComponentDefinitionVariableArrayItemType> =
  T extends ComponentDefinitionVariableType.LINK
    ? ComponentDefinitionVariableLink
    : T extends ComponentDefinitionVariableType.ARRAY
      ? { items: { type: K } } & ComponentDefinitionVariableArray<K>
      : ComponentDefinitionVariableBase;

export type ComponentDefinition<T extends ComponentDefinitionVariableType = ComponentDefinitionVariableType> = {
  id: string;
  name: string;
  category?: string;
  thumbnailUrl?: string;
  variables: Record<string, { type: T } & ComponentDefinitionVariable<T>>
}
