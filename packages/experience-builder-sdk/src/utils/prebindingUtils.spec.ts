import { EntityStore } from '@contentful/experiences-core';
import { experienceEntry, entities, createEntry } from '../../test/__fixtures__';
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
      patternPropertyDefinitions: {
        testPatternPropertyDefinitionId: {},
      },
      variableMappings: {
        testKey: {
          patternPropertyDefinitionId: 'testPatternPropertyDefinitionId',
        },
      },
    } as unknown as ExperienceComponentSettings;
    const patternProperties = {
      testPatternPropertyDefinitionId: {},
    } as unknown as Record<string, PatternProperty>;
    const variable = {
      type: 'NoValue',
    } as unknown as ComponentPropertyValue;

    const result = shouldUsePrebinding({
      componentValueKey,
      componentSettings,
      patternProperties,
      variable,
    });

    expect(result).toBe(true);
  });

  it('should return false when patternPropertyDefinition is missing', () => {
    const componentValueKey = 'testKey';
    const componentSettings = {
      patternPropertyDefinitions: {},
      variableMappings: {
        testKey: {
          patternPropertyDefinitionId: 'testPatternPropertyDefinitionId',
        },
      },
    } as unknown as ExperienceComponentSettings;
    const patternProperties: Record<string, PatternProperty> = {
      testPatternPropertyDefinitionId: {},
    } as unknown as Record<string, PatternProperty>;
    const variable = {
      type: 'NoValue',
    } as unknown as ComponentPropertyValue;

    const result = shouldUsePrebinding({
      componentValueKey,
      componentSettings,
      patternProperties,
      variable,
    });

    expect(result).toBe(false);
  });

  it('should return false when patternProperty is missing', () => {
    const componentValueKey = 'testKey';
    const componentSettings: ExperienceComponentSettings = {
      patternPropertyDefinitions: {
        testPatternPropertyDefinitionId: {},
      },
      variableMappings: {
        testKey: {
          patternPropertyDefinitionId: 'testPatternPropertyDefinitionId',
        },
      },
    } as unknown as ExperienceComponentSettings;
    const patternProperties: Record<string, PatternProperty> = {};
    const variable = {
      type: 'NoValue',
    } as unknown as ComponentPropertyValue;

    const result = shouldUsePrebinding({
      componentValueKey,
      componentSettings,
      patternProperties,
      variable,
    });

    expect(result).toBe(false);
  });

  it('should return false when variableMapping is missing', () => {
    const componentValueKey = 'testKey';
    const componentSettings = {
      patternPropertyDefinitions: {
        testPatternPropertyDefinitionId: {},
      },
      variableMappings: {},
    } as unknown as ExperienceComponentSettings;
    const patternProperties: Record<string, PatternProperty> = {
      testPatternPropertyDefinitionId: {
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
      patternProperties,
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
      patternPropertyDefinitions: {},
      variableDefinitions: {},
      variableMappings: {
        testKey: {
          type: 'ContentTypeMapping',
          patternPropertyDefinitionId: 'testPatternPropertyDefinitionId',
          pathsByContentType: {
            testContentType: { path: '/fields/testField' },
          },
        },
      },
    } as unknown as ExperienceComponentSettings;
    const patternProperties: Record<string, PatternProperty> = {
      testPatternPropertyDefinitionId: {
        path: `/${dataSourceKey}`,
        type: 'BoundValue',
      },
    };

    const result = resolvePrebindingPath({
      componentValueKey,
      componentSettings,
      patternProperties,
      entityStore,
    });

    expect(result).toBe(`/${dataSourceKey}/fields/testField`);
  });

  it('should return an empty string when variableMapping is missing', () => {
    const componentValueKey = 'testKey';
    const componentSettings: ExperienceComponentSettings = {
      variableMappings: {},
    } as unknown as ExperienceComponentSettings;
    const patternProperties: Record<string, PatternProperty> = {};

    const result = resolvePrebindingPath({
      componentValueKey,
      componentSettings,
      patternProperties,
      entityStore,
    });

    expect(result).toBe('');
  });

  it('should return an empty string when patternProperties is missing', () => {
    const componentValueKey = 'testKey';
    const componentSettings: ExperienceComponentSettings = {
      variableMappings: {
        testKey: {
          patternPropertyDefinitionId: 'testPatternPropertyDefinitionId',
        },
      },
    } as unknown as ExperienceComponentSettings;
    const patternProperties: Record<string, PatternProperty> = {};

    const result = resolvePrebindingPath({
      componentValueKey,
      componentSettings,
      patternProperties,
      entityStore,
    });

    expect(result).toBe('');
  });

  it('should return an empty string when entityOrAsset is not an Entry', () => {
    const componentValueKey = 'testKey';
    const componentSettings: ExperienceComponentSettings = {
      variableMappings: {
        testKey: {
          patternPropertyDefinitionId: 'testPatternPropertyDefinitionId',
        },
      },
    } as unknown as ExperienceComponentSettings;
    const patternProperties: Record<string, PatternProperty> = {
      testPatternPropertyDefinitionId: { path: `/${dataSourceKey}` },
    } as unknown as Record<string, PatternProperty>;

    const result = resolvePrebindingPath({
      componentValueKey,
      componentSettings,
      patternProperties,
      entityStore,
    });

    expect(result).toBe('');
  });

  it('should return an empty string when fieldPath is missing', () => {
    const componentValueKey = 'testKey';
    const componentSettings: ExperienceComponentSettings = {
      variableMappings: {
        testKey: {
          patternPropertyDefinitionId: 'testPatternPropertyDefinitionId',
          pathsByContentType: {},
        },
      },
    } as unknown as ExperienceComponentSettings;
    const patternProperties: Record<string, PatternProperty> = {
      testPatternPropertyDefinitionId: { path: `/${dataSourceKey}` },
    } as unknown as Record<string, PatternProperty>;

    const result = resolvePrebindingPath({
      componentValueKey,
      componentSettings,
      patternProperties,
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
          patternPropertyDefinitionId: 'testPatternPropertyDefinitionId',
          pathsByContentType: {
            testContentType: { path: '/fields/testField' },
          },
        },
      },
    } as unknown as ExperienceComponentSettings;
    const patternProperties: Record<string, PatternProperty> = {
      testPatternPropertyDefinitionId: { path: `/${dataSourceKey}` },
    } as unknown as Record<string, PatternProperty>;

    const result = resolvePrebindingPath({
      componentValueKey,
      componentSettings,
      patternProperties,
      entityStore,
    });

    expect(result).toBe('');
  });
});

