import {
  CONTENTFUL_COMPONENT_CATEGORY,
  CONTENTFUL_CONTAINER_ID,
} from '@contentful/experience-builder-core/constants';
import type { ComponentDefinition } from '@contentful/experience-builder-core/types';
import { containerBuiltInStyles } from './variables';

export const containerDefinition: ComponentDefinition = {
  id: CONTENTFUL_CONTAINER_ID,
  name: 'Container',
  category: CONTENTFUL_COMPONENT_CATEGORY,
  children: true,
  variables: containerBuiltInStyles,
};
