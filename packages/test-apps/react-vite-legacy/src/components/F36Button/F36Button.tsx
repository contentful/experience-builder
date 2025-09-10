import React from 'react';
import { Button } from '@contentful/f36-components';

interface F36ButtonProps {
  text: string;
  variant: 'primary' | 'secondary' | 'positive' | 'negative' | 'transparent';
  size: 'small' | 'medium' | 'large';
  isDisabled?: boolean;
  isFullWidth?: boolean;
  href?: string;
}

export const F36Button: React.FC<F36ButtonProps> = ({
  text,
  variant = 'primary',
  size = 'medium',
  isDisabled = false,
  isFullWidth = false,
  href,
  ...rest
}) => {
  const buttonProps = {
    variant,
    size,
    isDisabled,
    isFullWidth,
    ...rest,
  };

  if (href) {
    return (
      <Button {...buttonProps} as="a" href={href}>
        {text}
      </Button>
    );
  }

  return <Button {...buttonProps}>{text}</Button>;
};

export default F36Button;
