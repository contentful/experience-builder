import { containerBuiltInStyles } from '@contentful/experience-builder-core';
import { ContentfulContainer } from './ContentfulContainer';
import { ComponentDefinition } from '@contentful/experience-builder-core/types';
import {
  CONTENTFUL_COMPONENT_CATEGORY,
  CONTENTFUL_CONTAINER_ID,
} from '@contentful/experience-builder-core/constants';

export { ContentfulContainer };

export const ContentfulContainerComponentDefinition: ComponentDefinition = {
  id: CONTENTFUL_CONTAINER_ID,
  name: 'Container',
  category: CONTENTFUL_COMPONENT_CATEGORY,
  children: true,
  variables: containerBuiltInStyles,
};
