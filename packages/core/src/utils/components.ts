import { CONTENTFUL_COMPONENTS } from '../constants';

export const isContentfulStructureComponent = (componentId?: string) =>
  [
    CONTENTFUL_COMPONENTS.section.id,
    CONTENTFUL_COMPONENTS.columns.id,
    CONTENTFUL_COMPONENTS.container.id,
    CONTENTFUL_COMPONENTS.singleColumn.id,
  ].includes(componentId ?? '');
