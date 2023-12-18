import React, { useEffect, useMemo, useState } from 'react';
import { TextInput, TextInputProps } from '@contentful/f36-components';

interface OpacityInputProps extends TextInputProps {
  rgbValue: string;
  opacity: string;
  onRgbChange: (newVal: string) => void;
}

const OPACITY_REGEX = /^(?:100|[1-9]\d?|0)%?$/;

export const OpacityInput = ({ rgbValue, opacity, onRgbChange, ...props }: OpacityInputProps) => {
  const parsedValue = useMemo(() => {
    return Number(opacity) * 100;
  }, [opacity]);

  const [tempValue, setTempValue] = useState(parsedValue + '%');

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setTempValue(event.target.value);
  };

  useEffect(() => {
    setTempValue(parsedValue + '%');
  }, [parsedValue]);

  // only really apply the value on blur
  const onBlur = () => {
    let newVal = `${parsedValue}`;
    // check if the value is between 0 and 100 and with a % or not.
    // if it is not valid, fall back to the previous value
    if (OPACITY_REGEX.test(tempValue)) {
      newVal = tempValue.replace(/%/g, '');
      onOpacityChanged(newVal);
    }
    setTempValue(newVal + '%');
  };

  const onOpacityChanged = (newOpacity: any) => {
    const updatedRgbaString: string = rgbValue.replace(
      /(rgba\([^,]+,[^,]+,[^,]+,)([^)]+)(\))/,
      '$1 ' + newOpacity / 100 + '$3'
    );
    onRgbChange(updatedRgbaString);
  };

  const onKeyUp = (e: any) => {
    // Submit the color value also on blur
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  return (
    <TextInput
      {...props}
      name="opacity"
      aria-label="Opacity"
      onBlur={onBlur}
      value={tempValue}
      onChange={onInputChange}
      onKeyUp={onKeyUp}
    />
  );
};
