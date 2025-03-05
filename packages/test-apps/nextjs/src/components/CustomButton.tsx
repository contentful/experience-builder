import { ComponentDefinition } from '@contentful/experiences-sdk-react';
import React, { useMemo } from 'react';

type CustomButtonProps = {
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  value: string;
};

export const CustomButton = ({
  backgroundColor,
  textColor,
  fontSize,
  value,
  ...props
}: CustomButtonProps) => {
  const style = useMemo(() => {
    return {
      backgroundColor,
      color: textColor,
      fontSize: `${fontSize}px`,
    };
  }, [backgroundColor, textColor, fontSize]);

  return (
    <button style={style} {...props}>
      {value}
    </button>
  );
};

export const CustomButtonComponentDefinition: ComponentDefinition = {
  id: 'custom-buttom-component',
  name: 'Custom Button',
  variables: {
    backgroundColor: {
      type: 'Text',
      defaultValue: 'white',
      group: 'style',
      displayName: 'Background',
    },
    textColor: {
      type: 'Text',
      defaultValue: 'black',
      group: 'style',
      displayName: 'Text color',
    },
    fontSize: {
      type: 'Number',
      defaultValue: 16,
      group: 'style',
      displayName: 'Font size',
    },
    value: {
      type: 'Text',
      defaultValue: 'Button',
      displayName: 'Button text',
    },
  },
};
