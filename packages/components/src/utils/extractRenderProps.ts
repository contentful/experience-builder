import type { StructureComponentProps } from '@/types';

export function extractRenderProps<T>(props: StructureComponentProps<T>) {
  if (props.isEditorMode) {
    const { isEditorMode, node, children, ...renderProps } = props;
    return renderProps as T;
  }
  const { isEditorMode, children, ...renderProps } = props;
  return renderProps as T;
}
