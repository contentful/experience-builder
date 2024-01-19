import type { ComponentDefinition } from '@/types';
import * as Constants from '@/constants';
import { containerBuiltInStyles, sectionBuiltInStyles } from './styles';

export const containerDefinition: ComponentDefinition = {
  id: Constants.CONTENTFUL_CONTAINER_ID,
  name: Constants.CONTENTFUL_CONTAINER_NAME,
  category: Constants.CONTENTFUL_COMPONENT_CATEGORY,
  children: true,
  variables: containerBuiltInStyles,
  rootComponent: true,
};

export const sectionDefinition: ComponentDefinition = {
  id: Constants.CONTENTFUL_SECTION_ID,
  name: Constants.CONTENTFUL_SECTION_NAME,
  category: Constants.CONTENTFUL_COMPONENT_CATEGORY,
  children: true,
  variables: sectionBuiltInStyles,
  rootComponent: true,
};
