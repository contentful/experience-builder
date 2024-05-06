import React, { type HTMLAttributes } from 'react';

interface DraggableProvidedDraggableProps {
  'data-rfd-draggable-context-id'?: string;
  'data-rfd-draggable-id'?: string;
}

interface DraggableProvidedDragHandleProps {
  'data-rfd-drag-handle-draggable-id'?: string;
  'data-rfd-drag-handle-context-id'?: string;
}

export type WrapperTags = keyof Pick<
  JSX.IntrinsicElements,
  | 'div'
  | 'span'
  | 'section'
  | 'article'
  | 'aside'
  | 'p'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'header'
  | 'footer'
  | 'nav'
  | 'main'
>;

export interface DragWrapperProps
  extends DraggableProvidedDragHandleProps,
    DraggableProvidedDraggableProps,
    HTMLAttributes<HTMLElement>,
    React.PropsWithChildren {
  'data-cf-node-id'?: string;
  'data-ctfl-draggable-id'?: string;
  'data-test-id'?: string;
  'data-cf-node-block-id'?: string;
  'data-cf-node-block-type'?: string;
  innerRef?: (refNode: HTMLElement) => void;
  editorMode?: boolean;
  Tag?: WrapperTags;
  ToolTipAndPlaceHolder?: React.ReactNode;
}

export const DragWrapper: React.FC<DragWrapperProps> = ({
  children,
  // editorMode = false,
  innerRef,
  Tag = 'div',
  ToolTipAndPlaceHolder,
  ...props
}) => {
  return (
    <Tag
      ref={(refNode: HTMLElement | null) => {
        if (innerRef && refNode) innerRef(refNode);
      }}
      {...props}>
      {ToolTipAndPlaceHolder}
      {children}
    </Tag>
  );
};
