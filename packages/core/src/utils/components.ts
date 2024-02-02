import { CONTENTFUL_COMPONENTS } from '../constants';

export const isContentfulStructureComponent = (componentId?: string) =>
  [
    CONTENTFUL_COMPONENTS.section.id,
    CONTENTFUL_COMPONENTS.columns.id,
    CONTENTFUL_COMPONENTS.container.id,
    CONTENTFUL_COMPONENTS.singleColumn.id,
  ].includes(componentId ?? '');

export const isEmptyStructureWithRelativeHeight = (
  children: number,
  componentId?: string,
  height?: string | number
) => {
  return (
    children === 0 &&
    isContentfulStructureComponent(componentId) &&
    !height?.toString().endsWith('px')
  );
};
