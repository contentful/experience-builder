import type { ComponentDefinition } from '@/types';

import {
  CONTENTFUL_COLUMNS_ID,
  CONTENTFUL_COLUMNS_NAME,
  CONTENTFUL_COMPONENT_CATEGORY,
  CONTENTFUL_CONTAINER_ID,
  CONTENTFUL_SINGLE_COLUMN_ID,
  CONTENTFUL_SINGLE_COLUMN_NAME,
} from '@/constants';
import { columnsBuiltInStyles, containerBuiltInStyles, singleColumnBuiltInStyles } from './styles';

export const containerDefinition: ComponentDefinition = {
  id: CONTENTFUL_CONTAINER_ID,
  name: 'Container',
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
