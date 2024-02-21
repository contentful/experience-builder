import { CONTENTFUL_COMPONENTS } from '../constants';

const allStructureComponents = [
  CONTENTFUL_COMPONENTS.section.id,
  CONTENTFUL_COMPONENTS.columns.id,
  CONTENTFUL_COMPONENTS.container.id,
  CONTENTFUL_COMPONENTS.singleColumn.id,
];

export const isContentfulStructureComponent = (
  componentId?: string,
  excludeStructureIds?: string[],
) => {
  const searchIds = excludeStructureIds
    ? allStructureComponents.filter((id) => !excludeStructureIds?.includes(id))
    : allStructureComponents;
  return searchIds.includes(componentId ?? '');
};

export const isEmptyStructureWithRelativeHeight = (
  children: number,
  componentId?: string,
  height?: string | number,
) => {
  return (
    children === 0 &&
    isContentfulStructureComponent(componentId) &&
    !height?.toString().endsWith('px')
  );
};
