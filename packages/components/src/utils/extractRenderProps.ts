import { StructureComponentProps } from '@contentful/experiences-core/types';

export function extractRenderProps<T>(props: StructureComponentProps<T>) {
  if (props.editorMode) {
    const { editorMode, node, children, ...renderProps } = props;
    return renderProps as T;
  }
  const { editorMode, children, ...renderProps } = props;
  return renderProps as T;
}
