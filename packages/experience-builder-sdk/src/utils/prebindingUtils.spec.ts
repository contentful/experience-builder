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
  Parameter,
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
      prebindingDefinitions: [
        {
          id: 'prebindingDefinition1',
          parameterDefinitions: {
            testParameterId: {},
          },
          variableMappings: {
            testKey: {
              parameterId: 'testParameterId',
            },
          },
        },
      ],
    } as unknown as ExperienceComponentSettings;
    const parameters = {
      testParameterId: {},
    } as unknown as Record<string, Parameter>;
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

  it('should return false when parameterDefinition is missing', () => {
    const componentValueKey = 'testKey';
    const componentSettings = {
      parameterDefinitions: {},
      variableMappings: {
        testKey: {
          parameterId: 'testParameterId',
        },
      },
    } as unknown as ExperienceComponentSettings;
    const parameters: Record<string, Parameter> = {
      testParameterId: {},
    } as unknown as Record<string, Parameter>;
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

  it('should return false when parameter is missing', () => {
    const componentValueKey = 'testKey';
    const componentSettings: ExperienceComponentSettings = {
      parameterDefinitions: {
        testParameterId: {},
      },
      variableMappings: {
        testKey: {
          parameterId: 'testParameterId',
        },
      },
    } as unknown as ExperienceComponentSettings;
    const parameters: Record<string, Parameter> = {};
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
        testParameterId: {},
      },
      variableMappings: {},
    } as unknown as ExperienceComponentSettings;
    const parameters: Record<string, Parameter> = {
      testParameterId: {
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
      variableDefinitions: {},
      prebindingDefinitions: [
        {
          id: 'prebindingDefinition1',
          parameterDefinitions: {},
          variableMappings: {
            testKey: {
              type: 'ContentTypeMapping',
              parameterId: 'testParameterId',
              pathsByContentType: {
                testContentType: { path: '/fields/testField' },
              },
            },
          },
        },
      ],
    } as unknown as ExperienceComponentSettings;
    const parameters: Record<string, Parameter> = {
      testParameterId: {
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
    const parameters: Record<string, Parameter> = {};

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
          parameterId: 'testParameterId',
        },
      },
    } as unknown as ExperienceComponentSettings;
    const parameters: Record<string, Parameter> = {};

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
          parameterId: 'testParameterId',
        },
      },
    } as unknown as ExperienceComponentSettings;
    const parameters: Record<string, Parameter> = {
      testParameterId: { path: `/${dataSourceKey}` },
    } as unknown as Record<string, Parameter>;

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
          parameterId: 'testParameterId',
          pathsByContentType: {},
        },
      },
    } as unknown as ExperienceComponentSettings;
    const parameters: Record<string, Parameter> = {
      testParameterId: { path: `/${dataSourceKey}` },
    } as unknown as Record<string, Parameter>;

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
          parameterId: 'testParameterId',
          pathsByContentType: {
            testContentType: { path: '/fields/testField' },
          },
        },
      },
    } as unknown as ExperienceComponentSettings;
    const parameters: Record<string, Parameter> = {
      testParameterId: { path: `/${dataSourceKey}` },
    } as unknown as Record<string, Parameter>;

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
            prebindingDefinitions: [
              {
                id: 'prebindingDefinition1',
                parameterDefinitions: {
                  testParameterId: {
                    defaultSource: {
                      contentTypeId: 'testContentType',
                      type: 'Entry',
                      link: {
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
                    parameterId: 'testParameterId',
                    pathsByContentType: {
                      testContentType: { path: '/fields/testField' },
                    },
                  },
                },
              },
            ],
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
      prebindingDefinitions: [
        {
          id: 'prebindingId',
          parameterDefinitions: {},
          variableMappings: {},
        },
      ],
    });

    const result = resolveMaybePrebindingDefaultValuePath({
      componentValueKey: 'testKey',
      entityStore: modifiedEntityStore,
    });

    expect(result).toBeUndefined();
  });

  it('should return undefined when parameterDefinition is missing', () => {
    const modifiedEntityStore = createEntityStoreWithComponentSettings({
      prebindingDefinitions: [
        {
          id: 'prebindingId',
          parameterDefinitions: {},
          variableMappings: {},
        },
      ],
    });

    const result = resolveMaybePrebindingDefaultValuePath({
      componentValueKey: 'testKey',
      entityStore: modifiedEntityStore,
    });

    expect(result).toBeUndefined();
  });

  it('should return undefined when defaultValue is missing', () => {
    const modifiedEntityStore = createEntityStoreWithComponentSettings({
      prebindingDefinitions: [
        {
          id: 'prebindingDefinition1',
          parameterDefinitions: {
            testParameterId: {
              contentTypes: {
                testContentType: {},
              },
            },
          },
        },
      ],
    } as unknown as ExperienceComponentSettings);

    const result = resolveMaybePrebindingDefaultValuePath({
      componentValueKey: 'testKey',
      entityStore: modifiedEntityStore,
    });

    expect(result).toBeUndefined();
  });
});
