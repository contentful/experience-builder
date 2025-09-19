import { experiencePattern } from '@/test/__fixtures__/v2023_09_28';
import { describe, it, expect } from 'vitest';
import { validatePatternFields } from '@/validators/validatePatternFields';
import { ParameterDefinitions } from '@/schemas/v2023_09_28/pattern';

const schemaVersion = '2023-09-28' as const;
const locale = 'en-US';

describe(`${schemaVersion} version`, () => {
  const requiredFields = ['componentTree', 'dataSource', 'unboundValues'] as const;

  it.each(requiredFields)('should return an error if "%s" field is missing', (field) => {
    const { [field]: _, ...rest } = experiencePattern.fields;
    const updatedPattern = { ...experiencePattern, fields: rest };
    const result = validatePatternFields(updatedPattern, schemaVersion);

    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
    const error = result.errors?.[0];

    expect(error?.name).toBe('required');
    expect(error?.details).toBe(`The property "${field}" is required here`);
  });

  it('should validate the pattern successfully', () => {
    const result = validatePatternFields(experiencePattern, schemaVersion);

    expect(result.success).toBe(true);
  });

  it('should read the schema version from the componentTree if no override is provided', () => {
    const result = validatePatternFields(experiencePattern);

    expect(result.success).toBe(true);
  });

  it('should return an error when contentTypes array is empty', () => {
    const clonedPattern = JSON.parse(JSON.stringify(experiencePattern));
    clonedPattern.fields.componentSettings['en-US'].prebindingDefinitions[0].parameterDefinitions[
      '8v3GB67qF5f'
    ].contentTypes = [];

    const result = validatePatternFields(clonedPattern, schemaVersion);

    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
    const error = result.errors?.[0];

    expect(error?.name).toBe('size');
    expect(error?.details).toBe('Array must contain at least 1 element(s)');
  });

  it('should return an error when passToNodes reference non-existing nodes', () => {
    const parameterDefinitions: ParameterDefinitions = {
      nonNativeParameterId: {
        contentTypes: ['ct1'],
        passToNodes: [
          {
            prebindingId: 'nestedPatternPrebindingId',
            nodeId: 'nonExistingNodeId',
            parameterId: 'nestedPatternParameterId',
          },
        ],
      },
    };
    const pattern = {
      ...experiencePattern,
      fields: {
        ...experiencePattern.fields,
        componentSettings: {
          [locale]: {
            variableDefinitions: {
              variableId1: {
                type: 'Text',
                default: 'default value',
              },
            },
            prebindingDefinitions: [{ id: 'prebindingId1', parameterDefinitions }],
          },
        },
      },
    };

    const result = validatePatternFields(pattern, schemaVersion);

    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
    const error = result.errors?.[0];

    expect(error?.name).toBe('custom');
    expect(error?.details).toBe(
      'The following node IDs referenced in passToNodes are not present in the component tree: "nonExistingNodeId".',
    );
  });
});
