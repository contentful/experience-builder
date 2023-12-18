import React, { useEffect, useState } from 'react';
import { TextInput, TextInputProps } from '@contentful/f36-components';
import { hexToRgb } from './colorUtils';
import { css, cx } from 'emotion';

const styles = {
  root: css({
    textTransform: 'uppercase',
  }),
};
interface HexInputProps extends TextInputProps {
  rgbValue: string;
  hexValue: string;
  onRgbChange: (newVal: string) => void;
}

const HEX_REGEX = /^#?[0-9a-fA-F]{6}$/;

export const HexInput = ({ rgbValue, hexValue, onRgbChange, ...props }: HexInputProps) => {
  const [tempValue, setTempValue] = useState('#' + hexValue);

  const onInputChange = (e: any) => {
    setTempValue(e.target.value);
  };

  useEffect(() => {
    setTempValue(hexValue);
  }, [hexValue]);

  // only really apply the value on blur
  const onBlur = () => {
    let newValue = hexValue;
    // check if the value is a correct hex value.
    // if it is not valid, fall back to the previous value
    if (HEX_REGEX.test(tempValue)) {
      newValue = tempValue.replace(/#/g, '');
      onHexColorChanged(newValue);
    }
    setTempValue(newValue);
  };

  const onHexColorChanged = (hexValue: string) => {
    const rbgArray = hexToRgb(hexValue);

    if (!rbgArray) return;

    const updatedRgbaString = rgbValue.replace(
      /(rgba\()([^,]+,[^,]+,[^,]+)(,[^)]+)(\))/,
      (_, prefix, __, opacity, suffix) => {
        const rgbString = rbgArray.join(', ');
        return prefix + rgbString + opacity + suffix;
      }
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
      name="color"
      aria-label="Color"
      className={cx(styles.root, props.className)}
      onBlur={onBlur}
      value={tempValue}
      onChange={onInputChange}
      onKeyUp={onKeyUp}
    />
  );
};
