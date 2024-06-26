import { ResolvedComponentProps } from '@/hooks/useComponentProps';
import type { DragWrapperProps } from '@contentful/experiences-core/types';

export const getHtmlDragProps = (dragProps?: DragWrapperProps) => {
  if (dragProps) {
    const { ToolTipAndPlaceholder, Tag, innerRef, wrapComponent, ...htmlDragProps } = dragProps;

    return htmlDragProps;
  }

  return {};
};

export const getHtmlComponentProps = (props?: Partial<ResolvedComponentProps>) => {
  if (props) {
    const { editorMode, renderDropzone, node, ...htmlProps } = props;

    return htmlProps;
  }

  return {};
};
