import { ExperienceComponentSettings } from '@/types';
import {
  extractPrebindingDataByPatternId,
  generateDefaultDataSourceForPrebindingDefinition,
  getTargetPatternMappingsForParameter,
} from './extractPrebindingData';
import { createPatternEntry } from '@/test/__fixtures__/experience';
import { cloneDeep } from 'lodash-es';

type PrebindingDefinition = NonNullable<ExperienceComponentSettings['prebindingDefinitions']>[0];

const parameterIds = {
  l1NativeParamId: 'nativeParameterId',
  l2HoistedParamId: 'hoistedParameterId',
  l2NativeParamId: 'nonHoistedParameterId',
};

const prebindingDefinitionWithoutDefaultSource: PrebindingDefinition = {
  id: 'no-default-source-prebinding-definition',
  parameterDefinitions: {
    [parameterIds.l1NativeParamId]: {
      contentTypes: ['ct1', 'ct2'],
    },
  },
  variableMappings: {
    var1: {
      type: 'ContentTypeMapping',
      parameterId: parameterIds.l1NativeParamId,
      pathsByContentType: {
        ct1: {
          path: '/fields/title',
        },
        ct2: {
          path: '/fields/description',
        },
      },
    },
  },
};

const nativeOnlyPrebindingDefinition: PrebindingDefinition = {
  id: 'native-only-prebinding-definition-id',
  parameterDefinitions: {
    [parameterIds.l1NativeParamId]: {
      contentTypes: ['ct1', 'ct2'],
      defaultSource: {
        type: 'Entry',
        contentTypeId: 'ct1',
        link: {
          sys: {
            id: 'entry-id',
            linkType: 'Entry',
            type: 'Link',
          },
        },
      },
    },
  },
  variableMappings: {
    var1: {
      type: 'ContentTypeMapping',
      parameterId: parameterIds.l1NativeParamId,
      pathsByContentType: {
        ct1: {
          path: '/fields/title',
        },
        ct2: {
          path: '/fields/description',
        },
      },
    },
  },
};

const hoistedOnlyPrebindingDefinition: PrebindingDefinition = {
  id: 'hoisted-only-prebinding-definition-id',
  parameterDefinitions: {
    [parameterIds.l2HoistedParamId]: {
      ...nativeOnlyPrebindingDefinition.parameterDefinitions[parameterIds.l1NativeParamId],
      passToNodes: [
        {
          nodeId: 'nested-pattern-node-id', // (1)
          parameterId: parameterIds.l1NativeParamId,
          prebindingId: nativeOnlyPrebindingDefinition.id,
        },
      ],
    },
  },
};

const nativeAndHoistedPrebindingDefinition: PrebindingDefinition = {
  id: 'native-and-hoisted-prebinding-definition-id',
  parameterDefinitions: {
    [parameterIds.l2NativeParamId]: {
      contentTypes: ['ct1', 'ct2'],
      defaultSource: {
        type: 'Entry',
        contentTypeId: 'ct1',
        link: {
          sys: {
            id: 'entry-id',
            linkType: 'Entry',
            type: 'Link',
          },
        },
      },
    },
    [parameterIds.l2HoistedParamId]: {
      ...hoistedOnlyPrebindingDefinition.parameterDefinitions[parameterIds.l2HoistedParamId],
    },
  },
  variableMappings: {
    var1: {
      type: 'ContentTypeMapping',
      parameterId: parameterIds.l2NativeParamId,
      pathsByContentType: {
        ct1: {
          path: '/fields/title',
        },
        ct2: {
          path: '/fields/description',
        },
      },
    },
  },
};

const fixtures = {
  patternWithoutPrebinding: createPatternEntry({
    id: 'patternWithoutPrebinding',
  }),
  patternWithNativePrebinding: createPatternEntry({
    id: 'patternWithNativePrebinding',
    prebindingDefinitions: [nativeOnlyPrebindingDefinition],
  }),
  patternWithHoistedPrebinding: createPatternEntry({
    id: 'patternWithHoistedPrebinding',
    prebindingDefinitions: [hoistedOnlyPrebindingDefinition],
    componentTreeChildren: [
      {
        definitionId: 'patternWithNativePrebinding',
        id: 'nested-pattern-node-id', // (1)
        variables: {},
        children: [],
      },
    ],
  }),
  patternWithNativeAndHoistedPrebinding: createPatternEntry({
    id: 'patternWithNativeAndHoistedPrebinding',
    prebindingDefinitions: [nativeAndHoistedPrebindingDefinition],
    componentTreeChildren: [
      {
        definitionId: 'patternWithNativePrebinding',
        id: 'nested-pattern-node-id', // (1)
        variables: {},
        children: [],
      },
    ],
  }),
};

