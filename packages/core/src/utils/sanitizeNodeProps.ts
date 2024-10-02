import { omit } from 'lodash-es';
import { CF_STYLE_ATTRIBUTES } from '../constants';
import type { PrimitiveValue } from '../types';

const stylesToKeep = ['cfImageAsset'];
const stylesToRemove = CF_STYLE_ATTRIBUTES.filter((style) => !stylesToKeep.includes(style));
const propsToRemove = ['cfHyperlink', 'cfOpenInNewTab', 'cfSsrClassName'];

export const sanitizeNodeProps = (nodeProps: Record<PropertyKey, PrimitiveValue>) => {
  return omit(nodeProps, stylesToRemove, propsToRemove);
};
