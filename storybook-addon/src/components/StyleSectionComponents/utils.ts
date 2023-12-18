import { SpacingUnitRegexp, SpacingValueRegexp } from './constants';

export const ensureHasMeasureUnit = (value: string) => {
  const trimmedValue = value.trim();

  if (value === '') {
    return '0px';
  }

  // Enforce number together with unit
  if (SpacingValueRegexp.test(trimmedValue) && SpacingUnitRegexp.test(trimmedValue)) {
    return trimmedValue;
  }

  const numericValue = Number(trimmedValue);

  if (isNaN(numericValue)) {
    return '0px';
  }

  return `${numericValue}px`;
};
