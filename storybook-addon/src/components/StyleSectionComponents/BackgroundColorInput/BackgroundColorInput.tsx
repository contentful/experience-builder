import React from 'react';
import { ColorInput } from './ColorInput';
import { useVariableState } from '@/hooks/useVariableState';
import { ComponentDefinitionVariable } from '@contentful/experience-builder';

type BackgroundColorInputProps = {
  variableDefinition: ComponentDefinitionVariable<'Text'>;
  variableName: string;
};

export const BackgroundColorInput = ({
  variableDefinition,
  variableName,
}: BackgroundColorInputProps) => {
  const [value, setValue] = useVariableState({
    variableDefinition,
    variableName,
  });
  const onChange = (colorValue: string) => {
    setValue(colorValue);
  };

  return <ColorInput value={value} onChange={onChange} />;
};
