import { validateExperienceFields } from '../src/validators';
import { experience } from './fixtures/experience_2023_09_28';
import { describe, it, expect } from 'vitest';
import { SafeParseError, SafeParseSuccess } from 'zod';

const schemaVersion = '2023-09-28' as const;
const locale = 'en-US';
const requiredFields = ['componentTree', 'dataSource', 'unboundValues'] as const;

describe(`${schemaVersion} version`, () => {
  requiredFields.forEach((field) => {
    it(`should return an error if ${field} is missing`, () => {
      const { [field]: _, ...rest } = experience.fields;
      const updatedExperience = { ...experience, fields: rest };
      const result = validateExperienceFields(updatedExperience, schemaVersion) as SafeParseError<
        typeof updatedExperience
      >;

      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toBe('Required');
    });
  });

  describe('componentTree', () => {
    it(`fails if breakpoints is missing`, () => {
      const componentTree = experience.fields.componentTree[locale];
      const updatedExperience = {
        ...experience,
        fields: {
          ...experience.fields,
          componentTree: { [locale]: { ...componentTree, breakpoints: undefined } },
        },
      };
      const result = validateExperienceFields(updatedExperience, schemaVersion) as SafeParseError<
        typeof updatedExperience
      >;

      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toBe('Required');
    });

    it(`fails if breakpoints is empty`, () => {
      const componentTree = experience.fields.componentTree[locale];
      const updatedExperience = {
        ...experience,
        fields: {
          ...experience.fields,
          componentTree: { [locale]: { ...componentTree, breakpoints: [] } },
        },
      };
      const result = validateExperienceFields(updatedExperience, schemaVersion) as SafeParseError<
        typeof updatedExperience
      >;

      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toBe('At least one breakpoint is required');
    });

    it(`fails if any breakpoint attribute is missing`, () => {
      const breakpoint = { invalidAttribute: 'invalid' };
      const componentTree = experience.fields.componentTree[locale];
      const updatedExperience = {
        ...experience,
        fields: {
          ...experience.fields,
          componentTree: { [locale]: { ...componentTree, breakpoints: [breakpoint] } },
        },
      };
      const result = validateExperienceFields(updatedExperience, schemaVersion) as SafeParseError<
        typeof updatedExperience
      >;

      expect(result.success).toBe(false);
      const expectedErrors = ['id', 'query', 'previewSize', 'displayName'].map(
        (breakpointField) => ({
          code: 'invalid_type',
          expected: 'string',
          received: 'undefined',
          path: ['componentTree', 'en-US', 'breakpoints', 0, breakpointField],
          message: 'Required',
        })
      );

      expect(result.error.issues).toEqual(expectedErrors);
    });

    it(`fails if schemaVersion is missing`, () => {
      const componentTree = experience.fields.componentTree[locale];
      const updatedExperience = {
        ...experience,
        fields: {
          ...experience.fields,
          componentTree: { [locale]: { ...componentTree, schemaVersion: undefined } },
        },
      };
      const result = validateExperienceFields(updatedExperience, schemaVersion) as SafeParseError<
        typeof updatedExperience
      >;

      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toBe('Invalid literal value, expected "2023-09-28"');
    });

    it(`fails if children is not an array`, () => {
      const componentTree = experience.fields.componentTree[locale];
      const updatedExperience = {
        ...experience,
        fields: {
          ...experience.fields,
          componentTree: { [locale]: { ...componentTree, children: {} } },
        },
      };
      const result = validateExperienceFields(updatedExperience, schemaVersion) as SafeParseError<
        typeof updatedExperience
      >;

      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toBe('Expected array, received object');
    });
  });

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

    it('fails if value is malformed', () => {
      const updatedExperience = {
        ...experience,
        fields: {
          ...experience.fields,
          // key instead of value attribute
          unboundValues: { [locale]: { uuid1: { key: 1 } } },
        },
      };
      const result = validateExperienceFields(updatedExperience, schemaVersion) as SafeParseError<
        typeof updatedExperience
      >;

      const expectedError = {
        code: 'invalid_union',
        path: ['unboundValues', 'en-US', 'uuid1', 'value'],
        message: 'Invalid input',
      };
      expect(result.success).toBe(false);
      expect(result.error.issues[0]).toEqual(expect.objectContaining(expectedError));
    });
  });

  it('should validate the experience successfully', () => {
    const result = validateExperienceFields(experience, schemaVersion) as SafeParseSuccess<
      typeof experience
    >;

    expect(result.success).toBe(true);
    expect(result.data).not.toBeUndefined();
  });
});
