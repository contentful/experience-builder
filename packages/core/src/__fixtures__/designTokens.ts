import { DesignTokensDefinition } from '../types';

export const designTokensFixture: DesignTokensDefinition = {
  color: {
    bg: 'white',
    font: 'black',
    danger: 'red',
    warning: 'orange',
    success: 'green',
  },
  spacing: {
    xs: '0.5 rem',
    s: '1rem',
    m: '1.5rem',
    l: '2rem',
  },
  sizing: {
    quarter: '25%',
    half: '50%',
    threeQuarters: '75%',
    full: '100%',
  },
  border: {
    borderless: {
      width: '0px',
      style: 'solid',
      color: 'transparent',
    },
    default: {
      width: '1px',
      style: 'solid',
      color: 'black',
    },
    bold: {
      width: '3px',
      style: 'solid',
      color: 'black',
    },
  },
  fontSize: {
    default: '1rem',
    small: '0.75rem',
    large: '1.5rem',
  },
  lineHeight: {
    default: '1.5',
    small: '1.25',
    large: '2',
  },
  letterSpacing: {
    default: 'normal',
    tight: '0.5px',
    wide: '2px',
  },
  textColor: {
    default: 'black',
    muted: 'gray',
    accent: 'blue',
  },
};
