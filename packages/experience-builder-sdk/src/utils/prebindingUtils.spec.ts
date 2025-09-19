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
import {
  ExperienceComponentSettings,
  ExperienceDataSource,
  Parameter,
} from '@contentful/experiences-validators';
import { ExperienceEntry } from '@contentful/experiences-core/types';
import { PrebindingManager } from '../core/preview/PrebindingManager';
import { Asset, Entry } from 'contentful';
import { LATEST_SCHEMA_VERSION } from '@contentful/experiences-core/constants';

const createEntityStore = ({
  experienceEntry,
  entities,
}: {
  experienceEntry: ExperienceEntry;
  entities: Array<Entry | Asset>;
}) => {
  const entityStore = new EntityStore({
    experienceEntry,
    entities,
    locale: 'en-US',
  });

  return entityStore;
};

const createExperienceEntry = ({
  usedComponents = [],
  dataSource = {},
}: {
  usedComponents?: Array<ExperienceEntry>;
  dataSource?: ExperienceDataSource;
}) => {
  const experienceEntryClone = structuredClone(experienceEntry);

  experienceEntryClone.fields.usedComponents = usedComponents;
  experienceEntryClone.fields.dataSource = dataSource;

  return experienceEntryClone;
};

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
              passToNodes: [],
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

    // simulating the case of 2 instances of the same pattern
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
              passToNodes: [],
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
          parameterDefinitions: {
            testParameterId: {
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
    } as unknown as ExperienceComponentSettings;
    const parameters: Record<string, Parameter> = {
      testParameterId: {
        path: `/${dataSourceKey}`,
        type: 'BoundValue',
      },
    };

    // we need to saturate the entityStore with hoistedParameterDefinitions and hoistedVariableMappings
    // and this happens in the constructor, where the data is taken from the experienceEntry fields
    const experienceEntry = createExperienceEntry({
      usedComponents: [
        // so we inject the nested pattern here
        createAssemblyEntry({
          schemaVersion: LATEST_SCHEMA_VERSION,
          id: 'pattern-entry-id',
          prebindingDefinitions: componentSettings.prebindingDefinitions,
        }),
      ],
      dataSource: {
        [dataSourceKey]: {
          sys: {
            id: 'testEntryId',
            type: 'Link',
            linkType: 'Entry',
          },
        },
      },
    });

    // and then it gets handled correctly
    const entityStore = createEntityStore({
      experienceEntry: experienceEntry,
      entities: [
        createEntry('testEntryId', {
          sys: {
            contentType: {
              sys: {
                id: 'testContentType',
              },
            },
          },
        }),
      ],
    });

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
          parameterDefinitions: {
            testParameterId: {
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
        path: `/uuid1`,
        type: 'BoundValue',
      },
      hoistedParameterId2: {
        path: `/uuid2`,
        type: 'BoundValue',
      },
    };

    // to saturate the entityStore with hoistedParameterDefinitions and hoistedVariableMappings
    // we inject the nested pattern and hte parent pattern into the experienceEntry
    const nestedPatternEntry = createAssemblyEntry({
      schemaVersion: LATEST_SCHEMA_VERSION,
      id: 'nested-pattern-entry-id',
      prebindingDefinitions: componentSettings.prebindingDefinitions,
    });

    const experienceEntry = createExperienceEntry({
      usedComponents: [
        createAssemblyEntry({
          schemaVersion: LATEST_SCHEMA_VERSION,
          id: 'pattern-entry-id',
          prebindingDefinitions: parentPatternComponentSettings.prebindingDefinitions,
          nestedPatterns: [
            {
              entry: nestedPatternEntry,
              node: {
                id: 'nested-pattern-node-id-1',
                definitionId: 'nested-pattern-entry-id',
                children: [],
                parameters: {},
                variables: {},
              },
            },
          ],
        }),
      ],
      dataSource: {
        uuid1: {
          sys: { type: 'Link', linkType: 'Entry', id: 'defaultEntryId1' },
        },
        uuid2: {
          sys: { type: 'Link', linkType: 'Entry', id: 'defaultEntryId2' },
        },
      },
    });

    const entityStore = createEntityStore({
      experienceEntry,
      entities: [
        createEntry('defaultEntryId1', {
          sys: {
            contentType: {
              sys: {
                id: 'testContentType',
              },
            },
          },
        }),
        createEntry('defaultEntryId2', {
          sys: {
            contentType: {
              sys: {
                id: 'testContentType',
              },
            },
          },
        }),
      ],
    });

    // checking that it is able to correctly infer value for each instance of the same pattern
    const result = resolvePrebindingPath({
      componentValueKey,
      componentSettings,
      parameters: parameters,
      entityStore,
      patternRootNodeIdsChain: ['parent-pattern-node-id', 'nested-pattern-node-id-1'],
    });
    expect(result).toBe(`/uuid1/fields/testField`);

    const result2 = resolvePrebindingPath({
      componentValueKey,
      componentSettings,
      parameters: parameters,
      entityStore,
      patternRootNodeIdsChain: ['parent-pattern-node-id', 'nested-pattern-node-id-2'],
    });
    expect(result2).toBe(`/uuid2/fields/testField`);
  });

  it('should NOT return a path for the given entry even if the hoisted parameter blocks its content type', () => {
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
                // here we allow 2 content types
                notIgnoredContentType: { path: '/fields/testFieldFromAllowedContentType' },
                ignoredContentType: { path: '/fields/testFieldFromIgnoredContentType' },
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
              // but the hoisted parameter limits one
              contentTypes: ['notIgnoredContentType'],
              passToNodes: [
                {
                  nodeId: 'nested-pattern-node-id-1',
                  parameterId: 'testParameterId',
                  prebindingId: 'prebindingDefinition1',
                },
              ],
            },
            hoistedParameterId2: {
              // but the hoisted parameter limits one
              contentTypes: ['notIgnoredContentType'],
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
        path: `/uuid1`,
        type: 'BoundValue',
      },
      hoistedParameterId2: {
        path: `/uuid2`,
        type: 'BoundValue',
      },
    };

    const nestedPatternEntry = createAssemblyEntry({
      schemaVersion: LATEST_SCHEMA_VERSION,
      id: 'nested-pattern-entry-id',
      prebindingDefinitions: componentSettings.prebindingDefinitions,
    });

    const experienceEntry = createExperienceEntry({
      usedComponents: [
        createAssemblyEntry({
          schemaVersion: LATEST_SCHEMA_VERSION,
          id: 'pattern-entry-id',
          prebindingDefinitions: parentPatternComponentSettings.prebindingDefinitions,
          nestedPatterns: [
            {
              entry: nestedPatternEntry,
              node: {
                id: 'nested-pattern-node-id-1',
                definitionId: 'nested-pattern-entry-id',
                children: [],
                parameters: {},
                variables: {},
              },
            },
          ],
        }),
      ],
      dataSource: {
        uuid1: {
          sys: { type: 'Link', linkType: 'Entry', id: 'defaultEntryId1' },
        },
        uuid2: {
          sys: { type: 'Link', linkType: 'Entry', id: 'defaultEntryId2' },
        },
      },
    });

    const entityStore = createEntityStore({
      experienceEntry,
      // putting the entries with one allowed and one ignored content types into the entity store
      entities: [
        createEntry('defaultEntryId1', {
          sys: {
            contentType: {
              sys: {
                id: 'notIgnoredContentType',
              },
            },
          },
        }),
        createEntry('defaultEntryId2', {
          sys: {
            contentType: {
              sys: {
                id: 'ignoredContentType',
              },
            },
          },
        }),
      ],
    });

    // for allowed content type (entry by key uui1), we should get the path
    const result = resolvePrebindingPath({
      componentValueKey,
      componentSettings,
      parameters: parameters,
      entityStore,
      patternRootNodeIdsChain: ['parent-pattern-node-id', 'nested-pattern-node-id-1'],
    });
    expect(result).toBe(`/uuid1/fields/testFieldFromAllowedContentType`);

    // for disallowed content type (entry by key uui2), we should get nothing, because it's filtered out
    const result2 = resolvePrebindingPath({
      componentValueKey,
      componentSettings,
      parameters: parameters,
      entityStore,
      patternRootNodeIdsChain: ['parent-pattern-node-id', 'nested-pattern-node-id-2'],
    });
    expect(result2).toBe('');
  });

  it('should return an empty string when variableMapping is missing', () => {
    const componentValueKey = 'testKey';
    const componentSettings: ExperienceComponentSettings = {
      variableMappings: {},
    } as unknown as ExperienceComponentSettings;
    const parameters: Record<string, Parameter> = {};

    const entityStore = createEntityStore({
      experienceEntry: createExperienceEntry(experienceEntry.fields.dataSource),
      entities,
    });

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

    const entityStore = createEntityStore({
      experienceEntry: createExperienceEntry(experienceEntry.fields.dataSource),
      entities,
    });

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

    const entityStore = createEntityStore({
      experienceEntry: createExperienceEntry(experienceEntry.fields.dataSource),
      entities,
    });

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

    const entityStore = createEntityStore({
      experienceEntry: createExperienceEntry(experienceEntry.fields.dataSource),
      entities,
    });

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

    const entityStore = createEntityStore({
      experienceEntry: createExperienceEntry(experienceEntry.fields.dataSource),
      entities,
    });

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
    dataSourceOverrides = {},
    entitiesOverrides = entities,
  }: {
    componentSettingsOverrides: Partial<ExperienceComponentSettings>;
    usedComponentsOverrides?: Array<ExperienceEntry>;
    dataSourceOverrides?: ExperienceDataSource;
    entitiesOverrides?: Array<Entry | Asset>;
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
          dataSource: dataSourceOverrides || {
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
      entities: entitiesOverrides,
      locale: 'en-US',
    });
  };

  it('should return the correct path when defaultValue is set and all conditions are met', () => {
    const localEntityStore = createEntityStoreWithComponentSettings({
      componentSettingsOverrides: {},
      entitiesOverrides: [
        createEntry(defaultEntryId, {
          sys: {
            contentType: {
              sys: {
                id: 'testContentType',
              },
            },
          },
        }),
      ],
    });

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
      entitiesOverrides: [
        createEntry(defaultEntryId, {
          sys: {
            contentType: {
              sys: {
                id: 'testContentType',
              },
            },
          },
        }),
      ],
      usedComponentsOverrides: [
        createAssemblyEntry({
          id: 'nested-pattern-entry-id',
          prebindingDefinitions: nestedPatternPrebindingDefinitions,
        }),
      ],
    });

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

  it('should NOT return the prebinding path for a hoisted nested pattern parameter when a hoisted definition filters it out', () => {
    const entryIdOfAllowedContentType = 'entry-id-of-allowed-content-type';
    const entryIdOfLimitedContentType = 'entry-id-of-forbidden-content-type';

    const nestedPatternPrebindingDefinitions: ExperienceComponentSettings['prebindingDefinitions'] =
      [
        {
          id: 'nested-pattern-prebinding-id',
          parameterDefinitions: {
            nestedPatternNativeParameterId: {
              contentTypes: ['allowedContentType', 'limitedContentType'],
              defaultSource: {
                contentTypeId: 'allowedContentType',
                type: 'Entry',
                link: {
                  sys: { id: entryIdOfAllowedContentType, type: 'Link', linkType: 'Entry' },
                },
              },
            },
          },
          variableMappings: {
            testKey: {
              type: 'ContentTypeMapping',
              parameterId: 'nestedPatternNativeParameterId',
              pathsByContentType: {
                allowedContentType: { path: '/fields/testFieldFromAllowedContentType' },
                limitedContentType: { path: '/fields/testFieldFromNotAllowedContentType' },
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
                contentTypeId: 'limitedContentType',
                type: 'Entry',
                link: {
                  sys: { id: entryIdOfLimitedContentType, type: 'Link', linkType: 'Entry' },
                },
              },
              passToNodes: [
                {
                  nodeId: 'nested-pattern-node-id-1',
                  parameterId: 'nestedPatternNativeParameterId',
                  prebindingId: 'nested-pattern-prebinding-id',
                },
              ],
              contentTypes: ['allowedContentType'],
            },
            hoistedParameterId2: {
              defaultSource: {
                contentTypeId: 'allowedContentType',
                type: 'Entry',
                link: {
                  sys: { id: entryIdOfAllowedContentType, type: 'Link', linkType: 'Entry' },
                },
              },
              passToNodes: [
                {
                  nodeId: 'nested-pattern-node-id-2',
                  parameterId: 'nestedPatternNativeParameterId',
                  prebindingId: 'nested-pattern-prebinding-id',
                },
              ],
              contentTypes: ['allowedContentType'],
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
      entitiesOverrides: [
        createEntry(entryIdOfAllowedContentType, {
          sys: {
            contentType: {
              sys: {
                id: 'allowedContentType',
                type: 'Link',
                linkType: 'ContentType',
              },
            },
          },
        }),
        createEntry(entryIdOfLimitedContentType, {
          sys: {
            contentType: {
              sys: {
                id: 'limitedContentType',
                type: 'Link',
                linkType: 'ContentType',
              },
            },
          },
        }),
      ],
      usedComponentsOverrides: [
        createAssemblyEntry({
          id: 'nested-pattern-entry-id',
          prebindingDefinitions: nestedPatternPrebindingDefinitions,
        }),
      ],
      dataSourceOverrides: {
        [entryIdOfAllowedContentType]: {
          sys: {
            id: entryIdOfAllowedContentType,
            type: 'Link',
            linkType: 'Entry',
          },
        },
        [entryIdOfLimitedContentType]: {
          sys: {
            id: entryIdOfLimitedContentType,
            type: 'Link',
            linkType: 'Entry',
          },
        },
      },
    });

    const result = resolveMaybePrebindingDefaultValuePath({
      componentValueKey: 'testKey',
      entityStore: localEntityStore,
      patternRootNodeIdsChain: ['parent-pattern-node-id', 'nested-pattern-node-id-1'],
    });

    expect(result).toBe(undefined);

    const result2 = resolveMaybePrebindingDefaultValuePath({
      componentValueKey: 'testKey',
      entityStore: localEntityStore,
      patternRootNodeIdsChain: ['parent-pattern-node-id', 'nested-pattern-node-id-2'],
    });

    expect(result2).toBe(`/${entryIdOfAllowedContentType}/fields/testFieldFromAllowedContentType`);

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
