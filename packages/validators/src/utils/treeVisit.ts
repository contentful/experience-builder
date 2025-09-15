type NodeWithChildren<T> = {
  children: T[];
};

export function treeVisit<T extends NodeWithChildren<T>>(
  initialNode: T | T[],
  onNode: (node: T) => void,
) {
  const _treeVisit = (currentNode: T): void => {
    const children = [...currentNode.children];
    onNode(currentNode);
    for (const child of children) {
      _treeVisit(child);
    }
  };
  if (Array.isArray(initialNode)) {
    for (const node of initialNode) {
      _treeVisit(node);
    }
  } else {
    _treeVisit(initialNode);
  }
}
