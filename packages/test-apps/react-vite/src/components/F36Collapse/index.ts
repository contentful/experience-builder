import { ComponentDefinition } from '@contentful/experiences-sdk-react';

export { F36Collapse } from './F36Collapse';

export const f36CollapseDefinition: ComponentDefinition = {
  id: 'f36-collapse',
  name: 'F36 Collapse',
  category: 'F36 Design System',
  children: true,
  builtInStyles: ['cfMargin', 'cfPadding', 'cfWidth'],
  variables: {
    title: {
      displayName: 'Title',
      type: 'Text',
      defaultValue: 'Section title',
      description: 'Header text displayed for the collapsible section',
    },
    isExpanded: {
      displayName: 'Expanded by default',
      type: 'Boolean',
      defaultValue: false,
      group: 'style',
      description: 'Whether the section starts expanded',
    },
    showToggleButton: {
      displayName: 'Show Toggle Button',
      type: 'Boolean',
      defaultValue: false,
      group: 'style',
      description: 'Adds an internal button to control expansion',
    },
    toggleButtonLabel: {
      displayName: 'Toggle Button Label',
      type: 'Text',
      defaultValue: 'Toggle',
      group: 'content',
      description: 'Label text for the internal toggle button',
    },
  },
};
