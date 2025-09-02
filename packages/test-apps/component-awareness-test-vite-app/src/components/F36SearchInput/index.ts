import { ComponentDefinition } from '@contentful/experiences-sdk-react';

export { F36SearchInput } from './F36SearchInput';

export const f36SearchInputDefinition: ComponentDefinition = {
  id: 'f36-search-input',
  name: 'F36 Search Input',
  category: 'F36 Design System',
  builtInStyles: ['cfMargin', 'cfWidth', 'cfMaxWidth'],
  variables: {
    placeholder: {
      displayName: 'Placeholder',
      type: 'Text',
      defaultValue: 'Was suchst du?',
      description: 'Placeholder text for the search input',
    },
    value: {
      displayName: 'Default Value',
      type: 'Text',
      description: 'Default value for the input',
    },
    label: {
      displayName: 'Label',
      type: 'Text',
      description: 'Accessible label for the search input',
    },
    isRequired: {
      displayName: 'Required',
      type: 'Boolean',
      defaultValue: false,
      group: 'style',
      description: 'Whether the input is required',
    },
    isDisabled: {
      displayName: 'Disabled',
      type: 'Boolean',
      defaultValue: false,
      group: 'style',
      description: 'Whether the input is disabled',
    },
    isInvalid: {
      displayName: 'Invalid',
      type: 'Boolean',
      defaultValue: false,
      group: 'style',
      description: 'Whether the input is in an invalid state',
    },
    size: {
      displayName: 'Size',
      type: 'Text',
      defaultValue: 'medium',
      group: 'style',
      description: 'The size of the input',
      validations: {
        in: [
          { value: 'small', displayName: 'Small' },
          { value: 'medium', displayName: 'Medium' },
        ],
      },
    },
    type: {
      displayName: 'Input Type',
      type: 'Text',
      defaultValue: 'search',
      group: 'style',
      description: 'The HTML input type',
      validations: {
        in: [
          { value: 'search', displayName: 'Search' },
          { value: 'text', displayName: 'Text' },
        ],
      },
    },
    showCameraIcon: {
      displayName: 'Show Camera Icon',
      type: 'Boolean',
      defaultValue: false,
      group: 'style',
      description: 'Display a camera icon on the right side',
    },
  },
};
