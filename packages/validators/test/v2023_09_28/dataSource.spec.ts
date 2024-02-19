import { validateExperienceFields } from '../../src/validators';
import { experience } from '../__fixtures__/v2023_09_28';
import { describe, it, expect } from 'vitest';

const schemaVersion = '2023-09-28' as const;
const locale = 'en-US';

describe('dataSource', () => {
  it(`fails if dataSource is not an object`, () => {
    const updatedExperience = {
      ...experience,
      fields: {
        ...experience.fields,
        dataSource: { [locale]: [] },
      },
    };
    const result = validateExperienceFields(updatedExperience, schemaVersion);

    expect(result.success).toBe(false);
    const expectedError = {
      name: 'type',
      value: 'array',
      path: ['dataSource', 'en-US'],
      details: 'The type of "en-US" is incorrect, expected type: object',
    };
    expect(result.errors).toEqual([expectedError]);
  });

  it('fails if value is not an object', () => {
    const updatedExperience = {
      ...experience,
      fields: {
        ...experience.fields,
        dataSource: { [locale]: { uuid1: 'invalidValue' } },
      },
    };
    const result = validateExperienceFields(updatedExperience, schemaVersion);

    const expectedError = {
      name: 'type',
      value: 'string',
      path: ['dataSource', 'en-US', 'uuid1'],
      details: 'The type of "uuid1" is incorrect, expected type: object',
    };
    expect(result.success).toBe(false);
    expect(result.errors).toEqual([expectedError]);
  });

  it('fails if key is longer than 21 characters', () => {
    const updatedExperience = {
      ...experience,
      fields: {
        ...experience.fields,
        dataSource: { [locale]: { ['uuid1'.repeat(5)]: {} } },
      },
    };
    const result = validateExperienceFields(updatedExperience, schemaVersion);

    const expectedError = {
      name: 'regex',
      path: ['dataSource', 'en-US', 'uuid1'.repeat(5)],
      details: 'Does not match /^[a-zA-Z0-9-_]{1,21}$/',
    };
    expect(result.success).toBe(false);
    expect(result.errors?.[0]).toEqual(expectedError);
  });

  it('fails if key contains invalid characters', () => {
    const updatedExperience = {
      ...experience,
      fields: {
        ...experience.fields,
        dataSource: {
          [locale]: { 'uuid1!$*': { sys: { id: '123', linkType: 'Entry', type: 'Link' } } },
        },
      },
    };
    const result = validateExperienceFields(updatedExperience, schemaVersion);

    const expectedError = {
      name: 'regex',
      path: ['dataSource', 'en-US', 'uuid1!$*'],
      details: 'Does not match /^[a-zA-Z0-9-_]{1,21}$/',
    };
    expect(result.success).toBe(false);
    expect(result.errors?.[0]).toEqual(expectedError);
  });

  it('fails if value is an invalid link', () => {
    const updatedExperience = {
      ...experience,
      fields: {
        ...experience.fields,
        dataSource: {
          [locale]: { uuid1: { sys: { id: 'id1', linkType: 'Invalid', type: 'Link' } } },
        },
      },
    };
    const result = validateExperienceFields(updatedExperience, schemaVersion);

    const expectedError = {
      name: 'in',
      expected: ['Entry', 'Asset'],
      path: ['dataSource', 'en-US', 'uuid1', 'sys', 'linkType'],
      details: "Invalid enum value. Expected 'Entry' | 'Asset', received 'Invalid'",
      value: 'Invalid',
    };
    expect(result.success).toBe(false);
    expect(result.errors?.[0]).toEqual(expectedError);
  });
});
