import React, { useState } from 'react';
import { ComponentDefinitionVariable } from '@contentful/experience-builder';
import { useVariableState } from '@/hooks/useVariableState';
import { Grid, Text, TextInput } from '@contentful/f36-components';
import { styles } from './styles';
import { FixedSpacingValueRegexp, OnlyNumberRegexp, SpacingValueRegexp } from '../constants';
import { ensureHasMeasureUnit } from '../utils';

type MaxWidthSelectorProps = {
  variableDefinition: ComponentDefinitionVariable<'Text'>;
  widthVariableDefinition: ComponentDefinitionVariable<'Text'>;
};

const maxWidthVariableName = 'cfMaxWidth';
const widthVariableName = 'cfWidth';

export const MaxWidthInput = ({
  variableDefinition,
  widthVariableDefinition,
}: MaxWidthSelectorProps) => {
  const [value, setValue, initialValue] = useVariableState({
    variableDefinition,
    variableName: maxWidthVariableName,
  });
  const [widthValue] = useVariableState({
    variableDefinition: widthVariableDefinition,
    variableName: widthVariableName,
  });
  const [lastValidValue, setLastValidValue] = useState(initialValue);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const onInputBlur = () => {
    // validate only on blur and reset to previous value when not valid
    if (SpacingValueRegexp.test(value)) {
      setLastValidValue(value);
    } else if (OnlyNumberRegexp.test(value)) {
      const newValue = ensureHasMeasureUnit(String(value));
      setValue(newValue);
      setLastValidValue(newValue);
    } else {
      setValue(lastValidValue);
    }
  };

  // Regular expression pattern to check if the width uses a relative value (e.g., %, vw, vh)
  // You can only set max-width, if the width is absolute.
  const isDisabled = widthValue !== 'fill' && FixedSpacingValueRegexp.test(widthValue);

  return (
    <Grid columns="86px 2fr" columnGap="spacingXs" justifyContent="center" className={styles.grid}>
      <Text fontColor="gray500">Max-width</Text>
      <TextInput
        isDisabled={isDisabled}
        onBlur={onInputBlur}
        onChange={onInputChange}
        value={value === 'fill' ? '100%' : value}
      />
    </Grid>
  );
};
