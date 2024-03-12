import {
  ComponentDefinitionVariableBase,
  ValidationOption,
} from '@contentful/experiences-sdk-react/dist/types';
import { FormControl, Select } from '@contentful/f36-components';
import { css } from 'emotion';
import { useExperienceCanvasSubscriber } from '@/context/useExperienceCanvasSubscriber';
import React, { useEffect } from 'react';
import { useState } from 'react';

type StyleInputSelectProps<T extends string | number> = {
  name: string;
  displayName: string;
  defaultValue?: ComponentDefinitionVariableBase<'Text'>['defaultValue'];
  options: ValidationOption<T extends string ? 'Text' : T extends number ? 'Number' : never>[];
};

const styles = {
  form: css({
    maxWidth: '90%',
  }),
};

export const StyleInputSelect = <T extends string | number>({
  name,
  displayName,
  defaultValue,
  options,
}: StyleInputSelectProps<T>) => {
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
      <Select value={value} onChange={(e) => handleInputChange(e.target.value)}>
        {options.map((option) => (
          <Select.Option key={option.value} value={option.value}>
            {option.displayName || option.value}
          </Select.Option>
        ))}
      </Select>
    </FormControl>
  );
};
