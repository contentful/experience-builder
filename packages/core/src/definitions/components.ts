import type { ComponentDefinition } from '@/types';
import {
  CONTENTFUL_COLUMNS_ID,
  CONTENTFUL_COLUMNS_NAME,
  CONTENTFUL_COMPONENT_CATEGORY,
  CONTENTFUL_CONTAINER_ID,
  CONTENTFUL_CONTAINER_NAME,
  CONTENTFUL_SECTION_ID,
  CONTENTFUL_SECTION_NAME,
  CONTENTFUL_SINGLE_COLUMN_ID,
  CONTENTFUL_SINGLE_COLUMN_NAME,
} from '@/constants';
import {
  builtInStyles,
  columnsBuiltInStyles,
  containerBuiltInStyles,
  singleColumnBuiltInStyles,
} from './styles';

export const sectionDefinition: ComponentDefinition = {
  id: CONTENTFUL_SECTION_ID,
  name: CONTENTFUL_SECTION_NAME,
  category: CONTENTFUL_COMPONENT_CATEGORY,
  children: true,
  variables: builtInStyles,
  rootComponent: true,
};

export const containerDefinition: ComponentDefinition = {
  id: CONTENTFUL_CONTAINER_ID,
  name: CONTENTFUL_CONTAINER_NAME,
  category: CONTENTFUL_COMPONENT_CATEGORY,
  children: true,
  variables: containerBuiltInStyles,
  rootComponent: true,
};

export const columnsDefinition: ComponentDefinition = {
  id: CONTENTFUL_COLUMNS_ID,
  name: CONTENTFUL_COLUMNS_NAME,
  category: CONTENTFUL_COMPONENT_CATEGORY,
  children: true,
  variables: columnsBuiltInStyles,
  rootComponent: true,
};

export const singleColumnDefinition: ComponentDefinition = {
  id: CONTENTFUL_SINGLE_COLUMN_ID,
  name: CONTENTFUL_SINGLE_COLUMN_NAME,
  category: CONTENTFUL_COMPONENT_CATEGORY,
  children: true,
  variables: singleColumnBuiltInStyles,
  rootComponent: true,
};
