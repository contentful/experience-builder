import { ComponentRegistration } from '@contentful/experiences-core/types';
import React from 'react';
import {
  DragWrapper,
  DragWrapperProps,
  WrapperTags,
} from '@contentful/experiences-components-react';

interface CFProps {
  /**
   * Classes to be applied to the container component if `wrapComponent` is true, or directly to the child component if false.
   */
  className?: string;
  /**
   * Classes to be applied to the child component if `wrapComponent` is true, or directly to the child component if false.
   */
  classes?: string;
  dragProps?: DragWrapperProps;
}

/**
 * Sets up a component to be consumed by Experience Builder. This function can be used to wrap a component with a container component, or to pass props to the component directly.
 * @param Component Component to be used by Experience Builder.
 * @param options Options for the `withComponentWrapper` function.
 * @default { wrapComponent: true, wrapContainerTag: 'div' }
 * @returns A component that can be passed to `defineComponents`.
 */
export function withComponentWrapper<T extends object>(
  Component: React.ElementType,
  options: ComponentRegistration['options'] = {
    wrapComponent: true,
    wrapContainerTag: 'div',
    wrapContainer: 'div',
  },
) {
  const Wrapped = ({ classes = '', className = '', dragProps = {}, ...props }: CFProps & T) => {
    const component = options.wrapComponent ? (
      <DragWrapper
        className={className}
        Tag={options.wrapContainerTag as WrapperTags}
        {...dragProps}>
        <Component className={className + ' ' + classes} {...(props as T)} />
      </DragWrapper>
    ) : (
      React.createElement(Component, {
        className: classes + className ? classes + ' ' + className : undefined,
        ...(props as T),
      })
    );
    return component;
  };

  return Wrapped;
}
