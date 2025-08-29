import { ComponentTreeNode, ExperienceEntry, ParameterDefinition, VariableMapping } from '@/types';
import { treeVisit } from './treeTraversal';

export type PrebindingData = {
  prebindingDefinitionId: string;
  parameterIds: Array<string>;
  nativeParameterId?: string;
  parameterDefinitions: Record<string, ParameterDefinition>;
  variableMappings?: Record<string, VariableMapping>;
};

/**
 * Given a list of patterns, extract the prebinding data into a more digestable format indexed by the pattern entry id
 * @param patterns a list of pattern entries
 * @returns a map of pattern entry ids to their prebinding data
 */
export const extractPrebindingDataByPatternId = (patterns: Array<ExperienceEntry>) => {
  const prebindingDataByPatternId: Record<string, PrebindingData> = {};

  for (const pattern of patterns) {
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

export function getTargetPatternMappingForParameter({
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
  console.log('prebindingDataByPatternId', prebindingDataByPatternId, patternNodeDefinitionId);
  const patternPrebindingData = prebindingDataByPatternId[patternNodeDefinitionId];
  console.log('a', patternPrebindingData);
  if (!patternPrebindingData) return undefined;
  if (patternPrebindingData.parameterIds.includes(parameterId)) {
    console.log('b');
    if (patternPrebindingData.nativeParameterId === parameterId) {
      console.log('c');
      if (!patternPrebindingData.variableMappings) return undefined;
      console.log('d');
      return Object.fromEntries(
        Object.entries(patternPrebindingData.variableMappings).filter(
          ([, mapping]) => mapping.parameterId === parameterId,
        ),
      );
    } else {
      console.log('e');
      const parameterDefinition = patternPrebindingData.parameterDefinitions[parameterId];
      if (!parameterDefinition || !parameterDefinition.passToNodes) return undefined;

      console.log('f', fetchedPatterns);

      const patternEntry = fetchedPatterns[patternNodeDefinitionId];
      if (!patternEntry) return undefined;
      console.log('g');

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
      console.log('h');

      return getTargetPatternMappingForParameter({
        fetchedPatterns,
        prebindingDataByPatternId,
        patternNodeDefinitionId: nestedPatternNode.definitionId,
        parameterId: parameterDefinition.passToNodes?.[0].parameterId,
      });
    }
  }
}
