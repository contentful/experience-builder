import tokens from '@contentful/f36-tokens';
import { css } from 'emotion';

export const styles = {
  grid: css({ alignItems: 'center' }),
  textField: (isValid: boolean) =>
    css({
      borderRight: 0,
      paddingLeft: tokens.spacingXs,
      paddingRight: tokens.spacingXs,
      width: '70%',
      appearance: 'none',
      WebkitAppearance: 'none',
      ':focus': {
        boxShadow: `-2px 0px 0px 2px ${isValid ? tokens.blue300 : tokens.red300}`,
      },
      '&::-webkit-inner-spin-button': {
        appearance: 'none',
        margin: 0,
      },
      ':active:hover': {
        boxShadow: `-2px 0px 0px 2px ${isValid ? tokens.blue300 : tokens.red300}`,
      },
    }),
  unitInput: (isNumberInputFocused: boolean, isValid: boolean) =>
    css({
      borderLeft: 0,
      width: '30%',
      fontSize: tokens.fontSizeM,
      paddingLeft: tokens.spacing2Xs,
      paddingRight: tokens.spacing2Xs,
      textAlign: 'center',
      background: 'transparent',
      fontWeight: 400,
      color: tokens.gray400,
      // spreading this conditionally so it doesn't override the elements normal border color
      ...(isNumberInputFocused && isValid && { borderColor: tokens.blue600 }),

      // added to override custom specificity styling of component
      '&:not(:focus)': {
        boxShadow: isNumberInputFocused
          ? `2px 0px 0px 2px ${isValid ? tokens.blue300 : tokens.red300} !important`
          : 'none',
      },
    }),
};
