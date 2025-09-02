import type { StructureComponentProps } from '@/types';
import { EditorPropertyNames } from '@contentful/experiences-core/types';

export function extractRenderProps<T>(props: T): Omit<T, EditorPropertyNames> {
  const { isEditorMode, isEmpty, nodeBlockId, children, ...renderProps } =
    props as StructureComponentProps<unknown>;
  return renderProps as Omit<T, EditorPropertyNames>;
}
