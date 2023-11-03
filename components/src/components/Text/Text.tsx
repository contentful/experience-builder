import { combineClasses } from '@/utils/combineClasses';
import React from 'react';

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
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
   * The children to display in the text. If text is provided, text will be used instead of this.
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
   * <Text>My Text</Text>
   * ```
   */
  as?: 'p' | 'span' | 'div' | 'label' | 'caption' | 'small' | 'strong' | 'em';
}

export const Text: React.FC<TextProps> = ({ as = 'p', children, className, value, ...props }) => {
  const classes = combineClasses('cf-text', className);
  const Tag = as;
  return (
    <Tag className={classes} {...props}>
      {value ? value : children}
    </Tag>
  );
};
