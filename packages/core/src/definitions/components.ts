import type { ComponentDefinition } from '@/types';
import { CONTENTFUL_COMPONENT_CATEGORY, CONTENTFUL_COMPONENTS } from '@/constants';
import {
  builtInStyles,
  columnsBuiltInStyles,
  containerBuiltInStyles,
  singleColumnBuiltInStyles,
} from './styles';

export const sectionDefinition: ComponentDefinition = {
  id: CONTENTFUL_COMPONENTS.section.id,
  name: CONTENTFUL_COMPONENTS.section.name,
  category: CONTENTFUL_COMPONENT_CATEGORY,
  children: true,
  variables: builtInStyles,
  tooltip: {
    description:
      'Create a new full width section of your experience by dragging this component onto the canvas. Other components and patterns can be added into a section.',
  },
};

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

export const columnsDefinition: ComponentDefinition = {
  id: CONTENTFUL_COMPONENTS.columns.id,
  name: CONTENTFUL_COMPONENTS.columns.name,
  category: CONTENTFUL_COMPONENT_CATEGORY,
  children: true,
  variables: columnsBuiltInStyles,
  tooltip: {
    description:
      'Add columns to a container to create your desired layout and ensure that the experience is responsive across different screen sizes.',
  },
};

export const singleColumnDefinition: ComponentDefinition = {
  id: CONTENTFUL_COMPONENTS.singleColumn.id,
  name: CONTENTFUL_COMPONENTS.singleColumn.name,
  category: CONTENTFUL_COMPONENT_CATEGORY,
  children: true,
  variables: singleColumnBuiltInStyles,
};
