import { validateExperienceFields } from '../../src/validators';
import { experience } from '../__fixtures__/v2023_09_28';
import { describe, it, expect } from 'vitest';
import { SafeParseError } from 'zod';

const schemaVersion = '2023-09-28' as const;
const locale = 'en-US';

describe('usedComponents', () => {
  it('fails if value is an invalid link', () => {
    const updatedExperience = {
      ...experience,
      fields: {
        ...experience.fields,
        usedComponents: {
          [locale]: [{ sys: { id: 'id1', linkType: 'Invalid', type: 'Link' } }],
        },
      },
    };
    const result = validateExperienceFields(updatedExperience, schemaVersion) as SafeParseError<
      typeof updatedExperience
    >;

    const expectedError = {
      received: 'Invalid',
      code: 'invalid_literal',
      expected: 'Entry',
      path: ['usedComponents', 'en-US', 0, 'sys', 'linkType'],
      message: 'Invalid literal value, expected "Entry"',
    };

    expect(result.success).toBe(false);
    expect(result.error.issues[0]).toEqual(expect.objectContaining(expectedError));
  });
});
