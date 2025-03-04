import { combineClasses } from '@/utils/combineClasses';
import React from 'react';
import './Button.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The URL to navigate to when the button is clicked. When provided, the button will be wrapped in an anchor tag.
   * @default undefined
   * @optional
   * @example
   * ```tsx
   * <Button url="https://www.google.com" label="Go" />
   * ```
   */
  url?: string;
  /**
   * The target to use when navigating to the URL (if `url` is provided).
   * @default undefined
   * @optional
   * @example
   * ```tsx
   * <Button url="https://www.google.com" target="_blank" label="Go" />
   * ```
   */
  target?: string;
  /**
   * When `url` is provided, this function will be called instead of navigating to the URL. This allows the developer to handle the navigation themselves.
   * @default undefined
   * @optional
   * @example
   * ```tsx
   * <Button
   *  url="https://www.google.com"
   * target="_blank"
   * onNavigate={(url, target) => {
   * // dev can now do route via code
   * }}
   * label="Go"
   * />
   * ```
   */
  onNavigate?: (url: string, target?: string) => void;
  /**
   * The text to display in the button. If not provided, children will be used instead.
   * @default undefined
   * @optional
   * @example
   * ```tsx
   * <Button label="Go" />
   * ```
   */
  label?: string;
  /**
   * The children to display in the button. If label is provided, label will be used instead of this.
   * @default null
   * @optional
   * @example
   * ```tsx
   * <Button>Go</Button>
   * ```
   */
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  label,
  onClick,
  onNavigate,
  target,
  url,
  ...props
}) => {
  const classes = combineClasses('cf-button', className);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onNavigate && url) {
      event.preventDefault();
      onNavigate(url, target);
    }
    onClick && onClick(event);
  };

  const button = (
    <button
      className={classes}
      data-url={url}
      data-target={target}
      onClick={handleClick}
      {...props}>
      {label ? label : children}
    </button>
  );

  // FIXME: Wrapping <button> with <a> is not ARIA conform. Instead, <a> should look like a button.
  return url ? (
    <a href={url} target={target}>
      {button}
    </a>
  ) : (
    button
  );
};
