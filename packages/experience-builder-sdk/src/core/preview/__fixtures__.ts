import { ExperienceComponentSettings } from '@contentful/experiences-validators';

type PrebindingDefinitions = NonNullable<ExperienceComponentSettings['prebindingDefinitions']>;

// ========================================================
// LEVEL 1: ROOT PATTERN
// ========================================================
const l1RootParameterDefinitions: PrebindingDefinitions = [
  {
    id: 'tPmyg4J0b2nYoWkcCqa3l',
    parameterDefinitions: {
      cbMB9C7zxJo: {
        defaultSource: {
          type: 'Entry',
          contentTypeId: 'productTopic',
          link: {
            sys: {
              id: '7MWzuTs1m9T7b18D6cKtAv',
              linkType: 'Entry',
              type: 'Link',
            },
          },
        },
        passToNodes: [],
        contentTypes: ['productTopic', 'hero', 'song'],
      },
    },
    variableMappings: {
      zAPCR7q: {
        parameterId: 'cbMB9C7zxJo',
        type: 'ContentTypeMapping',
        pathsByContentType: {
          productTopic: { path: '/fields/name/~locale' },
          hero: { path: '/fields/headline/~locale' },
          song: { path: '/fields/title/~locale' },
        },
      },
      TXJI2uO: {
        parameterId: 'cbMB9C7zxJo',
        type: 'ContentTypeMapping',
        pathsByContentType: {
          productTopic: { path: '/fields/featureImage/~locale/fields/file/~locale' },
          hero: { path: '/fields/background/~locale/fields/file/~locale' },
          song: { path: '/fields/thumbnail/~locale/fields/file/~locale' },
        },
      },
      gn4bw_n: {
        parameterId: 'cbMB9C7zxJo',
        type: 'ContentTypeMapping',
        pathsByContentType: {
          productTopic: { path: '/fields/description/~locale' },
          hero: { path: '/fields/summary/~locale' },
          song: { path: '/fields/title/~locale' },
        },
      },
    },
    allowedVariableOverrides: [],
  },
];

const l1RootPrebindingPatternDefinitionId = l1RootParameterDefinitions[0].id;
const l1RootPrebindingPatternParameterId = Object.keys(
  l1RootParameterDefinitions[0].parameterDefinitions,
)[0];

export const l1 = {
  id: l1RootPrebindingPatternDefinitionId,
  nodeId: 'root',
  parameterId: l1RootPrebindingPatternParameterId,
  prebindingDefinitions: l1RootParameterDefinitions,
  contentTypes:
    l1RootParameterDefinitions[0].parameterDefinitions[l1RootPrebindingPatternParameterId]
      .contentTypes,
  defaultSource:
    l1RootParameterDefinitions[0].parameterDefinitions[l1RootPrebindingPatternParameterId]
      .defaultSource,
};

// ========================================================
// LEVEL 2: ROOT PATTERN (NESTS 2x LEVEL 1s)
// ========================================================
const l2ParameterId = 'n8tMJT-jBES';
const l2ParameterIdForL1Dropped1 = 'sOeTT4v9';
const l2PatternNodeIdForL1Dropped1 = 'e06VaqwP';
const l2ParameterIdForL1Dropped2 = '1GKImUy7';
const l2PatternNodeIdForL1Dropped2 = 'sgp1NdRI';

