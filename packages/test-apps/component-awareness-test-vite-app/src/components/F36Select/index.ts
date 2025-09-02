import { ComponentDefinition } from '@contentful/experiences-sdk-react';

export { F36Select } from './F36Select';

export const f36SelectDefinition: ComponentDefinition = {
  id: 'f36-select',
  name: 'F36 Select',
  category: 'F36 Design System',
  builtInStyles: ['cfMargin', 'cfWidth', 'cfMaxWidth'],
  variables: {
    options: {
      displayName: 'Options',
      type: 'Text',
      defaultValue: 'Option 1, Option 2, Option 3',
      description: 'Comma-separated list of options',
    },
    placeholder: {
      displayName: 'Placeholder',
      type: 'Text',
      defaultValue: 'Select an option',
      description: 'Placeholder text for the select',
    },
    value: {
      displayName: 'Default Value',
      type: 'Text',
      description: 'Default selected value',
    },
    label: {
      displayName: 'Label',
      type: 'Text',
      description: 'Label for the select field',
    },
    isRequired: {
      displayName: 'Required',
      type: 'Boolean',
      defaultValue: false,
      group: 'style',
      description: 'Whether the select is required',
    },
    isDisabled: {
      displayName: 'Disabled',
      type: 'Boolean',
      defaultValue: false,
      group: 'style',
      description: 'Whether the select is disabled',
    },
    isInvalid: {
      displayName: 'Invalid',
      type: 'Boolean',
      defaultValue: false,
      group: 'style',
      description: 'Whether the select is in an invalid state',
    },
    size: {
      displayName: 'Size',
      type: 'Text',
      defaultValue: 'medium',
      group: 'style',
      description: 'The size of the select',
      validations: {
        in: [
          { value: 'small', displayName: 'Small' },
          { value: 'medium', displayName: 'Medium' },
        ],
      },
    },
  },
};
