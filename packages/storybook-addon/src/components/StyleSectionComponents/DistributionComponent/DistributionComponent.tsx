import React from 'react';
import { ComponentDefinitionVariable } from '@contentful/experience-builder';
import { Checkbox, Flex, IconButton, Text, Box } from '@contentful/f36-components';
import IconFlexDirectionRow from '@svg/composition/FlexDirectionRow.svg';
import IconFlexDirectionColumn from '@svg/composition/FlexDirectionColumn.svg';
import IconColumnGap from '@svg/composition/ColumnGap.svg';
import IconRowGap from '@svg/composition/RowGap.svg';
import { useGapValue } from './useGapValue';
import { styles } from './DistributionComponent.styles';
import { useVariableState } from '@/hooks/useVariableState';
import { cx } from 'emotion';
import { GapInput } from './GapInput';

const flexDirectionVariableName = 'cfFlexDirection';
const flexWrapVariableName = 'cfFlexWrap';

type DistributionComponentProps = {
  gap?: ComponentDefinitionVariable<'Text'>;
  flexDirection?: ComponentDefinitionVariable<'Text'>;
  flexWrap?: ComponentDefinitionVariable<'Text'>;
};

export const DistributionComponent = ({
  flexDirection,
  gap,
  flexWrap,
}: DistributionComponentProps) => {
  const [flexDirectionValue, setFlexDirectionValue] = useVariableState({
    variableDefinition: flexDirection,
    variableName: flexDirectionVariableName,
  });
  const [flexWrapValue, setFlexWrapValue] = useVariableState({
    variableDefinition: flexWrap,
    variableName: flexWrapVariableName,
  });
  // Seperate wrapper around useVariableState that handles blurring and resetting temporary values
  const {
    gapBufferValue,
    onRowGapValueChange,
    onColumnGapValueChange,
    onRowGapBlur,
    onColumnGapBlur,
  } = useGapValue({ gap });

  return (
    <Flex flexDirection="column" marginBottom="spacingXs">
      {flexDirection && (
        <Flex justifyContent="space-between" alignItems="center" marginBottom="spacingXs">
          <Text className={styles.label}>{flexDirection.displayName}</Text>
          <Flex>
            <IconButton
              icon={<IconFlexDirectionColumn />}
              variant="secondary"
              size="small"
              title="Column"
              aria-label="Column"
              onClick={() => setFlexDirectionValue('column')}
              className={cx(styles.iconBorderRadiusLeft, {
                [styles.selectedDirection]: flexDirectionValue === 'column',
              })}
            />
            <IconButton
              icon={<IconFlexDirectionRow />}
              variant="secondary"
              size="small"
              title="Row"
              aria-label="Row"
              onClick={() => setFlexDirectionValue('row')}
              className={cx(styles.iconBorderRadiusRight, {
                [styles.selectedDirection]: flexDirectionValue === 'row',
              })}
            />
          </Flex>
        </Flex>
      )}
      {gap && (
        <Flex justifyContent="space-between" alignItems="center" marginBottom="spacingXs">
          <Flex alignItems="center">
            <Box as="span" className={styles.gapIconColumn}>
              <IconColumnGap />
            </Box>
            <GapInput
              value={gapBufferValue.columnGap}
              onGapChange={(value) => onColumnGapValueChange(value)}
              onGapBlur={onColumnGapBlur}
              aria-label="Vertical gap between elements"
            />
          </Flex>
          <Flex alignItems="center">
            <Box as="span" className={styles.gapIconRow}>
              <IconRowGap />
            </Box>
            <GapInput
              value={gapBufferValue.rowGap}
              onGapChange={(value) => onRowGapValueChange(value)}
              onGapBlur={onRowGapBlur}
              aria-label="Horizontal gap between elements"
            />
          </Flex>
        </Flex>
      )}
      {flexWrap && (
        <Flex>
          <Checkbox
            name="wrap-objects"
            key="wrap-objects"
            isChecked={flexWrapValue === 'wrap'}
            onChange={() => setFlexWrapValue(flexWrapValue === 'wrap' ? 'nowrap' : 'wrap')}>
            <Text className={styles.label}>{flexWrap.displayName}</Text>
          </Checkbox>
        </Flex>
      )}
    </Flex>
  );
};
