import { ComponentDefinition } from '@contentful/experiences-core/types';

export const createComponentDefinition = (): ComponentDefinition => ({
  id: 'test-component',
  name: 'TestComponent',
  builtInStyles: ['cfBackgroundColor'],
  variables: {
    cfBackgroundImageUrl: {
      type: 'Media',
      displayName: 'Background Image',
    },
    cfBackgroundImageOptions: {
      type: 'Object',
      group: 'style',
    },
    cfBackgroundColor: {
      type: 'Text',
      displayName: 'Background Color',
      defaultValue: 'rgba(0, 0, 0, 0)',
    },
    customFontColor: {
      type: 'Text',
      displayName: 'Font Color',
      defaultValue: 'rgba(255, 0, 255, 1)',
    },
    href: {
      displayName: 'Href',
      type: 'Hyperlink',
    },
    text: {
      displayName: 'Text',
      type: 'Text',
    },
  },
});
