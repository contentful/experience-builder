import React from 'react';
import { Button } from '@contentful/f36-components';

interface F36ButtonProps {
  text: string;
  variant: 'primary' | 'secondary' | 'positive' | 'negative' | 'transparent';
  size: 'small' | 'medium' | 'large';
  isDisabled?: boolean;
  isFullWidth?: boolean;
  href?: string;
  children?: React.ReactNode;
}

export const F36Button: React.FC<F36ButtonProps> = ({
  variant = 'primary',
  size = 'small',
  isDisabled = false,
  isFullWidth = false,
  href,
  children,
  ...rest
}) => {
  const buttonProps = {
    variant,
    size,
    isDisabled,
    isFullWidth,
    ...rest,
  };

  const content = children;

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
