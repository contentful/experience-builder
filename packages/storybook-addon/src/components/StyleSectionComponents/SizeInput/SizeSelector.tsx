import { ComponentDefinitionVariable } from '@contentful/experiences-core/types';
import React, { useCallback, useMemo, useState } from 'react';
import { Grid, Select, Text, TextInput } from '@contentful/f36-components';
import { useVariableState } from '@/hooks/useVariableState';
import { styles } from './styles';
import { useCompositionCanvasSubscriber } from '@/context/useCompositionCanvasSubscriber';
import { EMPTY_CONTAINER_HEIGHT } from '@contentful/experiences-core/constants';

const heightVariableName = 'cfHeight';
const widthVariableName = 'cfWidth';

type SizeSelectorProps = {
  variableName: typeof heightVariableName | typeof widthVariableName;
  variableDefinition: ComponentDefinitionVariable<'Text'>;
  label: string;
};

type SizingOptions = 'fixed' | 'fit';

const sizingOptions: { id: SizingOptions; displayValue: string }[] = [
  { id: 'fixed', displayValue: 'Fixed' },
  { id: 'fit', displayValue: 'Fit' },
];

const fitSizingOptions = [
  { id: 'fit-content', displayValue: 'All content' },
  { id: 'max-content', displayValue: 'Max content' },
  { id: 'min-content', displayValue: 'Min content' },
];

const transformValuesBySizingOption = (sizingOption: SizingOptions, value: string) => {
  if (sizingOption === 'fixed') {
    return EMPTY_CONTAINER_HEIGHT;
  }

  if (sizingOption === 'fit') {
    return 'fit-content';
  }

  return value;
};

/**
 * We have two sizing options: Fit and Fixed
 * Fixed has a number input (e.g. with px or %)
 * Fit has 3 options, as seen in `fitSizingOptions`
 */
export const SizeSelector = ({ variableName, variableDefinition, label }: SizeSelectorProps) => {
  const [valueFromState, setValue] = useVariableState({
    variableDefinition,
    variableName,
  });

  const value = useMemo(() => {
    return valueFromState;
  }, [valueFromState]);

  const { onDesignValueChanged } = useCompositionCanvasSubscriber();

  const selectedOption: SizingOptions | undefined = useMemo(() => {
    if (fitSizingOptions.some((option) => option.id === value)) {
      return 'fit';
    }

    if (value.endsWith('%')) {
      return 'fixed';
    }

    if (value.endsWith('px')) {
      return 'fixed';
    }
  }, [value]);

  const onOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sizingOption = event.target.value as SizingOptions;
    const newValue = transformValuesBySizingOption(sizingOption, value);

    setValue(newValue);
    if (sizingOption === 'fixed' && variableName === widthVariableName) {
      onDesignValueChanged('maxWidth', '100%');
    }
  };

  const [isNumberInputFocused, setIsNumberInputFocused] = useState(false);

  const renderInput = useCallback(
    (selectedOption: any) => {
      if (selectedOption === 'fit') {
        return (
          <Select
            value={value}
            onChange={(event) => setValue(event.target.value)}
            testId="fit-to-content-options">
            {fitSizingOptions.map((option) => (
              <Select.Option key={option.id} value={option.id}>
                {option.displayValue}
              </Select.Option>
            ))}
          </Select>
        );
      }

      const numberInputValue = value.split(/px|%/)[0];

      return (
        <TextInput.Group>
          <TextInput
            type="number"
            className={styles.textField(!!numberInputValue)}
            isInvalid={!numberInputValue}
            onBlur={() => setIsNumberInputFocused(false)}
            onChange={(event) => {
              const newValue = event.target.value;
              if (selectedOption === 'fixed') {
                return setValue(`${newValue}px`);
              }
              if (selectedOption === 'relative') {
                return setValue(`${newValue}%`);
              }
            }}
            onFocus={() => setIsNumberInputFocused(true)}
            aria-label={label}
            value={numberInputValue}
          />
          <TextInput
            className={styles.unitInput(isNumberInputFocused, !!numberInputValue)}
            aria-label="unit"
            isInvalid={!numberInputValue}
            value={selectedOption === 'fixed' ? 'px' : '%'}
            isDisabled={true}
          />
        </TextInput.Group>
      );
    },
    [isNumberInputFocused, label, setValue, value],
  );

  return (
    <Grid
      columns="86px 1fr 1fr"
      columnGap="spacingXs"
      justifyContent="center"
      className={styles.grid}>
      <Text fontColor="gray500">{label}</Text>
      <Select value={selectedOption} onChange={onOptionChange}>
        {sizingOptions.map((option) => (
          <Select.Option key={option.id} value={option.id}>
            {option.displayValue}
          </Select.Option>
        ))}
      </Select>
      {renderInput(selectedOption)}
    </Grid>
  );
};
