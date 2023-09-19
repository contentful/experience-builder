import React from 'react';

export interface TextProps {
  /**
   * The text to display. If not provided, children will be used instead.
   * @default undefined
   * @optional
   * @example
   * ```tsx
   * <Text value="My Text" />
   * ```
   */
  value?: string;
  /**
   * The children to display. If text is provided, this will not be used.
   * @default null
   * @optional
   * @example
   * ```tsx
   * <Text>My Text</Text>
   * ```
   */
  children?: React.ReactNode;
  /**
   * Renders the text in a specific HTML tag.
   * @default p
   * @optional
   * @example
   * ```tsx
   * <Text as="span">My Text</Text>
   * ```
   */
  as?: 'p' | 'span' | 'div' | 'label' | 'caption' | 'small' | 'strong' | 'em';
}

export const Text: React.FC<TextProps> = ({ as = 'p', children, value }) => {
  const Tag = as;
  return <Tag>{value ? value : children}</Tag>;
};
