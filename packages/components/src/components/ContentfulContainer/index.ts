import { containerBuiltInStyles } from '@contentful/experience-builder-core';
import { ContentfulContainer } from './ContentfulContainer';
import { ComponentDefinition } from '@contentful/experience-builder-core/types';
import {
  CONTENTFUL_COMPONENT_CATEGORY,
  CONTENTFUL_COMPONENTS,
} from '@contentful/experience-builder-core/constants';

export { ContentfulContainer };

export const ContentfulContainerComponentDefinition: ComponentDefinition = {
  id: CONTENTFUL_COMPONENTS.container.id,
  name: CONTENTFUL_COMPONENTS.container.name,
  category: CONTENTFUL_COMPONENT_CATEGORY,
  children: true,
  variables: containerBuiltInStyles,
};
