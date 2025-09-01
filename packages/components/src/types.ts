import { EditorProperties } from '@contentful/experiences-core/types';

export type StructureComponentProps<OtherProps> = React.PropsWithChildren<
  Partial<EditorProperties> & OtherProps
>;
