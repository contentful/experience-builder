import React from 'react';
import { Button } from '@contentful/f36-components';
import './F36Button.css';

interface F36ButtonProps {
  text: string;
  variant: 'primary' | 'secondary' | 'positive' | 'negative' | 'transparent' | 'white';
  size: 'small' | 'medium' | 'large';
  isDisabled?: boolean;
  isFullWidth?: boolean;
  href?: string;
  children?: React.ReactNode;
  isCircular?: boolean;
  noInnerPadding?: boolean;
}

export const F36Button: React.FC<F36ButtonProps> = ({
  text,
  variant = 'primary',
  size = 'small',
  isDisabled = false,
  isFullWidth = false,
  href,
  children,
  isCircular = false,
  noInnerPadding = false,
  ...rest
}) => {
  const isCustomWhite = variant === 'white';
  const buttonVariant = isCustomWhite ? 'secondary' : variant; // map to a supported base variant

  const className =
    [
      isCustomWhite ? 'f36-button--white' : null,
      isCircular ? 'f36-button--circle' : null,
      noInnerPadding ? 'f36-button--no-padding' : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

  const buttonProps = {
    variant: buttonVariant as 'primary' | 'secondary' | 'positive' | 'negative' | 'transparent',
    size,
    isDisabled,
    isFullWidth,
    className,
    ...rest,
  };

  const baseContent = children ?? text;
  const content =
    isCircular && !children && typeof baseContent === 'string'
      ? baseContent.charAt(0)
      : baseContent;

  if (href) {
    return (
      <Button {...buttonProps} as="a" href={href}>
        {content}
      </Button>
    );
  }

  return <Button {...buttonProps}>{content}</Button>;
};

export default F36Button;
