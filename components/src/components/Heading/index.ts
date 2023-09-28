import { withExperienceBuilder } from '@/utils/withExperienceBuilder';
import { Heading } from './Heading';
import constants from '@/utils/constants';

export * from './Heading';

export const ExperienceBuilderHeading = withExperienceBuilder(
  Heading,
  {
    id: 'heading',
    name: 'Heading',
    category: 'Components',
    builtInStyles: ['cfMargin', 'cfPadding'],
    thumbnailUrl: constants.thumbnails.heading,
    variables: {
      text: {
        displayName: 'text',
        type: 'Text',
        description: 'The text to display in the heading.',
        defaultValue: 'Lorem ipsum',
      },
      type: {
        displayName: 'Type',
        type: 'Text',
        defaultValue: 'h1',
        description:
          'Determines the HTML tag of the heading. Value can be h1, h2, h3, h4, h5, or h6.',
        validations: {
          in: [
            { value: 'h1', displayName: 'H1' },
            { value: 'h2', displayName: 'H2' },
            { value: 'h3', displayName: 'H3' },
            { value: 'h4', displayName: 'H4' },
            { value: 'h5', displayName: 'H5' },
            { value: 'h6', displayName: 'H6' },
          ],
        },
      },
      classes: {
        displayName: 'Classes',
        description:
          'Additional CSS classes to add to the component. Separate each class with a space.',
        type: 'Text',
        defaultValue: 'cf-heading',
        group: 'style',
      },
    },
  },
  { wrapComponent: true }
);
