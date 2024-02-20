import type { ComponentDefinition } from '@contentful/experience-builder-core/types';
import { constants } from '@/utils/constants';

export * from './MediaImage';

export const MediaImageComponentDefinition: ComponentDefinition = {
  id: 'media-image',
  name: 'MediaImage',
  category: 'Media',
  builtInStyles: ['cfMargin', 'cfPadding'],
  thumbnailUrl: constants.thumbnails.image,
  variables: {
    alt: {
      displayName: 'Alt',
      type: 'Text',
    },
    src: {
      displayName: 'Image Media Src',
      type: 'Media',
      defaultValue: constants.placeholderImage,
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
