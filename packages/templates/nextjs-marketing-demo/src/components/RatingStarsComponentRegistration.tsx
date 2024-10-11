import { Rate } from 'antd';

export const RatingStarsComponentRegistration = {
  component: Rate,
  definition: {
    id: 'custom-rating',
    name: 'Rating Stars',
    category: 'Custom Components',
    variables: {
      disabled: {
        displayName: 'Read only',
        type: 'Boolean',
        defaultValue: true,
        group: 'style',
      },
      value: {
        displayName: 'Stars',
        type: 'Number',
        defaultValue: 5,
        group: 'style',
        validations: {
          in: [
            {
              value: 1,
              displayName: 'One Star',
            },
            {
              value: 2,
              displayName: 'Two Star',
            },
            {
              value: 3,
              displayName: 'Three Star',
            },
            {
              value: 4,
              displayName: 'Four Star',
            },
            {
              value: 5,
              displayName: 'Five Star',
            },
          ],
        },
      },
    },
  },
};
