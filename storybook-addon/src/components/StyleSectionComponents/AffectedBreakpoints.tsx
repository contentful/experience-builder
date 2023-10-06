import React from 'react';
import { css } from 'emotion';
import { Flex, Text, Tooltip } from '@contentful/f36-components';
import tokens from '@contentful/f36-tokens';

const styles = {
  root: css({
    borderTop: `1px solid ${tokens.gray200}`,
    height: '50px',
    backgroundColor: tokens.gray100,
    flexShrink: 0,
  }),
  text: css({
    flexGrow: 1,
  }),
};

export const AffectedBreakpoints = () => {
  // const { breakpoints, isAffectingBreakpoint } = useBreakpointsContext();
  return (
    <Flex className={styles.root} padding="spacingM" gap="spacingXs" alignItems="center">
      <Text fontSize="fontSizeS" fontColor="gray600" className={styles.text}>
        Affected breakpoints
      </Text>
      {/* {breakpoints.map(({ id, displayName }) => {
        const [BreakpointIcon] = getBreakpointIcons(id);
        if (!isAffectingBreakpoint(id)) return null;
        return (
          <Tooltip key={id} placement="top" content={displayName}>
            <BreakpointIcon />
          </Tooltip>
        );
      })} */}
    </Flex>
  );
};
