import { builtInStyles } from '@contentful/experience-builder-core';
import { ContentfulContainer } from './ContentfulContainer';
import {
  ComponentDefinitionVariable,
  ComponentDefinition,
} from '@contentful/experience-builder-core/types';
import {
  CONTENTFUL_COMPONENT_CATEGORY,
  CONTENTFUL_CONTAINER_ID,
} from '@contentful/experience-builder-core/constants';

export { ContentfulContainer };

export const containerBuiltInStyles = {
  ...builtInStyles,
  cfHeight: {
    displayName: 'Height',
    type: 'Text',
    group: 'style',
    description: 'The height of the section',
    defaultValue: 'auto',
  } as ComponentDefinitionVariable<'Text'>,
};

export const ContentfulContainerComponentDefinition: ComponentDefinition = {
  id: CONTENTFUL_CONTAINER_ID,
  name: 'Container',
  category: CONTENTFUL_COMPONENT_CATEGORY,
  children: true,
  variables: containerBuiltInStyles,
};
