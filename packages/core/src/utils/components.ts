import {
  ASSEMBLY_BLOCK_NODE_TYPE,
  ASSEMBLY_DEFAULT_CATEGORY,
  ASSEMBLY_NODE_TYPE,
  CONTENTFUL_COMPONENTS,
} from '../constants';

const structureComponentIds = new Set([
  CONTENTFUL_COMPONENTS.section.id,
  CONTENTFUL_COMPONENTS.columns.id,
  CONTENTFUL_COMPONENTS.container.id,
  CONTENTFUL_COMPONENTS.singleColumn.id,
]);

const patternTypes = new Set([ASSEMBLY_NODE_TYPE, ASSEMBLY_BLOCK_NODE_TYPE]);

type ComponentAllowOnRoot = {
  type?: string;
  category?: string;
  componentId?: string;
};

const allContentfulComponentIds = new Set(
  Object.values(CONTENTFUL_COMPONENTS).map((component) => component.id),
);

type SetElement<ElementType> = ElementType extends Set<infer E> ? E : never;
type StructureComponentId = SetElement<typeof structureComponentIds>;
type AllContentfulComponentId = SetElement<typeof allContentfulComponentIds>;

export const isPatternComponent = (type?: string) => patternTypes.has(type ?? '');

export const isContentfulStructureComponent = (
  componentId?: string,
): componentId is StructureComponentId =>
  structureComponentIds.has((componentId ?? '') as StructureComponentId);

export const isContentfulComponent = (
  componentId?: string,
): componentId is AllContentfulComponentId =>
  allContentfulComponentIds.has((componentId ?? '') as AllContentfulComponentId);

export const isComponentAllowedOnRoot = ({ type, category, componentId }: ComponentAllowOnRoot) =>
  isPatternComponent(type) ||
  category === ASSEMBLY_DEFAULT_CATEGORY ||
  isContentfulStructureComponent(componentId) ||
  componentId === CONTENTFUL_COMPONENTS.divider.id;

export const isStructureWithRelativeHeight = (
  componentId?: string,
  height?: string | number,
): componentId is StructureComponentId => {
  return isContentfulStructureComponent(componentId) && !height?.toString().endsWith('px');
};
