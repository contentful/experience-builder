import { ComponentRegistration, ComponentTreeNode, ExperienceTreeNode } from '@/types';

export const splitDirectAndSlotChildren = <T extends ExperienceTreeNode | ComponentTreeNode>(
  allChildNodes: T[],
  componentDefinition: ComponentRegistration['definition'],
) => {
  // Bridge difference between editor and delivery mode
  const getSlotId = (child: T) => {
    if ('data' in child) return child.data.slotId;
    return child.slotId;
  };
  const slotNodesMap: Record<string, T[] | null> = {};
  for (const slotId in componentDefinition.slots) {
    // We only allow one component per slot (container). This is just safer to not render components twice or not at all
    const nodes = allChildNodes.filter((child) => getSlotId(child) === slotId);
    slotNodesMap[slotId] = nodes.length ? nodes : null;
  }
  const directChildNodes = allChildNodes.filter((child) => getSlotId(child) === undefined);
  if (!componentDefinition.children || !directChildNodes.length) {
    // If there are no children allowed in the component or no children added, render as undefined
    return { slotNodesMap, directChildNodes: undefined };
  }
  return { slotNodesMap, directChildNodes };
};
