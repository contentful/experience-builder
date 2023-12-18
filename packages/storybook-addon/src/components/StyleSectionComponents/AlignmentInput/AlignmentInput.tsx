import { ComponentDefinitionVariable } from '@contentful/experience-builder';
import { ButtonGroup, Text, IconButton, Flex } from '@contentful/f36-components';
import { css, cx } from 'emotion';
import React from 'react';
import AlignLeft from '@svg/composition/AlignLeft.svg';
import AlignRight from '@svg/composition/AlignRight.svg';
import AlignTop from '@svg/composition/AlignTop.svg';
import AlignBottom from '@svg/composition/AlignBottom.svg';
import AlignCenterHorizontal from '@svg/composition/AlignCenterHorizontal.svg';
import AlignCenterVertical from '@svg/composition/AlignCenterVertical.svg';
import tokens from '@contentful/f36-tokens';
import { useVariableState } from '@/hooks/useVariableState';

const verticalIcons = {
  start: <AlignLeft />,
  center: <AlignCenterVertical />,
  end: <AlignRight />,
} as any;

const horizontalIcons = {
  start: <AlignTop />,
  center: <AlignCenterHorizontal />,
  end: <AlignBottom />,
} as any;

const styles = {
  label: css({
    display: 'inline-block',
    padding: `${tokens.spacingXs} 0`,
    color: tokens.gray500,
    fontWeight: tokens.fontWeightNormal,
    marginRight: tokens.spacingS,
  }),
  buttonGroup: css({
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '6px',
  }),
  button: css({
    padding: tokens.spacing2Xs,
    minHeight: 'unset',
  }),
  selected: css({
    backgroundColor: tokens.blue600,
    '& svg path': {
      fill: 'white',
    },
  }),
  horizontalSeparator: css({
    borderLeft: `1px solid ${tokens.gray200}`,
    height: '12px',
    margin: `0 ${tokens.spacing2Xs}`,
  }),
};

const horizontalAlignmentVariableName = 'cfHorizontalAlignment';
const verticalAlignmentVariableName = 'cfVerticalAlignment';

type AlignmentInputProps = {
  horizontalAlignment?: ComponentDefinitionVariable<'Text'>;
  verticalAlignment?: ComponentDefinitionVariable<'Text'>;
};

export const AlignmentInput = ({ horizontalAlignment, verticalAlignment }: AlignmentInputProps) => {
  const [horizontalAlignmentValue, setHorizontalAlignmentValue] = useVariableState({
    variableDefinition: horizontalAlignment,
    variableName: horizontalAlignmentVariableName,
  });
  const [verticalAlignmentValue, setVerticalAlignmentValue] = useVariableState({
    variableDefinition: verticalAlignment,
    variableName: verticalAlignmentVariableName,
  });

  if (!horizontalAlignment && !verticalAlignment) {
    return null;
  }

  const renderBothInputGroups = horizontalAlignment && verticalAlignment;

  return (
    <Flex>
      <Text color="gray500" fontWeight="fontWeightNormal" className={styles.label}>
        Alignment
      </Text>
      <ButtonGroup className={styles.buttonGroup}>
        <>
          {(verticalAlignment?.validations?.in || []).map((option) => {
            const isSelected = verticalAlignmentValue === option.value;
            return (
              <IconButton
                icon={verticalIcons[option.value] ?? null}
                key={option.value}
                variant={isSelected ? 'primary' : 'transparent'}
                size="small"
                aria-label={option.displayName || ''}
                className={cx(styles.button, { [styles.selected]: isSelected })}
                onClick={() => setVerticalAlignmentValue(option.value)}
              />
            );
          })}

          {renderBothInputGroups && <span className={styles.horizontalSeparator} />}

          {(horizontalAlignment?.validations?.in || []).map((option) => {
            const isSelected = horizontalAlignmentValue === option.value;
            return (
              <IconButton
                icon={horizontalIcons[option.value] ?? null}
                key={option.value}
                variant={isSelected ? 'primary' : 'transparent'}
                size="small"
                aria-label={option.displayName || ''}
                className={cx(styles.button, { [styles.selected]: isSelected })}
                onClick={() => setHorizontalAlignmentValue(option.value)}
              />
            );
          })}
        </>
      </ButtonGroup>
    </Flex>
  );
};
