import { validateExperienceFields } from '..';
import { experience } from '../../test/__fixtures__/v2023_09_28';
import { describe, it, expect } from 'vitest';

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
    const result = validateExperienceFields(updatedExperience, schemaVersion);

    expect(result.success).toBe(false);
    const expectedError = {
      name: 'type',
      value: 'array',
      path: ['unboundValues', 'en-US'],
      details: 'The type of "en-US" is incorrect, expected type: object',
    };
    expect(result.errors).toEqual([expectedError]);
  });

  it('fails if value is not an object', () => {
    const updatedExperience = {
      ...experience,
      fields: {
        ...experience.fields,
        unboundValues: { [locale]: { uuid1: 'invalidValue' } },
      },
    };
    const result = validateExperienceFields(updatedExperience, schemaVersion);

    expect(result.success).toBe(false);
    const expectedError = {
      name: 'type',
      value: 'string',
      path: ['unboundValues', 'en-US', 'uuid1'],
      details: 'The type of "uuid1" is incorrect, expected type: object',
    };
    expect(result.errors).toEqual([expectedError]);
  });
});
