import { ComponentDefinitionVariableBase } from '@contentful/experiences-sdk-react/dist/types';
import { FormControl, TextInput } from '@contentful/f36-components';
import { css } from 'emotion';
import { useExperienceCanvasSubscriber } from '@/context/useExperienceCanvasSubscriber';
import React, { useEffect } from 'react';
import { useState } from 'react';

type StyleInputNumberProps = {
  name: string;
  displayName: string;
  defaultValue?: ComponentDefinitionVariableBase<'Number'>['defaultValue'];
};

const styles = {
  form: css({
    maxWidth: '90%',
  }),
};

export const StyleInputNumber = ({ name, displayName, defaultValue }: StyleInputNumberProps) => {
  const [value, setValue] = useState<string>('');
  const { onDesignValueChanged } = useExperienceCanvasSubscriber();

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
        type="number"
        placeholder={defaultValue ? defaultValue.toString() : ''}
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
      />
    </FormControl>
  );
};
