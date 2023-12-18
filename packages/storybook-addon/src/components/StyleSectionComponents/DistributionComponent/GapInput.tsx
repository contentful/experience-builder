import React, { KeyboardEventHandler } from 'react';
import { TextInput } from '@contentful/f36-components';

type GapInputProps = {
  value: string;
  onGapChange: (newVal: string) => void;
  onGapBlur: () => void;
  'aria-label': string;
};

export const GapInput = ({
  value,
  onGapChange,
  onGapBlur,
  'aria-label': ariaLabel,
}: GapInputProps) => {
  const onKeyUp: KeyboardEventHandler<HTMLElement> = (event) => {
    if (event.key === 'Enter' && event.target instanceof HTMLElement) {
      event.target.blur();
    }
  };
  return (
    <TextInput
      size="small"
      value={value}
      onChange={(e) => onGapChange(e.target.value)}
      onBlur={onGapBlur}
      onKeyUp={onKeyUp}
      aria-label={ariaLabel}
    />
  );
};