describe('resolveMaybePrebindingDefaultValuePath', () => {
  // const dataSourceKey = 'uuid2';
  const defaultEntryId = 'defaultEntry123';
  const sideloadedDefaultEntryDataSourceKey = 'sideloaded_defaultEntry123';

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
            patternPropertyDefinitions: {
              testPatternPropertyDefinitionId: {
                defaultValue: {
                  testContentType: {
                    sys: { id: defaultEntryId, type: 'Link', linkType: 'Entry' },
                  },
                },
                contentTypes: {
                  testContentType: {
                    sys: {
                      type: 'Link',
                      id: 'testContentType',
                      linkType: 'ContentType',
                    },
                  },
                },
              },
            },
            variableMappings: {
              testKey: {
                type: 'ContentTypeMapping',
                patternPropertyDefinitionId: 'testPatternPropertyDefinitionId',
                pathsByContentType: {
                  testContentType: { path: '/fields/testField' },
                },
              },
            },
            ...componentSettingsOverrides,
          },
          dataSource: {
            ...experienceEntry.fields.dataSource,
            // we need to simulate that the default entry is sideloaded
            [sideloadedDefaultEntryDataSourceKey]: {
              sys: {
                id: defaultEntryId,
                type: 'Link',
                linkType: 'Entry',
              },
            },
          },
        },
      } as unknown as ExperienceEntry,
      entities,
      locale: 'en-US',
    });
  };

  it('should return the correct path when defaultValue is set and all conditions are met', () => {
    const localEntityStore = createEntityStoreWithComponentSettings({});
    // Simulate sideloading of the default entry into the entity store
    localEntityStore.updateEntity(createEntry(defaultEntryId));

    const result = resolveMaybePrebindingDefaultValuePath({
      componentValueKey: 'testKey',
      entityStore: localEntityStore,
    });

    expect(result).toBe(`/${sideloadedDefaultEntryDataSourceKey}/fields/testField`);
  });

  it('should return undefined when default value entry was not sideloaded into EntityStore', () => {
    const localEntityStore = createEntityStoreWithComponentSettings({});

    // Notice, we do NOT sideload the default entry here
    // localEntityStore.updateEntity(createEntry(defaultEntryId));

    const result = resolveMaybePrebindingDefaultValuePath({
      componentValueKey: 'testKey',
      entityStore: localEntityStore,
    });

    expect(result).toBeUndefined();
  });

  it('should return undefined when variableMapping does not have info for contentType used with default value', () => {
    const localEntityStore = createEntityStoreWithComponentSettings({
      patternPropertyDefinitions: {
        testPatternPropertyDefinitionId: {
          defaultValue: {
            testContentType: {
              sys: { id: defaultEntryId, type: 'Link', linkType: 'Entry' },
            },
          },
          contentTypes: {
            testContentType: {
              sys: {
                type: 'Link',
                id: 'testContentType',
                linkType: 'ContentType',
              },
            },
          },
        },
      },
      variableMappings: {
        testKey: {
          type: 'ContentTypeMapping',
          patternPropertyDefinitionId: 'testPatternPropertyDefinitionId',
          pathsByContentType: {
            MANGLE_SO_THAT_IT_DOES_NOT_MATCH_testContentType: { path: '/fields/testField' },
          },
        },
      },
    });

    // Notice, we do NOT sideload the default entry here
    // localEntityStore.updateEntity(createEntry(defaultEntryId));

    const result = resolveMaybePrebindingDefaultValuePath({
      componentValueKey: 'testKey',
      entityStore: localEntityStore,
    });

    expect(result).toBeUndefined();
  });

  it('should return undefined when field path is not set', () => {
    const localEntityStore = createEntityStoreWithComponentSettings({
      patternPropertyDefinitions: {
        testPatternPropertyDefinitionId: {
          defaultValue: {
            testContentType: {
              sys: { id: defaultEntryId, type: 'Link', linkType: 'Entry' },
            },
          },
          contentTypes: {
            testContentType: {
              sys: {
                type: 'Link',
                id: 'testContentType',
                linkType: 'ContentType',
              },
            },
          },
        },
      },
      variableMappings: {
        testKey: {
          type: 'ContentTypeMapping',
          patternPropertyDefinitionId: 'testPatternPropertyDefinitionId',
          pathsByContentType: {
            // @ts-expect-error simulating missing field path
            testContentType: { path: undefined }, // or empty string ''
          },
        },
      },
    });

    // Need to sideload entry, otherwise we wont get to final logic of resolveMaybePrebindingDefaultValuePath()
    localEntityStore.updateEntity(createEntry(defaultEntryId));

    const result = resolveMaybePrebindingDefaultValuePath({
      componentValueKey: 'testKey',
      entityStore: localEntityStore,
    });

    expect(result).toBeUndefined();
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
      patternPropertyDefinitions: {},
    });

    const result = resolveMaybePrebindingDefaultValuePath({
      componentValueKey: 'testKey',
      entityStore: modifiedEntityStore,
    });

    expect(result).toBeUndefined();
  });

  it('should return undefined when defaultValue is missing', () => {
    const modifiedEntityStore = createEntityStoreWithComponentSettings({
      patternPropertyDefinitions: {
        testPatternPropertyDefinitionId: {
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
