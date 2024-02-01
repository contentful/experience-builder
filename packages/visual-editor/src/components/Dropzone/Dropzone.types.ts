import { CompositionComponentNode } from '@contentful/experience-builder-core/types';

export type RenderDropzoneFunction = (
  node: CompositionComponentNode,
  props?: Record<string, unknown>
) => React.JSX.Element;
