import { ComponentDefinitionVariableBase } from '@contentful/experiences-sdk-react/dist/types';
import { FormControl, Switch } from '@contentful/f36-components';
import { css } from 'emotion';
import { useExperienceCanvasSubscriber } from '@/context/useExperienceCanvasSubscriber';
import React, { useEffect } from 'react';
import { useState } from 'react';

type StyleInputBooleanProps = {
  name: string;
  displayName: string;
  defaultValue?: ComponentDefinitionVariableBase<'Boolean'>['defaultValue'];
};

const styles = {
  form: css({
    maxWidth: '90%',
  }),
};

export const StyleInputBoolean = ({ name, displayName, defaultValue }: StyleInputBooleanProps) => {
  const [value, setValue] = useState<boolean>(false);
  const { onDesignValueChanged } = useExperienceCanvasSubscriber();

  const handleSwitchChange = (value: boolean) => {
    setValue(value);
    onDesignValueChanged(name, value);
  };

  useEffect(() => {
    defaultValue && setValue(!!defaultValue);
  }, [defaultValue]);

  return (
    <FormControl className={styles.form} key={name}>
      <FormControl.Label>{displayName}</FormControl.Label>
      <Switch name={name} id={name} isChecked={value} onChange={() => handleSwitchChange(!value)} />
    </FormControl>
  );
};
