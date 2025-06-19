import { EntityStore } from '@contentful/experiences-core';
import { experienceEntry, entities } from '../../test/__fixtures__';
import {
  shouldUsePrebinding,
  resolvePrebindingPath,
  resolveMaybePrebindingDefaultValuePath,
} from './prebindingUtils';
import {
  ComponentPropertyValue,
  ExperienceComponentSettings,
  PatternProperty,
} from '@contentful/experiences-validators';
import { ExperienceEntry } from '@contentful/experiences-core/types';

const entityStore = new EntityStore({
  experienceEntry,
  entities,
  locale: 'en-US',
});

describe('shouldUsePrebinding', () => {
  it('should return true when all conditions are met', () => {
    const componentValueKey = 'testKey';
    const componentSettings = {
      parameterDefinitions: {
        testParameterDefinitionId: {},
      },
      variableMappings: {
        testKey: {
          parameterDefinitionId: 'testParameterDefinitionId',
        },
      },
    } as unknown as ExperienceComponentSettings;
    const parameters = {
      testParameterDefinitionId: {},
    } as unknown as Record<string, PatternProperty>;
    const variable = {
      type: 'NoValue',
    } as unknown as ComponentPropertyValue;

    const result = shouldUsePrebinding({
      componentValueKey,
      componentSettings,
      parameters: parameters,
      variable,
    });

    expect(result).toBe(true);
  });

  it('should return false when patternPropertyDefinition is missing', () => {
    const componentValueKey = 'testKey';
    const componentSettings = {
      parameterDefinitions: {},
      variableMappings: {
        testKey: {
          parameterDefinitionId: 'testParameterDefinitionId',
        },
      },
    } as unknown as ExperienceComponentSettings;
    const parameters: Record<string, PatternProperty> = {
      testParameterDefinitionId: {},
    } as unknown as Record<string, PatternProperty>;
    const variable = {
      type: 'NoValue',
    } as unknown as ComponentPropertyValue;

    const result = shouldUsePrebinding({
      componentValueKey,
      componentSettings,
      parameters,
      variable,
    });

    expect(result).toBe(false);
  });

  it('should return false when patternProperty is missing', () => {
    const componentValueKey = 'testKey';
    const componentSettings: ExperienceComponentSettings = {
      parameterDefinitions: {
        testParameterDefinitionId: {},
      },
      variableMappings: {
        testKey: {
          parameterDefinitionId: 'testParameterDefinitionId',
        },
      },
    } as unknown as ExperienceComponentSettings;
    const parameters: Record<string, PatternProperty> = {};
    const variable = {
      type: 'NoValue',
    } as unknown as ComponentPropertyValue;

    const result = shouldUsePrebinding({
      componentValueKey,
      componentSettings,
      parameters,
      variable,
    });

    expect(result).toBe(false);
  });

  it('should return false when variableMapping is missing', () => {
    const componentValueKey = 'testKey';
    const componentSettings = {
      parameterDefinitions: {
        testParameterDefinitionId: {},
      },
      variableMappings: {},
    } as unknown as ExperienceComponentSettings;
    const parameters: Record<string, PatternProperty> = {
      testParameterDefinitionId: {
        path: '/entries/testEntry',
        type: 'BoundValue',
      },
    };
    const variable = {
      type: 'NoValue',
    } as unknown as ComponentPropertyValue;

    const result = shouldUsePrebinding({
      componentValueKey,
      componentSettings,
      parameters: parameters,
      variable,
    });

    expect(result).toBe(false);
  });
});

