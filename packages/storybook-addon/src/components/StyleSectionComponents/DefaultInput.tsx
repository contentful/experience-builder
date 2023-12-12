import React from 'react';
import { TextInput } from '@contentful/f36-components';
import { useVariableState } from '@/hooks/useVariableState';
import { ComponentDefinitionVariable } from '@contentful/experience-builder';

type DefaultInputProps = {
  variableDefinition: ComponentDefinitionVariable<'Text'>;
  variableName: string;
};

export const DefaultInput = ({ variableDefinition, variableName }: DefaultInputProps) => {
  const [value, setValue] = useVariableState({
    variableDefinition,
    variableName,
  });

  return (
    <TextInput
      value={value}
      type="text"
      onChange={(e) => {
        setValue(e.target.value);
      }}
      placeholder={String(variableDefinition.defaultValue ?? 'value')}
      name={variableName}
    />
  );
};
