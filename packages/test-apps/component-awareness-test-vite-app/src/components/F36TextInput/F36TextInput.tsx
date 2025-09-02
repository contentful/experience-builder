import React from 'react';
import { TextInput } from '@contentful/f36-components';

interface F36TextInputProps {
  placeholder?: string;
  value?: string;
  label?: string;
  helpText?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
  size?: 'small' | 'medium';
  type?: 'text' | 'email' | 'password' | 'url' | 'tel' | 'number';
}

export const F36TextInput: React.FC<F36TextInputProps> = ({
  placeholder = '',
  value = '',
  label,
  isRequired = false,
  isDisabled = false,
  isInvalid = false,
  size = 'medium',
  type = 'text',
  ...rest
}) => {
  return (
    <TextInput
      placeholder={placeholder}
      defaultValue={value}
      aria-label={label || placeholder}
      isRequired={isRequired}
      isDisabled={isDisabled}
      isInvalid={isInvalid}
      size={size}
      type={type}
      {...rest}
    />
  );
};

export default F36TextInput;
