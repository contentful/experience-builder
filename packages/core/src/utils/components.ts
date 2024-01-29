import {
  CONTENTFUL_COLUMNS_ID,
  CONTENTFUL_CONTAINER_ID,
  CONTENTFUL_SECTION_ID,
  CONTENTFUL_SINGLE_COLUMN_ID,
} from '../constants';

export const isContentfulStructureComponent = (componentId?: string) =>
  [
    CONTENTFUL_SECTION_ID,
    CONTENTFUL_COLUMNS_ID,
    CONTENTFUL_CONTAINER_ID,
    CONTENTFUL_SINGLE_COLUMN_ID,
  ].includes(componentId ?? '');
