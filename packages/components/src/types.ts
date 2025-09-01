import { ExperienceTreeNode } from '@contentful/experiences-core/types';

type StructuralEditorModeProps =
  | {
      isEditorMode: true;
      node: ExperienceTreeNode;
    }
  | {
      isEditorMode?: false;
    };

export type StructureComponentProps<OtherProps> = React.PropsWithChildren<
  StructuralEditorModeProps & OtherProps
>;
