type NodeWithChildren<T> = {
  children: T[];
};

export function treeVisit<T extends NodeWithChildren<T>>(
  initialNode: T,
  onNode: (node: T, index: number, depth: number) => void,
) {
  // returns last used index
  const _treeVisit = (currentNode: T, currentIndex: number, currentDepth: number): number => {
    // Copy children in case of onNode removing it as we pass the node by reference
    const children = [...currentNode.children];
    onNode(currentNode, currentIndex, currentDepth);
    let nextAvailableIndex = currentIndex + 1;
    const lastUsedIndex = currentIndex;
    for (const child of children) {
      const lastUsedIndex = _treeVisit(child, nextAvailableIndex, currentDepth + 1);
      nextAvailableIndex = lastUsedIndex + 1;
    }
    return lastUsedIndex;
  };
  _treeVisit(initialNode, 0, 0);
}

/**
 * Traverses all nodes of a tree and maps all of them.
 * Intuitively works similarly to Array.map().
 * When returning mapped object from the mapper function
 * you _do not_ need to return about `.children[]` field.
 * This field is automatically managed by the treeMap() function.
 *
 * You can map each node to whatever you want, but shouldn't
 * modify the structure of the tree from the mapping function.
 */
export function treeMap<T extends NodeWithChildren<T>, U>(
  node: T,
  onNode: (node: T) => Omit<U, 'children'>,
): U {
  // Copy children in case of onNode removing it as we pass the node by reference
  const children = [...node.children];
  const newNode = {
    ...onNode(node),
    children: children.map((child) => treeMap(child, onNode)),
  } as U;

  return newNode;
}
