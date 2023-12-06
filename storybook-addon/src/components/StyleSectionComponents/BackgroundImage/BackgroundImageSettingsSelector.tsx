import React from 'react';
import { Grid, Select, Text } from '@contentful/f36-components';
import { css } from 'emotion';
import { useVariableState } from '@/hooks/useVariableState';
import { ComponentDefinitionVariable } from '@contentful/experience-builder';

const styles = {
  grid: css({
    alignItems: 'center',
  }),
};

const backgroundImageScalingVariableName = 'cfBackgroundImageScaling';
const backgroundImageAlignmentVariableName = 'cfBackgroundImageAlignment';

type BackgroundImageSettingsSelectorProps = {
  variableDefinition?: ComponentDefinitionVariable<'Text'>;
  variableName:
    | typeof backgroundImageScalingVariableName
    | typeof backgroundImageAlignmentVariableName;
};

export const BackgroundImageSettingsSelector = ({
  variableDefinition,
  variableName,
}: BackgroundImageSettingsSelectorProps) => {
  const label = variableDefinition?.displayName;
  const [value, setValue] = useVariableState({
    variableDefinition,
    variableName,
  });

  if (!variableDefinition) {
    return null;
  }

  const onOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(event.target.value);
  };

  const options = variableDefinition.validations?.in || [];

  return (
    <Grid columns="2fr 1fr" columnGap="spacingXs" justifyContent="center" className={styles.grid}>
      <Text fontColor="gray500">{label}</Text>
      <Select value={value} onChange={onOptionChange}>
        {options.map((option, index) => {
          return (
            <Select.Option key={`${option.value}-${index}`} value={option.value}>
              {option.displayName || option.value}
            </Select.Option>
          );
        })}
      </Select>
    </Grid>
  );
};
