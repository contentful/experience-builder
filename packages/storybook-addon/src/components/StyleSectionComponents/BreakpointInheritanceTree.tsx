import React from 'react';
import { cx, css } from 'emotion';
import { Flex, IconButton, Text } from '@contentful/f36-components';
import tokens from '@contentful/f36-tokens';
import { MoreVerticalTrimmedIcon } from '@contentful/f36-icons';

const styles = {
  menuButton: css({
    marginRight: '-12px',
  }),
  treePanel: css({
    position: 'relative',
    background: tokens.gray100,
    borderRadius: tokens.borderRadiusSmall,
    border: `1px solid ${tokens.gray300}`,
  }),
  orderTitle: css({
    position: 'absolute',
    top: tokens.spacingXs,
    right: tokens.spacingXs,
  }),
  breakpointRow: css({
    height: '32px',
  }),
  treeLine: css({
    marginRight: '6px',
    width: '2px',
    background: tokens.gray400,
    borderRadius: '1px',
    height: 'calc(100% + 2px)',
    marginBottom: '-2px',
  }),
  treeLineLast: css({
    height: `calc(100% - 8px)`,
    marginTop: `-6px`,
    marginBottom: 0,
  }),
};

export const BreakpointInheritanceTree = () => {
  // const { breakpoints } = useBreakpointsContext();

  return (
    <div>
      <Flex justifyContent="space-between" alignItems="center" marginBottom="spacing2Xs">
        <Text fontColor="gray700" fontWeight="fontWeightMedium">
          Breakpoints
        </Text>
        <IconButton
          isDisabled
          variant="transparent"
          size="small"
          icon={<MoreVerticalTrimmedIcon />}
          aria-label="Open binding menu"
          title="Not implemented yet"
          className={styles.menuButton}
        />
      </Flex>
      <Flex className={styles.treePanel} flexDirection="column" marginBottom="spacingXs">
        {/* {breakpoints.map(({ id, displayName, query }, index) => {
          const title = query === '*' ? displayName : query;
          const [BreakpointIcon] = getBreakpointIcons(id);
          return (
            <Flex
              key={id}
              gap="spacingXs"
              className={styles.breakpointRow}
              alignItems="center"
              paddingLeft="spacingXs">
              {Array.from(Array(index).keys()).map((separatorIndex) => (
                <div
                  key={separatorIndex}
                  className={cx(styles.treeLine, {
                    [styles.treeLineLast]: index == breakpoints.length - 1,
                  })}
                />
              ))}
              <BreakpointIcon />
              <Text fontColor="gray600">{title}</Text>
            </Flex>
          );
        })} */}
        <Text fontColor="gray400" className={styles.orderTitle}>
          Desktop first
        </Text>
      </Flex>
      <Text fontColor="gray600" fontSize="fontSizeM">
        Design changes will apply to all screen sizes that are equal or smaller than the displayed
        one.
      </Text>
    </div>
  );
};
