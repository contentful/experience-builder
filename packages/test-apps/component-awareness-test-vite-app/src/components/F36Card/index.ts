import { ComponentDefinition } from '@contentful/experiences-sdk-react';

export { F36Card } from './F36Card';

export const f36CardDefinition: ComponentDefinition = {
  id: 'f36-card',
  name: 'F36 Card',
  category: 'F36 Design System',
  children: true,
  builtInStyles: ['cfMargin', 'cfWidth', 'cfMaxWidth'],
  variables: {
    title: {
      displayName: 'Card Title',
      type: 'Text',
      description: 'The title displayed at the top of the card',
    },
    description: {
      displayName: 'Description',
      type: 'Text',
      description: 'A brief description or subtitle for the card',
    },
    padding: {
      displayName: 'Padding',
      type: 'Text',
      defaultValue: 'default',
      group: 'style',
      description: 'The amount of padding inside the card',
      validations: {
        in: [
          { value: 'none', displayName: 'None' },
          { value: 'default', displayName: 'Default' },
          { value: 'large', displayName: 'Large' },
        ],
      },
    },
    withDragHandle: {
      displayName: 'Drag Handle',
      type: 'Boolean',
      defaultValue: false,
      group: 'style',
      description: 'Show a drag handle on the card',
    },
    isSelected: {
      displayName: 'Selected',
      type: 'Boolean',
      defaultValue: false,
      group: 'style',
      description: 'Whether the card appears selected',
    },
  },
};
