import type { CompositionComponentNode } from '@contentful/experience-builder-core/types';

type WithCtflProps<Props> = Props & {
  id: string;
};

export type DefaultComponentProps = { [key: string]: unknown; editorMode?: boolean };

export type Content = ComponentData[];

export type CtflComponent<Props extends DefaultComponentProps = DefaultComponentProps> = (
  props: WithCtflProps<Props & { ctfl: unknown }>
) => JSX.Element;

export type ComponentConfig<
  ComponentProps extends DefaultComponentProps = DefaultComponentProps,
  DefaultProps = ComponentProps
> = {
  id: string;
  render: CtflComponent<ComponentProps>;
  defaultProps?: DefaultProps;
};

export type ComponentData = CompositionComponentNode;

export interface DropZone {
  direction: 'horizontal' | 'vertical';
}

export type DropZoneMap = Map<string, DropZone>;
