import React, { MouseEventHandler, forwardRef } from 'react';
import type * as CSS from 'csstype';

export interface FlexProps {
  /**
   * Child nodes to be rendered in the component */
  children?: React.ReactNode;
  /**
   * A shorthand property for flex-grow, flex-shrink, flex-basis
   */
  flex?: CSS.Property.Flex;
  /**
   * Defines the initial size of a flexbox item.
   * */
  flexBasis?: CSS.Property.FlexBasis;
  /**
   * Defines how much a flexbox item should shrink if there's not enough space available. */
  flexShrink?: CSS.Property.FlexShrink;
  /**
   * Defines if flexbox items appear on a single line or on multiple lines within a flexbox container. */
  flexWrap?: CSS.Property.FlexWrap;
  /**
   * Defines how flexbox items are ordered within a flexbox container. */
  flexDirection?: CSS.Property.FlexDirection;
  /**
   * Defines how much a flexbox item should grow if there's space available. */
  flexGrow?: CSS.Property.FlexGrow;
  /**
   * Defines a gap between flexbox items. */
  gap?: string;
  /**
   * Defines how flexbox/grid items are aligned according to the main axis, within a flexbox/grid container. */
  justifyContent?: CSS.Property.JustifyContent;
  /**
   * Defines the default justify-self for all items of the box, giving them all a default way of justifying each box along the appropriate axis. */
  justifyItems?: CSS.Property.JustifyContent;
  /**
   * Sets the way a box is justified inside its alignment container along the appropriate axis. */
  justifySelf?: CSS.Property.JustifySelf;
  /**
   * Defines how flexbox items are aligned according to the cross axis, within a line of a flexbox container.
   */
  alignItems?: CSS.Property.AlignItems;
  /**
   * Works like align-items, but applies only to a single flexbox item, instead of all of them.
   */
  alignSelf?: CSS.Property.AlignItems;
  /**
   * Defines how each line is aligned within a flexbox/grid container.
   */
  alignContent?: CSS.Property.AlignContent;
  /**
   * Defines the order of a flexbox item
   */
  order?: CSS.Property.Order;
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: MouseEventHandler<HTMLDivElement>;
  onMouseUp?: MouseEventHandler<HTMLDivElement>;
  onMouseDown?: MouseEventHandler<HTMLDivElement>;
  onClick?: MouseEventHandler<HTMLDivElement>;
  className?: string;
  cssStyles?: Record<string, string>;
  id?: string;
}

export const Flex = forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      id,
      children,
      onMouseEnter,
      onMouseUp,
      onMouseLeave,
      onMouseDown,
      onClick,
      flex,
      flexBasis,
      flexShrink,
      flexDirection,
      gap,
      justifyContent,
      justifyItems,
      justifySelf,
      alignItems,
      alignSelf,
      alignContent,
      order,
      flexWrap,
      flexGrow,
      className,
      cssStyles,
      ...props
    },
    ref
  ) => {
    return (
      <div
        id={id}
        ref={ref}
        style={{
          display: 'flex',
          flex,
          flexBasis,
          flexShrink,
          flexDirection,
          gap,
          justifyContent,
          justifyItems,
          justifySelf,
          alignItems,
          alignSelf,
          alignContent,
          order,
          flexWrap,
          flexGrow,
          ...cssStyles,
        }}
        className={className}
        onMouseEnter={onMouseEnter}
        onMouseUp={onMouseUp}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
        {...props}>
        {children}
      </div>
    );
  }
);
Flex.displayName = 'Flex';
