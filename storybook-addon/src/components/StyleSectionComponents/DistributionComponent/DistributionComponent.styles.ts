import tokens from '@contentful/f36-tokens';
import { css } from 'emotion';

export const styles = {
  label: css({
    display: 'inline-block',
    padding: `${tokens.spacingXs} 0`,
    color: tokens.gray500,
    fontWeight: tokens.fontWeightNormal,
    marginBottom: 0,
  }),
  iconBorderRadiusLeft: css({
    borderRadius: '3px 0px 0px 3px',
  }),
  iconBorderRadiusRight: css({
    borderLeft: 'none',
    borderRadius: '0px 3px 3px 0px',
  }),
  selectedDirection: css({
    backgroundColor: tokens.blue100,
    ':hover': {
      backgroundColor: tokens.blue200,
    },
    '& svg path': {
      fill: tokens.blue600,
    },
  }),
  gapIconColumn: css({
    marginRight: tokens.spacing2Xs,
    marginTop: tokens.spacingXs,
  }),
  gapIconRow: css({
    marginTop: tokens.spacing2Xs,
    marginRight: tokens.spacing2Xs,
    marginLeft: tokens.spacingS,
  }),
};
