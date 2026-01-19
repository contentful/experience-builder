export * from './Video';

import type { ComponentDefinition } from '@contentful/experiences-core';
import { CONTENTFUL_DEFAULT_CATEGORY } from '@contentful/experiences-core/constants';

export const VideoComponentDefinition: ComponentDefinition = {
  id: 'contentful-video',
  name: 'Video',
  category: CONTENTFUL_DEFAULT_CATEGORY,
  builtInStyles: ['cfMargin', 'cfPadding', 'cfWidth'],
  tooltip: {
    description: 'Drop onto the canvas to embed a video.',
  },
  variables: {
    src: {
      displayName: 'Video source',
      type: 'Media',
      description: 'Source URL for the video',
      validations: {
        bindingSourceType: ['manual', 'asset'],
      },
    },
    autoPlay: {
      displayName: 'Autoplay',
      type: 'Boolean',
      defaultValue: false,
      group: 'style',
    },
    loop: {
      displayName: 'Loop',
      type: 'Boolean',
      defaultValue: false,
      group: 'style',
    },
  },
};
