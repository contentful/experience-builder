import type { ComponentDefinition } from '@/types';
import {
  CONTENTFUL_COMPONENT_CATEGORY,
  CONTENTFUL_CONTAINER_ID,
  CONTENTFUL_CONTAINER_NAME,
  CONTENTFUL_SECTION_ID,
  CONTENTFUL_SECTION_NAME,
} from '@/constants';
import { builtInStyles, containerBuiltInStyles } from './styles';

export const containerDefinition: ComponentDefinition = {
  id: CONTENTFUL_CONTAINER_ID,
  name: CONTENTFUL_CONTAINER_NAME,
  category: CONTENTFUL_COMPONENT_CATEGORY,
  children: true,
  variables: containerBuiltInStyles,
  rootComponent: true,
};

export const sectionDefinition: ComponentDefinition = {
  id: CONTENTFUL_SECTION_ID,
  name: CONTENTFUL_SECTION_NAME,
  category: CONTENTFUL_COMPONENT_CATEGORY,
  children: true,
  variables: builtInStyles,
  rootComponent: true,
};
