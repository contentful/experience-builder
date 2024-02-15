import { validateExperienceFields } from '../../src/validators';
import { experience } from '../__fixtures__/v2023_09_28';
import { describe, it, expect } from 'vitest';
import { SafeParseError, ZodInvalidUnionIssue } from 'zod';

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
        dataSource: { [locale]: { uuid1: 'invalidValue' } },
      },
    };
    const result = validateExperienceFields(updatedExperience, schemaVersion) as SafeParseError<
      typeof updatedExperience
    >;

    const expectedError = {
      code: 'invalid_type',
      expected: 'object',
      received: 'string',
      path: ['dataSource', 'en-US', 'uuid1'],
      message: 'Expected object, received string',
    };
    expect(result.success).toBe(false);
    expect(result.error.issues[0]).toEqual(expect.objectContaining(expectedError));
  });

  it('fails if key is longer than 21 characters', () => {
    const updatedExperience = {
      ...experience,
      fields: {
        ...experience.fields,
        dataSource: { [locale]: { ['uuid1'.repeat(5)]: 'invalidValue' } },
      },
    };
    const result = validateExperienceFields(updatedExperience, schemaVersion) as SafeParseError<
      typeof updatedExperience
    >;

    const expectedError = {
      code: 'invalid_string',
      path: ['dataSource', 'en-US', 'uuid1'.repeat(5)],
      message: 'Invalid',
      validation: 'regex',
    };
    expect(result.success).toBe(false);
    expect(result.error.issues[0]).toEqual(expect.objectContaining(expectedError));
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
    const result = validateExperienceFields(updatedExperience, schemaVersion) as SafeParseError<
      typeof updatedExperience
    >;

    const expectedError = {
      code: 'invalid_union',
      path: ['dataSource', 'en-US', 'uuid1', 'sys', 'linkType'],
      message: 'Invalid input',
    };

    expect(result.success).toBe(false);
    expect(result.error.issues[0]).toEqual(expect.objectContaining(expectedError));
    expect((result.error.issues[0] as ZodInvalidUnionIssue).unionErrors[0].issues[0]).toEqual({
      received: 'Invalid',
      code: 'invalid_literal',
      expected: 'Entry',
      path: ['dataSource', 'en-US', 'uuid1', 'sys', 'linkType'],
      message: 'Invalid literal value, expected "Entry"',
    });
    expect((result.error.issues[0] as ZodInvalidUnionIssue).unionErrors[1].issues[0]).toEqual({
      received: 'Invalid',
      code: 'invalid_literal',
      expected: 'Asset',
      path: ['dataSource', 'en-US', 'uuid1', 'sys', 'linkType'],
      message: 'Invalid literal value, expected "Asset"',
    });
  });
});
