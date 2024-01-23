import { CONTENTFUL_CONTAINER_ID, CONTENTFUL_SECTION_ID } from '../constants';

export const isContentfulStructureComponent = (componentId?: string) =>
  [CONTENTFUL_CONTAINER_ID, CONTENTFUL_SECTION_ID].includes(componentId ?? '');
