import React from 'react';
import { Text, Heading } from '@contentful/f36-components';

interface F36TextProps {
  content: string;
  element: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span';
  size?: 'fontSizeS' | 'fontSizeM' | 'fontSizeL' | 'fontSizeXl';
  color?:
    | 'colorBlack'
    | 'gray500'
    | 'colorPrimary'
    | 'colorPositive'
    | 'colorNegative'
    | 'colorWarning';
  fontWeight?: 'fontWeightNormal' | 'fontWeightMedium' | 'fontWeightDemiBold';
  marginBottom?: 'none' | 'spacingXs' | 'spacingS' | 'spacingM' | 'spacingL' | 'spacingXl';
}

export const F36Text: React.FC<F36TextProps> = ({ content, element = 'p', ...rest }) => {
  // If it's a heading element, use Heading component
  if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(element)) {
    return (
      <Heading as={element as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'} {...rest}>
        {content}
      </Heading>
    );
  }

  // For other elements, use Text component
  return (
    <Text as={element as 'p' | 'span'} {...rest}>
      {content}
    </Text>
  );
};

export default F36Text;
