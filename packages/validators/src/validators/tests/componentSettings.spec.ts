import { validateExperienceFields } from '@/validators';
import { experience, experiencePattern } from '@/test/__fixtures__/v2023_09_28';
import { describe, it, expect } from 'vitest';
import {
  MAX_ALLOWED_PATHS,
  ParameterDefinition,
  ParameterDefinitions,
  PrebindingDefinition,
  THUMBNAIL_IDS,
  VariableMappings,
} from '@/schemas/v2023_09_28/pattern';

const schemaVersion = '2023-09-28' as const;
const locale = 'en-US';
const NATIVE_PARAMETER_ID = 'nativeParameterId';
const NONE_NATIVE_PARAMETER_ID = 'noneNativeParameterId';

const setupPrebindingPattern = (overrides: Partial<PrebindingDefinition>) => {
  const variableMappings: VariableMappings = overrides.variableMappings || {
    variableId1: {
      parameterId: NATIVE_PARAMETER_ID,
      type: 'ContentTypeMapping',
      pathsByContentType: {
        ct1: {
          path: 'some/path/ct1',
        },
      },
    },
  };
  const allowedVariableOverrides: string[] = overrides.allowedVariableOverrides || ['variableId2'];
  const parameterDefinitions: ParameterDefinitions = overrides.parameterDefinitions || {
    NATIVE_PARAMETER_ID: {
      defaultSource: {
        type: 'Entry',
        contentTypeId: 'ct1',
        link: {
          sys: {
            type: 'Link',
            id: 'entryId1',
            linkType: 'Entry',
          },
        },
      },
      contentTypes: ['ct1'],
    },
  };

  return {
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
            variableId2: {
              type: 'Text',
              default: 'default value',
            },
            variableId3: {
              group: 'style',
              type: 'Text',
              default: 'default value',
            },
          },
          prebindingDefinitions: [
            {
              id: 'prebindingId1',
              parameterDefinitions,
              variableMappings,
              allowedVariableOverrides,
            },
          ],
        },
      },
    },
  };
};

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
    THUMBNAIL_IDS.forEach((thumbnailId) => {
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

  describe('prebindingDefinitions', () => {
    it('allows prebindingDefinitions to be empty optional', () => {
      const pattern = {
        ...experiencePattern,
        fields: {
          ...experiencePattern.fields,
          componentSettings: {
            [locale]: {
              variableDefinitions: {},
              prebindingDefinitions: undefined,
            },
          },
        },
      };
      const result = validateExperienceFields(pattern, schemaVersion);
      expect(result.success).toBe(true);
      expect(result.errors).toBeUndefined();
    });

    it('requires prebindingDefinitions field to not be empty array', () => {
      const pattern = {
        ...experiencePattern,
        fields: {
          ...experiencePattern.fields,
          componentSettings: {
            [locale]: {
              variableDefinitions: {},
              prebindingDefinitions: [],
            },
          },
        },
      };
      const result = validateExperienceFields(pattern, schemaVersion);
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.[0].details).toBe('Array must contain exactly 1 element(s)');
    });

    it('errors if prebindingDefinitions is not an array', () => {
      const pattern = {
        ...experiencePattern,
        fields: {
          ...experiencePattern.fields,
          componentSettings: {
            [locale]: {
              variableDefinitions: {},
              prebindingDefinitions: { id: '1', parameterDefinitions: {} },
            },
          },
        },
      };
      const result = validateExperienceFields(pattern, schemaVersion);
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.[0].details).toBe(
        'The type of "prebindingDefinitions" is incorrect, expected type: array',
      );
    });

    it('errors if prebindingDefinitions is not an array of length 1', () => {
      const pattern = {
        ...experiencePattern,
        fields: {
          ...experiencePattern.fields,
          componentSettings: {
            [locale]: {
              variableDefinitions: {},
              prebindingDefinitions: [
                { id: '1', parameterDefinitions: {} },
                { id: '2', parameterDefinitions: {} },
              ],
            },
          },
        },
      };
      const result = validateExperienceFields(pattern, schemaVersion);
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.[0].details).toBe('Array must contain exactly 1 element(s)');
    });

    it('errors if more than MAX_MAPPING_PATHS are used', () => {
      const contentTypes = Array.from({ length: MAX_ALLOWED_PATHS + 1 }, (_, i) => `ct${i}`);
      const parameterDefinition: ParameterDefinition = {
        contentTypes: contentTypes,
      };
      const variableMappings: VariableMappings = {
        variableId1: {
          parameterId: 'someParameter',
          type: 'ContentTypeMapping',
          pathsByContentType: contentTypes.reduce((acc, ct) => {
            acc[ct] = {
              path: `some.path.${ct}`,
            };
            return acc;
          }, {}),
        },
      };
      const pattern = setupPrebindingPattern({
        variableMappings,
        parameterDefinitions: { someParameter: parameterDefinition },
      });

      const result = validateExperienceFields(pattern, schemaVersion);
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.[0].details).toBe(
        `Too many paths defined for variable mapping with id "variableId1", maximum allowed is ${MAX_ALLOWED_PATHS}`,
      );
    });

    it('errors if more than one native parameter definition exists', () => {
      const parameterDefinition1: ParameterDefinition = {
        contentTypes: ['ct1'],
      };

      const parameterDefinition2: ParameterDefinition = {
        contentTypes: ['ct2'],
      };

      const parameterDefinitions: ParameterDefinitions = {
        parameterId1: parameterDefinition1,
        parameterId2: parameterDefinition2,
      };

      const pattern = setupPrebindingPattern({ parameterDefinitions });

      const result = validateExperienceFields(pattern, schemaVersion);
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.[0].details).toBe(
        `Only one native parameter definition (parameter definition without passToNodes) is allowed per prebinding definition.`,
      );
    });

    it('does not error if no native parameter definitions exist', () => {
      const existingNodeId = experiencePattern.fields.componentTree[locale].children[0].id;
      const parameterDefinitions: ParameterDefinitions = {
        [NONE_NATIVE_PARAMETER_ID]: {
          contentTypes: ['ct1'],
          passToNodes: [
            { nodeId: existingNodeId, parameterId: 'parameterId2', prebindingId: 'prebindingId2' },
          ],
        },
      };
      const variableMappings = {};

      const pattern = setupPrebindingPattern({ parameterDefinitions, variableMappings });
      const result = validateExperienceFields(pattern, schemaVersion);
      console.log(result.errors);
      expect(result.success).toBe(true);
      expect(result.errors).toBeUndefined();
    });

    it('errors if more than 1 passToNodes element exists', () => {
      const parameterDefinitions: ParameterDefinitions = {
        [NONE_NATIVE_PARAMETER_ID]: {
          contentTypes: ['ct1'],
          passToNodes: [
            { nodeId: 'node1', parameterId: 'parameterId2', prebindingId: 'prebindingId2' },
            { nodeId: 'node2', parameterId: 'parameterId3', prebindingId: 'prebindingId3' },
          ],
        },
      };
      const variableMappings = {};

      const pattern = setupPrebindingPattern({ parameterDefinitions, variableMappings });
      const result = validateExperienceFields(pattern, schemaVersion);
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.[0].details).toBe(
        'At most one "passToNodes" element is allowed per parameter definition.',
      );
    });

    it('errors if duplicates keys between variableMappings and allowedVariableOverrides exist', () => {
      const variableMappings: VariableMappings = {
        variableId1: {
          parameterId: 'parameterId1',
          type: 'ContentTypeMapping',
          pathsByContentType: {
            ct1: {
              path: 'some/path/ct1',
            },
          },
        },
      };

      const allowedVariableOverrides = ['variableId1', 'variableId2'];

      const pattern = setupPrebindingPattern({ allowedVariableOverrides, variableMappings });

      const result = validateExperienceFields(pattern, schemaVersion);
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.[0].details).toBe(
        `Found both variable mapping and allowed override for the following keys: "variableId1".`,
      );
    });

    it('errors if variableMapping references a non-existing variable id', () => {
      const variableMappings: VariableMappings = {
        'non-existing-variable': {
          parameterId: 'parameterId1',
          type: 'ContentTypeMapping',
          pathsByContentType: {
            ct1: {
              path: 'some/path/ct1',
            },
          },
        },
      };

      const pattern = setupPrebindingPattern({ variableMappings });
      const result = validateExperienceFields(pattern, schemaVersion);
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.[0].details).toBe(
        `The following variable mappings or overrides are missing from the variable definitions: "non-existing-variable".`,
      );
    });

    it('errors if allowedVariableOverrides references a non-existing variable id', () => {
      const allowedVariableOverrides = ['non-existing-variable'];

      const pattern = setupPrebindingPattern({ allowedVariableOverrides });

      const result = validateExperienceFields(pattern, schemaVersion);
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.[0].details).toBe(
        `The following variable mappings or overrides are missing from the variable definitions: "non-existing-variable".`,
      );
    });

    it('does not take into account variable definitions for design variables', () => {
      const allowedVariableOverrides = ['variableId3'];

      const pattern = setupPrebindingPattern({ allowedVariableOverrides });

      const result = validateExperienceFields(pattern, schemaVersion);
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.[0].details).toBe(
        `The following variable mappings or overrides are missing from the variable definitions: "variableId3".`,
      );
    });

    it('errors if variableMapping references a non-existing parameterId', () => {
      const variableMappings: VariableMappings = {
        variableId1: {
          parameterId: 'non-existing-param',
          type: 'ContentTypeMapping',
          pathsByContentType: {
            ct1: {
              path: 'some/path/ct1',
            },
          },
        },
      };
      const pattern = setupPrebindingPattern({ variableMappings });

      const result = validateExperienceFields(pattern, schemaVersion);
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.[0].details).toBe(
        `The variable mapping with id "variableId1" references a non-existing parameterId "non-existing-param".`,
      );
    });
  });
});
