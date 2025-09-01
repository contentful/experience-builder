import { omit } from 'lodash-es';
import { CF_STYLE_ATTRIBUTES } from '../constants';
import type { PrimitiveValue } from '../types';

const stylesToKeep = ['cfImageAsset'];
const stylesToRemove = CF_STYLE_ATTRIBUTES.filter((style) => !stylesToKeep.includes(style));
// cfWrapColumns & cfWrapColumnsCount are no real style attributes as they are handled on the editor side
const propsToRemove = ['cfSsrClassName', 'cfWrapColumns', 'cfWrapColumnsCount'];

export const sanitizeNodeProps = (nodeProps: Record<PropertyKey, PrimitiveValue>) => {
  return omit(nodeProps, stylesToRemove, propsToRemove);
};
