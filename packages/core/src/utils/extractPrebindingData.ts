import {
  ComponentTreeNode,
  ExperienceComponentSettings,
  ExperienceDataSource,
  ExperienceEntry,
  Parameter,
  ParameterDefinition,
  VariableMapping,
} from '@/types';
import { treeVisit } from './treeTraversal';
import { generateRandomId } from './utils';
import { isLink } from './isLink';

export type PrebindingData = {
  prebindingDefinitionId: string;
  parameterIds: Array<string>;
  nativeParameterId?: string;
  parameterDefinitions: Record<string, ParameterDefinition>;
  variableMappings?: Record<string, VariableMapping>;
};

export const flattenNestedPatterns = (fetchedPatterns: Array<ExperienceEntry>) => {
  const patternsById: Record<string, ExperienceEntry> = {};

  const queue = [...fetchedPatterns];

  while (queue.length) {
    const pattern = queue.shift();

    if (!pattern) {
      continue;
    }

    if (patternsById[pattern.sys.id]) {
      continue;
    }

    patternsById[pattern.sys.id] = pattern;

    if (!Array.isArray(pattern.fields.usedComponents) || !pattern.fields.usedComponents.length) {
      continue;
    }

    for (const nestedPattern of pattern.fields.usedComponents) {
      if (!isLink(nestedPattern)) {
        queue.push(nestedPattern);
      }
    }
  }
  return Object.values(patternsById);
};

/**
 * Given a list of patterns, extract the prebinding data into a more digestable format indexed by the pattern entry id
 * @param patterns a list of pattern entries
 * @returns a map of pattern entry ids to their prebinding data
 */
export const extractPrebindingDataByPatternId = (patterns: Array<ExperienceEntry>) => {
  const prebindingDataByPatternId: Record<string, PrebindingData> = {};

  const iteratedPatternIds: Array<string> = [];
  const queue: Array<ExperienceEntry> = [...patterns];

  for (const pattern of queue) {
    if (iteratedPatternIds.includes(pattern.sys.id)) {
      continue;
    } else {
      iteratedPatternIds.push(pattern.sys.id);
    }

    if (pattern.fields.usedComponents) {
      for (const maybeFetchedNestedPattern of pattern.fields.usedComponents) {
        if (isLink(maybeFetchedNestedPattern)) {
          throw new Error('Nested pattern is not fully fetched');
        } else {
          queue.push(maybeFetchedNestedPattern);
        }
      }
    }

    const patternId = pattern.sys.id;
    const [prebindingDefinition] = pattern.fields.componentSettings?.prebindingDefinitions ?? [];
    if (!prebindingDefinition) continue;

    const [nativeParameterId] =
      Object.entries(prebindingDefinition.parameterDefinitions ?? {}).find(
        ([, value]) => value.passToNodes === undefined,
      ) ?? [];

    const prebindingData: PrebindingData = {
      prebindingDefinitionId: prebindingDefinition.id,
      parameterIds: Object.keys(prebindingDefinition.parameterDefinitions),
      nativeParameterId,
      parameterDefinitions: prebindingDefinition.parameterDefinitions,
      variableMappings: prebindingDefinition.variableMappings,
    };

    prebindingDataByPatternId[patternId] = prebindingData;
  }

  return prebindingDataByPatternId;
};

export const generateDefaultDataSourceForPrebindingDefinition = (
  prebindingDefinitions: ExperienceComponentSettings['prebindingDefinitions'] = [],
) => {
  if (
    !prebindingDefinitions ||
    !Array.isArray(prebindingDefinitions) ||
    !prebindingDefinitions.length
  ) {
    return { dataSource: {}, parameters: {} };
  }

  const prebindingDefinition = prebindingDefinitions[0];

  const dataSource: ExperienceDataSource = {};
  const parameters: Record<string, Parameter> = {};

  for (const [parameterId, parameterDefinition] of Object.entries(
    prebindingDefinition.parameterDefinitions ?? {},
  )) {
    if (parameterDefinition.defaultSource && isLink(parameterDefinition.defaultSource.link)) {
      const dataSourceKey = generateRandomId(7);
      dataSource[dataSourceKey] = parameterDefinition.defaultSource.link;
      parameters[parameterId] = {
        type: 'BoundValue',
        path: `/${dataSourceKey}`,
      };
    }
  }
  return {
    dataSource,
    parameters,
  };
};

export function getTargetPatternMappingsForParameter({
  fetchedPatterns,
  prebindingDataByPatternId,
  patternNodeDefinitionId,
  parameterId,
}: {
  fetchedPatterns: Array<ExperienceEntry>;
  prebindingDataByPatternId: Record<string, PrebindingData>;
  patternNodeDefinitionId: string;
  parameterId: string;
}) {
  const patternPrebindingData = prebindingDataByPatternId[patternNodeDefinitionId];

  if (!patternPrebindingData) return undefined;
  if (patternPrebindingData.parameterIds.includes(parameterId)) {
    if (patternPrebindingData.nativeParameterId === parameterId) {
      if (!patternPrebindingData.variableMappings) return undefined;
      return Object.fromEntries(
        Object.entries(patternPrebindingData.variableMappings).filter(
          ([, mapping]) => mapping.parameterId === parameterId,
        ),
      );
    } else {
      const parameterDefinition = patternPrebindingData.parameterDefinitions[parameterId];
      if (!parameterDefinition || !parameterDefinition.passToNodes) return undefined;

      const patternEntry = fetchedPatterns.find(
        (entry) => entry.sys.id === patternNodeDefinitionId,
      );
      if (!patternEntry) return undefined;

      let nestedPatternNode: ComponentTreeNode | undefined;

      treeVisit(
        {
          definitionId: 'root',
          parameters: {},
          children: patternEntry.fields.componentTree.children,
        } as ComponentTreeNode,
        (node) => {
          if (node.id === parameterDefinition.passToNodes?.[0].nodeId) {
            nestedPatternNode = node;
          }

          return undefined;
        },
      );

      if (!nestedPatternNode) {
        return undefined;
      }

      return getTargetPatternMappingsForParameter({
        fetchedPatterns,
        prebindingDataByPatternId,
        patternNodeDefinitionId: nestedPatternNode.definitionId,
        parameterId: parameterDefinition.passToNodes?.[0].parameterId,
      });
    }
  }
}
