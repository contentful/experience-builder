import React, { useState } from 'react';
import { css } from 'emotion';
import { Button, Flex, Grid, Popover } from '@contentful/f36-components';
import { useRgbaToHex } from './colorUtils';
import { OpacityInput } from './OpacityInput';
import { HexInput } from './HexInput';
import tokens from '@contentful/f36-tokens';
import { ColorPicker } from './ColorPicker';

const styles = {
  colorPickerTrigger: (color: string) =>
    css({
      // Overwrite color for hover/ active/ focus
      backgroundColor: `${color} !important`,
      width: tokens.spacing2Xl,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      border: `1px solid ${tokens.gray300}`,
      borderRight: 'none',
      '&:focus': css({
        // Make the focus box shadow render above the neighbouring elements
        zIndex: 2,
      }),
    }),
  inlineHexInput: css({
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  }),
};

type ColorInputProps = {
  value: string;
  onChange: (color: string) => void;
};

export const ColorInput = ({ value, onChange }: ColorInputProps) => {
  const [hexValue, opacity] = useRgbaToHex(value);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Grid columnGap="spacingXs" columns="auto 72px">
      <Flex>
        <Popover isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <Popover.Trigger>
            <Button
              aria-label="Open color picker"
              title="Open color picker"
              onClick={() => setIsOpen((prevState) => !prevState)}
              className={styles.colorPickerTrigger(value)}
            />
          </Popover.Trigger>
          <Popover.Content>
            <ColorPicker value={value} onChange={onChange} />
          </Popover.Content>
        </Popover>
        <HexInput
          className={styles.inlineHexInput}
          rgbValue={value}
          hexValue={hexValue}
          onRgbChange={onChange}
        />
      </Flex>
      <OpacityInput rgbValue={value} opacity={opacity} onRgbChange={onChange} />
    </Grid>
  );
};
