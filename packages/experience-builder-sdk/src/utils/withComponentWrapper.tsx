// import { ComponentDefinition } from '@contentful/experience-builder-types';
import React from 'react';

export interface CFProps {
  /**
   * Classes to be applied to the container component.
   */
  className?: string;
  /**
   * Classes to be applied to the child component.
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

export interface WithComponentWrapperOptions {
  /**
   * This will be the tag of the container component.
   * @default 'div'
   * @optional
   */
  wrapContainerTag?: keyof JSX.IntrinsicElements;
}

/**
 * Sets up a component to be consumed by Experience Builder. This function can be used to wrap a component with a container component, or to pass props to the component directly.
 * @param Component Component to be used by Experience Builder.
 * @param options Options for the `withComponentWrapper` function.
 * @default { wrapContainerTag: 'div' }
 * @returns A component that can be passed to `defineComponents` in Experience Builder.
 */
export function withComponentWrapper<T extends object>(
  Component: React.ElementType<T>,
  options: WithComponentWrapperOptions = {
    wrapContainerTag: 'div',
  }
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
    return (
      <Tag className={className} {...cfProps}>
        {typeof Component === 'string' ? (
          React.createElement(Component, { className: classes, ...props })
        ) : (
          <Component className={classes} {...(props as T)} />
        )}
      </Tag>
    );
  };
  return Wrapped;
}
