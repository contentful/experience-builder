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