import { CONTENTFUL_COMPONENTS } from '../constants';

const structureComponents = new Set([
  CONTENTFUL_COMPONENTS.section.id,
  CONTENTFUL_COMPONENTS.columns.id,
  CONTENTFUL_COMPONENTS.container.id,
  CONTENTFUL_COMPONENTS.singleColumn.id,
]);

export const isContentfulStructureComponent = (componentId?: string) =>
  structureComponents.has(componentId ?? '');

export const isComponentAllowedOnRoot = (componentId?: string) =>
  isContentfulStructureComponent(componentId) || componentId === CONTENTFUL_COMPONENTS.divider.id;

export const isStructureWithRelativeHeight = (componentId?: string, height?: string | number) => {
  return isContentfulStructureComponent(componentId) && !height?.toString().endsWith('px');
};
