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
    const result = validateExperienceFields(updatedPattern, schemaVersion);

    const expectedError = {
      details: 'The property "variableDefinitions" is required here',
      name: 'required',
      path: ['componentSettings', 'en-US', 'variableDefinitions'],
      value: 'undefined',
    };

    expect(result.success).toBe(false);
    expect(result.errors).toEqual([expectedError]);
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
    const result = validateExperienceFields(updatedPattern, schemaVersion);

    const expectedError = {
      details: 'The type of "var1" is incorrect, expected type: object',
      name: 'type',
      path: ['componentSettings', 'en-US', 'variableDefinitions', 'var1'],
      value: 'string',
    };

    expect(result.success).toBe(false);
    expect(result.errors).toEqual([expectedError]);
  });

  it('fails if variable definition key is longer than 54 characters', () => {
    const updatedPattern = {
      ...experiencePattern,
      fields: {
        ...experience.fields,
        componentSettings: {
          [locale]: { variableDefinitions: { ['variable1'.repeat(7)]: {} } },
        },
      },
    };
    const result = validateExperienceFields(updatedPattern, schemaVersion);

    const expectedError = {
      details: 'Invalid',
      name: 'regex',
      path: ['componentSettings', 'en-US', 'variableDefinitions', 'variable1'.repeat(7)],
    };

    expect(result.success).toBe(false);
    expect(result.errors?.[0]).toEqual(expectedError);
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

    const result = validateExperienceFields(updatedPattern, schemaVersion);

    const expectedError = {
      name: 'custom',
      details:
        "'componentSettings' field cannot be used in conjunction with 'usedComponents' field",
      path: ['componentSettings', 'en-US'],
    };

    expect(result.success).toBe(false);
    expect(result.errors).toEqual([expectedError]);
  });
});
