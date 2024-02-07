import { validateExperienceFields } from '../../src/validators';
import { experience, experiencePattern } from '../fixtures/v2023_09_28';
import { describe, it, expect } from 'vitest';
import { SafeParseError, SafeParseSuccess, ZodInvalidUnionIssue } from 'zod';

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
        expect(result.error.issues[0].message).toBe('Invalid literal value, expected "2023-09-28"');
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

      (
        [
          ['definitionId', 'string'],
          ['variables', 'object'],
          ['children', 'array'],
        ] as const
      ).map(([attribute, type]) =>
        it(`fails if '${attribute}' is missing`, () => {
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
          const result = validateExperienceFields(
            updatedExperience,
            schemaVersion
          ) as SafeParseError<typeof updatedExperience>;

          const expectedError = {
            code: 'invalid_type',
            expected: type,
            received: 'undefined',
            path: ['componentTree', 'en-US', 'children', 0, attribute],
            message: 'Required',
          };
          expect(result.success).toBe(false);
          expect(result.error.issues[0]).toEqual(expectedError);
        })
      );
      describe('variables values', () => {
        describe('DesignValue', () => {
          it(`fails if 'valuesByBreakpoint' is not present`, () => {
            const componentTree = experience.fields.componentTree[locale];
            // child includes all attributes except the one we want to test
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
              schemaVersion
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
            expect(
              (result.error.issues[0] as ZodInvalidUnionIssue).unionErrors[0].issues[0]
            ).toEqual(expectedError);
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
              schemaVersion
            ) as SafeParseError<typeof updatedExperience>;

            const expectedError = {
              code: 'invalid_type',
              expected: 'string',
              received: 'undefined',
              path: ['componentTree', 'en-US', 'children', 0, 'variables', 'text', 'path'],
              message: 'Required',
            };
            expect(result.success).toBe(false);
            expect(
              (result.error.issues[0] as ZodInvalidUnionIssue).unionErrors[1].issues[0]
            ).toEqual(expectedError);
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
              schemaVersion
            ) as SafeParseError<typeof updatedExperience>;

            const expectedError = {
              code: 'invalid_type',
              expected: 'string',
              received: 'undefined',
              path: ['componentTree', 'en-US', 'children', 0, 'variables', 'text', 'key'],
              message: 'Required',
            };
            expect(result.success).toBe(false);
            expect(
              (result.error.issues[0] as ZodInvalidUnionIssue).unionErrors[2].issues[0]
            ).toEqual(expectedError);
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
              schemaVersion
            ) as SafeParseError<typeof updatedExperience>;

            const expectedError = {
              code: 'invalid_type',
              expected: 'string',
              received: 'undefined',
              path: ['componentTree', 'en-US', 'children', 0, 'variables', 'text', 'key'],
              message: 'Required',
            };
            expect(result.success).toBe(false);
            expect(
              (result.error.issues[0] as ZodInvalidUnionIssue).unionErrors[3].issues[0]
            ).toEqual(expectedError);
          });
        });
      });
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

    it('fails if `value` attribute is not present', () => {
      const updatedExperience = {
        ...experience,
        fields: {
          ...experience.fields,
          // key instead of value attribute
          unboundValues: { [locale]: { uuid1: { key: 'test' } } },
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
        code: 'invalid_union',
        path: ['dataSource', 'en-US', 'uuid1'],
        message: 'Invalid input',
      };
      expect(result.success).toBe(false);
      expect(result.error.issues[0]).toEqual(expect.objectContaining(expectedError));

      const unionError = {
        code: 'invalid_type',
        expected: 'object',
        received: 'string',
        path: ['dataSource', 'en-US', 'uuid1'],
        message: 'Expected object, received string',
      };
      expect((result.error.issues[0] as ZodInvalidUnionIssue).unionErrors[0].issues[0]).toEqual(
        unionError
      );
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
        path: ['dataSource', 'en-US', 'uuid1'],
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
  });

  it('should validate the experience successfully', () => {
    const result = validateExperienceFields(experience, schemaVersion) as SafeParseSuccess<
      typeof experience
    >;

    expect(result.success).toBe(true);
    expect(result.data).not.toBeUndefined();
  });

  it('should validate the pattern successfully', () => {
    const result = validateExperienceFields(experiencePattern, schemaVersion) as SafeParseSuccess<
      typeof experiencePattern
    >;

    expect(result.success).toBe(true);
    expect(result.data).not.toBeUndefined();
  });
});
