import { ComponentDefinition } from '@contentful/experiences-sdk-react';

export { F36Text } from './F36Text';

export const f36TextDefinition: ComponentDefinition = {
  id: 'f36-text',
  name: 'F36 Text',
  category: 'F36 Design System',
  builtInStyles: ['cfMargin', 'cfPadding', 'cfTextAlign', 'cfTextColor'],
  variables: {
    content: {
      displayName: 'Text Content',
      type: 'Text',
      defaultValue: 'Your text here',
      description: 'The text content to display',
    },
    element: {
      displayName: 'HTML Element',
      type: 'Text',
      defaultValue: 'p',
      group: 'style',
      description: 'The HTML element to render',
      validations: {
        in: [
          { value: 'p', displayName: 'Paragraph' },
          { value: 'h1', displayName: 'Heading 1' },
          { value: 'h2', displayName: 'Heading 2' },
          { value: 'h3', displayName: 'Heading 3' },
          { value: 'h4', displayName: 'Heading 4' },
          { value: 'h5', displayName: 'Heading 5' },
          { value: 'h6', displayName: 'Heading 6' },
          { value: 'span', displayName: 'Span' },
        ],
      },
    },
    fontWeight: {
      displayName: 'Font Weight',
      type: 'Text',
      defaultValue: 'fontWeightNormal',
      group: 'style',
      description: 'The weight/boldness of the text',
      validations: {
        in: [
          { value: 'fontWeightNormal', displayName: 'Normal' },
          { value: 'fontWeightMedium', displayName: 'Medium' },
          { value: 'fontWeightDemiBold', displayName: 'Semi Bold' },
        ],
      },
    },
  },
};
