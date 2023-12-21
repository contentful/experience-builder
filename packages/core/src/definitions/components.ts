import type { ComponentDefinition } from '@/types';

import { CONTENTFUL_COMPONENT_CATEGORY, CONTENTFUL_CONTAINER_ID } from '@/constants';
import { containerBuiltInStyles } from './styles';

export const containerDefinition: ComponentDefinition = {
  id: CONTENTFUL_CONTAINER_ID,
  name: 'Container',
  category: CONTENTFUL_COMPONENT_CATEGORY,
  children: true,
  variables: containerBuiltInStyles,
};
