import type { StructureComponentProps } from '@/types';

export function extractRenderProps<T>(props: T): Omit<T, 'node' | 'isEditorMode' | 'children'> {
  const { isEditorMode, node, children, ...renderProps } =
    props as StructureComponentProps<unknown>;
  return renderProps as Omit<T, 'node' | 'isEditorMode' | 'children'>;
}
