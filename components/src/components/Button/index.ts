import { withExperienceBuilder } from '@/utils/withExperienceBuilder';
import { Button } from './Button';
import constants from '@/utils/constants';

export * from './Button';

export const ExperienceBuilderButton = withExperienceBuilder(Button, {
  id: 'button',
  name: 'Button',
  category: 'Components',
  builtInStyles: ['cfMargin', 'cfPadding'],
  thumbnailUrl: constants.thumbnails.button,
  variables: {
    label: {
      displayName: 'Label',
      type: 'Text',
      defaultValue: 'Lorem ipsum',
    },
    targetUrl: {
      displayName: 'Target URL',
      type: 'Text',
      defaultValue: '/',
    },
    classes: {
      displayName: 'Classes',
      type: 'Text',
      defaultValue: '',
      group: 'style',
    },
  },
});
