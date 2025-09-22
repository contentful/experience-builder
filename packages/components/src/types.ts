import { EditorProperties } from '@contentful/experiences-core';

export type StructureComponentProps<OtherProps> = React.PropsWithChildren<
  Partial<EditorProperties> & OtherProps
>;
