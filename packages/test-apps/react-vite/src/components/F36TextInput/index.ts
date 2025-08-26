import { ComponentDefinition } from '@contentful/experiences-sdk-react';

export { F36TextInput } from './F36TextInput';

export const f36TextInputDefinition: ComponentDefinition = {
  id: 'f36-text-input',
  name: 'F36 Text Input',
  category: 'F36 Design System',
  builtInStyles: ['cfMargin', 'cfWidth', 'cfMaxWidth'],
  variables: {
    placeholder: {
      displayName: 'Placeholder',
      type: 'Text',
      description: 'Placeholder text for the input',
    },
    value: {
      displayName: 'Default Value',
      type: 'Text',
      description: 'Default value for the input',
    },
    label: {
      displayName: 'Label',
      type: 'Text',
      description: 'Label for the input field',
    },
    helpText: {
      displayName: 'Help Text',
      type: 'Text',
      description: 'Helper text shown below the input',
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
      defaultValue: 'text',
      group: 'style',
      description: 'The type of input',
      validations: {
        in: [
          { value: 'text', displayName: 'Text' },
          { value: 'email', displayName: 'Email' },
          { value: 'password', displayName: 'Password' },
          { value: 'url', displayName: 'URL' },
          { value: 'tel', displayName: 'Telephone' },
          { value: 'number', displayName: 'Number' },
        ],
      },
    },
  },
};