describe('resolvePrebindingPath', () => {
  const dataSourceKey = 'uuid2';

  it('should return the correct path when all conditions are met', () => {
    const componentValueKey = 'testKey';
    const componentSettings = {
      parameterDefinitions: {},
      variableDefinitions: {},
      variableMappings: {
        testKey: {
          type: 'ContentTypeMapping',
          parameterDefinitionId: 'testParameterDefinitionId',
          pathsByContentType: {
            testContentType: { path: '/fields/testField' },
          },
        },
      },
    } as unknown as ExperienceComponentSettings;
    const parameters: Record<string, PatternProperty> = {
      testParameterDefinitionId: {
        path: `/${dataSourceKey}`,
        type: 'BoundValue',
      },
    };

    const result = resolvePrebindingPath({
      componentValueKey,
      componentSettings,
      parameters: parameters,
      entityStore,
    });

    expect(result).toBe(`/${dataSourceKey}/fields/testField`);
  });

  it('should return an empty string when variableMapping is missing', () => {
    const componentValueKey = 'testKey';
    const componentSettings: ExperienceComponentSettings = {
      variableMappings: {},
    } as unknown as ExperienceComponentSettings;
    const parameters: Record<string, PatternProperty> = {};

    const result = resolvePrebindingPath({
      componentValueKey,
      componentSettings,
      parameters: parameters,
      entityStore,
    });

    expect(result).toBe('');
  });

  it('should return an empty string when parameters is missing', () => {
    const componentValueKey = 'testKey';
    const componentSettings: ExperienceComponentSettings = {
      variableMappings: {
        testKey: {
          parameterDefinitionId: 'testParameterDefinitionId',
        },
      },
    } as unknown as ExperienceComponentSettings;
    const parameters: Record<string, PatternProperty> = {};

    const result = resolvePrebindingPath({
      componentValueKey,
      componentSettings,
      parameters: parameters,
      entityStore,
    });

    expect(result).toBe('');
  });

  it('should return an empty string when entityOrAsset is not an Entry', () => {
    const componentValueKey = 'testKey';
    const componentSettings: ExperienceComponentSettings = {
      variableMappings: {
        testKey: {
          parameterDefinitionId: 'testParameterDefinitionId',
        },
      },
    } as unknown as ExperienceComponentSettings;
    const parameters: Record<string, PatternProperty> = {
      testParameterDefinitionId: { path: `/${dataSourceKey}` },
    } as unknown as Record<string, PatternProperty>;

    const result = resolvePrebindingPath({
      componentValueKey,
      componentSettings,
      parameters: parameters,
      entityStore,
    });

    expect(result).toBe('');
  });

  it('should return an empty string when fieldPath is missing', () => {
    const componentValueKey = 'testKey';
    const componentSettings: ExperienceComponentSettings = {
      variableMappings: {
        testKey: {
          parameterDefinitionId: 'testParameterDefinitionId',
          pathsByContentType: {},
        },
      },
    } as unknown as ExperienceComponentSettings;
    const parameters: Record<string, PatternProperty> = {
      testParameterDefinitionId: { path: `/${dataSourceKey}` },
    } as unknown as Record<string, PatternProperty>;

    const result = resolvePrebindingPath({
      componentValueKey,
      componentSettings,
      parameters: parameters,
      entityStore,
    });

    expect(result).toBe('');
  });
  it('should return an empty string when the entity is not found', () => {
    // Simulate a missing entity by using a non-existent dataSourceKey
    const dataSourceKey = 'nonExistentDataSourceKey';
    const componentValueKey = 'testKey';
    const componentSettings: ExperienceComponentSettings = {
      variableMappings: {
        testKey: {
          parameterDefinitionId: 'testParameterDefinitionId',
          pathsByContentType: {
            testContentType: { path: '/fields/testField' },
          },
        },
      },
    } as unknown as ExperienceComponentSettings;
    const parameters: Record<string, PatternProperty> = {
      testParameterDefinitionId: { path: `/${dataSourceKey}` },
    } as unknown as Record<string, PatternProperty>;

    const result = resolvePrebindingPath({
      componentValueKey,
      componentSettings,
      parameters: parameters,
      entityStore,
    });

    expect(result).toBe('');
  });
});

describe('resolveMaybePrebindingDefaultValuePath', () => {
  const dataSourceKey = 'uuid2';

  const createEntityStoreWithComponentSettings = (
    componentSettingsOverrides: Partial<ExperienceComponentSettings>,
  ) => {
    return new EntityStore({
      experienceEntry: {
        ...experienceEntry,
        fields: {
          ...experienceEntry.fields,
          componentSettings: {
            ...experienceEntry.fields.componentSettings,
            parameterDefinitions: {
              testParameterDefinitionId: {
                defaultValue: {
                  testContentType: {
                    sys: { id: dataSourceKey, type: 'Link', linkType: 'Entry' },
                  },
                },
                contentTypes: {
                  testContentType: {},
                },
              },
            },
            variableMappings: {
              testKey: {
                type: 'ContentTypeMapping',
                parameterDefinitionId: 'testParameterDefinitionId',
                pathsByContentType: {
                  testContentType: { path: '/fields/testField' },
                },
              },
            },
            ...componentSettingsOverrides,
          },
        },
      } as unknown as ExperienceEntry,
      entities,
      locale: 'en-US',
    });
  };

  it('should return the correct path when defaultValue is set and all conditions are met', () => {
    const result = resolveMaybePrebindingDefaultValuePath({
      componentValueKey: 'testKey',
      entityStore: createEntityStoreWithComponentSettings({}),
    });

    expect(result).toBe(`/${dataSourceKey}/fields/testField`);
  });

  it('should return undefined when variableMapping is missing', () => {
    const modifiedEntityStore = createEntityStoreWithComponentSettings({
      variableMappings: {},
    });

    const result = resolveMaybePrebindingDefaultValuePath({
      componentValueKey: 'testKey',
      entityStore: modifiedEntityStore,
    });

    expect(result).toBeUndefined();
  });

  it('should return undefined when patternPropertyDefinition is missing', () => {
    const modifiedEntityStore = createEntityStoreWithComponentSettings({
      parameterDefinitions: {},
    });

    const result = resolveMaybePrebindingDefaultValuePath({
      componentValueKey: 'testKey',
      entityStore: modifiedEntityStore,
    });

    expect(result).toBeUndefined();
  });

  it('should return undefined when defaultValue is missing', () => {
    const modifiedEntityStore = createEntityStoreWithComponentSettings({
      parameterDefinitions: {
        testParameterDefinitionId: {
          contentTypes: {
            testContentType: {},
          },
        },
      },
    } as unknown as ExperienceComponentSettings);

    const result = resolveMaybePrebindingDefaultValuePath({
      componentValueKey: 'testKey',
      entityStore: modifiedEntityStore,
    });

    expect(result).toBeUndefined();
  });
});
