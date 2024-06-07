import { ComponentRegistration } from '@contentful/experiences-core/types';
import React from 'react';

interface CFProps {
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

/**
 * Sets up a component to be consumed by Experience Builder. This function can be used to wrap a component with a container component, or to pass props to the component directly.
 * @param Component Component to be used by Experience Builder.
 * @param options Options for the `withComponentWrapper` function.
 * @default { wrapComponent: true, wrapContainerTag: 'div' }
 * @returns A component that can be passed to `defineComponents`.
 */
export function withComponentWrapper<T extends object>(
  Component: React.ElementType<T>,
  options: ComponentRegistration['options'] = {
    wrapComponent: true,
    wrapContainerTag: 'div',
  },
) {
  const Wrapped = ({
    classes = '',
    className = '',
    'data-cf-node-id': dataCfNodeId,
    'data-cf-node-block-id': dataCfNodeBlockId,
    'data-cf-node-block-type': dataCfNodeBlockType,
    onClick,
    onMouseDown,
    onMouseUp,
    ...props
  }: CFProps & T) => {
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
        {typeof Component === 'string' ? (
          React.createElement(Component, { className: classes, ...props })
        ) : (
          <Component className={classes} {...(props as T)} />
        )}
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

  return Wrapped;
}
