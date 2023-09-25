import React from 'react';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /**
   * The text to display in the heading. If not provided, children will be used instead.
   * @default undefined
   * @optional
   * @example
   * ```tsx
   * <Heading text="My Heading" />
   * ```
   */
  text?: string;
  /**
   * The children to display in the heading. If text is provided, this will not be used.
   * @default null
   * @optional
   * @example
   * ```tsx
   * <Heading>My Heading</Heading>
   * ```
   */
  children?: React.ReactNode;
  /**
   * The type of heading to render
   * @default h1
   * @optional
   * @example
   * ```tsx
   * <Heading type="h1">My Heading</Heading>
   * ```
   */
  type?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const Heading: React.FC<HeadingProps> = ({ children, text, type = 'h1', ...props }) => {
  const Tag = type;
  return <Tag {...props}>{text ? text : children}</Tag>;
};
