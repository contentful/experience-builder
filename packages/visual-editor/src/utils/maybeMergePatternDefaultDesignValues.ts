import { ExperienceTreeNode, DesignValue } from '@contentful/experiences-core/types';
import { ASSEMBLY_BLOCK_NODE_TYPE } from '@contentful/experiences-core/constants';
import { mergeDesignValuesByBreakpoint } from '@contentful/experiences-core';
import { componentRegistry } from '@/store/registries';

/**
 * When node is a pattern block, we need to look up for default values of the pattern variables
 * and merge them with the updated node props.
 * While loop is making sure that we look up for the updated default values in the parent pattern
 * component settings as well.
 */
export const maybeMergePatternDefaultDesignValues = ({
  variableName,
  variableMapping,
  node,
  findNodeById,
}: {
  findNodeById: (nodeId?: string) => ExperienceTreeNode | null;
  variableName: string;
  variableMapping: DesignValue;
  node: ExperienceTreeNode;
}) => {
  if (node.type === ASSEMBLY_BLOCK_NODE_TYPE) {
    const patternId = node.data.pattern?.id;

    const exposedPropertyName = node['exposedPropertyNameToKeyMap'][variableName];
    if (!exposedPropertyName || !patternId) {
      return variableMapping.valuesByBreakpoint;
    }

    const exposedVariableDefinition =
      componentRegistry.get(patternId)?.definition.variables[exposedPropertyName];

    let exposedDefaultValue = exposedVariableDefinition?.defaultValue as DesignValue;
    let parentPatternNode = findNodeById(node.data.pattern?.nodeId);

    while (parentPatternNode) {
      const parentPatternId = parentPatternNode.data.pattern?.id;
      const nextKey = parentPatternNode['exposedPropertyNameToKeyMap'][exposedPropertyName];

      if (!parentPatternId || !nextKey) {
        break;
      }
      const parentPatternVariableDefinition =
        componentRegistry.get(parentPatternId)?.definition.variables[nextKey];

      exposedDefaultValue = mergeDesignValuesByBreakpoint(
        parentPatternVariableDefinition?.defaultValue as DesignValue,
        exposedDefaultValue,
      );
      parentPatternNode = findNodeById(parentPatternNode.data.pattern?.nodeId);
    }

    const mergedDesignValue = mergeDesignValuesByBreakpoint(exposedDefaultValue, variableMapping);
    return mergedDesignValue.valuesByBreakpoint;
  }
  return variableMapping.valuesByBreakpoint;
};
