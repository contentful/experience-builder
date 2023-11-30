import { withExperienceBuilder } from '@/utils/withExperienceBuilder';
import { Image } from './Image';
import constants from '@/utils/constants';

export * from './Image';

export const ExperienceBuilderImage = withExperienceBuilder(
  Image,
  {
    id: 'Image',
    name: 'Image',
    category: 'Components',
    builtInStyles: ['cfMargin', 'cfPadding'],
    thumbnailUrl: constants.thumbnails.image,
    variables: {
      alt: {
        displayName: 'Alt',
        type: 'Text',
      },
      src: {
        displayName: 'Image Url',
        type: 'Text',
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
        defaultValue: 'cf-image',
        group: 'style',
      },
    },
  },
  { wrapComponent: true }
);