describe('extractPrebindingDataByPatternId', () => {
  it('should return nothing if nothing has been provided', () => {
    expect(extractPrebindingDataByPatternId([])).toEqual({});
  });

  it('should return empty prebinding data for a pattern without defined prebinding', () => {
    expect(extractPrebindingDataByPatternId([fixtures.patternWithoutPrebinding])).toEqual({});
  });

  it('should return the prebinding data for a pattern with defined native prebinding', () => {
    expect(extractPrebindingDataByPatternId([fixtures.patternWithNativePrebinding])).toEqual({
      patternWithNativePrebinding: {
        prebindingDefinitionId: nativeOnlyPrebindingDefinition.id,
        parameterIds: [parameterIds.l1NativeParamId],
        nativeParameterId: parameterIds.l1NativeParamId,
        parameterDefinitions: nativeOnlyPrebindingDefinition.parameterDefinitions,
        variableMappings: nativeOnlyPrebindingDefinition.variableMappings,
      },
    });
  });

  it('should return the prebinding data for a pattern with only hoisted prebinding', () => {
    expect(extractPrebindingDataByPatternId([fixtures.patternWithHoistedPrebinding])).toEqual({
      patternWithHoistedPrebinding: {
        prebindingDefinitionId: hoistedOnlyPrebindingDefinition.id,
        parameterIds: [parameterIds.l2HoistedParamId],
        nativeParameterId: undefined,
        parameterDefinitions: hoistedOnlyPrebindingDefinition.parameterDefinitions,
        variableMappings: hoistedOnlyPrebindingDefinition.variableMappings,
      },
    });
  });

  it('should return the prebinding data for a pattern with a mix of native and hoisted prebinding', () => {
    expect(
      extractPrebindingDataByPatternId([fixtures.patternWithNativeAndHoistedPrebinding]),
    ).toEqual({
      patternWithNativeAndHoistedPrebinding: {
        prebindingDefinitionId: nativeAndHoistedPrebindingDefinition.id,
        parameterIds: [parameterIds.l2NativeParamId, parameterIds.l2HoistedParamId],
        nativeParameterId: parameterIds.l2NativeParamId,
        parameterDefinitions: nativeAndHoistedPrebindingDefinition.parameterDefinitions,
        variableMappings: nativeAndHoistedPrebindingDefinition.variableMappings,
      },
    });

    expect(
      extractPrebindingDataByPatternId([fixtures.patternWithNativeAndHoistedPrebinding]),
    ).toEqual({
      patternWithNativeAndHoistedPrebinding: {
        prebindingDefinitionId: nativeAndHoistedPrebindingDefinition.id,
        parameterIds: [parameterIds.l2NativeParamId, parameterIds.l2HoistedParamId],
        nativeParameterId: parameterIds.l2NativeParamId,
        parameterDefinitions: nativeAndHoistedPrebindingDefinition.parameterDefinitions,
        variableMappings: nativeAndHoistedPrebindingDefinition.variableMappings,
      },
    });
  });
});

describe('generateDefaultDataSourceForPrebindingDefinition', () => {
  it('should return empty objects if argument is undefined', () => {
    const { dataSource, parameters } = generateDefaultDataSourceForPrebindingDefinition(undefined);
    expect(dataSource).toEqual({});
    expect(parameters).toEqual({});
  });

  it('should skip parameter definitions without a defaultSource', () => {
    const { dataSource, parameters } = generateDefaultDataSourceForPrebindingDefinition([
      prebindingDefinitionWithoutDefaultSource,
    ]);
    expect(dataSource).toEqual({});
    expect(parameters).toEqual({});
  });

  it('should generate a parameter if defaultSource is defined', () => {
    const { dataSource, parameters } = generateDefaultDataSourceForPrebindingDefinition([
      nativeOnlyPrebindingDefinition,
    ]);
    expect(parameters).toEqual({
      [parameterIds.l1NativeParamId]: {
        type: 'BoundValue',
        path: expect.any(String),
      },
    });

    const dataSourceKey = parameters[parameterIds.l1NativeParamId].path.split('/').pop();
    expect(dataSourceKey).toBeDefined();
    expect(dataSource[dataSourceKey!]).toEqual(
      nativeOnlyPrebindingDefinition.parameterDefinitions[parameterIds.l1NativeParamId]
        .defaultSource?.link,
    );
  });
});

