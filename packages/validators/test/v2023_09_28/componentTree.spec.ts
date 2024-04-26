import { validateExperienceFields } from '../../src/validators';
import { experience } from '../__fixtures__/v2023_09_28';
import { describe, it, expect } from 'vitest';

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
      const result = validateExperienceFields(updatedExperience, schemaVersion);

      expect(result.success).toBe(false);
      const error = result.errors?.[0];

      expect(error?.name).toBe('required');
      expect(error?.details).toBe(`The property "breakpoints" is required here`);
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
      const result = validateExperienceFields(updatedExperience, schemaVersion);

      expect(result.success).toBe(false);
      const error = result.errors?.[0];

      expect(result.success).toBe(false);
      expect(error?.name).toBe('custom');
      expect(error?.details).toBe(
        'The first breakpoint should include the following attributes: { "id": "desktop", "query": "*" }',
      );
    });

    it(`fails if any breakpoint attribute is missing`, () => {
      const breakpoint = {};
      const componentTree = experience.fields.componentTree[locale];
      const updatedExperience = {
        ...experience,
        fields: {
          ...experience.fields,
          componentTree: { [locale]: { ...componentTree, breakpoints: [breakpoint] } },
        },
      };
      const result = validateExperienceFields(updatedExperience, schemaVersion);

      expect(result.success).toBe(false);
      const expectedErrors = ['id', 'query', 'previewSize', 'displayName'].map(
        (breakpointField) => ({
          name: 'required',
          value: 'undefined',
          path: ['componentTree', 'en-US', 'breakpoints', 0, breakpointField],
          details: `The property "${breakpointField}" is required here`,
        }),
      );

      expect(result.success).toBe(false);
      expect(result.errors).toEqual(expectedErrors);
    });

    it(`fails if any breakpoint includes unexpected attribute`, () => {
      const breakpoint = {
        id: 'desktop',
        query: '*',
        previewSize: 'large',
        displayName: 'Desktop',
        extraAttr: 'unrecognised',
      };
      const componentTree = experience.fields.componentTree[locale];
      const updatedExperience = {
        ...experience,
        fields: {
          ...experience.fields,
          componentTree: { [locale]: { ...componentTree, breakpoints: [breakpoint] } },
        },
      };
      const result = validateExperienceFields(updatedExperience, schemaVersion);

      expect(result.success).toBe(false);
      const expectedErrors = {
        name: 'unexpected',
        path: ['componentTree', 'en-US', 'breakpoints', 0],
        details: 'The property "extraAttr" is not expected',
      };

      expect(result.success).toBe(false);
      expect(result.errors).toEqual([expectedErrors]);
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
      const result = validateExperienceFields(updatedExperience, schemaVersion);

      const expectedErrors = [
        {
          details:
            'The first breakpoint should include the following attributes: { "id": "desktop", "query": "*" }',
          name: 'custom',
          path: ['componentTree', 'en-US', 'breakpoints'],
        },
        {
          details: 'Breakpoints should be ordered from largest to smallest pixel value',
          name: 'custom',
          path: ['componentTree', 'en-US', 'breakpoints'],
        },
      ];
      expect(result.success).toBe(false);
      expect(result.errors).toEqual(expectedErrors);
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
      const result = validateExperienceFields(updatedExperience, schemaVersion);

      expect(result.success).toBe(false);
      const error = result.errors?.[0];

      expect(result.success).toBe(false);
      expect(error?.name).toBe('custom');
      expect(error?.details).toBe(
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
      const result = validateExperienceFields(updatedExperience);

      expect(result.success).toBe(false);
      const error = result.errors?.[0];
      console.log(result.errors);

      expect(result.success).toBe(false);
      expect(error?.name).toBe('required');
      expect(error?.details).toBe('The property "schemaVersion" is required here');
    });
  });
  it(`fails if unrecognised attribute is provided`, () => {
    const componentTree = experience.fields.componentTree[locale];
    const updatedExperience = {
      ...experience,
      fields: {
        ...experience.fields,
        componentTree: { [locale]: { ...componentTree, extraAttr: 'unrecognised' } },
      },
    };
    const result = validateExperienceFields(updatedExperience, schemaVersion);

    expect(result.success).toBe(false);
    const error = result.errors?.[0];
    expect(result.success).toBe(false);
    expect(error?.name).toBe('unexpected');
    expect(error?.details).toBe('The property "extraAttr" is not expected');
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
      const result = validateExperienceFields(updatedExperience, schemaVersion);

      expect(result.success).toBe(false);
      const error = result.errors?.[0];
      expect(result.success).toBe(false);
      expect(error?.name).toBe('type');
      expect(error?.path).toEqual(['componentTree', 'en-US', 'children']);
      expect(error?.details).toBe('The type of "children" is incorrect, expected type: array');
    });

    it.each(['definitionId', 'variables', 'children'] as const)(
      `fails if %s is missing`,
      (attribute) => {
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
        const result = validateExperienceFields(updatedExperience, schemaVersion);

        const expectedError = {
          name: 'required',
          value: 'undefined',
          path: ['componentTree', 'en-US', 'children', 0, attribute],
          details: `The property "${attribute}" is required here`,
        };
        expect(result.success).toBe(false);
        expect(result.errors).toEqual([expectedError]);
      },
    );

    it.each([
      'Test', // displayName provided
      undefined, // displayName not provided
    ])('succeeds if displayName is %s', (displayName) => {
      const componentTree = experience.fields.componentTree[locale];
      // child includes all attributes, with displayName either provided or not
      const child = {
        definitionId: 'test',
        displayName,
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
      const result = validateExperienceFields(updatedExperience, schemaVersion);

      // Since displayName is optional, we expect the validation to succeed
      expect(result.success).toBe(true);
      // And we expect no errors
      expect(result.errors).toEqual(undefined);
    });

    describe('variables name', () => {
      it(`fails if name contains invalid characters`, () => {
        const componentTree = experience.fields.componentTree[locale];
        const child = {
          definitionId: 'test',
          variables: {
            ['text&^:']: { type: 'DesignValue', valuesByBreakpoint: { desktop: 'bold' } },
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

        const result = validateExperienceFields(updatedExperience, schemaVersion);

        const expectedError = {
          name: 'regex',
          path: ['componentTree', 'en-US', 'children', 0, 'variables', 'text&^:'],
          details: 'Does not match /^[a-zA-Z0-9-_]{1,54}$/',
        };
        expect(result.success).toBe(false);
        expect(result.errors).toEqual([expectedError]);
      });
      it(`fails if name exceeds the allowed 54 character limit`, () => {
        const componentTree = experience.fields.componentTree[locale];
        const child = {
          definitionId: 'test',
          variables: {
            ['text'.repeat(20)]: { type: 'UnboundValue', key: 'test' },
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

        const result = validateExperienceFields(updatedExperience, schemaVersion);

        const expectedError = {
          name: 'regex',
          path: ['componentTree', 'en-US', 'children', 0, 'variables', 'text'.repeat(20)],
          details: 'Does not match /^[a-zA-Z0-9-_]{1,54}$/',
        };
        expect(result.success).toBe(false);
        expect(result.errors).toEqual([expectedError]);
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

          const result = validateExperienceFields(updatedExperience, schemaVersion);

          const expectedError = {
            details: 'The property "valuesByBreakpoint" is required here',
            name: 'required',
            path: [
              'componentTree',
              'en-US',
              'children',
              0,
              'variables',
              'text',
              'valuesByBreakpoint',
            ],
            value: 'undefined',
          };
          expect(result.success).toBe(false);
          expect(result.errors).toEqual([expectedError]);
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

          const result = validateExperienceFields(updatedExperience, schemaVersion);

          const expectedError = {
            details: 'The property "path" is required here',
            name: 'required',
            path: ['componentTree', 'en-US', 'children', 0, 'variables', 'text', 'path'],
            value: 'undefined',
          };
          expect(result.success).toBe(false);
          expect(result.errors).toEqual([expectedError]);
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

          const result = validateExperienceFields(updatedExperience, schemaVersion);

          const expectedError = {
            details: 'The property "key" is required here',
            name: 'required',
            path: ['componentTree', 'en-US', 'children', 0, 'variables', 'text', 'key'],
            value: 'undefined',
          };
          expect(result.success).toBe(false);
          expect(result.errors).toEqual([expectedError]);
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

          const result = validateExperienceFields(updatedExperience, schemaVersion);

          const expectedError = {
            details: 'The property "key" is required here',
            name: 'required',
            path: ['componentTree', 'en-US', 'children', 0, 'variables', 'text', 'key'],
            value: 'undefined',
          };
          expect(result.success).toBe(false);
          expect(result.errors).toEqual([expectedError]);
        });
      });
    });
  });
});
