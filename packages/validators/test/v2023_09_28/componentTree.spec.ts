import { validateExperienceFields } from '../../src/validators';
import { experience } from '../__fixtures__/v2023_09_28';
import { describe, it, expect } from 'vitest';
import { SafeParseError, ZodInvalidUnionIssue } from 'zod';

const schemaVersion = '2023-09-28' as const;
const locale = 'en-US';

describe('componentTree', () => {
  describe('breakpoints', () => {
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
      expect(result.error.issues[0].message).toBe(
        'The first breakpoint should include the following attributes: { "id": "desktop", "query": "*" }',
      );
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
        }),
      );

      expect(result.error.issues).toEqual(expectedErrors);
    });

    it(`fails if desktop breakpoint is not first in the list`, () => {
      const breakpoints = [
        { id: 'tablet', query: '<1024px', previewSize: 'medium', displayName: 'Tablet' },
        { id: 'mobile', query: '<768px', previewSize: 'small', displayName: 'Mobile' },
        { id: 'desktop', query: '*', previewSize: 'large', displayName: 'Desktop' },
      ];
      const componentTree = experience.fields.componentTree[locale];
      const updatedExperience = {
        ...experience,
        fields: {
          ...experience.fields,
          componentTree: { [locale]: { ...componentTree, breakpoints } },
        },
      };
      const result = validateExperienceFields(updatedExperience, schemaVersion) as SafeParseError<
        typeof updatedExperience
      >;

      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toBe(
        'The first breakpoint should include the following attributes: { "id": "desktop", "query": "*" }',
      );
    });

    it(`fails if breakpoints are not ordered from largest to smallest`, () => {
      const breakpoints = [
        { id: 'desktop', query: '*', previewSize: 'large', displayName: 'Desktop' },
        { id: 'mobile', query: '<768px', previewSize: 'small', displayName: 'Mobile' },
        { id: 'tablet', query: '<1024px', previewSize: 'medium', displayName: 'Tablet' },
      ];
      const componentTree = experience.fields.componentTree[locale];
      const updatedExperience = {
        ...experience,
        fields: {
          ...experience.fields,
          componentTree: { [locale]: { ...componentTree, breakpoints } },
        },
      };
      const result = validateExperienceFields(updatedExperience, schemaVersion) as SafeParseError<
        typeof updatedExperience
      >;

      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toBe(
        'Breakpoints should be ordered from largest to smallest pixel value',
      );
    });
  });

  describe('schemaVersion', () => {
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
      expect(result.error.issues[0].message).toBe('Invalid input');
    });
  });

  describe('children', () => {
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

    it.each([
      ['definitionId', 'string'],
      ['variables', 'object'],
      ['children', 'array'],
    ] as const)(`fails if %s is missing`, (attribute, type) => {
      const componentTree = experience.fields.componentTree[locale];
      // child includes all attributes except the one we want to test
      const { [attribute]: _, ...child } = {
        definitionId: 'test',
        variables: {},
        children: [],
      };

      const updatedExperience = {
        ...experience,
        fields: {
          ...experience.fields,
          componentTree: { [locale]: { ...componentTree, children: [child] } },
        },
      };
      const result = validateExperienceFields(updatedExperience, schemaVersion) as SafeParseError<
        typeof updatedExperience
      >;

      const expectedError = {
        code: 'invalid_type',
        expected: type,
        received: 'undefined',
        path: ['componentTree', 'en-US', 'children', 0, attribute],
        message: 'Required',
      };
      expect(result.success).toBe(false);
      expect(result.error.issues[0]).toEqual(expectedError);
    });

    describe('variables name', () => {
      it(`fails if name contains invalid characters`, () => {
        const componentTree = experience.fields.componentTree[locale];
        const child = {
          definitionId: 'test',
          variables: {
            ['text&^:']: { type: 'DesignValue', value: 'test' },
          },
          children: [],
        };
        const updatedExperience = {
          ...experience,
          fields: {
            ...experience.fields,
            componentTree: { [locale]: { ...componentTree, children: [child] } },
          },
        };

        const result = validateExperienceFields(updatedExperience, schemaVersion) as SafeParseError<
          typeof updatedExperience
        >;

        const expectedError = {
          code: 'invalid_string',
          path: ['componentTree', 'en-US', 'children', 0, 'variables', 'text&^:'],
          message: 'Invalid',
          validation: 'regex',
        };
        expect(result.success).toBe(false);
        expect(result.error.issues[0] as ZodInvalidUnionIssue).toEqual(expectedError);
      });
      it(`fails if name exceeds the allowed character limit`, () => {
        const componentTree = experience.fields.componentTree[locale];
        const child = {
          definitionId: 'test',
          variables: {
            ['text'.repeat(20)]: { type: 'DesignValue', value: 'test' },
          },
          children: [],
        };
        const updatedExperience = {
          ...experience,
          fields: {
            ...experience.fields,
            componentTree: { [locale]: { ...componentTree, children: [child] } },
          },
        };

        const result = validateExperienceFields(updatedExperience, schemaVersion) as SafeParseError<
          typeof updatedExperience
        >;

        const expectedError = {
          code: 'invalid_string',
          path: ['componentTree', 'en-US', 'children', 0, 'variables', 'text'.repeat(20)],
          message: 'Invalid',
          validation: 'regex',
        };
        expect(result.success).toBe(false);
        expect(result.error.issues[0] as ZodInvalidUnionIssue).toEqual(expectedError);
      });
    });

    describe('variables values', () => {
      describe('DesignValue', () => {
        it(`fails if 'valuesByBreakpoint' is not present`, () => {
          const componentTree = experience.fields.componentTree[locale];
          const child = {
            definitionId: 'test',
            variables: {
              text: { type: 'DesignValue' },
            },
            children: [],
          };

          const updatedExperience = {
            ...experience,
            fields: {
              ...experience.fields,
              componentTree: { [locale]: { ...componentTree, children: [child] } },
            },
          };

          const result = validateExperienceFields(
            updatedExperience,
            schemaVersion,
          ) as SafeParseError<typeof updatedExperience>;

          const expectedError = {
            code: 'invalid_type',
            expected: 'object',
            received: 'undefined',
            path: [
              'componentTree',
              'en-US',
              'children',
              0,
              'variables',
              'text',
              'valuesByBreakpoint',
            ],
            message: 'Required',
          };
          expect(result.success).toBe(false);
          expect((result.error.issues[0] as ZodInvalidUnionIssue).unionErrors[0].issues[0]).toEqual(
            expectedError,
          );
        });
      });
      describe('BoundValue', () => {
        it(`fails if 'path' is not present`, () => {
          const componentTree = experience.fields.componentTree[locale];
          // child includes all attributes except the one we want to test
          const child = {
            definitionId: 'test',
            variables: {
              text: { type: 'BoundValue' },
            },
            children: [],
          };

          const updatedExperience = {
            ...experience,
            fields: {
              ...experience.fields,
              componentTree: { [locale]: { ...componentTree, children: [child] } },
            },
          };

          const result = validateExperienceFields(
            updatedExperience,
            schemaVersion,
          ) as SafeParseError<typeof updatedExperience>;

          const expectedError = {
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: ['componentTree', 'en-US', 'children', 0, 'variables', 'text', 'path'],
            message: 'Required',
          };
          expect(result.success).toBe(false);
          expect((result.error.issues[0] as ZodInvalidUnionIssue).unionErrors[1].issues[0]).toEqual(
            expectedError,
          );
        });
      });
      describe('UnboundValue', () => {
        it(`fails if 'key' is not present`, () => {
          const componentTree = experience.fields.componentTree[locale];
          // child includes all attributes except the one we want to test
          const child = {
            definitionId: 'test',
            variables: {
              text: { type: 'UnboundValue' },
            },
            children: [],
          };

          const updatedExperience = {
            ...experience,
            fields: {
              ...experience.fields,
              componentTree: { [locale]: { ...componentTree, children: [child] } },
            },
          };

          const result = validateExperienceFields(
            updatedExperience,
            schemaVersion,
          ) as SafeParseError<typeof updatedExperience>;

          const expectedError = {
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: ['componentTree', 'en-US', 'children', 0, 'variables', 'text', 'key'],
            message: 'Required',
          };
          expect(result.success).toBe(false);
          expect((result.error.issues[0] as ZodInvalidUnionIssue).unionErrors[2].issues[0]).toEqual(
            expectedError,
          );
        });
      });
      describe('ComponentValue', () => {
        it(`fails if 'key' is not present`, () => {
          const componentTree = experience.fields.componentTree[locale];
          // child includes all attributes except the one we want to test
          const child = {
            definitionId: 'test',
            variables: {
              text: { type: 'ComponentValue' },
            },
            children: [],
          };

          const updatedExperience = {
            ...experience,
            fields: {
              ...experience.fields,
              componentTree: { [locale]: { ...componentTree, children: [child] } },
            },
          };

          const result = validateExperienceFields(
            updatedExperience,
            schemaVersion,
          ) as SafeParseError<typeof updatedExperience>;

          const expectedError = {
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: ['componentTree', 'en-US', 'children', 0, 'variables', 'text', 'key'],
            message: 'Required',
          };
          expect(result.success).toBe(false);
          expect((result.error.issues[0] as ZodInvalidUnionIssue).unionErrors[3].issues[0]).toEqual(
            expectedError,
          );
        });
      });
    });
  });
});
