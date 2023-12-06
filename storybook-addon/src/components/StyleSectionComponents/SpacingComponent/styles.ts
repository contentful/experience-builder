import tokens from '@contentful/f36-tokens';
import { css } from 'emotion';

const gridStyles = {
  background: tokens.gray100,
  padding: tokens.spacing2Xs,
  borderRadius: tokens.borderRadiusSmall,
  border: `1px solid ${tokens.gray300}`,
  display: 'grid',
  rowGap: tokens.spacing2Xs,
  columnGap: tokens.spacing2Xs,
};
export const styles = {
  marginGrid: css({
    ...gridStyles,
    gridTemplateAreas: `
      'text . marginTop . .'
      '. paddingGrid paddingGrid paddingGrid .'
      'marginLeft paddingGrid paddingGrid paddingGrid marginRight'
      '. paddingGrid paddingGrid paddingGrid .'
      '. . marginBottom . .'
    `,
    gridTemplateColumns: `repeat(5, 1fr)`,
    gridTemplateRows: '1fr',
  }),
  marginGridStandalone: css({
    ...gridStyles,
    gridTemplateAreas: `
      'text . marginTop . .'
      'marginLeft centralCell centralCell centralCell marginRight'
      '. . marginBottom . .'
    `,
    gridTemplateColumns: `repeat(5, 1fr)`,
    gridTemplateRows: '1fr',
  }),
  paddingGrid: css({
    ...gridStyles,
    gridTemplateAreas: `
      'text paddingTop .'
      'paddingLeft centralCell paddingRight'
      '. paddingBottom .'
    `,
    gridTemplateColumns: `repeat(3, 1fr)`,
    gridTemplateRows: '1fr',
  }),
  paddingGridStandalone: css({
    ...gridStyles,
    gridTemplateAreas: `
      'text . paddingTop . .'
      'paddingLeft centralCell centralCell centralCell paddingRight'
      '. . paddingBottom . .'
    `,
    gridTemplateColumns: `repeat(5, 1fr)`,
    gridTemplateRows: '1fr',
  }),
  centralCell: css({
    borderRadius: tokens.borderRadiusSmall,
    border: `1px solid ${tokens.gray300}`,
  }),
  cellWithText: css({
    gridArea: 'text',
    display: 'grid',
    alignItems: 'center',
    justifyItems: 'center',
    color: tokens.gray300,
    fontSize: '12px',
    alignSelf: 'flex-start',
    justifySelf: 'flex-start',
  }),
  input: css({
    fontSize: '12px',
    textAlign: 'center',
    appearance: 'none',
    '&::-webkit-inner-spin-button': {
      appearance: 'none',
      margin: 0,
    },
  }),
  inputBlank: css({
    color: tokens.gray300,
    width: '50px',
    borderBottom: `1px solid ${tokens.gray300}`,
  }),
};
