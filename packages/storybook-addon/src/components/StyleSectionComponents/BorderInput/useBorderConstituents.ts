import { useMemo } from 'react';
import { LengthRegExp, BorderStyleRegExp } from '../constants';

// This only supports '0', 'none' or a full string with all three constituent CSS properties
export const useBorderConstituents = (borderValue: string) => {
  const [borderWidth, borderStyle, borderColor] = useMemo(() => {
    if (borderValue === '0' || borderValue === 'none') {
      // The ColorPicker doesn't support the alpha channel in hexcodes, so we just leave it out per default
      return ['0px', 'inside', 'rgba(255, 255, 255, 1)'];
    }
    // To reuse the existing partial regex patterns, we first split it into three substrings
    const constituents = borderValue.split(' ');
    if (constituents.length < 3) {
      // The border value is not valid -> per default set no border
      return ['0px', 'inside', 'rgba(255, 255, 255, 1)'];
    }
    // We only support setting the same line width and style for all sides
    if (!LengthRegExp.test(constituents[0]) || !BorderStyleRegExp.test(constituents[1])) {
      // If any value is invalid, all parts fall back to the default
      return ['0px', 'inside', 'rgba(255, 255, 255, 1)'];
    }
    const borderWidth = constituents[0];
    const borderStyle = constituents[1];
    // The validation of the color (and replacement by default value) is done in the ColorInput
    const borderColor = constituents.slice(2).join(' ');
    return [borderWidth, borderStyle, borderColor];
  }, [borderValue]);

  return [borderWidth, borderStyle, borderColor] as [string, string, string];
};