const l2RootParameterDefinitions: PrebindingDefinitions = [
  {
    id: 'xCMP5_rZBK4JdppDgVC5B',
    parameterDefinitions: {
      [l2ParameterIdForL1Dropped1]: {
        contentTypes: ['song', 'hero'],
        passToNodes: [
          {
            nodeId: l2PatternNodeIdForL1Dropped1,
            parameterId: l1.parameterId,
            prebindingId: l1.id,
          },
        ],
      },
      [l2ParameterIdForL1Dropped2]: {
        contentTypes: ['productTopic', 'hero'],
        defaultSource: {
          type: 'Entry',
          contentTypeId: 'productTopic',
          link: {
            sys: {
              id: '7MWzuTs1m9T7b18D6cKtAv',
              linkType: 'Entry',
              type: 'Link',
            },
          },
        },
        passToNodes: [
          {
            nodeId: l2PatternNodeIdForL1Dropped2,
            parameterId: l1.parameterId,
            prebindingId: l1.id,
          },
        ],
      },
      [l2ParameterId]: {
        defaultSource: {
          type: 'Entry',
          contentTypeId: 'battle',
          link: {
            sys: {
              id: '12mgN34TwzxY5RD0kozkQX',
              linkType: 'Entry',
              type: 'Link',
            },
          },
        },
        passToNodes: [],
        contentTypes: ['battle', 'hero'],
      },
    },
    variableMappings: {
      vQ5o1VC: {
        parameterId: l2ParameterId,
        type: 'ContentTypeMapping',
        pathsByContentType: {
          battle: { path: '/fields/title/~locale' },
          hero: { path: '/fields/headline/~locale' },
        },
      },
      dRVEPVF: {
        parameterId: l2ParameterId,
        type: 'ContentTypeMapping',
        pathsByContentType: {
          battle: { path: '/fields/vsText/~locale' },
          hero: { path: '/fields/summary/~locale' },
        },
      },
    },
    allowedVariableOverrides: [],
  },
];

const l2RootPrebindingPatternDefinitionId = l2RootParameterDefinitions[0].id;

export const l2 = {
  id: l2RootPrebindingPatternDefinitionId,
  nodeId: 'root',
  parameterId: l2ParameterId,
  prebindingDefinitions: l2RootParameterDefinitions,
  contentTypes: l2RootParameterDefinitions[0].parameterDefinitions[l2ParameterId].contentTypes,
  defaultSource: l2RootParameterDefinitions[0].parameterDefinitions[l2ParameterId].defaultSource,
};

export const l2_l1_1 = {
  id: l2RootPrebindingPatternDefinitionId,
  nodeId: l2PatternNodeIdForL1Dropped1,
  parameterId: l2ParameterIdForL1Dropped1,
  prebindingDefinitions: l1RootParameterDefinitions,
  contentTypes:
    l2RootParameterDefinitions[0].parameterDefinitions[l2ParameterIdForL1Dropped1].contentTypes,
  defaultSource:
    l2RootParameterDefinitions[0].parameterDefinitions[l2ParameterIdForL1Dropped1].defaultSource,
};

export const l2_l1_2 = {
  id: l2RootPrebindingPatternDefinitionId,
  nodeId: l2PatternNodeIdForL1Dropped2,
  parameterId: l2ParameterIdForL1Dropped2,
  prebindingDefinitions: l1RootParameterDefinitions,
  contentTypes:
    l2RootParameterDefinitions[0].parameterDefinitions[l2ParameterIdForL1Dropped2].contentTypes,
  defaultSource:
    l2RootParameterDefinitions[0].parameterDefinitions[l2ParameterIdForL1Dropped2].defaultSource,
};

// ========================================================
// LEVEL 3: ROOT PATTERN (NESTS 2x L2s, EACH NESTING 2x L1s)
// ========================================================
const l3ParameterId = 'SrF-MH21L2z';
const l3ParameterIdForL2Dropped1 = 'wdMejTGE';
const l3PatternNodeIdForL2Dropped1 = 'Swgqmplk';
const l3ParameterIdForL2Dropped2 = 'iYlZbB2o';
const l3PatternNodeIdForL2Dropped2 = '7fmi5X1G';

const l3ParameterIdForL1Dropped1FromL2Dropped1 = 'X3JUxMRJ';
const l3ParameterIdForL1Dropped1FromL2Dropped2 = '9p8GYy8h';
const l3ParameterIdForL1Dropped2FromL2Dropped1 = 'jQ8VEhNj';
const l3ParameterIdForL1Dropped2FromL2Dropped2 = 'EkkKGvtE';

