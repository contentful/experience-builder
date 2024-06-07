import { validateExperienceFields } from '../../src/validators';
import { experience } from '../__fixtures__/v2023_09_28';
import { describe, it, expect } from 'vitest';

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
    const result = validateExperienceFields(updatedExperience, schemaVersion);

    const expectedError = {
      name: 'in',
      expected: ['Entry'],
      path: ['usedComponents', 'en-US', 0, 'sys', 'linkType'],
      details: 'Invalid literal value, expected "Entry"',
      value: 'Invalid',
    };

    expect(result.success).toBe(false);
    expect(result.errors).toEqual([expectedError]);
  });
});
