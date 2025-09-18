import { EntityStore } from '@contentful/experiences-core';
import {
  experienceEntry,
  entities,
  createEntry,
  createAssemblyEntry,
} from '../../test/__fixtures__';
import {
  shouldUsePrebinding,
  resolvePrebindingPath,
  resolveMaybePrebindingDefaultValuePath,
} from './prebindingUtils';
import { ExperienceComponentSettings, Parameter } from '@contentful/experiences-validators';
import { ExperienceEntry } from '@contentful/experiences-core/types';
import { PrebindingManager } from '../core/preview/PrebindingManager';

const entityStore = new EntityStore({
  experienceEntry,
  entities,
  locale: 'en-US',
});

describe('shouldUsePrebinding', () => {
  afterEach(() => {
    PrebindingManager.reset();
  });

  it('should return true when all conditions are met', () => {
    const componentValueKey = 'testKey';
    const componentSettings: ExperienceComponentSettings = {
      prebindingDefinitions: [
        {
          id: 'prebindingDefinition1',
          parameterDefinitions: {
            testParameterId: {
              contentTypes: ['ct111'],
            },
          },
          variableMappings: {
            testKey: {
              type: 'ContentTypeMapping',
              pathsByContentType: {
                ct111: {
                  path: '...',
                },
              },
              parameterId: 'testParameterId',
            },
          },
          allowedVariableOverrides: ['variableOnlyForDirectBinding'],
        },
      ],
      // no need to define each variable definition here as usually they're needed for
      // plugging the default values, which we don't do under this test
      variableDefinitions: {},
    };
    const parameters: Record<string, Parameter> = {
      testParameterId: {
        type: 'BoundValue',
        path: '/dsKey123',
      },
    };
    const result = shouldUsePrebinding({
      componentValueKey,
      componentSettings,
      parameters: parameters,
      patternRootNodeIdsChain: [],
    });

    expect(result).toBe(true);
  });

  it('should return true when parent pattern has overwrite for the nested pattern hoisted parameter', () => {
    const componentValueKey = 'testKey';
    const componentSettings: ExperienceComponentSettings = {
      prebindingDefinitions: [
        {
          id: 'prebindingDefinition1',
          parameterDefinitions: {
            hoistedParameterId1: {
              contentTypes: ['ct111'],
              passToNodes: [
                {
                  nodeId: 'nested-pattern-node-id-1',
                  parameterId: 'nested-pattern-native-parameter-id',
                  prebindingId: 'nested-pattern-prebinding-id',
                },
              ],
            },
            hoistedParameterId2: {
              contentTypes: ['ct111'],
              passToNodes: [
                {
                  nodeId: 'nested-pattern-node-id-2',
                  parameterId: 'nested-pattern-native-parameter-id',
                  prebindingId: 'nested-pattern-prebinding-id',
                },
              ],
            },
          },
          allowedVariableOverrides: ['variableOnlyForDirectBinding'],
        },
      ],
      // no need to define each variable definition here as usually they're needed for
      // plugging the default values, which we don't do under this test
      variableDefinitions: {},
    };
    const nestedPatternPrebindingDefinitions: ExperienceComponentSettings['prebindingDefinitions'] =
      [
        {
          id: 'nested-pattern-prebinding-id',
          parameterDefinitions: {
            'nested-pattern-native-parameter-id': {
              contentTypes: ['ct111'],
            },
          },
          variableMappings: {
            [componentValueKey]: {
              parameterId: 'nested-pattern-native-parameter-id',
              type: 'ContentTypeMapping',
              pathsByContentType: {
                ct111: {
                  path: '/fields/title',
                },
              },
            },
          },
          allowedVariableOverrides: [],
        },
      ];

    PrebindingManager.linkOriginalNodeIds('parent-pattern-node-id', 'parent-pattern-node-id');
    PrebindingManager.storeParameterDefinitions(
      'parent-pattern-node-id',
      componentSettings.prebindingDefinitions![0].parameterDefinitions,
    );
    PrebindingManager.linkOriginalNodeIds(
      'parent-pattern-node-id---nested-pattern-node-id-1',
      'nested-pattern-node-id-1',
    );
    PrebindingManager.storeParameterDefinitions(
      'parent-pattern-node-id---nested-pattern-node-id-1',
      nestedPatternPrebindingDefinitions[0].parameterDefinitions,
    );

    PrebindingManager.linkOriginalNodeIds(
      'parent-pattern-node-id---nested-pattern-node-id-2',
      'nested-pattern-node-id-2',
    );
    PrebindingManager.storeParameterDefinitions(
      'parent-pattern-node-id---nested-pattern-node-id-2',
      nestedPatternPrebindingDefinitions[0].parameterDefinitions,
    );

    const parameters: Record<string, Parameter> = {
      hoistedParameterId1: {
        type: 'BoundValue',
        path: '/dsKey123',
      },
      hoistedParameterId2: {
        type: 'BoundValue',
        path: '/abcdefg222',
      },
    };
    const nestedPatternResult1 = shouldUsePrebinding({
      componentValueKey,
      componentSettings: {
        prebindingDefinitions: nestedPatternPrebindingDefinitions,
      } as unknown as ExperienceComponentSettings,
      parameters: parameters,
      patternRootNodeIdsChain: ['parent-pattern-node-id', 'nested-pattern-node-id-1'],
    });

    expect(nestedPatternResult1).toBe(true);

    const nestedPatternResult2 = shouldUsePrebinding({
      componentValueKey,
      componentSettings: {
        prebindingDefinitions: nestedPatternPrebindingDefinitions,
      } as unknown as ExperienceComponentSettings,
      parameters: parameters,
      patternRootNodeIdsChain: ['parent-pattern-node-id', 'nested-pattern-node-id-2'],
    });

    expect(nestedPatternResult2).toBe(true);

    const parentPatternResult = shouldUsePrebinding({
      componentValueKey,
      componentSettings,
      parameters,
      patternRootNodeIdsChain: ['parent-pattern-node-id'],
    });

    expect(parentPatternResult).toBe(false);
  });

  it('should return false when the parent pattern does not have overwrite for the nested pattern hoisted parameter', () => {
    const componentValueKey = 'testKey';
    const componentSettings: ExperienceComponentSettings = {
      prebindingDefinitions: [
        {
          id: 'prebindingDefinition1',
          parameterDefinitions: {
            hoistedParameterId: {
              contentTypes: ['ct111'],
              passToNodes: [
                {
                  nodeId: 'nested-pattern-node-id',
                  parameterId: 'nested-pattern-native-parameter-id',
                  prebindingId: 'nested-pattern-prebinding-id',
                },
              ],
            },
          },
          allowedVariableOverrides: ['variableOnlyForDirectBinding'],
        },
      ],
      // no need to define each variable definition here as usually they're needed for
      // plugging the default values, which we don't do under this test
      variableDefinitions: {},
    };
    const nestedPatternPrebindingDefinitions: ExperienceComponentSettings['prebindingDefinitions'] =
      [
        {
          id: 'nested-pattern-prebinding-id',
          parameterDefinitions: {
            'nested-pattern-native-parameter-id': {
              contentTypes: ['ct111'],
            },
          },
          variableMappings: {
            [componentValueKey]: {
              parameterId: 'nested-pattern-native-parameter-id',
              type: 'ContentTypeMapping',
              pathsByContentType: {
                ct111: {
                  path: '/fields/title',
                },
              },
            },
          },
          allowedVariableOverrides: [],
        },
      ];

    PrebindingManager.linkOriginalNodeIds('parent-pattern-node-id', 'parent-pattern-node-id');
    PrebindingManager.storeParameterDefinitions(
      'parent-pattern-node-id',
      componentSettings.prebindingDefinitions![0].parameterDefinitions,
    );
    PrebindingManager.linkOriginalNodeIds(
      'parent-pattern-node-id---nested-pattern-node-id',
      'nested-pattern-node-id',
    );
    PrebindingManager.storeParameterDefinitions(
      'parent-pattern-node-id---nested-pattern-node-id',
      nestedPatternPrebindingDefinitions[0].parameterDefinitions,
    );

    const nestedPatternResult = shouldUsePrebinding({
      componentValueKey,
      componentSettings: {
        prebindingDefinitions: nestedPatternPrebindingDefinitions,
      } as unknown as ExperienceComponentSettings,
      parameters: {
        nonExistingParameterId: {
          type: 'BoundValue',
          path: '/dsKey456',
        },
      },
      patternRootNodeIdsChain: ['parent-pattern-node-id', 'nested-pattern-node-id'],
    });

    expect(nestedPatternResult).toBe(false);

    const parentPatternResult = shouldUsePrebinding({
      componentValueKey,
      componentSettings,
      parameters: {
        nonExistingParameterId: {
          type: 'BoundValue',
          path: '/dsKey456',
        },
      },
      patternRootNodeIdsChain: ['parent-pattern-node-id'],
    });

    expect(parentPatternResult).toBe(false);
  });

  it('should return false when target variable is included within `allowedVariableOverrides`', () => {
    const componentValueKey = 'testKeyThatIsAlsoIncludedInAllowedVariableOverrides';
    const componentSettings: ExperienceComponentSettings = {
      prebindingDefinitions: [
        {
          id: 'prebindingDefinition1',
          parameterDefinitions: {
            testParameterId: {
              contentTypes: ['ct111'],
            },
          },
          variableMappings: {
            testKey: {
              type: 'ContentTypeMapping',
              pathsByContentType: {
                ct111: {
                  path: '...',
                },
              },
              parameterId: 'testParameterId',
            },
          },
          allowedVariableOverrides: ['testKeyThatIsAlsoIncludedInAllowedVariableOverrides'],
        },
      ],
      // no need to define each variable definition here as usually they're needed for
      // plugging the default values, which we don't do under this test
      variableDefinitions: {},
    };
    const parameters: Record<string, Parameter> = {
      testParameterId: {
        type: 'BoundValue',
        path: '/dsKey123',
      },
    };
    const result = shouldUsePrebinding({
      componentValueKey,
      componentSettings,
      parameters,
      patternRootNodeIdsChain: [],
    });

    expect(result).toBe(false);
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

    const result = shouldUsePrebinding({
      componentValueKey,
      componentSettings,
      parameters,
      patternRootNodeIdsChain: [],
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

    const result = shouldUsePrebinding({
      componentValueKey,
      componentSettings,
      parameters,
      patternRootNodeIdsChain: [],
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

    const result = shouldUsePrebinding({
      componentValueKey,
      componentSettings,
      parameters: parameters,
      patternRootNodeIdsChain: [],
    });

    expect(result).toBe(false);
  });
});

describe('resolvePrebindingPath', () => {
  afterEach(() => {
    PrebindingManager.reset();
  });

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
      patternRootNodeIdsChain: [],
    });

    expect(result).toBe(`/${dataSourceKey}/fields/testField`);
  });

  it('should return the correct path for the hoisted parameter of the nested pattern if conditions are met', () => {
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

    const parentPatternComponentSettings: ExperienceComponentSettings = {
      variableDefinitions: {},
      prebindingDefinitions: [
        {
          id: 'parent-pattern-prebinding-id',
          parameterDefinitions: {
            hoistedParameterId1: {
              contentTypes: ['testContentType'],
              passToNodes: [
                {
                  nodeId: 'nested-pattern-node-id-1',
                  parameterId: 'testParameterId',
                  prebindingId: 'prebindingDefinition1',
                },
              ],
            },
            hoistedParameterId2: {
              contentTypes: ['testContentType'],
              passToNodes: [
                {
                  nodeId: 'nested-pattern-node-id-2',
                  parameterId: 'testParameterId',
                  prebindingId: 'prebindingDefinition1',
                },
              ],
            },
          },
        },
      ],
    };

    PrebindingManager.linkOriginalNodeIds('parent-pattern-node-id', 'parent-pattern-node-id');
    PrebindingManager.storeParameterDefinitions(
      'parent-pattern-node-id',
      parentPatternComponentSettings.prebindingDefinitions![0].parameterDefinitions,
    );

    PrebindingManager.linkOriginalNodeIds(
      'parent-pattern-node-id---nested-pattern-node-id-1',
      'nested-pattern-node-id-1',
    );
    PrebindingManager.storeParameterDefinitions(
      'parent-pattern-node-id---nested-pattern-node-id-1',
      componentSettings.prebindingDefinitions![0].parameterDefinitions,
    );

    PrebindingManager.linkOriginalNodeIds(
      'parent-pattern-node-id---nested-pattern-node-id-2',
      'nested-pattern-node-id-2',
    );
    PrebindingManager.storeParameterDefinitions(
      'parent-pattern-node-id---nested-pattern-node-id-2',
      componentSettings.prebindingDefinitions![0].parameterDefinitions,
    );

    const parameters: Record<string, Parameter> = {
      hoistedParameterId1: {
        path: `/${dataSourceKey}`,
        type: 'BoundValue',
      },
      hoistedParameterId2: {
        path: `/${dataSourceKey}`,
        type: 'BoundValue',
      },
    };

    const result = resolvePrebindingPath({
      componentValueKey,
      componentSettings,
      parameters: parameters,
      entityStore,
      patternRootNodeIdsChain: ['parent-pattern-node-id', 'nested-pattern-node-id-1'],
    });
    expect(result).toBe(`/${dataSourceKey}/fields/testField`);

    const result2 = resolvePrebindingPath({
      componentValueKey,
      componentSettings,
      parameters: parameters,
      entityStore,
      patternRootNodeIdsChain: ['parent-pattern-node-id', 'nested-pattern-node-id-2'],
    });
    expect(result2).toBe(`/${dataSourceKey}/fields/testField`);
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
      patternRootNodeIdsChain: [],
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
      patternRootNodeIdsChain: [],
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
      patternRootNodeIdsChain: [],
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
      patternRootNodeIdsChain: [],
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
      patternRootNodeIdsChain: [],
    });

    expect(result).toBe('');
  });
});

