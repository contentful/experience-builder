import { validateExperienceFields } from '..';
import { experience } from '../../test/__fixtures__/v2023_09_28';
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
        'The first breakpoint should include the following attributes: { "query": "*" }',
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
          details: 'The first breakpoint should include the following attributes: { "query": "*" }',
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
        'When using a desktop-first strategy, all breakpoints must have strictly decreasing pixel values',
      );
    });

    it(`fails if breakpoints are not ordered from smallest to largest`, () => {
      const breakpoints = [
        { id: 'mobile', query: '*', previewSize: 'small', displayName: 'Mobile' },
        { id: 'desktop', query: '>1024px', previewSize: 'large', displayName: 'Desktop' },
        { id: 'tablet', query: '>768px', previewSize: 'medium', displayName: 'Tablet' },
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
        'When using a mobile-first strategy, all breakpoints must have strictly increasing pixel values',
      );
    });

    it(`fails if there are duplicate breakpoint ids`, () => {
      const breakpoints = [
        { id: 'desktop', query: '*', previewSize: 'large', displayName: 'Desktop' },
        { id: 'tablet', query: '<1024px', previewSize: 'medium', displayName: 'Tablet' },
        { id: 'mobile', query: '<768px', previewSize: 'small', displayName: 'Mobile' },
        { id: 'mobile', query: '<350px', previewSize: 'small', displayName: 'Mobile' },
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
      expect(error?.details).toBe('Breakpoint IDs must be unique');
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

    it.each(['someuuid', undefined])('succeeds if id is %s', (id) => {
      const componentTree = experience.fields.componentTree[locale];
      const child = {
        id,
        definitionId: 'test',
        displayName: 'display-name',
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
      expect(result.success).toBe(true);
      expect(result.errors).toBeUndefined();
    });

    it.each(['Test', undefined])('succeeds if displayName is %s', (displayName) => {
      const componentTree = experience.fields.componentTree[locale];
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
      expect(result.success).toBe(true);
      expect(result.errors).toBeUndefined();
    });

    it.each(['string-value', undefined])('succeeds if slotId is %s', (slotId) => {
      const componentTree = experience.fields.componentTree[locale];
      const child = {
        definitionId: 'test',
        slotId,
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
      expect(result.success).toBe(true);
      expect(result.errors).toBeUndefined();
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
    describe('pre-binding attributes', () => {
      it(`succeeds if both prebindingId and parameters are present`, () => {
        const componentTree = experience.fields.componentTree[locale];
        const child = {
          id: 'nodeId',
          definitionId: 'test',
          variables: {},
          children: [],
          prebindingId: 'prebindingId',
          parameters: {
            param1: { type: 'BoundValue', path: '/paramKey' },
          },
        };
        const updatedExperience = {
          ...experience,
          fields: {
            ...experience.fields,
            componentTree: { [locale]: { ...componentTree, children: [child] } },
          },
        };
        const result = validateExperienceFields(updatedExperience, schemaVersion);

        expect(result.success).toBe(true);
        expect(result.errors).toBeUndefined();
      });
      it(`succeeds if parameters is an empty object`, () => {
        const componentTree = experience.fields.componentTree[locale];
        const child = {
          id: 'nodeId',
          definitionId: 'test',
          variables: {},
          children: [],
          prebindingId: 'prebindingId',
          parameters: {},
        };
        const updatedExperience = {
          ...experience,
          fields: {
            ...experience.fields,
            componentTree: { [locale]: { ...componentTree, children: [child] } },
          },
        };
        const result = validateExperienceFields(updatedExperience, schemaVersion);

        expect(result.success).toBe(true);
        expect(result.errors).toBeUndefined();
      });
      it(`fails if prebindingId is present but parameters is missing`, () => {
        const componentTree = experience.fields.componentTree[locale];
        const child = {
          id: 'nodeId',
          definitionId: 'test',
          variables: {},
          children: [],
          prebindingId: 'prebindingId',
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
          details: 'Found "prebindingId" but no "parameters" for node with id: "nodeId"',
          name: 'custom',
          path: ['componentTree', 'en-US', 'children', '0'],
        };
        expect(result.success).toBe(false);
        expect(result.errors).toEqual([expectedError]);
      });
      it(`fails if prebindingId is present but parameters is missing`, () => {
        const componentTree = experience.fields.componentTree[locale];
        const child = {
          id: 'nodeId',
          definitionId: 'test',
          variables: {},
          children: [],
          parameters: {
            param1: { type: 'BoundValue', path: '/paramKey' },
          },
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
          details: 'Found "parameters" but no "prebindingId" for node with id: "nodeId"',
          name: 'custom',
          path: ['componentTree', 'en-US', 'children', '0'],
        };
        expect(result.success).toBe(false);
        expect(result.errors).toEqual([expectedError]);
      });
    });
  });
});
