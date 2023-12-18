import React from 'react';
import { css } from 'emotion';
import { RgbaStringColorPicker } from 'react-colorful';
import { Flex } from '@contentful/f36-components';
import { useRgbaToHex } from './colorUtils';
import { OpacityInput } from './OpacityInput';
import { HexInput } from './HexInput';
import tokens from '@contentful/f36-tokens';

const styles = {
  colorPicker: css({
    ['.react-colorful']: {
      display: 'flex',
      gap: tokens.spacingS,
      width: '100%',
    },
    ['.react-colorful__saturation']: {
      borderRadius: tokens.spacingXs,
    },
    ['.react-colorful__pointer']: {
      height: tokens.spacingM,
      width: tokens.spacingM,
    },

    ['.react-colorful__hue']: {
      borderRadius: tokens.spacingS,
      height: tokens.spacingS,
    },
    ['.react-colorful__alpha']: {
      borderRadius: tokens.spacingS,
      height: tokens.spacingS,
    },
  }),
};

type ColorPickerProps = {
  value: string;
  onChange: (color: string) => void;
};

export const ColorPicker = ({ value, onChange }: ColorPickerProps) => {
  const [hexVal, opacity] = useRgbaToHex(value);

  return (
    <Flex padding="spacingM" gap="spacingS" flexDirection="column" className={styles.colorPicker}>
      <RgbaStringColorPicker color={value} onChange={onChange} />
      <Flex gap="spacingS">
        <HexInput rgbValue={value} hexValue={hexVal} onRgbChange={onChange} />
        <OpacityInput rgbValue={value} opacity={opacity} onRgbChange={onChange} />
      </Flex>
    </Flex>
  );
};
