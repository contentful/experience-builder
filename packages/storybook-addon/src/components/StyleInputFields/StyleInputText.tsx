import { ComponentDefinitionVariableBase } from '@contentful/experiences-sdk-react/dist/types';
import { FormControl, TextInput } from '@contentful/f36-components';
import { css } from 'emotion';
import { useCompositionCanvasSubscriber } from '@/context/useCompositionCanvasSubscriber';
import React, { useEffect } from 'react';
import { useState } from 'react';

type StyleInputTextProps = {
  name: string;
  displayName: string;
  defaultValue?: ComponentDefinitionVariableBase<'Text'>['defaultValue'];
};

const styles = {
  form: css({
    maxWidth: '90%',
  }),
};

export const StyleInputText = ({ name, displayName, defaultValue }: StyleInputTextProps) => {
  const [value, setValue] = useState<string>('');
  const { onDesignValueChanged } = useCompositionCanvasSubscriber();

  const handleInputChange = (value: string) => {
    setValue(value);
    onDesignValueChanged(name, value);
  };

  useEffect(() => {
    defaultValue && setValue(defaultValue.toString());
  }, [defaultValue]);

  return (
    <FormControl className={styles.form} key={name}>
      <FormControl.Label>{displayName}</FormControl.Label>
      <TextInput
        name={name}
        type="text"
        placeholder={defaultValue ? defaultValue.toString() : ''}
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
      />
    </FormControl>
  );
};
