import get from 'lodash.get';
import {
  CompositionUnboundValues,
  CompositionVariableValueType,
} from '@contentful/experience-builder-core';

export const getUnboundValues = ({
  key,
  fallback,
  unboundValues,
}: {
  key: string;
  fallback: CompositionVariableValueType;
  unboundValues: CompositionUnboundValues;
}): CompositionVariableValueType => {
  const lodashPath = `${key}.value`;

  return get(unboundValues, lodashPath, fallback) as CompositionVariableValueType;
};
