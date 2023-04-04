export type RegisteredComponentVariable = {
  name: string;
  dataType: string;
  defaultValue?: string | boolean;
  options?: string[],
  required?: boolean,
  childNode?: boolean;
}

export type RegisteredComponentParameters = {
  id: string;
  container: boolean;
  category: string;
  variables: RegisteredComponentVariable[]
}

type VisualEditorMessagePayload = {
  source: string;
  eventType: string;
  payload: any;
}

export type Binding = {
  spaceId: string;
  environmentId: string;
  entityId: string;
  entityType: 'Entry' | 'Asset' | 'ContentType';
  path: string[];
};

export type ComponentBinding = Record<string, Binding>;
export type BindingMap = Record<string, ComponentBinding>;
export type BindingMapByBlockId = Record<string, BindingMap>

type BoundVariable = Record<string, { value?: any }>;
export type BoundDataMap = Record<string, BoundVariable>;
export type BoundDataByEntityId = Record<string, BoundDataMap>
export type BoundData = Record<string, BoundDataByEntityId>;