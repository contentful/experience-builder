import { containerDefinition, ContentfulContainer } from '@contentful/experiences-components-react';
import { ComponentDefinition } from '@contentful/experiences-sdk-react';
import React from 'react';
import { css, cx } from 'emotion';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CustomContainer: React.FC<any> = (props) => {
  const { className, minHeight, ...otherProps } = props;
  const customClassName = css({ minHeight: `${minHeight} !important` });
  const combinedClassName = cx(className, customClassName);
  return <ContentfulContainer className={combinedClassName} {...otherProps} />;
};

// eslint-disable-next-line react-refresh/only-export-components
export const customContainerDefinition = {
  ...containerDefinition,
  id: 'custom-container',
  name: 'Custom Container',
  variables: {
    ...containerDefinition.variables,
    minHeight: {
      displayName: 'Min Height',
      type: 'Text',
      group: 'style',
      description: 'The min-height of the section',
      defaultValue: '300px',
    },
  },
} as ComponentDefinition;
