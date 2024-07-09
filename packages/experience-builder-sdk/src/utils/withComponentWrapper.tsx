import { BehaviorDefinition, ComponentRegistration } from '@contentful/experiences-core/types';
import classNames from 'classnames';
import React from 'react';
import { behaviorRegistry } from '../core/componentRegistry';
interface CFProps extends React.HtmlHTMLAttributes<HTMLElement> {
  /**
   * Classes to be applied to the container component if `wrapComponent` is true, or directly to the child component if false.
   */
  className?: string;
  /**
   * Classes to be applied to the child component if `wrapComponent` is true, or directly to the child component if false.
   */
  classes?: string;
  dragProps?: any;
}

/**
 * Sets up a component to be consumed by Experience Builder. This function can be used to wrap a component with a container component, or to pass props to the component directly.
 * @param Component Component to be used by Experience Builder.
 * @param options Options for the `withComponentWrapper` function.
 * @default { wrapComponent: true, wrapContainerTag: 'div' }
 * @returns A component that can be passed to `defineComponents`.
 */
export function withComponentWrapper<T>(
  Component: React.ElementType,
  options: ComponentRegistration['options'] = {
    wrapComponent: true,
    wrapContainerTag: 'div',
    wrapContainer: 'div',
  },
  behaviors: Record<string, BehaviorDefinition> = {},
) {
  const Wrapped: React.FC<CFProps & T> = ({
    classes = '',
    className = '',
    dragProps = {},
    ...props
  }) => {
    const {
      innerRef,
      className: dragClassName,
      ToolTipAndPlaceholder,
      ...restOfDragProps
    } = dragProps;

    const onClickHandler = () => {
      Object.entries(behaviors).forEach(([key, value]) => {
        const behaviorRegistration = behaviorRegistry.get(key);
        if (!behaviorRegistration) {
          return;
        }

        const { behavior } = behaviorRegistration;
        behavior(value);
      });
    };

    const component = options.wrapComponent ? (
      <div
        data-component-wrapper
        className={classNames(classes, className, dragClassName)}
        {...restOfDragProps}
        ref={(refNode: HTMLElement | null) => {
          if (innerRef && refNode) innerRef(refNode);
        }}
        onClick={onClickHandler}
        {...props}>
        {ToolTipAndPlaceholder}
        <Component className={classNames(classes)} {...(props as T)} />
      </div>
    ) : (
      React.createElement(Component, {
        className: classNames(classes, className),
        onClick: onClickHandler,
        ...(props as T),
      })
    );
    return component;
  };

  return Wrapped;
}
