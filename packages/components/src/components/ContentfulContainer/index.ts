import { containerBuiltInStyles, sectionBuiltInStyles } from '@contentful/experiences-core';
import {
  CONTENTFUL_COMPONENTS,
  CONTENTFUL_COMPONENT_CATEGORY,
} from '@contentful/experiences-core/constants';
import { ComponentDefinition } from '@contentful/experiences-core/types';

export { ContentfulContainer } from './ContentfulContainer';

export const containerDefinition: ComponentDefinition = {
  id: CONTENTFUL_COMPONENTS.container.id,
  name: CONTENTFUL_COMPONENTS.container.name,
  category: CONTENTFUL_COMPONENT_CATEGORY,
  children: true,
  variables: containerBuiltInStyles,
  tooltip: {
    description:
      'Create a new area or pattern within your page layout by dragging a container onto the canvas. Other components and patterns can be added into a container.',
  },
};

export const sectionDefinition: ComponentDefinition = {
  id: CONTENTFUL_COMPONENTS.section.id,
  name: CONTENTFUL_COMPONENTS.section.name,
  category: CONTENTFUL_COMPONENT_CATEGORY,
  children: true,
  variables: sectionBuiltInStyles,
  tooltip: {
    description:
      'Create a new full width section of your experience by dragging this component onto the canvas. Other components and patterns can be added into a section.',
  },
};
