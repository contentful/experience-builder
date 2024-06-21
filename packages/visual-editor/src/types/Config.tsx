import type { ExperienceTreeNode } from '@contentful/experiences-core/types';
import { HTMLAttributes } from 'react';

type WithCtflProps<Props> = Props & {
  id: string;
};

export type DefaultComponentProps = { [key: string]: unknown; editorMode?: boolean };

export type Content = ComponentData[];

export type CtflComponent<Props extends DefaultComponentProps = DefaultComponentProps> = (
  props: WithCtflProps<Props & { ctfl: unknown }>,
) => JSX.Element;

export type ComponentConfig<
  ComponentProps extends DefaultComponentProps = DefaultComponentProps,
  DefaultProps = ComponentProps,
> = {
  id: string;
  render: CtflComponent<ComponentProps>;
  defaultProps?: DefaultProps;
};

export type ComponentData = ExperienceTreeNode;

export interface Dropzone {
  direction: 'horizontal' | 'vertical';
}

export type DropzoneMap = Map<string, Dropzone>;
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
  'data-ctfl-dragging-element'?: string;
  innerRef?: (refNode: HTMLElement) => void;
  wrapComponent?: boolean;
  Tag?: WrapperTags;
  ToolTipAndPlaceholder?: React.ReactNode;
}
