import { validateExperienceFields } from '@/validators';
import { experience, experiencePattern } from '@/test/__fixtures__/v2023_09_28';
import { describe, it, expect } from 'vitest';
import { PATTERN_THUMBNAIL_IDS } from '@/schemas/latest';

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

  it('passes if componentSettings is used in conjuction with usedComponents', () => {
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

    expect(result.success).toBe(true);
    expect(result.errors).toBeUndefined();
  });

  it('passes if componentSettings is used NOT in conjunction with usedComponents', () => {
    const result = validateExperienceFields(experiencePattern, schemaVersion);

    expect(result.success).toBe(true);
    expect(result.errors).toBeUndefined();
  });

  it('allows to have an optional thumbnailId field', () => {
    PATTERN_THUMBNAIL_IDS.forEach((thumbnailId) => {
      const pattern = {
        ...experiencePattern,
        fields: {
          ...experiencePattern.fields,
          componentSettings: {
            [locale]: {
              variableDefinitions: {},
              thumbnailId: thumbnailId,
            },
          },
        },
      };
      const result = validateExperienceFields(pattern, schemaVersion);
      expect(result.success).toBe(true);
      expect(result.errors).toBeUndefined();
    });
  });

  it('errors if the thumbnailId contains an unsupported value', () => {
    const pattern = {
      ...experiencePattern,
      fields: {
        ...experiencePattern.fields,
        componentSettings: {
          [locale]: {
            variableDefinitions: {},
            thumbnailId: 'poop',
          },
        },
      },
    };
    const result = validateExperienceFields(pattern, schemaVersion);
    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors?.[0].details.startsWith('Invalid enum value.')).toBe(true);
  });

  it('allows to have an optional category field', () => {
    const pattern = {
      ...experiencePattern,
      fields: {
        ...experiencePattern.fields,
        componentSettings: {
          [locale]: {
            variableDefinitions: {},
            category: 'My fancy category',
          },
        },
      },
    };
    const result = validateExperienceFields(pattern, schemaVersion);
    expect(result.success).toBe(true);
    expect(result.errors).toBeUndefined();
  });

  it('errors if the category is more than 50 characters length', () => {
    const pattern = {
      ...experiencePattern,
      fields: {
        ...experiencePattern.fields,
        componentSettings: {
          [locale]: {
            variableDefinitions: {},
            category: 'a'.repeat(51),
          },
        },
      },
    };
    const result = validateExperienceFields(pattern, schemaVersion);
    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors?.[0].details).toBe('Category must contain at most 50 characters');
  });
});
