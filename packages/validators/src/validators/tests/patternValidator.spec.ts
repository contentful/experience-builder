import { experiencePattern } from '@/test/__fixtures__/v2023_09_28';
import { describe, it, expect } from 'vitest';
import { validatePatternFields } from '@/validators/validatePatternFields';

const schemaVersion = '2023-09-28' as const;

describe(`${schemaVersion} version`, () => {
  const requiredFields = ['componentTree', 'dataSource', 'unboundValues'] as const;

  it.each(requiredFields)('should return an error if "%s" field is missing', (field) => {
    const { [field]: _, ...rest } = experiencePattern.fields;
    const updatedPattern = { ...experiencePattern, fields: rest };
    const result = validatePatternFields(updatedPattern, schemaVersion);

    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
    const error = result.errors?.[0];

    expect(error?.name).toBe('required');
    expect(error?.details).toBe(`The property "${field}" is required here`);
  });

  it('should validate the pattern successfully', () => {
    const result = validatePatternFields(experiencePattern, schemaVersion);

    expect(result.success).toBe(true);
  });

  it('should read the schema version from the componentTree if no override is provided', () => {
    const result = validatePatternFields(experiencePattern);

    expect(result.success).toBe(true);
  });
});
