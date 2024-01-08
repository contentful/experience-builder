import React from 'react';
import { Grid, Select, Text } from '@contentful/f36-components';
import { css } from 'emotion';
import { useVariableState } from '@/hooks/useVariableState';
import { ComponentDefinitionVariable } from '@contentful/experience-builder';
import { isString } from 'lodash';

const styles = {
  grid: css({
    alignItems: 'center',
  }),
};

const backgroundImageAlignmentVerticalVariableName = 'cfBackgroundImageAlignment';

type BackgroundImageAlignmentInputProps = {
  variableDefinition?: ComponentDefinitionVariable<'Text'>;
  variableName: typeof backgroundImageAlignmentVerticalVariableName;
};

const horizontalSelects = [
  { displayName: 'Left', value: 'left' },
  { displayName: 'Center', value: 'center' },
  { displayName: 'Right', value: 'right' },
];

const verticalSelects = [
  { displayName: 'Top', value: 'top' },
  { displayName: 'Center', value: 'center' },
  { displayName: 'Bottom', value: 'bottom' },
];

type ParsedParts = {
  horizontal: 'left' | 'right' | 'center';
  vertical: 'top' | 'bottom' | 'center';
};

const parseCompositeStringValue = (compositeValue?: string): ParsedParts => {
  const defaultResult: ParsedParts = {
    horizontal: 'left',
    vertical: 'center',
  };

  if (!isString(compositeValue)) return defaultResult;

  // eslint-disable-next-line prefer-const
  let [first, second] = compositeValue.trim().split(/\s+/, 2);

  const isSingleValue = !second;
  if (isSingleValue) {
    // we don't know if single value goes to horizontal or vertical,
    // so we let validation below to handle it
    second = first;
  }
  const isFirstValidHorizontalValue = horizontalSelects.map(({ value }) => value).includes(first);
  const isSecondValidVerticalValue = verticalSelects.map(({ value }) => value).includes(second);

  return {
    horizontal: isFirstValidHorizontalValue ? first : defaultResult.horizontal,
    vertical: isSecondValidVerticalValue ? second : defaultResult.vertical,
  } as ParsedParts;
};

export const BackgroundImageAlignmentInput = ({
  variableName,
  variableDefinition,
}: BackgroundImageAlignmentInputProps) => {
  const [compositeValue, setCompositeValue] = useVariableState({
    variableDefinition,
    variableName,
  });

  const { horizontal, vertical } = parseCompositeStringValue(compositeValue);

  const onHorizontalOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setCompositeValue(`${value} ${vertical}`);
  };
  const onVerticalOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setCompositeValue(`${horizontal} ${value}`);
  };

  return (
    <>
      <Grid columns="2fr 1fr" columnGap="spacingXs" justifyContent="center" className={styles.grid}>
        <Text fontColor="gray500">Image H Alignment</Text>
        <Select value={horizontal} onChange={onHorizontalOptionChange}>
          {horizontalSelects.map((def, index) => {
            const { displayName, value } = def;
            return (
              <Select.Option key={`${value}-${index}`} value={value}>
                {displayName}
              </Select.Option>
            );
          })}
        </Select>
      </Grid>
      <Grid columns="2fr 1fr" columnGap="spacingXs" justifyContent="center" className={styles.grid}>
        <Text fontColor="gray500">Image V Alignment</Text>
        <Select value={vertical} onChange={onVerticalOptionChange}>
          {verticalSelects.map((def, index) => {
            const { displayName, value } = def;
            return (
              <Select.Option key={`${value}-${index}`} value={value}>
                {displayName}
              </Select.Option>
            );
          })}
        </Select>
      </Grid>
    </>
  );
};
