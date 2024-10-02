import { omit } from 'lodash-es';
import {
  ASSEMBLY_BLOCK_NODE_TYPE,
  ASSEMBLY_DEFAULT_CATEGORY,
  ASSEMBLY_NODE_TYPE,
  CF_STYLE_ATTRIBUTES,
  CONTENTFUL_COMPONENTS,
} from '../constants';
import type { PrimitiveValue } from '../types';

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

export const isPatternComponent = (type?: string) => patternTypes.has(type ?? '');

export const isContentfulStructureComponent = (componentId?: string) =>
  structureComponentIds.has(componentId ?? '');

export const isContentfulComponent = (componentId?: string) =>
  allContentfulComponentIds.has(componentId ?? '');

export const isComponentAllowedOnRoot = ({ type, category, componentId }: ComponentAllowOnRoot) =>
  isPatternComponent(type) ||
  category === ASSEMBLY_DEFAULT_CATEGORY ||
  isContentfulStructureComponent(componentId) ||
  componentId === CONTENTFUL_COMPONENTS.divider.id;

export const isStructureWithRelativeHeight = (componentId?: string, height?: string | number) => {
  return isContentfulStructureComponent(componentId) && height?.toString().endsWith('%');
};

const stylesToKeep = ['cfImageAsset'];
const stylesToRemove = CF_STYLE_ATTRIBUTES.filter((style) => !stylesToKeep.includes(style));
const propsToRemove = ['cfHyperlink', 'cfOpenInNewTab', 'cfSsrClassName'];

export const sanitizeNodeProps = (nodeProps: Record<PropertyKey, PrimitiveValue>) => {
  return omit(nodeProps, stylesToRemove, propsToRemove);
};