describe('getTargetPatternMappingsForParameter', () => {
  it('should return nothing for patterns without prebinding', () => {
    expect(
      getTargetPatternMappingsForParameter({
        fetchedPatterns: [],
        prebindingDataByPatternId: {},
        patternNodeDefinitionId: fixtures.patternWithNativePrebinding.sys.id,
        parameterId: 'test-parameter-id',
      }),
    ).toBe(undefined);
  });

  it('should return nothing if the requested parameter id is not recognized', () => {
    expect(
      getTargetPatternMappingsForParameter({
        fetchedPatterns: [],
        prebindingDataByPatternId: extractPrebindingDataByPatternId([
          fixtures.patternWithNativePrebinding,
        ]),
        patternNodeDefinitionId: fixtures.patternWithNativePrebinding.sys.id,
        parameterId: 'nonExistentParameterId',
      }),
    ).toBe(undefined);
  });

  it('should return the variableMappings for a recognized parameter id if its from the patterns native prebinding', () => {
    expect(
      getTargetPatternMappingsForParameter({
        fetchedPatterns: [],
        prebindingDataByPatternId: extractPrebindingDataByPatternId([
          fixtures.patternWithNativePrebinding,
        ]),
        patternNodeDefinitionId: fixtures.patternWithNativePrebinding.sys.id,
        parameterId: parameterIds.l1NativeParamId,
      }),
    ).toEqual(
      fixtures.patternWithNativePrebinding.fields.componentSettings?.prebindingDefinitions?.[0]
        .variableMappings,
    );
  });

  it('should return the variableMappings for a recognized parameter id if its from the patterns native prebinding when given a pattern that has a mix of both', () => {
    expect(
      getTargetPatternMappingsForParameter({
        fetchedPatterns: [],
        prebindingDataByPatternId: extractPrebindingDataByPatternId([
          fixtures.patternWithNativeAndHoistedPrebinding,
        ]),
        patternNodeDefinitionId: fixtures.patternWithNativeAndHoistedPrebinding.sys.id,
        parameterId: parameterIds.l2NativeParamId,
      }),
    ).toEqual(
      fixtures.patternWithNativeAndHoistedPrebinding.fields.componentSettings
        ?.prebindingDefinitions?.[0].variableMappings,
    );

    expect(
      getTargetPatternMappingsForParameter({
        fetchedPatterns: [],
        prebindingDataByPatternId: extractPrebindingDataByPatternId([
          fixtures.patternWithNativeAndHoistedPrebinding,
        ]),
        patternNodeDefinitionId: fixtures.patternWithNativeAndHoistedPrebinding.sys.id,
        parameterId: parameterIds.l2HoistedParamId,
      }),
    ).toBe(undefined);
  });

  it('should drill down through the hoisting chain and return the variableMappings for a recognized hoisted parameter id', () => {
    expect(
      getTargetPatternMappingsForParameter({
        fetchedPatterns: [
          fixtures.patternWithNativeAndHoistedPrebinding,
          fixtures.patternWithHoistedPrebinding,
        ],
        prebindingDataByPatternId: extractPrebindingDataByPatternId([
          fixtures.patternWithNativeAndHoistedPrebinding,
          fixtures.patternWithNativePrebinding,
        ]),
        patternNodeDefinitionId: fixtures.patternWithNativeAndHoistedPrebinding.sys.id,
        parameterId: parameterIds.l2HoistedParamId,
      }),
    ).toEqual(
      fixtures.patternWithNativePrebinding.fields.componentSettings?.prebindingDefinitions?.[0]
        .variableMappings,
    );
  });

  it('should drill down and returning nothing if it failed to find the mapping for the given hoisted parameter id', () => {
    const patternWithMixedPrebinding = cloneDeep(fixtures.patternWithNativeAndHoistedPrebinding);
    Object.assign(
      // @ts-expect-error a dirty way to inject another paramter without creating a separate fixture entry
      patternWithMixedPrebinding.fields.componentSettings.prebindingDefinitions[0]
        .parameterDefinitions ?? {},
      {
        hoistedOrphanedParameterId: {
          contentTypes: ['ct3', 'ct4'],
          passToNodes: [
            {
              nodeId: 'nested-pattern-node-id',
              parameterId: 'orphanedParameterId',
            },
          ],
        },
      },
    );

    expect(
      getTargetPatternMappingsForParameter({
        fetchedPatterns: [patternWithMixedPrebinding, fixtures.patternWithHoistedPrebinding],
        prebindingDataByPatternId: extractPrebindingDataByPatternId([
          patternWithMixedPrebinding,
          fixtures.patternWithNativePrebinding,
        ]),
        patternNodeDefinitionId: patternWithMixedPrebinding.sys.id,
        parameterId: 'hoistedOrphanedParameterId',
      }),
    ).toBe(undefined);
  });
});
