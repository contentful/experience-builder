import { containerDefinition, ContentfulContainer } from '@contentful/experiences-components-react';
import { ComponentDefinition } from '@contentful/experiences-sdk-react';
import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CustomContainer: React.FC<any> = (props) => {
  const { className, minHeight, ...otherProps } = props;
  return (
    <ContentfulContainer
      className={className}
      style={minHeight ? { minHeight } : undefined}
      {...otherProps}
    />
  );
};

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
