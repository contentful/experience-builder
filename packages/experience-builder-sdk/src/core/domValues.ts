type Rect = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export const findOutermostCoordinates = (first: Rect, second: Rect) => {
  return {
    top: Math.min(first.top, second.top),
    right: Math.max(first.right, second.right),
    bottom: Math.max(first.bottom, second.bottom),
    left: Math.min(first.left, second.left),
  };
};

export const getElementCoordinates = (element: Element): DOMRect => {
  const rect = element.getBoundingClientRect();

  /**
   * If element does not have children, or element has it's own width or height,
   * return the element's coordinates.
   */
  if (element.children.length === 0 || rect.width !== 0 || rect.height !== 0) {
    return rect;
  }

  const rects: Rect[] = [];

  /**
   * If element has children, or element does not have it's own width and height,
   * we find the cordinates of the children, and assume the outermost coordinates of the children
   * as the coordinate of the element.
   *
   * E.g child1 => {top: 2, bottom: 3, left: 4, right: 6} & child2 => {top: 1, bottom: 8, left: 12, right: 24}
   * The final assumed coordinates of the element would be => { top: 1, right: 24, bottom: 8, left: 4 }
   */
  for (const child of element.children) {
    const childRect = getElementCoordinates(child);
    if (childRect.width !== 0 || childRect.height !== 0) {
      const { top, right, bottom, left } = childRect;
      rects.push({ top, right, bottom, left });
    }
  }

  if (rects.length === 0) {
    return rect;
  }

  const { top, right, bottom, left } = rects.reduce(findOutermostCoordinates);

  return DOMRect.fromRect({
    x: left,
    y: top,
    height: bottom - top,
    width: right - left,
  });
};
