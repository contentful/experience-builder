import { CompositionComponentNode } from '@contentful/experiences-core/types';

export type RenderDropzoneFunction = (
  node: CompositionComponentNode,
  props?: Record<string, unknown>,
) => React.JSX.Element;