const l3ParameterDefinitions: PrebindingDefinitions = [
  {
    id: 'f8CG59rw4biXjCnTl-XxV',
    parameterDefinitions: {
      [l3ParameterIdForL1Dropped1FromL2Dropped1]: {
        contentTypes: ['song'],
        defaultSource: l1.defaultSource,
        passToNodes: [
          {
            nodeId: l3PatternNodeIdForL2Dropped1,
            parameterId: l2ParameterIdForL1Dropped1,
            prebindingId: l2RootPrebindingPatternDefinitionId,
          },
        ],
      },
      [l3ParameterIdForL1Dropped1FromL2Dropped2]: {
        contentTypes: ['hero'],
        defaultSource: l1.defaultSource,
        passToNodes: [
          {
            nodeId: l3PatternNodeIdForL2Dropped2,
            parameterId: l2ParameterIdForL1Dropped1,
            prebindingId: l2RootPrebindingPatternDefinitionId,
          },
        ],
      },
      [l3ParameterIdForL2Dropped1]: {
        contentTypes: ['hero'],
        defaultSource: l2.defaultSource,
        passToNodes: [
          {
            nodeId: l3PatternNodeIdForL2Dropped1,
            parameterId: l2ParameterId,
            prebindingId: l2RootPrebindingPatternDefinitionId,
          },
        ],
      },
      [l3ParameterIdForL2Dropped2]: {
        contentTypes: ['hero'],
        defaultSource: l2.defaultSource,
        passToNodes: [
          {
            nodeId: l3PatternNodeIdForL2Dropped2,
            parameterId: l2ParameterId,
            prebindingId: l2RootPrebindingPatternDefinitionId,
          },
        ],
      },
      [l3ParameterIdForL1Dropped2FromL2Dropped1]: {
        contentTypes: ['productTopic'],
        defaultSource: l1.defaultSource,
        passToNodes: [
          {
            nodeId: l3PatternNodeIdForL2Dropped1,
            parameterId: l2ParameterIdForL1Dropped2,
            prebindingId: l2RootPrebindingPatternDefinitionId,
          },
        ],
      },
      [l3ParameterIdForL1Dropped2FromL2Dropped2]: {
        contentTypes: ['battle'],
        defaultSource: l1.defaultSource,
        passToNodes: [
          {
            nodeId: l3PatternNodeIdForL2Dropped2,
            parameterId: l2ParameterIdForL1Dropped2,
            prebindingId: l2RootPrebindingPatternDefinitionId,
          },
        ],
      },
      [l3ParameterId]: {
        defaultSource: {
          type: 'Entry',
          contentTypeId: 'productFeatureTopic',
          link: {
            sys: {
              id: '66q2yIVCKtb0IDUxSLATOo',
              linkType: 'Entry',
              type: 'Link',
            },
          },
        },
        passToNodes: [],
        contentTypes: ['productFeatureTopic'],
      },
    },
    variableMappings: {
      UITLwfh: {
        parameterId: l3ParameterId,
        type: 'ContentTypeMapping',
        pathsByContentType: {
          productFeatureTopic: { path: '/fields/imageCover/~locale/fields/file/~locale' },
        },
      },
      ['bIVgg-u']: {
        parameterId: l3ParameterId,
        type: 'ContentTypeMapping',
        pathsByContentType: {
          productFeatureTopic: { path: '/fields/internalName/~locale' },
        },
      },
    },
    allowedVariableOverrides: [],
  },
];

const l3RootPrebindingPatternDefinitionId = l3ParameterDefinitions[0].id;

export const l3 = {
  id: l3RootPrebindingPatternDefinitionId,
  nodeId: 'root',
  parameterId: l3ParameterId,
  prebindingDefinitions: l3ParameterDefinitions,
  contentTypes: l3ParameterDefinitions[0].parameterDefinitions[l3ParameterId].contentTypes,
  defaultSource: l3ParameterDefinitions[0].parameterDefinitions[l3ParameterId].defaultSource,
};

