import type { ComponentDefinition } from '@/types';

import { CONTENTFUL_COMPONENT_CATEGORY, CONTENTFUL_COMPONENTS } from '@/constants';
import { columnsBuiltInStyles, containerBuiltInStyles, singleColumnBuiltInStyles } from './styles';

export const containerDefinition: ComponentDefinition = {
  id: CONTENTFUL_COMPONENTS.container.id,
  name: CONTENTFUL_COMPONENTS.container.name,
  category: CONTENTFUL_COMPONENT_CATEGORY,
  children: true,
  variables: containerBuiltInStyles,
  rootComponent: true,
};

export const columnsDefinition: ComponentDefinition = {
  id: CONTENTFUL_COMPONENTS.columns.id,
  name: CONTENTFUL_COMPONENTS.columns.name,
  category: CONTENTFUL_COMPONENT_CATEGORY,
  children: true,
  variables: columnsBuiltInStyles,
  rootComponent: true,
};

export const singleColumnDefinition: ComponentDefinition = {
  id: CONTENTFUL_COMPONENTS.singleColumn.id,
  name: CONTENTFUL_COMPONENTS.singleColumn.name,
  category: CONTENTFUL_COMPONENT_CATEGORY,
  children: true,
  variables: singleColumnBuiltInStyles,
  rootComponent: true,
};
