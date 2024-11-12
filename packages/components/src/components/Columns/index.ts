import { columnsBuiltInStyles, singleColumnBuiltInStyles } from '@contentful/experiences-core';
import {
  CONTENTFUL_COMPONENTS,
  CONTENTFUL_COMPONENT_CATEGORY,
} from '@contentful/experiences-core/constants';
import { ComponentDefinition } from '@contentful/experiences-core/types';
import { Columns } from './Columns';
import { SingleColumn } from './SingleColumn';

export { Columns, SingleColumn };

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