// Pattern Node Exports for L3 Nesting L2 (and L1 indirectly)
export const l3_l2_1 = {
  id: l3RootPrebindingPatternDefinitionId,
  nodeId: l3PatternNodeIdForL2Dropped1,
  parameterId: l3ParameterIdForL2Dropped1,
  prebindingDefinitions: l2RootParameterDefinitions,
  contentTypes:
    l3ParameterDefinitions[0].parameterDefinitions[l3ParameterIdForL2Dropped1].contentTypes,
  defaultSource:
    l3ParameterDefinitions[0].parameterDefinitions[l3ParameterIdForL2Dropped1].defaultSource,
};

export const l3_l2_2 = {
  id: l3RootPrebindingPatternDefinitionId,
  nodeId: l3PatternNodeIdForL2Dropped2,
  parameterId: l3ParameterIdForL2Dropped2,
  prebindingDefinitions: l2RootParameterDefinitions,
  contentTypes:
    l3ParameterDefinitions[0].parameterDefinitions[l3ParameterIdForL2Dropped2].contentTypes,
  defaultSource:
    l3ParameterDefinitions[0].parameterDefinitions[l3ParameterIdForL2Dropped2].defaultSource,
};

// Pattern Node Exports for L3 Nesting L2->L1
export const l3_l2_l1_1 = {
  id: l3RootPrebindingPatternDefinitionId,
  nodeId: l3PatternNodeIdForL2Dropped1,
  parameterId: l3ParameterIdForL1Dropped1FromL2Dropped1,
  prebindingDefinitions: l1RootParameterDefinitions,
  contentTypes:
    l3ParameterDefinitions[0].parameterDefinitions[l3ParameterIdForL1Dropped1FromL2Dropped1]
      .contentTypes,
  defaultSource:
    l3ParameterDefinitions[0].parameterDefinitions[l3ParameterIdForL1Dropped1FromL2Dropped1]
      .defaultSource,
};

export const l3_l2_l1_2 = {
  id: l3RootPrebindingPatternDefinitionId,
  nodeId: l3PatternNodeIdForL2Dropped1,
  parameterId: l3ParameterIdForL1Dropped1FromL2Dropped1,
  prebindingDefinitions: l1RootParameterDefinitions,
  contentTypes:
    l3ParameterDefinitions[0].parameterDefinitions[l3ParameterIdForL1Dropped1FromL2Dropped1]
      .contentTypes,
  defaultSource:
    l3ParameterDefinitions[0].parameterDefinitions[l3ParameterIdForL1Dropped1FromL2Dropped1]
      .defaultSource,
};

export const l3_l2_l1_3 = {
  id: l3RootPrebindingPatternDefinitionId,
  nodeId: l3PatternNodeIdForL2Dropped2,
  parameterId: l3ParameterIdForL1Dropped2FromL2Dropped2,
  prebindingDefinitions: l1RootParameterDefinitions,
  contentTypes:
    l3ParameterDefinitions[0].parameterDefinitions[l3ParameterIdForL1Dropped2FromL2Dropped2]
      .contentTypes,
  defaultSource:
    l3ParameterDefinitions[0].parameterDefinitions[l3ParameterIdForL1Dropped2FromL2Dropped2]
      .defaultSource,
};

export const l3_l2_l1_4 = {
  id: l3RootPrebindingPatternDefinitionId,
  nodeId: l3PatternNodeIdForL2Dropped2,
  parameterId: l3ParameterIdForL1Dropped2FromL2Dropped2,
  prebindingDefinitions: l1RootParameterDefinitions,
  contentTypes:
    l3ParameterDefinitions[0].parameterDefinitions[l3ParameterIdForL1Dropped2FromL2Dropped2]
      .contentTypes,
  defaultSource:
    l3ParameterDefinitions[0].parameterDefinitions[l3ParameterIdForL1Dropped2FromL2Dropped2]
      .defaultSource,
};
