import { get } from 'lodash-es';
import type { ExperienceUnboundValues, PrimitiveValue } from '@contentful/experiences-core/types';

export const getUnboundValues = ({
  key,
  fallback,
  unboundValues,
}: {
  key: string;
  fallback: PrimitiveValue;
  unboundValues: ExperienceUnboundValues;
}): PrimitiveValue => {
  const lodashPath = `${key}.value`;

  return get(unboundValues, lodashPath, fallback) as PrimitiveValue;
};
