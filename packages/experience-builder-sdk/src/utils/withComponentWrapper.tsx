import { ComponentRegistration } from '@contentful/experiences-core/types';
import React from 'react';
interface CFProps extends React.HtmlHTMLAttributes<HTMLElement> {
  /**
   * Classes to be applied to the container component if `wrapComponent` is true, or directly to the child component if false.
   */
  className?: string;
  'data-cf-node-id': string;
  'data-cf-node-block-id': string;
  'data-cf-node-block-type': string;
}

/**
 * Sets up a component to be consumed by Experience Builder. This function can be used to wrap a component with a container component, or to pass props to the component directly.
 * @param Component Component to be used by Experience Builder.
 * @param options Options for the `withComponentWrapper` function.
 * @default { wrapComponent: true, wrapContainer: 'div' }
 * @returns A component that can be passed to `defineComponents`.
 */
export function withComponentWrapper<T>(
  Component: React.ElementType,
  options: ComponentRegistration['options'] = {},
) {
  const mergedOptions = {
    // Merge default values with overwriting options
    wrapComponent: true,
    wrapContainer: 'div',
    ...options,
  };
  const Wrapped: React.FC<CFProps & T> = (props) => {
    const Tag = mergedOptions.wrapContainer;
    const {
      className = '',
      'data-cf-node-id': dataCfNodeId,
      'data-cf-node-block-id': dataCfNodeBlockId,
      'data-cf-node-block-type': dataCfNodeBlockType,
      ...componentProps
    } = props;
    const component = mergedOptions.wrapComponent ? (
      <Tag
        data-component-wrapper
        className={className}
        data-cf-node-id={dataCfNodeId}
        data-cf-node-block-id={dataCfNodeBlockId}
        data-cf-node-block-type={dataCfNodeBlockType}>
        <Component {...componentProps} />
      </Tag>
    ) : (
      React.createElement(Component, props)
    );
    return component;
  };

  return Wrapped;
}
