import { validateExperienceFields } from '../../src/validators';
import { experience, experiencePattern } from '../__fixtures__/v2023_09_28';
import { describe, it, expect } from 'vitest';
import { SafeParseError } from 'zod';

const schemaVersion = '2023-09-28' as const;
const locale = 'en-US';

describe('componentSettings', () => {
  it('fails if variableDefinitions is missing', () => {
    const updatedPattern = {
      ...experiencePattern,
      fields: {
        ...experience.fields,
        componentSettings: {
          [locale]: {},
        },
      },
    };
    const result = validateExperienceFields(updatedPattern, schemaVersion) as SafeParseError<
      typeof updatedPattern
    >;

    const expectedError = {
      received: 'undefined',
      code: 'invalid_type',
      expected: 'object',
      path: ['componentSettings', 'en-US', 'variableDefinitions'],
      message: 'Required',
    };

    expect(result.success).toBe(false);
    expect(result.error.issues[0]).toEqual(expect.objectContaining(expectedError));
  });

  it('fails if variable definition is invalid', () => {
    const updatedPattern = {
      ...experiencePattern,
      fields: {
        ...experience.fields,
        componentSettings: {
          [locale]: { variableDefinitions: { var1: 'invalid' } },
        },
      },
    };
    const result = validateExperienceFields(updatedPattern, schemaVersion) as SafeParseError<
      typeof updatedPattern
    >;

    const expectedError = {
      received: 'string',
      code: 'invalid_type',
      expected: 'object',
      path: ['componentSettings', 'en-US', 'variableDefinitions', 'var1'],
      message: 'Expected object, received string',
    };

    expect(result.success).toBe(false);
    expect(result.error.issues[0]).toEqual(expect.objectContaining(expectedError));
  });

  it('fails if variable definition is missing a displayName', () => {
    const updatedPattern = {
      ...experiencePattern,
      fields: {
        ...experience.fields,
        componentSettings: {
          [locale]: { variableDefinitions: { var1: { type: 'Text', defaultValue: '' } } },
        },
      },
    };
    const result = validateExperienceFields(updatedPattern, schemaVersion) as SafeParseError<
      typeof updatedPattern
    >;

    const expectedError = {
      received: 'undefined',
      code: 'invalid_type',
      expected: 'string',
      path: ['componentSettings', 'en-US', 'variableDefinitions', 'var1', 'displayName'],
      message: 'Required',
    };

    expect(result.success).toBe(false);
    expect(result.error.issues[0]).toEqual(expect.objectContaining(expectedError));
  });

  it('fails if componentSettings is used in conjuction with usedComponents', () => {
    const updatedPattern = {
      ...experiencePattern,
      fields: {
        ...experiencePattern.fields,
        usedComponents: {
          [locale]: [{ sys: { id: 'id1', linkType: 'Entry', type: 'Link' } }],
        },
      },
    };

    const result = validateExperienceFields(updatedPattern, schemaVersion) as SafeParseError<
      typeof updatedPattern
    >;

    const expectedError = {
      code: 'custom',
      message:
        "'componentSettings' field cannot be used in conjunction with 'usedComponents' field",
      path: ['componentSettings', 'en-US'],
    };

    expect(result.success).toBe(false);
    expect(result.error.issues[0]).toEqual(expect.objectContaining(expectedError));
  });
});
