import { ExperienceTreeNode } from '@contentful/experiences-core/types';

export type RenderDropzoneFunction = (
  node: ExperienceTreeNode,
  props?: Record<string, unknown>,
) => React.JSX.Element;
