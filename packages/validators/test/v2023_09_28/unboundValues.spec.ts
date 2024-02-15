import { validateExperienceFields } from '../../src/validators';
import { experience } from '../__fixtures__/v2023_09_28';
import { describe, it, expect } from 'vitest';
import { SafeParseError } from 'zod';

const schemaVersion = '2023-09-28' as const;
const locale = 'en-US';

describe('unboundValues', () => {
  it(`fails if unboundValues is not an object`, () => {
    const updatedExperience = {
      ...experience,
      fields: {
        ...experience.fields,
        unboundValues: { [locale]: [] },
      },
    };
    const result = validateExperienceFields(updatedExperience, schemaVersion) as SafeParseError<
      typeof updatedExperience
    >;

    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe('Expected object, received array');
  });

  it('fails if value is not an object', () => {
    const updatedExperience = {
      ...experience,
      fields: {
        ...experience.fields,
        unboundValues: { [locale]: { uuid1: 'invalidValue' } },
      },
    };
    const result = validateExperienceFields(updatedExperience, schemaVersion) as SafeParseError<
      typeof updatedExperience
    >;

    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe('Expected object, received string');
  });
});
