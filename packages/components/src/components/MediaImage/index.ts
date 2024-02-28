import type { ComponentDefinition } from '@contentful/experience-builder-core/types';
import { placeholderImage } from '@/utils/constants';
import { CONTENTFUL_DEFAULT_CATEGORY } from '@contentful/experience-builder-core/constants';
export * from './MediaImage';

export const MediaImageComponentDefinition: ComponentDefinition = {
  id: 'media-image',
  name: 'MediaImage',
  category: CONTENTFUL_DEFAULT_CATEGORY,
  builtInStyles: ['cfMargin', 'cfPadding'],
  variables: {
    alt: {
      displayName: 'Alt',
      type: 'Text',
    },
    src: {
      displayName: 'Image Media Src',
      type: 'Media',
      defaultValue: placeholderImage,
    },
    width: {
      displayName: 'Width',
      type: 'Number',
      group: 'style',
    },
    classes: {
      displayName: 'Classes',
      description: 'Additional CSS classes to apply to the component.',
      type: 'Text',
      defaultValue: 'cf-media-image',
      group: 'style',
    },
  },
};
