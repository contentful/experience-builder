import { css } from 'emotion';
import tokens from '@contentful/f36-tokens';

export const styles = {
  workbenchContainer: css({
    flexGrow: 1,
  }),
  sidebar: css({
    padding: '0',
    paddingLeft: tokens.spacingXs,
    paddingRight: tokens.spacingXs,
    flex: '0 0 320px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    height: 'calc(100vh - 40px)',
    width: '100%',
  }),
  componentSidebar: css({
    padding: '0',
  }),
  mainContent: css({
    flex: '1 1 auto',
    padding: 0,
    backgroundColor: tokens.gray100,
    backgroundImage: `radial-gradient(${tokens.gray200} 1px, transparent 0)`,
    backgroundSize: '20px 20px',
    backgroundPosition: '-19px -19px',
    // div in Workbench.Content
    '& > div': {
      display: 'flex',
      justifyContent: 'center',
      height: '100%',
      minHeight: '100%',
    },
  }),
  heading: css({
    lineHeight: tokens.lineHeightDefault,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: tokens.fontSizeXl,
    marginBottom: tokens.spacing2Xs,
  }),
  header: css({
    backgroundColor: 'white',
  }),
  controlsGap: css({
    columnGap: tokens.spacingS,
  }),
  tabList: css({
    justifyContent: 'center',
    gap: tokens.spacing2Xs,
  }),
  tabPanel: css({
    flex: '1 0 0',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
  }),
  componentTabs: css({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  }),
  componentIndividualTab: css({
    userSelect: 'none',
  }),
};
