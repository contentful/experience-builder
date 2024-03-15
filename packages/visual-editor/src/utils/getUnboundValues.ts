import { get } from 'lodash-es';
import type {
  CompositionUnboundValues,
  CompositionVariableValueType,
} from '@contentful/experiences-core/types';

export const getUnboundValues = ({
  key,
  fallback,
  unboundValues,
}: {
  key: string;
  unboundValues: CompositionUnboundValues;
  fallback?: CompositionVariableValueType;
}): CompositionVariableValueType => {
  const lodashPath = `${key}.value`;

  return get(unboundValues, lodashPath, fallback) as CompositionVariableValueType;
};
