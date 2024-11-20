'use client';
import { combineClasses } from '@/utils/combineClasses';
import React from 'react';
import './Text.css';
export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * The URL to navigate to when the text is clicked. When provided, the text will be wrapped in an anchor tag.
   * @default undefined
   * @optional
   * @example
   * ```tsx
   * <Text url="https://www.google.com" label="Go">My Text</Text>
   * ```
   */
  url?: string;
  /**
   * The target to use when navigating to the URL (if `url` is provided).
   * @default undefined
   * @optional
   * @example
   * ```tsx
   * <Text url="https://www.google.com" target="_blank" label="Go">My Text</Text>
   * ```
   */
  target?: string;
  /**
   * When `url` is provided, this function will be called instead of navigating to the URL. This allows the developer to handle the navigation themselves.
   * @default undefined
   * @optional
   * @example
   * ```tsx
   * <Text
   *   url="https://www.google.com"
   *   target="_blank"
   *   onNavigate={(url, target) => {
   *     // dev can now handle routing via code
   *   }}
   *   label="Go">
   *   My Text
   * </Text>
   * ```
   */
  onNavigate?: (url: string, target?: string) => void;
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

export const Text: React.FC<TextProps> = ({
  as = 'p',
  children,
  className,
  value,
  url,
  target,
  onNavigate,
  onClick,
  ...props
}) => {
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (onNavigate && url) {
      event.preventDefault();
      onNavigate(url, target);
    }
    onClick && onClick(event);
  };

  const Tag = as;

  const textAsTag = (
    <Tag
      className={combineClasses('cf-text', className)}
      onClick={handleClick}
      data-url={url}
      {...(target ? { 'data-target': target } : {})}
      {...props}>
      {value ? value : children}
    </Tag>
  );

  if (!url) {
    return textAsTag;
  }

  return (
    <a className="cf-text-link" href={url} {...(target ? { target } : {})}>
      {textAsTag}
    </a>
  );
};
