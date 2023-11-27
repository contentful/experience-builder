import { CompositionComponentNode } from '@contentful/experience-builder-core';
import { Data } from '../types/Config';
import { rootDroppableId } from './root-droppable-id';

export type ItemSelector = {
  id: string;
};

function getItemFromTree(
  id: string,
  node: CompositionComponentNode
): CompositionComponentNode | undefined {
  // Check if the current node's id matches the search id

  if (node.data.id === id) {
    return node;
  }

  // Recursively search through each child
  for (const child of node.children) {
    const foundNode = getItemFromTree(id, child);
    if (foundNode) {
      // Node found in children
      return foundNode;
    }
  }

  // If the node is not found in this branch of the tree, return undefined
  return undefined;
}

export const getItem = (selector: ItemSelector, data: Data): Data['children'][0] | undefined => {
  return getItemFromTree(selector.id, {
    data: {
      id: rootDroppableId,
    },
    children: data.children,
  } as any);

  // console.log('get', data, selector);
  // // if (!selector.zone || selector.zone === rootDroppableId) {
  // const item = data.children[selector.index];
  // return item;
  // return { ...item, props: dynamicProps[item.data.id] || item.props };
  // }
  // console.log('other', data, selector);
  // return item
  // const item = setupZone(data, selector.zone).zones[selector.zone][selector.index];
  // return item;
  // return { ...item, props: dynamicProps[item.data.id] || item.props };
};
