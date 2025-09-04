import { ROOT_ID } from '@/types/constants';
import { ASSEMBLY_NODE_TYPE } from '@contentful/experiences-core/constants';
import {
  DesignValue,
  ExperienceTreeNode,
  ResolveDesignValueType,
} from '@contentful/experiences-core/types';

export const checkIsNodeVisible = (
  node: ExperienceTreeNode,
  resolveDesignValue: ResolveDesignValueType,
): boolean => {
  if (node.type === ASSEMBLY_NODE_TYPE || node.type === ROOT_ID) {
    // If this is a wrapping pattern/root with no visible children, it is invisible as well
    return node.children.some((childNode) => checkIsNodeVisible(childNode, resolveDesignValue));
  }

  // Check if the current node is visible (`cfVisibility` is enforced on all nodes)
  return !!resolveDesignValue((node.data.props['cfVisibility'] as DesignValue).valuesByBreakpoint);
};
