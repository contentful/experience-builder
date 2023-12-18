import { useMemo } from 'react';

const rgbToHex = (r: number, g: number, b: number) =>
  [r, g, b]
    .map((x) => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    })
    .join('');

export const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : null;
};

export const useRgbaToHex = (rgba: string) => {
  const [hexVal, opacity] = useMemo(() => {
    const rgb = rgba.replace(/[^\d,.]/g, '').split(',');
    if (rgb.length !== 4) return rgba;
    const hexVal = rgbToHex(parseInt(rgb[0]), parseInt(rgb[1]), parseInt(rgb[2]));
    return [hexVal, rgb[3]];
  }, [rgba]);

  return [hexVal, opacity];
};
