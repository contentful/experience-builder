import { validateExperienceFields } from '../../src/validators';
import { experience, experiencePattern } from '../__fixtures__/v2023_09_28';
import { describe, it, expect } from 'vitest';
import { SafeParseError, SafeParseSuccess } from 'zod';

const schemaVersion = '2023-09-28' as const;

describe(`${schemaVersion} version`, () => {
  const requiredFields = ['componentTree', 'dataSource', 'unboundValues'] as const;

  it.each(requiredFields)('should return an error if "%s" field is missing', (field) => {
    const { [field]: _, ...rest } = experience.fields;
    const updatedExperience = { ...experience, fields: rest };
    const result = validateExperienceFields(updatedExperience, schemaVersion) as SafeParseError<
      typeof updatedExperience
    >;

    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe('Required');
  });

  it('should validate the experience successfully', () => {
    const result = validateExperienceFields(experience, schemaVersion) as SafeParseSuccess<
      typeof experience
    >;

    expect(result.success).toBe(true);
    expect(result.data).not.toBeUndefined();
  });

  it('should validate the pattern successfully', () => {
    const result = validateExperienceFields(experiencePattern, schemaVersion) as SafeParseSuccess<
      typeof experiencePattern
    >;

    expect(result.success).toBe(true);
    expect(result.data).not.toBeUndefined();
  });
});
