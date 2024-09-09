import { CONTENTFUL_COMPONENTS } from '../constants';

const structureComponentIds = new Set([
  CONTENTFUL_COMPONENTS.section.id,
  CONTENTFUL_COMPONENTS.columns.id,
  CONTENTFUL_COMPONENTS.container.id,
  CONTENTFUL_COMPONENTS.singleColumn.id,
]);

const allComponentIds = new Set(
  Object.values(CONTENTFUL_COMPONENTS).map((component) => component.id),
);

export const isContentfulStructureComponent = (componentId?: string) =>
  structureComponentIds.has(componentId ?? '');

export const isContentfulComponent = (componentId?: string) =>
  allComponentIds.has(componentId ?? '');

export const isComponentAllowedOnRoot = (componentId?: string) =>
  isContentfulStructureComponent(componentId) || componentId === CONTENTFUL_COMPONENTS.divider.id;

export const isStructureWithRelativeHeight = (componentId?: string, height?: string | number) => {
  return isContentfulStructureComponent(componentId) && !height?.toString().endsWith('px');
};
