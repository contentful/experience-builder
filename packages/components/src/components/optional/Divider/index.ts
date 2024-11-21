import { dividerBuiltInStyles } from '@contentful/experiences-core';
import {
  CONTENTFUL_COMPONENTS,
  CONTENTFUL_DEFAULT_CATEGORY,
} from '@contentful/experiences-core/constants';
import { ComponentDefinition } from '@contentful/experiences-core/types';

export { ContentfulDivider } from './ContentfulDivider';

export const dividerDefinition: ComponentDefinition = {
  id: CONTENTFUL_COMPONENTS.divider.id,
  name: CONTENTFUL_COMPONENTS.divider.name,
  category: CONTENTFUL_DEFAULT_CATEGORY,
  children: false,
  variables: dividerBuiltInStyles,
  tooltip: {
    description: 'Drop onto the canvas to add a divider.',
  },
};
