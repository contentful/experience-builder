import React from 'react';
import { Select } from '@contentful/f36-components';

interface F36SelectProps {
  options: string;
  placeholder?: string;
  value?: string;
  label?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
  size?: 'small' | 'medium';
}

export const F36Select: React.FC<F36SelectProps> = ({
  options = '',
  placeholder = 'Select an option',
  value = '',
  label,
  isRequired = false,
  isDisabled = false,
  isInvalid = false,
  size = 'medium',
  ...rest
}) => {
  // Parse options from comma-separated string
  const parsedOptions = options
    ? options
        .split(',')
        .map((o: string) => o.trim())
        .filter(Boolean)
    : [];

  return (
    <Select
      defaultValue={value}
      aria-label={label || placeholder}
      isRequired={isRequired}
      isDisabled={isDisabled}
      isInvalid={isInvalid}
      size={size}
      {...rest}>
      {placeholder && (
        <Select.Option value="" isDisabled>
          {placeholder}
        </Select.Option>
      )}
      {parsedOptions.map((option: string, index: number) => (
        <Select.Option key={index} value={option}>
          {option}
        </Select.Option>
      ))}
    </Select>
  );
};

export default F36Select;
