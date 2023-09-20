import { CompositionComponent } from '@/types/composition';
import { ComponentDefinition } from '@contentful/experience-builder';
import React from 'react';

export interface CFProps {
  /**
   * Classes to be applied to the container component if `wrapComponent` is true, or directly to the child component if false.
   */
  className?: string;
  /**
   * Classes to be applied to the child component if `wrapComponent` is true, or directly to the child component if false.
   */
  classes?: string;
  onMouseDown?: React.MouseEventHandler;
  onMouseUp?: React.MouseEventHandler;
  onClick?: React.MouseEventHandler;
  /**
   * Prop required by Experience Builder to identify the component.
   */
  'data-cf-node-id'?: string;
  /**
   * Prop required by Experience Builder to identify the component.
   */
  'data-cf-node-block-id'?: string;
  /**
   * Prop required by Experience Builder to identify the component's type.
   */
  'data-cf-node-block-type'?: string;
}

export interface WithExperienceBuilderOptions {
  /**
   * If true, the component will be wrapped with a container component.If false, the component will be rendered directly with no container.
   * @default false
   * @optional
   */
  wrapComponent?: boolean;
  /**
   * If `wrapComponent` is true, this will be the tag of the container component.
   * @default 'div'
   * @optional
   */
  wrapContainerTag?: keyof JSX.IntrinsicElements;
}

/**
 * Sets up a component to be consumed by Experience Builder. This function can be used to wrap a component with a container component, or to pass props to the component directly.
 * @param Component Component to be used by Experience Builder.
 * @param componentDefinition ComponentDefinition object to be used by Experience Builder.
 * @param options Options for the `withExperienceBuilder` function.
 * @default { wrapComponent: false, wrapContainerTag: 'div' }
 * @returns A component that can be passed to `defineComponents` in Experience Builder.
 */
export function withExperienceBuilder<T extends object>(
  Component: React.ComponentType<T>,
  componentDefinition: ComponentDefinition,
  options: WithExperienceBuilderOptions = {
    wrapComponent: false,
    wrapContainerTag: 'div',
  }
) {
  const Wrapped: CompositionComponent<CFProps & T> = ({
    classes = '',
    className = '',
    'data-cf-node-id': dataCfNodeId,
    'data-cf-node-block-id': dataCfNodeBlockId,
    'data-cf-node-block-type': dataCfNodeBlockType,
    onClick,
    onMouseDown,
    onMouseUp,
    ...props
  }) => {
    const Tag = options.wrapContainerTag || 'div';
    const cfProps = {
      'data-cf-node-id': dataCfNodeId,
      'data-cf-node-block-id': dataCfNodeBlockId,
      'data-cf-node-block-type': dataCfNodeBlockType,
      onClick,
      onMouseDown,
      onMouseUp,
    };
    const component = options.wrapComponent ? (
      <Tag className={className} {...cfProps}>
        <Component className={classes} {...(props as T)} />
      </Tag>
    ) : (
      React.createElement(Component, {
        className: classes + className ? classes + ' ' + className : undefined,
        ...cfProps,
        ...(props as T),
      })
    );
    return component;
  };

  Wrapped.ComponentDefinition = componentDefinition;
  return Wrapped;
}
