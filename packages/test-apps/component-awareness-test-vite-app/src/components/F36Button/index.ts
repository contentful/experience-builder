import { ComponentDefinition } from '@contentful/experiences-sdk-react';

export { F36Button } from './F36Button';

export const f36ButtonDefinition: ComponentDefinition = {
  id: 'f36-button',
  name: 'F36 Button',
  category: 'F36 Design System',
  children: true,
  thumbnailUrl:
    'https://images.ctfassets.net/son9ld5ewssk/4BtmUE8ixnHZaL3NNI8rKN/81a5f79436c7d4b3e8a44b5e31b6be3e/button_thumbnail.png',
  builtInStyles: ['cfMargin', 'cfPadding'],
  variables: {
    variant: {
      displayName: 'Variant',
      type: 'Text',
      defaultValue: 'primary',
      group: 'style',
      description: 'The visual style variant of the button',
      validations: {
        in: [
          { value: 'primary', displayName: 'Primary' },
          { value: 'secondary', displayName: 'Secondary' },
          { value: 'positive', displayName: 'Positive' },
          { value: 'negative', displayName: 'Negative' },
          { value: 'transparent', displayName: 'Transparent' },
        ],
      },
    },
    size: {
      displayName: 'Size',
      type: 'Text',
      defaultValue: 'small',
      group: 'style',
      description: 'The size of the button',
      validations: {
        in: [
          { value: 'small', displayName: 'Small' },
          { value: 'medium', displayName: 'Medium' },
          { value: 'large', displayName: 'Large' },
        ],
      },
    },
    isDisabled: {
      displayName: 'Disabled',
      type: 'Boolean',
      defaultValue: false,
      group: 'style',
      description: 'Whether the button is disabled',
    },
    isFullWidth: {
      displayName: 'Full Width',
      type: 'Boolean',
      defaultValue: false,
      group: 'style',
      description: 'Whether the button should take full width',
    },
    href: {
      displayName: 'Link URL',
      type: 'Hyperlink',
      description: 'If provided, renders the button as a link',
    },
  },
};