describe('resolveMaybePrebindingDefaultValuePath', () => {
  afterEach(() => {
    PrebindingManager.reset();
  });

  const defaultEntryId = 'defaultEntry123';

  const createEntityStoreWithComponentSettings = ({
    componentSettingsOverrides,
    usedComponentsOverrides = [],
  }: {
    componentSettingsOverrides: Partial<ExperienceComponentSettings>;
    usedComponentsOverrides?: Array<ExperienceEntry>;
  }) => {
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
                        sys: { id: defaultEntryId, type: 'Link', linkType: 'Entry' },
                      },
                    },
                    contentTypes: ['testContentType'],
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
          dataSource: {
            ...experienceEntry.fields.dataSource,
            // we need to simulate that the default entry is sideloaded
            [defaultEntryId]: {
              sys: {
                id: defaultEntryId,
                type: 'Link',
                linkType: 'Entry',
              },
            },
          },
          usedComponents: usedComponentsOverrides,
        },
      } as unknown as ExperienceEntry,
      entities,
      locale: 'en-US',
    });
  };

  it('should return the correct path when defaultValue is set and all conditions are met', () => {
    const localEntityStore = createEntityStoreWithComponentSettings({
      componentSettingsOverrides: {},
    });
    // Simulate sideloading of the default entry into the entity store
    localEntityStore.updateEntity(createEntry(defaultEntryId));

    const result = resolveMaybePrebindingDefaultValuePath({
      componentValueKey: 'testKey',
      entityStore: localEntityStore,
      patternRootNodeIdsChain: [],
    });

    expect(result).toBe(`/${defaultEntryId}/fields/testField`);
  });

  it('should return the correct path for a hoisted nested pattern parameter when all conditions are met', () => {
    const nestedPatternPrebindingDefinitions: ExperienceComponentSettings['prebindingDefinitions'] =
      [
        {
          id: 'nested-pattern-prebinding-id',
          parameterDefinitions: {
            nestedPatternNativeParameterId: {
              contentTypes: ['testContentType'],
              defaultSource: {
                contentTypeId: 'testContentType',
                type: 'Entry',
                link: {
                  sys: { id: defaultEntryId, type: 'Link', linkType: 'Entry' },
                },
              },
            },
          },
          variableMappings: {
            testKey: {
              type: 'ContentTypeMapping',
              parameterId: 'nestedPatternNativeParameterId',
              pathsByContentType: {
                testContentType: { path: '/fields/testField' },
              },
            },
          },
        },
      ];

    const parentPatternPrebindingDefinitions: ExperienceComponentSettings['prebindingDefinitions'] =
      [
        {
          id: 'prebindingDefinition1',
          parameterDefinitions: {
            hoistedParameterId1: {
              defaultSource: {
                contentTypeId: 'testContentType',
                type: 'Entry',
                link: {
                  sys: { id: defaultEntryId, type: 'Link', linkType: 'Entry' },
                },
              },
              passToNodes: [
                {
                  nodeId: 'nested-pattern-node-id-1',
                  parameterId: 'nestedPatternNativeParameterId',
                  prebindingId: 'nested-pattern-prebinding-id',
                },
              ],
              contentTypes: ['testContentType'],
            },
            hoistedParameterId2: {
              defaultSource: {
                contentTypeId: 'testContentType',
                type: 'Entry',
                link: {
                  sys: { id: defaultEntryId, type: 'Link', linkType: 'Entry' },
                },
              },
              passToNodes: [
                {
                  nodeId: 'nested-pattern-node-id-2',
                  parameterId: 'nestedPatternNativeParameterId',
                  prebindingId: 'nested-pattern-prebinding-id',
                },
              ],
              contentTypes: ['testContentType'],
            },
          },
        },
      ];

    PrebindingManager.linkOriginalNodeIds('parent-pattern-node-id', 'parent-pattern-node-id');
    PrebindingManager.storeParameterDefinitions(
      'parent-pattern-node-id',
      parentPatternPrebindingDefinitions[0].parameterDefinitions,
    );

    PrebindingManager.linkOriginalNodeIds(
      'parent-pattern-node-id---nested-pattern-node-id-1',
      'nested-pattern-node-id-1',
    );
    PrebindingManager.storeParameterDefinitions(
      'parent-pattern-node-id---nested-pattern-node-id-1',
      nestedPatternPrebindingDefinitions[0].parameterDefinitions,
    );

    PrebindingManager.linkOriginalNodeIds(
      'parent-pattern-node-id---nested-pattern-node-id-2',
      'nested-pattern-node-id-2',
    );
    PrebindingManager.storeParameterDefinitions(
      'parent-pattern-node-id---nested-pattern-node-id-2',
      nestedPatternPrebindingDefinitions[0].parameterDefinitions,
    );

    const localEntityStore = createEntityStoreWithComponentSettings({
      componentSettingsOverrides: {
        prebindingDefinitions: parentPatternPrebindingDefinitions,
      },
      usedComponentsOverrides: [
        createAssemblyEntry({
          id: 'nested-pattern-entry-id',
          prebindingDefinitions: nestedPatternPrebindingDefinitions,
        }),
      ],
    });
    // Simulate sideloading of the default entry into the entity store
    localEntityStore.updateEntity(createEntry(defaultEntryId));

    const result = resolveMaybePrebindingDefaultValuePath({
      componentValueKey: 'testKey',
      entityStore: localEntityStore,
      patternRootNodeIdsChain: ['parent-pattern-node-id', 'nested-pattern-node-id-1'],
    });

    expect(result).toBe(`/${defaultEntryId}/fields/testField`);

    const result2 = resolveMaybePrebindingDefaultValuePath({
      componentValueKey: 'testKey',
      entityStore: localEntityStore,
      patternRootNodeIdsChain: ['parent-pattern-node-id', 'nested-pattern-node-id-2'],
    });

    expect(result2).toBe(`/${defaultEntryId}/fields/testField`);

    const result3 = resolveMaybePrebindingDefaultValuePath({
      componentValueKey: 'randomVariableKey',
      entityStore: localEntityStore,
      patternRootNodeIdsChain: ['parent-pattern-node-id', 'nested-pattern-node-id-1'],
    });

    expect(result3).toBe(undefined);
  });

  it('should return undefined when default value entry was not sideloaded into EntityStore', () => {
    const localEntityStore = createEntityStoreWithComponentSettings({
      componentSettingsOverrides: {},
    });

    // Notice, we do NOT sideload the default entry here
    // localEntityStore.updateEntity(createEntry(defaultEntryId));

    const result = resolveMaybePrebindingDefaultValuePath({
      componentValueKey: 'testKey',
      entityStore: localEntityStore,
      patternRootNodeIdsChain: [],
    });

    expect(result).toBeUndefined();
  });

  it('should return undefined when variableMapping does not have info for contentType used with default value', () => {
    const localEntityStore = createEntityStoreWithComponentSettings({
      componentSettingsOverrides: {
        prebindingDefinitions: [
          {
            id: 'testPrebindingDefinitionId',

            parameterDefinitions: {
              testPrebindingDefinitionId: {
                defaultSource: {
                  type: 'Entry',
                  contentTypeId: 'testContentType',
                  link: {
                    sys: { id: defaultEntryId, type: 'Link', linkType: 'Entry' },
                  },
                },
                contentTypes: ['testContentType'],
              },
            },
            variableMappings: {
              testKey: {
                type: 'ContentTypeMapping',
                parameterId: 'testPrebindingDefinitionId',
                pathsByContentType: {
                  MANGLE_SO_THAT_IT_DOES_NOT_MATCH_testContentType: { path: '/fields/testField' },
                },
              },
            },
          },
        ],
      },
    });

    // Notice, we do NOT sideload the default entry here
    // localEntityStore.updateEntity(createEntry(defaultEntryId));

    const result = resolveMaybePrebindingDefaultValuePath({
      componentValueKey: 'testKey',
      entityStore: localEntityStore,
      patternRootNodeIdsChain: [],
    });

    expect(result).toBeUndefined();
  });

  it('should return undefined when field path is not set', () => {
    const localEntityStore = createEntityStoreWithComponentSettings({
      componentSettingsOverrides: {
        prebindingDefinitions: [
          {
            id: 'testPrebindingDefinitionId',
            parameterDefinitions: {
              testPrebindingDefinitionId: {
                defaultSource: {
                  type: 'Entry',
                  contentTypeId: 'testContentType',
                  link: {
                    sys: { id: defaultEntryId, type: 'Link', linkType: 'Entry' },
                  },
                },
                contentTypes: ['testContentType'],
              },
            },
            variableMappings: {
              testKey: {
                type: 'ContentTypeMapping',
                patternPropertyDefinitionId: 'testPrebindingDefinitionId',
                pathsByContentType: {
                  // @ts-expect-error simulating missing field path
                  testContentType: { path: undefined }, // or empty string ''
                },
              },
            },
          },
        ],
      },
    });

    // Need to sideload entry, otherwise we wont get to final logic of resolveMaybePrebindingDefaultValuePath()
    localEntityStore.updateEntity(createEntry(defaultEntryId));

    const result = resolveMaybePrebindingDefaultValuePath({
      componentValueKey: 'testKey',
      entityStore: localEntityStore,
      patternRootNodeIdsChain: [],
    });

    expect(result).toBeUndefined();
  });

  it('should return undefined when variableMapping is missing', () => {
    const modifiedEntityStore = createEntityStoreWithComponentSettings({
      componentSettingsOverrides: {
        prebindingDefinitions: [
          {
            id: 'prebindingId',
            parameterDefinitions: {},
            variableMappings: {},
          },
        ],
      },
    });

    const result = resolveMaybePrebindingDefaultValuePath({
      componentValueKey: 'testKey',
      entityStore: modifiedEntityStore,
      patternRootNodeIdsChain: [],
    });

    expect(result).toBeUndefined();
  });

  it('should return undefined when parameterDefinition is missing', () => {
    const modifiedEntityStore = createEntityStoreWithComponentSettings({
      componentSettingsOverrides: {
        prebindingDefinitions: [
          {
            id: 'prebindingId',
            parameterDefinitions: {},
            variableMappings: {},
          },
        ],
      },
    });

    const result = resolveMaybePrebindingDefaultValuePath({
      componentValueKey: 'testKey',
      entityStore: modifiedEntityStore,
      patternRootNodeIdsChain: [],
    });

    expect(result).toBeUndefined();
  });

  it('should return undefined when defaultValue is missing', () => {
    const modifiedEntityStore = createEntityStoreWithComponentSettings({
      componentSettingsOverrides: {
        prebindingDefinitions: [
          {
            id: 'prebindingDefinition1',
            parameterDefinitions: {
              testParameterId: {
                contentTypes: ['testContentType'],
              },
            },
          },
        ],
      },
    });

    const result = resolveMaybePrebindingDefaultValuePath({
      componentValueKey: 'testKey',
      entityStore: modifiedEntityStore,
      patternRootNodeIdsChain: [],
    });

    expect(result).toBeUndefined();
  });
});
